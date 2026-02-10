<template>
  <div class="mobile-layout" :class="{ 'menu-open': menuOpen }">
    <!-- Header con Toggle -->
    <header class="mobile-header">
      <button 
        class="menu-toggle"
        @click="menuOpen = !menuOpen"
        :title="t('ui.menu.toggle')"
      >
        {{ menuOpen ? '✕' : '☰' }}
      </button>
      <h1 class="header-title">⚔️ Neornate</h1>
      <div class="header-spacer"></div>
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
      <Transition name="fade-scale" mode="out-in">
        <RouterView />
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import SidebarNavigation from '../shared/SidebarNavigation.vue'

const { t } = useI18n()
const menuOpen = ref(false)
</script>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--bg-dark);
  position: relative;
}

/* ===== HEADER ===== */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-darker) 100%);
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
  height: 56px;
  flex-shrink: 0;
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: rgba(255, 165, 0, 0.1);
  color: var(--color-primary);
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: rgba(255, 165, 0, 0.2);
  border-color: var(--color-primary);
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
  width: 85%;
  max-width: 280px;
  height: 100%;
  z-index: 999;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

/* ===== MAIN CONTENT ===== */
.mobile-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
