import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player, PlayerClass } from '@/types/Player'
import { CLASS_METADATA, createPlayer, BaseClass } from '@/types/Player'
import { Tier } from '@/types/Game'

const TIER_ORDER = [Tier.T1, Tier.T2, Tier.T3, Tier.T4, Tier.T5, Tier.T6, Tier.T7] as const

export const usePlayerStore = defineStore('player', () => {
  // Estado reactivo
  const player = ref<Player>(
    createPlayer('player-1', 'Aventurero', BaseClass.WARRIOR)
  )

  /**
   * Computed: Obtener metadata de la clase actual
   */
  const classMetadata = computed(() => {
    return CLASS_METADATA[player.value.class] || null
  })

  /**
   * Computed: Calcular XP requerido para el siguiente nivel
   * Fórmula: 100 + (nivel × 50) + (tier × 300)
   */
  const nextLevelXP = computed(() => {
    const { level, currentTier } = player.value
    const tierIndex = TIER_ORDER.indexOf(currentTier)
    const tierNumber = tierIndex + 1 // T1 = 1, T2 = 2, etc.
    return 100 + level * 50 + tierNumber * 300
  })

  /**
   * Computed: Progreso de XP como porcentaje
   */
  const xpProgress = computed(() => {
    const current = player.value.experience
    const required = nextLevelXP.value
    return Math.round((current / required) * 100)
  })

  /**
   * Computed: Salud actual como porcentaje
   */
  const healthPercent = computed(() => {
    return Math.round((player.value.stats.maxHealth / player.value.stats.maxHealth) * 100)
  })

  /**
   * Computed: Maná actual como porcentaje
   */
  const manaPercent = computed(() => {
    return Math.round((player.value.stats.maxMana / player.value.stats.maxMana) * 100)
  })

  /**
   * Actualizar nombre del jugador
   */
  const setPlayerName = (name: string) => {
    if (name.trim().length > 0) {
      player.value.name = name.trim()
    }
  }

  /**
   * Ganar experiencia y manejar level-up automático
   */
  const addExperience = (xpAmount: number) => {
    player.value.experience += xpAmount

    // Manejar level-ups automáticos
    while (player.value.experience >= nextLevelXP.value && player.value.level < 120) {
      player.value.experience -= nextLevelXP.value
      levelUp()
    }

    // Sanity check: asegurar que no sobrepase T7 con nivel 120
    if (player.value.currentTier === Tier.T7 && player.value.level > 120) {
      player.value.level = 120
      player.value.experience = 0
    }
  }

  /**
   * Subir de nivel
   */
  const levelUp = () => {
    if (player.value.level >= 120) return

    player.value.level += 1

    // Cambio de tier cada 20 niveles
    const tierIndex = Math.floor((player.value.level - 1) / 20)
    if (tierIndex < TIER_ORDER.length) {
      player.value.currentTier = TIER_ORDER[tierIndex]
    }

    // Aumentar stats base con cada level
    player.value.stats.maxHealth += 5
    player.value.stats.maxMana += 3
    player.value.stats.strength += 1
    player.value.stats.intelligence += 1
    player.value.stats.dexterity += 1
    player.value.stats.defense += 0.5
    player.value.stats.magicResist += 0.5
  }

  /**
   * Cambiar clase del jugador
   */
  const setClass = (newClass: PlayerClass) => {
    const metadata = CLASS_METADATA[newClass]
    if (!metadata) return

    player.value.class = newClass

    // Aplicar bonificaciones de la clase
    player.value.stats.strength += metadata.stats.strengthBonus
    player.value.stats.intelligence += metadata.stats.intelligenceBonus
    player.value.stats.dexterity += metadata.stats.dexterityBonus
    player.value.stats.defense += metadata.stats.defenseBonus
    player.value.stats.magicResist += metadata.stats.magicResistBonus
  }

  /**
   * Actualizar última actividad (para offline progress)
   */
  const updateLastActive = () => {
    player.value.lastActive = Date.now()
  }

  /**
   * Agregar oro
   */
  const addGold = (amount: number) => {
    player.value.gold += amount
  }

  /**
   * Remover oro (validar antes de usar)
   */
  const removeGold = (amount: number): boolean => {
    if (player.value.gold >= amount) {
      player.value.gold -= amount
      return true
    }
    return false
  }

  /**
   * Establecer oro directamente
   */
  const setGold = (amount: number) => {
    player.value.gold = Math.max(0, amount)
  }

  /**
   * Guardar estado en localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('neornate_player', JSON.stringify(player.value))
    } catch (error) {
      console.error('Error guardando jugador a localStorage:', error)
    }
  }

  /**
   * Guardar estado en localStorage (alias)
   */
  const saveToLocalStorage = () => {
    saveToStorage()
  }

  /**
   * Cargar estado desde localStorage
   */
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('neornate_player')
      if (saved) {
        const loaded = JSON.parse(saved)
        player.value = { ...player.value, ...loaded }
      }
    } catch (error) {
      console.error('Error cargando jugador desde localStorage:', error)
    }
  }

  return {
    // State
    player,

    // Computed
    classMetadata,
    nextLevelXP,
    xpProgress,
    healthPercent,
    manaPercent,

    // Actions
    setPlayerName,
    addExperience,
    levelUp,
    setClass,
    updateLastActive,
    addGold,
    removeGold,
    setGold,
    saveToStorage,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
