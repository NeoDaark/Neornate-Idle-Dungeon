/**
 * smelting.ts - Productos de la habilidad Fundición (Smelting)
 * 
 * Convierte minerales en lingotes. Requiere materiales base.
 */

import { Skill, Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'

export const SMELTING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'cobre_ingot': {
    id: 'cobre_ingot',
    name: 'Ingot de Cobre',
    i18nKey: 'resources.ingots.cobre.name',
    i18nDescriptionKey: 'resources.ingots.cobre.description',
    item: {
      id: 'cobre_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 5,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_copper',
    level: 1,
    tier: Tier.T1,
    quantity: 1,
    xpReward: 10,
    requiredMaterials: [
      { itemId: 'cobre', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T2
  'hierro_ingot': {
    id: 'hierro_ingot',
    name: 'Ingot de Hierro',
    i18nKey: 'resources.ingots.hierro.name',
    i18nDescriptionKey: 'resources.ingots.hierro.description',
    item: {
      id: 'hierro_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 15,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_iron',
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 17.5,
    requiredMaterials: [
      { itemId: 'hierro', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'plata_ingot': {
    id: 'plata_ingot',
    name: 'Ingot de Plata',
    i18nKey: 'resources.ingots.plata.name',
    i18nDescriptionKey: 'resources.ingots.plata.description',
    item: {
      id: 'plata_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 25,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_silver',
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 22.5,
    requiredMaterials: [
      { itemId: 'plata', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T3
  'tungsteno_ingot': {
    id: 'tungsteno_ingot',
    name: 'Ingot de Tungsteno',
    i18nKey: 'resources.ingots.tungsteno.name',
    i18nDescriptionKey: 'resources.ingots.tungsteno.description',
    item: {
      id: 'tungsteno_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 35,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_tungsten',
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 35,
    requiredMaterials: [
      { itemId: 'tungsteno', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'oro_ingot': {
    id: 'oro_ingot',
    name: 'Ingot de Oro',
    i18nKey: 'resources.ingots.oro.name',
    i18nDescriptionKey: 'resources.ingots.oro.description',
    item: {
      id: 'oro_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 50,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_gold',
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 42.5,
    requiredMaterials: [
      { itemId: 'oro', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T4
  'platino_ingot': {
    id: 'platino_ingot',
    name: 'Ingot de Platino',
    i18nKey: 'resources.ingots.platino.name',
    i18nDescriptionKey: 'resources.ingots.platino.description',
    item: {
      id: 'platino_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 80,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_platinum',
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 55,
    requiredMaterials: [
      { itemId: 'platino', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'obsidiana_ingot': {
    id: 'obsidiana_ingot',
    name: 'Ingot de Obsidiana',
    i18nKey: 'resources.ingots.obsidiana.name',
    i18nDescriptionKey: 'resources.ingots.obsidiana.description',
    item: {
      id: 'obsidiana_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 100,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_obsidian',
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 65,
    requiredMaterials: [
      { itemId: 'obsidiana', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T5
  'cobalto_ingot': {
    id: 'cobalto_ingot',
    name: 'Ingot de Cobalto',
    i18nKey: 'resources.ingots.cobalto.name',
    i18nDescriptionKey: 'resources.ingots.cobalto.description',
    item: {
      id: 'cobalto_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 130,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_cobalt',
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 77.5,
    requiredMaterials: [
      { itemId: 'cobalto', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'mithril_ingot': {
    id: 'mithril_ingot',
    name: 'Ingot de Mithril',
    i18nKey: 'resources.ingots.mithril.name',
    i18nDescriptionKey: 'resources.ingots.mithril.description',
    item: {
      id: 'mithril_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 160,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_mythril',
    level: 90,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 90,
    requiredMaterials: [
      { itemId: 'mithril', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T6
  'oricalco_ingot': {
    id: 'oricalco_ingot',
    name: 'Ingot de Oricalco',
    i18nKey: 'resources.ingots.oricalco.name',
    i18nDescriptionKey: 'resources.ingots.oricalco.description',
    item: {
      id: 'oricalco_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 220,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_orichalcum',
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 105,
    requiredMaterials: [
      { itemId: 'oricalco', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'adamantita_ingot': {
    id: 'adamantita_ingot',
    name: 'Ingot de Adamantita',
    i18nKey: 'resources.ingots.adamantita.name',
    i18nDescriptionKey: 'resources.ingots.adamantita.description',
    item: {
      id: 'adamantita_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 260,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_adamantite',
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 120,
    requiredMaterials: [
      { itemId: 'adamantita', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T7
  'titanio_ingot': {
    id: 'titanio_ingot',
    name: 'Ingot de Titanio',
    i18nKey: 'resources.ingots.titanio.name',
    i18nDescriptionKey: 'resources.ingots.titanio.description',
    item: {
      id: 'titanio_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 300,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_titanium',
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 150,
    requiredMaterials: [
      { itemId: 'titanio', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'draconita_ingot': {
    id: 'draconita_ingot',
    name: 'Ingot de Draconita',
    i18nKey: 'resources.ingots.draconita.name',
    i18nDescriptionKey: 'resources.ingots.draconita.description',
    item: {
      id: 'draconita_ingot',
      type: ItemType.MATERIAL,
      icon: '⚙️',
      iconType: 'emoji' as const,
      value: 320,
      skill: Skill.FUNDICION,
    } as any,
    spriteId: 'ingot_dragonite',
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 190,
    requiredMaterials: [
      { itemId: 'draconita', quantity: 10 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
}
