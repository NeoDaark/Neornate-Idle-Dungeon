<template>
  <div class="mobile-layout" :class="{ 'menu-open': menuOpen }">
    <!-- Botón flotante para abrir menú -->
    <button 
      class="floating-menu-btn"
      @click="menuOpen = !menuOpen"
      :title="t('ui.menu.toggle')"
    >
      {{ menuOpen ? '✕' : '☰' }}
    </button>

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

/* ===== BOTÓN FLOTANTE ===== */
.floating-menu-btn {
  position: fixed;
  bottom: 8px;
  left: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  padding: 10px 10px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  cursor: pointer;
  background: transparent;
  font: inherit;
  will-change: background-color, color, transform;
  border: 1px solid var(--border-color);
}

.floating-menu-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 165, 0, 0.1);
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
  padding-top: max(0px, env(safe-area-inset-top));
  padding-left: max(0px, env(safe-area-inset-left));
  padding-right: max(0px, env(safe-area-inset-right));
  padding-bottom: max(0px, env(safe-area-inset-bottom));
  overflow-y: auto;
}

/* ===== MAIN CONTENT ===== */
.mobile-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: max(0px, env(safe-area-inset-top));
  padding-bottom: max(0px, env(safe-area-inset-bottom));
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
