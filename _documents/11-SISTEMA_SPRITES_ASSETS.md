# 🎨 Sistema de Sprites y Assets

## Descripción General

Este documento describe cómo se organizan, importan y se utilizan los sprites e imágenes (assets) en **Neornate - Idle Dungeon**.

---

## 📁 Estructura de Directorios

```
src/assets/
├─ sprites/
│  └─ custom/
│     └─ ores/                    # Iconos de minerales de la skill Minería
│        ├─ ore_adamantite.png    # 64x64 - Adamantita (T6)
│        ├─ ore_coal.png          # 64x64 - Carbón (T1)
│        ├─ ore_cobalt.png        # 64x64 - Cobalto (T5)
│        ├─ ore_copper.png        # 64x64 - Cobre (T1)
│        ├─ ore_dragonite.png     # 64x64 - Draconita (T7)
│        ├─ ore_gold.png          # 64x64 - Oro (T3)
│        ├─ ore_iron.png          # 64x64 - Hierro (T2)
│        ├─ ore_mythril.png       # 64x64 - Mithril (T5)
│        ├─ ore_obsidian.png      # 64x64 - Obsidiana (T4)
│        ├─ ore_orichalcum.png    # 64x64 - Oricalco (T6)
│        ├─ ore_platinum.png      # 64x64 - Platino (T4)
│        ├─ ore_silver.png        # 64x64 - Plata (T2)
│        ├─ ore_titanium.png      # 64x64 - Titanio (T7)
│        └─ ore_tungsten.png      # 64x64 - Tungsteno (T3)
└─ styles/
   └─ main.css                    # CSS global
```

---

## 🎯 Sistema de Iconos de Items

### Tipo de Icono

Todos los items (`Item`) soportan dos tipos de iconos:

```typescript
interface Item {
  id: string
  type: ItemType
  icon: string                    // emoji o ruta de imagen
  iconType?: 'emoji' | 'image'    // tipo de icono (defecto: emoji)
  value: number
  tier?: Tier
}
```

- **`iconType: 'emoji'`** (default): El `icon` es un emoji (ej: ⚫, 🟠)
- **`iconType: 'image'`**: El `icon` es una URL/ruta de imagen importada

### Importar Imágenes en TypeScript

En `src/data/skillProducts.ts`, todas las imágenes se importan al inicio:

```typescript
import oreCoal from '@/assets/sprites/custom/ores/ore_coal.png'
import oreCopper from '@/assets/sprites/custom/ores/ore_copper.png'
// ... más imports
```

Luego se usan directamente en los items:

```typescript
'carbon': {
  id: 'carbon',
  item: {
    icon: oreCoal,           // Variable importada
    iconType: 'image',       // Especificar que es imagen
    value: 5
  }
}
```

**Ventajas de importar imágenes:**
- ✅ Vite las procesa y optimiza automáticamente
- ✅ Se incluyen en el hash del bundle (cache busting)
- ✅ TypeScript valida que existan
- ✅ Funciona tanto en desarrollo como en producción

---

## 🖼️ Renderizar Iconos en Componentes

### Patrón General

Los componentes deben detectar el tipo de icono y renderizar accordingly:

```vue
<template>
  <div class="item-icon">
    <!-- Renderizar imagen si iconType es 'image' -->
    <img
      v-if="item.iconType === 'image'"
      :src="item.icon"
      :alt="getItemName(item)"
      class="item-image"
    />
    <!-- Fallback a emoji -->
    <span v-else>{{ item.icon }}</span>
  </div>
</template>
```

### Estilos Recomendados

Para que las imágenes de 64x64 se vean bien en todos los contextos:

```css
.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;  /* Preserva pixel art */
}
```

**Contextos de renderizado:**

1. **ItemGrid.vue** (Inventario):
   - Tamaño: 40x40 px
   - Contenedor: 40x40 px flex
   - Estilo: `.item-icon` con clase `.item-image`

2. **ProductSelector.vue** (Skills):
   - Tamaño: 48x48 px (info del producto)
   - Tamaño: 20x20 px (botón modal)
   - Estilos: `.icon` y `.modal-icon`

3. **ItemActionsModal.vue** (Detalles):
   - Tamaño: 56x56 px
   - Contenedor: 56x56 px flex
   - Estilo: `.item-icon` con clase `.modal-item-image`

---

## 📝 Componentes Actualizados

### ✅ ItemGrid.vue
- **Archivo**: `src/components/inventory/ItemGrid.vue`
- **Cambio**: Detecta `iconType` y renderiza imagen o emoji
- **Estilos**: `.item-icon` y `.item-image`

### ✅ ProductSelector.vue
- **Archivo**: `src/components/skills/ProductSelector.vue`
- **Cambio**: Renderiza imágenes en:
  - Info del producto seleccionado (48x48)
  - Botón de confirmación modal (20x20)
- **Estilos**: `.icon`, `.product-image`, `.modal-icon`

### ✅ ItemActionsModal.vue
- **Archivo**: `src/components/inventory/ItemActionsModal.vue`
- **Cambio**: Detecta `iconType` para mostrar imagen de item
- **Estilos**: `.item-icon`, `.modal-item-image`

---

## 🔄 Compatibilidad Hacia Atrás

El sistema es **totalmente compatible** con emojis existentes:

```typescript
// Items con emoji (antiguo) siguen funcionando
item: {
  icon: '⚫',           // emoji
  // iconType no especificado → default 'emoji'
  value: 5
}

// Items nuevos con imágenes
item: {
  icon: oreCoal,        // variable importada
  iconType: 'image',    // especificar tipo
  value: 5
}
```

Los componentes automáticamente renderizarán lo correcto según `iconType`.

---

## 🎨 Especificaciones de Imágenes

### Ores (Minería)

| Nombre | Archivo | Tamaño | Tier | Level |
|--------|---------|--------|------|-------|
| Carbón | ore_coal.png | 64x64 | T1 | 1 |
| Cobre | ore_copper.png | 64x64 | T1 | 5 |
| Hierro | ore_iron.png | 64x64 | T2 | 20 |
| Plata | ore_silver.png | 64x64 | T2 | 25 |
| Tungsteno | ore_tungsten.png | 64x64 | T3 | 40 |
| Oro | ore_gold.png | 64x64 | T3 | 45 |
| Platino | ore_platinum.png | 64x64 | T4 | 60 |
| Obsidiana | ore_obsidian.png | 64x64 | T4 | 65 |
| Cobalto | ore_cobalt.png | 64x64 | T5 | 80 |
| Mithril | ore_mythril.png | 64x64 | T5 | 85 |
| Oricalco | ore_orichalcum.png | 64x64 | T6 | 100 |
| Adamantita | ore_adamantite.png | 64x64 | T6 | 105 |
| Titanio | ore_titanium.png | 64x64 | T7 | 120 |
| Draconita | ore_dragonite.png | 64x64 | T7 | 150 |

### Formato Recomendado

- **Formato**: PNG 32-bit (soporta transparencia)
- **Tamaño**: 64x64 píxeles (escalable para otros contextos)
- **Compresión**: Óptimamente comprimido (Vite lo hace automáticamente)
- **Estilo**: Pixel art o ilustración compatible con tema del juego

---

## 🚀 Agregar Nuevos Sprites

### Paso 1: Copiar Imagen

Coloca la imagen PNG en `src/assets/sprites/custom/<categoria>/`

```
src/assets/sprites/custom/ores/ore_new.png
```

### Paso 2: Importar en TypeScript

En `src/data/skillProducts.ts` (o archivo correspondiente):

```typescript
import oreNew from '@/assets/sprites/custom/ores/ore_new.png'
```

### Paso 3: Usar en Item

```typescript
'nuevo_mineral': {
  id: 'nuevo_mineral',
  item: {
    icon: oreNew,
    iconType: 'image',  // ⚠️ No olvidar!
    value: 100
  }
}
```

### Paso 4: Verificar TypeScript

```bash
npm run type-check
```

---

## 📌 Notas Importantes

1. **Siempre importar imágenes**: No usar URLs de string como `'/assets/ores/...'` porque Vite no las procesará
2. **Especificar iconType**: Para que los componentes sepan cómo renderizar
3. **image-rendering: pixelated**: Esencial para pixel art, preserva bordes nítidos
4. **Tamaño único**: 64x64 es escalable a cualquier tamaño con `object-fit: contain`
5. **Caché**: Vite hash automáticamente las imágenes, no hay problemas de caché

---

## 🔗 Referencias

- **Sistema de Minería**: `06-IMPLEMENTACION_MINERIA.md`
- **Tipos de Items**: `02-TIPOS_BASE.md`
- **Componentes de Skills**: `src/components/skills/`
- **Datos de Productos**: `src/data/skillProducts.ts`

---

**Última Actualización**: 14 de febrero de 2026  
**Versión**: 1.0  
**Estado**: ✅ Implementado - Todos los ores con imágenes 64x64
