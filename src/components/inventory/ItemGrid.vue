<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import IconSprite from '@/components/common/IconSprite.vue'
import { LOGGING_PRODUCTS } from '@/data/skillProducts/logging'
import { MINING_PRODUCTS } from '@/data/skillProducts/mining'
import type { InventoryStack } from '@/stores/inventoryStore'

interface Props {
  items: InventoryStack[]
}

defineProps<Props>()
const emit = defineEmits<{
  'unequip-item': [slot: string]
  'item-action': [stack: InventoryStack]
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

  // Ceniza (ash) - caso especial
  if (itemId === 'ceniza') {
    return t('resources.ash.ceniza.name')
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

const handleItemAction = (stack: InventoryStack) => {
  emit('item-action', stack)
}
</script>

<template>
  <div class="item-list">
    <div
      v-for="stack in items"
      :key="stack.itemId"
      class="item-row"
      :class="`rarity-${getItemColor(stack.item.value)}`"
    >
      <div class="item-icon">
        <IconSprite 
          v-if="stack.item.logSpriteId"
          :spriteId="stack.item.logSpriteId"
          spriteType="log"
          :fallbackEmoji="stack.item.icon"
          size="ls"
        />
        <IconSprite 
          v-else-if="stack.item.mineralSpriteId"
          :spriteId="stack.item.mineralSpriteId"
          spriteType="mineral"
          :fallbackEmoji="stack.item.icon"
          size="ls"
        />
        <IconSprite 
          v-else-if="stack.itemId.includes('_ingot') && typeof stack.item.icon === 'string' && stack.item.icon.includes('ingot')"
          :spriteId="stack.item.icon.split('/').pop()?.replace('.png', '')"
          spriteType="ingot"
          :fallbackEmoji="'⚙️'"
          size="ls"
        />
        <IconSprite 
          v-else-if="LOGGING_PRODUCTS[stack.itemId]?.logSpriteId"
          :spriteId="LOGGING_PRODUCTS[stack.itemId].logSpriteId"
          spriteType="log"
          :fallbackEmoji="stack.item.icon"
          size="ls"
        />
        <IconSprite 
          v-else-if="MINING_PRODUCTS[stack.itemId]?.mineralSpriteId"
          :spriteId="MINING_PRODUCTS[stack.itemId].mineralSpriteId"
          spriteType="mineral"
          :fallbackEmoji="stack.item.icon"
          size="ls"
        />
        <span v-else>{{ stack.item.icon }}</span>
      </div>

      <div class="item-info">
        <p class="item-name">{{ getItemName(stack) }}</p>
        <p class="item-quantity">x{{ stack.quantity }}</p>
      </div>

      <button
        class="item-actions-btn"
        @click="handleItemAction(stack)"
        :title="t('inventory.actions.title')"
      >
        ⋮
      </button>
    </div>
  </div>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.item-row {
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-row:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.item-row.rarity-common {
  border-color: var(--border-color);
}

.item-row.rarity-uncommon {
  border-color: var(--color-success);
}

.item-row.rarity-rare {
  border-color: #4169e1;
}

.item-row.rarity-epic {
  border-color: #9932cc;
}

.item-row.rarity-legendary {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.08);
}

.item-icon {
  font-size: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-quantity {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.item-actions-btn {
  flex-shrink: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-actions-btn:hover {
  background: transparent;
  border-color: transparent;
  color: var(--color-primary);
}

.item-actions-btn:active {
  transform: scale(0.95);
}
</style>
