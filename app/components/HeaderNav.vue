<template>
  <header class="header-nav no-print">
    <div class="cv-container nav-content">
      <a href="#" class="brand-logo">
        <div class="logo-box">
          <img 
            v-if="personal.avatar && !imageError" 
            :src="personal.avatar" 
            :alt="personal.name"
            class="logo-img"
            @error="imageError = true"
          />
          <span v-else>JL</span>
        </div>
        <span class="logo-text">{{ personal.name }} <span class="logo-sub">/ CV</span></span>
      </a>

      <nav class="nav-links">
        <a href="#about" class="nav-link">About</a>
        <a href="#experience" class="nav-link">Experience</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#education" class="nav-link">Education</a>
        <a href="#languages" class="nav-link">Languages</a>
      </nav>

      <div class="nav-actions">
        <!-- Print CV Button -->
        <button @click="printCV" class="btn btn-secondary btn-sm" aria-label="Print or export CV as PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print CV</span>
        </button>

        <!-- Light / Dark Theme Toggle -->
        <button @click="toggleTheme" class="btn btn-secondary btn-icon" :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cvData } from '~/data/cvData'

const personal = cvData.personal
const imageError = ref(false)
const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('cv-theme', theme)
}

function printCV() {
  window.print()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('cv-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})
</script>

<style scoped>
.header-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  padding: 0.8rem 0;
  transition: all var(--transition-normal);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-weight: 700;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: var(--gradient-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 800;
  box-shadow: var(--shadow-glow);
  overflow: hidden;
  flex-shrink: 0;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.logo-text {
  font-size: 1.1rem;
}

.logo-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 400;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--accent-cyan);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
