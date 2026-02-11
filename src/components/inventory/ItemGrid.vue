<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { InventoryStack } from '@/stores/inventoryStore'

interface Props {
  items: InventoryStack[]
}

defineProps<Props>()
defineEmits<{
  'unequip-item': [slot: string]
}>()

const { t } = useI18n()

const getItemColor = (value: number) => {
  if (value >= 500) return 'legendary'
  if (value >= 250) return 'epic'
  if (value >= 100) return 'rare'
  if (value >= 50) return 'uncommon'
  return 'common'
}

const getItemName = (stack: InventoryStack): string => {
  const itemId = stack.itemId

  // Si tiene sufijo _ingot, es un lingote
  if (itemId.includes('_ingot')) {
    const baseId = itemId.replace('_ingot', '')
    return t(`resources.ingots.${baseId}.name`)
  }

  // Determinar la ruta de i18n según el tipo
  // Primero intentar con recursos minerales
  if (itemId.includes('carbon') || itemId.includes('cobre') || itemId.includes('hierro') || 
      itemId.includes('plata') || itemId.includes('tungsteno') || itemId.includes('oro') ||
      itemId.includes('platino') || itemId.includes('obsidiana') || itemId.includes('cobalto') ||
      itemId.includes('mithril') || itemId.includes('oricalco') || itemId.includes('adamantita') ||
      itemId.includes('titanio') || itemId.includes('draconita')) {
    return t(`resources.mineral.${itemId}.name`)
  }

  // Intentar con maderas
  if (itemId.includes('madera') || itemId.includes('roble') || itemId.includes('nogal') ||
      itemId.includes('caoba') || itemId.includes('ebano') || itemId.includes('petreo') ||
      itemId.includes('ancestral') || itemId.includes('cristalina') || itemId.includes('magica') ||
      itemId.includes('sagrada') || itemId.includes('primordial') || itemId.includes('dimensional') ||
      itemId.includes('divina')) {
    return t(`resources.wood.${itemId}.name`)
  }

  // Fallback
  return itemId
}
</script>

<template>
  <div class="item-grid">
    <div
      v-for="stack in items"
      :key="stack.itemId"
      class="item-card"
      :class="`rarity-${getItemColor(stack.item.value)}`"
    >
      <div class="card-icon">{{ stack.item.icon }}</div>

      <div class="card-content">
        <p class="item-name">{{ getItemName(stack) }}</p>
      </div>

      <div class="quantity-badge">
        <span>x{{ stack.quantity }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
}

.item-card {
  background: var(--bg-darker);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  position: relative;
  height: max-content;
}

.item-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.item-card.rarity-common {
  border-color: var(--border-color);
}

.item-card.rarity-uncommon {
  border-color: var(--color-success);
}

.item-card.rarity-rare {
  border-color: #4169e1;
}

.item-card.rarity-epic {
  border-color: #9932cc;
}

.item-card.rarity-legendary {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.08);
}

.card-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.card-content {
  min-width: 0;
  flex-shrink: 0;
}

.item-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.2;
  max-height: 2.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.quantity-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--color-primary);
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
