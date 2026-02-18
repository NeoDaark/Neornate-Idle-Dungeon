import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Item } from '@/types/Item'

export interface MarketListing {
  itemId: string
  item: Item
  pricePerUnit: number
  quantity: number
  timestamp: number
}

export interface Transaction {
  id: string
  itemId: string
  item: Item
  quantity: number
  pricePerUnit: number
  totalPrice: number
  type: 'buy' | 'sell'
  timestamp: number
}

export const useMarketStore = defineStore('market', () => {
  /**
   * Catálogo de precios base del mercado
   * (Los NPC tienen estos precios fijos)
   */
  const basePrices = ref<Record<string, number>>({})

  /**
   * Historial de transacciones del jugador
   */
  const transactionHistory = ref<Transaction[]>([])

  /**
   * Inventario de vendedores (simplificado por ahora)
   */
  const vendorListings = ref<MarketListing[]>([])

  /**
   * Computed: Transacciones de compra
   */
  const purchases = computed(() => {
    return transactionHistory.value.filter((t) => t.type === 'buy')
  })

  /**
   * Computed: Transacciones de venta
   */
  const sales = computed(() => {
    return transactionHistory.value.filter((t) => t.type === 'sell')
  })

  /**
   * Computed: Total gastado en compras
   */
  const totalSpent = computed(() => {
    return purchases.value.reduce((sum, t) => sum + t.totalPrice, 0)
  })

  /**
   * Computed: Total ganado en ventas
   */
  const totalEarned = computed(() => {
    return sales.value.reduce((sum, t) => sum + t.totalPrice, 0)
  })

  /**
   * Computed: Profit neto (ganancias - gastos)
   */
  const netProfit = computed(() => {
    return totalEarned.value - totalSpent.value
  })

  /**
   * Establecer precio base de un item
   */
  const setBasePrice = (itemId: string, price: number) => {
    basePrices.value[itemId] = Math.max(0, price)
  }

  /**
   * Obtener precio base de un item
   */
  const getBasePrice = (itemId: string): number => {
    return basePrices.value[itemId] || 0
  }

  /**
   * Registrar compra
   */
  const recordPurchase = (item: Item, quantity: number, pricePerUnit: number): Transaction => {
    const totalPrice = quantity * pricePerUnit

    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      item,
      quantity,
      pricePerUnit,
      totalPrice,
      type: 'buy',
      timestamp: Date.now(),
    }

    transactionHistory.value.push(transaction)
    return transaction
  }

  /**
   * Registrar venta
   */
  const recordSale = (item: Item, quantity: number, pricePerUnit: number): Transaction => {
    const totalPrice = quantity * pricePerUnit

    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      item,
      quantity,
      pricePerUnit,
      totalPrice,
      type: 'sell',
      timestamp: Date.now(),
    }

    transactionHistory.value.push(transaction)
    return transaction
  }

  /**
   * Agregar item al inventario de vendedores
   */
  const addVendorListing = (item: Item, quantity: number, pricePerUnit: number) => {
    const existing = vendorListings.value.find((l) => l.itemId === item.id)

    if (existing) {
      existing.quantity += quantity
      existing.pricePerUnit = pricePerUnit
      existing.timestamp = Date.now()
    } else {
      vendorListings.value.push({
        itemId: item.id,
        item,
        pricePerUnit,
        quantity,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * Obtener listing de un item
   */
  const getVendorListing = (itemId: string): MarketListing | undefined => {
    return vendorListings.value.find((l) => l.itemId === itemId)
  }

  /**
   * Remover cantidad de un listing
   */
  const removeVendorListing = (itemId: string, quantity: number): boolean => {
    const listing = getVendorListing(itemId)
    if (!listing || listing.quantity < quantity) return false

    listing.quantity -= quantity
    if (listing.quantity === 0) {
      const index = vendorListings.value.findIndex((l) => l.itemId === itemId)
      vendorListings.value.splice(index, 1)
    }

    return true
  }

  /**
   * Calcular precio dinámico (basado en oferta/demanda)
   * Por ahora: precio base
   * TODO: Implementar sistema dinámico
   */
  const calculatePrice = (itemId: string): number => {
    return getBasePrice(itemId)
  }

  /**
   * Limpiar historial (DEBUG)
   */
  const clearHistory = () => {
    transactionHistory.value = []
  }

  /**
   * Guardar a localStorage
   */
  const saveToLocalStorage = () => {
    try {
      const data = {
        basePrices: basePrices.value,
        transactionHistory: transactionHistory.value,
        vendorListings: vendorListings.value,
      }
      localStorage.setItem('neornate_market', JSON.stringify(data))
    } catch (error) {
      console.error('Error guardando mercado:', error)
    }
  }

  /**
   * Cargar desde localStorage
   */
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('neornate_market')
      if (saved) {
        const loaded = JSON.parse(saved)
        basePrices.value = loaded.basePrices || {}
        transactionHistory.value = loaded.transactionHistory || []
        vendorListings.value = loaded.vendorListings || []
      }
    } catch (error) {
      console.error('Error cargando mercado:', error)
    }
  }

  /**
   * Resetear store a su estado inicial
   */
  const reset = () => {
    basePrices.value = {}
    transactionHistory.value = []
    vendorListings.value = []
  }

  return {
    // State
    basePrices,
    transactionHistory,
    vendorListings,

    // Computed
    purchases,
    sales,
    totalSpent,
    totalEarned,
    netProfit,

    // Actions
    setBasePrice,
    getBasePrice,
    recordPurchase,
    recordSale,
    addVendorListing,
    getVendorListing,
    removeVendorListing,
    calculatePrice,
    clearHistory,
    saveToLocalStorage,
    loadFromLocalStorage,
    reset,
  }
})
