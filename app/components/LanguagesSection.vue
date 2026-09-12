<template>
  <section id="languages" class="section-container">
    <div class="section-header">
      <h2 class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        Languages
      </h2>
      <p class="section-subtitle">Spoken languages & international communication fluency</p>
    </div>

    <div class="languages-grid">
      <div 
        v-for="lang in languages" 
        :key="lang.name" 
        class="glass-card lang-card print-break-inside-avoid"
      >
        <div class="lang-header">
          <div class="lang-identity">
            <!-- Render SVG Flag for reliable cross-platform rendering -->
            <div class="lang-flag-box" :title="lang.name">
              <!-- German Flag -->
              <svg v-if="lang.name === 'German'" class="flag-svg" viewBox="0 0 640 480" aria-hidden="true" focusable="false">
                <rect width="640" height="160" fill="#262626"/>
                <rect y="160" width="640" height="160" fill="#DA291C"/>
                <rect y="320" width="640" height="160" fill="#FFC72C"/>
              </svg>

              <!-- UK / English Flag -->
              <svg v-else-if="lang.name === 'English'" class="flag-svg" viewBox="0 0 60 30" aria-hidden="true" focusable="false">
                <rect width="60" height="30" fill="#012169"/>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2"/>
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
              </svg>

              <!-- Korean Flag -->
              <svg v-else-if="lang.name === 'Korean'" class="flag-svg" viewBox="0 0 900 600" aria-hidden="true" focusable="false">
                <rect width="900" height="600" fill="#ffffff"/>
                <g transform="translate(450,300)">
                  <path d="M-150,0 A150,150 0 0,0 150,0 A75,75 0 0,0 0,0 A75,75 0 0,1 -150,0" fill="#CD2E3A"/>
                  <path d="M150,0 A150,150 0 0,0 -150,0 A75,75 0 0,0 0,0 A75,75 0 0,1 150,0" fill="#0047A0"/>
                </g>
                <g stroke="#000000" stroke-width="22" stroke-linecap="square">
                  <g transform="translate(230,150) rotate(-33.69)">
                    <line x1="-70" y1="-30" x2="70" y2="-30"/>
                    <line x1="-70" y1="0" x2="70" y2="0"/>
                    <line x1="-70" y1="30" x2="70" y2="30"/>
                  </g>
                  <g transform="translate(670,450) rotate(-33.69)">
                    <line x1="-70" y1="-30" x2="-10" y2="-30"/><line x1="10" y1="-30" x2="70" y2="-30"/>
                    <line x1="-70" y1="0" x2="-10" y2="0"/><line x1="10" y1="0" x2="70" y2="0"/>
                    <line x1="-70" y1="30" x2="-10" y2="30"/><line x1="10" y1="30" x2="70" y2="30"/>
                  </g>
                  <g transform="translate(670,150) rotate(33.69)">
                    <line x1="-70" y1="-30" x2="-10" y2="-30"/><line x1="10" y1="-30" x2="70" y2="-30"/>
                    <line x1="-70" y1="0" x2="70" y2="0"/>
                    <line x1="-70" y1="30" x2="-10" y2="30"/><line x1="10" y1="30" x2="70" y2="30"/>
                  </g>
                  <g transform="translate(230,450) rotate(33.69)">
                    <line x1="-70" y1="-30" x2="70" y2="-30"/>
                    <line x1="-70" y1="0" x2="-10" y2="0"/><line x1="10" y1="0" x2="70" y2="0"/>
                    <line x1="-70" y1="30" x2="70" y2="30"/>
                  </g>
                </g>
              </svg>

              <!-- Emoji fallback -->
              <span v-else class="lang-flag-emoji">{{ lang.flag }}</span>
            </div>
            <h3 class="lang-name">{{ lang.name }}</h3>
          </div>
          <span class="badge lang-fluency-badge">{{ lang.fluency }}</span>
        </div>

        <div class="lang-progress-box">
          <div class="progress-labels">
            <span class="progress-title">Proficiency</span>
            <span class="progress-percent" aria-hidden="true">{{ lang.proficiency }}%</span>
          </div>
          <div
            class="progress-bar-bg"
            role="progressbar"
            :aria-valuenow="lang.proficiency"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="lang.name + ' proficiency: ' + lang.proficiency + '%'"
          >
            <div
              class="progress-bar-fill"
              :style="{ width: lang.proficiency + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cvData'

const languages = cvData.languages
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}

.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.lang-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
}

.lang-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.lang-identity {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.lang-flag-box {
  width: 38px;
  height: 28px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  background: var(--bg-secondary);
}

.flag-svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lang-flag-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.lang-name {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
}

.lang-fluency-badge {
  font-size: 0.775rem;
  white-space: nowrap;
}

.lang-progress-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.progress-title {
  color: var(--text-secondary);
}

.progress-percent {
  color: var(--accent-cyan);
  font-family: var(--font-sans);
}

.progress-bar-bg {
  height: 7px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--gradient-accent);
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 640px) {
  .languages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
