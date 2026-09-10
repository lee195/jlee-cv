<template>
  <section id="education" class="section-container">
    <div class="education-grid">
      <!-- Education Column -->
      <div class="edu-col">
        <div class="section-header">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            Education
          </h2>
        </div>

        <div v-for="(edu, index) in education" :key="index" class="glass-card edu-card print-break-inside-avoid">
          <div class="edu-top">
            <h3 class="edu-degree">{{ edu.degree }}</h3>
            <span class="badge">{{ edu.period }}</span>
          </div>
          <p class="edu-institution">{{ edu.institution }}</p>
          <p class="edu-details">{{ edu.details }}</p>
        </div>
      </div>

      <!-- Certifications Column -->
      <div class="cert-col">
        <div class="section-header">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gradient-text">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            Certifications
          </h2>
        </div>

        <div class="cert-list">
          <div v-for="(cert, index) in certifications" :key="index" class="glass-card cert-card print-break-inside-avoid">
            <div class="cert-icon-box">★</div>
            <div class="cert-info">
              <h3 class="cert-title">{{ cert.title }}</h3>
              <p class="cert-issuer">{{ cert.issuer }} • {{ cert.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvData } from '~/data/cvData'

const education = cvData.education
const certifications = cvData.certifications
</script>

<style scoped>
.section-container {
  padding: 2.5rem 0;
}

.education-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.edu-card {
  padding: 1.5rem;
}

.edu-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.edu-degree {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
}

.edu-institution {
  color: var(--accent-cyan);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.edu-details {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cert-card {
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cert-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(56, 189, 248, 0.15);
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.cert-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.cert-issuer {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

@media (max-width: 768px) {
  .education-grid {
    grid-template-columns: 1fr;
  }
}
</style>
