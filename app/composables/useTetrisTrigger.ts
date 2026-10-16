import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Everything Tetris ships in the main bundle: the device check, the Konami code
 * and the `cv:open-tetris` listener. The modal (a lazy chunk) and the game files
 * (`public/tetris/`, ~300 KB) are only fetched once this flips `open` to true.
 */

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

/** Keyboard-only game: needs a fine pointer with hover and room for a 3:2 frame. */
export function canPlayTetris(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 768
}

export function useTetrisTrigger() {
  const open = ref(false)
  let progress = 0

  function launch() {
    if (canPlayTetris()) open.value = true
  }

  function onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
    if (open.value || document.querySelector('[role="dialog"][aria-modal="true"]')) {
      progress = 0
      return
    }
    const key = e.key.toLowerCase()
    if (key === KONAMI[progress]) {
      progress++
      if (progress === KONAMI.length) {
        progress = 0
        launch()
      }
    } else {
      // A wrong key may still be the start of a new attempt.
      progress = key === KONAMI[0] ? 1 : 0
    }
  }

  onMounted(() => {
    window.addEventListener('cv:open-tetris', launch)
    // Phones and tablets never get the shortcut, so they never fetch the game.
    if (canPlayTetris()) window.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('cv:open-tetris', launch)
    window.removeEventListener('keydown', onKeydown)
  })

  return { open }
}
