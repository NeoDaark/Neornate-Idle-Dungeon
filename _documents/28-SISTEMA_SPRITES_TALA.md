# Sistema de Sprites para Tala vs Minería

## Problema
- **Minería**: Usa el mismo icono (⛏️) para la actividad y el mineral
- **Tala**: Usa 2 iconos diferentes:
  - Árbol 🌲 (para la actividad/selector de qué talar)
  - Tronco 🪵 (para el inventario/materiales obtenidos)

---

## Diagrama del Sistema

```
TALA (Skill)
├─ TREES (Datos de árboles)
│  ├─ 'pino': { spriteId: 'tree_pino' } → sprites/custom/trees/tree_pino.png
│  ├─ 'abedul': { spriteId: 'tree_abedul' } → sprites/custom/trees/tree_abedul.png
│  └─ ... (12 árboles más)
│
└─ LOGGING_PRODUCTS (Materiales obtenidos)
   ├─ 'madera-pino': { logSpriteId: 'log_pino' } → sprites/custom/loggs/log_pino.png
   ├─ 'madera-abedul': { logSpriteId: 'log_abedul' } → sprites/custom/loggs/log_abedul.png
   └─ ... (12 maderas más)

COMPONENTES
├─ ProductSelector (Vista Tala)
│  └─ Muestra: IconSprite spriteType="tree" (del árbol)
│
└─ ItemGrid (Inventario)
   └─ Muestra: IconSprite spriteType="log" (del tronco)
```

---

### 1. Actualizaciones de Tipos

#### `Tree.ts`
```typescript
export interface Tree {
  id: string
  i18nKey: string
  level: number
  tier: Tier
  spriteId?: string // "tree_pino", "tree_abedul", etc.
}
```

#### `Skill.ts` (SkillProduct)
```typescript
export interface SkillProduct {
  // ... otros campos
  treeId?: string // referencia al árbol (para maderas)
  logSpriteId?: string // "log_pino", "log_abedul", etc.
}
```

### 2. Datos en `logging.ts`

#### Árboles (TREES)
```typescript
'pino': {
  id: 'pino',
  i18nKey: 'trees.pino.name',
  level: 1,
  tier: Tier.T1,
  spriteId: 'tree_pino', // ← ruta automática
}
```

#### Productos (LOGGING_PRODUCTS)
```typescript
'madera-pino': {
  id: 'madera-pino',
  // ... otros campos
  treeId: 'pino',
  logSpriteId: 'log_pino', // ← ruta automática
}
```

### 3. Utilidades de Resolución (`spriteResolver.ts`)

```typescript
// Para árboles en la vista de Tala
getTreeSpriteUrl(spriteId: string) → "/src/assets/sprites/custom/trees/tree_pino.png"

// Para materiales en el inventario
getLogSpriteUrl(spriteId: string) → "/src/assets/sprites/custom/loggs/log_pino.png"

// Alternativa genérica con fallback a emoji
resolveTreeIcon(spriteId?: string, emoji: string) → ruta o emoji
resolveItemIcon(spriteId?: string, emoji: string) → ruta o emoji
```

### 4. Componente Genérico (`IconSprite.vue`)

Componente reutilizable para mostrar iconos:

```vue
<IconSprite 
  spriteId="tree_pino"
  spriteType="tree"
  fallbackEmoji="🌲"
  size="lg"
/>

<IconSprite 
  spriteId="log_pino"
  spriteType="log"
  fallbackEmoji="🪵"
  size="md"
/>
```

**Props:**
- `spriteId`: ID del sprite (sin `.png`)
- `spriteType`: 'tree' | 'log' | 'mineral' | 'generic'
- `fallbackEmoji`: Emoji si no hay sprite
- `size`: 'xs' (16px) | 'sm' (24px) | 'md' (32px) | 'lg' (64px - nativo) | 'xl' (96px)
- `useSprite`: booleano (false = siempre emoji)
- `alt`: texto alternativo

## Uso en Componentes

### ProductSelector (Vista Tala - seleccionar qué talar)
```vue
<script setup>
import IconSprite from '@/components/common/IconSprite.vue'
import { TREES } from '@/data/skillProducts/logging'

const selectedTree = TREES['pino']
</script>

<template>
  <div>
    <IconSprite 
      :spriteId="selectedTree.spriteId"
      spriteType="tree"
      fallbackEmoji="🌲"
      size="lg"
    />
    <p>{{ selectedTree.id }}</p>
  </div>
</template>
```

### InventoryGrid (Inventario - mostrar materiales)
```vue
<script setup>
import IconSprite from '@/components/common/IconSprite.vue'
import { LOGGING_PRODUCTS } from '@/data/skillProducts/logging'

const item = LOGGING_PRODUCTS['madera-pino']
</script>

<template>
  <div class="inventory-slot">
    <IconSprite 
      :spriteId="item.logSpriteId"
      spriteType="log"
      :fallbackEmoji="item.item.icon"
      size="md"
    />
    <span>{{ item.name }} x{{ quantity }}</span>
  </div>
</template>
```

## Estructura de Archivos

```
src/assets/sprites/custom/
├── trees/
│   ├── tree_pino.png
│   ├── tree_abedul.png
│   └── ... (13 árboles más)
├── loggs/
│   ├── log_pino.png
│   ├── log_abedul.png
│   └── ... (13 troncos más)
├── minerals/
│   └── ... (futura)
└── ...
```

## Migración de Componentes Existentes

### Pasos para actualizar componentes
1. Importar `IconSprite` en el script
2. Reemplazar iconos emoji simples con `<IconSprite>`
3. Usar las props de `spriteId` si están disponibles
4. Mantener `fallbackEmoji` como respaldo

### Ejemplo Antes/Después

**ANTES:**
```vue
<div class="product-card">
  <span class="icon">{{ product.item.icon }}</span>
  <p>{{ product.name }}</p>
</div>
```

**DESPUÉS:**
```vue
<div class="product-card">
  <IconSprite 
    :spriteId="product.logSpriteId"
    spriteType="log"
    :fallbackEmoji="product.item.icon"
    size="md"
  />
  <p>{{ product.name }}</p>
</div>
```

## Renderizado de Imágenes

El componente `IconSprite` usa:
```css
image-rendering: pixelated;
image-rendering: -moz-crisp-edges;
image-rendering: crisp-edges;
```

Esto mantiene los sprites nítidos sin suavizado (importante para pixel art).

## Próximos Pasos

1. ✅ Tipos actualizados
2. ✅ Datos de Tala con spriteIds
3. ✅ Utilidades de resolución
4. ✅ Componente IconSprite genérico
5. ⏳ Actualizar `ProductSelector.vue` para usar árboles con sprites
6. ⏳ Actualizar `InventoryGrid.vue` para mostrar maderas con log sprites
7. ⏳ Aplicar mismo patrón a Minería (si se desea)
8. ⏳ Extender a otros skills (Pesca, Cocina, etc.)

## Referencias

- `src/types/Tree.ts` - Interfaz Tree
- `src/types/Skill.ts` - Interfaz SkillProduct
- `src/data/skillProducts/logging.ts` - Datos de árboles y maderas
- `src/utils/spriteResolver.ts` - Funciones utilitarias
- `src/components/common/IconSprite.vue` - Componente genérico
