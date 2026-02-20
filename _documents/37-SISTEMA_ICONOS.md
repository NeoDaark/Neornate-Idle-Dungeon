# 🎨 Sistema de Iconos - IconRenderer

## 📋 Descripción General

El sistema de iconos utiliza un componente `IconRenderer` que soporta tanto **iconos personalizados (custom sprites)** como **iconos de FontAwesome** (fallback).

**Versión**: 1.0.0  
**Fecha**: 20 de febrero de 2026

---

## 🏗️ Arquitectura

### Flujo de Carga de Iconos

```
1. IconRenderer intenta cargar icono custom desde /sprites/custom/ui/{iconId}.png
2. Si el archivo existe → muestra la imagen personalizada
3. Si NO existe → muestra el icono de FontAwesome como fallback
```

### Componente IconRenderer

**Ubicación**: `src/components/common/IconRenderer.vue`

```vue
<IconRenderer
  :icon-id="skillConfig.icon"        <!-- ID del icono (ej: 'mineria', 'tala') -->
  :fa-icon="skillConfig.faIcon"      <!-- Clase de FontAwesome (ej: 'fa-solid fa-mountain') -->
  class="custom-class"               <!-- Clases CSS adicionales (opcional) -->
/>
```

---

## 📦 SKILL_CONFIGS - Estructura de Iconos

Cada skill en `src/types/Game.ts` tiene dos propiedades de icono:

```typescript
export const SKILL_CONFIGS: Record<Skill, SkillConfig> = {
  [Skill.MINERIA]: {
    name: 'mineria',
    emoji: '⛏️',              // Emoji (legacy, aún se usa en algunas partes)
    icon: 'pickaxe',           // ID del icono para custom sprites
    faIcon: 'fa-solid fa-mountain',  // Clase de FontAwesome como fallback
    type: 'extraction',
    baseCycleDuration: 5,
  },
  // ... más skills
}
```

### Mapeado Actual de Skills

| Skill | icon ID | FontAwesome |
|-------|---------|-------------|
| **MINERIA** | `pickaxe` | `fa-solid fa-mountain` |
| **TALA** | `tree` | `fa-solid fa-tree` |
| **FUNDICION** | `furnace` | `fa-solid fa-fire` |
| **QUEMADO** | `burn` | `fa-solid fa-fire-flame-curved` |
| **HERRERIA** | `hammer` | `fa-solid fa-hammer` |
| **PESCA** | `fishing` | `fa-solid fa-fish` |
| **COCINA** | `cooking` | `fa-solid fa-utensils` |
| **AVENTURA** | `adventure` | `fa-solid fa-wand-magic-sparkles` |

---

## 🚀 Cómo Usar

### En Vue Components

```vue
<template>
  <IconRenderer
    :icon-id="miningConfig.icon"
    :fa-icon="miningConfig.faIcon"
    class="skill-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SKILL_CONFIGS, Skill } from '@/types/Game'
import IconRenderer from '@/components/common/IconRenderer.vue'

const miningConfig = computed(() => SKILL_CONFIGS[Skill.MINERIA])
</script>
```

### Usando Directamente desde SKILL_CONFIGS

Si necesitas el icono en otro lugar (como en el sidebar):

```vue
<IconRenderer
  :icon-id="SKILL_CONFIGS[skill.skill].icon"
  :fa-icon="SKILL_CONFIGS[skill.skill].faIcon"
/>
```

---

## 🎨 Agregar Iconos Personalizados

### Paso 1: Crear la carpeta (si no existe)

```
src/assets/
└── sprites/
    └── custom/
        └── ui/
```

### Paso 2: Agregar la imagen

**Ubicación**: `public/sprites/custom/ui/mineria.png`

**Requisitos**:
- Formato: PNG (transparencia recomendada)
- Tamaño: 32x32px (recomendado para consistencia)
- Nombre: **debe coincidir con el `icon` en SKILL_CONFIGS**

### Paso 3: IconRenderer lo detectará automáticamente

No hay cambios de código necesarios. IconRenderer intentará cargar automáticamente `/sprites/custom/ui/mineria.png`. Si existe, lo usará; si no, fallback a FontAwesome.

---

## ⚙️ Detalles Técnicos

### Props del Componente

```typescript
interface Props {
  /** ID del icono (usado para construir la ruta) */
  iconId: string
  
  /** Clase de FontAwesome como fallback */
  faIcon: string
  
  /** Clases CSS adicionales (opcional) */
  class?: string
}
```

### Datos Reactivos

```typescript
const hasCustomIcon = ref(false)    // ¿Se encontró icono custom?
const isLoading = ref(true)         // ¿Está en proceso de carga?
```

### Ruta de Iconos Custom

```
/sprites/custom/ui/{iconId}.png
```

Ej: `/sprites/custom/ui/pickaxe.png`

---

## 🔍 Depuración

### Para verificar qué icono se está usando

Abre las DevTools (F12) y busca en el HTML:

- **Icono custom cargado**: verás una etiqueta `<img>`
- **Fallback a FontAwesome**: verás un componente `<FaIcon>`

### Si no ves ningún icono

1. **Verifica que FontAwesome está cargado**:
   - Busca en `src/main.ts` que `FontAwesomeIcon` está registrado como `FaIcon`
   - Verifica que las librerías están importadas (`fas`, `fab`)

2. **Verifica los props**:
   - `iconId` debe existir en SKILL_CONFIGS como `icon`
   - `faIcon` debe ser una clase válida de FontAwesome (ej: `fa-solid fa-mountain`)

3. **Revisa la consola del navegador** para errores

---

## 📝 Mantenimiento

### Agregar un nuevo skill con iconos

1. Actualiza `SKILL_CONFIGS` en `src/types/Game.ts`:
```typescript
[Skill.NUEVO]: {
  name: 'nuevo',
  emoji: '🆕',
  icon: 'nuevo-id',           // ID único para custom sprites
  faIcon: 'fa-solid fa-star',  // FontAwesome como fallback
  type: 'extraction',
  baseCycleDuration: 5,
}
```

2. (Opcional) Agrega imagen custom: `/sprites/custom/ui/nuevo-id.png`

3. IconRenderer lo detectará automáticamente

---

## 🌍 Lugares donde se Usa IconRenderer

1. **SkillCard** (`src/components/skills/SkillCard.vue`): Mostrar icono del skill en la tarjeta
2. **MiningSkill, LoggingSkill, etc.**: Encabezado de las vistas de skills
3. **PlayerInfo** (`src/components/layouts/shared/PlayerInfo.vue`): Mostrar skill activo
4. **SidebarNavigation** (`src/components/layouts/shared/SidebarNavigation.vue`): Menú de skills

---

## 🔮 Futuro

- [ ] Agregar sistema de precarga de iconos custom
- [ ] Cache de iconos en localStorage
- [ ] Animaciones de carga en IconRenderer
- [ ] Soporte para variantes de iconos (normal, hover, active)
- [ ] Sprite sheets para optimizar tamaño

---

**Last Updated**: 20 de febrero de 2026  
**Maintainer**: AI Agent
