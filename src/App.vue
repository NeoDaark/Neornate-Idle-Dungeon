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
  // Inicializar juego (cargar datos guardados)
  gameStore.initializeGame()
  
  // Cargar datos persistidos
  skillsStore.loadFromLocalStorage()
  inventoryStore.loadFromLocalStorage()
  playerStore.loadFromLocalStorage()
  toolsStore.loadFromStorage()

  // Simular tiempo de carga (3 segundos)
  setTimeout(() => {
    // Procesar farmeo offline después de que "carga" termina
    gameStore.calculateOfflineProgress()
    // Mostrar layout
    isLoading.value = false
  }, 3000)

  // Pre-cargar componentes críticos para mejor rendimiento
  // Esto evita que haya lag cuando el usuario navega a Skills por primera vez
  Promise.all([
    import('@/views/SkillsView.vue'),
    import('@/components/skills/MiningSkill.vue'),
    import('@/components/skills/LoggingSkill.vue'),
  ]).catch(() => {
    // Ignorar errores de pre-carga (no crítico)
  })

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

