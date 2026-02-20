# Referencia Rápida: Tamaños de Sprites

## Información Base

**Todos los sprites del proyecto son: 64x64 píxeles**

---

## Tamaños en IconSprite.vue

| Size | Tailwind | Píxeles | Escala | Uso Recomendado |
|------|----------|---------|--------|-----------------|
| `xs` | `w-4 h-4` | 16x16 | 25% | Iconos muy pequeños (insignias) |
| `sm` | `w-6 h-6` | 24x24 | 37.5% | Iconos pequeños (barras laterales) |
| `md` | `w-8 h-8` | 32x32 | 50% | Iconos medianos (listas, inventario) |
| `lg` | `w-16 h-16` | 64x64 | 100% | Tamaño nativo - sin interpolación |
| `xl` | `w-24 h-24` | 96x96 | 150% | Iconos grandes (modales, destacados) |

---

## Uso en Componentes

### ProductSelector (Vista de Tala)
```vue
<IconSprite 
  :spriteId="TREES[currentProduct.treeId]?.spriteId"
  spriteType="tree"
  size="lg"  <!-- 64x64 nativo -->
/>
```

### ItemGrid (Inventario)
```vue
<IconSprite 
  :spriteId="LOGGING_PRODUCTS[stack.itemId].logSpriteId"
  spriteType="log"
  size="md"  <!-- 32x32 escalado -->
/>
```

---

## Rutas de Sprites

### Árboles (spriteType="tree")
```
src/assets/sprites/custom/trees/
├── tree_pino.png (64x64)
├── tree_abedul.png (64x64)
├── ... (14 árboles total)
```

**Cómo obtener la ruta:**
```typescript
// Automático en IconSprite:
`/src/assets/sprites/custom/trees/${spriteId}.png`
```

### Troncos/Maderas (spriteType="log")
```
src/assets/sprites/custom/loggs/
├── log_pino.png (64x64)
├── log_abedul.png (64x64)
├── ... (14 maderas total)
```

**Cómo obtener la ruta:**
```typescript
// Automático en IconSprite:
`/src/assets/sprites/custom/loggs/${spriteId}.png`
```

---

## Renderizado Pixel-Perfect

El componente `IconSprite.vue` aplica:

```css
img {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

Esto asegura que los sprites mantengan bordes nítidos sin suavizado (AA).

---

## Seleccionar el Tamaño Correcto

### Para Vistas Completas (64x64 nativo)
- `size="lg"` → ProductSelector, detalles grandes
- Razón: Sin interpolación, máxima claridad

### Para Listas (32x32)
- `size="md"` → ItemGrid, InventoryGrid, listas
- Razón: Compacto pero legible

### Para Barras Laterales (24x24)
- `size="sm"` → Menús, navegación
- Razón: Espacio limitado

### Para Pequeños (16x16)
- `size="xs"` → Insignias, decoración mínima
- Razón: Muy pequeño

---

## Fallback a Emoji

Si no hay sprite disponible, IconSprite muestra automáticamente el emoji:

```vue
<IconSprite 
  :spriteId="maybeNull"
  spriteType="log"
  fallbackEmoji="🪵"  <!-- Se muestra si spriteId es null/undefined -->
  size="md"
/>
```

---

## Extensión Futura

Si añades más sprites (minerales, etc.):

1. Crear carpeta: `src/assets/sprites/custom/minerals/`
2. Agregar archivos: `mineral_*.png` (64x64)
3. Usar en componentes:
   ```vue
   <IconSprite 
     :spriteId="`mineral_${name}`"
     spriteType="mineral"
     size="md"
   />
   ```

El componente resolverá automáticamente la ruta a:
`/src/assets/sprites/custom/minerals/mineral_*.png`

---

**Actualizado**: 19 de febrero de 2026
