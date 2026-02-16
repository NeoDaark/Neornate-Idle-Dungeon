/**
 * logging.ts - Productos de la habilidad Tala (Woodcutting)
 */

import { Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

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
      value: 0.5
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
      value: 0.5
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
      value: 0.5
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
      value: 1
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
      value: 1.5
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
      value: 2.5
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
      value: 4.5
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
      value: 5.5
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
      value: 7
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
      value: 9
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
      value: 12
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
      value: 14
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
      value: 20
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
      value: 25
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 450,
    cycleDuration: 19,
  },
}
