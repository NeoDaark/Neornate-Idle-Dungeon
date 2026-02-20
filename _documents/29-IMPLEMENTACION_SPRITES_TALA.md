# Actualización: Sistema de Sprites para Tala ✅

## Resumen de Cambios

### 1. **Tipos Actualizados**
- ✅ `Tree.ts`: Agregado `spriteId?: string`
- ✅ `Skill.ts` (SkillProduct): Agregado `logSpriteId?: string`

### 2. **Datos Configurados**
- ✅ `logging.ts` - TREES: 14 árboles con spriteIds (`tree_pino`, `tree_abedul`, etc.)
- ✅ `logging.ts` - LOGGING_PRODUCTS: 14 maderas con logSpriteIds (`log_pino`, `log_abedul`, etc.)

### 3. **Utilidades Creadas**
- ✅ `src/utils/spriteResolver.ts`:
  - `getTreeSpriteUrl()` → resuelve rutas de árboles
  - `getLogSpriteUrl()` → resuelve rutas de maderas
  - `resolveTreeIcon()` / `resolveItemIcon()` → fallback a emoji

### 4. **Componente Genérico**
- ✅ `src/components/common/IconSprite.vue`:
  - Soporta sprites + emojis
  - Prop `spriteType: 'tree' | 'log' | 'mineral'`
  - 5 tamaños: `xs | sm | md | lg | xl`
  - Renderizado pixel-perfect

### 5. **Componentes Actualizados**

#### **ProductSelector.vue** (Vista de Tala)
```vue
<!-- ANTES: Icono emoji o imagen genérica -->
<div class="icon">
  <span v-else>{{ currentProduct.item.icon }}</span>
</div>

<!-- DESPUÉS: IconSprite con sprite del árbol -->
<IconSprite 
  v-if="props.skill === 'tala' && currentProduct.treeId"
  :spriteId="TREES[currentProduct.treeId]?.spriteId"
  spriteType="tree"
  :fallbackEmoji="currentProduct.item.icon"
  size="lg"
/>
```

#### **ItemGrid.vue** (Inventario)
```vue
<!-- ANTES: Icono emoji o imagen genérica -->
<div class="item-icon">
  <span v-else>{{ stack.item.icon }}</span>
</div>

<!-- DESPUÉS: IconSprite con sprite del tronco/madera -->
<IconSprite 
  v-if="LOGGING_PRODUCTS[stack.itemId]?.logSpriteId"
  :spriteId="LOGGING_PRODUCTS[stack.itemId].logSpriteId"
  spriteType="log"
  :fallbackEmoji="stack.item.icon"
  size="md"
/>
```

### 6. **Documentación**
- ✅ `_documents/28-SISTEMA_SPRITES_TALA.md`:
  - Explicación del problema
  - Solución implementada
  - Ejemplos de uso
  - Próximos pasos
- ✅ `_documents/30-REFERENCIA_SPRITES_TAMAÑOS.md`:
  - Tabla de tamaños (xs, sm, md, lg, xl)
  - Rutas de sprites
  - Casos de uso recomendados
  - Información: **Todos los sprites son 64x64 píxeles**

---

## Flujo Visual

```
VISTA DE TALA (ProductSelector)
┌────────────────────────────┐
│ Icono: [sprite del árbol]  │  ← sprites/custom/trees/tree_pino.png
│ "Talar Pino"               │
│ Nivel: 1                   │
│ XP: 6                       │
│ Cantidad: 1                │
└────────────────────────────┘
        ↓ (Tala 1 árbol)
        ↓
INVENTARIO (ItemGrid)
┌────────────────────────────┐
│ Icono: [sprite del tronco] │  ← sprites/custom/loggs/log_pino.png
│ "Madera de Pino" x5        │
│ (Puedes vender/usar)       │
└────────────────────────────┘
```

---

## Archivos Modificados

1. **Tipos:**
   - `src/types/Tree.ts`
   - `src/types/Skill.ts`

2. **Datos:**
   - `src/data/skillProducts/logging.ts`

3. **Utilidades:**
   - `src/utils/spriteResolver.ts` (NUEVA)

4. **Componentes:**
   - `src/components/common/IconSprite.vue` (NUEVA)
   - `src/components/skills/ProductSelector.vue` (ACTUALIZADO)
   - `src/components/inventory/ItemGrid.vue` (ACTUALIZADO)

5. **Documentación:**
   - `_documents/28-SISTEMA_SPRITES_TALA.md` (NUEVA)

---

## Tamaños de Sprites Utilizados

**Nota:** Todos los sprites son nativamente 64x64 píxeles

### ProductSelector (Vista de Tala)
```vue
<IconSprite ... size="lg" />  <!-- 64x64 (100% - nativo, sin interpolación) -->
```

### ItemGrid (Inventario)
```vue
<IconSprite ... size="sm" />  <!-- 24x24 (37.5% - escalado para ser compacto) -->
```

**Razones:**
- **lg en ProductSelector**: Muestra claramente el árbol en detalle
- **sm en ItemGrid**: Compacto para listas sin ocupar demasiado espacio

Ver `_documents/30-REFERENCIA_SPRITES_TAMAÑOS.md` para tabla completa de tamaños.

---

```
✅ ProductSelector.vue - Sin errores
✅ ItemGrid.vue - Sin errores
✅ Tree.ts - Sin errores
✅ Skill.ts - Sin errores
✅ IconSprite.vue - Sin errores
✅ spriteResolver.ts - Sin errores
```

---

## Próximos Pasos (Opcionales)

1. **Aplicar a otros skills**: Usar el mismo patrón para Minería, Pesca, etc.
2. **Consistencia**: Verificar que todos los skills con imágenes úsen IconSprite
3. **Testing**: Verificar renders en Firefox/navegador
4. **Optimización**: Lazy-load sprites si es necesario (futuro)

---

## Cómo Usar

### En ProductSelector (cualquier skill con sprites):
```vue
<IconSprite 
  :spriteId="product.treeId && TREES[product.treeId]?.spriteId"
  spriteType="tree"
  :fallbackEmoji="product.item.icon"
  size="lg"
/>
```

### En Inventario (para items con logSpriteId):
```vue
<IconSprite 
  :spriteId="product.logSpriteId"
  spriteType="log"
  :fallbackEmoji="product.item.icon"
  size="md"
/>
```

---

**Completado**: 19 de febrero de 2026  
**Estado**: ✅ Listo para probar
