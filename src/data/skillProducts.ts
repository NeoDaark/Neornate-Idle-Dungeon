/**
 * skillProducts.ts - Definición de todos los productos de skills
 * Este archivo contiene la configuración de qué puede producir cada oficio
 * 
 * NOTA: Todos los nombres e descripciones van en i18n, NO en los items
 */

import { Skill, Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

// ============================================================================
// MINERÍA - Productos
// ============================================================================

export const MINING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'carbon': {
    id: 'carbon',
    i18nKey: 'resources.mineral.carbon.name',
    i18nDescriptionKey: 'resources.mineral.carbon.description',
    item: {
      id: 'carbon',
      type: ItemType.RESOURCE,
      icon: '⚫',
      value: 5
    } as Resource,
    level: 1,
    tier: Tier.T1,
    quantity: 2,
    xpReward: 10,
    cycleDuration: 40, // 40 segundos
  },
  'cobre': {
    id: 'cobre',
    i18nKey: 'resources.mineral.cobre.name',
    i18nDescriptionKey: 'resources.mineral.cobre.description',
    item: {
      id: 'cobre',
      type: ItemType.RESOURCE,
      icon: '🟠',
      value: 8
    } as Resource,
    level: 5,
    tier: Tier.T1,
    quantity: 2,
    xpReward: 15,
    cycleDuration: 38,
  },

  // T2
  'hierro': {
    id: 'hierro',
    i18nKey: 'resources.mineral.hierro.name',
    i18nDescriptionKey: 'resources.mineral.hierro.description',
    item: {
      id: 'hierro',
      type: ItemType.RESOURCE,
      icon: '🔳',
      value: 20
    } as Resource,
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 30,
    cycleDuration: 36,
  },
  'plata': {
    id: 'plata',
    i18nKey: 'resources.mineral.plata.name',
    i18nDescriptionKey: 'resources.mineral.plata.description',
    item: {
      id: 'plata',
      type: ItemType.RESOURCE,
      icon: '⚪',
      value: 30
    } as Resource,
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 40,
    cycleDuration: 34,
  },

  // T3
  'tungsteno': {
    id: 'tungsteno',
    i18nKey: 'resources.mineral.tungsteno.name',
    i18nDescriptionKey: 'resources.mineral.tungsteno.description',
    item: {
      id: 'tungsteno',
      type: ItemType.RESOURCE,
      icon: '🟦',
      value: 50
    } as Resource,
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 60,
    cycleDuration: 32,
  },
  'oro': {
    id: 'oro',
    i18nKey: 'resources.mineral.oro.name',
    i18nDescriptionKey: 'resources.mineral.oro.description',
    item: {
      id: 'oro',
      type: ItemType.RESOURCE,
      icon: '🟡',
      value: 75
    } as Resource,
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 75,
    cycleDuration: 30,
  },

  // T4
  'platino': {
    id: 'platino',
    i18nKey: 'resources.mineral.platino.name',
    i18nDescriptionKey: 'resources.mineral.platino.description',
    item: {
      id: 'platino',
      type: ItemType.RESOURCE,
      icon: '💎',
      value: 120
    } as Resource,
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 100,
    cycleDuration: 28,
  },
  'obsidiana': {
    id: 'obsidiana',
    i18nKey: 'resources.mineral.obsidiana.name',
    i18nDescriptionKey: 'resources.mineral.obsidiana.description',
    item: {
      id: 'obsidiana',
      type: ItemType.RESOURCE,
      icon: '⬛',
      value: 150
    } as Resource,
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 120,
    cycleDuration: 26,
  },

  // T5
  'cobalto': {
    id: 'cobalto',
    i18nKey: 'resources.mineral.cobalto.name',
    i18nDescriptionKey: 'resources.mineral.cobalto.description',
    item: {
      id: 'cobalto',
      type: ItemType.RESOURCE,
      icon: '🔵',
      value: 200
    } as Resource,
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 150,
    cycleDuration: 24,
  },
  'mithril': {
    id: 'mithril',
    i18nKey: 'resources.mineral.mithril.name',
    i18nDescriptionKey: 'resources.mineral.mithril.description',
    item: {
      id: 'mithril',
      type: ItemType.RESOURCE,
      icon: '✨',
      value: 250
    } as Resource,
    level: 85,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 180,
    cycleDuration: 22,
  },

  // T6
  'oricalco': {
    id: 'oricalco',
    i18nKey: 'resources.mineral.oricalco.name',
    i18nDescriptionKey: 'resources.mineral.oricalco.description',
    item: {
      id: 'oricalco',
      type: ItemType.RESOURCE,
      icon: '🌟',
      value: 350
    } as Resource,
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 220,
    cycleDuration: 20,
  },
  'adamantita': {
    id: 'adamantita',
    i18nKey: 'resources.mineral.adamantita.name',
    i18nDescriptionKey: 'resources.mineral.adamantita.description',
    item: {
      id: 'adamantita',
      type: ItemType.RESOURCE,
      icon: '💠',
      value: 400
    } as Resource,
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 260,
    cycleDuration: 18,
  },

  // T7
  'titanio': {
    id: 'titanio',
    i18nKey: 'resources.mineral.titanio.name',
    i18nDescriptionKey: 'resources.mineral.titanio.description',
    item: {
      id: 'titanio',
      type: ItemType.RESOURCE,
      icon: '⚔️',
      value: 600
    } as Resource,
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 350,
    cycleDuration: 16,
  },
  'draconita': {
    id: 'draconita',
    i18nKey: 'resources.mineral.draconita.name',
    i18nDescriptionKey: 'resources.mineral.draconita.description',
    item: {
      id: 'draconita',
      type: ItemType.RESOURCE,
      icon: '🐉',
      value: 800
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 400,
    cycleDuration: 14,
  },
}

// ============================================================================
// TALA - Productos
// ============================================================================

export const LOGGING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'madera-blanda': {
    id: 'madera-blanda',
    i18nKey: 'resources.wood.madera-blanda.name',
    i18nDescriptionKey: 'resources.wood.madera-blanda.description',
    item: {
      id: 'madera-blanda',
      type: ItemType.RESOURCE,
      icon: '🟤',
      value: 6
    } as Resource,
    level: 1,
    tier: Tier.T1,
    quantity: 2,
    xpReward: 12,
    cycleDuration: 45,
  },
  'madera-comun': {
    id: 'madera-comun',
    i18nKey: 'resources.wood.madera-comun.name',
    i18nDescriptionKey: 'resources.wood.madera-comun.description',
    item: {
      id: 'madera-comun',
      type: ItemType.RESOURCE,
      icon: '🪵',
      value: 10
    } as Resource,
    level: 5,
    tier: Tier.T1,
    quantity: 2,
    xpReward: 18,
    cycleDuration: 43,
  },

  // T2
  'roble': {
    id: 'roble',
    i18nKey: 'resources.wood.roble.name',
    i18nDescriptionKey: 'resources.wood.roble.description',
    item: {
      id: 'roble',
      type: ItemType.RESOURCE,
      icon: '🌳',
      value: 25
    } as Resource,
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 35,
    cycleDuration: 41,
  },
  'nogal': {
    id: 'nogal',
    i18nKey: 'resources.wood.nogal.name',
    i18nDescriptionKey: 'resources.wood.nogal.description',
    item: {
      id: 'nogal',
      type: ItemType.RESOURCE,
      icon: '🌲',
      value: 35
    } as Resource,
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 45,
    cycleDuration: 39,
  },

  // T3
  'caoba': {
    id: 'caoba',
    i18nKey: 'resources.wood.caoba.name',
    i18nDescriptionKey: 'resources.wood.caoba.description',
    item: {
      id: 'caoba',
      type: ItemType.RESOURCE,
      icon: '🎨',
      value: 55
    } as Resource,
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 65,
    cycleDuration: 37,
  },
  'ebano': {
    id: 'ebano',
    i18nKey: 'resources.wood.ebano.name',
    i18nDescriptionKey: 'resources.wood.ebano.description',
    item: {
      id: 'ebano',
      type: ItemType.RESOURCE,
      icon: '⬛',
      value: 85
    } as Resource,
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 80,
    cycleDuration: 35,
  },

  // T4
  'petreo': {
    id: 'petreo',
    i18nKey: 'resources.wood.petreo.name',
    i18nDescriptionKey: 'resources.wood.petreo.description',
    item: {
      id: 'petreo',
      type: ItemType.RESOURCE,
      icon: '🪨',
      value: 140
    } as Resource,
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 110,
    cycleDuration: 33,
  },
  'ancestral': {
    id: 'ancestral',
    i18nKey: 'resources.wood.ancestral.name',
    i18nDescriptionKey: 'resources.wood.ancestral.description',
    item: {
      id: 'ancestral',
      type: ItemType.RESOURCE,
      icon: '👴',
      value: 170
    } as Resource,
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 130,
    cycleDuration: 31,
  },

  // T5
  'cristalina': {
    id: 'cristalina',
    i18nKey: 'resources.wood.cristalina.name',
    i18nDescriptionKey: 'resources.wood.cristalina.description',
    item: {
      id: 'cristalina',
      type: ItemType.RESOURCE,
      icon: '💎',
      value: 220
    } as Resource,
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 160,
    cycleDuration: 29,
  },
  'magica': {
    id: 'magica',
    i18nKey: 'resources.wood.magica.name',
    i18nDescriptionKey: 'resources.wood.magica.description',
    item: {
      id: 'magica',
      type: ItemType.RESOURCE,
      icon: '✨',
      value: 280
    } as Resource,
    level: 85,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 190,
    cycleDuration: 27,
  },

  // T6
  'sagrada': {
    id: 'sagrada',
    i18nKey: 'resources.wood.sagrada.name',
    i18nDescriptionKey: 'resources.wood.sagrada.description',
    item: {
      id: 'sagrada',
      type: ItemType.RESOURCE,
      icon: '☪️',
      value: 380
    } as Resource,
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 240,
    cycleDuration: 25,
  },
  'primordial': {
    id: 'primordial',
    i18nKey: 'resources.wood.primordial.name',
    i18nDescriptionKey: 'resources.wood.primordial.description',
    item: {
      id: 'primordial',
      type: ItemType.RESOURCE,
      icon: '🌌',
      value: 450
    } as Resource,
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 280,
    cycleDuration: 23,
  },

  // T7
  'dimensional': {
    id: 'dimensional',
    i18nKey: 'resources.wood.dimensional.name',
    i18nDescriptionKey: 'resources.wood.dimensional.description',
    item: {
      id: 'dimensional',
      type: ItemType.RESOURCE,
      icon: '🌀',
      value: 650
    } as Resource,
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 380,
    cycleDuration: 21,
  },
  'divina': {
    id: 'divina',
    i18nKey: 'resources.wood.divina.name',
    i18nDescriptionKey: 'resources.wood.divina.description',
    item: {
      id: 'divina',
      type: ItemType.RESOURCE,
      icon: '👑',
      value: 900
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 450,
    cycleDuration: 19,
  },
}

// ============================================================================
// Mapeo de Skills → Productos
// ============================================================================

export const SKILL_PRODUCTS_MAP: Record<Skill, Record<string, SkillProduct>> = {
  [Skill.MINERIA]: MINING_PRODUCTS,
  [Skill.TALA]: LOGGING_PRODUCTS,
  [Skill.FUNDICION]: {}, // TODO: Implementar fundición
  [Skill.HERRERIA]: {}, // TODO: Implementar herrería
  [Skill.PESCA]: {}, // TODO: Implementar pesca
  [Skill.COCINA]: {}, // TODO: Implementar cocina
  [Skill.AVENTURA]: {}, // TODO: Implementar aventura
}
