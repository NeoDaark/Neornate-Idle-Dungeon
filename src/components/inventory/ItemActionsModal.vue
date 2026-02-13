<template>
  <Teleport to="body">
    <div v-if="isOpen" class="item-actions-modal-overlay" @click.self="closeModal">
      <div class="item-actions-modal">
        <!-- Header -->
        <div class="modal-header">
          <div class="item-display">
            <span class="item-icon">{{ itemIcon }}</span>
            <div class="item-header-info">
              <h3 class="item-name">{{ itemName }}</h3>
              <p class="item-quantity">{{ t('inventory.quantity') }}: {{ itemQuantity }}</p>
            </div>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- Content Tabs -->
        <div class="modal-tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="tab-btn"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ getTabLabel(tab) }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="modal-content">
          <!-- Info Tab -->
          <div v-if="activeTab === 'info'" class="tab-pane">
            <div class="info-section">
              <p class="item-description">{{ itemDescription }}</p>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">{{ t('inventory.type.label') }}:</span>
                  <span class="value">{{ itemType }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ t('inventory.rarity.label') }}:</span>
                  <span class="value" :class="rarityColor">{{ rarityLabel }}</span>
                </div>
                <div v-if="canSell" class="info-item">
                  <span class="label">{{ t('market.sell.pricePerUnit') }}:</span>
                  <span class="value">{{ itemPrice }} 💰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sell Tab -->
          <div v-if="activeTab === 'sell' && canSell" class="tab-pane">
            <div class="sell-section">
              <div class="quantity-selector">
                <label>{{ t('inventory.actions.quantity') }}</label>
                <div class="quantity-controls">
                  <button class="qty-btn" @click="sellQuantity = Math.max(1, sellQuantity - 1)">−</button>
                  <input 
                    v-model.number="sellQuantity" 
                    type="number" 
                    min="1" 
                    :max="itemQuantity" 
                    class="qty-input"
                    @blur="validateSellQuantity"
                  />
                  <button class="qty-btn" @click="sellQuantity = Math.min(itemQuantity, sellQuantity + 1)">+</button>
                </div>
              </div>

              <div class="sell-summary">
                <div class="summary-line">
                  <span>{{ t('inventory.actions.unitPrice') }}</span>
                  <span>{{ itemPrice }} 💰</span>
                </div>
                <div class="summary-line">
                  <span>× {{ sellQuantity }}</span>
                </div>
                <div class="summary-line total">
                  <span>{{ t('inventory.actions.total') }}</span>
                  <span class="total-gold">{{ totalSellPrice }} 💰</span>
                </div>
              </div>

              <button class="btn-confirm sell-btn" @click="handleSell">
                {{ t('inventory.actions.sellConfirm') }}
              </button>
            </div>
          </div>

          <!-- Discard Tab -->
          <div v-if="activeTab === 'discard'" class="tab-pane">
            <div class="discard-section">
              <p class="warning-text">⚠️ {{ t('inventory.actions.discardWarning') }}</p>

              <div class="quantity-selector">
                <label>{{ t('inventory.actions.quantityDiscard') }}</label>
                <div class="quantity-controls">
                  <button class="qty-btn" @click="discardQuantity = Math.max(1, discardQuantity - 1)">−</button>
                  <input 
                    v-model.number="discardQuantity" 
                    type="number" 
                    min="1" 
                    :max="itemQuantity" 
                    class="qty-input"
                    @blur="validateDiscardQuantity"
                  />
                  <button class="qty-btn" @click="discardQuantity = Math.min(itemQuantity, discardQuantity + 1)">+</button>
                </div>
              </div>

              <p class="discard-summary">{{ t('inventory.actions.discardMessage') }} {{ discardQuantity }} {{ itemName }}?</p>

              <button class="btn-confirm discard-btn" @click="handleDiscard">
                {{ t('inventory.actions.discardBtn') }}
              </button>
            </div>
          </div>

          <!-- Unavailable Message -->
          <div v-if="activeTab === 'sell' && !canSell" class="tab-pane">
            <div class="unavailable-message">
              <p>{{ t('inventory.actions.cantSell') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InventoryStack } from '@/stores/inventoryStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import { RESOURCE_PRICES_MAP, getResourcePrice } from '@/data/marketData'
import { useI18n } from '@/composables/useI18n'

interface Props {
  isOpen: boolean
  itemStack: InventoryStack | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  sold: [gold: number]
  discarded: [quantity: number]
}>()

const { t } = useI18n()
const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()

const activeTab = ref<'info' | 'sell' | 'discard'>('info')
const sellQuantity = ref(1)
const discardQuantity = ref(1)

const tabs = computed(() => {
  const tabList: ('info' | 'sell' | 'discard')[] = ['info']
  if (canSell.value) tabList.push('sell')
  tabList.push('discard')
  return tabList
})

const itemStack = computed(() => props.itemStack)
const itemQuantity = computed(() => itemStack.value?.quantity || 0)
const itemIcon = computed(() => itemStack.value?.item.icon || '❓')
const itemName = computed(() => {
  if (!itemStack.value) return ''
  const id = itemStack.value.item.id
  
  // Extraer el nombre base del ID (ej: "cobre_ingot" -> "cobre")
  const baseName = id.replace(/_ingot$|_material$/, '')
  
  // Intenta obtener del i18n con el ID completo primero
  let translation = t(`items.${id}`)
  if (translation && !translation.includes('items.')) {
    return translation
  }
  
  // Si no funciona con el ID completo, intenta con el baseName
  translation = t(`items.${baseName}`)
  if (translation && !translation.includes('items.')) {
    return translation
  }
  
  // Fallback: devolver el ID
  return id
})
const itemDescription = computed(() => {
  if (!itemStack.value) return ''
  const itemId = itemStack.value.item.id
  
  // Extraer el nombre base del ID (ej: "cobre_ingot" -> "cobre")
  const baseName = itemId.replace(/_ingot$|_material$/, '')
  
  // Intentar obtener descripción de resources
  // La estructura es: resources.mineral.carbon.description, resources.ingot.cobre.description, etc.
  try {
    // Intentar con diferentes categorías de resources
    for (const category of ['mineral', 'wood', 'fish', 'food', 'ingot']) {
      // Primero intentar con el baseName (para lingotes: cobre_ingot -> cobre)
      let desc = t(`resources.${category}.${baseName}.description`)
      if (desc && !desc.includes('resources.')) {
        return desc
      }
      
      // Si no funciona, intentar con el ID completo
      desc = t(`resources.${category}.${itemId}.description`)
      if (desc && !desc.includes('resources.')) {
        return desc
      }
    }
  } catch {
    // Si falla, ignorar
  }
  
  // Fallback: mostrar el valor del item
  return itemStack.value.item.value ? `Valor: ${itemStack.value.item.value}` : 'Sin descripción'
})

const canSell = computed(() => {
  if (!itemStack.value) return false
  const resourcePrice = RESOURCE_PRICES_MAP[itemStack.value.itemId]
  return !!resourcePrice
})

const itemPrice = computed(() => {
  if (!itemStack.value) return 0
  return getResourcePrice(itemStack.value.itemId, 1)
})

const totalSellPrice = computed(() => {
  return getResourcePrice(itemStack.value?.itemId || '', sellQuantity.value)
})

const getTabLabel = (tab: string): string => {
  const labels: Record<string, string> = {
    info: t('inventory.actions.info'),
    sell: t('inventory.actions.sell'),
    discard: t('inventory.actions.discard'),
  }
  return labels[tab] || tab
}

const itemType = computed((): string => {
  if (!itemStack.value) return ''
  const typeMap: Record<string, string> = {
    resource: t('inventory.type.resource'),
    material: t('inventory.type.material'),
    equipment: t('inventory.type.equipment'),
    consumable: t('inventory.type.consumable'),
  }
  return typeMap[itemStack.value.item.type] || itemStack.value.item.type
})

const rarityColor = computed((): string => {
  if (!itemStack.value) return 'common'
  const value = itemStack.value.item.value || 0
  if (value >= 500) return 'legendary'
  if (value >= 250) return 'epic'
  if (value >= 100) return 'rare'
  if (value >= 50) return 'uncommon'
  return 'common'
})

const rarityLabel = computed((): string => {
  const colorClass = rarityColor.value
  const rarityMap: Record<string, string> = {
    common: t('inventory.rarity.common'),
    uncommon: t('inventory.rarity.uncommon'),
    rare: t('inventory.rarity.rare'),
    epic: t('inventory.rarity.epic'),
    legendary: t('inventory.rarity.legendary'),
  }
  return rarityMap[colorClass] || colorClass
})

const validateSellQuantity = () => {
  if (sellQuantity.value > itemQuantity.value) {
    sellQuantity.value = itemQuantity.value
  }
  if (sellQuantity.value < 1) {
    sellQuantity.value = 1
  }
}

const validateDiscardQuantity = () => {
  if (discardQuantity.value > itemQuantity.value) {
    discardQuantity.value = itemQuantity.value
  }
  if (discardQuantity.value < 1) {
    discardQuantity.value = 1
  }
}

const closeModal = () => {
  resetState()
  emit('close')
}

const handleSell = () => {
  if (!itemStack.value || sellQuantity.value <= 0) return
  
  // Validar que no intente vender más de lo que tiene
  if (sellQuantity.value > itemQuantity.value) {
    sellQuantity.value = itemQuantity.value
    return
  }

  const totalGold = getResourcePrice(itemStack.value.itemId, sellQuantity.value)

  // Remover del inventario
  inventoryStore.removeItem(itemStack.value.itemId, sellQuantity.value)

  // Agregar oro
  playerStore.addGold(totalGold)

  // Guardar
  playerStore.saveToStorage()
  inventoryStore.saveToStorage()

  emit('sold', totalGold)
  resetState()
  closeModal()
}

const handleDiscard = () => {
  if (!itemStack.value || discardQuantity.value <= 0) return
  
  // Validar que no intente descartar más de lo que tiene
  if (discardQuantity.value > itemQuantity.value) {
    discardQuantity.value = itemQuantity.value
    return
  }

  // Remover del inventario
  inventoryStore.removeItem(itemStack.value.itemId, discardQuantity.value)

  // Guardar
  inventoryStore.saveToStorage()

  emit('discarded', discardQuantity.value)
  resetState()
  closeModal()
}

const resetState = () => {
  activeTab.value = 'info'
  sellQuantity.value = 1
  discardQuantity.value = 1
}
</script>

<style scoped>
.item-actions-modal-overlay {
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
  padding: 16px;
}

.item-actions-modal {
  background: var(--bg-card);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 165, 0, 0.1);
}

.item-display {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.item-icon {
  font-size: 32px;
  line-height: 1;
}

.item-header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: bold;
}

.item-quantity {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-darker);
  color: var(--text-primary);
}

.modal-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-darker);
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 13px;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  padding: 12px;
  background: var(--bg-darker);
  border-radius: 4px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.info-item .label {
  color: var(--text-secondary);
  font-size: 13px;
}

.info-item .value {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 14px;
}

.info-item .value.common {
  color: #999;
}

.info-item .value.uncommon {
  color: #55ff55;
}

.info-item .value.rare {
  color: #55aaff;
}

.info-item .value.epic {
  color: #ff55ff;
}

.info-item .value.legendary {
  color: #ffaa55;
}

/* Sell Section */
.sell-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 12px;
  background: rgba(85, 255, 85, 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--color-success);
}

/* Discard Section */
.discard-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warning-text {
  margin: 0;
  color: var(--color-danger);
  font-size: 13px;
  padding: 12px;
  background: rgba(255, 85, 85, 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--color-danger);
}

.discard-summary {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 8px;
  background: var(--bg-darker);
  border-radius: 4px;
}

/* Quantity Controls */
.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-selector label {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.qty-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: var(--color-primary);
  color: var(--bg-dark);
  border-color: var(--color-primary);
}

.qty-input {
  flex: 1;
  padding: 8px 12px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 14px;
  text-align: center;
}

/* Ocultar spinner de input number */
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.qty-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Sell Summary */
.sell-summary {
  padding: 12px;
  background: var(--bg-darker);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}

.summary-line.total {
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  color: var(--text-primary);
  font-weight: bold;
}

.total-gold {
  color: var(--color-success);
  font-size: 14px;
}

/* Buttons */
.btn-confirm {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.sell-btn {
  background: var(--color-success);
  color: var(--bg-dark);
}

.sell-btn:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.discard-btn {
  background: var(--color-danger);
  color: white;
}

.discard-btn:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.unavailable-message {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
}

.unavailable-message p {
  margin: 0;
}

@media (max-width: 480px) {
  .item-actions-modal {
    max-width: 100%;
    border-radius: 8px 8px 0 0;
  }
}
</style>
