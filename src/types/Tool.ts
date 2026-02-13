/**
 * Tool.ts - Tipos para herramientas de oficios
 */

import type { Skill } from './Game'

export type ToolEffect = 'speed' | 'quantity' | 'xp' | 'rarity' | 'discount'

export interface Tool {
  id: string // "pickaxe_copper", "axe_iron"
  name: string // "Pico de Cobre"
  skillId: Skill // "mining", "woodcutting", etc.
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7
  baseMaterial: string // "copper", "iron"
  description: string
  icon: string // Emoji o ruta de asset
  price: number // En oro
  requiredLevel: number // Nivel mínimo del oficio
  effects: ToolEffectValue[]
}

export interface ToolEffectValue {
  type: ToolEffect
  value: number // -2 (segundos), +3 (cantidad), 0.3 (30% XP)
  description: string // Para mostrar en UI
}

export interface ToolEquipped {
  toolId: string
  skillId: Skill
  tier: number
  equippedAt: number // timestamp
  effects: ToolEffectValue[]
}

export interface ToolBonus {
  speedBonus: number // En segundos (negativo = reducción)
  quantityBonus: number // En recursos
  xpBonus: number // En porcentaje (0.3 = 30%)
  rarityBonus: number // En porcentaje
  discountBonus: number // En porcentaje
}
