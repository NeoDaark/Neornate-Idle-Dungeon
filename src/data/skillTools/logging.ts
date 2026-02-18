/**
 * tala.ts - Herramientas para Tala
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

const calculatePrice = (tier: number, difficulty: 1.0 | 2.0 = 1.0): number => {
  const basePrice = 15000
  const tierMultiplier = (tier - 1) * 5
  return Math.round(basePrice * (1 + tierMultiplier) * difficulty)
}

export const WOODCUTTING_TOOLS: Tool[] = [
  {
    id: 'axe_wood',
    name: 'Hacha de Madera',
    skillId: Skill.TALA,
    tier: 1,
    baseMaterial: 'wood',
    description: 'tools.tala.axe_wood',
    icon: '🪓',
    price: calculatePrice(1),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: 0.5, description: 'effects.speed' },
      { type: 'quantity', value: 1, description: 'effects.quantity' },
      { type: 'xp', value: 10, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_copper',
    name: 'Hacha de Cobre',
    skillId: Skill.TALA,
    tier: 2,
    baseMaterial: 'copper',
    description: 'tools.tala.axe_copper',
    icon: '🪓',
    price: calculatePrice(2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: 0.5, description: 'effects.speed' },
      { type: 'quantity', value: 1, description: 'effects.quantity' },
      { type: 'xp', value: 15, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_iron',
    name: 'Hacha de Hierro',
    skillId: Skill.TALA,
    tier: 3,
    baseMaterial: 'iron',
    description: 'tools.tala.axe_iron',
    icon: '🪓',
    price: calculatePrice(3),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: 1, description: 'effects.speed' },
      { type: 'quantity', value: 2, description: 'effects.quantity' },
      { type: 'xp', value: 20, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_steel',
    name: 'Hacha de Acero',
    skillId: Skill.TALA,
    tier: 4,
    baseMaterial: 'steel',
    description: 'tools.tala.axe_steel',
    icon: '🪓',
    price: calculatePrice(4),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: 1, description: 'effects.speed' },
      { type: 'quantity', value: 2, description: 'effects.quantity' },
      { type: 'xp', value: 25, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_mithril',
    name: 'Hacha de Mithril',
    skillId: Skill.TALA,
    tier: 5,
    baseMaterial: 'mithril',
    description: 'tools.tala.axe_mithril',
    icon: '🪓',
    price: calculatePrice(5),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: 1.5, description: 'effects.speed' },
      { type: 'quantity', value: 3, description: 'effects.quantity' },
      { type: 'xp', value: 30, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_orichalcum',
    name: 'Hacha de Orichalco',
    skillId: Skill.TALA,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'tools.tala.axe_orichalcum',
    icon: '🪓',
    price: calculatePrice(6),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: 1.5, description: 'effects.speed' },
      { type: 'quantity', value: 3, description: 'effects.quantity' },
      { type: 'xp', value: 35, description: 'effects.xp' },
    ],
  },
  {
    id: 'axe_divine',
    name: 'Hacha Divina',
    skillId: Skill.TALA,
    tier: 7,
    baseMaterial: 'divine',
    description: 'tools.tala.axe_divine',
    icon: '🪓',
    price: calculatePrice(7),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: 2, description: 'effects.speed' },
      { type: 'quantity', value: 4, description: 'effects.quantity' },
      { type: 'xp', value: 40, description: 'effects.xp' },
    ],
  },
]
