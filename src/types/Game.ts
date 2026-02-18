/**
 * Game.ts - Core game enums and types
 */

export enum Tier {
  T1 = 'T1', // Niveles 0-20
  T2 = 'T2', // Niveles 20-40
  T3 = 'T3', // Niveles 40-60
  T4 = 'T4', // Niveles 60-80
  T5 = 'T5', // Niveles 80-100
  T6 = 'T6', // Niveles 100-120
  T7 = 'T7', // Niveles 120-200 (Prestige)
}

export enum Skill {
  MINERIA = 'mineria',
  TALA = 'tala',
  FUNDICION = 'fundicion',
  QUEMADO = 'quemado',
  HERRERIA = 'herreria',
  PESCA = 'pesca',
  COCINA = 'cocina',
  AVENTURA = 'aventura',
}

export enum ItemType {
  RESOURCE = 'resource',
  EQUIPMENT = 'equipment',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
}

export enum EquipmentSlot {
  HEAD = 'head',
  CHEST = 'chest',
  HANDS = 'hands',
  LEGS = 'legs',
  FEET = 'feet',
  MAIN_HAND = 'main_hand',
  OFF_HAND = 'off_hand',
  RING_1 = 'ring_1',
  RING_2 = 'ring_2',
  ACCESSORY = 'accessory',
}

export enum WeaponType {
  DAGGER = 'dagger',
  SWORD_1H = 'sword_1h',
  SWORD_2H = 'sword_2h',
  AXE_1H = 'axe_1h',
  AXE_2H = 'axe_2h',
  HAMMER = 'hammer',
  BOW = 'bow',
  CROSSBOW = 'crossbow',
  WAND = 'wand',
  STAFF = 'staff',
  SHIELD = 'shield',
}

export enum ArmorType {
  HELMET = 'helmet',
  CHEST_PLATE = 'chest_plate',
  GAUNTLETS = 'gauntlets',
  LEGGINGS = 'leggings',
  BOOTS = 'boots',
}

export type TierRange = {
  [key in Tier]: {
    minLevel: number
    maxLevel: number
    minXpRequired: number
  }
}

export const TIER_RANGES: TierRange = {
  [Tier.T1]: { minLevel: 0, maxLevel: 20, minXpRequired: 100 },
  [Tier.T2]: { minLevel: 20, maxLevel: 40, minXpRequired: 1600 },
  [Tier.T3]: { minLevel: 40, maxLevel: 60, minXpRequired: 5300 },
  [Tier.T4]: { minLevel: 60, maxLevel: 80, minXpRequired: 14200 },
  [Tier.T5]: { minLevel: 80, maxLevel: 100, minXpRequired: 19000 },
  [Tier.T6]: { minLevel: 100, maxLevel: 120, minXpRequired: 23800 },
  [Tier.T7]: { minLevel: 120, maxLevel: 200, minXpRequired: 40000 },
}

export interface GameConstants {
  MAX_LEVEL: number
  PRESTIGE_LEVEL: number
  AUTO_SAVE_INTERVAL: number // milliseconds
  GAME_LOOP_TICK: number // milliseconds
}

export const GAME_CONSTANTS: GameConstants = {
  MAX_LEVEL: 200,
  PRESTIGE_LEVEL: 120,
  AUTO_SAVE_INTERVAL: 5000, // 5 segundos
  GAME_LOOP_TICK: 100, // 100ms
}

export interface SkillConfig {
  name: string
  emoji: string
  icon: string
  type: 'extraction' | 'crafting' | 'combat' | 'burning'
  baseCycleDuration: number // segundos
}

export const SKILL_CONFIGS: Record<Skill, SkillConfig> = {
  [Skill.MINERIA]: {
    name: 'mineria',
    emoji: '⛏️',
    icon: 'pickaxe',
    type: 'extraction',
    baseCycleDuration: 5,
  },
  [Skill.TALA]: {
    name: 'tala',
    emoji: '🌲',
    icon: 'tree',
    type: 'extraction',
    baseCycleDuration: 5,
  },
  [Skill.FUNDICION]: {
    name: 'fundicion',
    emoji: '🔥',
    icon: 'furnace',
    type: 'crafting',
    baseCycleDuration: 5,
  },
  [Skill.QUEMADO]: {
    name: 'quemado',
    emoji: '🔥',
    icon: 'burn',
    type: 'burning',
    baseCycleDuration: 5,
  },
  [Skill.HERRERIA]: {
    name: 'herreria',
    emoji: '🔨',
    icon: 'hammer',
    type: 'crafting',
    baseCycleDuration: 5,
  },
  [Skill.PESCA]: {
    name: 'pesca',
    emoji: '🎣',
    icon: 'fishing',
    type: 'extraction',
    baseCycleDuration: 5,
  },
  [Skill.COCINA]: {
    name: 'cocina',
    emoji: '🍳',
    icon: 'cooking',
    type: 'crafting',
    baseCycleDuration: 5,
  },
  [Skill.AVENTURA]: {
    name: 'aventura',
    emoji: '🗺️',
    icon: 'adventure',
    type: 'combat',
    baseCycleDuration: 5,
  },
}

/**
 * Calcula XP requerido para el siguiente nivel
 * Fórmula: XP_next = 100 + (nivel × 50) + (tier × 300)
 */
export function calculateXpForLevel(level: number): number {
  if (level <= 0) return 0
  if (level > 200) return 80000

  const tier = getTierForLevel(level)
  const tierBonus = Object.values(Tier).indexOf(tier) * 300

  return 100 + level * 50 + tierBonus
}

/**
 * Obtiene el tier correspondiente a un nivel
 */
export function getTierForLevel(level: number): Tier {
  if (level < 20) return Tier.T1
  if (level < 40) return Tier.T2
  if (level < 60) return Tier.T3
  if (level < 80) return Tier.T4
  if (level < 100) return Tier.T5
  if (level < 120) return Tier.T6
  return Tier.T7
}

/**
 * Calcula XP total acumulado hasta un nivel
 */
export function calculateTotalXpForLevel(level: number): number {
  let totalXp = 0
  for (let i = 1; i < level; i++) {
    totalXp += calculateXpForLevel(i)
  }
  return totalXp
}
