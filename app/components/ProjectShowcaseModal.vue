<template>
  <Teleport to="body">
    <div
      v-if="project && showcase"
      class="modal-overlay no-print"
      @click.self="$emit('close')"
      @keydown="onKeydown"
    >
      <div
        ref="box"
        class="modal-box animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcase-title"
        tabindex="-1"
      >
        <header class="modal-head">
          <img v-if="showcase.icon" :src="showcase.icon" alt="" width="48" height="48" class="head-icon">
          <div class="head-text">
            <div class="head-meta">
              <span class="category-badge">{{ project.category }}</span>
            </div>
            <h2 id="showcase-title" class="head-title">{{ project.title }}</h2>
            <p class="head-tagline">{{ showcase.tagline }}</p>
          </div>
          <div class="head-actions">
            <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              Source
            </a>
            <button type="button" class="close-btn" :aria-label="`Close ${project.title} case study`" @click="$emit('close')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <div class="modal-body">
          <div class="media">
            <FreshEyesDemo v-if="showcase.demo === 'fresh-eyes'" />
            <ShowcaseGallery v-else-if="showcase.gallery" :images="showcase.gallery" />
          </div>

          <div class="columns">
            <div class="main-col">
              <p v-for="(para, i) in showcase.story" :key="i" class="story">{{ para }}</p>

              <h3 class="sub-title">Why it's built this way</h3>
              <ul class="decisions">
                <li v-for="d in showcase.decisions" :key="d.title" class="decision">
                  <span class="hl-bullet" aria-hidden="true"></span>
                  <div>
                    <strong class="decision-title">{{ d.title }}</strong>
                    <p class="decision-body">{{ d.body }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <aside class="side-col">
              <dl class="facts">
                <div v-for="f in showcase.facts" :key="f.label" class="fact">
                  <dt>{{ f.label }}</dt>
                  <dd>{{ f.value }}</dd>
                </div>
              </dl>
              <div class="tech">
                <span v-for="t in project.technologies" :key="t" class="tag">{{ t }}</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Project } from '~/data/cvData'
import ShowcaseGallery from '~/components/ShowcaseGallery.vue'
import FreshEyesDemo from '~/components/FreshEyesDemo.vue'
import { useDialog } from '~/composables/useDialog'

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const box = ref<HTMLElement | null>(null)
const showcase = computed(() => props.project?.showcase ?? null)

const { onKeydown } = useDialog(box, () => !!(props.project && props.project.showcase), () => emit('close'))
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-box {
  width: 100%;
  max-width: 960px;
  max-height: calc(100dvh - 3rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.modal-box:focus {
  outline: none;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.head-icon {
  flex-shrink: 0;
  border-radius: 12px;
  margin-top: 0.15rem;
}

.head-text {
  flex: 1;
  min-width: 0;
}

.head-meta {
  margin-bottom: 0.35rem;
}

.category-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  background: #0c4a6e;
  color: #7dd3fc;
  border: 1px solid #0284c7;
}

.head-title {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 0.25rem;
}

.head-tagline {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  overflow-y: auto;
  padding: 1.5rem;
}

.media {
  margin-bottom: 1.5rem;
}

.columns {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 2rem;
}

.story {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 0.85rem;
}

.sub-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 1.25rem 0 0.75rem;
}

.decisions {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.decision {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
}

.hl-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-cyan);
  margin-top: 0.5rem;
  flex-shrink: 0;
}

.decision-title {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.15rem;
}

.decision-body {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.55;
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin: 0;
}

.fact {
  padding: 0.7rem 0.85rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.fact dt {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.2rem;
}

.fact dd {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

@media (max-width: 720px) {
  .modal-overlay {
    padding: 0.75rem;
  }
  .modal-box {
    max-height: calc(100dvh - 1.5rem);
  }
  .modal-head {
    padding: 1rem;
    flex-wrap: wrap;
  }
  .head-icon {
    width: 40px;
    height: 40px;
  }
  .modal-body {
    padding: 1rem;
  }
  .columns {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .head-title {
    font-size: 1.35rem;
  }
}
</style>
