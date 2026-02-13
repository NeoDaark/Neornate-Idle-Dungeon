<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="isVisible" class="offline-harvest-notification">
        <!-- Header -->
        <div class="notification-header">
          <div class="title">
            <span class="icon">💤</span>
            <h2>{{ t('notifications.offlineHarvest') }}</h2>
          </div>
          <button class="close-btn" @click="dismiss">✕</button>
        </div>

        <!-- Content -->
        <div class="notification-content">
          <!-- Time Summary -->
          <div class="time-summary">
            <p class="time-text">
              {{ t('notifications.farmedFor') }} 
              <strong>{{ formatTimeOffline(gameStore.offlineHarvestSummary!.totalOfflineMs) }}</strong>
            </p>
          </div>

          <!-- Harvests List -->
          <div class="harvests-list">
            <div v-for="harvest in gameStore.offlineHarvestSummary!.skillHarvests" :key="harvest.skill" class="harvest-item">
              <div class="harvest-info">
                <div class="skill-name">
                  <span class="skill-icon">{{ getSkillIcon(harvest.skill) }}</span>
                  <span>{{ t(`skills.${harvest.skill.toLowerCase()}.name`) }}</span>
                </div>
                <div class="harvest-stats">
                  <span class="cycles">{{ harvest.cyclesCompleted }}x</span>
                  <span class="quantity">+{{ harvest.totalQuantity }}</span>
                  <span class="xp">+{{ harvest.totalXP }} XP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <button class="action-btn" @click="dismiss">
            {{ t('ui.continue') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useI18n } from '@/composables/useI18n'

const gameStore = useGameStore()
const { t } = useI18n()

// Mostrar notificación solo si hay resumen de farmeo
const isVisible = computed(() => {
  return gameStore.offlineHarvestSummary !== null && gameStore.offlineHarvestSummary.skillHarvests.length > 0
})

// Descartar notificación
const dismiss = () => {
  gameStore.clearOfflineHarvestSummary()
}

// Formatear tiempo offline
const formatTimeOffline = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${seconds}s`
  }
}

// Obtener icono del skill
const getSkillIcon = (skill: string): string => {
  const icons: Record<string, string> = {
    'MINERIA': '⛏️',
    'TALA': '🌲',
    'FUNDICION': '🔥',
    'HERRERIA': '🔨',
    'PESCA': '🎣',
    'COCINA': '🍳',
    'AVENTURA': '🗺️',
  }
  return icons[skill] || '⚒️'
}
</script>

<style scoped>
.offline-harvest-notification {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--bg-card) 0%, #2a2a2a 100%);
  border-top: 2px solid var(--color-primary);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid var(--border-color);
}

.title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  font-size: 1.4rem;
}

.title h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 165, 0, 0.1);
  color: var(--text-primary);
}

.notification-content {
  padding: 1rem 1.2rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-summary {
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  text-align: center;
}

.time-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.time-text strong {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.harvests-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.harvest-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  transition: background 0.2s;
}

.harvest-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.harvest-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.skill-name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.skill-icon {
  font-size: 1.2rem;
}

.skill-name span:last-child {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.harvest-stats {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.cycles {
  background: rgba(85, 255, 85, 0.15);
  color: var(--color-success);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.quantity {
  background: rgba(255, 165, 0, 0.15);
  color: var(--color-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.xp {
  background: rgba(100, 150, 255, 0.15);
  color: #6496ff;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.action-btn {
  background: var(--color-primary);
  color: #000;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  align-self: stretch;
}

.action-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

/* Transition para Vue */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .offline-harvest-notification {
    max-height: 70vh;
  }

  .harvest-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .harvest-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .notification-header {
    padding: 1rem;
  }

  .notification-content {
    padding: 0.8rem 1rem;
  }
}
</style>
