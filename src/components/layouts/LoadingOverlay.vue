<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <!-- Logo -->
      <div class="logo-section">
        <h1 class="logo-title">⚔️</h1>
        <h2 class="game-title">{{ t('ui.title') }}</h2>
        <p class="subtitle">{{ t('ui.subtitle') }}</p>
      </div>

      <!-- Loading Bar -->
      <div class="loading-bar-container">
        <div class="loading-bar">
          <div class="progress" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <p class="loading-text">{{ currentMessage }}</p>
      </div>

      <!-- Loading Spinner -->
      <div class="spinner">
        <div class="spinner-inner"></div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <p class="stat-item">
          <span class="icon">📦</span>
          <span>{{ t('labels.level') }}: <strong>1</strong></span>
        </p>
        <p class="stat-item">
          <span class="icon">⚔️</span>
          <span>{{ t('labels.class') }}: <strong>{{ t('ui.subtitle') }}</strong></span>
        </p>
      </div>

      <!-- Footer -->
      <p class="version">{{ t('ui.version') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const loadingProgress = ref(0)
const currentMessage = ref('')

const loadingMessages = [
  'ui.messages.loading',
  'labels.experience',
  'labels.health',
  'skills.mineria',
  'skills.tala',
  'skills.fundicion',
]

onMounted(() => {
  // Simulamos carga con mensajes aleatorios
  const messages = loadingMessages.map(msg => t(msg))
  let messageIndex = 0

  const interval = setInterval(() => {
    loadingProgress.value += Math.random() * 30
    if (loadingProgress.value > 100) loadingProgress.value = 100

    currentMessage.value = messages[messageIndex % messages.length]
    messageIndex++
  }, 500)

  // Limpiar intervalo después de 3 segundos (el tiempo que App.vue espera)
  setTimeout(() => {
    clearInterval(interval)
    loadingProgress.value = 100
    currentMessage.value = t('ui.status.working')
  }, 3000)
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  z-index: 10000;
}

.loading-content {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

/* ============ LOGO SECTION ============ */
.logo-section {
  margin-bottom: 48px;
  animation: slideDown 0.6s ease-out;
}

.logo-title {
  font-size: 96px;
  margin: 0 0 16px 0;
  animation: bounce 2s infinite;
}

.game-title {
  font-size: 48px;
  margin: 0;
  color: var(--color-primary);
  letter-spacing: 2px;
  font-weight: bold;
}

.subtitle {
  font-size: 24px;
  margin: 8px 0 0 0;
  color: var(--color-secondary);
  letter-spacing: 1px;
}

/* ============ LOADING BAR ============ */
.loading-bar-container {
  margin: 48px 0;
  animation: slideUp 0.6s ease-out 0.2s both;
}

.loading-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 165, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.3s ease-out;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  min-height: 20px;
}

/* ============ SPINNER ============ */
.spinner {
  margin: 32px 0;
  display: flex;
  justify-content: center;
}

.spinner-inner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 165, 0, 0.2);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ============ STATS ============ */
.stats {
  margin: 32px 0;
  animation: slideUp 0.6s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 8px 0;
}

.icon {
  font-size: 18px;
}

.stat-item strong {
  color: var(--color-primary);
}

/* ============ VERSION ============ */
.version {
  font-size: 12px;
  color: var(--text-muted);
  margin: 32px 0 0 0;
}

/* ============ ANIMATIONS ============ */
@keyframes slideDown {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
