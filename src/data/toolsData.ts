/**
 * toolsData.ts - Definición de todas las herramientas del juego
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

/**
 * Fórmula de precio:
 * Precio = BasePrecio × (1 + TierMultiplier) × DificultadModificador
 * BasePrecio = 500 oro
 * TierMultiplier = (Tier - 1) × 1.5
 * DificultadModificador = 1.2 (complejo) o 1.0 (simple)
 */

const calculatePrice = (tier: number, difficulty: 1.0 | 1.2 = 1.0): number => {
  const basePrice = 500
  const tierMultiplier = (tier - 1) * 1.5
  return Math.round(basePrice * (1 + tierMultiplier) * difficulty)
}

// ============= MINING TOOLS =============
export const MINING_TOOLS: Tool[] = [
  {
    id: 'pickaxe_copper',
    name: 'Pico de Cobre',
    skillId: Skill.MINERIA,
    tier: 1,
    baseMaterial: 'copper',
    description: 'Un pico básico de cobre que acelera la minería',
    icon: '⛏️',
    price: calculatePrice(1),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: -1, description: '-1s al ciclo' },
      { type: 'quantity', value: 1, description: '+1 mineral' },
      { type: 'xp', value: 0.1, description: '+10% XP' },
    ],
  },
  {
    id: 'pickaxe_iron',
    name: 'Pico de Hierro',
    skillId: Skill.MINERIA,
    tier: 2,
    baseMaterial: 'iron',
    description: 'Un pico de hierro más eficiente',
    icon: '⛏️',
    price: calculatePrice(2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: -2, description: '-2s al ciclo' },
      { type: 'quantity', value: 2, description: '+2 minerales' },
      { type: 'xp', value: 0.2, description: '+20% XP' },
    ],
  },
  {
    id: 'pickaxe_steel',
    name: 'Pico de Acero',
    skillId: Skill.MINERIA,
    tier: 3,
    baseMaterial: 'steel',
    description: 'Un pico de acero robusto y rápido',
    icon: '⛏️',
    price: calculatePrice(3),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: -3, description: '-3s al ciclo' },
      { type: 'quantity', value: 3, description: '+3 minerales' },
      { type: 'xp', value: 0.3, description: '+30% XP' },
    ],
  },
  {
    id: 'pickaxe_mithril',
    name: 'Pico de Mithril',
    skillId: Skill.MINERIA,
    tier: 4,
    baseMaterial: 'mithril',
    description: 'Un legendario pico de mithril',
    icon: '⛏️',
    price: calculatePrice(4),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'quantity', value: 4, description: '+4 minerales' },
      { type: 'xp', value: 0.4, description: '+40% XP' },
    ],
  },
  {
    id: 'pickaxe_adamantite',
    name: 'Pico de Adamantita',
    skillId: Skill.MINERIA,
    tier: 5,
    baseMaterial: 'adamantite',
    description: 'Uno de los mejores picos jamás creados',
    icon: '⛏️',
    price: calculatePrice(5),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo (máximo)' },
      { type: 'quantity', value: 5, description: '+5 minerales' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'pickaxe_orichalcum',
    name: 'Pico de Orichalco',
    skillId: Skill.MINERIA,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'Un pico mágico de gran poder',
    icon: '⛏️',
    price: calculatePrice(6),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo (máximo)' },
      { type: 'quantity', value: 6, description: '+6 minerales' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'pickaxe_divine',
    name: 'Pico Divino',
    skillId: Skill.MINERIA,
    tier: 7,
    baseMaterial: 'divine',
    description: 'El pico supremo de poder infinito',
    icon: '⛏️',
    price: calculatePrice(7),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo (máximo)' },
      { type: 'quantity', value: 7, description: '+7 minerales' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
]

// ============= WOODCUTTING TOOLS =============
export const WOODCUTTING_TOOLS: Tool[] = [
  {
    id: 'axe_wood',
    name: 'Hacha de Madera',
    skillId: Skill.TALA,
    tier: 1,
    baseMaterial: 'wood',
    description: 'Un hacha básica de madera',
    icon: '🪓',
    price: calculatePrice(1),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: -1.5, description: '-1.5s al ciclo' },
      { type: 'quantity', value: 1, description: '+1 madera' },
      { type: 'xp', value: 0.1, description: '+10% XP' },
    ],
  },
  {
    id: 'axe_copper',
    name: 'Hacha de Cobre',
    skillId: Skill.TALA,
    tier: 2,
    baseMaterial: 'copper',
    description: 'Un hacha de cobre más resistente',
    icon: '🪓',
    price: calculatePrice(2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: -2.5, description: '-2.5s al ciclo' },
      { type: 'quantity', value: 2, description: '+2 maderas' },
      { type: 'xp', value: 0.2, description: '+20% XP' },
    ],
  },
  {
    id: 'axe_iron',
    name: 'Hacha de Hierro',
    skillId: Skill.TALA,
    tier: 3,
    baseMaterial: 'iron',
    description: 'Un hacha de hierro afilada',
    icon: '🪓',
    price: calculatePrice(3),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: -3.5, description: '-3.5s al ciclo' },
      { type: 'quantity', value: 3, description: '+3 maderas' },
      { type: 'xp', value: 0.3, description: '+30% XP' },
    ],
  },
  {
    id: 'axe_steel',
    name: 'Hacha de Acero',
    skillId: Skill.TALA,
    tier: 4,
    baseMaterial: 'steel',
    description: 'Un hacha de acero de primera',
    icon: '🪓',
    price: calculatePrice(4),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'quantity', value: 4, description: '+4 maderas' },
      { type: 'xp', value: 0.4, description: '+40% XP' },
    ],
  },
  {
    id: 'axe_mithril',
    name: 'Hacha de Mithril',
    skillId: Skill.TALA,
    tier: 5,
    baseMaterial: 'mithril',
    description: 'Un legendario hacha de mithril',
    icon: '🪓',
    price: calculatePrice(5),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: -4.5, description: '-4.5s al ciclo' },
      { type: 'quantity', value: 5, description: '+5 maderas' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'axe_orichalcum',
    name: 'Hacha de Orichalco',
    skillId: Skill.TALA,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'Un hacha mágica de Orichalco',
    icon: '🪓',
    price: calculatePrice(6),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: -5, description: '-5s al ciclo' },
      { type: 'quantity', value: 6, description: '+6 maderas' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'axe_divine',
    name: 'Hacha Divina',
    skillId: Skill.TALA,
    tier: 7,
    baseMaterial: 'divine',
    description: 'El hacha suprema del poder infinito',
    icon: '🪓',
    price: calculatePrice(7),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: -5, description: '-5s al ciclo' },
      { type: 'quantity', value: 7, description: '+7 maderas' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
]

// ============= SMELTING TOOLS =============
export const SMELTING_TOOLS: Tool[] = [
  {
    id: 'furnace_basic',
    name: 'Horno Básico',
    skillId: Skill.FUNDICION,
    tier: 1,
    baseMaterial: 'stone',
    description: 'Un horno de piedra básico',
    icon: '🔥',
    price: calculatePrice(1, 1.2),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: -1, description: '-1s al ciclo' },
      { type: 'rarity', value: 0.1, description: '+10% rareza' },
      { type: 'xp', value: 0.1, description: '+10% XP' },
    ],
  },
  {
    id: 'furnace_copper',
    name: 'Horno de Cobre',
    skillId: Skill.FUNDICION,
    tier: 2,
    baseMaterial: 'copper',
    description: 'Un horno de cobre eficiente',
    icon: '🔥',
    price: calculatePrice(2, 1.2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: -2, description: '-2s al ciclo' },
      { type: 'rarity', value: 0.15, description: '+15% rareza' },
      { type: 'xp', value: 0.2, description: '+20% XP' },
    ],
  },
  {
    id: 'furnace_iron',
    name: 'Horno de Hierro',
    skillId: Skill.FUNDICION,
    tier: 3,
    baseMaterial: 'iron',
    description: 'Un horno de hierro de calidad',
    icon: '🔥',
    price: calculatePrice(3, 1.2),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: -3, description: '-3s al ciclo' },
      { type: 'rarity', value: 0.25, description: '+25% rareza' },
      { type: 'xp', value: 0.3, description: '+30% XP' },
    ],
  },
  {
    id: 'furnace_steel',
    name: 'Horno de Acero',
    skillId: Skill.FUNDICION,
    tier: 4,
    baseMaterial: 'steel',
    description: 'Un horno de acero de maestría',
    icon: '🔥',
    price: calculatePrice(4, 1.2),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'rarity', value: 0.35, description: '+35% rareza' },
      { type: 'xp', value: 0.4, description: '+40% XP' },
    ],
  },
  {
    id: 'furnace_mithril',
    name: 'Horno de Mithril',
    skillId: Skill.FUNDICION,
    tier: 5,
    baseMaterial: 'mithril',
    description: 'Un legendario horno de mithril',
    icon: '🔥',
    price: calculatePrice(5, 1.2),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'rarity', value: 0.45, description: '+45% rareza' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'furnace_orichalcum',
    name: 'Horno de Orichalco',
    skillId: Skill.FUNDICION,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'Un horno mágico de Orichalco',
    icon: '🔥',
    price: calculatePrice(6, 1.2),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'rarity', value: 0.5, description: '+50% rareza' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
  {
    id: 'furnace_divine',
    name: 'Horno Divino',
    skillId: Skill.FUNDICION,
    tier: 7,
    baseMaterial: 'divine',
    description: 'El horno supremo del poder infinito',
    icon: '🔥',
    price: calculatePrice(7, 1.2),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: -4, description: '-4s al ciclo' },
      { type: 'rarity', value: 0.6, description: '+60% rareza' },
      { type: 'xp', value: 0.5, description: '+50% XP' },
    ],
  },
]

// Exportar todas las herramientas en un mapa
export const ALL_TOOLS: Tool[] = [...MINING_TOOLS, ...WOODCUTTING_TOOLS, ...SMELTING_TOOLS]

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
