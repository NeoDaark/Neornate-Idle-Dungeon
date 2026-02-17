/**
 * Tree.ts - Definición de tipos para árboles (recursos de Tala)
 */

import { Tier } from './Game'

export interface Tree {
  id: string
  i18nKey: string
  level: number
  tier: Tier
}
