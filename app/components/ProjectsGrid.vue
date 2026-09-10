<template>
  <section id="projects" class="section-container">
    <div class="section-header">
      <h2 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        Featured Projects
      </h2>
      <p class="section-subtitle">Key applications and open-source software engineered for high performance</p>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <div v-for="proj in filteredProjects" :key="proj.id" class="glass-card project-card print-break-inside-avoid">
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
            <a v-if="proj.github" :href="proj.github" target="_blank" rel="noopener" class="icon-link" title="GitHub Code">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a v-if="proj.link" :href="proj.link" target="_blank" rel="noopener" class="icon-link" title="Live Preview">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { cvData } from '~/data/cvData'

const activeCategory = ref('All')
const categories = ['All', 'Full Stack', 'Frontend', 'AI & Tools']

const filteredProjects = computed(() => {
  if (activeCategory.value === 'All') return cvData.projects
  return cvData.projects.filter(p => p.category === activeCategory.value)
})
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-accent);
}

.filter-btn.active {
  background: var(--gradient-accent);
  color: #ffffff;
  border-color: transparent;
  box-shadow: var(--shadow-glow);
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

.project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-cyan);
}

.featured-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(251, 191, 36, 0.25);
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
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid var(--border-color);
  padding-top: 0.9rem;
  gap: 0.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.project-links {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
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
