<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import EquipmentSlots from '@/components/inventory/EquipmentSlots.vue'

const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()
</script>

<template>
  <EquipmentSlots
    :equipment="inventoryStore.inventory.equipment"
    :player="playerStore.player"
  />
</template>

<style scoped>
/* Component is just a wrapper for EquipmentSlots */
</style>
