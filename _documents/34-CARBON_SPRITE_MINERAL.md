# Carbón (Carbon): Sprite de Mineral

## Cambios Realizados

### 1. Tipo Item Actualizado (`Item.ts`)
Agregadas propiedades opcionales para sprites:
```typescript
export interface Item {
  // ... otros campos
  logSpriteId?: string // para maderas
  mineralSpriteId?: string // para minerales
}
```

### 2. Woodburning.ts - Carbón con Sprite
Cambios en `WOODBURNING_DROPS`:

**ANTES:**
```typescript
'carbon': {
  id: 'carbon',
  icon: oreCoal,  // import de imagen
  iconType: 'image' as const,
  // ...
}
```

**DESPUÉS:**
```typescript
'carbon': {
  id: 'carbon',
  icon: '⛏️',  // emoji fallback
  mineralSpriteId: 'ore_coal',  // sprite mineral
  // ...
}
```

### 3. ItemGrid.vue - Soporte para item.mineralSpriteId
Agregado check adicional para sprites en el propio item:

```vue
<IconSprite 
  v-else-if="stack.item.mineralSpriteId"
  :spriteId="stack.item.mineralSpriteId"
  spriteType="mineral"
  :fallbackEmoji="stack.item.icon"
  size="sm"
/>
```

## Orden de Precedencia de Iconos en ItemGrid

1. **¿Tiene logSpriteId en LOGGING_PRODUCTS?**
   - Usa: IconSprite spriteType="log"
   - Ruta: `/loggs/`

2. **¿Tiene mineralSpriteId en MINING_PRODUCTS?**
   - Usa: IconSprite spriteType="mineral"
   - Ruta: `/ores/`

3. **¿El item.mineralSpriteId existe directamente?**
   - Usa: IconSprite spriteType="mineral"
   - Ruta: `/ores/`
   - *(Para items como Carbón que vienen de Woodburning)*

4. **¿icon tiene formato de imagen (/ o .ext)?**
   - Usa: `<img src="..." />`

5. **Fallback final:**
   - Usa: `<span>{{ emoji }}</span>`

## Archivos de Sprites Utilizados

```
src/assets/sprites/custom/ores/
├── ore_copper.png (Cobre)
├── ore_iron.png (Hierro)
├── ... (otros minerales)
└── ore_coal.png (Carbón) ✅
```

## Resultado Visual en Inventario

| Item | Tipo | Sprite | Tamaño |
|------|------|--------|--------|
| Madera de Pino | log | `/loggs/log_pino.png` | 24x24px |
| Cobre | mineral | `/ores/ore_copper.png` | 24x24px |
| **Carbón** | **mineral** | **`/ores/ore_coal.png`** | **24x24px** ✅ |
| Ceniza | emoji | - | fallback |

## Estado de Compilación
✅ Sin errores - Todo el proyecto

## Archivos Modificados

1. ✅ `src/types/Item.ts` - Agregados spriteIds opcionales
2. ✅ `src/data/skillProducts/woodburning.ts` - Carbón con mineralSpriteId
3. ✅ `src/components/inventory/ItemGrid.vue` - Soporte para item.mineralSpriteId

---

**Completado**: 19 de febrero de 2026

Ahora Carbón (del Woodburning) muestra su sprite mineral en el inventario.
