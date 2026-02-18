/**
 * toolsData.ts - Centraliza todas las herramientas del juego
 *
 * Las herramientas están organizadas por oficio en la subcarpeta skillTools/
 * Este archivo centraliza las exportaciones y mapeos.
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

import { MINING_TOOLS } from './skillTools/mining'
import { WOODCUTTING_TOOLS } from './skillTools/logging'
import { SMELTING_TOOLS } from './skillTools/smelting'

// Exportar todas las herramientas en un array
export const ALL_TOOLS: Tool[] = [
  ...MINING_TOOLS,
  ...WOODCUTTING_TOOLS,
  ...SMELTING_TOOLS,
]

// Mapa rápido por oficio
export const TOOLS_BY_SKILL: Record<string, Tool[]> = {
  [Skill.MINERIA]: MINING_TOOLS,
  [Skill.TALA]: WOODCUTTING_TOOLS,
  [Skill.FUNDICION]: SMELTING_TOOLS,
}

// Mapa para búsqueda rápida por ID
export const TOOLS_MAP: Record<string, Tool> = ALL_TOOLS.reduce(
  (acc, tool) => {
    acc[tool.id] = tool
    return acc
  },
  {} as Record<string, Tool>,
)

// Re-exportar individuales para acceso directo si es necesario
export { MINING_TOOLS } from './skillTools/mining'
export { WOODCUTTING_TOOLS } from './skillTools/logging'
export { SMELTING_TOOLS } from './skillTools/smelting'
