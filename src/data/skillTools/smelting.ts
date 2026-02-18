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
    description: 'Un horno de piedra básico',
    icon: '🔥',
    price: calculatePrice(1, 2.0),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: -0.5, description: '-0.5s al ciclo' },
      { type: 'rarity', value: 0.10, description: '+10% rareza' },
      { type: 'xp', value: 0.10, description: '+10% XP' },
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
    price: calculatePrice(2, 2.0),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: -0.5, description: '-0.5s al ciclo' },
      { type: 'rarity', value: 0.15, description: '+15% rareza' },
      { type: 'xp', value: 0.15, description: '+15% XP' },
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
    price: calculatePrice(3, 2.0),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: -1, description: '-1s al ciclo' },
      { type: 'rarity', value: 0.20, description: '+20% rareza' },
      { type: 'xp', value: 0.20, description: '+20% XP' },
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
    price: calculatePrice(4, 2.0),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: -1, description: '-1s al ciclo' },
      { type: 'rarity', value: 0.25, description: '+25% rareza' },
      { type: 'xp', value: 0.25, description: '+25% XP' },
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
    price: calculatePrice(5, 2.0),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: -1.5, description: '-1.5s al ciclo' },
      { type: 'rarity', value: 0.30, description: '+30% rareza' },
      { type: 'xp', value: 0.30, description: '+30% XP' },
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
    price: calculatePrice(6, 2.0),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: -1.5, description: '-1.5s al ciclo' },
      { type: 'rarity', value: 0.35, description: '+35% rareza' },
      { type: 'xp', value: 0.35, description: '+35% XP' },
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
    price: calculatePrice(7, 2.0),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: -2, description: '-2s al ciclo' },
      { type: 'rarity', value: 0.40, description: '+40% rareza' },
      { type: 'xp', value: 0.40, description: '+40% XP' },
    ],
  },
]
