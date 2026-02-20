import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SKILL_CONFIGS, Skill } from '@/types/Game'
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

    // ⚠️ PRE-VALIDACIÓN: Verificar cuántos skills tienen farmeo activo guardado
    // (DEBE estar isActive=true + producto + cycleEndTime válido)
    const activeSkillsOffline = Object.values(skillsStore.skillStates).filter(
      (state) => 
        state.isActive === true &&
        state.currentProduct !== undefined && 
        state.currentProduct !== null && 
        state.cycleEndTime > 0
    )

    // Si hay múltiples skills con estado de farmeo, limpiar todos EXCEPTO el primero
    if (activeSkillsOffline.length > 1) {
      console.warn(`[Offline] ⚠️ ${activeSkillsOffline.length} skills con farmeo guardado. Solo procesando ${activeSkillsOffline[0].skill}.`)
      
      // Desactivar todos los skills excepto el primero
      for (let i = 1; i < activeSkillsOffline.length; i++) {
        activeSkillsOffline[i].isActive = false
        activeSkillsOffline[i].currentProduct = undefined
        activeSkillsOffline[i].cycleEndTime = 0
      }
    }

    // Procesar cada skill que estaba corriendo (ahora máximo 1)
    activeSkillsOffline.forEach((skillState) => {
      // En este punto ya sabemos que hay producto y cycleEndTime válido
      // porque los filtramos en la pre-validación
      
      // Obtener duración del ciclo CON bonuses de herramienta aplicados
      const baseCycleDuration = SKILL_CONFIGS[skillState.skill].baseCycleDuration * 1000 // ms
      const toolBonus = toolsStore.calculateToolBonus(skillState.skill)
      let cycleDuration = baseCycleDuration
      
      // Aplicar bonus de velocidad de herramienta (si existe)
      if (toolBonus.speedBonus !== 0) {
        // speedBonus es en segundos (negativo = más rápido)
        cycleDuration = Math.max(500, baseCycleDuration - (toolBonus.speedBonus * 1000))
      }

      // Calcular cuánto tiempo faltaba para que el ciclo EN PROGRESO se completara
      const timeUntilCycleCompletes = skillState.cycleEndTime - lastActiveTime

      let cyclesCompleted = 0

      // LÓGICA CORREGIDA:
      if (timeUntilCycleCompletes > 0 && offlineMs >= timeUntilCycleCompletes) {
        // El ciclo EN PROGRESO se completó durante la desconexión
        cyclesCompleted = 1
        
        // Calcular ciclos adicionales después del primero
        const timeAfterFirstComplete = offlineMs - timeUntilCycleCompletes
        const additionalCycles = Math.floor(timeAfterFirstComplete / cycleDuration)
        cyclesCompleted += additionalCycles

      } else if (timeUntilCycleCompletes <= 0) {
        // cycleEndTime ya había pasado antes de desconectarse
        // Todos los ciclos son nuevos
        cyclesCompleted = Math.floor(offlineMs / cycleDuration)
      } else {
        // offlineMs < timeUntilCycleCompletes
        // No se completó ningún ciclo (menos de 5 segundos)
        cyclesCompleted = 0
      }

      if (cyclesCompleted > 0) {
        // Acumular estadísticas
        let totalQuantity = 0
        let totalXP = 0
        let actualCyclesCompleted = 0

        // Procesar cada ciclo completado
        for (let i = 0; i < cyclesCompleted; i++) {
          // Verificación previa: ¿tenemos materiales para este ciclo?
          if (skillState.currentProduct?.requiredMaterials && skillState.currentProduct.requiredMaterials.length > 0) {
            const hasMaterials = skillState.currentProduct.requiredMaterials.every((mat) => {
              return inventoryStore.getItemQuantity(mat.itemId) >= mat.quantity
            })
            if (!hasMaterials) {
              console.warn(`[Offline] ✗ Ciclo ${i + 1} bloqueado: materiales insuficientes (${skillState.skill}). Deteniendo.`)
              break
            }
          }

          // ESPECIAL PARA QUEMADO: validar troncos
          if (skillState.skill === Skill.QUEMADO) {
            const troncoDisponible = inventoryStore.getItemQuantity(skillState.currentProduct!.item.id)
            if (troncoDisponible < 1) {
              console.warn(`[Offline] ✗ Ciclo ${i + 1} bloqueado: no hay troncos para quemar (${skillState.skill}). Deteniendo.`)
              break
            }
            // Log para debugging (descomenta si es necesario)
            // console.log(`[Offline] QUEMADO Ciclo ${i + 1}: Troncos disponibles = ${troncoDisponible}`)
          }

          const result = skillsStore.completeCycle(skillState.skill, inventoryStore, false)
          if (result) {
            totalQuantity += result.quantity
            totalXP += result.xpGained
            actualCyclesCompleted++
          } else {
            // Error en completeCycle (ej: QUEMADO falló en drops)
            console.error(`[Offline] ✗ Ciclo ${i + 1} falló (${skillState.skill}). Deteniendo.`)
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

          // Actualizar cycleEndTime para el siguiente ciclo
          // Tiempo usado = ciclos completados * duración de cada uno
          const timeUsedByCompletedCycles = actualCyclesCompleted * cycleDuration
          // Tiempo que ya pasó del ciclo actual (puede ser negativo si aún hay tiempo)
          const timeIntoCycle = offlineMs - timeUsedByCompletedCycles
          // El nuevo cycleEndTime = ahora + lo que falta del ciclo
          skillState.cycleEndTime = now + Math.max(0, cycleDuration - timeIntoCycle)
        } else {
          // Ningún ciclo se completó (ej: sin materiales desde el inicio)
          // El cycleEndTime simplemente se adelanta por el tiempo offline
          skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
          // Si resultó <= 0, el ciclo ya se completó y espera ser reiniciado
        }
      } else {
        // cyclesCompleted = 0 (menos de 1 ciclo pasó)
        // Actualizar cycleEndTime adelantando el reloj
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
