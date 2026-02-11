<template>
  <div class="desktop-layout">
    <!-- Header -->
    <header class="desktop-header">
      <button 
        class="toggle-sidebar-btn"
        @click="sidebarVisible = !sidebarVisible"
        :title="sidebarVisible ? 'Ocultar sidebar' : 'Mostrar sidebar'"
      >
        {{ sidebarVisible ? '◄' : '►' }}
      </button>
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
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SidebarNavigation from '../shared/SidebarNavigation.vue'
import PlayerInfo from '../shared/PlayerInfo.vue'

const sidebarVisible = ref(true)
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  padding-top: max(12px, calc(12px + env(safe-area-inset-top)));
  padding-left: max(16px, calc(16px + env(safe-area-inset-left)));
  padding-right: max(16px, calc(16px + env(safe-area-inset-right)));
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  flex-shrink: 0;
}

.toggle-sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.toggle-sidebar-btn:hover {
  background: rgba(255, 165, 0, 0.1);
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
