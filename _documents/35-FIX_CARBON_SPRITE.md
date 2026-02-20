# Fix: Carbón Mostrando Sprite Mineral

## Problema
Carbón estaba mostrando emoji en lugar del sprite mineral en el inventario.

## Causa
ItemGrid.vue estaba buscando sprites en el orden incorrecto y con tamaño incorrecto.

## Solución

### Cambios en ItemGrid.vue

**Orden de precedencia corregido:**

1. ✅ Primero: `stack.item.logSpriteId` (directamente en el item)
   - Para items como Madera que tienen spriteId en el objeto
   - Usa: `size="sm"` (24x24px)

2. ✅ Segundo: `stack.item.mineralSpriteId` (directamente en el item)
   - Para items como Carbón que tienen spriteId en el objeto
   - Usa: `size="sm"` (24x24px)

3. Tercero: `LOGGING_PRODUCTS[stack.itemId]?.logSpriteId`
   - Para productos de Tala por lookup
   - Usa: `size="sm"` (24x24px)

4. Cuarto: `MINING_PRODUCTS[stack.itemId]?.mineralSpriteId`
   - Para productos de Minería por lookup
   - Usa: `size="sm"` (24x24px)

5. Quinto: Fallback a imagen
   - Si tiene iconType='image'

6. Sexto: Fallback a emoji
   - Por defecto

### Tamaño Corregido
```vue
<!-- ANTES: size="lg" (64x64) -->
<IconSprite ... size="lg" />

<!-- DESPUÉS: size="sm" (24x24) -->
<IconSprite ... size="sm" />
```

## Flujo de Carbón en Inventario

```
1. Woodburning crea drop
   └─ addItem(WOODBURNING_DROPS['carbon'], 1)
   
2. WOODBURNING_DROPS['carbon'] tiene:
   └─ mineralSpriteId: 'ore_coal'
   
3. ItemGrid renderiza:
   └─ Detecta stack.item.mineralSpriteId
   └─ Renderiza: <IconSprite spriteType="mineral" />
   └─ Muestra: /src/assets/sprites/custom/ores/ore_coal.png
```

## Resultado Visual

**ANTES:**
```
Carbón: 🌫️ (emoji o fallback antiguo)
```

**DESPUÉS:**
```
Carbón: [sprite mineral 24x24] ✅
        (sprites/custom/ores/ore_coal.png)
```

## Archivos Modificados

1. ✅ `src/components/inventory/ItemGrid.vue`
   - Reordenado los checks para prioritizar `stack.item.spriteId`
   - Corregido tamaño de `"lg"` a `"sm"`

## Estado de Compilación
✅ Sin errores - Todo el proyecto

---

**Completado**: 19 de febrero de 2026

Ahora Carbón muestra correctamente su sprite mineral en el inventario.
