import { Tier, ItemType } from '@/types/Game'
import type { Tree } from '@/types/Tree'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

/**
 * TREES - Árboles disponibles para talar
 * Estos definen qué puede talar el jugador
 */
export const TREES: Record<string, Tree> = {
  // T1
  'pino': {
    id: 'pino',
    i18nKey: 'trees.pino.name',
    level: 1,
    tier: Tier.T1,
    spriteId: 'tree_pino',
  },
  'abedul': {
    id: 'abedul',
    i18nKey: 'trees.abedul.name',
    level: 5,
    tier: Tier.T1,
    spriteId: 'tree_abedul',
  },

  // T2
  'abeto': {
    id: 'abeto',
    i18nKey: 'trees.abeto.name',
    level: 20,
    tier: Tier.T2,
    spriteId: 'tree_abeto',
  },
  'nogal': {
    id: 'nogal',
    i18nKey: 'trees.nogal.name',
    level: 25,
    tier: Tier.T2,
    spriteId: 'tree_nogal',
  },

  // T3
  'caoba': {
    id: 'caoba',
    i18nKey: 'trees.caoba.name',
    level: 40,
    tier: Tier.T3,
    spriteId: 'tree_caoba',
  },
  'ebano': {
    id: 'ebano',
    i18nKey: 'trees.ebano.name',
    level: 45,
    tier: Tier.T3,
    spriteId: 'tree_ebano',
  },

  // T4
  'teca': {
    id: 'teca',
    i18nKey: 'trees.teca.name',
    level: 60,
    tier: Tier.T4,
    spriteId: 'tree_teca',
  },
  'cedro': {
    id: 'cedro',
    i18nKey: 'trees.cedro.name',
    level: 65,
    tier: Tier.T4,
    spriteId: 'tree_cedro',
  },

  // T5
  'maldito': {
    id: 'maldito',
    i18nKey: 'trees.maldito.name',
    level: 80,
    tier: Tier.T5,
    spriteId: 'tree_maldito',
  },
  'mistico': {
    id: 'mistico',
    i18nKey: 'trees.mistico.name',
    level: 85,
    tier: Tier.T5,
    spriteId: 'tree_mistico',
  },

  // T6
  'sagrado': {
    id: 'sagrado',
    i18nKey: 'trees.sagrado.name',
    level: 100,
    tier: Tier.T6,
    spriteId: 'tree_sagrado',
  },
  'primordial': {
    id: 'primordial',
    i18nKey: 'trees.primordial.name',
    level: 105,
    tier: Tier.T6,
    spriteId: 'tree_primordial',
  },

  // T7
  'dimensional': {
    id: 'dimensional',
    i18nKey: 'trees.dimensional.name',
    level: 120,
    tier: Tier.T7,
    spriteId: 'tree_dimensional',
  },
  'dragonico': {
    id: 'dragonico',
    i18nKey: 'trees.dragonico.name',
    level: 150,
    tier: Tier.T7,
    spriteId: 'tree_dragonico',
  },
}

/**
 * LOGGING_PRODUCTS - Maderas obtenidas al talar árboles
 * Estos son los productos/recursos que se generan
 */
export const LOGGING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'madera-pino': {
    id: 'madera-pino',
    name: 'Madera de Pino',
    i18nKey: 'resources.wood.madera-pino.name',
    i18nDescriptionKey: 'resources.wood.madera-pino.description',
    item: {
      id: 'madera-pino',
      type: ItemType.RESOURCE,
      icon: '🟤',
      value: 0.5
    } as Resource,
    level: 1,
    tier: Tier.T1,
    quantity: 1,
    xpReward: 6,
    treeId: 'pino',
    spriteId: 'log_pino',
  },
  'madera-abedul': {
    id: 'madera-abedul',
    name: 'Madera de Abedul',
    i18nKey: 'resources.wood.madera-abedul.name',
    i18nDescriptionKey: 'resources.wood.madera-abedul.description',
    item: {
      id: 'madera-abedul',
      type: ItemType.RESOURCE,
      icon: '🪵',
      value: 0.5
    } as Resource,
    level: 5,
    tier: Tier.T1,
    quantity: 1,
    xpReward: 9,
    treeId: 'abedul',
    spriteId: 'log_abedul',
  },

  // T2
  'madera-abeto': {
    id: 'madera-abeto',
    name: 'Madera de Abeto',
    i18nKey: 'resources.wood.madera-abeto.name',
    i18nDescriptionKey: 'resources.wood.madera-abeto.description',
    item: {
      id: 'madera-abeto',
      type: ItemType.RESOURCE,
      icon: '�',
      value: 0.75
    } as Resource,
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 17.5,
    treeId: 'abeto',
    spriteId: 'log_abeto',
  },
  'madera-nogal': {
    id: 'madera-nogal',
    name: 'Madera de Nogal',
    i18nKey: 'resources.wood.madera-nogal.name',
    i18nDescriptionKey: 'resources.wood.madera-nogal.description',
    item: {
      id: 'madera-nogal',
      type: ItemType.RESOURCE,
      icon: '�',
      value: 1
    } as Resource,
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 22.5,
    treeId: 'nogal',
    spriteId: 'log_nogal',
  },

  // T3
  'madera-caoba': {
    id: 'madera-caoba',
    name: 'Madera de Caoba',
    i18nKey: 'resources.wood.madera-caoba.name',
    i18nDescriptionKey: 'resources.wood.madera-caoba.description',
    item: {
      id: 'madera-caoba',
      type: ItemType.RESOURCE,
      icon: '🎨',
      value: 1.5
    } as Resource,
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 32.5,
    treeId: 'caoba',
    spriteId: 'log_caoba',
  },
  'madera-ebano': {
    id: 'madera-ebano',
    name: 'Madera de Ébano',
    i18nKey: 'resources.wood.madera-ebano.name',
    i18nDescriptionKey: 'resources.wood.madera-ebano.description',
    item: {
      id: 'madera-ebano',
      type: ItemType.RESOURCE,
      icon: '⬛',
      value: 2.5
    } as Resource,
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 40,
    treeId: 'ebano',
    spriteId: 'log_ebano',
  },

  // T4
  'madera-teca': {
    id: 'madera-teca',
    name: 'Madera de Teca',
    i18nKey: 'resources.wood.madera-teca.name',
    i18nDescriptionKey: 'resources.wood.madera-teca.description',
    item: {
      id: 'madera-teca',
      type: ItemType.RESOURCE,
      icon: '�',
      value: 4.5
    } as Resource,
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 55,
    treeId: 'teca',
    spriteId: 'log_teca',
  },
  'madera-cedro': {
    id: 'madera-cedro',
    name: 'Madera de Cedro',
    i18nKey: 'resources.wood.madera-cedro.name',
    i18nDescriptionKey: 'resources.wood.madera-cedro.description',
    item: {
      id: 'madera-cedro',
      type: ItemType.RESOURCE,
      icon: '🌲',
      value: 5.5
    } as Resource,
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 65,
    treeId: 'cedro',
    spriteId: 'log_cedro',
  },

  // T5
  'madera-maldita': {
    id: 'madera-maldita',
    name: 'Madera Maldita',
    i18nKey: 'resources.wood.madera-maldita.name',
    i18nDescriptionKey: 'resources.wood.madera-maldita.description',
    item: {
      id: 'madera-maldita',
      type: ItemType.RESOURCE,
      icon: '�',
      value: 7
    } as Resource,
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 80,
    treeId: 'maldito',
    spriteId: 'log_maldito',
  },
  'madera-mistica': {
    id: 'madera-mistica',
    name: 'Madera Mística',
    i18nKey: 'resources.wood.madera-mistica.name',
    i18nDescriptionKey: 'resources.wood.madera-mistica.description',
    item: {
      id: 'madera-mistica',
      type: ItemType.RESOURCE,
      icon: '✨',
      value: 9
    } as Resource,
    level: 85,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 95,
    treeId: 'mistico',
    spriteId: 'log_mistico',
  },

  // T6
  'madera-sagrada': {
    id: 'madera-sagrada',
    name: 'Madera Sagrada',
    i18nKey: 'resources.wood.madera-sagrada.name',
    i18nDescriptionKey: 'resources.wood.madera-sagrada.description',
    item: {
      id: 'madera-sagrada',
      type: ItemType.RESOURCE,
      icon: '☪️',
      value: 12
    } as Resource,
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 120,
    treeId: 'sagrado',
    spriteId: 'log_sagrado',
  },
  'madera-primordial': {
    id: 'madera-primordial',
    name: 'Madera Primordial',
    i18nKey: 'resources.wood.madera-primordial.name',
    i18nDescriptionKey: 'resources.wood.madera-primordial.description',
    item: {
      id: 'madera-primordial',
      type: ItemType.RESOURCE,
      icon: '🌌',
      value: 14
    } as Resource,
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 140,
    treeId: 'primordial',
    spriteId: 'log_primordial',
  },

  // T7
  'madera-dimensional': {
    id: 'madera-dimensional',
    name: 'Madera Dimensional',
    i18nKey: 'resources.wood.madera-dimensional.name',
    i18nDescriptionKey: 'resources.wood.madera-dimensional.description',
    item: {
      id: 'madera-dimensional',
      type: ItemType.RESOURCE,
      icon: '🌀',
      value: 20
    } as Resource,
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 190,
    treeId: 'dimensional',
    spriteId: 'log_dimensional',
  },
  'madera-dragonica': {
    id: 'madera-dragonica',
    name: 'Madera Dragónica',
    i18nKey: 'resources.wood.madera-dragonica.name',
    i18nDescriptionKey: 'resources.wood.madera-dragonica.description',
    item: {
      id: 'madera-dragonica',
      type: ItemType.RESOURCE,
      icon: '🐉',
      value: 25
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 225,
    treeId: 'dragonico',
    spriteId: 'log_dragonico',
  },
}
