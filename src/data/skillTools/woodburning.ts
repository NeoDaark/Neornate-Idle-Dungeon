/**
 * woodburning.ts - Herramientas para Quemado (Woodburning)
 *
 * Las herramientas de quemado modifican:
 * - speed: Reducción del tiempo del ciclo (en segundos, negativo = más rápido)
 * - dropModifier: Modificación de drops (remueve "nada" y suma carbón y ceniza)
 * - xp: Aumento de experiencia (en porcentaje)
 */

import { Skill } from '@/types/Game'
import type { Tool } from '@/types/Tool'

const calculatePrice = (tier: number, difficulty: 1.0 | 2.0 = 1.0): number => {
  const basePrice = 15000
  const tierMultiplier = (tier - 1) * 5
  return Math.round(basePrice * (1 + tierMultiplier) * difficulty)
}

export const WOODBURNING_TOOLS: Tool[] = [
  {
    id: 'bonfire_flickering',
    name: 'Hoguera Titilante',
    skillId: Skill.QUEMADO,
    tier: 1,
    baseMaterial: 'wood',
    description: 'tools.quemado.bonfire_flickering',
    icon: '🔥',
    price: calculatePrice(1),
    requiredLevel: 10,
    effects: [
      { type: 'speed', value: 0.50, description: 'effects.speed' },
      { type: 'dropModifier', value: 5, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.10, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_burning',
    name: 'Hoguera Ardiente',
    skillId: Skill.QUEMADO,
    tier: 2,
    baseMaterial: 'coal',
    description: 'tools.quemado.bonfire_burning',
    icon: '🔥',
    price: calculatePrice(2),
    requiredLevel: 20,
    effects: [
      { type: 'speed', value: 0.75, description: 'effects.speed' },
      { type: 'dropModifier', value: 10, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.15, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_infernal',
    name: 'Hoguera Infernal',
    skillId: Skill.QUEMADO,
    tier: 3,
    baseMaterial: 'ash',
    description: 'tools.quemado.bonfire_infernal',
    icon: '🔥',
    price: calculatePrice(3),
    requiredLevel: 40,
    effects: [
      { type: 'speed', value: 1.00, description: 'effects.speed' },
      { type: 'dropModifier', value: 15, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.20, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_roaring',
    name: 'Hoguera Rugiente',
    skillId: Skill.QUEMADO,
    tier: 4,
    baseMaterial: 'ash',
    description: 'tools.quemado.bonfire_roaring',
    icon: '🔥',
    price: calculatePrice(4),
    requiredLevel: 60,
    effects: [
      { type: 'speed', value: 1.25, description: 'effects.speed' },
      { type: 'dropModifier', value: 20, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.25, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_celestial',
    name: 'Hoguera Celestial',
    skillId: Skill.QUEMADO,
    tier: 5,
    baseMaterial: 'ash',
    description: 'tools.quemado.bonfire_celestial',
    icon: '🔥',
    price: calculatePrice(5),
    requiredLevel: 80,
    effects: [
      { type: 'speed', value: 1.50, description: 'effects.speed' },
      { type: 'dropModifier', value: 25, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.30, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_eternal',
    name: 'Hoguera Eterna',
    skillId: Skill.QUEMADO,
    tier: 6,
    baseMaterial: 'ash',
    description: 'tools.quemado.bonfire_eternal',
    icon: '🔥',
    price: calculatePrice(6),
    requiredLevel: 100,
    effects: [
      { type: 'speed', value: 1.75, description: 'effects.speed' },
      { type: 'dropModifier', value: 30, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.35, description: 'effects.xp' },
    ],
  },
  {
    id: 'bonfire_cosmic',
    name: 'Hoguera Cósmica',
    skillId: Skill.QUEMADO,
    tier: 7,
    baseMaterial: 'ash',
    description: 'tools.quemado.bonfire_cosmic',
    icon: '🔥',
    price: calculatePrice(7),
    requiredLevel: 120,
    effects: [
      { type: 'speed', value: 2.00, description: 'effects.speed' },
      { type: 'dropModifier', value: 35, description: 'effects.dropModifier' },
      { type: 'xp', value: 0.40, description: 'effects.xp' },
    ],
  },
]
