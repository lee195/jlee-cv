<template>
  <figure class="fe" :aria-label="ariaSummary">
    <p class="sr-only">{{ ariaSummary }}</p>

    <!-- The page under test. Decorative: the feed on the right carries the content. -->
    <div class="fe-stage" aria-hidden="true">
      <div class="fe-chrome">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="url">acme.io/provision</span>
      </div>
      <div class="fe-page">
        <h1>Provision your workspace instance</h1>
        <p class="sub">Configure the tenant parameters below to initialize provisioning.</p>

        <div class="err pin-host" :class="hit('error')">
          <span v-if="shown >= seqOf('error')" class="fe-pin" :class="feelingOf('error')">{{ seqOf('error') }}</span>
          Error: validation failed (code 422). Check your input and retry.
        </div>

        <p class="prose pin-host" :class="hit('prose')">
          <span v-if="shown >= seqOf('prose')" class="fe-pin" :class="feelingOf('prose')">{{ seqOf('prose') }}</span>
          Acme is a multi-tenant orchestration substrate for distributed workloads. Each workspace is bound to an isolated namespace with its own quota envelope, and provisioning allocates a dedicated control plane shard. Tenancy parameters cannot be modified post-provisioning without a migration window. Consult the operator handbook for the full parameter reference.
        </p>

        <div class="in">Email</div>
        <div class="in">Password</div>
        <div class="in">Workspace slug</div>

        <div class="fieldrow pin-host" :class="hit('card')">
          <span v-if="shown >= seqOf('card')" class="fe-pin" :class="feelingOf('card')">{{ seqOf('card') }}</span>
          <div class="in">Card number</div>
          <div class="in">MM/YY</div>
          <div class="in">CVC</div>
        </div>

        <div class="cta pin-host" :class="hit('cta')">
          <span v-if="shown >= seqOf('cta')" class="fe-pin" :class="feelingOf('cta')">{{ seqOf('cta') }}</span>
          Initialize
        </div>

        <p class="legal pin-host" :class="hit('legal')">
          <span v-if="shown >= seqOf('legal')" class="fe-pin" :class="feelingOf('legal')">{{ seqOf('legal') }}</span>
          By initializing you agree to the Master Subscription Agreement and the Data Processing Addendum, and you authorize recurring charges to the payment instrument provided above at the then-current list rate for your selected tenancy tier, billed in arrears.
        </p>
      </div>
    </div>

    <!-- The Fresh Eyes side panel -->
    <div class="fe-feed">
      <div class="fe-persona">
        <span class="avatar" aria-hidden="true">R</span>
        <div>
          <div class="persona-name">Ruth, 44</div>
          <div class="persona-note">Florist, paying with her own card · trying to sign up</div>
        </div>
      </div>

      <ol class="reactions" aria-live="polite">
        <li v-for="r in visible" :key="r.seq" class="reaction" :class="r.feeling">
          <span class="seq">{{ r.seq }}</span>
          <div class="reaction-body">
            <p class="say">“{{ r.say }}”</p>
            <p class="quote">↳ “{{ r.quote }}”</p>
            <p class="chips">
              <span class="chip feeling"><span class="chip-dot"></span>{{ r.feeling }}</span>
              <span class="chip">{{ r.action.replace(/_/g, ' ') }}</span>
              <span class="chip">{{ r.cause.replace(/_/g, ' ') }}</span>
            </p>
          </div>
        </li>
      </ol>

      <div v-if="verdict" class="verdict">
        <div class="verdict-head">✕ closes the page <span class="verdict-at">· abandoned at #{{ VERDICT.abandonedAtSeq }}</span></div>
        <p class="verdict-summary">{{ VERDICT.summary }}</p>
        <ol class="fixes">
          <li v-for="f in VERDICT.topFixes" :key="f">{{ f }}</li>
        </ol>
      </div>

      <div class="fe-foot">
        <span>Every reaction quotes text on the page or is dropped. Form values are never sent.</span>
        <button v-if="verdict" type="button" class="replay" @click="start">Replay</button>
      </div>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Anchor = 'error' | 'prose' | 'card' | 'cta' | 'legal'
type Feeling = 'confused' | 'bored' | 'anxious' | 'annoyed'

interface Reaction {
  seq: number
  el: Anchor
  feeling: Feeling
  action: string
  cause: string
  /** Verbatim text from the mock page: the product's grounding rule */
  quote: string
  say: string
}

const REACTIONS: Reaction[] = [
  { seq: 1, el: 'error', feeling: 'confused', action: 'rereads', cause: 'error', quote: 'Error: validation failed (code 422)', say: "I haven't typed anything yet and it already says I did it wrong?" },
  { seq: 2, el: 'prose', feeling: 'bored', action: 'scrolls_past', cause: 'jargon', quote: 'multi-tenant orchestration substrate', say: "I don't know what a substrate is. Is this page even for me?" },
  { seq: 3, el: 'card', feeling: 'anxious', action: 'hesitates', cause: 'trust', quote: 'Card number', say: 'Why does it want my card before I know what this costs?' },
  { seq: 4, el: 'cta', feeling: 'confused', action: 'clicks_wrong_thing', cause: 'unclear_next_step', quote: 'Initialize', say: 'Initialize what? Is that the sign-up button? Nothing happened.' },
  { seq: 5, el: 'legal', feeling: 'annoyed', action: 'closes_page', cause: 'cost_uncertainty', quote: 'then-current list rate', say: "So that's the price. In grey text I can barely read. I'm out." },
]

const VERDICT = {
  abandonedAtSeq: 5,
  summary: "Ruth never learned the price and was asked for her card by a grey box that isn't a button.",
  topFixes: [
    'Show the price above the card fields',
    'Make "Initialize" a real button and call it "Create workspace"',
    'Hide the error banner until something was submitted',
  ],
}

const STEP_MS = 900
const VERDICT_DELAY_MS = 600

const shown = ref(0)
const verdict = ref(false)
const visible = computed(() => REACTIONS.filter(r => r.seq <= shown.value))

const bySeq = (el: Anchor) => REACTIONS.find(r => r.el === el)!
const seqOf = (el: Anchor) => bySeq(el).seq
const feelingOf = (el: Anchor) => bySeq(el).feeling
const hit = (el: Anchor) => (shown.value >= seqOf(el) ? ['hit', feelingOf(el)] : [])

const ariaSummary =
  'Fresh Eyes demo. Ruth, 44, a florist paying with her own card, tries to sign up on a hostile provisioning page. ' +
  REACTIONS.map(r => `${r.seq}: ${r.say} (${r.feeling}, ${r.action.replace(/_/g, ' ')}, ${r.cause.replace(/_/g, ' ')})`).join(' ') +
  ` Verdict: closes the page at step ${VERDICT.abandonedAtSeq}. ${VERDICT.summary}`

let timers: ReturnType<typeof setTimeout>[] = []

function clear() {
  timers.forEach(clearTimeout)
  timers = []
}

function start() {
  clear()
  shown.value = 0
  verdict.value = false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = REACTIONS.length
    verdict.value = true
    return
  }
  REACTIONS.forEach((r, i) => {
    timers.push(setTimeout(() => { shown.value = r.seq }, STEP_MS * (i + 1)))
  })
  timers.push(setTimeout(() => { verdict.value = true }, STEP_MS * (REACTIONS.length + 1) + VERDICT_DELAY_MS))
}

onMounted(start)
onBeforeUnmount(clear)
</script>

<style scoped>
.fe {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---------- the page under test (deliberately not themed) ---------- */
.fe-stage {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #fff;
  color: #222;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  line-height: 1.45;
}

.fe-chrome {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  background: #ececec;
  border-bottom: 1px solid #d8d8d8;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #c8c8c8;
}

.url {
  margin-left: 8px;
  flex: 1;
  padding: 3px 8px;
  background: #fff;
  border-radius: 4px;
  color: #666;
  font-size: 10px;
}

.fe-page {
  padding: 16px 18px 18px;
}

.fe-page h1 {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 3px;
  color: #222;
}

.fe-page .sub {
  color: #8a8a8a;
  margin: 0 0 12px;
}

.pin-host {
  position: relative;
  transition: box-shadow 0.3s ease;
}

.err {
  background: #fff4f4;
  border: 1px solid #f0caca;
  color: #a33;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 10px;
}

.prose {
  color: #444;
  margin: 0 0 12px;
  font-size: 10px;
}

.in {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 7px;
  margin: 0 0 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #999;
  background: #fff;
}

.fieldrow {
  display: flex;
  gap: 6px;
  margin-bottom: 2px;
}

.fieldrow .in {
  flex: 1;
  min-width: 0;
}

.cta {
  display: inline-block;
  background: #2b2b2b;
  color: #fff;
  padding: 6px 14px;
  border-radius: 4px;
  margin-top: 4px;
}

.legal {
  font-size: 7.5px;
  color: #c9c9c9;
  line-height: 1.4;
  margin: 10px 0 0;
}

.fe-pin {
  position: absolute;
  top: -5px;
  left: -21px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 700 10px var(--font-heading);
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  animation: pop 0.35s cubic-bezier(0.2, 1.4, 0.4, 1);
}

@keyframes pop {
  from { transform: scale(0.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.fe-pin.confused, .hit.confused { --pin: #6366f1; }
.fe-pin.bored, .hit.bored { --pin: #64748b; }
.fe-pin.anxious, .hit.anxious { --pin: #f59e0b; }
.fe-pin.annoyed, .hit.annoyed { --pin: #e11d48; }

.fe-pin { background: var(--pin); }
.hit { box-shadow: 0 0 0 2px var(--pin); border-radius: 4px; }

/* ---------- the side panel (themed) ---------- */
.fe-feed {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  min-height: 0;
}

.fe-persona {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-accent);
  color: #fff;
  font: 700 0.9rem var(--font-heading);
  flex-shrink: 0;
}

.persona-name {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
}

.persona-note {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.reactions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 9rem;
}

.reaction {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  animation: rise 0.3s ease;
}

@keyframes rise {
  from { transform: translateY(6px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

.reaction.confused { --pin: #6366f1; }
.reaction.bored { --pin: #64748b; }
.reaction.anxious { --pin: #f59e0b; }
.reaction.annoyed { --pin: #e11d48; }

.seq {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pin);
  color: #fff;
  font: 700 10px var(--font-heading);
  margin-top: 0.1rem;
}

.reaction-body { min-width: 0; }

.reaction-body p { margin: 0; }

.say {
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.quote {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.15rem !important;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem !important;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pin);
}

.verdict {
  padding: 0.7rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(225, 29, 72, 0.5);
  background: rgba(225, 29, 72, 0.08);
  animation: rise 0.3s ease;
}

.verdict-head {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.verdict-at {
  font-weight: 500;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.verdict-summary {
  margin: 0.3rem 0 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.fixes {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.fe-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.replay {
  flex-shrink: 0;
  font: 600 0.75rem var(--font-heading);
  padding: 0.15rem 0.6rem;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.replay:hover {
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
}

@media (prefers-reduced-motion: reduce) {
  .fe-pin, .reaction, .verdict { animation: none; }
}

@media (max-width: 720px) {
  .fe {
    grid-template-columns: 1fr;
  }
  .fe-stage {
    max-height: 300px;
  }
}
</style>
