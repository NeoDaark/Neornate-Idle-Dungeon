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
      // console.log('[Offline] Primera vez abriendo (sin lastActiveTime guardado)')
      return
    }

    const lastActiveTime = parseInt(lastActiveStr, 10)
    const now = Date.now()
    let offlineMs = now - lastActiveTime

    // console.log(`[Offline] lastActiveTime=${lastActiveTime}, now=${now}, offlineMs=${offlineMs}ms`)

    // Limitar tiempo offline máximo a 2 horas
    if (offlineMs > MAX_OFFLINE_TIME_MS) {
      // console.log(`[Offline] Tiempo offline ${offlineMs}ms > máximo ${MAX_OFFLINE_TIME_MS}ms. Limitado a 2 horas.`)
      offlineMs = MAX_OFFLINE_TIME_MS
    }

    // Umbral mínimo: 5 segundos de offline para procesar farmeo
    if (offlineMs < 5000) {
      // console.log(`[Offline] Offline insuficiente (${offlineMs}ms < 5000ms). Ignorando.`)
      return
    }

    // console.log(`[Offline] Procesando ${offlineMs}ms de farmeo offline`)

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

      // IMPORTANTE: Si hay producto pero cycleEndTime=0, significa que el skill estaba detenido
      // esperando materiales. Asumimos que ahora (después de offline) podrían haber materiales.
      // Intentamos procesar al menos 1 ciclo.
      const hasCycleTime = skillState.cycleEndTime > 0
      
      if (!hasCycleTime) {
        // Skill detenido esperando materiales - intentar procesar 1 ciclo
        // console.log(`[Offline] ${skillState.skill}: Sin cycleEndTime (esperando materiales), intentando 1 ciclo`)
        
        // TypeScript guard
        if (!skillState.currentProduct) {
          console.error(`[Offline] Error interno: currentProduct desapareció para ${skillState.skill}`)
          return
        }

        // Obtener duración del ciclo
        const baseCycleDuration = skillState.currentProduct.cycleDuration * 1000 // ms
        const toolBonus = toolsStore.calculateToolBonus(skillState.skill)
        let cycleDuration = baseCycleDuration
        
        if (toolBonus.speedBonus !== 0) {
          cycleDuration = Math.max(500, baseCycleDuration - (toolBonus.speedBonus * 1000))
        }

        // Intentar completar UN ciclo
        const result = skillsStore.completeCycle(skillState.skill, inventoryStore, false)
        
        if (result) {
          // console.log(`[Offline] ✓ ${skillState.skill}: Ciclo completado (estaba esperando materiales)`)
          harvests.push({
            skill: skillState.skill,
            cyclesCompleted: 1,
            totalQuantity: result.quantity,
            totalXP: result.xpGained,
          })
          // Establecer cycleEndTime para siguiente ciclo
          skillState.cycleEndTime = now + cycleDuration
        } else {
          // console.log(`[Offline] ✗ ${skillState.skill}: Aún no hay materiales disponibles`)
        }
        return
      }

      // En este punto hay tanto producto como cycleEndTime válido
      if (!skillState.currentProduct) {
        console.error(`[Offline] Error interno: currentProduct desapareció para ${skillState.skill}`)
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

      // Calcular cuánto tiempo faltaba para que el ciclo se completara
      const timeUntilCycleCompletes = skillState.cycleEndTime - lastActiveTime

      let cyclesCompleted = 0

      //console.log(`[Offline] ${skillState.skill}: cycleEndTime=${skillState.cycleEndTime}, lastActiveTime=${lastActiveTime}, timeUntilCycleCompletes=${timeUntilCycleCompletes}ms, offlineMs=${offlineMs}ms, cycleDuration=${cycleDuration}ms`)

      if (timeUntilCycleCompletes >= 0 && offlineMs >= timeUntilCycleCompletes) {
        // El ciclo EN PROGRESO se completó durante la desconexión
        cyclesCompleted = 1
        
        // Calcular ciclos adicionales después del primero
        const timeAfterFirstComplete = offlineMs - timeUntilCycleCompletes
        const additionalCycles = Math.floor(timeAfterFirstComplete / cycleDuration)
        cyclesCompleted += additionalCycles
        
        //console.log(`[Offline] → Ciclo en progreso completó + ${additionalCycles} adicionales = ${cyclesCompleted} total`)
      } else if (timeUntilCycleCompletes < 0) {
        // El ciclo ya estaba completado cuando se cerró (cycleEndTime < lastActiveTime)
        // Todos los ciclos serán nuevos
        cyclesCompleted = Math.floor(offlineMs / cycleDuration)
        
        //console.log(`[Offline] → Ciclo ya estaba completado, nuevos ciclos = ${cyclesCompleted}`)
      } else {
        //console.log(`[Offline] → Ciclo en progreso pero offline insuficiente (faltaban ${timeUntilCycleCompletes}ms)`)
      }

      if (cyclesCompleted > 0) {
        //console.log(`[Offline] Skill ${skillState.skill}: Calculados ${cyclesCompleted} ciclos teóricos`)
        
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

          //console.log(`[Offline] Procesando ciclo ${i + 1}/${cyclesCompleted} para ${skillState.skill}`)
          const result = skillsStore.completeCycle(skillState.skill, inventoryStore, false)
          if (result) {
            totalQuantity += result.quantity
            totalXP += result.xpGained
            actualCyclesCompleted++
            //console.log(`[Offline] ✓ Ciclo ${i + 1}: +${result.quantity} ${result.product.id}, +${result.xpGained} XP (total: ${totalQuantity}, ${totalXP})`)
          } else {
            // Error inesperado en completeCycle
            console.error(`[Offline] ✗ Ciclo ${i + 1} falló inesperadamente. Deteniendo.`)
            break
          }
        }

        //console.log(`[Offline] ${skillState.skill} finalizó: ${actualCyclesCompleted} ciclos completados, totalQuantity=${totalQuantity}, totalXP=${totalXP}`)

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
          //console.log(`[Offline] ${skillState.skill}: ${actualCyclesCompleted} ciclos completados. Nuevo cycleEndTime=${skillState.cycleEndTime}`)
        } else {
          // No se completó ningún ciclo pero se calcularon - actualizar cycleEndTime de otra forma
          skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
          //console.log(`[Offline] ${skillState.skill}: Sin ciclos completados. Nuevo cycleEndTime=${skillState.cycleEndTime}`)
        }
      } else {
        // No se calculó ningún ciclo teórico - actualizar cycleEndTime restando tiempo offline
        skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
        //console.log(`[Offline] ${skillState.skill}: Sin ciclos teóricos. Nuevo cycleEndTime=${skillState.cycleEndTime}`)
      }
    })

    // Guardar resumen si hay farmeo
    if (harvests.length > 0) {
      //console.log(`[Offline] Guardando resumen de ${harvests.length} skill(s) con farmeo`)
      offlineHarvestSummary.value = {
        totalOfflineMs: offlineMs,
        skillHarvests: harvests,
      }
      //console.log(`[Offline] offlineHarvestSummary asignado:`, offlineHarvestSummary.value)
    } /*else { // este else no es necesario porque el resumen solo se asigna si hay harvests, pero lo dejo comentado por claridad
      //console.log(`[Offline] No hay harvests para guardar (harvests.length = 0)`)
    }*/ 

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
