<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import SkillCard from './SkillCard.vue'
import ProductSelector from './ProductSelector.vue'

const skillsStore = useSkillsStore()
const { t } = useI18n()

const loggingSkillState = computed(() => skillsStore.getSkillState(Skill.TALA))
const loggingConfig = computed(() => SKILL_CONFIGS[Skill.TALA])
const selectedProduct = ref<SkillProduct | undefined>()
const cycleProgress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')

// Sincronizar producto actual si está definido
watch(() => loggingSkillState.value.currentProduct, (newProduct) => {
  if (newProduct) {
    selectedProduct.value = newProduct
  }
})

// Detectar cuando se completa un ciclo para mostrar notificación
watch(() => ({ 
  experience: loggingSkillState.value.experience,
  cycleEndTime: loggingSkillState.value.cycleEndTime
}), (newVal, oldVal) => {
  // Si la experiencia cambió, significa que se completó un ciclo
  if (newVal.experience !== oldVal?.experience && selectedProduct.value) {
    const productName = t(selectedProduct.value.i18nKey)
    showMessage(`+${selectedProduct.value.xpReward} XP | +${selectedProduct.value.quantity}x ${productName}`)
  }
}, { deep: true })

// Watcher separado para detectar cambios en cycleEndTime
watch(() => loggingSkillState.value.cycleEndTime, (newCycleEndTime, oldCycleEndTime) => {
  // Si cycleEndTime cambió de 0 a un valor positivo, significa que se inició un nuevo ciclo
  if ((oldCycleEndTime === 0 || oldCycleEndTime === undefined) && newCycleEndTime > 0) {
    // Reiniciar el loop de animación
    updateProgress()
  }
})

// Calcular progreso del ciclo
const calculateCycleProgress = () => {
  const now = Date.now()
  const endTime = loggingSkillState.value.cycleEndTime
  const startTime = loggingSkillState.value.lastCycleTime

  if (endTime === 0 || startTime === 0) return 0

  const totalDuration = endTime - startTime
  const elapsed = now - startTime
  
  // Si el ciclo está completado pero aún no procesado, mostrar 100%
  if (elapsed >= totalDuration) return 100
  
  return Math.round((elapsed / totalDuration) * 100)
}

// Actualizar progreso cada frame
const updateProgress = () => {
  const newProgress = calculateCycleProgress()
  cycleProgress.value = newProgress

  if (loggingSkillState.value.isActive) {
    requestAnimationFrame(updateProgress)
  }
}

// Iniciar tala
const startLogging = () => {
  if (!selectedProduct.value) {
    showMessage('Selecciona una madera primero')
    return
  }

  // Detener cualquier otro oficio activo
  const otherSkills = [Skill.MINERIA, Skill.FUNDICION, Skill.HERRERIA, Skill.PESCA, Skill.COCINA, Skill.AVENTURA]
  for (const skill of otherSkills) {
    const skillState = skillsStore.getSkillState(skill)
    if (skillState.isActive) {
      skillsStore.deactivateSkill(skill)
    }
  }

  const cycleDuration = selectedProduct.value.cycleDuration * 1000
  skillsStore.activateSkill(Skill.TALA, selectedProduct.value, cycleDuration)
  cycleProgress.value = 0
  updateProgress()
}

// Detener tala
const stopLogging = () => {
  skillsStore.deactivateSkill(Skill.TALA)
  cycleProgress.value = 0
}

// Mostrar notificación
const showMessage = (message: string) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Seleccionar producto
const selectProduct = (product: SkillProduct) => {
  selectedProduct.value = product
  
  // Si hay un farmeo activo, detenerlo e iniciar uno nuevo
  if (loggingSkillState.value.isActive) {
    stopLogging()
    // Usar setTimeout para asegurar que se detiene antes de iniciar el nuevo
    setTimeout(() => {
      startLogging()
    }, 100)
  } else {
    // Establecer como producto actual solo si no está activo
    skillsStore.getSkillState(Skill.TALA).currentProduct = product
  }
}

onMounted(() => {
  // Si hay un producto actualmente, seleccionarlo
  if (loggingSkillState.value.currentProduct) {
    selectedProduct.value = loggingSkillState.value.currentProduct
  } else if (loggingSkillState.value.products.length > 0) {
    selectedProduct.value = loggingSkillState.value.products[0]
  }

  // Iniciar loop de animación si estaba activo
  if (loggingSkillState.value.isActive) {
    updateProgress()
  }
})
</script>

<template>
  <div class="logging-skill">
    <div class="header">
      <h2>{{ loggingConfig.emoji }} {{ t('skills.tala.name') }}</h2>
      <p class="description">{{ t('skills.tala.description') }}</p>
    </div>

    <div class="content">
      <!-- Skill Card -->
      <SkillCard
        :skill-state="loggingSkillState"
        :is-active="loggingSkillState.isActive"
      />

      <!-- Control Panel -->
      <div class="control-panel">
        <div class="cycle-progress" v-if="loggingSkillState.isActive">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
          </div>
          <p>{{ Math.round(cycleProgress) }}%</p>
        </div>

        <div class="button-group">
          <button
            v-if="!loggingSkillState.isActive"
            class="btn btn-success"
            @click="startLogging"
          >
            🌲 Iniciar Tala
          </button>
          <button
            v-else
            class="btn btn-danger"
            @click="stopLogging"
          >
            ⏹️ Detener
          </button>
        </div>
      </div>

      <!-- Product Selector -->
      <ProductSelector
        :products="loggingSkillState.products"
        :current-product="selectedProduct"
        :player-level="loggingSkillState.level"
        :skill="loggingSkillState.skill"
        :is-active="loggingSkillState.isActive"
        @select="selectProduct"
      />

      <!-- Notification -->
      <transition name="slide-up">
        <div v-if="showNotification" class="notification">
          {{ notificationMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.logging-skill {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 12px;
}

.header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 28px;
}

.description {
  margin: 8px 0 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cycle-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.1s linear;
}

.cycle-progress p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  min-width: 30px;
  text-align: right;
}

.button-group {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-success {
  background: var(--color-success);
  color: var(--bg-dark);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(85, 255, 85, 0.3);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 85, 85, 0.3);
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--color-success);
  color: var(--bg-dark);
  padding: 16px 24px;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(85, 255, 85, 0.3);
  z-index: 100;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
