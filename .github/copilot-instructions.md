# 🎮 Neornate - Idle Dungeon: AI Agent Instructions

## 📋 Project Overview

**Neornate - Idle Dungeon** es un juego híbrido RPG/Idle para móvil (Android e iOS) que combina:
- **Idle Mechanics**: Generación pasiva de recursos mediante oficios (minería, tala, pesca, etc.)
- **Dungeon Exploration**: Exploración de mapas 2D generados proceduralmente en Canvas
- **Combat & Loot**: Sistema de combate turn-based con drops de enemigos
- **Equipment Management**: Sistema de mejora de equipo (+1, +2, +3...) con tiers RPG
- **Economy**: Mercado para compra/venta de recursos y equipos

**Inspiración**: Melvor Idle + Dungeon Crawlers clásicos

---

## 🏗️ Architecture Overview

### **Tech Stack**
- **Framework**: Vue 3 + TypeScript (Strict mode enabled)
- **State Management**: Pinia (stores pattern)
- **Build Tool**: Vite (dev server + bundler)
- **Mobile**: Capacitor v6 (iOS & Android)
- **CSS**: Custom CSS variables (defined in `src/assets/styles/main.css`)
- **Routing**: Vue Router v4

### **Directory Structure**
```
src/
├─ components/       # Reutilizable Vue components (layout, UI, forms)
├─ router/          # Vue Router configuration & routes
├─ stores/          # Pinia stores (state management)
├─ types/           # TypeScript interfaces & type definitions
├─ views/           # Page-level components (routed via Vue Router)
├─ assets/          # Static assets (images, fonts, styles)
│  └─ styles/       # Global CSS (uses CSS variables)
├─ App.vue          # Root component
└─ main.ts          # Application entry point
```

### **Key Files**
- `package.json`: Project dependencies + build/dev scripts
- `tsconfig.json`: TypeScript config (target: ES2020, strict mode)
- `vite.config.ts`: Vite configuration with `@` alias for `src/`
- `index.html`: Entry HTML (mounts Vue app to `#app`)

---

## 🎯 Critical Development Patterns

### **State Management with Pinia**
All global state lives in `src/stores/`. Each store is a separate file using the Composition API pattern:

```typescript
// Example: src/stores/gameStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const player = ref({ name: 'Aventurero', level: 1 })
  
  const setPlayerName = (name: string) => {
    player.value.name = name
  }
  
  // Use computed() for derived state
  const displayName = computed(() => `${player.value.name} (Lvl ${player.value.level})`)
  
  return { player, setPlayerName, displayName }
})
```

**Planned Stores** (from prompt design):
- `gameStore`: Global game state, time sync
- `playerStore`: Character stats, class, equipment
- `inventoryStore`: Items, stacks, equipment slots
- `skillsStore`: Skill levels, XP, products (Minería, Tala, etc.)
- `marketStore`: Prices, transaction history
- `dungeonStore`: Maps, combat state, loot

### **Vue Component Structure**
Use `<script setup>` with TypeScript:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const localState = ref(0)
const derived = computed(() => localState.value * 2)
</script>

<template>
  <div class="component">
    <p>{{ gameStore.player.name }}</p>
  </div>
</template>

<style scoped>
/* Component-scoped styles only */
.component { }
</style>
```

### **Routing Convention**
Routes defined in `src/router/index.ts` with lazy-loaded views:

```typescript
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/dungeon', name: 'dungeon', component: () => import('@/views/DungeonView.vue') },
]
```

Each view corresponds to a major section (Dashboard, Dungeon, Market, etc.)

---

## 🎨 Styling Conventions

### **CSS Variables** (defined in `src/assets/styles/main.css`)
```css
:root {
  --color-primary: #ffa500;      /* Orange accent */
  --color-secondary: #ff7700;    /* Darker orange */
  --color-success: #55ff55;      /* Green */
  --color-danger: #ff5555;       /* Red */
  --color-warning: #ffaa55;      /* Yellow */
  --bg-dark: #0e0e0e;            /* Main background */
  --bg-darker: #0a0a0a;          /* Darker variant */
  --bg-card: #1a1a1a;            /* Card background */
  --text-primary: #e0e0e0;       /* Main text */
  --text-secondary: #aaa;        /* Secondary text */
  --text-muted: #666;            /* Muted text */
  --border-color: #333;          /* Borders */
}
```

**Do NOT use hardcoded colors.** Always reference CSS variables for consistency. Example:

```css
.button {
  background: var(--color-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

### **Responsive Design**
- Mobile-first approach (Capacitor for iOS/Android)
- `overflow: hidden` on body to prevent scrollbars
- Use `display: flex` for layouts (Header + Sidebar + Content)

---

## 🔧 Build & Development Commands

### **Development**
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run type-check   # TypeScript type checking (no emit)
```

### **Production**
```bash
npm run build        # Vite build to dist/
npm run preview      # Preview built app locally
```

### **Capacitor Mobile**
```bash
npm run cap-add-android    # Add Android native project
npm run cap-add-ios        # Add iOS native project
npm run cap-sync           # Sync web assets to native projects
npm run cap-open-android   # Open Android Studio
npm run cap-open-ios       # Open Xcode
```

---

## 🔄 Data Flow & Persistence

### **LocalStorage/State Sync**
- Pinia stores should persist critical game state (player, inventory, skill levels)
- Use `localStorage` API within store actions for save/load
- **Not yet implemented**: Automatic sync every 30s; consider adding in `App.vue` with `setInterval`

### **Time-Based Mechanics (Idle System)**
- Store `lastActiveTime` timestamp when game closes
- On game load, calculate elapsed time to retroactively grant resources
- **Challenge**: Canvas rendering must account for offline time calculations

---

## 📝 TypeScript Conventions

### **File Naming**
- Components: `PascalCase` (e.g., `SidebarMenu.vue`, `InventoryGrid.vue`)
- Stores: `camelCase` with `Store` suffix (e.g., `gameStore.ts`)
- Types/Interfaces: `PascalCase` (e.g., `Player.ts`, `Skill.ts`)
- Utils/Helpers: `camelCase` (e.g., `calculateXP.ts`)

### **Type Definitions**
Create types in `src/types/` directory:

```typescript
// src/types/Player.ts
export interface Player {
  id: string
  name: string
  level: number
  experience: number
  class: 'Warrior' | 'Mage' | 'Rogue'
  stats: Stats
}

export interface Stats {
  health: number
  mana: number
  strength: number
  intelligence: number
}
```

Use strict TypeScript - no `any` types without explicit `// @ts-ignore` comments.

---

## 🎮 Game Mechanics (Reference from `_documents/01-SISTEMA_OFICIOS.md`)

### **Tiers & Level Progression**
- **T1**: Levels 0-20 (Principiante)
- **T2**: Levels 20-40 (Aprendiz)
- **T3**: Levels 40-60 (Oficial)
- **T4**: Levels 60-80 (Experto)
- **T5**: Levels 80-100 (Maestro)
- **T6**: Levels 100-120 (Legendario)
- **T7**: Levels 120-200 (Divino - prestige mode, no level-up after 120)

### **Skills (Oficios)**
1. **Minería** (⛏️): Extract minerals - no requirements
2. **Tala** (🌲): Extract wood - no requirements
3. **Fundición** (🔥): Crafting - requires minerals + fuel
4. **Herrería/Carpintería** (🔨/🪵): Crafting - requires lingotes
5. **Pesca** (🎣): Extract fish - no requirements
6. **Cocina** (🍳): Crafting - requires fish → food
7. **Aventura** (🗺️): Combat/Loot - requires level

### **XP Formula**
```
XP_next_level = 100 + (nivel × 50) + (tier × 300)
```

Example: Level 20 needs ~1,500 XP to reach level 21.

---

## ⚠️ Known Limitations & TODOs

### **Not Yet Implemented**
- [ ] Canvas 2D dungeon rendering
- [ ] Procedural map generation (needs `seedrandom` library)
- [ ] Combat system (turn-based logic)
- [ ] Sidebar + Layout components
- [ ] Skill UI components (7 oficios)
- [ ] Equipment system & Herrero
- [ ] Market/Inventory UI
- [ ] LocalStorage persistence layer

### **Performance Considerations**
- Canvas rendering will be CPU-intensive → use RequestAnimationFrame (RAF)
- Lazy-load skill components to reduce initial bundle
- Throttle state updates in game loop (update every 100ms, not per frame)

---

## 🔗 Integration Points

### **With Capacitor (Mobile)**
- Check `capacitor.config.json` (not yet in repo) for native plugin configuration
- Use `@capacitor/core` for native features (storage, notifications, etc.)

### **External Libraries to Add**
- `seedrandom`: For procedural map generation
- `Canvas rendering library` (optional): Pixi.js or Babylon.js (currently using native Canvas API)

---

## ✅ Checklist for New Features

When adding a new section (e.g., Herrero, Market):

1. **Create Types** → `src/types/Herrero.ts`
2. **Create Store** → `src/stores/herreroStore.ts`
3. **Create View** → `src/views/HerrerView.vue`
4. **Add Route** → Update `src/router/index.ts`
5. **Create Components** → `src/components/herrero/` subdirectory
6. **Add Sidebar Entry** → Update layout components
7. **Add Styles** → Reference CSS variables in `main.css`
8. **Test Type Safety** → Run `npm run type-check`

---

## 🚀 Quick Start for AI Agents

To get productive quickly:

1. **Understanding State**: All global state is in `src/stores/` - start there
2. **UI Layout**: Check `src/views/HomeView.vue` for current structure
3. **Adding a Page**: Copy Vue Router pattern from existing route
4. **Styling**: Always use CSS variables defined in `main.css`
5. **TypeScript**: Enable strict mode in your IDE; no `any` types
6. **Mobile First**: Remember this is for iOS/Android - test on small screens

---

**Last Updated**: 10 de febrero de 2026  
**Project Version**: 1.0.0  
**Framework**: Vue 3 + TypeScript + Capacitor
