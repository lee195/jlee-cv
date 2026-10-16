<template>
  <div class="gallery">
    <figure
      ref="stage"
      class="stage"
      tabindex="0"
      aria-roledescription="carousel"
      :aria-label="`${images.length} screenshots, use arrow keys to browse`"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
    >
      <img
        :key="current.src"
        :src="current.src"
        :alt="current.alt"
        :width="current.width"
        :height="current.height"
        loading="lazy"
        decoding="async"
        class="stage-img"
      >
      <button type="button" class="nav prev" aria-label="Previous screenshot" @click="step(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button type="button" class="nav next" aria-label="Next screenshot" @click="step(1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <figcaption class="caption">
        <span class="counter" aria-live="polite">{{ index + 1 }} / {{ images.length }}</span>
        <span>{{ current.caption }}</span>
      </figcaption>
    </figure>

    <div class="thumbs" role="tablist" aria-label="Screenshots">
      <button
        v-for="(img, i) in images"
        :key="img.src"
        type="button"
        class="thumb"
        :class="{ active: i === index }"
        role="tab"
        :aria-selected="i === index"
        :aria-label="img.caption"
        @click="index = i"
      >
        <img :src="img.thumb" :alt="''" loading="lazy" decoding="async">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShowcaseImage } from '~/data/cvData'

const props = defineProps<{ images: ShowcaseImage[] }>()

const index = ref(0)
const stage = ref<HTMLElement | null>(null)
const current = computed(() => props.images[index.value] ?? props.images[0]!)

function step(delta: number) {
  const n = props.images.length
  index.value = (index.value + delta + n) % n
}
</script>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stage {
  position: relative;
  margin: 0;
  aspect-ratio: 1400 / 801;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.stage:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
}

.stage-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-glass);
  color: var(--text-primary);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity var(--transition-fast), border-color var(--transition-fast);
}

.nav:hover {
  opacity: 1;
  border-color: var(--accent-cyan);
}

.prev { left: 0.6rem; }
.next { right: 0.6rem; }

.caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  padding: 0.5rem 0.85rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border-top: 1px solid var(--border-color);
}

.counter {
  font-family: var(--font-mono);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.thumbs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.thumb {
  flex: 0 0 auto;
  width: 96px;
  padding: 0;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  cursor: pointer;
  overflow: hidden;
  opacity: 0.7;
  transition: opacity var(--transition-fast), border-color var(--transition-fast);
}

.thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 1400 / 801;
  object-fit: contain;
}

.thumb:hover,
.thumb.active {
  opacity: 1;
  border-color: var(--accent-cyan);
}

@media (max-width: 640px) {
  .caption span:last-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
