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
