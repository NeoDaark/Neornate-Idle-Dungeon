<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useSkillsStore } from '@/stores/skillsStore'
import { useI18n } from '@/composables/useI18n'
import { SKILL_CONFIGS } from '@/types/Game'

const playerStore = usePlayerStore()
const skillsStore = useSkillsStore()
const { t } = useI18n()

// Forzar actualización periódica
const now = ref(Date.now())
let updateInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    now.value = Date.now()
  }, 100) // Actualizar cada 100ms
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})

const playerLevel = computed(() => playerStore.player.level)
const playerExp = computed(() => playerStore.player.experience)

// Calcular XP necesario para siguiente nivel (fórmula: 100 + nivel*50)
const nextLevelXP = computed(() => {
  const level = playerLevel.value
  return 100 + (level * 50)
})

// Progreso XP en porcentaje
const expProgress = computed(() => {
  const next = nextLevelXP.value
  return Math.round((playerExp.value / next) * 100)
})

// Skill activo actual
const activeSkill = computed(() => {
  return skillsStore.activeSkills[0] || null
})

const skillConfig = computed(() => {
  if (!activeSkill.value) return null
  return SKILL_CONFIGS[activeSkill.value.skill]
})

const skillName = computed(() => {
  if (!skillConfig.value) return ''
  return t(`skills.${skillConfig.value.name}.name`)
})

// Progreso del skill activo (ciclo actual)
const skillProgress = computed(() => {
  if (!activeSkill.value || !activeSkill.value.currentProduct) return 0
  
  // Usar now.value para forzar re-compute
  const current = now.value
  const cycleEndTime = activeSkill.value.cycleEndTime
  const cycleDuration = activeSkill.value.currentProduct.cycleDuration * 1000 // convertir a ms
  const cycleStartTime = cycleEndTime - cycleDuration
  
  const elapsed = Math.max(0, current - cycleStartTime)
  const progress = Math.min(100, Math.round((elapsed / cycleDuration) * 100))
  
  return progress
})
</script>

<template>
  <div class="player-info">
    <!-- Nivel y Experiencia -->
    <div class="info-section level-section">
      <span class="label">Lvl</span>
      <span class="value">{{ playerLevel }}</span>
      <div class="exp-bar-small">
        <div class="exp-fill" :style="{ width: expProgress + '%' }"></div>
      </div>
      <span class="exp-text">{{ expProgress }}%</span>
    </div>

    <!-- Skill activo -->
    <div v-if="skillConfig" class="info-section skill-section active-work">
      <span class="label">{{ skillConfig.emoji }}</span>
      <div class="skill-info">
        <span class="value">{{ skillName }}</span>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" :style="{ width: skillProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.info-section {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.label {
  color: var(--text-secondary);
  font-weight: 600;
}

.value {
  color: var(--color-primary);
  font-weight: 600;
}

.exp-bar-small {
  width: 60px;
  height: 3px;
  background: rgba(255, 165, 0, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.3s ease;
}

.exp-text {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.skill-section {
  border-left: 1px solid var(--border-color);
  padding-left: 12px;
}

/* Fondo verde transparente para indicar trabajo activo */
.active-work {
  background: rgba(85, 255, 85, 0.15);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  margin-left: 4px;
  border-left: none;
  padding-left: 8px;
  gap: 8px;
  flex-wrap: wrap;
}

.skill-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 100px;
}

.skill-progress-bar {
  width: 80px;
  height: 2px;
  background: rgba(85, 255, 85, 0.3);
  border-radius: 1px;
  overflow: hidden;
}

.skill-progress-fill {
  height: 100%;
  background: var(--color-success);
  transition: width 0.3s ease;
}

/* Animación pulso para skill activo */
.skill-section .label {
  animation: pulse 1.5s ease-in-out infinite;
  display: inline-block;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.08);
  }
}
</style>
