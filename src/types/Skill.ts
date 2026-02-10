/**
 * Skill.ts - Skill/Oficio types
 */

import type { Skill, Tier } from './Game'
import type { Item } from './Item'

export interface SkillProduct {
  id: string
  name: string
  item: Item
  level: number // nivel mínimo para desbloquear
  tier: Tier
  quantity: number // cantidad producida
  xpReward: number
  requiredMaterials?: SkillMaterial[] // para crafting
}

export interface SkillMaterial {
  itemId: string
  quantity: number
  item?: Item // referencia opcional a datos del item
}

export interface SkillLevel {
  skill: Skill
  level: number
  experience: number // XP en este nivel
  totalExperience: number // XP acumulada totalmente
  tier: Tier
  unlockedProducts: SkillProduct[]
}

export interface SkillState {
  skill: Skill
  level: number
  experience: number
  totalExperience: number
  tier: Tier
  isActive: boolean // está actualmente activo
  autoComplete: boolean
  lastCycleTime: number // timestamp del último ciclo completado
  cycleEndTime: number // timestamp cuando termina el ciclo actual
  currentProduct?: SkillProduct
  products: SkillProduct[] // todos los productos disponibles para este skill
}

export interface CycleResult {
  skill: Skill
  xpGained: number
  product: Item
  quantity: number
  materialsConsumed: SkillMaterial[]
  leveledUp: boolean
  newLevel?: number
}

/**
 * Crear un nivel de skill
 */
export function createSkillLevel(
  skill: Skill,
  level: number,
  tier: Tier
): SkillLevel {
  return {
    skill,
    level,
    experience: 0,
    totalExperience: 0,
    tier,
    unlockedProducts: [],
  }
}

/**
 * Crear estado de skill
 */
export function createSkillState(skill: Skill): SkillState {
  return {
    skill,
    level: 1,
    experience: 0,
    totalExperience: 0,
    tier: 'T1' as Tier,
    isActive: false,
    autoComplete: false,
    lastCycleTime: 0,
    cycleEndTime: 0,
    currentProduct: undefined,
    products: [],
  }
}

/**
 * Crear un producto de skill
 */
export function createSkillProduct(
  id: string,
  name: string,
  item: Item,
  level: number,
  tier: Tier,
  quantity: number,
  xpReward: number,
  requiredMaterials?: SkillMaterial[]
): SkillProduct {
  return {
    id,
    name,
    item,
    level,
    tier,
    quantity,
    xpReward,
    requiredMaterials,
  }
}

/**
 * Obtener el siguiente nivel de XP requerido
 */
export function getNextLevelXp(
  currentLevel: number,
  tierIndex: number
): number {
  return 100 + currentLevel * 50 + tierIndex * 300
}

/**
 * Verificar si un producto está disponible en cierto nivel
 */
export function isProductUnlocked(product: SkillProduct, currentLevel: number): boolean {
  return currentLevel >= product.level
}
