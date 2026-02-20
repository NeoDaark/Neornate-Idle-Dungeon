<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useToolsStore } from '@/stores/toolsStore'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import SkillCard from './SkillCard.vue'
import ProductSelector from './ProductSelector.vue'
import IconRenderer from '@/components/common/IconRenderer.vue'

const skillsStore = useSkillsStore()
const toolsStore = useToolsStore()
const { t } = useI18n()

const loggingSkillState = computed(() => skillsStore.getSkillState(Skill.TALA))
const loggingConfig = computed(() => SKILL_CONFIGS[Skill.TALA])
const selectedProduct = ref<SkillProduct | undefined>()
const cycleProgress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')

// Obtener nombre del árbol actual
const currentTreeName = computed(() => {
  if (!selectedProduct.value) return ''
  return t(`resources.wood.${selectedProduct.value.id}.tree-name`)
})

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
    const toolBonus = toolsStore.calculateToolBonus(Skill.TALA)
    
    // Calcular valores finales con bonuses
    const finalXPCalculated = selectedProduct.value.xpReward * (1 + toolBonus.xpBonus)
    const finalXP = Math.round(finalXPCalculated * 10) / 10
    const finalQuantity = selectedProduct.value.quantity + toolBonus.quantityBonus
    
    // Mostrar notificación con valores finales
    const xpDisplay = finalXP % 1 !== 0 ? finalXP.toFixed(1) : finalXP
    const bonusText = (toolBonus.xpBonus > 0 || toolBonus.quantityBonus > 0) ? ' ⚡' : ''
    showMessage(`+${xpDisplay} XP | +${finalQuantity}x ${productName}${bonusText}`)
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

  // Siempre llamar a activateSkill para resetear cycleEndTime
  // activateSkill() ya resetea cycleEndTime = 0 al inicio, así que comienza de 0
  const cycleDuration = SKILL_CONFIGS[Skill.TALA].baseCycleDuration * 1000
  skillsStore.activateSkill(Skill.TALA, selectedProduct.value, cycleDuration)
  
  cycleProgress.value = 0
  updateProgress()
}

// Detener tala
const stopLogging = () => {
  skillsStore.deactivateSkill(Skill.TALA, true) // true = preservar cycleEndTime
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
  <div class="skill-view">
    <!-- Header -->
    <div class="skill-header">
      <IconRenderer
        :icon-id="loggingConfig.icon"
        :fa-icon="loggingConfig.faIcon"
        class="skill-icon"
      />
      <h2>{{ t('skills.tala.name') }}</h2>
      <p class="skill-header-desc">{{ t('skills.tala.description') }}</p>
    </div>

    <!-- Skill Card (Stats) -->
    <SkillCard
      :skill-state="loggingSkillState"
      :is-active="loggingSkillState.isActive"
    />

    <!-- Control Panel -->
    <div class="skill-control-panel">
      <!-- Progress -->
      <div v-if="loggingSkillState.isActive" class="skill-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="skill-buttons">
        <button
          v-if="!loggingSkillState.isActive"
          class="skill-btn skill-btn-primary"
          :disabled="!selectedProduct"
          @click="startLogging"
        >
          🌲 {{ t('skills.tala.action') }} {{ currentTreeName }}
        </button>
        <button
          v-else
          class="skill-btn skill-btn-danger"
          @click="stopLogging"
        >
          ⏹️ {{ t('ui.stop') }}
        </button>
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
