/**
 * woodburning.ts - Productos de la habilidad Quemado (Woodburning)
 * 
 * Mecánica: Selecciona un tronco de Tala, quémalo durante la duracion del ciclo, al finalizar el ciclo se genera un drop basado en la tabla de drops.
 * Drops con probabilidad:
 * - 40% Carbón
 * - 20% Ceniza
 * - 40% Nada
 */

import { ItemType, Skill } from '@/types/Game'
import type { SkillProduct } from '@/types/Skill'
import type { Resource } from '@/types/Item'

/**
 * Recursos que se pueden obtener del quemado
 */
export const WOODBURNING_DROPS: Record<string, Resource> = {
  'carbon': {
    id: 'carbon',
    type: ItemType.RESOURCE,
    icon: '⛏️',
    value: 0.5,
    skill: Skill.QUEMADO,
    spriteId: 'ore_coal',
    i18nKey: 'resources.mineral.carbon.name',
  } as Resource,
  'ceniza': {
    id: 'ceniza',
    type: ItemType.RESOURCE,
    icon: '🌫️',
    value: 0.25,
    skill: Skill.QUEMADO,
    spriteId: 'log_ceniza',
    i18nKey: 'resources.ash.ceniza.name',
  } as Resource,
}

/**
 * Tabla de probabilidades para los drops
 * Se escoge un tronco y se quema durante el ciclo, al finalizar se genera un drop basado en esta tabla
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
