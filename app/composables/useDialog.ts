import { watch, nextTick, onBeforeUnmount, type Ref } from 'vue'

/**
 * Shared dialog mechanics: focus save/restore, focus trap, Escape, body scroll lock.
 * `box` is the dialog container (needs tabindex="-1"); `isOpen` is a getter.
 */
export function useDialog(box: Ref<HTMLElement | null>, isOpen: () => boolean, onClose: () => void) {
  let previouslyFocused: HTMLElement | null = null
  let previousOverflow = ''
  let locked = false

  function lock() {
    if (locked) return
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    locked = true
  }

  function unlock() {
    if (!locked) return
    document.body.style.overflow = previousOverflow
    locked = false
  }

  watch(isOpen, async (open) => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      lock()
      await nextTick()
      box.value?.focus()
    } else {
      unlock()
      previouslyFocused?.focus()
      previouslyFocused = null
    }
  })

  onBeforeUnmount(unlock)

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !box.value) return

    const focusable = box.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === box.value) {
        e.preventDefault()
        last?.focus()
      }
    } else if (document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }

  return { onKeydown }
}
