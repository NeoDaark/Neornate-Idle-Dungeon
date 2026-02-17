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
  },
  'abedul': {
    id: 'abedul',
    i18nKey: 'trees.abedul.name',
    level: 5,
    tier: Tier.T1,
  },

  // T2
  'abeto': {
    id: 'abeto',
    i18nKey: 'trees.abeto.name',
    level: 20,
    tier: Tier.T2,
  },
  'nogal': {
    id: 'nogal',
    i18nKey: 'trees.nogal.name',
    level: 25,
    tier: Tier.T2,
  },

  // T3
  'caoba': {
    id: 'caoba',
    i18nKey: 'trees.caoba.name',
    level: 40,
    tier: Tier.T3,
  },
  'ebano': {
    id: 'ebano',
    i18nKey: 'trees.ebano.name',
    level: 45,
    tier: Tier.T3,
  },

  // T4
  'teca': {
    id: 'teca',
    i18nKey: 'trees.teca.name',
    level: 60,
    tier: Tier.T4,
  },
  'cedro': {
    id: 'cedro',
    i18nKey: 'trees.cedro.name',
    level: 65,
    tier: Tier.T4,
  },

  // T5
  'maldito': {
    id: 'maldito',
    i18nKey: 'trees.maldito.name',
    level: 80,
    tier: Tier.T5,
  },
  'mistico': {
    id: 'mistico',
    i18nKey: 'trees.mistico.name',
    level: 85,
    tier: Tier.T5,
  },

  // T6
  'sagrado': {
    id: 'sagrado',
    i18nKey: 'trees.sagrado.name',
    level: 100,
    tier: Tier.T6,
  },
  'primordial': {
    id: 'primordial',
    i18nKey: 'trees.primordial.name',
    level: 105,
    tier: Tier.T6,
  },

  // T7
  'dimensional': {
    id: 'dimensional',
    i18nKey: 'trees.dimensional.name',
    level: 120,
    tier: Tier.T7,
  },
  'dragonico': {
    id: 'dragonico',
    i18nKey: 'trees.dragonico.name',
    level: 150,
    tier: Tier.T7,
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
    quantity: 2,
    xpReward: 12,
    burningTime: 30,
    treeId: 'pino',
  },
  'madera-abedul': {
    id: 'madera-abedul',
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
    quantity: 2,
    xpReward: 18,
    burningTime: 28,
    treeId: 'abedul',
  },

  // T2
  'madera-abeto': {
    id: 'madera-abeto',
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
    xpReward: 35,
    burningTime: 35,
  },
  'madera-nogal': {
    id: 'madera-nogal',
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
    xpReward: 45,
    burningTime: 40,
  },

  // T3
  'madera-caoba': {
    id: 'madera-caoba',
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
    xpReward: 65,
    burningTime: 50,
    treeId: 'caoba',
  },
  'madera-ebano': {
    id: 'madera-ebano',
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
    xpReward: 80,
    burningTime: 60,
    treeId: 'ebano',
  },

  // T4
  'madera-teca': {
    id: 'madera-teca',
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
    xpReward: 110,
    burningTime: 75,
  },
  'madera-cedro': {
    id: 'madera-cedro',
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
    xpReward: 130,
    treeId: 'cedro',
  },

  // T5
  'madera-maldita': {
    id: 'madera-maldita',
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
    xpReward: 160,
    burningTime: 100,
  },
  'madera-mistica': {
    id: 'madera-mistica',
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
    xpReward: 190,
    burningTime: 120,
    treeId: 'mistico',
  },

  // T6
  'madera-sagrada': {
    id: 'madera-sagrada',
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
    xpReward: 240,
    burningTime: 150,
    treeId: 'sagrado',
  },
  'madera-primordial': {
    id: 'madera-primordial',
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
    xpReward: 280,
    burningTime: 180,
    treeId: 'primordial',
  },

  // T7
  'madera-dimensional': {
    id: 'madera-dimensional',
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
    xpReward: 380,
    burningTime: 240,
    treeId: 'dimensional',
  },
  'madera-dragonica': {
    id: 'madera-dragonica',
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
    xpReward: 450,
    burningTime: 300,
    treeId: 'dragonico',
  },
}
