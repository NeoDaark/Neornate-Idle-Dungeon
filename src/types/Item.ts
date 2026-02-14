/**
 * Item.ts - Inventory and equipment types
 */

import type { Skill, Tier, WeaponType, ArmorType } from './Game'
import { ItemType } from './Game'

export interface Item {
  id: string
  type: ItemType
  icon: string // emoji o ruta de imagen
  iconType?: 'emoji' | 'image' // tipo de icono (por defecto emoji para compatibilidad)
  value: number // precio en oro
  tier?: Tier // opcional - ya está definido en SkillProduct o Equipment
}

export interface Resource extends Item {
  type: ItemType.RESOURCE
  skill: Skill // de qué skill viene
}

export interface Material extends Item {
  type: ItemType.MATERIAL
  skill: Skill
  combustionTime?: number // para combustibles (Carbón, madera)
}

export interface Consumable extends Item {
  type: ItemType.CONSUMABLE
  healAmount?: number
  manaRestore?: number
  duration?: number // para buffs temporales
}

export interface EquipmentStats {
  strength?: number
  intelligence?: number
  dexterity?: number
  defense?: number
  magicResist?: number
  health?: number
  mana?: number
  damage?: number
  magicDamage?: number
}

export interface Equipment extends Item {
  type: ItemType.EQUIPMENT
  equipmentType: WeaponType | ArmorType
  stats: EquipmentStats
  level: number // nivel mínimo para equipar
  quality: number // +0, +1, +2, +3... (mejoras del herrero)
  requiredClass?: string
  enchantments?: Enchantment[]
}

export interface Enchantment {
  id: string
  name: string
  effect: string
  stats: EquipmentStats
  level: number // nivel del enchantment
}

export interface InventoryItem {
  item: Item
  quantity: number
  addedAt: number // timestamp
}

export interface InventorySlot {
  id: string
  items: InventoryItem[]
}

/**
 * Crear un recurso base
 */
export function createResource(
  id: string,
  skill: Skill,
  value: number,
  tier: Tier
): Resource {
  return {
    id,
    type: ItemType.RESOURCE,
    skill,
    icon: skill,
    value,
    tier,
  }
}

/**
 * Crear material base
 */
export function createMaterial(
  id: string,
  skill: Skill,
  value: number,
  tier: Tier,
  combustionTime?: number
): Material {
  return {
    id,
    type: ItemType.MATERIAL,
    skill,
    icon: skill,
    value,
    tier,
    combustionTime,
  }
}

/**
 * Crear equipo base
 */
export function createEquipment(
  id: string,
  equipmentType: WeaponType | ArmorType,
  stats: EquipmentStats,
  level: number,
  value: number,
  tier: Tier,
  quality: number = 0
): Equipment {
  return {
    id,
    type: ItemType.EQUIPMENT,
    equipmentType,
    stats,
    level,
    quality,
    icon: equipmentType,
    value: value * Math.pow(1.1, quality), // precio sube con mejoras
    tier,
    enchantments: [],
  }
}

/**
 * Crear consumible base
 */
export function createConsumable(
  id: string,
  healAmount: number,
  value: number,
  tier: Tier
): Consumable {
  return {
    id,
    type: ItemType.CONSUMABLE,
    icon: 'potion',
    value,
    tier,
    healAmount,
  }
}

/**
 * Slot para inventario
 */
export function createInventorySlot(id: string): InventorySlot {
  return {
    id,
    items: [],
  }
}

/**
 * Agregar items a un slot
 */
export function addItemToSlot(
  slot: InventorySlot,
  item: Item,
  quantity: number = 1
): void {
  const existing = slot.items.find((i) => i.item.id === item.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    slot.items.push({
      item,
      quantity,
      addedAt: Date.now(),
    })
  }
}

/**
 * Remover items de un slot
 */
export function removeItemFromSlot(
  slot: InventorySlot,
  itemId: string,
  quantity: number = 1
): boolean {
  const index = slot.items.findIndex((i) => i.item.id === itemId)
  if (index === -1) return false

  slot.items[index].quantity -= quantity
  if (slot.items[index].quantity <= 0) {
    slot.items.splice(index, 1)
  }
  return true
}

/**
 * Obtener cantidad total de un item en el slot
 */
export function getItemQuantity(slot: InventorySlot, itemId: string): number {
  const item = slot.items.find((i) => i.item.id === itemId)
  return item?.quantity || 0
}
