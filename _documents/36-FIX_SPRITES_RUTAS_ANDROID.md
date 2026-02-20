# Fix: Sprites en Inventario - Resolución de Rutas

## Problema Original

Las imágenes de sprites no cargaban en Android pero sí en Firefox. El problema era:
1. Las rutas hardcodeadas como `/src/assets/sprites/...` no funcionaban en producción
2. Los sprites se guardaban directamente en los items del inventario, duplicando datos

## Soluciones Implementadas

### 1. **IconSprite.vue** - Resolución de Rutas
Cambié de rutas hardcodeadas a `new URL()` dinámico:

```typescript
// ANTES (no funciona en Android):
const basePath = `/src/assets/sprites/custom`

// AHORA (funciona en dev y prod):
const url = new URL(relativePath, import.meta.url).href
```

Vite resuelve automáticamente las rutas tanto en desarrollo como en producción/Android.

### 2. **spriteMap.ts** - Mapeos Centralizados
Creé un archivo centralizado con todos los mapeos de `itemId` → `spriteId`:

- `LOG_SPRITE_MAP` - Maderas de Tala
- `MINERAL_SPRITE_MAP` - Minerales de Minería
- `INGOT_SPRITE_MAP` - Lingotes de Fundición
- `COAL_SPRITE_MAP` - Carbón de Quemado
- `ASH_SPRITE_MAP` - Ceniza de Quemado

**Ventajas:**
- ✅ Fuente única de verdad
- ✅ No duplicamos datos en el inventario
- ✅ Fácil de mantener y extender
- ✅ Coherente para todos los skills

### 3. **ItemGrid.vue** - Resolución Dinámica
La función `getSpriteIdForItem()` busca sprites en orden:

1. `LOG_SPRITE_MAP` (maderas)
2. `MINERAL_SPRITE_MAP` (minerales)
3. `INGOT_SPRITE_MAP` (lingotes)
4. `COAL_SPRITE_MAP` (carbón)
5. `ASH_SPRITE_MAP` (ceniza)
6. Fallback: campos `logSpriteId` / `mineralSpriteId` del item

### Archivos Modificados

- `src/components/common/IconSprite.vue` - Usa `new URL()`
- `src/data/spriteMap.ts` - ✨ NUEVO
- `src/components/inventory/ItemGrid.vue` - Usa mapeos centralizados
- `src/types/Item.ts` - Removido `ingotSpriteId` innecesario
- `src/types/Skill.ts` - Removido `ingotSpriteId` innecesario
- `src/data/skillProducts/smelting.ts` - Limpiado

---

**Resultado:** Sprites funcionan perfectamente en Firefox (dev) y Android (prod) 🎮
