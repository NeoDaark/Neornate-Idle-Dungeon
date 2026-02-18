<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import { LOGGING_PRODUCTS } from '@/data/skillProducts'
import type { SkillProduct } from '@/types/Skill'
import SkillCard from './SkillCard.vue'
import ProductSelector from './ProductSelector.vue'

const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()
const { t } = useI18n()

const quemadoSkillState = computed(() => skillsStore.getSkillState(Skill.QUEMADO))
const quemadoConfig = computed(() => SKILL_CONFIGS[Skill.QUEMADO])
const selectedProduct = ref<SkillProduct | undefined>()
const cycleProgress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')
const lastProcessedExperience = ref(0)

// Todos los troncos (incluyendo bloqueados)
const allLogs = computed(() => {
  return Object.values(LOGGING_PRODUCTS)
    .sort((a, b) => a.level - b.level)
})

// Troncos disponibles (filtrados por nivel del jugador)
const availableLogs = computed(() => {
  return allLogs.value.filter(product => product.level <= quemadoSkillState.value.level)
})

// Verificar que hay troncos en el inventario
const hasLogsInInventory = computed(() => {
  return availableLogs.value.some(log => inventoryStore.getItemQuantity(log.item.id) > 0)
})

// Sincronizar producto actual si está definido
watch(() => quemadoSkillState.value.currentProduct, (newProduct) => {
  if (newProduct) {
    selectedProduct.value = newProduct
  }
})

// Detectar cuando se completa un ciclo para mostrar notificación
watch(() => quemadoSkillState.value.totalExperience, (newTotalExp) => {
  // Solo procesar si la experiencia total cambió (un nuevo ciclo completado)
  if (newTotalExp > lastProcessedExperience.value && quemadoSkillState.value.currentProduct) {
    lastProcessedExperience.value = newTotalExp
    
    // Mostrar notificación con XP
    const xpGained = quemadoSkillState.value.currentProduct.xpReward
    showMessage(`+${xpGained} XP`)
  }
})

// Detectar si se detuvo por falta de troncos
watch(() => quemadoSkillState.value.isActive, (isNowActive, wasActive) => {
  if (!isNowActive && wasActive && quemadoSkillState.value.currentProduct) {
    // Cambió de activo a inactivo - mostrar mensaje de falta de material
    showMessage(`Se acabó ${t(quemadoSkillState.value.currentProduct.i18nKey)}`)
  }
})

// Watcher separado para detectar cambios en cycleEndTime
watch(() => quemadoSkillState.value.cycleEndTime, (newCycleEndTime, oldCycleEndTime) => {
  // Si cycleEndTime cambió de 0 a un valor positivo, significa que se inició un nuevo ciclo
  if ((oldCycleEndTime === 0 || oldCycleEndTime === undefined) && newCycleEndTime > 0) {
    updateProgress()
  }
})

// Calcular progreso del ciclo
const calculateCycleProgress = () => {
  const now = Date.now()
  const endTime = quemadoSkillState.value.cycleEndTime
  const startTime = quemadoSkillState.value.lastCycleTime

  if (endTime === 0 || startTime === 0) return 0

  const totalDuration = endTime - startTime
  const elapsed = now - startTime

  if (elapsed >= totalDuration) return 100

  return Math.round((elapsed / totalDuration) * 100)
}

// Actualizar progreso cada frame
const updateProgress = () => {
  const newProgress = calculateCycleProgress()
  cycleProgress.value = newProgress

  if (quemadoSkillState.value.isActive) {
    requestAnimationFrame(updateProgress)
  }
}

// Iniciar quemado
const startBurning = () => {
  if (!selectedProduct.value) {
    showMessage(t('ui.selectLog') || 'Selecciona un tronco primero')
    return
  }

  // Verificar que hay troncos en el inventario
  if (!hasLogsInInventory.value) {
    showMessage('No tienes troncos para quemar. Primero debes talar madera.')
    return
  }

  // Detener cualquier otro oficio activo
  const otherSkills = [Skill.MINERIA, Skill.TALA, Skill.FUNDICION, Skill.HERRERIA, Skill.PESCA, Skill.COCINA, Skill.AVENTURA]
  for (const skill of otherSkills) {
    const skillState = skillsStore.getSkillState(skill)
    if (skillState.isActive) {
      skillsStore.deactivateSkill(skill)
    }
  }

  // Verificar si hay un ciclo pendiente
  const quemadoState = skillsStore.getSkillState(Skill.QUEMADO)
  
  if (quemadoState.cycleEndTime === 0) {
    // No hay ciclo pendiente, crear uno nuevo
    const cycleDuration = SKILL_CONFIGS[Skill.QUEMADO].baseCycleDuration * 1000
    skillsStore.activateSkill(Skill.QUEMADO, selectedProduct.value, cycleDuration)
  } else {
    // Hay ciclo pendiente, pero puede que currentProduct se haya perdido en localStorage
    // Si es así, restaurarlo con el producto seleccionado actualmente
    if (!quemadoState.currentProduct) {
      quemadoState.currentProduct = selectedProduct.value
    }
    quemadoState.isActive = true
  }
  
  cycleProgress.value = 0
  updateProgress()
}

// Detener quemado
const stopBurning = () => {
  skillsStore.deactivateSkill(Skill.QUEMADO, true) // true = preservar cycleEndTime
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

// Seleccionar producto (tronco)
const selectProduct = (product: SkillProduct) => {
  selectedProduct.value = product
  
  // Si hay un farmeo activo, detenerlo e iniciar uno nuevo
  if (quemadoSkillState.value.isActive) {
    stopBurning()
    setTimeout(() => {
      startBurning()
    }, 100)
  } else {
    // Establecer como producto actual solo si no está activo
    skillsStore.getSkillState(Skill.QUEMADO).currentProduct = product
  }
}


onMounted(() => {
  // Si hay un producto actualmente, seleccionarlo
  if (quemadoSkillState.value.currentProduct) {
    selectedProduct.value = quemadoSkillState.value.currentProduct
  } else if (availableLogs.value.length > 0) {
    selectedProduct.value = availableLogs.value[0]
  }

  // Iniciar loop de animación si estaba activo
  if (quemadoSkillState.value.isActive) {
    updateProgress()
  }
})
</script>

<template>
  <div class="skill-view">
    <!-- Header -->
    <div class="skill-header">
      <h2>{{ quemadoConfig.emoji }} {{ t('skills.quemado.name') }}</h2>
      <p class="skill-header-desc">{{ t('skills.quemado.description') }}</p>
    </div>

    <!-- Skill Card (Stats) -->
    <SkillCard
      :skill-state="quemadoSkillState"
      :is-active="quemadoSkillState.isActive"
    />

    <!-- Control Panel -->
    <div class="skill-control-panel">
      <!-- Progress -->
      <div v-if="quemadoSkillState.isActive" class="skill-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ Math.round(cycleProgress) }}%</p>
      </div>

      <!-- Action Buttons -->
      <div class="skill-buttons">
        <button
          v-if="!quemadoSkillState.isActive"
          class="skill-btn skill-btn-primary"
          :disabled="!selectedProduct || !hasLogsInInventory"
          :title="!hasLogsInInventory ? 'Necesitas troncos en el inventario' : ''"
          @click="startBurning"
        >
          🔥 {{ t('skills.quemado.action') }}
        </button>
        <button
          v-else
          class="skill-btn skill-btn-danger"
          @click="stopBurning"
        >
          ⏹️ {{ t('ui.stop') }}
        </button>
      </div>

      <!-- Product Selector (Condicionado para Quemado) -->
      <ProductSelector
        :products="allLogs"
        :current-product="selectedProduct"
        :player-level="quemadoSkillState.level"
        :skill="quemadoSkillState.skill"
        :is-active="quemadoSkillState.isActive"
        :is-woodburning="true"
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

/* Drop Info Panel */
.drop-info-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.drop-info-panel h3 {
  margin: 0 0 15px 0;
  color: var(--color-primary);
  font-size: 1.1em;
}

.drops-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: rgba(255, 165, 0, 0.05);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
}

.drop-emoji {
  font-size: 1.5em;
  min-width: 40px;
}

.drop-name {
  flex: 1;
  font-weight: 500;
}

.drop-chance {
  color: var(--text-secondary);
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}
</style>
