<template>
  <a 
    href="https://github.com/simeydotme/pokemon-cards-css"
    target="_blank"
    rel="noopener noreferrer"
    ref="cardContainer"
    class="pokemon-card-container"
    title="Holographic Card Effect by simeydotme/pokemon-cards-css (Click to view GitHub repo)"
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
        <!-- Top Bar: Name, HP, Type -->
        <div class="card-header">
          <div class="card-stage-name">
            <span class="stage-tag">BASIC</span>
            <span class="card-name">{{ personal.name }}</span>
          </div>
          <div class="card-hp-type">
            <span class="hp-label">HP</span>
            <span class="hp-value">700</span>
            <span class="type-icon" title="Steel / Electric Type">⚙️</span>
          </div>
        </div>

        <!-- Artwork Window (Profile Image & Frame) -->
        <div class="card-art-frame">
          <div class="art-badge">LVL 32 • SR. DEV</div>
          <div class="art-avatar">
            <img 
              v-if="personal.avatar && !imageError" 
              :src="personal.avatar" 
              :alt="personal.name"
              class="avatar-img"
              @error="imageError = true"
            />
            <div v-else class="avatar-portrait">JL</div>
          </div>
        </div>
        <div class="art-caption">NO. 195 Fullstack Engineer</div>

        <!-- Ability Section -->
        <div class="card-section ability-section">
          <div class="ability-title">
            <span class="ability-type">Ability</span>
            <span class="ability-name">AI-Driven Engineering</span>
          </div>
          <p class="ability-desc">
            Any platform in any language with AI tools.
          </p>
        </div>

        <!-- Attacks Section -->
        <div class="card-section attack-section">
          <div class="attack-row">
            <div class="attack-cost">
              <span class="energy-icon">⚡</span>
              <span class="energy-icon">⚙️</span>
            </div>
            <div class="attack-info">
              <span class="attack-name">TypeScript Blast</span>
              <span class="attack-desc">Deploys rock-solid, type-safe fullstack architectures.</span>
            </div>
            <span class="attack-damage">120</span>
          </div>

          <div class="attack-row">
            <div class="attack-cost">
              <span class="energy-icon">🔥</span>
              <span class="energy-icon">💧</span>
            </div>
            <div class="attack-info">
              <span class="attack-name">Fullstack Overdrive</span>
              <span class="attack-desc">Solves complex product challenges in record time.</span>
            </div>
            <span class="attack-damage">200</span>
          </div>
        </div>

        <!-- Card Footer Info -->
        <div class="card-footer">
          <div class="footer-stat">
            <span class="stat-title">weakness</span>
            <span class="stat-val">Bad Jokes x2</span>
          </div>
          <div class="footer-stat">
            <span class="stat-title">resistance</span>
            <span class="stat-val">Refactoring -30</span>
          </div>
          <div class="footer-stat">
            <span class="stat-title">retreat</span>
            <span class="stat-val">⚡</span>
          </div>
        </div>

        <div class="card-rarity-bar">
          <span>Illust. Jisu Lee • FX: simeydotme</span>
          <span>195/151 ★★★ Secret Rare</span>
        </div>
      </div>

      <!-- Simeydotme Holo Foil Shine Layer -->
      <div class="card-shine" :style="shineStyle"></div>

      <!-- Glare Spotlight Reflection Layer -->
      <div class="card-glare" :style="glareStyle"></div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { cvData } from '~/data/cvData'

const personal = cvData.personal
const imageError = ref(false)

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
  display: block;
  text-decoration: none;
  color: inherit;
  width: 300px;
  height: 420px;
  perspective: 1000px;
  margin: 0 auto;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
}

.pokemon-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #1e293b;
  border: 8px solid #fbbf24;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
  transform-style: preserve-3d;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: #0f172a;
}

.pokemon-card.is-active {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.5);
}

.card-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fef08a 0%, #fde047 30%, #eab308 100%);
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-stage-name {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stage-tag {
  font-size: 0.55rem;
  font-weight: 900;
  background: #0f172a;
  color: #ffffff;
  padding: 1px 4px;
  border-radius: 2px;
  letter-spacing: 0.05em;
  margin: auto;
}

.card-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.card-hp-type {
  display: flex;
  align-items: center;
  gap: 2px;
}

.hp-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #dc2626;
}

.hp-value {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.15rem;
  color: #dc2626;
}

.type-icon {
  font-size: 0.9rem;
  margin-left: 2px;
}

/* Artwork Window */
.card-art-frame {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%);
  border: 3px solid #cbd5e1;
  border-radius: 6px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.art-badge {
  position: absolute;
  top: 4px;
  left: 6px;
  background: rgba(15, 23, 42, 0.8);
  color: #38bdf8;
  font-size: 0.55rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.05em;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.art-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8 0%, #2dd4bf 50%, #a855f7 100%);
  padding: 3px;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-portrait {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0f172a;
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.75rem;
  font-weight: 900;
}

.art-caption {
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  font-size: 0.525rem;
  font-weight: 700;
  text-align: center;
  padding: 2px 6px;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 3px;
  margin-top: 1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Ability */
.ability-section {
  background: rgba(241, 245, 249, 0.9);
  border-radius: 4px;
  padding: 5px 6px;
  border-left: 3px solid #dc2626;
  margin-top: 4px;
}

.ability-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.ability-type {
  font-size: 0.55rem;
  font-weight: 900;
  color: #ffffff;
  background: #dc2626;
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}

.ability-name {
  font-size: 0.75rem;
  font-weight: 800;
  color: #0f172a;
}

.ability-desc {
  font-size: 0.625rem;
  line-height: 1.25;
  color: #334155;
}

/* Attacks */
.attack-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.attack-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 6px;
  border-radius: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.attack-cost {
  display: flex;
  gap: 1px;
  width: 36px;
}

.energy-icon {
  font-size: 0.65rem;
}

.attack-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
}

.attack-name {
  font-size: 0.725rem;
  font-weight: 800;
  color: #0f172a;
}

.attack-desc {
  font-size: 0.55rem;
  color: #475569;
  line-height: 1.1;
}

.attack-damage {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: #0f172a;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-around;
  background: rgba(226, 232, 240, 0.8);
  padding: 3px 0;
  border-radius: 3px;
  margin-top: 4px;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-title {
  font-size: 0.475rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
}

.stat-val {
  font-size: 0.55rem;
  font-weight: 700;
  color: #0f172a;
}

.card-rarity-bar {
  display: flex;
  justify-content: space-between;
  font-size: 0.475rem;
  font-weight: 700;
  color: #475569;
  padding-top: 2px;
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
</style>
