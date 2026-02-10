<template>
  <div class="home">
    <div class="container">
      <h1>{{ t('ui.title') }}</h1>
      <p class="subtitle">{{ t('ui.subtitle') }}</p>
      <div class="info">
        <p class="version">{{ t('ui.version') }}</p>
        <p class="status">{{ t('ui.status.working') }}</p>
        <p class="framework">{{ t('ui.framework') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

console.log('✓ HomeView cargado')
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  background: linear-gradient(135deg, rgba(14, 14, 14, 0) 0%, rgba(26, 26, 26, 0) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.container {
  text-align: center;
  max-width: 600px;
}

h1 {
  font-size: 64px;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  color: #ffa500;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.subtitle {
  font-size: 32px;
  margin: 0;
  color: #ff7700;
  letter-spacing: 1px;
}

.info {
  margin-top: 48px;
  padding: 24px;
  background: rgba(255, 165, 0, 0.05);
  border: 2px solid #ffa500;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.info p {
  margin: 8px 0;
  font-size: 14px;
}

.version {
  font-size: 12px;
  color: #aaa;
  font-weight: bold;
}

.status {
  color: #55ff55;
  font-weight: 600;
}

.framework {
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
</style>
