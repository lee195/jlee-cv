<template>
  <section id="experience" class="section-container">
    <div class="section-header">
      <h2 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        Work Experience
      </h2>
      <p class="section-subtitle">Track record of building scalable web platforms and engineering leadership</p>
    </div>

    <div class="timeline-list">
      <div v-for="(exp, index) in experiences" :key="exp.id" class="timeline-item">
        <!-- Timeline Marker Dot & Line -->
        <div class="timeline-marker">
          <div class="marker-dot"></div>
          <div v-if="index !== experiences.length - 1" class="marker-line"></div>
        </div>

        <!-- Experience Card -->
        <div class="glass-card exp-card print-break-inside-avoid">
          <div class="exp-header">
            <div>
              <h3 class="exp-role">{{ exp.role }}</h3>
              <div class="exp-company-group">
                <span class="exp-company">{{ exp.company }}</span>
                <span class="bullet">•</span>
                <span class="exp-location">{{ exp.location }}</span>
              </div>
            </div>
            <div class="exp-meta">
              <span class="badge">{{ exp.period }}</span>
            </div>
          </div>

          <p class="exp-description">{{ exp.description }}</p>

          <ul class="exp-highlights">
            <li v-for="(highlight, hIndex) in exp.highlights" :key="hIndex">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <div class="exp-tags">
            <span v-for="tech in exp.technologies" :key="tech" class="tag">{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cvData'

const experiences = cvData.experiences
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gradient-accent);
  box-shadow: var(--shadow-glow);
  margin-top: 1.5rem;
}

.marker-line {
  flex-grow: 1;
  width: 2px;
  background: var(--border-color);
  margin-top: 0.5rem;
}

.exp-card {
  flex-grow: 1;
  padding: 1.75rem;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.exp-role {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}

.exp-company-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 0.2rem;
}

.exp-company {
  color: var(--accent-cyan);
  font-weight: 600;
}

.bullet {
  color: var(--text-muted);
}

.exp-description {
  color: var(--text-secondary);
  font-size: 0.975rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.exp-highlights {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.exp-highlights li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.925rem;
  color: var(--text-primary);
}

.check-icon {
  color: var(--accent-emerald);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.exp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

@media (max-width: 640px) {
  .timeline-marker {
    display: none;
  }
  .exp-header {
    flex-direction: column;
  }
}
</style>
