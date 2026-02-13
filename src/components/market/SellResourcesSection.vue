<template>
  <div class="sell-resources-section">
    <h2 class="section-title">
      {{ t('market.sell.title') }}
    </h2>

    <div v-if="sellableResources.length > 0" class="sell-grid">
      <div v-for="resource in sellableResources" :key="resource.resourceId" class="sell-card">
        <div class="sell-header">
          <span class="resource-icon">{{ resource.icon }}</span>
          <div class="resource-info">
            <h3 class="resource-name">{{ resource.name }}</h3>
            <p class="quantity">{{ t('market.sell.inventory') }}: {{ getResourceQuantity(resource.resourceId) }}</p>
          </div>
        </div>

        <p class="resource-description">{{ resource.description }}</p>

        <div class="sell-footer">
          <div class="price-info">
            <span class="price-label">{{ t('market.sell.pricePerUnit') }}</span>
            <span class="price-value">{{ resource.basePricePerUnit }} 💰</span>
          </div>

          <div class="sell-controls">
            <input
              v-model.number="sellQuantities[resource.resourceId]"
              type="number"
              min="1"
              :max="getResourceQuantity(resource.resourceId)"
              class="quantity-input"
            />
            <button
              class="btn-sell"
              @click="handleSell(resource.resourceId)"
              :disabled="!canSell(resource.resourceId)"
            >
              {{ t('market.sell.sell') }}
            </button>
          </div>

          <div class="total-price">
            <span class="label">{{ t('market.sell.total') }}:</span>
            <span class="value">{{ getTotalPrice(resource) }} 💰</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-resources">
      <p>{{ t('market.sell.noResources') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ResourcePrice } from '@/data/marketData'
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import { RESOURCE_PRICES_MAP, getResourcePrice } from '@/data/marketData'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()

const sellQuantities = ref<Record<string, number>>({})

// Inicializar cantidades en 1
Object.keys(RESOURCE_PRICES_MAP).forEach((resourceId) => {
  sellQuantities.value[resourceId] = 1
})

const sellableResources = computed(() => {
  const resources: ResourcePrice[] = []
  
  Object.values(RESOURCE_PRICES_MAP).forEach((resource) => {
    if (getResourceQuantity(resource.resourceId) > 0) {
      resources.push(resource)
    }
  })
  
  return resources
})

const getResourceQuantity = (resourceId: string): number => {
  return inventoryStore.getItemQuantity(resourceId)
}

const getTotalPrice = (resource: ResourcePrice): number => {
  const quantity = sellQuantities.value[resource.resourceId] || 1
  return getResourcePrice(resource.resourceId, quantity)
}

const canSell = (resourceId: string): boolean => {
  const quantity = sellQuantities.value[resourceId] || 0
  return quantity > 0 && quantity <= getResourceQuantity(resourceId)
}

const handleSell = (resourceId: string) => {
  const quantity = sellQuantities.value[resourceId]
  if (!canSell(resourceId)) return

  const totalPrice = getResourcePrice(resourceId, quantity)

  // Remover del inventario
  inventoryStore.removeItem(resourceId, quantity)

  // Agregar oro
  playerStore.addGold(totalPrice)

  // Guardar
  playerStore.saveToStorage()
  inventoryStore.saveToStorage()

  // Resetear cantidad
  sellQuantities.value[resourceId] = 1

  const message = `${t('market.sell.success')}: +${totalPrice} 💰`
  alert(message)
}
</script>

<style scoped>
.sell-resources-section {
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.section-title {
  color: var(--color-success);
  margin: 0 0 20px;
  font-size: 18px;
}

.sell-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.sell-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sell-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.resource-icon {
  font-size: 24px;
  line-height: 1;
}

.resource-info {
  flex: 1;
}

.resource-name {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: bold;
}

.quantity {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.resource-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 8px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.sell-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  color: var(--text-muted);
  font-size: 12px;
}

.price-value {
  color: var(--color-success);
  font-weight: bold;
  font-size: 14px;
}

.sell-controls {
  display: flex;
  gap: 8px;
}

.quantity-input {
  width: 60px;
  padding: 6px 8px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 13px;
}

.quantity-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-sell {
  flex: 1;
  padding: 6px 12px;
  background: var(--color-success);
  color: var(--bg-dark);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sell:hover:not(:disabled) {
  transform: scale(1.05);
  opacity: 0.9;
}

.btn-sell:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.total-price {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  font-weight: 500;
}

.label {
  color: var(--text-secondary);
  font-size: 13px;
}

.value {
  color: var(--color-primary);
  font-size: 14px;
}

.no-resources {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.no-resources p {
  margin: 0;
}

@media (max-width: 768px) {
  .sell-grid {
    grid-template-columns: 1fr;
  }

  .sell-controls {
    flex-direction: column;
  }
}
</style>
