<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToolsStore } from '@/stores/toolsStore'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import SkillCard from './SkillCard.vue'
import ProductSelector from './ProductSelector.vue'

const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()
const toolsStore = useToolsStore()
const { t } = useI18n()

const smeltingSkillState = computed(() => skillsStore.getSkillState(Skill.FUNDICION))
const smeltingConfig = computed(() => SKILL_CONFIGS[Skill.FUNDICION])
const selectedProduct = ref<SkillProduct | undefined>()
const cycleProgress = ref(0)
const showNotification = ref(false)
const notificationMessage = ref('')

// Sincronizar producto actual si está definido
watch(() => smeltingSkillState.value.currentProduct, (newProduct) => {
  if (newProduct) {
    selectedProduct.value = newProduct
  }
})

// Detectar cuando se completa un ciclo para mostrar notificación
watch(() => ({
  experience: smeltingSkillState.value.experience,
  cycleEndTime: smeltingSkillState.value.cycleEndTime
}), (newVal, oldVal) => {
  // Si la experiencia cambió, significa que se completó un ciclo
  if (newVal.experience !== oldVal?.experience && selectedProduct.value) {
    const productName = t(selectedProduct.value.i18nKey)
    const toolBonus = toolsStore.calculateToolBonus(Skill.FUNDICION)
    
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
watch(() => smeltingSkillState.value.cycleEndTime, (newCycleEndTime, oldCycleEndTime) => {
  if ((oldCycleEndTime === 0 || oldCycleEndTime === undefined) && newCycleEndTime > 0) {
    updateProgress()
  }
})

// Calcular progreso del ciclo
const calculateCycleProgress = () => {
  const now = Date.now()
  const endTime = smeltingSkillState.value.cycleEndTime
  const startTime = smeltingSkillState.value.lastCycleTime

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

  if (smeltingSkillState.value.isActive) {
    requestAnimationFrame(updateProgress)
  }
}

// Chequear si podemos fundir (tenemos los materiales)
const canSmelt = computed(() => {
  if (!selectedProduct.value || !selectedProduct.value.requiredMaterials) {
    return true // Si no requiere materiales, podemos
  }

  return selectedProduct.value.requiredMaterials.every((mat) => {
    return inventoryStore.getItemQuantity(mat.itemId) >= mat.quantity
  })
})

// Iniciar fundición
const startSmelting = () => {
  if (!selectedProduct.value) {
    showMessage('Selecciona un mineral primero')
    return
  }

  if (!canSmelt.value) {
    showMessage('No tienes los materiales necesarios')
    return
  }

  // Detener cualquier otro oficio activo
  const otherSkills = [Skill.MINERIA, Skill.TALA, Skill.HERRERIA, Skill.PESCA, Skill.COCINA, Skill.AVENTURA]
  for (const skill of otherSkills) {
    const skillState = skillsStore.getSkillState(skill)
    if (skillState.isActive) {
      skillsStore.deactivateSkill(skill)
    }
  }

  // Siempre llamar a activateSkill para resetear cycleEndTime
  // activateSkill() ya resetea cycleEndTime = 0 al inicio, así que comienza de 0
  const cycleDuration = SKILL_CONFIGS[Skill.FUNDICION].baseCycleDuration * 1000
  skillsStore.activateSkill(Skill.FUNDICION, selectedProduct.value, cycleDuration)
  
  cycleProgress.value = 0
  updateProgress()
}

// Detener fundición
const stopSmelting = () => {
  skillsStore.deactivateSkill(Skill.FUNDICION, true) // true = preservar cycleEndTime
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

  if (smeltingSkillState.value.isActive) {
    stopSmelting()
    setTimeout(() => {
      startSmelting()
    }, 100)
  } else {
    skillsStore.getSkillState(Skill.FUNDICION).currentProduct = product
  }
}

onMounted(() => {
  if (smeltingSkillState.value.currentProduct) {
    selectedProduct.value = smeltingSkillState.value.currentProduct
  } else if (smeltingSkillState.value.products.length > 0) {
    selectedProduct.value = smeltingSkillState.value.products[0]
  }

  if (smeltingSkillState.value.isActive) {
    updateProgress()
  }
})
</script>

<template>
  <div class="skill-view">
    <!-- Header -->
    <div class="skill-header">
      <h2>{{ smeltingConfig.emoji }} {{ t('skills.fundicion.name') }}</h2>
      <p class="skill-header-desc">{{ t('skills.fundicion.description') }}</p>
    </div>

    <!-- Skill Card (Stats) -->
    <SkillCard
      :skill-state="smeltingSkillState"
      :is-active="smeltingSkillState.isActive"
    />

    <!-- Control Panel -->
    <div class="skill-control-panel">
      <!-- Progress -->
      <div v-if="smeltingSkillState.isActive" class="skill-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: cycleProgress + '%' }"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="skill-buttons">
        <button
          v-if="!smeltingSkillState.isActive"
          class="skill-btn skill-btn-primary"
          :disabled="!selectedProduct || !canSmelt"
          @click="startSmelting"
        >
          🔥 {{ t('skills.fundicion.action') }}
        </button>
        <button
          v-else
          class="skill-btn skill-btn-danger"
          @click="stopSmelting"
        >
          ⏹️ {{ t('ui.stop') }}
        </button>
      </div>

      <!-- Product Selector -->
      <ProductSelector
        :products="smeltingSkillState.products"
        :current-product="selectedProduct"
        :player-level="smeltingSkillState.level"
        :skill="smeltingSkillState.skill"
        :is-active="smeltingSkillState.isActive"
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

/* Warning section for missing materials */
.skill-warning {
  padding: 10px;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid var(--color-danger);
  border-radius: 4px;
  font-size: 11px;
}

.warning-title {
  margin: 0 0 6px 0;
  color: var(--color-danger);
  font-weight: 600;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  color: var(--text-secondary);
  font-size: 11px;
}

.mat-name {
  flex: 1;
}

.mat-qty {
  font-weight: 600;
  color: var(--color-success);
  min-width: 40px;
  text-align: right;
}

.mat-qty.insufficient {
  color: var(--color-danger);
}
</style>
