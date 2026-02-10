<template>
  <div class="desktop-layout">
    <!-- Sidebar lateral fijo -->
    <aside class="desktop-sidebar">
      <SidebarNavigation />
    </aside>

    <!-- Contenido principal -->
    <main class="desktop-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarNavigation from '../shared/SidebarNavigation.vue'
</script>

<style scoped>
.desktop-layout {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-dark);
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
</style>
