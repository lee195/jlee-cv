<template>
  <div class="stats-wrap">
    <div class="stats-grid">
      <template v-for="(stat, index) in stats" :key="index">
        <!-- Coffee: ticks up while you read, click to pour another -->
        <button
          v-if="stat.kind === 'coffee'"
          type="button"
          class="stat-card stat-interactive"
          :aria-label="`${coffee} cups of coffee. Pour another`"
          @click="pourCoffee"
        >
          <span class="stat-value gradient-text">{{
            coffee.toLocaleString("en-US")
          }}</span>
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-hint" aria-hidden="true">click for a refill</span>
          <TransitionGroup
            name="steam"
            tag="span"
            class="steam-layer"
            aria-hidden="true"
          >
            <span v-for="p in puffs" :key="p" class="steam">+1 ☕</span>
          </TransitionGroup>
        </button>

        <!-- Jokes: click to hear one -->
        <button
          v-else-if="stat.kind === 'jokes'"
          type="button"
          class="stat-card stat-interactive"
          :aria-expanded="currentJoke !== null"
          aria-controls="joke-bubble"
          @click="tellJoke"
        >
          <span class="stat-value gradient-text">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-hint" aria-hidden="true">{{
            jokesTold ? "another one?" : "hear one"
          }}</span>
        </button>

        <div v-else class="stat-card">
          <span class="stat-value gradient-text">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </template>
    </div>

    <div id="joke-bubble" class="joke-slot no-print" aria-live="polite">
      <Transition name="joke" mode="out-in">
        <p v-if="currentJoke" :key="jokesTold" class="joke-bubble">
          <span class="joke-text">{{ currentJoke }}</span>
          <button
            type="button"
            class="joke-close"
            aria-label="Dismiss joke"
            @click="currentJoke = null"
          >
            ×
          </button>
        </p>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { cvData, type Stat } from "~/data/cvData";

defineProps<{ stats: Stat[] }>();

/* ---------- Coffee ---------- */
const coffeeStat = cvData.stats.find((s) => s.kind === "coffee");
const coffee = ref(parseInt(coffeeStat?.value ?? "0", 10) || 0);
const puffs = ref<number[]>([]);
let puffId = 0;
let ticker: ReturnType<typeof setInterval> | undefined;

function pourCoffee() {
  coffee.value++;
  const id = ++puffId;
  puffs.value.push(id);
  setTimeout(() => {
    puffs.value = puffs.value.filter((p) => p !== id);
  }, 900);
}

/* ---------- Jokes ---------- */
const jokes = cvData.jokes;
const currentJoke = ref<string | null>(null);
const jokesTold = ref(0);
let deck: string[] = [];

function tellJoke() {
  // Shuffle a fresh deck when empty so jokes don't repeat until all are told
  if (deck.length === 0) {
    deck = [...jokes].sort(() => Math.random() - 0.5);
    if (deck[0] === currentJoke.value) deck.push(deck.shift()!);
  }
  currentJoke.value = deck.shift()!;
  jokesTold.value++;
}

function onExternalCoffee() {
  pourCoffee();
}
function onExternalJoke() {
  tellJoke();
}

onMounted(() => {
  // One more cup roughly every half minute of reading
  ticker = setInterval(() => {
    if (document.visibilityState === "visible") pourCoffee();
  }, 30_000);
  // The terminal can trigger these too
  window.addEventListener("cv:coffee", onExternalCoffee);
  window.addEventListener("cv:joke", onExternalJoke);
});

onBeforeUnmount(() => {
  clearInterval(ticker);
  window.removeEventListener("cv:coffee", onExternalCoffee);
  window.removeEventListener("cv:joke", onExternalJoke);
});
</script>

<style scoped>
.stats-wrap {
  position: relative;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-interactive {
  font: inherit;
  color: inherit;
  background: none;
  border: 1px dashed transparent;
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.25rem 0.2rem;
  margin: -0.35rem 0 -0.2rem;
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.stat-interactive:hover,
.stat-interactive:focus-visible {
  border-color: var(--border-accent);
  background: var(--bg-card-hover);
}

.stat-interactive:active .stat-value {
  transform: scale(0.94);
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-variant-numeric: tabular-nums;
  transition: transform var(--transition-fast);
}

.stat-label {
  font-size: 0.825rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Small affordance so the clickable stats read as clickable */
.stat-hint {
  font-size: 0.7rem;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  opacity: 0.75;
  margin-top: 0.15rem;
  transition: opacity var(--transition-fast);
}

.stat-interactive:hover .stat-hint,
.stat-interactive:focus-visible .stat-hint {
  opacity: 1;
}

/* Floating "+1" when a cup is poured */
.steam-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* The resting style IS the end of the animation. Vue drops the enter
   classes the moment the transition finishes, slightly before the
   removal timeout in pourCoffee() fires; if the resting style were the
   start position, the puff would flash back there for a frame or two. */
.steam {
  position: absolute;
  top: -0.4rem;
  right: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-teal);
  white-space: nowrap;
  transform: translateY(-18px);
  opacity: 0;
}

.steam-enter-active {
  transition:
    transform 0.9s ease-out,
    opacity 0.9s ease-out;
}

.steam-enter-from {
  transform: translateY(6px);
  opacity: 1;
}

/* Joke bubble: floats above the stats grid, over the bio, so it never
   takes flow space and nothing around it moves when it appears. */
.joke-slot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  z-index: 2;
  pointer-events: none;
}

.joke-bubble {
  position: relative;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.6rem;
  padding: 0.85rem 1rem;
  background: var(--bg-secondary);
  border: 4px solid var(--border-accent);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.5;
  pointer-events: auto;
}

/* Speech-bubble tail pointing down at the "bad jokes" stat */
.joke-bubble::before {
  content: "";
  position: absolute;
  bottom: -7px;
  right: 12.5%;
  width: 12px;
  height: 12px;
  background: var(--bg-secondary);
  border-right: 2px solid var(--border-accent);
  border-bottom: 2px solid var(--border-accent);
  transform: rotate(45deg);
}

.joke-text {
  flex: 1;
}

.joke-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
}

.joke-close:hover {
  color: var(--accent-cyan);
}

.joke-enter-active,
.joke-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.joke-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.joke-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .joke-bubble::before {
    right: 25%;
  }
}

@media print {
  .stat-hint,
  .steam-layer {
    display: none;
  }
}
</style>
