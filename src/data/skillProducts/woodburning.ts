/**
 * woodburning.ts - Productos de la habilidad Quemado (Woodburning)
 * 
 * Mecánica: Selecciona un tronco de Tala, quémalo durante su duración (burningTime)
 * Drops con probabilidad:
 * - 40% Carbón
 * - 20% Ceniza
 * - 40% Nada
 */

import { ItemType, Skill } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'
import oreCoal from '@/assets/sprites/custom/ores/ore_coal.png'

/**
 * Recursos que se pueden obtener del quemado
 */
export const WOODBURNING_DROPS: Record<string, Resource> = {
  'carbon': {
    id: 'carbon',
    type: ItemType.RESOURCE,
    icon: oreCoal,
    iconType: 'image' as const,
    value: 0.5,
    skill: Skill.QUEMADO,
  } as Resource,
  'ceniza': {
    id: 'ceniza',
    type: ItemType.RESOURCE,
    icon: '🌫️',
    value: 0.25,
    skill: Skill.QUEMADO,
  } as Resource,
}

/**
 * Tabla de probabilidades para los drops
 * Se escoge un tronco y se quema durante su burningTime
 */
export const WOODBURNING_DROP_TABLE = {
  carbon: {
    chance: 0.40, // 40%
    item: WOODBURNING_DROPS['carbon'],
    quantity: 1,
  },
  ceniza: {
    chance: 0.20, // 20%
    item: WOODBURNING_DROPS['ceniza'],
    quantity: 1,
  },
  nothing: {
    chance: 0.40, // 40%
    item: null,
    quantity: 0,
  },
}

/**
 * El Quemado no tiene productos "tradicionales" como los otros oficios
 * Los productos se generan dinámicamente cuando se selecciona un tronco
 * Este archivo es más referencial para los drops posibles
 */
export const WOODBURNING_PRODUCTS: Record<string, SkillProduct> = {
  // Placeholder: Los productos reales se generan dinámicamente
  // cuando el usuario selecciona un tronco de la Tala
}
