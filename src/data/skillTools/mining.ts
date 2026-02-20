/**
 * mineria.ts - Herramientas para Minería
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

const calculatePrice = (tier: number, difficulty: 1.0 | 2.0 = 1.0): number => {
  const basePrice = 15000
  const tierMultiplier = (tier - 1) * 5
  return Math.round(basePrice * (1 + tierMultiplier) * difficulty)
}

export const MINING_TOOLS: Tool[] = [
  {
    id: 'pickaxe_copper',
    name: 'Pico de Cobre',
    skillId: Skill.MINERIA,
    tier: 1,
    baseMaterial: 'copper',
    description: 'tools.mineria.pickaxe_copper',
    icon: '⛏️',
    price: calculatePrice(1),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: 0.50, description: 'effects.speed' },
      { type: 'quantity', value: 1, description: 'effects.quantity' },
      { type: 'xp', value: 0.1, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_iron',
    name: 'Pico de Hierro',
    skillId: Skill.MINERIA,
    tier: 2,
    baseMaterial: 'iron',
    description: 'tools.mineria.pickaxe_iron',
    icon: '⛏️',
    price: calculatePrice(2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: 0.75, description: 'effects.speed' },
      { type: 'quantity', value: 1, description: 'effects.quantity' },
      { type: 'xp', value: 0.15, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_steel',
    name: 'Pico de Acero',
    skillId: Skill.MINERIA,
    tier: 3,
    baseMaterial: 'steel',
    description: 'tools.mineria.pickaxe_steel',
    icon: '⛏️',
    price: calculatePrice(3),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: 1.00, description: 'effects.speed' },
      { type: 'quantity', value: 2, description: 'effects.quantity' },
      { type: 'xp', value: 0.20, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_mithril',
    name: 'Pico de Mithril',
    skillId: Skill.MINERIA,
    tier: 4,
    baseMaterial: 'mithril',
    description: 'tools.mineria.pickaxe_mithril',
    icon: '⛏️',
    price: calculatePrice(4),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: 1.25, description: 'effects.speed' },
      { type: 'quantity', value: 2, description: 'effects.quantity' },
      { type: 'xp', value: 0.25, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_adamantite',
    name: 'Pico de Adamantita',
    skillId: Skill.MINERIA,
    tier: 5,
    baseMaterial: 'adamantite',
    description: 'tools.mineria.pickaxe_adamantite',
    icon: '⛏️',
    price: calculatePrice(5),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: 1.50, description: 'effects.speed' },
      { type: 'quantity', value: 3, description: 'effects.quantity' },
      { type: 'xp', value: 0.30, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_orichalcum',
    name: 'Pico de Orichalco',
    skillId: Skill.MINERIA,
    tier: 6,
    baseMaterial: 'orichalcum',
    description: 'tools.mineria.pickaxe_orichalcum',
    icon: '⛏️',
    price: calculatePrice(6),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: 1.75, description: 'effects.speed' },
      { type: 'quantity', value: 3, description: 'effects.quantity' },
      { type: 'xp', value: 0.35, description: 'effects.xp' },
    ],
  },
  {
    id: 'pickaxe_divine',
    name: 'Pico Divino',
    skillId: Skill.MINERIA,
    tier: 7,
    baseMaterial: 'divine',
    description: 'tools.mineria.pickaxe_divine',
    icon: '⛏️',
    price: calculatePrice(7),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: 2, description: 'effects.speed' },
      { type: 'quantity', value: 4, description: 'effects.quantity' },
      { type: 'xp', value: 0.40, description: 'effects.xp' },
    ],
  },
]
