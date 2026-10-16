<template>
  <Teleport to="body">
    <div class="tetris-overlay no-print" @click.self="$emit('close')" @keydown="onKeydown">
      <div
        ref="box"
        class="tetris-box animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tetris-title"
        tabindex="-1"
      >
        <div class="tetris-bar">
          <span id="tetris-title" class="tetris-title">tetris</span>
          <span class="tetris-hint" aria-hidden="true">↑↑↓↓←→←→BA</span>
          <button type="button" class="close-btn" aria-label="Close Tetris" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <iframe
          ref="frame"
          src="/tetris/index.html"
          title="Tetris"
          class="tetris-frame"
          @load="focusGame"
        ></iframe>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDialog } from '~/composables/useDialog'

const emit = defineEmits<{ close: [] }>()

const box = ref<HTMLElement | null>(null)
const frame = ref<HTMLIFrameElement | null>(null)
const isOpen = ref(false)

// Escape inside the game never reaches this document (keys stay in the iframe),
// so this only fires when focus is on the close button.
const { onKeydown } = useDialog(box, () => isOpen.value, () => emit('close'))

function focusGame() {
  frame.value?.contentWindow?.focus()
}

/** The game's own Quit (see public/tetris/tiny-shim.js). */
function onMessage(e: MessageEvent) {
  if (e.origin === location.origin && e.source === frame.value?.contentWindow && e.data?.type === 'tetris:quit') {
    emit('close')
  }
}

let returnFocus: HTMLElement | null = null

onMounted(() => {
  returnFocus = document.activeElement as HTMLElement | null
  // Mounted with v-if, so flipping this after mount lets useDialog's watcher run
  // its open path (scroll lock, focus bookkeeping).
  isOpen.value = true
  window.addEventListener('message', onMessage)
})

onBeforeUnmount(() => {
  isOpen.value = false
  window.removeEventListener('message', onMessage)
  // useDialog's watcher would do this, but the component is gone before it runs.
  returnFocus?.focus?.()
})
</script>

<style scoped>
.tetris-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.tetris-box {
  /* The game's native window is 960x640; keep 3:2 and fit the viewport. */
  width: min(960px, calc(100vw - 2rem), calc((100dvh - 2rem - 2.5rem) * 1.5));
  display: flex;
  flex-direction: column;
  background: #0b0d12;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.tetris-box:focus {
  outline: none;
}

.tetris-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 2.5rem;
  padding: 0 0.5rem 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #cbd5e1;
}

.tetris-title {
  font-weight: 600;
  color: #f8fafc;
}

.tetris-hint {
  color: #64748b;
}

.close-btn {
  margin-left: auto;
  display: flex;
  padding: 0.35rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: #cbd5e1;
  cursor: pointer;
}

.close-btn:hover,
.close-btn:focus-visible {
  color: #ffffff;
}

.tetris-frame {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  border: 0;
  background: #0b0d12;
}
</style>
