import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SKILL_CONFIGS } from '@/types/Game'
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
      return
    }

    const lastActiveTime = parseInt(lastActiveStr, 10)
    const now = Date.now()
    let offlineMs = now - lastActiveTime

    // Limitar tiempo offline máximo a 2 horas
    if (offlineMs > MAX_OFFLINE_TIME_MS) {
      offlineMs = MAX_OFFLINE_TIME_MS
    }

    // Umbral mínimo: 5 segundos de offline para procesar farmeo
    if (offlineMs < 5000) {
      return
    }

    // Preparar resumen para la notificación
    const harvests: Array<{
      skill: string
      cyclesCompleted: number
      totalQuantity: number
      totalXP: number
    }> = []

    // Procesar cada skill activo que estaba corriendo
    Object.values(skillsStore.skillStates).forEach((skillState) => {
      // console.log(`[Offline] Checking ${skillState.skill}: isActive=${skillState.isActive}, currentProduct=${skillState.currentProduct?.id ?? 'null'}, cycleEndTime=${skillState.cycleEndTime}`)
      
      const hasProduct = skillState.currentProduct !== undefined && skillState.currentProduct !== null
      
      if (!hasProduct) {
        // console.log(`[Offline] ✗ ${skillState.skill}: Sin producto, saltando`)
        return
      }

      // En este punto hay tanto producto como cycleEndTime válido
      if (!skillState.currentProduct) {
        console.error(`[Offline] Error interno: currentProduct desapareció para ${skillState.skill}`)
        return
      }

      // Obtener duración del ciclo CON bonuses de herramienta aplicados
      let baseCycleDuration: number
      baseCycleDuration = SKILL_CONFIGS[skillState.skill].baseCycleDuration * 1000 // ms
      
      const toolBonus = toolsStore.calculateToolBonus(skillState.skill)
      let cycleDuration = baseCycleDuration
      
      // Aplicar bonus de velocidad de herramienta (si existe)
      if ( toolBonus.speedBonus !== 0) {
        // speedBonus es en segundos (negativo = más rápido)
        cycleDuration = Math.max(500, baseCycleDuration - (toolBonus.speedBonus * 1000))
      }

      // Calcular cuánto tiempo faltaba para que el ciclo se completara
      const timeUntilCycleCompletes = skillState.cycleEndTime - lastActiveTime

      let cyclesCompleted = 0

      if (timeUntilCycleCompletes >= 0 && offlineMs >= timeUntilCycleCompletes) {
        // El ciclo EN PROGRESO se completó durante la desconexión
        cyclesCompleted = 1
        
        // Calcular ciclos adicionales después del primero
        const timeAfterFirstComplete = offlineMs - timeUntilCycleCompletes
        const additionalCycles = Math.floor(timeAfterFirstComplete / cycleDuration)
        cyclesCompleted += additionalCycles

      } else {
        // Todos los ciclos serán nuevos
        cyclesCompleted = Math.floor(offlineMs / cycleDuration)
      }

      if (cyclesCompleted > 0) {
        // Acumular estadísticas
        let totalQuantity = 0
        let totalXP = 0
        let actualCyclesCompleted = 0 // Contador de ciclos que sí se completaron

        // Procesar cada ciclo completado
        for (let i = 0; i < cyclesCompleted; i++) {
          // Verificación previa: ¿tenemos materiales para este ciclo?
          if (skillState.currentProduct?.requiredMaterials && skillState.currentProduct.requiredMaterials.length > 0) {
            const hasMaterials = skillState.currentProduct.requiredMaterials.every((mat) => {
              return inventoryStore.getItemQuantity(mat.itemId) >= mat.quantity
            })
            if (!hasMaterials) {
              console.warn(`[Offline] ✗ Ciclo ${i + 1} bloqueado: materiales insuficientes. Deteniendo.`)
              break
            }
          }

          const result = skillsStore.completeCycle(skillState.skill, inventoryStore, false)
          if (result) {
            totalQuantity += result.quantity
            totalXP += result.xpGained
            actualCyclesCompleted++
          } else {
            // Error inesperado en completeCycle
            console.error(`[Offline] ✗ Ciclo ${i + 1} falló inesperadamente. Deteniendo.`)
            break
          }
        }
        // Guardar en resumen solo si se completó al menos un ciclo
        if (actualCyclesCompleted > 0) {
          harvests.push({
            skill: skillState.skill,
            cyclesCompleted: actualCyclesCompleted,
            totalQuantity,
            totalXP,
          })
        }

        // Actualizar cycleEndTime basado en ciclos REALES completados
        if (actualCyclesCompleted > 0) {
          const timeUsedByCompletedCycles = actualCyclesCompleted * cycleDuration
          const timeIntoCycleAfterComplete = offlineMs - timeUsedByCompletedCycles
          
          // El nuevo cycleEndTime comienza ahora y durará (cycleDuration - timeAlreadyElapsed)
          skillState.cycleEndTime = now + Math.max(0, cycleDuration - timeIntoCycleAfterComplete)
        } else {
          // No se completó ningún ciclo pero se calcularon - actualizar cycleEndTime de otra forma
          skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
        }
      } else {
        skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
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

  /**
   * Resetear store a su estado inicial
   */
  const reset = () => {
    gameState.value = {
      isInitialized: false,
      gameStartedAt: 0,
      lastSaveTime: 0,
      gamePausedAt: 0,
    }
    offlineHarvestSummary.value = null
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
    reset,
  }
})
