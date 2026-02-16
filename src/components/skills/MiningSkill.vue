<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useToolsStore } from '@/stores/toolsStore'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import SkillCard from './SkillCard.vue'
import ProductSelector from './ProductSelector.vue'

const skillsStore = useSkillsStore()
const toolsStore = useToolsStore()
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
    const toolBonus = toolsStore.calculateToolBonus(Skill.MINERIA)
    
    // Calcular valores finales con bonuses
    const finalXP = Math.floor(selectedProduct.value.xpReward * (1 + toolBonus.xpBonus))
    const finalQuantity = selectedProduct.value.quantity + toolBonus.quantityBonus
    
    // Mostrar notificación con valores finales
    const bonusText = (toolBonus.xpBonus > 0 || toolBonus.quantityBonus > 0) ? ' ⚡' : ''
    showMessage(`+${finalXP} XP | +${finalQuantity}x ${productName}${bonusText}`)
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

  // Verificar si hay un ciclo pendiente
  const miningState = skillsStore.getSkillState(Skill.MINERIA)
  if (miningState.cycleEndTime === 0) {
    // No hay ciclo pendiente, crear uno nuevo
    const cycleDuration = selectedProduct.value.cycleDuration * 1000
    skillsStore.activateSkill(Skill.MINERIA, selectedProduct.value, cycleDuration)
  } else {
    // Hay ciclo pendiente, solo reactivar
    miningState.isActive = true
  }
  
  cycleProgress.value = 0
  updateProgress()
}

// Detener minería
const stopMining = () => {
  skillsStore.deactivateSkill(Skill.MINERIA, true) // true = preservar cycleEndTime
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
  <div class="skill-view">
    <!-- Header -->
    <div class="skill-header">
      <h2>{{ miningConfig.emoji }} {{ t('skills.mineria.name') }}</h2>
      <p class="skill-header-desc">{{ t('skills.mineria.description') }}</p>
    </div>

    <!-- Skill Card (Stats) -->
    <SkillCard
      :skill-state="miningSkillState"
      :is-active="miningSkillState.isActive"
    />

    <!-- Control Panel -->
    <div class="skill-control-panel">
      <!-- Progress -->
      <div v-if="miningSkillState.isActive" class="skill-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ Math.round(cycleProgress) }}%</p>
      </div>

      <!-- Action Buttons -->
      <div class="skill-buttons">
        <button
          v-if="!miningSkillState.isActive"
          class="skill-btn skill-btn-primary"
          :disabled="!selectedProduct"
          @click="startMining"
        >
          ⛏️ {{ t('skills.mineria.action') }}
        </button>
        <button
          v-else
          class="skill-btn skill-btn-danger"
          @click="stopMining"
        >
          ⏹️ {{ t('ui.stop') }}
        </button>
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
    </div>

    <!-- Notification -->
    <transition name="skill-notification">
      <div v-if="showNotification" class="skill-notification">
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import '@/assets/styles/skills.css';
</style>
