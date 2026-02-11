<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { Equipment } from '@/types/Item'
import { EquipmentSlot } from '@/types/Game'

interface Props {
  equipment: Partial<Record<EquipmentSlot, Equipment>>
  player: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  unequip: [slot: EquipmentSlot]
}>()

const { t } = useI18n()

// Slots disponibles (en orden visual)
const slots = [
  EquipmentSlot.HEAD,
  EquipmentSlot.CHEST,
  EquipmentSlot.HANDS,
  EquipmentSlot.LEGS,
  EquipmentSlot.FEET,
  EquipmentSlot.MAIN_HAND,
  EquipmentSlot.OFF_HAND,
  EquipmentSlot.RING_1,
  EquipmentSlot.RING_2,
  EquipmentSlot.ACCESSORY,
]

const slotLabels: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: '👑',
  [EquipmentSlot.CHEST]: '🛡️',
  [EquipmentSlot.HANDS]: '🧤',
  [EquipmentSlot.LEGS]: '👖',
  [EquipmentSlot.FEET]: '👢',
  [EquipmentSlot.MAIN_HAND]: '⚔️',
  [EquipmentSlot.OFF_HAND]: '🛡️',
  [EquipmentSlot.RING_1]: '💍',
  [EquipmentSlot.RING_2]: '💍',
  [EquipmentSlot.ACCESSORY]: '✨',
}

const getEquipmentStats = (equipment: Equipment) => {
  const stats = []
  if (equipment.stats.damage) stats.push(`${equipment.stats.damage} DMG`)
  if (equipment.stats.defense) stats.push(`${equipment.stats.defense} DEF`)
  if (equipment.stats.health) stats.push(`+${equipment.stats.health} HP`)
  return stats
}

const getSlotLabel = (slot: EquipmentSlot): string => {
  // Convertir 'main_hand' -> 'MAIN_HAND'
  const slotKey = slot.toUpperCase()
  return t(`labels.slot_${slotKey}`)
}
</script>

<template>
  <div class="equipment-grid">
    <div
      v-for="slot in slots"
      :key="slot"
      class="equipment-slot"
      :class="{ equipped: equipment[slot] }"
    >
      <div class="slot-icon">{{ slotLabels[slot] }}</div>

      <div v-if="equipment[slot]" class="slot-content">
        <div class="item-info">
          <p class="item-name">
            {{ t(`items.${equipment[slot]!.id}`) }}
            <span class="quality">+{{ equipment[slot]!.quality }}</span>
          </p>
          <div class="item-stats">
            <span v-for="stat in getEquipmentStats(equipment[slot]!)" :key="stat" class="stat">
              {{ stat }}
            </span>
          </div>
        </div>
        <button class="unequip-btn" @click="emit('unequip', slot)">❌</button>
      </div>

      <div v-else class="slot-empty">
        <span class="empty-label">{{ getSlotLabel(slot) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.equipment-slot {
  background: var(--bg-darker);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.equipment-slot:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.equipment-slot.equipped {
  border-color: var(--color-success);
}

.slot-icon {
  font-size: 24px;
  text-align: center;
}

.slot-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-label {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
}

.slot-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.item-info {
  min-width: 0;
}

.item-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 4px;
  word-break: break-word;
}

.quality {
  color: var(--color-warning);
  font-size: 10px;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.stat {
  font-size: 10px;
  color: var(--text-secondary);
}

.unequip-btn {
  padding: 4px 8px;
  background: var(--color-danger);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.unequip-btn:hover {
  opacity: 0.8;
}
</style>
