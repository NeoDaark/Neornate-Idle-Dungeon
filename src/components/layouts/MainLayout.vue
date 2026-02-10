<template>
  <div class="main-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Toggle Button (Fuera del sidebar) -->
    <button 
      class="sidebar-toggle-btn" 
      @click="sidebarOpen = !sidebarOpen" 
      :title="t('ui.menu.toggle')"
      :style="{ left: sidebarOpen ? '210px' : '-30px' }"
    >
      {{ sidebarOpen ? '✕' : '☰' }}
    </button>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2 class="logo">⚔️ Neornate</h2>
      </div>

      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ t(item.label) }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/settings" class="settings-btn" :title="t('ui.menu.settings')">
          ⚙️ {{ t('ui.menu.settings') }}
        </router-link>
      </div>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()
const sidebarOpen = ref(false)

interface MenuItem {
  path: string
  label: string
  icon: string
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'ui.menu.home', icon: '🏠' },
  { path: '/skills', label: 'ui.menu.skills', icon: '⚒️' },
  { path: '/inventory', label: 'ui.menu.inventory', icon: '🎒' },
  { path: '/dungeon', label: 'ui.menu.dungeon', icon: '🗺️' },
  { path: '/market', label: 'ui.menu.market', icon: '🏪' },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.main-layout {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-dark);
  position: relative;
}

/* ============ SIDEBAR ============ */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100%;
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-darker) 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  margin-bottom: 32px;
  text-align: center;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 16px;
}

.logo {
  font-size: 24px;
  margin: 0;
  color: var(--color-primary);
  letter-spacing: 1px;
}

/* ============ NAVIGATION MENU ============ */
.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 165, 0, 0.1);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}

.nav-item.active {
  background: rgba(255, 165, 0, 0.2);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

.icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============ SIDEBAR FOOTER ============ */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.settings-btn {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
}

.settings-btn:hover {
  background: rgba(255, 165, 0, 0.2);
  transform: translateX(2px);
}

/* ============ SIDEBAR TOGGLE BUTTON (Independiente) ============ */
.sidebar-toggle-btn {
  position: fixed;
  bottom: 14px;
  transform: translateY(0);
  width: 50px;
  height: 47px;
  margin-left: 28px;
  background: var(--color-primary);
  border: 2px solid var(--bg-darker);
  color: #000;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.sidebar-toggle-btn:hover {
  background: var(--color-secondary);
  /*box-shadow: 2px 4px 12px rgba(255, 165, 0, 0.4);*/
}

.sidebar-toggle-btn:active {
  transform: translateY(0);
}

/* ============ MAIN CONTENT ============ */
.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 0;
  transition: margin-left 0.3s ease;
  width: 100%;
}

.sidebar-open .content {
  margin-left: 240px;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    padding: 12px;
  }

  .sidebar-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .logo {
    font-size: 20px;
  }

  .nav-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  .label {
    font-size: 12px;
  }

  .settings-btn {
    font-size: 12px;
    padding: 8px 10px;
  }

  .sidebar-toggle-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }

  .sidebar-open .content {
    margin-left: 200px;
  }
}
</style>
