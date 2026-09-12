<template>
  <section id="about" class="hero-section">
    <div class="glass-card hero-card">
      <div class="hero-layout">
        <!-- Hero Details Column -->
        <div class="hero-details">
          <div class="status-badge" aria-hidden="true">
            <span class="pulse-dot"></span>
            <span>{{ personal.status }}</span>
          </div>

          <h1 class="hero-name">
            {{ personal.name }}
          </h1>
          <p class="hero-title gradient-text">{{ personal.title }}</p>

          <div class="hero-meta">
            <span class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ personal.location }}</span>
            </span>
            <a :href="'mailto:' + personal.email" class="meta-item meta-link" :aria-label="'Send email to ' + personal.email">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{{ personal.email }}</span>
            </a>
          </div>

          <p class="hero-bio">
            {{ personal.bio }}
          </p>

          <!-- Quick Statistics Bar -->
          <div class="stats-grid">
            <div v-for="(stat, index) in stats" :key="index" class="stat-card">
              <span class="stat-value gradient-text">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>

          <!-- Action CTAs -->
          <div class="hero-actions no-print">
            <button @click="$emit('open-contact')" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Contact Me
            </button>
            <div class="social-group">
              <a v-if="personal.github" :href="personal.github" target="_blank" rel="noopener" class="btn btn-secondary btn-icon" :aria-label="'View ' + personal.name + '\'s GitHub profile'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Pokemon Card Profile Column -->
        <div class="hero-card-col">
          <PokemonProfileCard />
          <a 
            href="https://github.com/simeydotme/pokemon-cards-css" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="card-attribution-link" 
            aria-label="Holographic card effect by simeydotme on GitHub (opens in new tab)"
          >
            Pokemon card effect CSS by simeydotme
          </a>
          <a
            href="https://www.pokecardgenerator.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="card-attribution-link" 
            aria-label="Pokemon card generator (opens in new tab)"
          >
            Pokemon card generator
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cvData'
import PokemonProfileCard from '~/components/PokemonProfileCard.vue'

const personal = cvData.personal
const stats = cvData.stats

defineEmits(['open-contact'])
</script>

<style scoped>
.hero-section {
  padding: 3rem 0 2rem 0;
}

.hero-card {
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2.5rem;
  align-items: center;
}

.hero-details {
  display: flex;
  flex-direction: column;
}

.hero-card-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-card-col a {
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.hero-card-col a:hover {
  color: var(--accent-cyan);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  background: #064e3b;
  color: #6ee7b7;
  border: 1px solid #10b981;
  margin-bottom: 0.75rem;
  align-self: flex-start;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.hero-name {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.25rem;
}

.hero-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.meta-link:hover {
  color: var(--accent-cyan);
}

.hero-bio {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.825rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-group {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

@media (max-width: 900px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }
  .hero-card-col {
    order: -1;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-card {
    padding: 1.5rem;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .social-group {
    margin-left: 0;
    justify-content: center;
  }
}
</style>
