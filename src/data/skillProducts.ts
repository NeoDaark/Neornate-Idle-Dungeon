/**
 * skillProducts.ts - Agregador de todos los productos de skills
 * 
 * Importa los productos de cada skill desde sus archivos individuales
 * y los expone a través del SKILL_PRODUCTS_MAP
 */

import { Skill } from '@/types/Game'
import { MINING_PRODUCTS } from './skillProducts/mining'
import { LOGGING_PRODUCTS } from './skillProducts/logging'
import { SMELTING_PRODUCTS } from './skillProducts/smelting'

/**
 * Mapeo de Skills → Productos
 * 
 * Centraliza el acceso a todos los productos de skills.
 * Para agregar nuevas skills, crea un archivo en skillProducts/ e importalo aquí.
 */
export const SKILL_PRODUCTS_MAP: Record<string, Record<string, any>> = {
  [Skill.MINERIA]: MINING_PRODUCTS,
  [Skill.TALA]: LOGGING_PRODUCTS,
  [Skill.FUNDICION]: SMELTING_PRODUCTS,
  [Skill.HERRERIA]: {}, // TODO: Implementar herrería
  [Skill.PESCA]: {}, // TODO: Implementar pesca
  [Skill.COCINA]: {}, // TODO: Implementar cocina
  [Skill.AVENTURA]: {}, // TODO: Implementar aventura
}

// Re-exportar para compatibilidad con código existente
export { MINING_PRODUCTS, LOGGING_PRODUCTS, SMELTING_PRODUCTS }
