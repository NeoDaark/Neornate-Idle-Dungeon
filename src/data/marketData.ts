/**
 * marketData.ts - Precios de recursos en el mercado
 */

import { Skill } from '@/types/Game'

export interface ResourcePrice {
  resourceId: string
  name: string
  icon: string
  skill: Skill
  basePricePerUnit: number
  description: string
}

/**
 * Tabla de precios de recursos
 * El precio base se multiplica por cantidad
 */
export const RESOURCE_PRICES: ResourcePrice[] = [
  // MINING
  {
    resourceId: 'carbon',
    name: 'Carbón',
    icon: '🪨',
    skill: Skill.MINERIA,
    basePricePerUnit: 1,
    description: 'Mineral básico de color oscuro',
  },
  {
    resourceId: 'cobre',
    name: 'Cobre',
    icon: '🟠',
    skill: Skill.MINERIA,
    basePricePerUnit: 3,
    description: 'Metal maleable de color rojizo',
  },
  {
    resourceId: 'hierro',
    name: 'Hierro',
    icon: '🟡',
    skill: Skill.MINERIA,
    basePricePerUnit: 8,
    description: 'Metal duradero de color gris',
  },
  {
    resourceId: 'plata',
    name: 'Plata',
    icon: '⚪',
    skill: Skill.MINERIA,
    basePricePerUnit: 15,
    description: 'Metal precioso brillante',
  },
  {
    resourceId: 'tungsteno',
    name: 'Tungsteno',
    icon: '🔵',
    skill: Skill.MINERIA,
    basePricePerUnit: 25,
    description: 'Metal resistente de alta dureza',
  },
  {
    resourceId: 'oro',
    name: 'Oro',
    icon: '🟨',
    skill: Skill.MINERIA,
    basePricePerUnit: 50,
    description: 'Metal precioso amarillo',
  },
  {
    resourceId: 'platino',
    name: 'Platino',
    icon: '💎',
    skill: Skill.MINERIA,
    basePricePerUnit: 100,
    description: 'Metal precioso extremadamente raro',
  },

  // WOODCUTTING
  {
    resourceId: 'madera-blanda',
    name: 'Madera Blanda',
    icon: '🪵',
    skill: Skill.TALA,
    basePricePerUnit: 2,
    description: 'Madera común de árboles básicos',
  },
  {
    resourceId: 'roble',
    name: 'Madera de Roble',
    icon: '🌳',
    skill: Skill.TALA,
    basePricePerUnit: 5,
    description: 'Madera de roble resistente',
  },
  {
    resourceId: 'nogal',
    name: 'Madera de Nogal',
    icon: '🌲',
    skill: Skill.TALA,
    basePricePerUnit: 8,
    description: 'Madera de nogal de color oscuro',
  },
  {
    resourceId: 'caoba',
    name: 'Madera de Caoba',
    icon: '🟤',
    skill: Skill.TALA,
    basePricePerUnit: 12,
    description: 'Madera exótica de caoba',
  },
  {
    resourceId: 'ebano',
    name: 'Madera de Ébano',
    icon: '⚫',
    skill: Skill.TALA,
    basePricePerUnit: 20,
    description: 'Madera oscura y valiosa',
  },
  {
    resourceId: 'petreo',
    name: 'Madera Pétreo',
    icon: '🪨',
    skill: Skill.TALA,
    basePricePerUnit: 30,
    description: 'Madera fosilizada muy rara',
  },
  {
    resourceId: 'ancestral',
    name: 'Madera Ancestral',
    icon: '🌳',
    skill: Skill.TALA,
    basePricePerUnit: 50,
    description: 'Madera ancestral legendaria',
  },

  // FISHING
  {
    resourceId: 'pez',
    name: 'Pez',
    icon: '🐟',
    skill: Skill.PESCA,
    basePricePerUnit: 2,
    description: 'Pez común del río',
  },
  {
    resourceId: 'trucha',
    name: 'Trucha',
    icon: '🐟',
    skill: Skill.PESCA,
    basePricePerUnit: 8,
    description: 'Trucha de agua dulce',
  },
  {
    resourceId: 'salmon',
    name: 'Salmón',
    icon: '🐠',
    skill: Skill.PESCA,
    basePricePerUnit: 15,
    description: 'Salmón de agua fría',
  },
  {
    resourceId: 'atun',
    name: 'Atún',
    icon: '🐟',
    skill: Skill.PESCA,
    basePricePerUnit: 25,
    description: 'Atún grande y valioso',
  },

  // INGOTS (from smelting)
  {
    resourceId: 'carbon_ingot',
    name: 'Lingote de Carbón',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 2,
    description: 'Lingote refinado de carbón',
  },
  {
    resourceId: 'cobre_ingot',
    name: 'Lingote de Cobre',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 6,
    description: 'Lingote maleable de cobre',
  },
  {
    resourceId: 'hierro_ingot',
    name: 'Lingote de Hierro',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 16,
    description: 'Lingote resistente de hierro',
  },
  {
    resourceId: 'plata_ingot',
    name: 'Lingote de Plata',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 30,
    description: 'Lingote precioso de plata',
  },
  {
    resourceId: 'tungsteno_ingot',
    name: 'Lingote de Tungsteno',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 50,
    description: 'Lingote ultra-resistente',
  },
  {
    resourceId: 'oro_ingot',
    name: 'Lingote de Oro',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 100,
    description: 'Lingote precioso de oro',
  },
  {
    resourceId: 'platino_ingot',
    name: 'Lingote de Platino',
    icon: '🔨',
    skill: Skill.FUNDICION,
    basePricePerUnit: 200,
    description: 'Lingote noble de platino',
  },
]

export const RESOURCE_PRICES_MAP: Record<string, ResourcePrice> = RESOURCE_PRICES.reduce(
  (acc, resource) => {
    acc[resource.resourceId] = resource
    return acc
  },
  {} as Record<string, ResourcePrice>,
)

/**
 * Obtener precio de venta de un recurso
 */
export const getResourcePrice = (resourceId: string, quantity: number = 1): number => {
  const resource = RESOURCE_PRICES_MAP[resourceId]
  if (!resource) return 0
  return resource.basePricePerUnit * quantity
}
