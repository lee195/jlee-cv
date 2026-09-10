<template>
  <section id="skills" class="section-container">
    <div class="section-header">
      <h2 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        Skills & Technical Expertise
      </h2>
      <p class="section-subtitle">Core competencies across frontend development, backend architecture, and cloud infrastructure</p>
    </div>

    <div class="skills-grid">
      <div v-for="cat in skillCategories" :key="cat.category" class="glass-card skill-card print-break-inside-avoid">
        <h3 class="category-title">
          <span class="title-icon">◈</span>
          {{ cat.category }}
        </h3>

        <div class="skills-list">
          <div v-for="skill in cat.skills" :key="skill.name" class="skill-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span v-if="skill.tag" class="skill-tag">{{ skill.tag }}</span>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cvData'

const skillCategories = cvData.skillCategories
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.skill-card {
  padding: 1.75rem;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-cyan);
}

.title-icon {
  font-size: 1rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.skill-name {
  font-weight: 600;
  color: var(--text-primary);
}

.skill-tag {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.skill-bar-bg {
  height: 6px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--gradient-accent);
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}
</style>
