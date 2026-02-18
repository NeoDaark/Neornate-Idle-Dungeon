/**
 * fundicion.ts - Herramientas para Fundición
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

const calculatePrice = (tier: number, difficulty: 1.0 | 2.0 = 1.0): number => {
  const basePrice = 15000
  const tierMultiplier = (tier - 1) * 5
  return Math.round(basePrice * (1 + tierMultiplier) * difficulty)
}

export const SMELTING_TOOLS: Tool[] = [
  {
    id: 'furnace_basic',
    name: 'Horno Básico',
    skillId: Skill.FUNDICION,
    tier: 1,
    baseMaterial: 'stone',
    description: 'tools.fundicion.furnace_basic',
    icon: '🔥',
    price: calculatePrice(1, 2.0),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: 0.50, description: 'effects.speed' },
      { type: 'rarity', value: 0.1, description: 'effects.rarity' },
      { type: 'xp', value: 0.1, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_copper',
    name: 'Horno de Cobre',
    skillId: Skill.FUNDICION,
    tier: 2,
    baseMaterial: 'copper',
    description: 'tools.fundicion.furnace_copper',
    icon: '🔥',
    price: calculatePrice(2, 2.0),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: 0.75, description: 'effects.speed' },
      { type: 'rarity', value: 0.15, description: 'effects.rarity' },
      { type: 'xp', value: 0.15, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_iron',
    name: 'Horno de Hierro',
    skillId: Skill.FUNDICION,
    tier: 3,
    baseMaterial: 'iron',
    description: 'tools.fundicion.furnace_iron',
    icon: '🔥',
    price: calculatePrice(3, 2.0),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: 1.00, description: 'effects.speed' },
      { type: 'rarity', value: 0.20, description: 'effects.rarity' },
      { type: 'xp', value: 0.20, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_steel',
    name: 'Horno de Acero',
    skillId: Skill.FUNDICION,
    tier: 4,
    baseMaterial: 'steel',
    description: 'tools.fundicion.furnace_steel',
    icon: '🔥',
    price: calculatePrice(4, 2.0),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: 1.25, description: 'effects.speed' },
      { type: 'rarity', value: 0.25, description: 'effects.rarity' },
      { type: 'xp', value: 0.25, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_mithril',
    name: 'Horno de Mithril',
    skillId: Skill.FUNDICION,
    tier: 5,
    baseMaterial: 'mithril',
    description: 'tools.fundicion.furnace_mithril',
    icon: '🔥',
    price: calculatePrice(5, 2.0),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: 1.50, description: 'effects.speed' },
      { type: 'rarity', value: 0.30, description: 'effects.rarity' },
      { type: 'xp', value: 0.30, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_orichalcum',
    name: 'Horno de Orichalco',
    skillId: Skill.FUNDICION,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'tools.fundicion.furnace_orichalcum',
    icon: '🔥',
    price: calculatePrice(6, 2.0),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: 1.75, description: 'effects.speed' },
      { type: 'rarity', value: 0.35, description: 'effects.rarity' },
      { type: 'xp', value: 0.35, description: 'effects.xp' },
    ],
  },
  {
    id: 'furnace_divine',
    name: 'Horno Divino',
    skillId: Skill.FUNDICION,
    tier: 7,
    baseMaterial: 'divine',
    description: 'tools.fundicion.furnace_divine',
    icon: '🔥',
    price: calculatePrice(7, 2.0),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: 2.00, description: 'effects.speed' },
      { type: 'rarity', value: 0.40, description: 'effects.rarity' },
      { type: 'xp', value: 0.40, description: 'effects.xp' },
    ],
  },
]
