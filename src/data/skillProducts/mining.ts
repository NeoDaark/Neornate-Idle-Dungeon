/**
 * mining.ts - Productos de la habilidad Minería
 */

import { Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

export const MINING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'cobre': {
    id: 'cobre',
    name: 'Cobre',
    i18nKey: 'resources.mineral.cobre.name',
    i18nDescriptionKey: 'resources.mineral.cobre.description',
    item: {
      id: 'cobre',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 0.5
    } as Resource,
    level: 1,
    tier: Tier.T1,
    quantity: 1,
    xpReward: 7.5,
    spriteId: 'ore_copper',
  },

  // T2
  'hierro': {
    id: 'hierro',
    name: 'Hierro',
    i18nKey: 'resources.mineral.hierro.name',
    i18nDescriptionKey: 'resources.mineral.hierro.description',
    item: {
      id: 'hierro',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 0.5
    } as Resource,
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 15,
    spriteId: 'ore_iron',
  },
  'plata': {
    id: 'plata',
    name: 'Plata',
    i18nKey: 'resources.mineral.plata.name',
    i18nDescriptionKey: 'resources.mineral.plata.description',
    item: {
      id: 'plata',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 1
    } as Resource,
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 20,
    spriteId: 'ore_silver',
  },

  // T3
  'tungsteno': {
    id: 'tungsteno',
    name: 'Tungsteno',
    i18nKey: 'resources.mineral.tungsteno.name',
    i18nDescriptionKey: 'resources.mineral.tungsteno.description',
    item: {
      id: 'tungsteno',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 1.5
    } as Resource,
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 30,
    spriteId: 'ore_tungsten',
  },
  'oro': {
    id: 'oro',
    name: 'Oro',
    i18nKey: 'resources.mineral.oro.name',
    i18nDescriptionKey: 'resources.mineral.oro.description',
    item: {
      id: 'oro',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 2.5
    } as Resource,
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 37.5,
    spriteId: 'ore_gold',
  },

  // T4
  'platino': {
    id: 'platino',
    name: 'Platino',
    i18nKey: 'resources.mineral.platino.name',
    i18nDescriptionKey: 'resources.mineral.platino.description',
    item: {
      id: 'platino',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 4
    } as Resource,
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 50,
    spriteId: 'ore_platinum',
  },
  'obsidiana': {
    id: 'obsidiana',
    name: 'Obsidiana',
    i18nKey: 'resources.mineral.obsidiana.name',
    i18nDescriptionKey: 'resources.mineral.obsidiana.description',
    item: {
      id: 'obsidiana',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 5
    } as Resource,
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 60,
    spriteId: 'ore_obsidian',
  },

  // T5
  'cobalto': {
    id: 'cobalto',
    name: 'Cobalto',
    i18nKey: 'resources.mineral.cobalto.name',
    i18nDescriptionKey: 'resources.mineral.cobalto.description',
    item: {
      id: 'cobalto',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 6.5
    } as Resource,
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 75,
    spriteId: 'ore_cobalt',
  },
  'mithril': {
    id: 'mithril',
    name: 'Mithril',
    i18nKey: 'resources.mineral.mithril.name',
    i18nDescriptionKey: 'resources.mineral.mithril.description',
    item: {
      id: 'mithril',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 8
    } as Resource,
    level: 85,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 90,
    spriteId: 'ore_mythril',
  },

  // T6
  'oricalco': {
    id: 'oricalco',
    name: 'Oricalco',
    i18nKey: 'resources.mineral.oricalco.name',
    i18nDescriptionKey: 'resources.mineral.oricalco.description',
    item: {
      id: 'oricalco',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 11
    } as Resource,
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 110,
    spriteId: 'ore_orichalcum',
  },
  'adamantita': {
    id: 'adamantita',
    name: 'Adamantita',
    i18nKey: 'resources.mineral.adamantita.name',
    i18nDescriptionKey: 'resources.mineral.adamantita.description',
    item: {
      id: 'adamantita',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 13
    } as Resource,
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 130,
    spriteId: 'ore_adamantite',
  },

  // T7
  'titanio': {
    id: 'titanio',
    name: 'Titanio',
    i18nKey: 'resources.mineral.titanio.name',
    i18nDescriptionKey: 'resources.mineral.titanio.description',
    item: {
      id: 'titanio',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 19
    } as Resource,
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 175,
    spriteId: 'ore_titanium',
  },
  'draconita': {
    id: 'draconita',
    name: 'Draconita',
    i18nKey: 'resources.mineral.draconita.name',
    i18nDescriptionKey: 'resources.mineral.draconita.description',
    item: {
      id: 'draconita',
      type: ItemType.RESOURCE,
      icon: '⛏️',
      value: 25
    } as Resource,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 200,
    spriteId: 'ore_dragonite',
  },
}
