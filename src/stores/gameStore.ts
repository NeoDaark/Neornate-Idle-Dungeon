import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlayerStore } from './playerStore'
import { useInventoryStore } from './inventoryStore'
import { useSkillsStore } from './skillsStore'
import { useMarketStore } from './marketStore'

export const useGameStore = defineStore('game', () => {
  /**
   * Estado global del juego
   */
  const gameState = ref({
    isInitialized: false,
    gameStartedAt: 0,
    lastSaveTime: 0,
    gamePausedAt: 0,
  })

  /**
   * Computed: Tiempo de juego actual
   */
  const gameTime = computed(() => {
    if (gameState.value.gamePausedAt > 0) {
      return gameState.value.gamePausedAt - gameState.value.gameStartedAt
    }
    return Date.now() - gameState.value.gameStartedAt
  })

  /**
   * Computed: Indica si el juego está pausado
   */
  const isPaused = computed(() => {
    return gameState.value.gamePausedAt > 0
  })

  /**
   * Inicializar juego (primera vez o cargar desde guardado)
   */
  const initializeGame = () => {
    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const skillsStore = useSkillsStore()
    const marketStore = useMarketStore()

    // Intentar cargar datos guardados
    playerStore.loadFromLocalStorage()
    inventoryStore.loadFromLocalStorage()
    skillsStore.loadFromLocalStorage()
    marketStore.loadFromLocalStorage()

    gameState.value.isInitialized = true
    gameState.value.gameStartedAt = playerStore.player.createdAt
    gameState.value.lastSaveTime = Date.now()
  }

  /**
   * Guardar todos los stores
   */
  const saveGame = () => {
    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const skillsStore = useSkillsStore()
    const marketStore = useMarketStore()

    playerStore.saveToLocalStorage()
    inventoryStore.saveToLocalStorage()
    skillsStore.saveToLocalStorage()
    marketStore.saveToLocalStorage()

    gameState.value.lastSaveTime = Date.now()
  }

  /**
   * Pausar el juego
   */
  const pauseGame = () => {
    if (!isPaused.value) {
      gameState.value.gamePausedAt = Date.now()
    }
  }

  /**
   * Reanudar el juego
   */
  const resumeGame = () => {
    if (isPaused.value) {
      // Ajustar el tiempo de inicio para que el tiempo pausado no cuente
      const pausedDuration = gameState.value.gamePausedAt - gameState.value.gameStartedAt
      gameState.value.gameStartedAt = Date.now() - pausedDuration
      gameState.value.gamePausedAt = 0
    }
  }

  /**
   * Calcular progreso offline
   * (Para cuando el juego se abre después de haber estado cerrado)
   */
  const calculateOfflineProgress = () => {
    const playerStore = usePlayerStore()

    // TODO: Implementar generación de recursos basada en offlineMs
    // Por ahora solo actualizamos el timestamp
    playerStore.updateLastActive()
  }

  /**
   * Resetear juego (DEBUG)
   */
  const resetGame = () => {
    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const skillsStore = useSkillsStore()
    const marketStore = useMarketStore()

    // Resetear todos los stores
    playerStore.player = playerStore.player
    inventoryStore.clear()
    skillsStore.skillStates = skillsStore.skillStates
    marketStore.clearHistory()

    gameState.value.gameStartedAt = Date.now()
    gameState.value.lastSaveTime = Date.now()
  }

  return {
    // State
    gameState,

    // Computed
    gameTime,
    isPaused,

    // Actions
    initializeGame,
    saveGame,
    pauseGame,
    resumeGame,
    calculateOfflineProgress,
    resetGame,
  }
})
