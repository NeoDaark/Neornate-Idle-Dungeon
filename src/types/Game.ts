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
 * Calcula XP requerido para el siguiente nivel (CURVA PROGRESIVA - MUY DIFÍCIL)
 * 
 * Curva de dificultad AUMENTADA para planificación estratégica a largo plazo:
 * - Niveles 1-20 (T1): Rápido (2.0x)
 * - Niveles 20-40 (T2): Fácil (4.0x)
 * - Niveles 40-60 (T3): Normal (8.0x)
 * - Niveles 60-80 (T4): Difícil (16.0x)
 * - Niveles 80-100 (T5): Muy difícil (32.0x)
 * - Niveles 100-120 (T6): Extremo (64.0x)
 * - Niveles 120-200 (T7): Prestige puro, escalado dinámicamente (128 + (level-121)*0.4)
 * 
 * XP Rewards de materiales: REDUCIDOS A LA MITAD (para balance)
 * 
 * Resultado esperado: ~25-35 días de farmeo continuo T1-T6, requiere planificación estratégica
 * Base XP: 100 + (nivel × 50)
 */
export function calculateXpForLevel(level: number): number {
  // Validación
  if (level <= 0) return 0
  if (level > 200) return 0 // No sube más de nivel 200
  
  // Multiplicador de dificultad según rango de niveles
  let difficultyMultiplier = 2.0 // Base por defecto para T1
  
  if (level > 20 && level <= 40) {
    // T2: Fácil (1.5x base)
    difficultyMultiplier = 4.0
  } else if (level > 40 && level <= 60) {
    // T3: Normal (3.0x base)
    difficultyMultiplier = 8.0
  } else if (level > 60 && level <= 80) {
    // T4: Difícil (6.0x base)
    difficultyMultiplier = 16.0
  } else if (level > 80 && level <= 100) {
    // T5: Más difícil (12.0x base)
    difficultyMultiplier = 32.0
  } else if (level > 100 && level <= 120) {
    // T6: Muy difícil (24.0x base)
    difficultyMultiplier = 64.0
  } else if (level > 120) {
    // T7: Prestige puro - escalado progresivo
    // Fórmula para T7: base * (32 + (nivel - 121) * 0.4)
    // Mantiene T7 muy difícil pero progresivamente escalado
    const baseDifficultyT7 = 128 + (level - 121) * 0.4
    difficultyMultiplier = baseDifficultyT7
  }
  
  // Base: 100 + (nivel × 50)
  const baseXP = 100 + level * 50
  
  // Aplicar multiplicador de dificultad
  const finalXP = Math.floor(baseXP * difficultyMultiplier)
  
  return finalXP
}

/**
 * Calcula XP TOTAL acumulado hasta un nivel específico
 * Necesario para validar límite máximo (10M en nivel 200)
 */
export function calculateTotalXpForLevel(level: number): number {
  let totalXp = 0
  
  if (level <= 0) return 0
  if (level > 200) level = 200
  
  for (let i = 1; i < level; i++) {
    totalXp += calculateXpForLevel(i)
  }
  
  return totalXp
}

/**
 * Verifica si el jugador puede subir de nivel basado en XP máximo permitido
 * Límite: 10.000.000 XP = Máximo en nivel 200
 */
export function canLevelUp(currentLevel: number): boolean {
  if (currentLevel >= 200) {
    return false // Ya en máximo
  }
  
  // Permitir subir mientras no alcance nivel 200
  return true
}

/**
 * Obtiene el XP total máximo permitido en el juego
 */
export function getMaxTotalXp(): number {
  return 10_000_000 // 10 millones de XP
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


