<template>
  <div
    ref="cardContainer"
    class="pokemon-card-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    @touchmove="handleTouchMove"
    @touchend="handleMouseLeave"
  >
    <div 
      class="pokemon-card"
      :class="{ 'is-active': isActive }"
      :style="cardStyle"
    >
      <!-- Background Card Texture -->
      <div class="card-background"></div>

      <!-- Card Inner Frame -->
      <div class="card-content">
        <img src="/profile-card.png" alt="Profile" />
      </div>

      <!-- Simeydotme Holo Foil Shine Layer -->
      <div class="card-shine" :style="shineStyle" aria-hidden="true"></div>

      <!-- Glare Spotlight Reflection Layer -->
      <div class="card-glare" :style="glareStyle" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const cardContainer = ref<HTMLElement | null>(null)
const isActive = ref(false)
const rotX = ref(0)
const rotY = ref(0)
const pointerX = ref(50) // percentage 0-100
const pointerY = ref(50) // percentage 0-100
const opacity = ref(0)

function handleMouseEnter() {
  isActive.value = true
  opacity.value = 1
}

function handleMouseMove(e: MouseEvent) {
  if (!cardContainer.value) return
  const rect = cardContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const px = (x / rect.width) * 100
  const py = (y / rect.height) * 100

  pointerX.value = px
  pointerY.value = py

  // Calculate tilt angle (-16deg to +16deg)
  rotX.value = ((py - 50) / 50) * -16
  rotY.value = ((px - 50) / 50) * 16
}

function handleTouchMove(e: TouchEvent) {
  if (!cardContainer.value || !e.touches[0]) return
  isActive.value = true
  opacity.value = 1
  const rect = cardContainer.value.getBoundingClientRect()
  const x = e.touches[0].clientX - rect.left
  const y = e.touches[0].clientY - rect.top
  
  const px = Math.min(Math.max((x / rect.width) * 100, 0), 100)
  const py = Math.min(Math.max((y / rect.height) * 100, 0), 100)

  pointerX.value = px
  pointerY.value = py
  rotX.value = ((py - 50) / 50) * -16
  rotY.value = ((px - 50) / 50) * 16
}

function handleMouseLeave() {
  isActive.value = false
  rotX.value = 0
  rotY.value = 0
  pointerX.value = 50
  pointerY.value = 50
  opacity.value = 0
}

const cardStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg) scale3d(${isActive.value ? 1.04 : 1}, ${isActive.value ? 1.04 : 1}, 1)`,
    transition: isActive.value ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }
})

const shineStyle = computed(() => {
  return {
    opacity: opacity.value,
    backgroundPosition: `${pointerX.value}% ${pointerY.value}%`,
    backgroundBackgroundImage: `radial-gradient(circle at ${pointerX.value}% ${pointerY.value}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%), linear-gradient(115deg, transparent 20%, rgba(255, 0, 128, 0.4) 30%, rgba(255, 230, 0, 0.4) 45%, rgba(0, 255, 200, 0.4) 60%, rgba(0, 150, 255, 0.4) 75%, transparent 90%)`
  }
})

const glareStyle = computed(() => {
  return {
    opacity: opacity.value * 0.75,
    background: `radial-gradient(circle at ${pointerX.value}% ${pointerY.value}%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)`
  }
})
</script>

<style scoped>
.pokemon-card-container {
  width: 300px;
  height: 420px;
  perspective: 1000px;
}

.pokemon-card {
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
  transform-style: preserve-3d;
  overflow: hidden;
}

.pokemon-card.is-active {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.5);
}

.card-content {
  height: 100%;
  display: flex;
}

/* SIMEYDOTME HOLO & GLARE CSS OVERLAYS */
.card-shine {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: color-dodge;
  background-size: 200% 200%;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.card-glare {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  mix-blend-mode: overlay;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.card-attribution-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.card-attribution-link:hover {
  text-decoration: underline;
}
</style>
