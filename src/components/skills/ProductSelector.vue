<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToolsStore } from '@/stores/toolsStore'
import { useSkillsStore } from '@/stores/skillsStore'
import IconSprite from '@/components/common/IconSprite.vue'
import type { SkillProduct } from '@/types/Skill'
import type { Skill } from '@/types/Game'
import { SKILL_CONFIGS } from '@/types/Game'
import { WOODBURNING_DROP_TABLE } from '@/data/skillProducts'

interface Props {
  products: SkillProduct[]
  currentProduct?: SkillProduct
  playerLevel: number
  skill: Skill
  isActive?: boolean
  isWoodburning?: boolean
  onSelect?: (product: SkillProduct) => void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isWoodburning: false,
})

const { t } = useI18n()
const inventoryStore = useInventoryStore()
const toolsStore = useToolsStore()
const skillsStore = useSkillsStore()

const showConfirmation = ref(false)
const pendingProduct = ref<SkillProduct | undefined>()
const isDropdownOpen = ref(false)

// Inicializar la distribución de drops desde el estado guardado o con valor por defecto
const skillState = skillsStore.getSkillState(props.skill)
const dropDistribution = ref(props.skill === 'quemado' && skillState?.woodburningDropDistribution !== undefined
  ? skillState.woodburningDropDistribution
  : 50
) // 0-100: % para carbón, resto va a ceniza

const skillAction = computed((): string => {
  return t(`skills.${SKILL_CONFIGS[props.skill].name}.action`)
})

// Obtener nombre del producto - para Tala usa tree-name, para otros usa i18nKey
const getProductDisplayName = (product: SkillProduct): string => {
  // Si es Tala y el producto tiene treeId, usar tree-name
  if (props.skill === 'tala' && product.id.startsWith('madera-')) {
    return t(`resources.wood.${product.id}.tree-name`)
  }
  // Para otros skills, usar el nombre del producto
  return t(product.i18nKey)
}

const unlockedProducts = computed((): SkillProduct[] => {
  return props.products.filter(p => p.level <= props.playerLevel)
})

const lockedProducts = computed((): SkillProduct[] => {
  return props.products.filter(p => p.level > props.playerLevel)
})

const toolBonus = computed(() => {
  return toolsStore.calculateToolBonus(props.skill)
})

const finalXP = computed(() => {
  if (!props.currentProduct) return 0
  const baseXP = props.currentProduct.xpReward
  // En Quemado no hay bonuses de herramientas
  if (props.isWoodburning) return baseXP
  const calculated = baseXP * (1 + toolBonus.value.xpBonus)
  // Redondear a 1 decimal manteniendo la precisión
  return Math.round(calculated * 10) / 10
})

const finalCycleDuration = computed(() => {
  if (!props.currentProduct) return 0 // Si no hay producto actual, no hay duración de ciclo
  const baseDuration = SKILL_CONFIGS[props.skill].baseCycleDuration * 1000
  const speedReduction = toolBonus.value.speedBonus * 1000
  return Math.max(500, baseDuration - speedReduction)
})

const finalQuantity = computed(() => {
  if (!props.currentProduct) return 0
  // En Quemado siempre gastas 1 tronco, no hay bonuses
  if (props.isWoodburning) {
    return 1
  }
  return props.currentProduct.quantity + toolBonus.value.quantityBonus
})

// Calcular porcentajes dinámicos considerando el bonus de la herramienta
const carbonChancePercent = computed(() => {
  if (!props.isWoodburning || toolBonus.value.dropModifier <= 0) {
    return WOODBURNING_DROP_TABLE.carbon.chance * 100
  }
  
  // El slider distribuye el dropModifier entre carbón y ceniza
  // dropDistribution 0 = todo a carbón, 100 = todo a ceniza
  const bonusToCarbon = toolBonus.value.dropModifier * ((100 - dropDistribution.value) / 100)
  return (WOODBURNING_DROP_TABLE.carbon.chance * 100) + (bonusToCarbon * 100)
})

const ashChancePercent = computed(() => {
  if (!props.isWoodburning || toolBonus.value.dropModifier <= 0) {
    return WOODBURNING_DROP_TABLE.ceniza.chance * 100
  }
  
  // El slider distribuye el dropModifier entre carbón y ceniza
  // dropDistribution 0 = todo a carbón, 100 = todo a ceniza
  const bonusToAsh = toolBonus.value.dropModifier * (dropDistribution.value / 100)
  return (WOODBURNING_DROP_TABLE.ceniza.chance * 100) + (bonusToAsh * 100)
})

const nothingChancePercent = computed(() => {
  if (!props.isWoodburning || toolBonus.value.dropModifier <= 0) {
    return WOODBURNING_DROP_TABLE.nothing.chance * 100
  }
  
  // Nada pierde el total del bonus de drop
  // dropModifier es un decimal (0.05 = 5%)
  return (WOODBURNING_DROP_TABLE.nothing.chance * 100) - (toolBonus.value.dropModifier * 100)
})

// Calcular el step para la barra basado en dropModifier
// El rango 0-100 contiene 101 valores (0, 1, 2... 100)
// Si dropModifier = 0.10 (10%), queremos 10 posiciones: step = 100 / (10 - 1) = 11.11...
// Si dropModifier = 0.05 (5%), queremos 5 posiciones: step = 100 / (5 - 1) = 25
const sliderStep = computed(() => {
  if (toolBonus.value.dropModifier <= 0) return 1
  const numSteps = Math.round(toolBonus.value.dropModifier * 100)
  if (numSteps <= 1) return 100
  // step = 100 / (numSteps - 1) porque el rango incluye el 0 como primera posición
  return 100 / (numSteps - 1)
})

const selectProduct = (product: SkillProduct) => {
  // Si no hay farmeo activo, cambiar directamente
  if (!props.isActive || !props.currentProduct) {
    props.onSelect?.(product)
    return
  }

  // Si es el mismo producto, no hacer nada
  if (props.currentProduct.id === product.id) {
    return
  }

  // Mostrar confirmación si hay un farmeo activo y es diferente
  pendingProduct.value = product
  showConfirmation.value = true
}

const confirmSwitch = () => {
  if (pendingProduct.value) {
    props.onSelect?.(pendingProduct.value)
  }
  closeConfirmation()
}

const cancelSwitch = () => {
  closeConfirmation()
}

const closeConfirmation = () => {
  showConfirmation.value = false
  pendingProduct.value = undefined
}

// Obtener el nombre del material basado en su tipo
const getMaterialName = (itemId: string): string => {
  // Si tiene sufijo _ingot, es un lingote
  if (itemId.includes('_ingot')) {
    const baseId = itemId.replace('_ingot', '')
    const name = t(`resources.ingots.${baseId}.name`)
    if (!name.includes('.')) {
      return name
    }
  }
  
  // Intentar diferentes rutas de i18n
  const paths = [
    `resources.mineral.${itemId}.name`,
    `resources.wood.${itemId}.name`,
    `resources.ingots.${itemId}.name`,
    `resources.${itemId}.name`
  ]
  
  for (const path of paths) {
    const name = t(path)
    // Si no está traducido, devuelve la clave como fallback
    if (!name.includes('.')) {
      return name
    }
  }
  
  return itemId
}

// Watcher para actualizar la distribución de drops en el state de skills
watch(dropDistribution, (newValue) => {
  if (props.skill === 'quemado') {
    skillsStore.updateWoodburningDropDistribution(newValue)
    // Persistir cambios a localStorage
    skillsStore.saveToLocalStorage()
  }
})
</script>

<template>
  <div class="product-selector">
    <!--<h3>{{ t('ui.m_available') }}</h3>-->

    <!-- Select Dropdown para Productos Disponibles -->
    <div v-if="unlockedProducts.length > 0" class="select-wrapper">
      <!-- Dropdown trigger button -->
      <div class="select-trigger" @click="isDropdownOpen = !isDropdownOpen">
        <span class="trigger-text">
          <span v-if="currentProduct">
            {{ skillAction }} {{ getProductDisplayName(currentProduct) }} - Lvl {{ currentProduct.level }}
          </span>
          <span v-else>{{ t('ui.m_select_material') }}</span>
        </span>
        <span class="trigger-quantity" v-if="currentProduct">x{{ inventoryStore.getItemQuantity(currentProduct.item.id) }}</span>
        <span class="trigger-arrow" :class="{ open: isDropdownOpen }">▼</span>
      </div>

      <!-- Dropdown menu -->
      <div v-if="isDropdownOpen" class="select-options">
        <div class="select-option disabled">
          {{ t('ui.m_select_material') }}
        </div>
        <div
          v-for="product in unlockedProducts"
          :key="product.id"
          class="select-option"
          :class="{ selected: currentProduct?.id === product.id }"
          @click="selectProduct(product); isDropdownOpen = false"
        >
          <span class="option-text">{{ skillAction }} {{ getProductDisplayName(product) }} - Lvl {{ product.level }}</span>
          <span class="option-quantity">x{{ inventoryStore.getItemQuantity(product.item.id) }}</span>
        </div>
      </div>
    </div>

    <!-- Info del Producto Seleccionado -->
    <div v-if="currentProduct && currentProduct.level <= playerLevel" class="product-info">
      <div class="info-content">
        <div class="product-header">
          <div class="icon">
            <IconSprite 
              v-if="currentProduct.spriteId"
              :spriteId="currentProduct.spriteId"
              :fallbackEmoji="currentProduct.item.icon"
              size="ls"
            />
            <span v-else>{{ currentProduct.item.icon }}</span>
          </div>
          <div class="details">
            <h4>{{ skillAction }} {{ getProductDisplayName(currentProduct) }}</h4>
            <div class="stats-row">
              <span class="stat">{{ t('labels.level') }}: {{ currentProduct.level }}</span>
              <span class="stat">{{ typeof finalXP === 'number' && finalXP % 1 !== 0 ? finalXP.toFixed(1) : finalXP }} XP <span v-if="!isWoodburning && toolBonus.xpBonus > 0" class="bonus">+{{ Math.round(toolBonus.xpBonus * 100) }}%</span></span>
              <span v-if="isWoodburning" class="stat">x1 (gasta 1 tronco)</span>
              <span v-else class="stat">x{{ finalQuantity }} <span v-if="toolBonus.quantityBonus > 0" class="bonus">+{{ toolBonus.quantityBonus }}</span></span>
              <span class="stat">⏱️ {{ (finalCycleDuration / 1000).toFixed(1) }}s <span v-if="toolBonus.speedBonus < 0" class="bonus">{{ Math.round(toolBonus.speedBonus) }}s</span></span>
            </div>
          </div>
        </div>
        <div v-if="currentProduct.i18nDescriptionKey" class="description">
          {{ t(currentProduct.i18nDescriptionKey) }}
        </div>

        <!-- Materiales Disponibles -->
        <div v-if="currentProduct.requiredMaterials && currentProduct.requiredMaterials.length > 0" class="materials-available">
          <h5>📦 {{ t('ui.m_available') }}</h5>
          <div class="materials-grid">
            <div 
              v-for="material in currentProduct.requiredMaterials"
              :key="material.itemId"
              class="material-item"
            >
              <div class="material-name">{{ getMaterialName(material.itemId) }}</div>
              <div class="material-quantity">
                <span class="have" :class="{ insufficient: inventoryStore.getItemQuantity(material.itemId) < material.quantity }">
                  {{ inventoryStore.getItemQuantity(material.itemId) }}
                </span>
                <span class="separator">/</span>
                <span class="need">{{ material.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drops de Quemado -->
    <div v-if="isWoodburning && currentProduct" class="drops-info">
      <div class="drops-header">
        <h5>{{ t('labels.possible_drops') }}</h5>
      </div>
      <div class="drops-grid">
        <div class="drop-item">
          <div class="drop-icon">
            <IconSprite 
              v-if="WOODBURNING_DROP_TABLE.carbon.item.spriteId"
              :spriteId="WOODBURNING_DROP_TABLE.carbon.item.spriteId"
              :fallbackEmoji="WOODBURNING_DROP_TABLE.carbon.item.icon"
              size="md"
            />
            <span v-else>{{ WOODBURNING_DROP_TABLE.carbon.item.icon }}</span>
          </div>
          <div class="drop-details">
            <div class="drop-name">{{ t(WOODBURNING_DROP_TABLE.carbon.item.i18nKey || 'items.carbon') }}</div>
            <div class="drop-percentage">{{ carbonChancePercent.toFixed(0) }}%</div>
            <div class="drop-quantity">{{ t('labels.you_have') }}: x{{ inventoryStore.getItemQuantity('carbon') }}</div>
          </div>
        </div>
        <div class="drop-item">
          <div class="drop-icon">
            <IconSprite 
              v-if="WOODBURNING_DROP_TABLE.ceniza.item.spriteId"
              :spriteId="WOODBURNING_DROP_TABLE.ceniza.item.spriteId"
              :fallbackEmoji="WOODBURNING_DROP_TABLE.ceniza.item.icon"
              size="md"
            />
            <span v-else>{{ WOODBURNING_DROP_TABLE.ceniza.item.icon }}</span>
          </div>
          <div class="drop-details">
            <div class="drop-name">{{ t(WOODBURNING_DROP_TABLE.ceniza.item.i18nKey || 'items.ceniza') }}</div>
            <div class="drop-percentage">{{ ashChancePercent.toFixed(0) }}%</div>
            <div class="drop-quantity">{{ t('labels.you_have') }}: x{{ inventoryStore.getItemQuantity('ceniza') }}</div>
          </div>
        </div>
        <div class="drop-item no-drop">
          <div class="drop-icon">❌</div>
          <div class="drop-details">
            <div class="drop-name">{{ t('ui.nothing') || 'Nada' }}</div>
            <div class="drop-percentage">{{ nothingChancePercent.toFixed(0) }}%</div>
          </div>
        </div>
      </div>

      <!-- Slider para distribuir el bonus de drop -->
      <div v-if="toolBonus.dropModifier > 0" class="drop-distribution-slider">
        <div class="slider-label">
          {{ t('ui.woodburning.dropDistribution') }}
        </div>
        <div class="slider-container">
          <span class="slider-tag ash">{{ t(WOODBURNING_DROP_TABLE.carbon.item.i18nKey || 'items.carbon') }}</span>
          <input
            v-model.number="dropDistribution"
            type="range"
            min="0"
            max="100"
            :step="sliderStep"
            class="range-input"
          />
          <span class="slider-tag coal">{{ t(WOODBURNING_DROP_TABLE.ceniza.item.i18nKey || 'items.ceniza') }}</span>
        </div>
        <div class="slider-debug">
          <span>dropModifier: {{ (toolBonus.dropModifier * 100).toFixed(1) }}%</span>
          <span>distribución: {{ dropDistribution }}/100</span>
          <span>step: {{ sliderStep }}</span>
        </div>
      </div>
    </div>

    <!-- Productos Bloqueados en Acordeón -->
    <div v-if="lockedProducts.length > 0" class="locked-section">
      <h4>{{ t('ui.m_blocked') }}</h4>
      <details class="locked-details">
        <summary>👁️ {{ t('labels.blocked_materials').replace('{count}', lockedProducts.length.toString()) }}</summary>
        <div class="locked-products">
          <div
            v-for="product in lockedProducts"
            :key="product.id"
            class="locked-product-item"
          >
            <div class="lock-icon">🔒</div>
            <div class="locked-info">
              <h5>{{ t(product.i18nKey) }}</h5>
              <p>{{ t('labels.level') }}: {{ product.level }}</p>
            </div>
          </div>
        </div>
      </details>
    </div>

    <!-- Confirmación de Cambio de Producto -->
    <div v-if="showConfirmation" class="modal-overlay" @click="cancelSwitch">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('ui.m_confirm') }}</h3>
          <button class="close-btn" @click="cancelSwitch">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ t('ui.m_change_product') }}</p>
          <p class="description">{{ t('ui.m_change_product_desc') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancelSwitch">
            {{ t('ui.m_cancel') }}
          </button>
          <button class="btn btn-accept" @click="confirmSwitch">
            {{ skillAction }} {{ pendingProduct?.item.icon }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-selector {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
}

.product-selector h3 {
  margin: 0 0 8px 0;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Select Wrapper & Dropdown Styles */
.select-wrapper {
  position: relative;
  margin-bottom: 10px;
  z-index: 100;
}

.select-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg-darker);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-trigger:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.trigger-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-quantity {
  color: var(--color-primary);
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

.trigger-arrow {
  color: var(--text-secondary);
  font-size: 10px;
  transition: transform 0.2s ease;
}

.trigger-arrow.open {
  transform: rotate(180deg);
}

/* Dropdown Options Menu */
.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 10000;
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.2s ease;
  padding-bottom: 5px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.select-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-option:last-child {
  border-bottom: none;
}

.select-option:hover:not(.disabled) {
  background: rgba(255, 165, 0, 0.1);
}

.select-option.selected {
  background: rgba(85, 255, 85, 0.1);
  border-left: 3px solid var(--color-success);
  padding-left: 7px;
}

.select-option.disabled {
  color: var(--text-muted);
  cursor: default;
  pointer-events: none;
}

.option-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.option-quantity {
  color: var(--color-primary);
  font-weight: bold;
  min-width: 50px;
  text-align: right;
  font-size: 12px;
}
.product-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 6px rgba(255, 165, 0, 0.2);
}

.product-select option {
  background: var(--bg-darker);
  color: var(--text-primary);
}

/* Product Info Section */
.product-info {
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.icon {
  font-size: 24px;
  min-width: 48px;
  max-width: 48px;
  height: 48px;
  text-align: center;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.modal-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  image-rendering: pixelated;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}

.details {
  flex: 1;
  min-width: 0;
}

.details h4 {
  margin: 0 0 3px 0;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 11px;
}

.stat {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat:nth-child(2) {
  color: var(--color-success);
  font-weight: 500;
}

.stat:nth-child(3) {
  color: var(--color-warning);
  font-weight: 500;
}

.stat:nth-child(4) {
  color: var(--color-primary);
  font-weight: 500;
}

.details .bonus {
  display: inline-block;
  padding: 1px 3px;
  background: rgba(85, 255, 85, 0.2);
  color: var(--color-success);
  border-radius: 2px;
  font-size: 9px;
  font-weight: 600;
}

.description {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
  padding: 6px;
  background: var(--bg-card);
  border-left: 2px solid var(--color-primary);
  border-radius: 3px;
}

/* Materiales Disponibles */
.materials-available {
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.materials-available h5 {
  margin: 0 0 6px 0;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 6px;
}

.material-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.material-name {
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.1;
}

.material-quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
}

.material-quantity .have {
  color: var(--color-success);
}

.material-quantity .have.insufficient {
  color: var(--color-danger);
}

.material-quantity .separator {
  color: var(--text-muted);
  font-weight: normal;
}

.material-quantity .need {
  color: var(--text-secondary);
}

/* Locked Products Section */
.locked-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.locked-section h4 {
  margin: 0 0 6px 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.locked-details {
  cursor: pointer;
}

.locked-details summary {
  user-select: none;
  padding: 8px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 11px;
  transition: all 0.2s ease;
}

.locked-details summary:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.locked-details[open] summary {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}

.locked-products {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 6px;
}

.locked-product-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border-radius: 3px;
  opacity: 0.7;
}

.lock-icon {
  font-size: 16px;
  min-width: 20px;
  text-align: center;
}

.locked-info h5 {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
}

.locked-info p {
  margin: 1px 0 0 0;
  color: var(--text-muted);
  font-size: 10px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.product-item.selected {
  background: rgba(255, 165, 0, 0.12);
  border-color: var(--color-primary);
  box-shadow: 0 0 6px rgba(255, 165, 0, 0.2);
}

.product-item.locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.product-icon {
  font-size: 20px;
  min-width: 26px;
  text-align: center;
}

.product-info-old {
  flex: 1;
  min-width: 0;
}

.product-info-old h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
  word-break: break-word;
}

.level {
  margin: 1px 0 0 0;
  color: var(--text-muted);
  font-size: 10px;
}

.reward {
  margin: 1px 0 0 0;
  color: var(--color-success);
  font-size: 10px;
  font-weight: 500;
}

.product-quantity {
  text-align: right;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 11px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-card);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 16px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--color-danger);
}

.modal-body {
  margin-bottom: 12px;
}

.modal-body p {
  margin: 0;
  color: var(--text-primary);
  font-size: 12px;
  line-height: 1.4;
}

.modal-body p.description {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 11px;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: var(--bg-darker);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  border-color: var(--color-danger);
  background: rgba(255, 85, 85, 0.1);
}

.btn-accept {
  background: var(--color-primary);
  color: var(--bg-dark);
  font-weight: 600;
}

.btn-accept:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.2);
}

/* Drops Section */
.drops-info {
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 10px;
}

.drops-header {
  margin-bottom: 6px;
}

.drops-header h5 {
  margin: 0;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.drops-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.drop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 5px;
  background: rgba(255, 165, 0, 0.08);
  border: 1px solid rgba(255, 165, 0, 0.2);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.drop-item:hover {
  background: rgba(255, 165, 0, 0.15);
  border-color: var(--color-primary);
}

.drop-item.no-drop {
  background: rgba(100, 100, 100, 0.08);
  border-color: rgba(100, 100, 100, 0.2);
}

.drop-item.no-drop:hover {
  background: rgba(100, 100, 100, 0.15);
  border-color: var(--text-muted);
}

.drop-icon {
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.drop-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.drop-details {
  text-align: center;
  flex: 1;
  min-width: 0;
  width: 100%;
}

.drop-name {
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 600;
  word-break: break-word;
  margin-bottom: 2px;
  line-height: 1.2;
}

.drop-percentage {
  color: var(--color-primary);
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 2px;
}

.drop-quantity {
  color: var(--text-secondary);
  font-size: 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-item.no-drop .drop-percentage {
  color: var(--text-muted);
}

/* Estilos para el slider de distribución de drops */
.drop-distribution-slider {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 165, 0, 0.15);
}

.slider-label {
  color: var(--text-secondary);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.slider-tag {
  font-size: 9px;
  color: var(--text-secondary);
  white-space: nowrap;
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(255, 165, 0, 0.08);
  border: 1px solid rgba(255, 165, 0, 0.15);
  min-width: 40px;
  text-align: center;
}

.slider-tag.coal {
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.slider-tag.ash {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.range-input {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--color-secondary) 0%,
    var(--color-primary) 50%,
    var(--color-warning) 100%
  );
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  padding: 0;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid var(--bg-card);
  box-shadow: 0 0 4px rgba(255, 165, 0, 0.5);
  transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
  width: 16px;
  height: 16px;
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.7);
}

.range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid var(--bg-card);
  box-shadow: 0 0 4px rgba(255, 165, 0, 0.5);
  transition: all 0.2s ease;
}

.range-input::-moz-range-thumb:hover {
  width: 16px;
  height: 16px;
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.7);
}

.slider-values {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
}

.coal-value {
  color: var(--color-warning);
  font-weight: 600;
}

.ash-value {
  color: var(--color-secondary);
  font-weight: 600;
}

.slider-debug {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin-top: 6px;
  padding: 6px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.2);
  border-radius: 3px;
  font-size: 10px;
  color: var(--text-secondary);
}

.slider-debug span {
  display: flex;
  align-items: center;
  gap: 3px;
}
</style>
