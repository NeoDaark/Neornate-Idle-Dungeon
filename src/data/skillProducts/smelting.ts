/**
 * smelting.ts - Productos de la habilidad Fundición (Smelting)
 * 
 * Convierte minerales en lingotes. Requiere materiales base.
 */

import { Skill, Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'

// Importar imágenes de ingots
import ingotCopper from '@/assets/sprites/custom/ingots/ingot_copper.png'
import ingotIron from '@/assets/sprites/custom/ingots/ingot_iron.png'
import ingotSilver from '@/assets/sprites/custom/ingots/ingot_silver.png'
import ingotTungsten from '@/assets/sprites/custom/ingots/ingot_tungsten.png'
import ingotGold from '@/assets/sprites/custom/ingots/ingot_gold.png'
import ingotPlatinum from '@/assets/sprites/custom/ingots/ingot_platinum.png'
import ingotObsidian from '@/assets/sprites/custom/ingots/ingot_obsidian.png'
import ingotCobalt from '@/assets/sprites/custom/ingots/ingot_cobalt.png'
import ingotMythril from '@/assets/sprites/custom/ingots/ingot_mythril.png'
import ingotOrichalcum from '@/assets/sprites/custom/ingots/ingot_orichalcum.png'
import ingotAdamantite from '@/assets/sprites/custom/ingots/ingot_adamantite.png'
import ingotTitanium from '@/assets/sprites/custom/ingots/ingot_titanium.png'
import ingotDragonite from '@/assets/sprites/custom/ingots/ingot_dragonite.png'

export const SMELTING_PRODUCTS: Record<string, SkillProduct> = {
  // T1
  'cobre_ingot': {
    id: 'cobre_ingot',
    i18nKey: 'resources.ingots.cobre.name',
    i18nDescriptionKey: 'resources.ingots.cobre.description',
    item: {
      id: 'cobre_ingot',
      type: ItemType.MATERIAL,
      icon: ingotCopper,
      iconType: 'image' as const,
      value: 0.5,
      skill: Skill.FUNDICION,
    } as any,
    level: 1,
    tier: Tier.T1,
    quantity: 1,
    xpReward: 20,
    cycleDuration: 48,
    requiredMaterials: [
      { itemId: 'cobre', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T2
  'hierro_ingot': {
    id: 'hierro_ingot',
    i18nKey: 'resources.ingots.hierro.name',
    i18nDescriptionKey: 'resources.ingots.hierro.description',
    item: {
      id: 'hierro_ingot',
      type: ItemType.MATERIAL,
      icon: ingotIron,
      iconType: 'image' as const,
      value: 1.5,
      skill: Skill.FUNDICION,
    } as any,
    level: 20,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 35,
    cycleDuration: 46,
    requiredMaterials: [
      { itemId: 'hierro', quantity: 2 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'plata_ingot': {
    id: 'plata_ingot',
    i18nKey: 'resources.ingots.plata.name',
    i18nDescriptionKey: 'resources.ingots.plata.description',
    item: {
      id: 'plata_ingot',
      type: ItemType.MATERIAL,
      icon: ingotSilver,
      iconType: 'image' as const,
      value: 2.5,
      skill: Skill.FUNDICION,
    } as any,
    level: 25,
    tier: Tier.T2,
    quantity: 1,
    xpReward: 45,
    cycleDuration: 44,
    requiredMaterials: [
      { itemId: 'plata', quantity: 2 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T3
  'tungsteno_ingot': {
    id: 'tungsteno_ingot',
    i18nKey: 'resources.ingots.tungsteno.name',
    i18nDescriptionKey: 'resources.ingots.tungsteno.description',
    item: {
      id: 'tungsteno_ingot',
      type: ItemType.MATERIAL,
      icon: ingotTungsten,
      iconType: 'image' as const,
      value: 3.5,
      skill: Skill.FUNDICION,
    } as any,
    level: 40,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 70,
    cycleDuration: 42,
    requiredMaterials: [
      { itemId: 'tungsteno', quantity: 2 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'oro_ingot': {
    id: 'oro_ingot',
    i18nKey: 'resources.ingots.oro.name',
    i18nDescriptionKey: 'resources.ingots.oro.description',
    item: {
      id: 'oro_ingot',
      type: ItemType.MATERIAL,
      icon: ingotGold,
      iconType: 'image' as const,
      value: 5,
      skill: Skill.FUNDICION,
    } as any,
    level: 45,
    tier: Tier.T3,
    quantity: 1,
    xpReward: 85,
    cycleDuration: 40,
    requiredMaterials: [
      { itemId: 'oro', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T4
  'platino_ingot': {
    id: 'platino_ingot',
    i18nKey: 'resources.ingots.platino.name',
    i18nDescriptionKey: 'resources.ingots.platino.description',
    item: {
      id: 'platino_ingot',
      type: ItemType.MATERIAL,
      icon: ingotPlatinum,
      iconType: 'image' as const,
      value: 8,
      skill: Skill.FUNDICION,
    } as any,
    level: 60,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 110,
    cycleDuration: 38,
    requiredMaterials: [
      { itemId: 'platino', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'obsidiana_ingot': {
    id: 'obsidiana_ingot',
    i18nKey: 'resources.ingots.obsidiana.name',
    i18nDescriptionKey: 'resources.ingots.obsidiana.description',
    item: {
      id: 'obsidiana_ingot',
      type: ItemType.MATERIAL,
      icon: ingotObsidian,
      iconType: 'image' as const,
      value: 10,
      skill: Skill.FUNDICION,
    } as any,
    level: 65,
    tier: Tier.T4,
    quantity: 1,
    xpReward: 130,
    cycleDuration: 36,
    requiredMaterials: [
      { itemId: 'obsidiana', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T5
  'cobalto_ingot': {
    id: 'cobalto_ingot',
    i18nKey: 'resources.ingots.cobalto.name',
    i18nDescriptionKey: 'resources.ingots.cobalto.description',
    item: {
      id: 'cobalto_ingot',
      type: ItemType.MATERIAL,
      icon: ingotCobalt,
      iconType: 'image' as const,
      value: 13,
      skill: Skill.FUNDICION,
    } as any,
    level: 80,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 155,
    cycleDuration: 34,
    requiredMaterials: [
      { itemId: 'cobalto', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'mithril_ingot': {
    id: 'mithril_ingot',
    i18nKey: 'resources.ingots.mithril.name',
    i18nDescriptionKey: 'resources.ingots.mithril.description',
    item: {
      id: 'mithril_ingot',
      type: ItemType.MATERIAL,
      icon: ingotMythril,
      iconType: 'image' as const,
      value: 16,
      skill: Skill.FUNDICION,
    } as any,
    level: 90,
    tier: Tier.T5,
    quantity: 1,
    xpReward: 180,
    cycleDuration: 32,
    requiredMaterials: [
      { itemId: 'mithril', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T6
  'oricalco_ingot': {
    id: 'oricalco_ingot',
    i18nKey: 'resources.ingots.oricalco.name',
    i18nDescriptionKey: 'resources.ingots.oricalco.description',
    item: {
      id: 'oricalco_ingot',
      type: ItemType.MATERIAL,
      icon: ingotOrichalcum,
      iconType: 'image' as const,
      value: 22,
      skill: Skill.FUNDICION,
    } as any,
    level: 100,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 210,
    cycleDuration: 30,
    requiredMaterials: [
      { itemId: 'oricalco', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'adamantita_ingot': {
    id: 'adamantita_ingot',
    i18nKey: 'resources.ingots.adamantita.name',
    i18nDescriptionKey: 'resources.ingots.adamantita.description',
    item: {
      id: 'adamantita_ingot',
      type: ItemType.MATERIAL,
      icon: ingotAdamantite,
      iconType: 'image' as const,
      value: 26,
      skill: Skill.FUNDICION,
    } as any,
    level: 105,
    tier: Tier.T6,
    quantity: 1,
    xpReward: 240,
    cycleDuration: 28,
    requiredMaterials: [
      { itemId: 'adamantita', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },

  // T7
  'titanio_ingot': {
    id: 'titanio_ingot',
    i18nKey: 'resources.ingots.titanio.name',
    i18nDescriptionKey: 'resources.ingots.titanio.description',
    item: {
      id: 'titanio_ingot',
      type: ItemType.MATERIAL,
      icon: ingotTitanium,
      iconType: 'image' as const,
      value: 30,
      skill: Skill.FUNDICION,
    } as any,
    level: 120,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 300,
    cycleDuration: 26,
    requiredMaterials: [
      { itemId: 'titanio', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
  'draconita_ingot': {
    id: 'draconita_ingot',
    i18nKey: 'resources.ingots.draconita.name',
    i18nDescriptionKey: 'resources.ingots.draconita.description',
    item: {
      id: 'draconita_ingot',
      type: ItemType.MATERIAL,
      icon: ingotDragonite,
      iconType: 'image' as const,
      value: 32,
      skill: Skill.FUNDICION,
    } as any,
    level: 150,
    tier: Tier.T7,
    quantity: 1,
    xpReward: 380,
    cycleDuration: 24,
    requiredMaterials: [
      { itemId: 'draconita', quantity: 1 },
      { itemId: 'carbon', quantity: 1 }
    ],
  },
}
