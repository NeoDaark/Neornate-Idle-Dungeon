import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Item, Equipment } from '@/types/Item'
import { EquipmentSlot } from '@/types/Game'
import { SKILL_PRODUCTS_MAP } from '@/data/skillProducts'
import { Skill } from '@/types/Game'

export interface InventoryStack {
  itemId: string
  quantity: number
  item: Item
}

export interface InventoryState {
  items: InventoryStack[]
  equipment: Partial<Record<EquipmentSlot, Equipment>>
  gold: number
}

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref<InventoryState>({
    items: [],
    equipment: {},
    gold: 0,
  })

  /**
   * Computed: Número total de slots utilizados
   */
  const totalSlots = computed(() => {
    return inventory.value.items.length
  })

  /**
   * Computed: Objetos equipados
   */
  const equippedItems = computed(() => {
    return Object.values(inventory.value.equipment).filter((e) => e !== undefined) as Equipment[]
  })

  /**
   * Obtener cantidad de un item específico
   */
  const getItemQuantity = (itemId: string): number => {
    return inventory.value.items.find((stack) => stack.itemId === itemId)?.quantity || 0
  }

  /**
   * Añadir item(s) al inventario
   */
  const addItem = (item: Item, quantity: number = 1) => {
    const existingStack = inventory.value.items.find((stack) => stack.itemId === item.id)

    if (existingStack) {
      existingStack.quantity += quantity
    } else {
      inventory.value.items.push({
        itemId: item.id,
        quantity,
        item,
      })
    }
  }

  /**
   * Remover item(s) del inventario
   */
  const removeItem = (itemId: string, quantity: number = 1): boolean => {
    const stackIndex = inventory.value.items.findIndex((stack) => stack.itemId === itemId)

    if (stackIndex === -1) return false

    const stack = inventory.value.items[stackIndex]
    if (stack.quantity < quantity) return false

    stack.quantity -= quantity
    if (stack.quantity === 0) {
      inventory.value.items.splice(stackIndex, 1)
    }

    return true
  }

  /**
   * Consumir recursos para crafting
   */
  const consumeResources = (resources: { itemId: string; quantity: number }[]): boolean => {
    // Validar que tenemos todos los recursos
    for (const resource of resources) {
      if (getItemQuantity(resource.itemId) < resource.quantity) {
        return false
      }
    }

    // Consumir recursos
    for (const resource of resources) {
      removeItem(resource.itemId, resource.quantity)
    }

    return true
  }

  /**
   * Equipar un item
   */
  const equipItem = (equipment: Equipment, slot: EquipmentSlot) => {
    // Remover item anterior del mismo slot si existe
    const previousEquipped = inventory.value.equipment[slot]
    if (previousEquipped) {
      addItem(previousEquipped)
    }

    // Equipar nuevo item
    inventory.value.equipment[slot] = equipment

    // Remover del inventario si estaba allí
    removeItem(equipment.id, 1)
  }

  /**
   * Desequipar un item
   */
  const unequipItem = (slot: EquipmentSlot) => {
    const equipped = inventory.value.equipment[slot]
    if (equipped) {
      addItem(equipped)
      delete inventory.value.equipment[slot]
    }
  }

  /**
   * Añadir oro
   */
  const addGold = (amount: number) => {
    inventory.value.gold += Math.max(0, amount)
  }

  /**
   * Gastar oro
   */
  const spendGold = (amount: number): boolean => {
    if (inventory.value.gold >= amount) {
      inventory.value.gold -= amount
      return true
    }
    return false
  }

  /**
   * Limpiar inventario (DEBUG)
   */
  const clear = () => {
    inventory.value.items = []
    inventory.value.equipment = {}
    inventory.value.gold = 0
  }

  /**
   * Guardar a localStorage
   */
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('neornate_inventory', JSON.stringify(inventory.value))
    } catch (error) {
      console.error('Error guardando inventario:', error)
    }
  }

  /**
   * Alias para saveToLocalStorage
   */
  const saveToStorage = () => {
    saveToLocalStorage()
  }

  /**
   * Cargar desde localStorage
   */
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('neornate_inventory')
      if (saved) {
        const loaded = JSON.parse(saved)
        
        // Siempre actualizar iconos desde skillProducts
        if (loaded.items) {
          loaded.items = loaded.items.map((stack: any) => {
            const itemId = stack.item.id
            let correctItem = stack.item
            
            // Buscar en MINING_PRODUCTS
            const miningProduct = SKILL_PRODUCTS_MAP[Skill.MINERIA]?.[itemId]
            if (miningProduct) {
              correctItem = miningProduct.item
              return {
                ...stack,
                item: correctItem
              }
            }
            
            // Buscar en LOGGING_PRODUCTS
            const loggingProduct = SKILL_PRODUCTS_MAP[Skill.TALA]?.[itemId]
            if (loggingProduct) {
              correctItem = loggingProduct.item
              return {
                ...stack,
                item: correctItem
              }
            }
            
            // Buscar en SMELTING_PRODUCTS
            const smeltingProduct = SKILL_PRODUCTS_MAP[Skill.FUNDICION]?.[itemId]
            if (smeltingProduct) {
              correctItem = smeltingProduct.item
              return {
                ...stack,
                item: correctItem
              }
            }
            
            // Para otros items, reconstruir iconType basado en el icon
            const iconValue = stack.item.icon || ''
            const isImageUrl = typeof iconValue === 'string' && 
              (iconValue.includes('/') || iconValue.includes('.png') || iconValue.includes('__VITE'))
            
            return {
              ...stack,
              item: {
                ...stack.item,
                iconType: stack.item.iconType || (isImageUrl ? 'image' : 'emoji')
              }
            }
          })
        }
        
        inventory.value = { ...inventory.value, ...loaded }
      }
    } catch (error) {
      console.error('Error cargando inventario:', error)
    }
  }

  return {
    // State
    inventory,

    // Computed
    totalSlots,
    equippedItems,

    // Actions
    getItemQuantity,
    addItem,
    removeItem,
    consumeResources,
    equipItem,
    unequipItem,
    addGold,
    spendGold,
    clear,
    saveToStorage,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
