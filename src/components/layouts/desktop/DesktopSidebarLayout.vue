<template>
  <div class="desktop-layout">
    <!-- Header -->
    <header class="desktop-header">
      <!-- Sección izquierda: Botón + Nivel + XP (ancho del sidebar) -->
      <div class="header-left">
        <button 
          class="toggle-sidebar-btn"
          @click="sidebarVisible = !sidebarVisible"
          :title="sidebarVisible ? 'Ocultar sidebar' : 'Mostrar sidebar'"
        >
          <FaIcon :icon="sidebarVisible ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right'" />
        </button>
        <div class="header-content">
          <!-- Fila 1: Nivel + Nombre -->
          <div class="header-row-1">
            <span class="level-label">Lvl</span>
            <span class="level-value">{{ playerLevel }}</span>
            <span class="player-name">{{ playerName }}</span>
          </div>
          <!-- Fila 2: Nombre de clase -->
          <div class="header-row-class">
            <span class="class-name">{{ playerClassName }}</span>
          </div>
          <!-- Fila 3: Barra de XP -->
          <div class="header-row-2">
            <div class="exp-bar">
              <div class="exp-fill" :style="{ width: expProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección derecha: Trabajo activo (ocupa el resto) -->
      <PlayerInfo />
    </header>

    <!-- Contenedor principal con sidebar y contenido -->
    <div class="desktop-main">
      <!-- Sidebar lateral fijo -->
      <aside class="desktop-sidebar" v-if="sidebarVisible">
        <SidebarNavigation />
      </aside>

      <!-- Contenido principal -->
      <main class="desktop-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-scale" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import SidebarNavigation from '../shared/SidebarNavigation.vue'
import PlayerInfo from '../shared/PlayerInfo.vue'

const sidebarVisible = ref(true)
const playerStore = usePlayerStore()

const playerLevel = computed(() => playerStore.player.level)
const playerExp = computed(() => playerStore.player.experience)
const playerName = computed(() => playerStore.player.name)
const playerClassName = computed(() => playerStore.classMetadata?.displayName || 'Desconocido')

const nextLevelXP = computed(() => {
  const level = playerLevel.value
  return 100 + (level * 50)
})

const expProgress = computed(() => {
  const next = nextLevelXP.value
  return Math.round((playerExp.value / next) * 100)
})
</script>

<style scoped>
.desktop-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--bg-dark);
}

/* ===== HEADER ===== */
.desktop-header {
  display: grid;
  grid-template-columns: 238px 1fr;
  align-items: center;
  padding: 12px 16px;
  padding-top: max(12px, calc(12px + env(safe-area-inset-top)));
  padding-left: max(16px, calc(16px + env(safe-area-inset-left)));
  padding-right: max(16px, calc(16px + env(safe-area-inset-right)));
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
  gap: 0;
  flex-shrink: 0;
}

/* Sección izquierda: Botón + Nivel + XP */
.header-left {
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding-right: 16px;
  border-right: 2px solid var(--border-color);
  width: 224px;
}

.toggle-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: auto;
  border: none;
  background: rgba(255, 165, 0, 0.15);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle-sidebar-btn:hover {
  background: rgba(255, 165, 0, 0.25);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

/* Fila 1: Nivel + Nombre */
.header-row-1 {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  line-height: 1;
}

/* Fila 2: Nombre de clase */
.header-row-class {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  line-height: 1;
}

.class-name {
  color: var(--text-muted);
  font-size: 0.7rem;
  flex-shrink: 0;
  line-height: 1;
}

/* Fila 3: Barra de XP */
.header-row-2 {
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.level-label {
  color: var(--text-secondary);
  font-weight: 600;
}

.level-value {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 16px;
}

.player-name {
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 500;
  flex-shrink: 0;
}

.exp-bar {
  flex: 1;
  height: 2px;
  background: rgba(255, 85, 85, 0.2);
  border-radius: 1px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-danger), var(--color-danger), rgba(255, 85, 85, 0.5));
  transition: width 0.3s ease;
}

.exp-text {
  color: var(--text-muted);
  font-size: 0.65rem;
  flex-shrink: 0;
  min-width: 24px;
}

/* ===== MAIN CONTAINER ===== */
.desktop-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
.desktop-sidebar {
  width: 240px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

/* ===== MAIN CONTENT ===== */
.desktop-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ===== SCROLLBARS ===== */
.desktop-sidebar::-webkit-scrollbar,
.desktop-content::-webkit-scrollbar {
  width: 6px;
}

.desktop-sidebar::-webkit-scrollbar-track,
.desktop-content::-webkit-scrollbar-track {
  background: transparent;
}

.desktop-sidebar::-webkit-scrollbar-thumb,
.desktop-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.desktop-sidebar::-webkit-scrollbar-thumb:hover,
.desktop-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* ===== TRANSITIONS ===== */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.1s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0.5;
  transform: scale(1.02);
}
</style>
