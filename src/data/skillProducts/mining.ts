/**
 * mining.ts - Productos de la habilidad Minería
 */

import { Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

// Importar imágenes de ores
import oreCoal from '@/assets/sprites/custom/ores/ore_coal.png'
import oreCopper from '@/assets/sprites/custom/ores/ore_copper.png'
import oreIron from '@/assets/sprites/custom/ores/ore_iron.png'
import oreSilver from '@/assets/sprites/custom/ores/ore_silver.png'
import oreTungsten from '@/assets/sprites/custom/ores/ore_tungsten.png'
import oreGold from '@/assets/sprites/custom/ores/ore_gold.png'
import orePlatinum from '@/assets/sprites/custom/ores/ore_platinum.png'
import oreObsidian from '@/assets/sprites/custom/ores/ore_obsidian.png'
import oreCobalt from '@/assets/sprites/custom/ores/ore_cobalt.png'
import oreMythril from '@/assets/sprites/custom/ores/ore_mythril.png'
import oreOrichalcum from '@/assets/sprites/custom/ores/ore_orichalcum.png'
import oreAdamantite from '@/assets/sprites/custom/ores/ore_adamantite.png'
import oreTitanium from '@/assets/sprites/custom/ores/ore_titanium.png'
import oreDragonite from '@/assets/sprites/custom/ores/ore_dragonite.png'

export const MINING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'carbon': {
    id: 'carbon',
    i18nKey: 'resources.mineral.carbon.name',
    i18nDescriptionKey: 'resources.mineral.carbon.description',
    item: {
      id: 'carbon',
      type: ItemType.RESOURCE,
      icon: oreCoal,
      iconType: 'image' as const,
      value: 0.5
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
      icon: oreCopper,
      iconType: 'image' as const,
      value: 0.5
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
      icon: oreIron,
      iconType: 'image' as const,
      value: 0.5
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
      icon: oreSilver,
      iconType: 'image' as const,
      value: 1
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
      icon: oreTungsten,
      iconType: 'image' as const,
      value: 1.5
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
      icon: oreGold,
      iconType: 'image' as const,
      value: 2.5
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
      icon: orePlatinum,
      iconType: 'image' as const,
      value: 4
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
      icon: oreObsidian,
      iconType: 'image' as const,
      value: 5
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
      icon: oreCobalt,
      iconType: 'image' as const,
      value: 6.5
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
      icon: oreMythril,
      iconType: 'image' as const,
      value: 8
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
      icon: oreOrichalcum,
      iconType: 'image' as const,
      value: 11
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
      icon: oreAdamantite,
      iconType: 'image' as const,
      value: 13
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
      icon: oreTitanium,
      iconType: 'image' as const,
      value: 19
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
      icon: oreDragonite,
      iconType: 'image' as const,
      value: 25
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 400,
    cycleDuration: 14,
  },
}
