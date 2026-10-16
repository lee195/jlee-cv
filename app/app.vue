<template>
  <div class="cv-app">
    <!-- Floating Header Navbar -->
    <HeaderNav />

    <!-- Main Container -->
    <main class="cv-container">
      <!-- Hero / Profile Card -->
      <HeroSection @open-contact="isContactOpen = true" />

      <!-- Career Experience Timeline -->
      <ExperienceTimeline />

      <!-- Featured Projects Portfolio -->
      <ProjectsGrid />

      <!-- Education & Certifications -->
      <EducationSection />

      <!-- Spoken Languages -->
      <LanguagesSection />
    </main>

    <!-- Footer -->
    <footer class="footer no-print">
      <div class="cv-container footer-content">
        <p>© {{ currentYear }} Jisu Lee. Built with Nuxt 4 & Bun.</p>
        <div class="footer-links">
          <button type="button" class="term-hint" @click="terminal?.open()">
            psst, try <kbd>{{ shortcut }}</kbd>
          </button>
          <a href="#about">Back to top ↑</a>
        </div>
      </div>
    </footer>

    <!-- Contact Modal -->
    <ContactModal :is-open="isContactOpen" @close="isContactOpen = false" />

    <!-- Tetris easter egg: lazy chunk + game files, fetched only when triggered -->
    <LazyTetrisModal v-if="tetrisOpen" @close="tetrisOpen = false" />

    <!-- ⌘K / Ctrl+K terminal -->
    <CommandTerminal ref="terminal" @open-contact="isContactOpen = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderNav from '~/components/HeaderNav.vue'
import HeroSection from '~/components/HeroSection.vue'
import ExperienceTimeline from '~/components/ExperienceTimeline.vue'
import ProjectsGrid from '~/components/ProjectsGrid.vue'
import EducationSection from '~/components/EducationSection.vue'
import LanguagesSection from '~/components/LanguagesSection.vue'
import ContactModal from '~/components/ContactModal.vue'
import CommandTerminal from '~/components/CommandTerminal.vue'
import { useTetrisTrigger } from '~/composables/useTetrisTrigger'

const isContactOpen = ref(false)
const currentYear = new Date().getFullYear()
const terminal = ref<InstanceType<typeof CommandTerminal> | null>(null)
const shortcut = ref('Ctrl K')
const { open: tetrisOpen } = useTetrisTrigger()

onMounted(() => {
  if (/Mac|iPhone|iPad/.test(navigator.platform)) shortcut.value = '⌘K'
})
</script>

<style scoped>
.cv-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: 4rem;
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  background: var(--bg-glass);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.term-hint {
  background: none;
  border: none;
  font: inherit;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.term-hint:hover {
  color: var(--accent-cyan);
}

.term-hint kbd {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 0.1rem 0.4rem;
  border: 1px solid var(--border-color);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-secondary);
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--accent-cyan);
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
