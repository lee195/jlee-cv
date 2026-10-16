<template>
  <section id="projects" class="section-container">
    <div class="section-header">
      <h2 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text" aria-hidden="true" focusable="false">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        My Projects
      </h2>
      <p class="section-subtitle">Personal slack time projects</p>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <div
        v-for="proj in cvData.projects"
        :key="proj.id"
        class="glass-card project-card print-break-inside-avoid"
        :class="{ 'has-showcase': proj.showcase }"
        :tabindex="proj.showcase ? 0 : undefined"
        :aria-label="proj.showcase ? `${proj.title}: open case study` : undefined"
        @click="onCardClick($event, proj)"
        @keydown.enter.self="openId = proj.id"
        @keydown.space.self.prevent="openId = proj.id"
      >
        <div class="project-top">
          <div class="category-badge">{{ proj.category }}</div>
        </div>

        <h3 class="project-title">{{ proj.title }}</h3>
        <p class="project-desc">{{ proj.description }}</p>

        <div class="project-highlights">
          <div v-for="(hl, index) in proj.highlights" :key="index" class="hl-item">
            <span class="hl-bullet"></span>
            <span>{{ hl }}</span>
          </div>
        </div>

        <div class="project-footer">
          <div class="project-tech">
            <span v-for="tech in proj.technologies" :key="tech" class="tag">{{ tech }}</span>
          </div>

          <div class="project-links no-print">
            <a v-if="proj.github" :href="proj.github" target="_blank" rel="noopener" class="icon-link" :aria-label="'View source code for ' + proj.title + ' on GitHub'">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a v-if="proj.link" :href="proj.link" target="_blank" rel="noopener" class="icon-link" :aria-label="'View live preview of ' + proj.title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <ProjectShowcaseModal :project="openProject" @close="openId = null" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { cvData, type Project } from '~/data/cvData'
import ProjectShowcaseModal from '~/components/ProjectShowcaseModal.vue'

const openId = ref<string | null>(null)
const openProject = computed(() => cvData.projects.find(p => p.id === openId.value) ?? null)

/** Whole card is a big click target for mouse users; links and buttons inside keep their own behaviour. */
function onCardClick(e: MouseEvent, proj: Project) {
  if (!proj.showcase) return
  if ((e.target as HTMLElement).closest('a, button')) return
  openId.value = proj.id
}

/** `open <project>` from the ⌘K terminal */
function onOpenEvent(e: Event) {
  const id = (e as CustomEvent<string>).detail
  if (cvData.projects.some(p => p.id === id && p.showcase)) openId.value = id
}

onMounted(() => window.addEventListener('cv:open-project', onOpenEvent))
onBeforeUnmount(() => window.removeEventListener('cv:open-project', onOpenEvent))
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}


.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Clickable cards get an accent border so they read as "there's more here" */
.project-card.has-showcase {
  cursor: pointer;
  border-color: color-mix(in srgb, var(--accent-teal) 55%, transparent);
}

.project-card.has-showcase:hover,
.project-card.has-showcase:focus-visible {
  border-color: var(--accent-teal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-teal) 20%, transparent), var(--shadow-md);
}

.project-card.has-showcase:focus-visible {
  outline: none;
}

.project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category-badge {
  font-size: 0.775rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
  background: #0c4a6e;
  color: #7dd3fc;
  border: 1px solid #0284c7;
}


.project-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.project-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.hl-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.hl-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-cyan);
  margin-top: 0.45rem;
  flex-shrink: 0;
}

.project-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid var(--border-color);
  padding-top: 0.9rem;
  gap: 0.75rem 0.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex: 1 1 60%;
}

.project-links {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
  margin-left: auto;
}

.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.icon-link:hover {
  background: var(--accent-cyan);
  color: #ffffff;
}
</style>
