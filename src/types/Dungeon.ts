/**
 * Dungeon.ts - Dungeon exploration and combat types
 */

import type { Item } from './Item'
import type { Stats } from './Player'

export enum TileType {
  FLOOR = 'floor',
  WALL = 'wall',
  WATER = 'water',
  LAVA = 'lava',
  GRASS = 'grass',
  TREE = 'tree',
  CHEST = 'chest',
  DOOR = 'door',
  PORTAL = 'portal',
  SPIKE = 'spike',
}

export interface Tile {
  type: TileType
  x: number
  y: number
  walkable: boolean
  interactable: boolean
  data?: Record<string, unknown>
}

export interface DungeonMap {
  id: string
  name: string
  width: number
  height: number
  seed: string
  tiles: Tile[][]
  startX: number
  startY: number
  bossX?: number
  bossY?: number
  difficulty: number // 1-5
  minLevel: number
  recommendedLevel: number
  biome: BiomeType
}

export enum BiomeType {
  FOREST = 'forest',
  CAVE = 'cave',
  VOLCANO = 'volcano',
  ICE = 'ice',
  DUNGEON = 'dungeon',
  ANCIENT_RUINS = 'ancient_ruins',
}

export interface Enemy {
  id: string
  name: string
  level: number
  health: number
  maxHealth: number
  stats: Stats
  loot: LootDrop[]
  experienceReward: number
  goldReward: number
}

export interface LootDrop {
  item: Item
  quantity: number
  dropChance: number // 0-1
}

export interface CombatAction {
  type: 'attack' | 'skill' | 'item' | 'defend'
  actor: 'player' | 'enemy'
  target: 'player' | 'enemy'
  damage?: number
  heal?: number
  effectName?: string
}

export interface CombatState {
  enemyId: string
  playerHealth: number
  playerMaxHealth: number
  enemyHealth: number
  enemyMaxHealth: number
  turn: number
  playerTurn: boolean
  actions: CombatAction[]
  loot?: LootDrop[]
  victory?: boolean
}

export interface DungeonState {
  mapId: string
  playerX: number
  playerY: number
  discovered: boolean[][]
  chestOpened: Set<string>
  enemiesDefeated: Set<string>
  visitedPortals: Set<string>
  inCombat: boolean
  currentCombat?: CombatState
  floor: number
  maxFloor: number
  collectedLoot: Item[]
}

export interface DungeonProgress {
  mapId: string
  completedAt?: number
  bestTime?: number
  enemiesDefeated: number
  chestOpened: number
  lootCollected: Item[]
  reward: {
    experience: number
    gold: number
  }
}

/**
 * Crear un mapa de dungeon
 */
export function createDungeonMap(
  id: string,
  name: string,
  width: number,
  height: number,
  seed: string,
  difficulty: number,
  minLevel: number,
  biome: BiomeType
): DungeonMap {
  return {
    id,
    name,
    width,
    height,
    seed,
    tiles: Array(height)
      .fill(null)
      .map(() => Array(width).fill(null)),
    startX: Math.floor(width / 2),
    startY: Math.floor(height / 2),
    difficulty,
    minLevel,
    recommendedLevel: minLevel + difficulty * 10,
    biome,
  }
}

/**
 * Crear estado de dungeon
 */
export function createDungeonState(mapId: string, width: number, height: number): DungeonState {
  return {
    mapId,
    playerX: 0,
    playerY: 0,
    discovered: Array(height)
      .fill(null)
      .map(() => Array(width).fill(false)),
    chestOpened: new Set(),
    enemiesDefeated: new Set(),
    visitedPortals: new Set(),
    inCombat: false,
    floor: 1,
    maxFloor: 1,
    collectedLoot: [],
  }
}

/**
 * Crear un enemigo
 */
export function createEnemy(
  id: string,
  name: string,
  level: number,
  stats: Stats,
  loot: LootDrop[]
): Enemy {
  return {
    id,
    name,
    level,
    health: stats.maxHealth,
    maxHealth: stats.maxHealth,
    stats,
    loot,
    experienceReward: level * 10,
    goldReward: level * 5,
  }
}

/**
 * Crear estado de combate
 */
export function createCombatState(
  enemyId: string,
  playerHealth: number,
  playerMaxHealth: number,
  enemyHealth: number,
  enemyMaxHealth: number
): CombatState {
  return {
    enemyId,
    playerHealth,
    playerMaxHealth,
    enemyHealth,
    enemyMaxHealth,
    turn: 0,
    playerTurn: true,
    actions: [],
    victory: undefined,
  }
}

/**
 * Obtener tile en coordenadas específicas
 */
export function getTile(map: DungeonMap, x: number, y: number): Tile | null {
  if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
    return null
  }
  return map.tiles[y][x]
}

/**
 * Verificar si una posición es caminable
 */
export function isWalkable(map: DungeonMap, x: number, y: number): boolean {
  const tile = getTile(map, x, y)
  return tile !== null && tile.walkable
}
