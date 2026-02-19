# Quemado: Iconos de Troncos (Loggs)

## Cambio Realizado

### ProductSelector.vue - Actualizado para Quemado

Se agregó lógica para mostrar el icono del tronco cuando el skill es **Quemado**:

```vue
<IconSprite 
  v-else-if="props.skill === 'quemado' && currentProduct.logSpriteId"
  :spriteId="currentProduct.logSpriteId"
  spriteType="log"
  :fallbackEmoji="currentProduct.item.icon"
  size="lg"
/>
```

## Lógica de Iconos por Skill

### Tala
```
Árbol (selector) → Madera (inventario)
tree_pino.png → log_pino.png
```
- ProductSelector: `spriteType="tree"` + `treeId`
- Icono: árbol 🌲

### Quemado
```
Madera (selector) → Carbón/Ceniza (inventario)
log_pino.png → carbon.png / ceniza.png
```
- ProductSelector: `spriteType="log"` + `logSpriteId`
- Icono: tronco/madera 🪵

### Otros Skills
```
Emoji/Imagen genérica
```

## Flujo de Datos

```
QuemadoSkill.vue
├─ Obtiene productos: LOGGING_PRODUCTS (troncos)
├─ Cada producto tiene: logSpriteId (e.g., 'log_pino')
└─ Pasa a ProductSelector con skill='quemado'

ProductSelector.vue
├─ Detecta: skill === 'quemado'
├─ Usa: currentProduct.logSpriteId
├─ Renderiza: <IconSprite spriteType="log" />
└─ Resultado: Muestra sprites/custom/loggs/log_pino.png
```

## Resultado Visual

### Antes
```
Quemado: 🔥 (emoji genérico)
```

### Después
```
Quemado: [sprite del tronco 64x64]
         (sprites/custom/loggs/log_pino.png)
```

## Estado de Compilación
✅ Sin errores - ProductSelector.vue

---

**Completado**: 19 de febrero de 2026
