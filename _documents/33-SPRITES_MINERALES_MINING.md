# Sistema de Sprites para Minerales (Mining)

## Cambios Realizados

### 1. Tipos Actualizados (`Skill.ts`)
Agregado `mineralSpriteId` a SkillProduct:
```typescript
export interface SkillProduct {
  // ... otros campos
  mineralSpriteId?: string // ID del sprite del mineral (e.g., 'ore_copper' -> ore_copper.png)
}
```

### 2. Datos de Minería (`mining.ts`)
- ✅ Removidos todos los imports de imágenes (oreCopper, oreIron, etc.)
- ✅ Reemplazados con `mineralSpriteId` en cada producto
- ✅ Cambiados los iconos fallback a emoji ⛏️

**Ejemplo:**
```typescript
'cobre': {
  id: 'cobre',
  // ... otros campos
  icon: '⛏️',  // fallback emoji
  mineralSpriteId: 'ore_copper',  // sprite actual
}
```

### 3. IconSprite.vue - Corrección de Ruta
Cambio importante: La ruta de minerales apunta a `/ores/` (no `/minerals/`):

```typescript
case 'mineral':
  return `${basePath}/ores/${props.spriteId}.png`  // ✅ Correcto
```

### 4. ItemGrid.vue - Soporte para Minerales
Agregado detector de minerales:

```vue
<IconSprite 
  v-else-if="MINING_PRODUCTS[stack.itemId]?.mineralSpriteId"
  :spriteId="MINING_PRODUCTS[stack.itemId].mineralSpriteId"
  spriteType="mineral"
  :fallbackEmoji="stack.item.icon"
  size="sm"
/>
```

## Flujo Completo de Iconos en Inventario

```
ItemGrid detecta tipo de item
├─ ¿Tiene logSpriteId? (Tala)
│  └─ IconSprite spriteType="log" → /loggs/log_*.png
├─ ¿Tiene mineralSpriteId? (Minería)
│  └─ IconSprite spriteType="mineral" → /ores/ore_*.png
├─ ¿Tiene iconType='image'?
│  └─ <img src="..." />  (fallback antiguo)
└─ Fallback
   └─ <span>{{ emoji }}</span>
```

## Rutas de Sprites

```
src/assets/sprites/custom/
├── trees/
│   ├── tree_pino.png (64x64)
│   └── ...
├── loggs/
│   ├── log_pino.png (64x64)
│   └── ...
└── ores/
    ├── ore_copper.png (64x64)
    ├── ore_iron.png (64x64)
    └── ...
```

## Productos de Minería con Sprites

| Mineral | spriteType | spriteId | Archivo |
|---------|-----------|----------|---------|
| Cobre | `mineral` | `ore_copper` | `ore_copper.png` |
| Hierro | `mineral` | `ore_iron` | `ore_iron.png` |
| Plata | `mineral` | `ore_silver` | `ore_silver.png` |
| Tungsteno | `mineral` | `ore_tungsten` | `ore_tungsten.png` |
| Oro | `mineral` | `ore_gold` | `ore_gold.png` |
| Platino | `mineral` | `ore_platinum` | `ore_platinum.png` |
| Obsidiana | `mineral` | `ore_obsidian` | `ore_obsidian.png` |
| Cobalto | `mineral` | `ore_cobalt` | `ore_cobalt.png` |
| Mithril | `mineral` | `ore_mythril` | `ore_mythril.png` |
| Oricalco | `mineral` | `ore_orichalcum` | `ore_orichalcum.png` |
| Adamantita | `mineral` | `ore_adamantite` | `ore_adamantite.png` |
| Titanio | `mineral` | `ore_titanium` | `ore_titanium.png` |
| Draconita | `mineral` | `ore_dragonite` | `ore_dragonite.png` |

## Estado de Compilación
✅ Sin errores - Todo el proyecto

## Archivos Modificados

1. ✅ `src/types/Skill.ts` - Agregado `mineralSpriteId`
2. ✅ `src/data/skillProducts/mining.ts` - Removidos imports, agregados IDs de sprites
3. ✅ `src/components/common/IconSprite.vue` - Corregida ruta de minerales a `/ores/`
4. ✅ `src/components/inventory/ItemGrid.vue` - Agregado soporte para minerales

---

**Completado**: 19 de febrero de 2026

Ahora:
- ✅ Maderas en Inventario: sprites de `/loggs/`
- ✅ Minerales en Inventario: sprites de `/ores/`
- ✅ Tamaño consistente: 24x24px (sm)
