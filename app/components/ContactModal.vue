<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay no-print" @click.self="$emit('close')">
      <div class="glass-card modal-box animate-fade-in">
        <button @click="$emit('close')" class="close-btn" title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 class="modal-title">Get In Touch</h2>
        <p class="modal-sub">Let's discuss opportunities, projects, or collaborations.</p>

        <div class="contact-quick">
          <div class="quick-item">
            <span class="quick-label">Email</span>
            <div class="quick-row">
              <span class="quick-value">{{ email }}</span>
              <button @click="copyEmail" class="btn btn-secondary btn-sm">
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
<!-- 
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label>Your Name</label>
            <input v-model="form.name" type="text" placeholder="John Doe" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Your Email</label>
            <input v-model="form.email" type="email" placeholder="john@example.com" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Message</label>
            <textarea v-model="form.message" rows="4" placeholder="Hi Jisu, I'd like to discuss a project..." required class="form-input"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="sending">
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>
          </div>
        </form>

        <div v-if="sent" class="success-toast">
          ✓ Message sent successfully! I will reply to you shortly.
        </div> -->
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { cvData } from '~/data/cvData'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const email = cvData.personal.email
const copied = ref(false)
const sending = ref(false)
const sent = ref(false)

const form = reactive({
  name: '',
  email: '',
  message: ''
})

async function copyEmail() {
  await navigator.clipboard.writeText(email)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function handleSubmit() {
  sending.value = true
  setTimeout(() => {
    sending.value = false
    sent.value = true
    setTimeout(() => {
      sent.value = false
      emit('close')
      form.name = ''
      form.email = ''
      form.message = ''
    }, 2000)
  }, 1000)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-box {
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.modal-sub {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.contact-quick {
  background: rgba(148, 163, 184, 0.08);
  border-radius: var(--radius-sm);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.quick-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
}

.quick-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.quick-value {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--accent-cyan);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.success-toast {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--accent-emerald);
  color: var(--accent-emerald);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
}
</style>
