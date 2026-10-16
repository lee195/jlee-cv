<template>
  <Teleport to="body">
    <div v-if="isOpen" class="term-overlay no-print" @click.self="close">
      <div
        class="term"
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        @keydown.esc.prevent="close"
      >
        <div class="term-bar">
          <span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="term-title">guest@jlee-cv: ~</span>
          <button type="button" class="term-close" aria-label="Close terminal" @click="close">×</button>
        </div>

        <div ref="screen" class="term-screen" @click="focusInput">
          <div class="term-output" aria-live="polite">
            <div v-for="(line, i) in lines" :key="i" class="term-line" :class="line.type">
              <template v-if="line.type === 'in'"><span class="prompt" aria-hidden="true">$</span> {{ line.text }}</template>
              <template v-else>{{ line.text }}</template>
            </div>
          </div>

          <div class="term-input-row">
            <span class="prompt" aria-hidden="true">$</span>
            <input
              ref="input"
              v-model="draft"
              class="term-input"
              type="text"
              spellcheck="false"
              autocomplete="off"
              autocapitalize="off"
              aria-label="Type a command. Type help for a list."
              @keydown.enter.prevent="submit"
              @keydown.up.prevent="historyStep(-1)"
              @keydown.down.prevent="historyStep(1)"
              @keydown.tab.prevent="complete"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { cvData } from '~/data/cvData'
import { canPlayTetris } from '~/composables/useTetrisTrigger'

const emit = defineEmits<{ 'open-contact': [] }>()

type Line = { type: 'in' | 'out' | 'err' | 'ok'; text: string }

const isOpen = ref(false)
const draft = ref('')
const lines = ref<Line[]>([])
const input = ref<HTMLInputElement | null>(null)
const screen = ref<HTMLElement | null>(null)
const history: string[] = []
let historyIndex = 0
let returnFocus: HTMLElement | null = null
let flagSolved = false

// sha256 of the flag, so the answer isn't sitting in the bundle in plain text
const FLAG_HASH = 'cde5416b1b88815ed7543fed04563691217c174d3d7ee53be86f35f80e356988'

const SECTIONS = ['about', 'experience', 'projects', 'education', 'languages']
const slug = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').trim().replace(/\s+/g, '-')
const projects = Object.fromEntries(cvData.projects.map(p => [slug(p.title), p]))

const COMMANDS: Record<string, { help: string; run: (args: string[]) => void | Promise<void> }> = {
  help: {
    help: 'list commands',
    run: () => {
      for (const [name, c] of Object.entries(COMMANDS)) {
        if (!c.help.startsWith('_')) print(`  ${name.padEnd(9)} ${c.help}`)
      }
    },
  },
  whoami: {
    help: 'who is this person',
    run: () => {
      const p = cvData.personal
      print(`${p.name}, ${p.title}`)
      print(p.location)
      print(p.bio)
    },
  },
  ls: {
    help: 'ls [projects | experience]',
    run: ([what]) => {
      if (!what) return print(SECTIONS.join('   '))
      if (what.startsWith('proj')) return print(Object.keys(projects).join('   '))
      if (what.startsWith('exp')) {
        for (const e of cvData.experiences) print(`${e.period.padEnd(15)} ${e.role}`)
        return
      }
      err(`ls: ${what}: no such directory`)
    },
  },
  cat: {
    help: 'cat <project | experience | languages>',
    run: ([what]) => {
      if (!what) return err('cat: which file? try: cat ' + Object.keys(projects)[0])
      const proj = projects[slug(what)]
      if (proj) {
        print(`${proj.title} (${proj.category})`)
        print(proj.description)
        proj.highlights.forEach(h => print(`  - ${h}`))
        print(`  ${proj.technologies.join(', ')}`)
        if (proj.github) print(`  ${proj.github}`)
        if (proj.showcase) print(`  → open ${slug(proj.title)}`)
        return
      }
      if (what.startsWith('exp')) {
        for (const e of cvData.experiences) {
          print(`${e.role} @ ${e.company} (${e.period})`)
          e.highlights.forEach(h => print(`  - ${h}`))
        }
        return
      }
      if (what.startsWith('lang')) {
        cvData.languages.forEach(l => print(`${l.name.padEnd(8)} ${'█'.repeat(l.proficiency / 10).padEnd(10, '░')} ${l.fluency}`))
        return
      }
      err(`cat: ${what}: no such file`)
    },
  },
  open: {
    help: 'open <project>   project case study',
    run: ([what]) => {
      if (!what) return err('open: which project? try: open ' + Object.keys(projects)[0])
      const proj = projects[slug(what)]
      if (!proj) return err(`open: ${what}: no such project`)
      if (!proj.showcase) return err(`open: ${what}: nothing to show yet`)
      close()
      window.dispatchEvent(new CustomEvent('cv:open-project', { detail: proj.id }))
      ok(`opened ${proj.title}`)
    },
  },
  cd: {
    help: 'cd <section>   jump to a section',
    run: ([where]) => {
      const target = SECTIONS.find(s => where && s.startsWith(where.toLowerCase()))
      if (!target) return err(`cd: ${where ?? ''}: try one of ${SECTIONS.join(', ')}`)
      close()
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    },
  },
  contact: {
    help: 'get in touch',
    run: () => {
      close()
      emit('open-contact')
    },
  },
  github: {
    help: 'open GitHub profile',
    run: () => {
      window.open(cvData.personal.github, '_blank', 'noopener')
      ok(`opened ${cvData.personal.github}`)
    },
  },
  tetris: {
    help: 'play a round',
    run: () => {
      if (!canPlayTetris()) return err('tetris: needs a keyboard and a bigger screen')
      close()
      window.dispatchEvent(new Event('cv:open-tetris'))
      ok('launching tetris…')
    },
  },
  coffee: {
    help: 'brew a cup',
    run: () => {
      window.dispatchEvent(new CustomEvent('cv:coffee'))
      ok('☕ brewed. The counter on the page went up by one.')
    },
  },
  joke: {
    help: 'one bad joke',
    run: () => print(cvData.jokes[Math.floor(Math.random() * cvData.jokes.length)]!),
  },
  print: {
    help: 'print the CV',
    run: () => {
      close()
      setTimeout(() => window.print(), 150)
    },
  },
  submit: {
    help: 'submit <flag>',
    run: async ([flag]) => {
      if (!flag) return err('submit: usage: submit JL{...}   (stuck? type: hint)')
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(flag.trim()))
      const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
      if (hex !== FLAG_HASH) return err('Not quite. Check the encoding and try again.')
      flagSolved = true
      ok('✓ Correct. Encoding is not encryption, and you clearly know it.')
      ok('Type "claim" to email me the flag. First coffee is on me.')
    },
  },
  hint: {
    help: '_',
    run: () => print("Look in the page's <head>. Something there is encoded, not encrypted."),
  },
  claim: {
    help: '_',
    run: () => {
      if (!flagSolved) return err('claim: nothing to claim yet')
      window.location.href = `mailto:${cvData.personal.email}?subject=${encodeURIComponent('I found the flag')}`
    },
  },
  sudo: {
    help: '_',
    run: (args) => {
      if (args.join(' ').toLowerCase() === 'hire jisu') {
        ok('[sudo] permission granted. Opening a direct line...')
        setTimeout(() => {
          close()
          emit('open-contact')
        }, 900)
        return
      }
      err('guest is not in the sudoers file. This incident will be reported.')
      print('(although "sudo hire jisu" might work)')
    },
  },
  rm: {
    help: '_',
    run: () => err('Nice try. I used to run the bug bounty program here.'),
  },
  clear: {
    help: 'clear the screen',
    run: () => { lines.value = [] },
  },
  exit: {
    help: 'close (or press Esc)',
    run: () => close(),
  },
}

function print(text: string) { lines.value.push({ type: 'out', text }) }
function err(text: string) { lines.value.push({ type: 'err', text }) }
function ok(text: string) { lines.value.push({ type: 'ok', text }) }

async function submit() {
  const raw = draft.value.trim()
  draft.value = ''
  if (!raw) return
  history.push(raw)
  historyIndex = history.length
  lines.value.push({ type: 'in', text: raw })

  const [name, ...args] = raw.split(/\s+/)
  const cmd = COMMANDS[name!.toLowerCase()]
  if (cmd) await cmd.run(args)
  else err(`command not found: ${name}. Type "help" for a list.`)

  await nextTick()
  screen.value?.scrollTo({ top: screen.value.scrollHeight })
}

function historyStep(dir: number) {
  if (!history.length) return
  historyIndex = Math.max(0, Math.min(history.length, historyIndex + dir))
  draft.value = history[historyIndex] ?? ''
}

function complete() {
  const [name, arg] = draft.value.split(/\s+/)
  if (arg === undefined) {
    const match = Object.keys(COMMANDS).filter(c => c.startsWith(name ?? ''))
    if (match.length === 1) draft.value = match[0] + ' '
    return
  }
  const pool = name === 'cd' ? SECTIONS : name === 'cat' ? [...Object.keys(projects), 'experience', 'languages'] : name === 'open' ? Object.keys(projects) : name === 'ls' ? ['projects', 'experience'] : []
  const match = pool.filter(p => p.startsWith(arg))
  if (match.length === 1) draft.value = `${name} ${match[0]}`
}

function focusInput() {
  if (!window.getSelection()?.toString()) input.value?.focus()
}

async function open() {
  if (isOpen.value) return
  returnFocus = document.activeElement as HTMLElement | null
  isOpen.value = true
  if (!lines.value.length) {
    print(`Welcome to ${cvData.personal.name}'s CV. Type "help" to see what you can do.`)
  }
  await nextTick()
  input.value?.focus()
}

function close() {
  isOpen.value = false
  returnFocus?.focus?.()
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

defineExpose({ open })
</script>

<style scoped>
.term-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 1rem 1rem;
  background: rgba(2, 6, 15, 0.55);
  backdrop-filter: blur(3px);
}

/* The terminal stays dark in both themes, like a real one */
.term {
  width: min(680px, 100%);
  background: #0b111d;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: var(--radius-md);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: #e2e8f0;
}

.term-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.85rem;
  background: #131b2c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.term-dots {
  display: flex;
  gap: 6px;
}

.term-dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #475569;
}

.term-dots i:nth-child(1) { background: #f87171; }
.term-dots i:nth-child(2) { background: #fbbf24; }
.term-dots i:nth-child(3) { background: #34d399; }

.term-title {
  flex: 1;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
}

.term-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.term-close:hover {
  color: #38bdf8;
}

.term-screen {
  max-height: min(55vh, 420px);
  overflow-y: auto;
  padding: 0.85rem 1rem 1rem;
  cursor: text;
}

.term-line {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
}

.term-line.in { color: #f8fafc; margin-top: 0.4rem; }
.term-line.out { color: #cbd5e1; }
.term-line.err { color: #fca5a5; }
.term-line.ok { color: #6ee7b7; }

.prompt {
  color: #38bdf8;
}

.term-input-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.term-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #f8fafc;
  font: inherit;
  caret-color: #38bdf8;
}

/* The input is the only control; show focus on the whole screen instead */
.term:focus-within {
  border-color: rgba(56, 189, 248, 0.7);
}
</style>
