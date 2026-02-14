<template>
  <!-- Loading overlay en primera carga -->
  <LoadingOverlay v-if="isLoading" />
  
  <!-- Layout principal (oculto mientras se carga) -->
  <ResponsiveLayout v-if="!isLoading" />
  
  <!-- Notificación de farmeo offline -->
  <OfflineHarvestNotification />
</template>

<script setup lang="ts">
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout.vue'
import LoadingOverlay from '@/components/layouts/LoadingOverlay.vue'
import OfflineHarvestNotification from '@/components/notifications/OfflineHarvestNotification.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useToolsStore } from '@/stores/toolsStore'
import { GAME_CONSTANTS } from '@/types/Game'

// Logs de inicio
console.log('🚀 [App] Archivo App.vue cargado')
console.log(`📱 BASE_URL: ${import.meta.env.BASE_URL}`)
console.log(`📱 MODE: ${import.meta.env.MODE}`)

const gameStore = useGameStore()
const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()
const toolsStore = useToolsStore()

// Estado de loading
const isLoading = ref(true)

// Timers
let saveInterval: ReturnType<typeof setInterval> | null = null
let gameLoopInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  console.log('[App] Iniciando...')
  
  try {
    // Inicializar juego (cargar datos guardados)
    gameStore.initializeGame()
    console.log('[App] Game store inicializado')
    
    // Cargar datos persistidos
    skillsStore.loadFromLocalStorage()
    inventoryStore.loadFromLocalStorage()
    playerStore.loadFromLocalStorage()
    toolsStore.loadFromStorage()
    console.log('[App] Datos cargados desde localStorage')

    // Simular tiempo de carga (3 segundos)
    setTimeout(() => {
      try {
        console.log('[App] Procesando farmeo offline...')
        // Procesar farmeo offline después de que "carga" termina
        gameStore.calculateOfflineProgress()
        console.log('[App] Offline procesado, ocultando loading...')
        // Mostrar layout
        isLoading.value = false
        console.log('[App] Layout visible')
        
        // Iniciar game loop DESPUÉS de procesar offline
        startGameLoop()
      } catch (error) {
        console.error('[App] Error en setTimeout:', error)
        isLoading.value = false
        // Aún así iniciar game loop aunque haya error
        startGameLoop()
      }
    }, 3000)
  } catch (error) {
    console.error('[App] Error en onMounted:', error)
    isLoading.value = false
  }

  // Pre-cargar componentes críticos para mejor rendimiento
  // Esto evita que haya lag cuando el usuario navega a Skills por primera vez
  Promise.all([
    import('@/views/SkillsView.vue'),
    import('@/components/skills/MiningSkill.vue'),
    import('@/components/skills/LoggingSkill.vue'),
  ]).catch(() => {
    // Ignorar errores de pre-carga (no crítico)
  })

  // Función para iniciar el game loop (se llama DESPUÉS de calcular offline)
  const startGameLoop = () => {
    // Game loop - actualiza cada 100ms
    gameLoopInterval = setInterval(() => {
      // Procesar skills activos
      const activeSkills = skillsStore.activeSkills
      
      activeSkills.forEach(skill => {
        const now = Date.now()
        // Si el ciclo se completó
        if (skill.cycleEndTime > 0 && now >= skill.cycleEndTime) {
          const result = skillsStore.completeCycle(skill.skill, inventoryStore)
          
          // Si se completó correctamente y el skill sigue activo, reiniciar automáticamente
          if (result && skill.isActive) {
            const currentState = skillsStore.getSkillState(skill.skill)
            if (currentState.currentProduct) {
              const cycleDurationMs = currentState.currentProduct.cycleDuration * 1000
              skillsStore.activateSkill(skill.skill, currentState.currentProduct, cycleDurationMs)
            }
          } else if (!result && skill.isActive) {
            // Si completeCycle retorna null (materiales insuficientes), detener el skill
            console.warn(`[Game] Skill ${skill.skill} detenido: materiales insuficientes`)
            skillsStore.deactivateSkill(skill.skill)
          }
        }
      })
    }, GAME_CONSTANTS.GAME_LOOP_TICK)

    // Auto-save periódico
    saveInterval = setInterval(() => {
      gameStore.saveGame()
      skillsStore.saveToLocalStorage()
      inventoryStore.saveToLocalStorage()
      playerStore.saveToLocalStorage()
      toolsStore.saveToStorage()
      console.log('[Game] Auto-save realizado')
    }, GAME_CONSTANTS.AUTO_SAVE_INTERVAL)

    console.log('[App] Game loop iniciado')
  }
})

onUnmounted(() => {
  // Guardar al desmontar la app
  gameStore.saveGame()
  skillsStore.saveToLocalStorage()
  inventoryStore.saveToLocalStorage()
  playerStore.saveToLocalStorage()
  toolsStore.saveToStorage()
  
  if (saveInterval) {
    clearInterval(saveInterval)
  }
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0e0e0e;
  color: #e0e0e0;
  overflow: hidden;
}
</style>

