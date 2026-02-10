/**
 * Player.ts - Player character types
 * 
 * Sistema de Clases Progresivo:
 * - T1-T2: Clase Base (Guerrero, Ladrón, Mago)
 * - T3-T7: Especialización en dos ramas diferentes
 * - Un único personaje con progresión de clases por Tier
 * 
 * Ejemplo Guerrero:
 *   Rama 1: Guerrero > Caballero > Paladin > Dragoon
 *   Rama 2: Guerrero > Caballero > Centurión > Gladiador
 */

import { Tier } from './Game'
import type { Equipment } from './Item'

// Clases Base (T1-T2)
export enum BaseClass {
  WARRIOR = 'warrior',    // Guerrero
  ROGUE = 'rogue',        // Ladrón
  MAGE = 'mage',          // Mago
}

// Clases especializadas T3+
export enum SpecializedClass {
  // Rama Guerrera
  KNIGHT = 'knight',              // Caballero (T2)
  PALADIN = 'paladin',            // Paladín (T3)
  DRAGOON = 'dragoon',            // Dragoon (T4)
  CENTURION = 'centurion',        // Centurión (T3)
  GLADIATOR = 'gladiator',        // Gladiador (T4)

  // Rama Pícara
  WANDERER = 'wanderer',          // Errante (T2)
  BATTLE_MASTER = 'battle_master', // Maestro de Batalla (T3)
  SHADOW_WEAVER = 'shadow_weaver', // Creador de Sombras (T3)
  MAGIC_SWORDSMAN = 'magic_swordsman', // Espadachín Mágico (T4 - híbrido Ladrón/Mago)
  RUNE_BLADE = 'rune_blade',      // Hoja Rúnica (T4)

  // Rama Mágica
  WARLOCK = 'warlock',            // Brujo (T2)
  COURT_MAGE = 'court_mage',      // Mago de la Corte (T3)
  MYSTIC = 'mystic',              // Místico (T3)
  DRUID = 'druid',                // Druida (T4)
  PYROMANCER = 'pyromancer',      // Piromante (T3)
  ARCHIMANTE = 'archimante',      // Archimante (T4 - evolución de Piromante)
}

// Unión de todas las clases
export type PlayerClass = BaseClass | SpecializedClass

// Estructura de especialización: qué clases derivadas tiene cada base
export const CLASS_TREES: Record<BaseClass, Record<Tier, SpecializedClass[]>> = {
  [BaseClass.WARRIOR]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.KNIGHT],
    [Tier.T3]: [SpecializedClass.PALADIN, SpecializedClass.CENTURION],
    [Tier.T4]: [SpecializedClass.DRAGOON, SpecializedClass.GLADIATOR],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
  [BaseClass.ROGUE]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.WANDERER],
    [Tier.T3]: [SpecializedClass.BATTLE_MASTER, SpecializedClass.SHADOW_WEAVER],
    [Tier.T4]: [SpecializedClass.RUNE_BLADE, SpecializedClass.MAGIC_SWORDSMAN],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
  [BaseClass.MAGE]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.WARLOCK],
    [Tier.T3]: [SpecializedClass.COURT_MAGE, SpecializedClass.MYSTIC, SpecializedClass.PYROMANCER],
    [Tier.T4]: [SpecializedClass.DRUID, SpecializedClass.ARCHIMANTE, SpecializedClass.MAGIC_SWORDSMAN],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
}

/**
 * Mapeo de evoluciones específicas: clase anterior → clases posibles en siguiente tier
 * Permite accesos condicionales. Si no está en este mapa, cualquier especialización de ese tier es válida
 */
export const SPECIFIC_EVOLUTIONS: Record<SpecializedClass, SpecializedClass[]> = {
  // Rama Guerrera
  [SpecializedClass.KNIGHT]: [SpecializedClass.PALADIN, SpecializedClass.CENTURION],
  [SpecializedClass.PALADIN]: [SpecializedClass.DRAGOON],
  [SpecializedClass.CENTURION]: [SpecializedClass.GLADIATOR],
  
  // Rama Pícara
  [SpecializedClass.WANDERER]: [SpecializedClass.BATTLE_MASTER, SpecializedClass.SHADOW_WEAVER],
  [SpecializedClass.BATTLE_MASTER]: [SpecializedClass.RUNE_BLADE],
  [SpecializedClass.SHADOW_WEAVER]: [SpecializedClass.MAGIC_SWORDSMAN],
  
  // Rama Mágica
  [SpecializedClass.WARLOCK]: [SpecializedClass.COURT_MAGE, SpecializedClass.MYSTIC, SpecializedClass.PYROMANCER],
  [SpecializedClass.COURT_MAGE]: [SpecializedClass.MAGIC_SWORDSMAN],
  [SpecializedClass.MYSTIC]: [SpecializedClass.DRUID],
  [SpecializedClass.PYROMANCER]: [SpecializedClass.ARCHIMANTE],
  
  // T4+ (final sin más evoluciones)
  [SpecializedClass.DRAGOON]: [],
  [SpecializedClass.GLADIATOR]: [],
  [SpecializedClass.RUNE_BLADE]: [],
  [SpecializedClass.MAGIC_SWORDSMAN]: [],
  [SpecializedClass.DRUID]: [],
  [SpecializedClass.ARCHIMANTE]: [],
}

// Metadatos de clases: nombre visible, descripción, bonificaciones de stats
export interface ClassMetadata {
  displayName: string
  description: string
  emoji: string
  baseClass: BaseClass
  unlockTier: Tier
  stats: {
    strengthBonus: number
    intelligenceBonus: number
    dexterityBonus: number
    defenseBonus: number
    magicResistBonus: number
  }
}

export const CLASS_METADATA: Record<string, ClassMetadata> = {
  // Base Classes
  [BaseClass.WARRIOR]: {
    displayName: 'Guerrero',
    description: 'Maestro del combate cercano. Especialista en fuerza bruta.',
    emoji: '⚔️',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T1' as Tier,
    stats: {
      strengthBonus: 5,
      intelligenceBonus: 0,
      dexterityBonus: 2,
      defenseBonus: 3,
      magicResistBonus: 0,
    },
  },
  [BaseClass.ROGUE]: {
    displayName: 'Ladrón',
    description: 'Ágil y astuto. Especialista en ataque rápido y evasión.',
    emoji: '🗡️',
    baseClass: BaseClass.ROGUE,
    unlockTier: 'T1' as Tier,
    stats: {
      strengthBonus: 2,
      intelligenceBonus: 1,
      dexterityBonus: 5,
      defenseBonus: 1,
      magicResistBonus: 1,
    },
  },
  [BaseClass.MAGE]: {
    displayName: 'Mago',
    description: 'Maestro de la magia arcana. Especialista en daño a distancia.',
    emoji: '🧙',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T1' as Tier,
    stats: {
      strengthBonus: 0,
      intelligenceBonus: 5,
      dexterityBonus: 1,
      defenseBonus: 1,
      magicResistBonus: 3,
    },
  },

  // Specialized - Warrior Branch
  [SpecializedClass.KNIGHT]: {
    displayName: 'Caballero',
    description: 'Guerrero entrenado en honor y defensa. Equilibrio entre ataque y defensa.',
    emoji: '🛡️',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T2' as Tier,
    stats: {
      strengthBonus: 5,
      intelligenceBonus: 1,
      dexterityBonus: 2,
      defenseBonus: 5,
      magicResistBonus: 1,
    },
  },
  [SpecializedClass.PALADIN]: {
    displayName: 'Paladín',
    description: 'Caballero sagrado que mezcla fuerza física con magia divina.',
    emoji: '✨',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 4,
      intelligenceBonus: 3,
      dexterityBonus: 1,
      defenseBonus: 4,
      magicResistBonus: 4,
    },
  },
  [SpecializedClass.DRAGOON]: {
    displayName: 'Dragoon',
    description: 'Guerrero dracónico de poder bruto y ataques de área.',
    emoji: '🐉',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 6,
      intelligenceBonus: 2,
      dexterityBonus: 2,
      defenseBonus: 3,
      magicResistBonus: 2,
    },
  },
  [SpecializedClass.CENTURION]: {
    displayName: 'Centurión',
    description: 'Comandante militar experto en tácticas y disciplina.',
    emoji: '🏛️',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 5,
      intelligenceBonus: 2,
      dexterityBonus: 2,
      defenseBonus: 5,
      magicResistBonus: 2,
    },
  },
  [SpecializedClass.GLADIATOR]: {
    displayName: 'Gladiador',
    description: 'Guerrero de la arena. Maestro del combate uno contra uno.',
    emoji: '⚡',
    baseClass: BaseClass.WARRIOR,
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 6,
      intelligenceBonus: 1,
      dexterityBonus: 4,
      defenseBonus: 2,
      magicResistBonus: 1,
    },
  },

  // Specialized - Rogue Branch
  [SpecializedClass.WANDERER]: {
    displayName: 'Errante',
    description: 'Pícaro aventurero con habilidades de exploración.',
    emoji: '🌍',
    baseClass: BaseClass.ROGUE,
    unlockTier: 'T2' as Tier,
    stats: {
      strengthBonus: 2,
      intelligenceBonus: 1,
      dexterityBonus: 5,
      defenseBonus: 2,
      magicResistBonus: 1,
    },
  },
  [SpecializedClass.BATTLE_MASTER]: {
    displayName: 'Maestro de Batalla',
    description: 'Experto táctico que domina múltiples armas.',
    emoji: '🎖️',
    baseClass: BaseClass.ROGUE,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 3,
      intelligenceBonus: 2,
      dexterityBonus: 5,
      defenseBonus: 2,
      magicResistBonus: 1,
    },
  },
  [SpecializedClass.SHADOW_WEAVER]: {
    displayName: 'Creador de Sombras',
    description: 'Pícaro que manipula las sombras para ataques furtivos.',
    emoji: '🌑',
    baseClass: BaseClass.ROGUE,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 2,
      intelligenceBonus: 3,
      dexterityBonus: 5,
      defenseBonus: 1,
      magicResistBonus: 3,
    },
  },
  [SpecializedClass.RUNE_BLADE]: {
    displayName: 'Hoja Rúnica',
    description: 'Espadachín maestro en el uso de runas antiguas.',
    emoji: '📜',
    baseClass: BaseClass.ROGUE,
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 3,
      intelligenceBonus: 4,
      dexterityBonus: 5,
      defenseBonus: 1,
      magicResistBonus: 3,
    },
  },
  [SpecializedClass.MAGIC_SWORDSMAN]: {
    displayName: 'Espadachín Mágico',
    description: 'Híbrido legendario que mezcla magia con ataques rápidos. Accesible desde Ladrón o Mago.',
    emoji: '✧',
    baseClass: BaseClass.ROGUE, // Categorizado bajo Ladrón, pero accesible desde Mago también
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 2,
      intelligenceBonus: 4,
      dexterityBonus: 4,
      defenseBonus: 1,
      magicResistBonus: 2,
    },
  },

  // Specialized - Mage Branch
  [SpecializedClass.WARLOCK]: {
    displayName: 'Brujo',
    description: 'Mago oscuro que pacta con fuerzas sobrenaturales.',
    emoji: '👁️',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T2' as Tier,
    stats: {
      strengthBonus: 0,
      intelligenceBonus: 5,
      dexterityBonus: 1,
      defenseBonus: 1,
      magicResistBonus: 4,
    },
  },
  [SpecializedClass.COURT_MAGE]: {
    displayName: 'Mago de la Corte',
    description: 'Mago refinado del reino. Equilibrio entre ofensiva y defensa.',
    emoji: '👑',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 0,
      intelligenceBonus: 5,
      dexterityBonus: 2,
      defenseBonus: 2,
      magicResistBonus: 3,
    },
  },
  [SpecializedClass.MYSTIC]: {
    displayName: 'Místico',
    description: 'Mago del equilibrio entre la magia arcana y la naturaleza.',
    emoji: '🌿',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 0,
      intelligenceBonus: 4,
      dexterityBonus: 1,
      defenseBonus: 2,
      magicResistBonus: 5,
    },
  },
  [SpecializedClass.PYROMANCER]: {
    displayName: 'Piromante',
    description: 'Mago especializado en magia de fuego devastadora.',
    emoji: '🔥',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T3' as Tier,
    stats: {
      strengthBonus: 1,
      intelligenceBonus: 6,
      dexterityBonus: 1,
      defenseBonus: 0,
      magicResistBonus: 2,
    },
  },
  [SpecializedClass.DRUID]: {
    displayName: 'Druida',
    description: 'Mago conectado con las fuerzas naturales y la curación.',
    emoji: '🍃',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 1,
      intelligenceBonus: 4,
      dexterityBonus: 1,
      defenseBonus: 3,
      magicResistBonus: 5,
    },
  },
  [SpecializedClass.ARCHIMANTE]: {
    displayName: 'Archimante',
    description: 'Maestro supremo de la magia de fuego. Piromante transformado en leyenda.',
    emoji: '⚡',
    baseClass: BaseClass.MAGE,
    unlockTier: 'T4' as Tier,
    stats: {
      strengthBonus: 0,
      intelligenceBonus: 7,
      dexterityBonus: 1,
      defenseBonus: 1,
      magicResistBonus: 4,
    },
  },
}

export interface Stats {
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  strength: number
  intelligence: number
  dexterity: number
  defense: number
  magicResist: number
}

export interface Player {
  id: string
  name: string
  class: PlayerClass
  level: number
  experience: number
  currentTier: Tier
  stats: Stats
  gold: number
  createdAt: number // timestamp
  lastActive: number // timestamp para offline progress
}

export function createDefaultStats(): Stats {
  return {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 10,
    intelligence: 10,
    dexterity: 10,
    defense: 5,
    magicResist: 5,
  }
}

export function createPlayer(
  id: string,
  name: string,
  playerClass: PlayerClass
): Player {
  return {
    id,
    name,
    class: playerClass,
    level: 1,
    experience: 0,
    currentTier: 'T1' as Tier,
    stats: createDefaultStats(),
    gold: 0,
    createdAt: Date.now(),
    lastActive: Date.now(),
  }
}

export interface PlayerEquipment {
  head?: Equipment
  chest?: Equipment
  hands?: Equipment
  legs?: Equipment
  feet?: Equipment
  mainHand?: Equipment
  offHand?: Equipment
  ring1?: Equipment
  ring2?: Equipment
  accessory?: Equipment
}

export function createDefaultEquipment(): PlayerEquipment {
  return {
    head: undefined,
    chest: undefined,
    hands: undefined,
    legs: undefined,
    feet: undefined,
    mainHand: undefined,
    offHand: undefined,
    ring1: undefined,
    ring2: undefined,
    accessory: undefined,
  }
}

/**
 * Calcula stats totales considerando equipo
 */
export function calculateTotalStats(
  baseStats: Stats,
  equipment: PlayerEquipment
): Stats {
  const totalStats = { ...baseStats }
  const equipmentItems = Object.values(equipment).filter((item) => item !== undefined)

  for (const item of equipmentItems) {
    if (item?.stats) {
      totalStats.strength += item.stats.strength || 0
      totalStats.intelligence += item.stats.intelligence || 0
      totalStats.dexterity += item.stats.dexterity || 0
      totalStats.defense += item.stats.defense || 0
      totalStats.magicResist += item.stats.magicResist || 0
      totalStats.maxHealth += item.stats.health || 0
      totalStats.maxMana += item.stats.mana || 0
    }
  }

  return totalStats
}

/**
 * Info para UI/Debug
 */
export function getPlayerInfo(player: Player): string {
  return `${player.name} - Lvl ${player.level} (${player.class}) - ${player.gold}g`
}

/**
 * Obtiene los metadatos de una clase
 */
export function getClassMetadata(playerClass: PlayerClass): ClassMetadata | undefined {
  return CLASS_METADATA[playerClass]
}

/**
 * Verifica si una clase es clase base
 */
export function isBaseClass(playerClass: PlayerClass): playerClass is BaseClass {
  return Object.values(BaseClass).includes(playerClass as BaseClass)
}

/**
 * Verifica si una clase es especializada
 */
export function isSpecializedClass(playerClass: PlayerClass): playerClass is SpecializedClass {
  return Object.values(SpecializedClass).includes(playerClass as SpecializedClass)
}

/**
 * Obtiene la clase base de una clase actual
 */
export function getBaseClassForPlayer(playerClass: PlayerClass): BaseClass {
  const metadata = getClassMetadata(playerClass)
  return metadata?.baseClass || BaseClass.WARRIOR
}

/**
 * Obtiene las especializaciones disponibles para un tier y clase base
 */
export function getAvailableSpecializations(
  baseClass: BaseClass,
  tier: Tier
): SpecializedClass[] {
  return CLASS_TREES[baseClass]?.[tier] ?? []
}

/**
 * Verifica si un jugador puede ascender a una clase especializada
 * Considera: tier correcto, no retroceder, y evoluciones específicas permitidas
 */
export function canEvolveToClass(
  currentTier: Tier,
  currentClass: PlayerClass,
  targetClass: SpecializedClass,
  targetTier: Tier
): boolean {
  const targetMetadata = getClassMetadata(targetClass)
  if (!targetMetadata) return false

  // Debe estar en el tier correcto
  if (targetMetadata.unlockTier !== targetTier) return false

  // No puede retroceder de tier
  const currentTierNum = parseInt(currentTier.substring(1))
  const targetTierNum = parseInt(targetTier.substring(1))
  if (targetTierNum <= currentTierNum) return false

  // Si la clase actual es especializada, validar evolución específica
  if (isSpecializedClass(currentClass)) {
    const allowedEvolutions = SPECIFIC_EVOLUTIONS[currentClass] ?? []
    if (allowedEvolutions.length > 0) {
      // Si hay evoluciones específicas definidas, solo esas son permitidas
      return allowedEvolutions.includes(targetClass)
    }
  }

  // Si no hay restricción específica, validar que sea válida para la base class
  const baseClass = getBaseClassForPlayer(currentClass)
  const availableSpecs = getAvailableSpecializations(baseClass, targetTier)
  return availableSpecs.includes(targetClass)
}

/**
 * Obtiene las posibles evolucionesde la clase actual
 */
export function getNextClassOptions(currentClass: PlayerClass, nextTier: Tier): SpecializedClass[] {
  // Si es especializada, usar evoluciones específicas
  if (isSpecializedClass(currentClass)) {
    const specificOptions = SPECIFIC_EVOLUTIONS[currentClass] ?? []
    if (specificOptions.length > 0) {
      return specificOptions
    }
  }

  // Si es clase base o no hay evoluciones específicas, obtener por tier
  const baseClass = getBaseClassForPlayer(currentClass)
  return getAvailableSpecializations(baseClass, nextTier)
}
