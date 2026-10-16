<template>
  <figure ref="root" class="race no-print" :aria-label="ariaSummary">
    <figcaption class="race-head">
      <span class="race-title">{{ race.title }}</span>
      <span class="race-clock" aria-hidden="true">{{ clock }}</span>
    </figcaption>

    <div class="race-lanes" aria-hidden="true">
      <div
        v-for="(lane, i) in race.lanes"
        :key="lane.label"
        class="lane"
        :class="{ done: elapsed >= lane.minutes, winner: i === winnerIndex }"
      >
        <span class="lane-label">{{ lane.label }}</span>
        <div class="track">
          <div class="bar" :style="{ width: barWidth(lane) }"></div>
        </div>
        <span class="lane-result">
          <span class="lane-display">{{ elapsed >= lane.minutes ? lane.display : '…' }}</span>
          <span v-if="lane.note && elapsed >= lane.minutes" class="lane-note">{{ lane.note }}</span>
        </span>
      </div>
    </div>

    <button
      v-if="finished"
      type="button"
      class="race-replay"
      @click="start"
    >
      Replay
    </button>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { MetricRace, RaceLane } from '~/data/cvData'

const props = defineProps<{ race: MetricRace }>()

/** Real-time length of the whole race, regardless of simulated minutes */
const DURATION_MS = 3200

const root = ref<HTMLElement | null>(null)
const elapsed = ref(0) // simulated minutes
const maxMinutes = computed(() => Math.max(...props.race.lanes.map(l => l.minutes)))
const finished = computed(() => elapsed.value >= maxMinutes.value)
const winnerIndex = computed(() => {
  const min = Math.min(...props.race.lanes.map(l => l.minutes))
  return props.race.lanes.findIndex(l => l.minutes === min)
})

const clock = computed(() => {
  const m = Math.floor(elapsed.value)
  const h = Math.floor(m / 60)
  return `${h}:${String(m % 60).padStart(2, '0')} h`
})

const ariaSummary = computed(() =>
  props.race.title + ': ' +
  props.race.lanes.map(l => `${l.label} ${l.display}${l.note ? `, ${l.note}` : ''}`).join('; ')
)

function barWidth(lane: RaceLane) {
  return `${(Math.min(elapsed.value, lane.minutes) / maxMinutes.value) * 100}%`
}

let frame = 0
let observer: IntersectionObserver | undefined

function start() {
  cancelAnimationFrame(frame)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elapsed.value = maxMinutes.value
    return
  }
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - t0) / DURATION_MS, 1)
    elapsed.value = p * maxMinutes.value
    if (p < 1) frame = requestAnimationFrame(tick)
  }
  elapsed.value = 0
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    elapsed.value = maxMinutes.value
    return
  }
  observer = new IntersectionObserver(
    entries => {
      if (entries.some(e => e.isIntersecting)) {
        start()
        observer?.disconnect()
      }
    },
    { threshold: 0.6 }
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<style scoped>
.race {
  position: relative;
  margin: 0 0 1.25rem;
  padding: 1rem 1.1rem 0.9rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.race-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}

.race-title {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.race-clock {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.race-lanes {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.lane {
  display: grid;
  grid-template-columns: 3.5rem 1fr 9.5rem;
  align-items: center;
  gap: 0.75rem;
}

.lane-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.track {
  height: 10px;
  border-radius: var(--radius-full);
  background: var(--border-color);
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: inherit;
  background: var(--text-muted);
  opacity: 0.55;
}

.winner .bar {
  background: var(--gradient-accent);
  opacity: 1;
}

.lane-result {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.lane-display {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.winner.done .lane-display {
  color: var(--accent-emerald);
}

.winner.done .lane-display::after {
  content: ' ✓';
}

.lane-note {
  font-size: 0.775rem;
  color: var(--text-muted);
}

.race-replay {
  position: absolute;
  right: 1.1rem;
  bottom: -0.7rem;
  font: 600 0.75rem var(--font-heading);
  padding: 0.15rem 0.6rem;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.race-replay:hover {
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
}

@media (max-width: 640px) {
  .lane {
    grid-template-columns: 3rem 1fr;
    row-gap: 0.2rem;
  }
  .lane-result {
    grid-column: 2;
  }
}
</style>
