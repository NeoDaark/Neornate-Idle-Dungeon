# 🔄 Migración de Iconos del Inventario

## Descripción General

Este documento explica cómo realizar migraciones de iconos cuando cambios en `skillProducts.ts` afecten a items existentes en localStorage de usuarios.

**Caso de uso**: Cuando actualizas imágenes de items o cambias de emoji a imagen (o viceversa), los datos guardados en localStorage pueden quedar desincronizados.

---

## 🔍 Problema

Cuando un usuario tiene datos guardados en localStorage:
```json
{
  "items": [
    {
      "itemId": "carbon",
      "quantity": 600,
      "item": {
        "id": "carbon",
        "icon": "⚫",           // ❌ Emoji viejo
        "iconType": "emoji"    // ❌ Tipo viejo
      }
    }
  ]
}
```

Y luego actualizas `skillProducts.ts` para usar imágenes:
```typescript
'carbon': {
  item: {
    icon: oreCoal,           // ✅ Imagen nueva
    iconType: 'image'        // ✅ Tipo nuevo
  }
}
```

El usuario sigue viendo el emoji viejo porque su localStorage no se actualizó automáticamente.

---

## ✅ Solución: Sistema de Migraciones

### Ubicación del Código

Archivo: `src/stores/inventoryStore.ts`

Función: `loadFromLocalStorage()`

### Cómo Funciona

1. **Flag de Control**: Cada migración tiene un flag único en localStorage
   - Formato: `neornate_inventory_migrated_v{N}`
   - Ejemplo: `neornate_inventory_migrated_v1`, `neornate_inventory_migrated_v2`

2. **Ejecución Única**: El flag asegura que la migración corra solo una vez
   ```typescript
   const migrationDone = localStorage.getItem('neornate_inventory_migrated_v1')
   if (!migrationDone && loaded.items) {
     // Ejecutar migración...
     localStorage.setItem('neornate_inventory_migrated_v1', 'true')
   }
   ```

3. **Reconstrucción**: Se obtienen los items correctos de `skillProducts.ts`
   ```typescript
   const miningProduct = SKILL_PRODUCTS_MAP[Skill.MINERIA]?.[itemId]
   if (miningProduct) {
     correctItem = miningProduct.item  // Item actualizado con imágenes
   }
   ```

---

## 📝 Guía: Realizar una Nueva Migración

### Paso 1: Identificar Qué Cambió

Pregúntate:
- ¿Cambié iconos de items en `skillProducts.ts`?
- ¿Convertí emojis a imágenes?
- ¿Actualicé URLs de imágenes?
- ¿Agregué nuevos items con imágenes?

### Paso 2: Actualizar skillProducts.ts

Por ejemplo, cambiar mining products de emoji a imagen:

```typescript
// ANTES
'carbon': {
  item: {
    icon: '⚫',              // emoji
    iconType: 'emoji',
    value: 5
  }
}

// DESPUÉS
import oreCoal from '@/assets/sprites/custom/ores/ore_coal.png'

'carbon': {
  item: {
    icon: oreCoal,          // imagen
    iconType: 'image' as const,
    value: 5
  }
}
```

### Paso 3: Crear Nueva Migración

En `src/stores/inventoryStore.ts`, incrementa la versión y agrega la lógica:

```typescript
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('neornate_inventory')
    if (saved) {
      const loaded = JSON.parse(saved)
      
      // ✅ NUEVA MIGRACIÓN V2
      const migrationDone = localStorage.getItem('neornate_inventory_migrated_v2')
      if (!migrationDone && loaded.items) {
        loaded.items = loaded.items.map((stack: any) => {
          const itemId = stack.item.id
          
          // Buscar producto actualizado
          const miningProduct = SKILL_PRODUCTS_MAP[Skill.MINERIA]?.[itemId]
          if (miningProduct) {
            return {
              ...stack,
              item: miningProduct.item  // Usa item actualizado de skillProducts
            }
          }
          
          // Igual para otras categorías...
          return stack
        })
        
        // Marcar migración como completada
        localStorage.setItem('neornate_inventory_migrated_v2', 'true')
      }
      
      inventory.value = { ...inventory.value, ...loaded }
    }
  } catch (error) {
    console.error('Error cargando inventario:', error)
  }
}
```

### Paso 4: Testear

1. Abre el navegador con dev tools
2. Genera algunos items con los iconos viejos
3. Abre la consola (F12) y verifica localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('neornate_inventory'))
   ```
4. Recarga la página
5. Verifica que los items se actualizaron correctamente
6. Confirma que el flag de migración se creó:
   ```javascript
   localStorage.getItem('neornate_inventory_migrated_v2')  // "true"
   ```

---

## 🏗️ Estructura de Versiones

Cada versión es independiente:

| Versión | Flag | Cambio |
|---------|------|--------|
| v1 | `neornate_inventory_migrated_v1` | Emojis de mining → imágenes PNG |
| v2 | `neornate_inventory_migrated_v2` | (Próximo cambio) |
| v3 | `neornate_inventory_migrated_v3` | (Próximo cambio) |

**Importante**: NO incrementes solo porque quieras limpiar localStorage. Solo incrementa cuando haya cambios reales en `skillProducts.ts`.

---

## 💡 Mejores Prácticas

### ✅ DO (Hacer)
- Incrementar versión solo cuando hay cambios en items
- Buscar items de `SKILL_PRODUCTS_MAP` (no hardcodear URLs)
- Agregar comentario explicando qué cambió
- Testear que los items se actualizan correctamente
- Mantener migraciones viejas para usuarios que no abran el juego frecuentemente

### ❌ DON'T (No Hacer)
- Incrementar versión sin cambios reales
- Hardcodear URLs de imágenes en migraciones
- Hacer migraciones complejas que afecten múltiples tipos de items innecesariamente
- Olvidar marcar el flag como completo

---

## 🔗 Referencias

- **skillProducts.ts**: `src/data/skillProducts.ts`
- **inventoryStore.ts**: `src/stores/inventoryStore.ts`
- **Item Types**: `src/types/Item.ts`
- **Sistema de Sprites**: `11-SISTEMA_SPRITES_ASSETS.md`

---

## 📚 Ejemplo Real: Cambiar Todos los Ores a Imágenes Nuevas

**Escenario**: Eres artista y rediseñaste todos los ores con mejor calidad

**Pasos**:

1. **Actualiza imágenes**:
   ```bash
   # Reemplaza archivos en src/assets/sprites/custom/ores/
   cp nuevas_imagenes/* src/assets/sprites/custom/ores/
   ```

2. **skillProducts.ts ya está actualizado** (las URLs de import se mantienen)

3. **Crea migración v3 en inventoryStore.ts**:
   ```typescript
   // Solo necesitas copiar la lógica de v1
   // Reutiliza SKILL_PRODUCTS_MAP que apunta a las nuevas imágenes
   ```

4. **Test en navegador**:
   - Genera ores con la versión vieja (antes de cambiar imágenes)
   - Recarga página con el código nuevo
   - Las imágenes deberían actualizarse automáticamente

---

## ⚡ Casos Avanzados

### Caso: Cambiar Solo Algunos Items

```typescript
const itemsToMigrate = ['carbon', 'cobre', 'hierro']

if (!migrationDone && loaded.items) {
  loaded.items = loaded.items.map((stack: any) => {
    // Solo migrar items específicos
    if (itemsToMigrate.includes(stack.item.id)) {
      const miningProduct = SKILL_PRODUCTS_MAP[Skill.MINERIA]?.[stack.item.id]
      if (miningProduct) {
        return {
          ...stack,
          item: miningProduct.item
        }
      }
    }
    return stack
  })
}
```

### Caso: Migración con Transformación

```typescript
// Si necesitas transformar datos además de actualizar items
loaded.items = loaded.items.map((stack: any) => {
  const miningProduct = SKILL_PRODUCTS_MAP[Skill.MINERIA]?.[stack.item.id]
  
  if (miningProduct) {
    // Actualizar item + realizar transformación
    return {
      ...stack,
      item: miningProduct.item,
      quantity: Math.floor(stack.quantity * 1.1)  // Bonus de 10%
    }
  }
  
  return stack
})
```

---

**Última Actualización**: 14 de febrero de 2026  
**Versión Actual**: v1 (Migración de Ores a Imágenes)  
**Próxima Versión**: v2 (A definir)
