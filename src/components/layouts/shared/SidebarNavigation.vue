<template>
  <nav class="sidebar-navigation">
    <!-- Logo/Header -->
    <div class="nav-header">
      <h2 class="logo">⚔️ Neornate</h2>
    </div>

    <!-- Menu Items -->
    <div class="nav-menu">
      <!-- Inicio -->
      <router-link
        to="/"
        class="nav-item"
        :class="{ active: isActive('/') }"
        @click="$emit('navigate')"
      >
        <span class="icon">🏠</span>
        <span class="label">{{ t('ui.menu.home') }}</span>
      </router-link>

      <!-- Oficios (con subopciones) -->
      <div class="nav-group">
        <button 
          class="nav-item group-toggle"
          :class="{ active: skillsExpanded }"
          @click="skillsExpanded = !skillsExpanded"
        >
          <span class="icon">⚒️</span>
          <span class="label">{{ t('ui.menu.skills') }}</span>
          <span class="expand-icon">{{ skillsExpanded ? '▼' : '▶' }}</span>
        </button>

        <!-- Subopciones de skills -->
        <transition name="expand">
          <div v-if="skillsExpanded" class="nav-submenu">
            <router-link
              v-for="skill in skillMenuItems"
              :key="skill.skill"
              :to="skill.path"
              class="nav-subitem"
              :class="{ active: isSkillItemActive(skill.path), 'is-farming': isSkillActive(skill.skill) }"
              @click="$emit('navigate')"
            >
              <span class="icon">{{ skill.icon }}</span>
              <div class="subitem-content">
                <div class="subitem-header">
                  <span class="label">{{ t(skill.label) }}</span>
                  <span v-if="isSkillActive(skill.skill)" class="farming-badge">⚡<!--{{ t('labels.active') }}--></span>
                </div>
                <div class="skill-info">
                  <span class="level">Lvl {{ getSkillLevel(skill.skill) }}</span>
                  <div class="xp-bar">
                    <div 
                      class="xp-fill"
                      :style="{ width: getSkillXPProgress(skill.skill) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Inventario -->
      <router-link
        to="/inventory"
        class="nav-item with-info"
        :class="{ active: isActive('/inventory') }"
        @click="$emit('navigate')"
      >
        <span class="icon">🎒</span>
        <div class="item-content">
          <span class="label">{{ t('ui.menu.inventory') }}</span>
          <span class="info-text">{{ inventoryUsed }}/{{ inventoryMax }}</span>
        </div>
      </router-link>

      <!-- Mazmorra -->
      <router-link
        to="/dungeon"
        class="nav-item"
        :class="{ active: isActive('/dungeon') }"
        @click="$emit('navigate')"
      >
        <span class="icon">🗺️</span>
        <span class="label">{{ t('ui.menu.dungeon') }}</span>
      </router-link>

      <!-- Mercado -->
      <router-link
        to="/market"
        class="nav-item"
        :class="{ active: isActive('/market') }"
        @click="$emit('navigate')"
      >
        <span class="icon">🏪</span>
        <span class="label">{{ t('ui.menu.market') }}</span>
      </router-link>
    </div>

    <!-- Footer -->
    <div class="nav-footer">
      <!-- Botón de cierre (solo móvil) -->
      <button 
        class="nav-item close-btn mobile-only"
        @click="$emit('navigate')"
        :title="t('ui.menu.close')"
      >
        <span class="icon">✕</span>
      </button>
      
      <router-link 
        to="/settings" 
        class="nav-item settings-link"
        @click="$emit('navigate')"
      >
        <span class="icon">⚙️</span>
        <span class="label">{{ t('ui.menu.settings') }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { Skill } from '@/types/Game'

const route = useRoute()
const { t } = useI18n()
const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()

const skillsExpanded = ref(false)

// Expandir automáticamente cuando estamos en /skills
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/skills') {
      skillsExpanded.value = true
    }
  },
  { immediate: true }
)

interface SkillMenuItem {
  skill: Skill
  path: string
  label: string
  icon: string
}

const skillMenuItems: SkillMenuItem[] = [
  { skill: Skill.MINERIA, path: '/skills?skill=mineria', label: 'skills.mineria.name', icon: '⛏️' },
  { skill: Skill.TALA, path: '/skills?skill=tala', label: 'skills.tala.name', icon: '🌲' },
  { skill: Skill.FUNDICION, path: '/skills?skill=fundicion', label: 'skills.fundicion.name', icon: '🔥' },
  { skill: Skill.HERRERIA, path: '/skills?skill=herreria', label: 'skills.herreria.name', icon: '🔨' },
  { skill: Skill.PESCA, path: '/skills?skill=pesca', label: 'skills.pesca.name', icon: '🎣' },
  { skill: Skill.COCINA, path: '/skills?skill=cocina', label: 'skills.cocina.name', icon: '🍳' },
  { skill: Skill.AVENTURA, path: '/skills?skill=aventura', label: 'skills.aventura.name', icon: '⚔️' },
]

const isActive = (path: string) => {
  return route.path === path
}

const isSkillItemActive = (skillPath: string): boolean => {
  if (route.path !== '/skills') return false
  
  // Extraer el parámetro skill de la URL actual
  const currentSkill = route.query.skill as string
  
  // Extraer el parámetro skill del path del item
  const urlParams = new URLSearchParams(skillPath.split('?')[1])
  const itemSkill = urlParams.get('skill')
  
  return currentSkill === itemSkill
}

const getSkillLevel = (skill: Skill): number => {
  const state = skillsStore.getSkillState(skill)
  return state.level
}

const getSkillXPProgress = (skill: Skill): number => {
  return skillsStore.getXPProgress(skill)
}

const isSkillActive = (skill: Skill): boolean => {
  const state = skillsStore.getSkillState(skill)
  return state.isActive
}

const inventoryUsed = computed(() => {
  return inventoryStore.totalSlots
})

const inventoryMax = computed(() => {
  // TODO: Implementar capacidad máxima de inventario basada en stats del jugador
  return 50
})

defineEmits<{
  navigate: []
}>()
</script>

<style scoped>
.sidebar-navigation {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-darker);
}

@media (min-width: 720px) {
  .sidebar-navigation {
    border-right: none;
  }
}

.nav-header {
  padding: 10px 12px;
  border-bottom: none;
}

.logo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 6px;
  overflow-y: auto;
}

/* ===== NAV ITEMS ===== */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  font: inherit;
  will-change: background-color, color, transform;
}

.nav-item:hover {
  color: var(--text-primary);
  background: rgba(255, 165, 0, 0.1);
}

.nav-item:active {
  background: rgba(255, 165, 0, 0.2);
  transform: scale(0.98);
}

.nav-item.active {
  color: var(--text-primary);
  background: rgba(255, 165, 0, 0.15);
  border-color: var(--color-primary);
}

.icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* ===== NAV ITEM CON INFO ===== */
.nav-item.with-info {
  position: relative;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  align-items: flex-start;
}

.info-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* ===== NAV GROUPS (SUBOPCIONES) ===== */
.nav-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.group-toggle {
  justify-content: space-between;
}

.expand-icon {
  font-size: 0.75rem;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.group-toggle.active .expand-icon {
  transform: rotate(0deg);
}

/* ===== NAV SUBMENU ===== */
.nav-submenu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 8px;
  border-left: 2px solid rgba(255, 165, 0, 0.3);
  margin-left: 20px;
}

.nav-subitem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  border: 1px solid transparent;
  font-size: 0.85rem;
  will-change: background-color, color, transform;
}

.nav-subitem:hover {
  color: var(--text-primary);
  background: rgba(255, 165, 0, 0.08);
}

.nav-subitem:active {
  background: rgba(255, 165, 0, 0.15);
  transform: scale(0.98);
}

.nav-subitem.active {
  color: var(--text-primary);
  background: rgba(255, 165, 0, 0.12);
  border-color: var(--color-primary);
}

.subitem-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.subitem-header {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
}

.farming-badge {
  font-size: 0.7rem;
  background: rgba(85, 255, 85, 0.2);
  color: var(--color-success);
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  white-space: nowrap;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
}

.level {
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.xp-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 165, 0, 0.2);
  border-radius: 2px;
  overflow: hidden;
  min-width: 50px;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ===== NAV FOOTER ===== */
.nav-footer {
  padding: 8px 6px;
  border-top: none;
  display: flex;
  gap: 6px;
  align-items: stretch;
}

.close-btn {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.close-btn .icon {
  font-size: 1rem;
}

.settings-link {
  flex: 1;
  height: 36px;
  padding: 0 10px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--border-color);
}

.mobile-only {
  display: none;
}

/* Mostrar solo en modo móvil */
@media (max-width: 719px) {
  .mobile-only {
    display: flex;
  }
}

/* ===== TRANSITIONS ===== */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* ===== SCROLLBAR ===== */
.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.nav-menu::-webkit-scrollbar-track {
  background: transparent;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
