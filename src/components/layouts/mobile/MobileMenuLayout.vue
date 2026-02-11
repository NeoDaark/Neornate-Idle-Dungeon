<template>
  <div class="mobile-layout" :class="{ 'menu-open': menuOpen }">
    <!-- Header superior fijo -->
    <header class="mobile-header">
      <button 
        class="menu-btn"
        @click="menuOpen = !menuOpen"
        :title="t('ui.menu.toggle')"
      >
        <FaIcon :icon="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" />
      </button>
      <div class="header-section">
        <div class="header-player-info">
          <span class="level-label">Lvl</span>
          <span class="level-value">{{ playerLevel }}</span>
          <span class="player-name">{{ playerName }}</span>
        </div>
        <div class="header-class-info">
          <span class="class-name">{{ playerClassName }}</span>
        </div>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: expProgress + '%' }"></div>
        </div>
      </div>
      <PlayerInfo />
    </header>

    <!-- Overlay + Menu fullscreen -->
    <transition name="menu-slide">
      <div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false"></div>
    </transition>

    <transition name="menu-slide">
      <aside v-if="menuOpen" class="mobile-menu">
        <SidebarNavigation @navigate="menuOpen = false" />
      </aside>
    </transition>

    <!-- Contenido principal -->
    <main class="mobile-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-scale" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { usePlayerStore } from '@/stores/playerStore'
import SidebarNavigation from '../shared/SidebarNavigation.vue'
import PlayerInfo from '../shared/PlayerInfo.vue'

const { t } = useI18n()
const playerStore = usePlayerStore()
const menuOpen = ref(false)

const playerLevel = computed(() => playerStore.player.level)
const playerName = computed(() => playerStore.player.name)
const playerExp = computed(() => playerStore.player.experience)
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
.mobile-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: var(--bg-dark);
  position: relative;
  overflow: hidden;
}

/* ===== HEADER SUPERIOR ===== */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
  padding-top: max(8px, calc(8px + env(safe-area-inset-top)));
  padding-left: max(12px, calc(12px + env(safe-area-inset-left)));
  padding-right: max(12px, calc(12px + env(safe-area-inset-right)));
  background: var(--bg-darker);
  border-bottom: none;
  gap: 12px;
  flex-shrink: 0;
  z-index: 100;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.menu-btn:hover {
  background: rgba(255, 165, 0, 0.1);
}

.menu-btn:active {
  opacity: 0.7;
}

.header-player-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.level-label {
  color: var(--text-secondary);
  font-weight: 600;
}

.level-value {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 16px;
}

.player-name {
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
}

.header-class-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
}

.class-name {
  color: var(--text-muted);
  font-size: 0.65rem;
  flex-shrink: 0;
}

.exp-bar {
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

.header-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
  flex-shrink: 0;
}

/* ===== MENU OVERLAY ===== */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* ===== MOBILE MENU ===== */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  box-shadow: none;
  overflow-y: auto;
}

/* ===== MAIN CONTENT ===== */
.mobile-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
}

/* ===== TRANSITIONS ===== */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.3s ease;
}

.menu-slide-enter-from .mobile-menu,
.menu-slide-leave-to .mobile-menu {
  transform: translateX(-100%);
}

.menu-slide-enter-from .menu-overlay,
.menu-slide-leave-to .menu-overlay {
  opacity: 0;
}

/* ===== SCROLLBAR ===== */
.mobile-content::-webkit-scrollbar {
  width: 6px;
}

.mobile-content::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.mobile-content::-webkit-scrollbar-thumb:hover {
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
