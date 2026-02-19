# Fix: Tamaño de Sprites en IconSprite.vue

## Problema
Los sprites en el inventario se estaban renderizando más grandes de lo esperado (64x64 en lugar de 24x24) porque:

1. IconSprite estaba usando clases Tailwind (`w-6 h-6`)
2. El contenedor `.item-icon` padre en ItemGrid tiene un tamaño fijo de 40x40px
3. Las clases Tailwind en contenedores flex a veces no respetan su límite esperado

## Solución Implementada

Cambié IconSprite.vue para usar **inline styles con píxeles** en lugar de solo clases Tailwind:

### Antes (con clases Tailwind):
```vue
<div :class="`inline-flex items-center justify-center ${sizeClasses[size]}`">
  <img :class="sizeClasses[size]" ... />
</div>
```

### Después (con inline styles):
```vue
<div 
  :class="`inline-flex items-center justify-center`" 
  :style="{ width: sizePixels[size], height: sizePixels[size] }"
>
  <img 
    :style="{ width: sizePixels[size], height: sizePixels[size] }"
    class="object-contain"
  />
</div>
```

## Mapeo de Tamaños

```typescript
const sizePixels = {
  xs: '16px',    // 1/4 del tamaño nativo
  sm: '24px',    // 3/8 del tamaño nativo (usado en Inventario)
  md: '32px',    // 1/2 del tamaño nativo
  lg: '64px',    // 1:1 nativo (usado en ProductSelector)
  xl: '96px',    // 1.5x del tamaño nativo
}
```

## Resultado

| Componente | Size | Esperado | Anterior | Ahora |
|------------|------|----------|----------|-------|
| ItemGrid | `sm` | 24x24px | ~40x40px | 24x24px ✅ |
| ProductSelector | `lg` | 64x64px | 64x64px | 64x64px ✅ |

## Archivos Modificados

1. ✅ `src/components/common/IconSprite.vue`
   - Agregado objeto `sizePixels` con valores en píxeles
   - Reemplazado `sizeClasses` (clases Tailwind) por `sizePixels` (inline styles)
   - Aplicado `:style` binding en contenedor, img y span

## Estado de Compilación
✅ Sin errores - IconSprite.vue y todo el proyecto

---

**Resultado Visual:**
- ✅ Madera en Inventario: 24x24px (compacto)
- ✅ Árbol en ProductSelector: 64x64px (visible)
- ✅ Otros iconos: respetan su tamaño configurado

**Completado**: 19 de febrero de 2026
