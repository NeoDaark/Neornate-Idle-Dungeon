/**
 * skillProducts.ts - Definición de todos los productos de skills
 * Este archivo contiene la configuración de qué puede producir cada oficio
 * 
 * NOTA: Todos los nombres e descripciones van en i18n, NO en los items
 */

import { Skill, Tier, ItemType } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

// Importar imágenes de ores para que Vite las procese correctamente
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

// Importar imágenes de ingots para que Vite las procese correctamente
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
      icon: oreCoal,
      iconType: 'image' as const,
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
      icon: oreCopper,
      iconType: 'image' as const,
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
      icon: oreIron,
      iconType: 'image' as const,
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
      icon: oreSilver,
      iconType: 'image' as const,
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
      icon: oreTungsten,
      iconType: 'image' as const,
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
      icon: oreGold,
      iconType: 'image' as const,
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
      icon: orePlatinum,
      iconType: 'image' as const,
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
      icon: oreObsidian,
      iconType: 'image' as const,
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
      icon: oreCobalt,
      iconType: 'image' as const,
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
      icon: oreMythril,
      iconType: 'image' as const,
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
      icon: oreOrichalcum,
      iconType: 'image' as const,
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
      icon: oreAdamantite,
      iconType: 'image' as const,
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
      icon: oreTitanium,
      iconType: 'image' as const,
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
      icon: oreDragonite,
      iconType: 'image' as const,
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
// FUNDICIÓN - Productos (convierte minerales en lingotes)
// ============================================================================

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
      value: 12,
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
      value: 28,
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
      value: 42,
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
      value: 70,
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
      value: 100,
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
      value: 130,
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
      value: 150,
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
      value: 180,
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
      value: 220,
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
      value: 260,
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
      value: 310,
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
      value: 400,
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
      value: 550,
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

// ============================================================================
// Mapeo de Skills → Productos
// ============================================================================

export const SKILL_PRODUCTS_MAP: Record<Skill, Record<string, SkillProduct>> = {
  [Skill.MINERIA]: MINING_PRODUCTS,
  [Skill.TALA]: LOGGING_PRODUCTS,
  [Skill.FUNDICION]: SMELTING_PRODUCTS, // TODO: Implementar fundición
  [Skill.HERRERIA]: {}, // TODO: Implementar herrería
  [Skill.PESCA]: {}, // TODO: Implementar pesca
  [Skill.COCINA]: {}, // TODO: Implementar cocina
  [Skill.AVENTURA]: {}, // TODO: Implementar aventura
}
