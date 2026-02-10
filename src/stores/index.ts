/**
 * Stores Index - Exporta todos los stores de Pinia
 * 
 * Uso:
 * import { useGameStore, usePlayerStore, ... } from '@/stores'
 */

export { useGameStore } from './gameStore'
export { usePlayerStore } from './playerStore'
export { useInventoryStore } from './inventoryStore'
export { useSkillsStore } from './skillsStore'
export { useMarketStore } from './marketStore'

export type { InventoryStack, InventoryState } from './inventoryStore'
export type { MarketListing, Transaction } from './marketStore'
