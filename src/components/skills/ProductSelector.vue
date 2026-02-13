<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToolsStore } from '@/stores/toolsStore'
import type { SkillProduct } from '@/types/Skill'
import type { Skill } from '@/types/Game'
import { SKILL_CONFIGS } from '@/types/Game'

interface Props {
  products: SkillProduct[]
  currentProduct?: SkillProduct
  playerLevel: number
  skill: Skill
  isActive?: boolean
  onSelect?: (product: SkillProduct) => void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const { t } = useI18n()
const inventoryStore = useInventoryStore()
const toolsStore = useToolsStore()

const showConfirmation = ref(false)
const pendingProduct = ref<SkillProduct | undefined>()

const skillAction = computed((): string => {
  return t(`skills.${SKILL_CONFIGS[props.skill].name}.action`)
})

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
  return Math.floor(baseXP * (1 + toolBonus.value.xpBonus))
})

const finalCycleDuration = computed(() => {
  if (!props.currentProduct) return 0
  const baseDuration = props.currentProduct.cycleDuration * 1000
  const speedReduction = toolBonus.value.speedBonus * 1000
  return Math.max(500, baseDuration - speedReduction)
})

const finalQuantity = computed(() => {
  if (!props.currentProduct) return 0
  return props.currentProduct.quantity + toolBonus.value.quantityBonus
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
</script>

<template>
  <div class="product-selector">
    <h3>{{ t('ui.m_available') }}</h3>

    <!-- Select Dropdown para Productos Disponibles -->
    <div v-if="unlockedProducts.length > 0" class="select-wrapper">
      <select
        :value="currentProduct?.id || ''"
        @change="(e) => {
          const selectedId = (e.target as HTMLSelectElement).value
          const product = unlockedProducts.find(p => p.id === selectedId)
          if (product) selectProduct(product)
        }"
        class="product-select"
      >
        <option value="" disabled>{{ t('ui.m_select_material') }}</option>
        <option v-for="product in unlockedProducts" :key="product.id" :value="product.id">
          {{ skillAction }} {{ t(product.i18nKey) }} - {{ t('labels.level') }} {{ product.level }}
        </option>
      </select>
    </div>

    <!-- Info del Producto Seleccionado -->
    <div v-if="currentProduct && currentProduct.level <= playerLevel" class="product-info">
      <div class="info-content">
        <div class="product-header">
          <div class="icon">{{ currentProduct.item.icon }}</div>
          <div class="details">
            <h4>{{ skillAction }} {{ t(currentProduct.i18nKey) }}</h4>
            <div class="stats-row">
              <span class="stat">{{ t('labels.level') }}: {{ currentProduct.level }}</span>
              <span class="stat">{{ finalXP }} XP <span v-if="toolBonus.xpBonus > 0" class="bonus">+{{ Math.round(toolBonus.xpBonus * 100) }}%</span></span>
              <span class="stat">x{{ finalQuantity }} <span v-if="toolBonus.quantityBonus > 0" class="bonus">+{{ toolBonus.quantityBonus }}</span></span>
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
  border-radius: 8px;
  padding: 16px;
}

.product-selector h3 {
  margin: 0 0 16px 0;
  color: var(--color-primary);
  font-size: 18px;
}

/* Select Dropdown Styles */
.product-select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-darker);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.product-select:hover {
  border-color: var(--color-primary);
}

.product-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.3);
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
  padding: 12px;
  margin-bottom: 16px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.icon {
  font-size: 32px;
  min-width: 40px;
  text-align: center;
  line-height: 1;
}

.details {
  flex: 1;
  min-width: 0;
}

.details h4 {
  margin: 0 0 4px 0;
  color: var(--text-primary);
  font-size: 16px;
  word-break: break-word;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  font-size: 12px;
}

.stat {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
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
  padding: 1px 4px;
  background: rgba(85, 255, 85, 0.2);
  color: var(--color-success);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

.description {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
  padding: 8px;
  background: var(--bg-card);
  border-left: 2px solid var(--color-primary);
  border-radius: 4px;
}

/* Materiales Disponibles */
.materials-available {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.materials-available h5 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.material-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.material-name {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.2;
}

.material-quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
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
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.locked-section h4 {
  margin: 0 0 8px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.locked-details {
  cursor: pointer;
}

.locked-details summary {
  user-select: none;
  padding: 10px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 13px;
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
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 8px;
}

.locked-product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  opacity: 0.7;
}

.lock-icon {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
}

.locked-info h5 {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}

.locked-info p {
  margin: 2px 0 0 0;
  color: var(--text-muted);
  font-size: 11px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.product-item.selected {
  background: rgba(255, 165, 0, 0.15);
  border-color: var(--color-primary);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.3);
}

.product-item.locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.product-icon {
  font-size: 24px;
  min-width: 32px;
  text-align: center;
}

.product-info-old {
  flex: 1;
  min-width: 0;
}

.product-info-old h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  word-break: break-word;
}

.level {
  margin: 2px 0 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.reward {
  margin: 2px 0 0 0;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 500;
}

.product-quantity {
  text-align: right;
  color: var(--text-secondary);
  font-weight: 500;
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
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
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
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 24px;
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
  margin-bottom: 24px;
}

.modal-body p {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.modal-body p.description {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
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
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}
</style>
