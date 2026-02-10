<template>
  <div class="main-layout">
    <aside class="sidebar">
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
          ⚙️
        </router-link>
      </div>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()

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
}

/* ============ SIDEBAR ============ */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-darker) 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
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
  gap: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.settings-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background: rgba(255, 165, 0, 0.2);
}

/* ============ MAIN CONTENT ============ */
.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .sidebar {
    width: 180px;
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
  }

  .label {
    font-size: 13px;
  }
}
</style>
