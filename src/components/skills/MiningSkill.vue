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

const miningSkillState = computed(() => skillsStore.getSkillState(Skill.MINERIA))
const miningConfig = computed(() => SKILL_CONFIGS[Skill.MINERIA])
const selectedProduct = ref<SkillProduct | undefined>()
const cycleProgress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')

// Sincronizar producto actual si está definido
watch(() => miningSkillState.value.currentProduct, (newProduct) => {
  if (newProduct) {
    selectedProduct.value = newProduct
  }
})

// Detectar cuando se completa un ciclo para mostrar notificación
watch(() => ({ 
  experience: miningSkillState.value.experience,
  cycleEndTime: miningSkillState.value.cycleEndTime
}), (newVal, oldVal) => {
  // Si la experiencia cambió, significa que se completó un ciclo
  if (newVal.experience !== oldVal?.experience && selectedProduct.value) {
    const productName = t(selectedProduct.value.i18nKey)
    showMessage(`+${selectedProduct.value.xpReward} XP | +${selectedProduct.value.quantity}x ${productName}`)
  }
}, { deep: true })

// Watcher separado para detectar cambios en cycleEndTime
watch(() => miningSkillState.value.cycleEndTime, (newCycleEndTime, oldCycleEndTime) => {
  // Si cycleEndTime cambió de 0 a un valor positivo, significa que se inició un nuevo ciclo
  if ((oldCycleEndTime === 0 || oldCycleEndTime === undefined) && newCycleEndTime > 0) {
    // Reiniciar el loop de animación
    updateProgress()
  }
})

// Calcular progreso del ciclo
const calculateCycleProgress = () => {
  const now = Date.now()
  const endTime = miningSkillState.value.cycleEndTime
  const startTime = miningSkillState.value.lastCycleTime

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

  if (miningSkillState.value.isActive) {
    requestAnimationFrame(updateProgress)
  }
}

// Iniciar minería
const startMining = () => {
  if (!selectedProduct.value) {
    showMessage('Selecciona un mineral primero')
    return
  }

  // Detener cualquier otro oficio activo
  const otherSkills = [Skill.TALA, Skill.FUNDICION, Skill.HERRERIA, Skill.PESCA, Skill.COCINA, Skill.AVENTURA]
  for (const skill of otherSkills) {
    const skillState = skillsStore.getSkillState(skill)
    if (skillState.isActive) {
      skillsStore.deactivateSkill(skill)
    }
  }

  const cycleDuration = selectedProduct.value.cycleDuration * 1000
  skillsStore.activateSkill(Skill.MINERIA, selectedProduct.value, cycleDuration)
  cycleProgress.value = 0
  updateProgress()
}

// Detener minería
const stopMining = () => {
  skillsStore.deactivateSkill(Skill.MINERIA)
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
  if (miningSkillState.value.isActive) {
    stopMining()
    // Usar setTimeout para asegurar que se detiene antes de iniciar el nuevo
    setTimeout(() => {
      startMining()
    }, 100)
  } else {
    // Establecer como producto actual solo si no está activo
    skillsStore.getSkillState(Skill.MINERIA).currentProduct = product
  }
}

onMounted(() => {
  // Si hay un producto actualmente, seleccionarlo
  if (miningSkillState.value.currentProduct) {
    selectedProduct.value = miningSkillState.value.currentProduct
  } else if (miningSkillState.value.products.length > 0) {
    selectedProduct.value = miningSkillState.value.products[0]
  }

  // Iniciar loop de animación si estaba activo
  if (miningSkillState.value.isActive) {
    updateProgress()
  }
})
</script>

<template>
  <div class="mining-skill">
    <div class="header">
      <h2>{{ miningConfig.emoji }} {{ t('skills.mineria.name') }}</h2>
      <p class="description">{{ t('skills.mineria.description') }}</p>
    </div>

    <div class="content">
      <!-- Skill Card -->
      <SkillCard
        :skill-state="miningSkillState"
        :is-active="miningSkillState.isActive"
      />

      <!-- Control Panel -->
      <div class="control-panel">
        <div class="cycle-progress" v-if="miningSkillState.isActive">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
          </div>
          <p>{{ Math.round(cycleProgress) }}%</p>
        </div>

        <div class="button-group">
          <button
            v-if="!miningSkillState.isActive"
            class="btn btn-primary"
            :disabled="!selectedProduct"
            @click="startMining"
          >
            ⛏️ Iniciar Minería
          </button>
          <button
            v-else
            class="btn btn-danger"
            @click="stopMining"
          >
            ⏹️ Detener
          </button>
        </div>
      </div>

      <!-- Product Selector -->
      <ProductSelector
        :products="miningSkillState.products"
        :current-product="selectedProduct"
        :player-level="miningSkillState.level"
        :skill="miningSkillState.skill"
        :is-active="miningSkillState.isActive"
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
.mining-skill {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.cycle-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--bg-darker);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-secondary), var(--color-primary));
  transition: width 0.1s linear;
}

.cycle-progress p {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.btn {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-darker);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.1);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.btn-danger {
  background: var(--color-danger);
  color: #fff;
  border-color: var(--color-danger);
}

.btn-danger:hover {
  opacity: 0.8;
}

.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-success);
  color: #000;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 500;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
