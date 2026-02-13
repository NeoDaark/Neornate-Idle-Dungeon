import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlayerStore } from './playerStore'
import { useInventoryStore } from './inventoryStore'
import { useSkillsStore } from './skillsStore'
import { useMarketStore } from './marketStore'
import { useToolsStore } from './toolsStore'

// Constantes del sistema offline
const MAX_OFFLINE_TIME_MS = 2 * 60 * 60 * 1000 // 2 horas en milisegundos

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
   * Registro de farmeo offline (para mostrar notificación)
   */
  const offlineHarvestSummary = ref<{
    totalOfflineMs: number
    skillHarvests: Array<{
      skill: string
      cyclesCompleted: number
      totalQuantity: number
      totalXP: number
    }>
  } | null>(null)

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

    // Guardar timestamp de última actividad (para calcular offline después)
    localStorage.setItem('neornate_lastActiveTime', Date.now().toString())
    
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
    const skillsStore = useSkillsStore()
    const inventoryStore = useInventoryStore()
    const toolsStore = useToolsStore()

    // Obtener el último timestamp de actividad guardado
    const lastActiveStr = localStorage.getItem('neornate_lastActiveTime')
    if (!lastActiveStr) {
      // Primera vez que abre el juego
      return
    }

    const lastActiveTime = parseInt(lastActiveStr, 10)
    const now = Date.now()
    let offlineMs = now - lastActiveTime

    // Limitar tiempo offline máximo a 2 horas
    if (offlineMs > MAX_OFFLINE_TIME_MS) {
      console.log(`[Offline] Tiempo offline ${offlineMs}ms > máximo ${MAX_OFFLINE_TIME_MS}ms. Limitado a 2 horas.`)
      offlineMs = MAX_OFFLINE_TIME_MS
    }

    // Umbral mínimo: 5 segundos de offline para procesar farmeo
    if (offlineMs < 5000) {
      return
    }

    console.log(`[Offline] Procesando ${offlineMs}ms de farmeo offline`)

    // Preparar resumen para la notificación
    const harvests: Array<{
      skill: string
      cyclesCompleted: number
      totalQuantity: number
      totalXP: number
    }> = []

    // Procesar cada skill activo que estaba corriendo
    Object.values(skillsStore.skillStates).forEach((skillState) => {
      if (!skillState.isActive || !skillState.currentProduct || skillState.cycleEndTime === 0) {
        return
      }

      // Obtener duración del ciclo CON bonuses de herramienta aplicados
      const baseCycleDuration = skillState.currentProduct.cycleDuration * 1000 // ms
      const toolBonus = toolsStore.calculateToolBonus(skillState.skill)
      let cycleDuration = baseCycleDuration
      
      if (toolBonus.speedBonus !== 0) {
        // speedBonus es en segundos (negativo = más rápido)
        cycleDuration = Math.max(500, baseCycleDuration - (toolBonus.speedBonus * 1000))
      }

      // Calcular cuánto tiempo había transcurrido cuando se cerró el juego
      const timeInProgressAtClose = skillState.cycleEndTime - lastActiveTime

      // Si el ciclo ya estaba en progreso, sumar el tiempo offline + tiempo restante
      const totalTimeAvailable = offlineMs + Math.max(0, timeInProgressAtClose)

      // Calcular ciclos completados
      const cyclesCompleted = Math.floor(totalTimeAvailable / cycleDuration)

      if (cyclesCompleted > 0) {
        console.log(`[Offline] Skill ${skillState.skill}: ${cyclesCompleted} ciclos completados`)
        
        // Acumular estadísticas
        let totalQuantity = 0
        let totalXP = 0

        // Procesar cada ciclo completado
        for (let i = 0; i < cyclesCompleted; i++) {
          const result = skillsStore.completeCycle(skillState.skill, inventoryStore)
          if (result) {
            totalQuantity += result.quantity
            totalXP += result.xpGained
            console.log(`[Offline] +${result.quantity} ${result.product.id}, +${result.xpGained} XP`)
          }
        }

        // Guardar en resumen
        harvests.push({
          skill: skillState.skill,
          cyclesCompleted,
          totalQuantity,
          totalXP,
        })

        // Actualizar cycleEndTime al nuevo tiempo esperado
        const timeUsedByCompletedCycles = cyclesCompleted * cycleDuration
        const remainingTime = totalTimeAvailable - timeUsedByCompletedCycles
        skillState.cycleEndTime = now + (cycleDuration - remainingTime)
      }
    })

    // Guardar resumen si hay farmeo
    if (harvests.length > 0) {
      offlineHarvestSummary.value = {
        totalOfflineMs: offlineMs,
        skillHarvests: harvests,
      }
    }

    // Guardar de nuevo para actualizar el estado con farmeo procesado
    saveGame()
  }

  /**
   * Limpiar el resumen de farmeo offline después de mostrarlo
   */
  const clearOfflineHarvestSummary = () => {
    offlineHarvestSummary.value = null
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
    offlineHarvestSummary,

    // Computed
    gameTime,
    isPaused,

    // Actions
    initializeGame,
    saveGame,
    pauseGame,
    resumeGame,
    calculateOfflineProgress,
    clearOfflineHarvestSummary,
    resetGame,
  }
})
