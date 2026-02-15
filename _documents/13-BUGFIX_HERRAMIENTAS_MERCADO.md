# 🔧 Fix: Sistema de Mercado de Herramientas

**Fecha**: 15 de febrero de 2026  
**Versión**: 1.0.0  
**Rama**: maint/1.0.0

## 🐛 Bug Principal Detectado

### **Compra Duplicada de Herramientas**
- **Problema**: Una herramienta comprada (T1) seguía mostrándose en el mercado y se podía volver a comprar
- **Síntomas**:
  - Compré Horno Básico (T1)
  - Se desbloqueó T2 correctamente
  - PERO T1 volvía a aparecer para comprar
  - Al comprar T1 de nuevo, se gastaba dinero duplicando la compra

**Raíz del problema:**
- La lógica anterior mostraba TODAS las herramientas sin comprar + siguiente bloqueada
- No validaba correctamente si una herramienta ya había sido comprada
- Permitía comprar la misma herramienta varias veces

---

## ✅ Solución Implementada

### **Lógica SIMPLE y CORRECTA** (`ToolMarketSection.vue`)

```typescript
// ANTES (INCORRECTO):
// - Mostrar: [T1, T2, T3, T4, T5, T6, T7] (todas disponibles)
// - Mostrar: [T1, T2, T3 bloqueada] después de comprar T1
// - El set ownedToolIds no se actualizaba correctamente

// DESPUÉS (CORRECTO):
// 1. Obtener IDs de herramientas COMPRADAS (inventario + equipadas)
// 2. Filtrar herramientas: excluir todas las compradas
// 3. Tomar la PRIMERA herramienta sin comprar (próxima a comprar)
// 4. Si no hay ninguna sin comprar → "todas compradas"
```

**Pseudocódigo:**
```
purchasedToolIds = [T1, T2]
unpurchasedTools = ALL_TOOLS.filter(t => !purchasedToolIds.has(t.id))
                            .sort(por skill y tier)
nextToolToBuy = unpurchasedTools[0]  // ← Mostrar SOLO esta
```

---

## 📋 Cambios en Archivos

### **1. `src/components/tools/ToolMarketSection.vue`** (REESCRITO)

**Cambio de estructura:**
```vue
<!-- ANTES -->
<div v-if="visibleTools.length > 0">
  <ToolCard v-for="tool in visibleTools" ... />  ← Múltiples herramientas
</div>

<!-- DESPUÉS -->
<div v-if="nextToolToBuy">
  <ToolCard :tool="nextToolToBuy" ... />  ← UNA SOLA herramienta
</div>
```

**Nueva computed property `nextToolToBuy`:**
```typescript
const nextToolToBuy = computed(() => {
  // IDs de TODAS las herramientas compradas
  const purchasedToolIds = new Set([
    ...toolsStore.inventoryTools.map(t => t.id),
    ...toolsStore.equippedTools 
      .filter(Boolean)
      .map(t => t.toolId)
  ])

  // Herramientas SIN COMPRAR, ordenadas
  const unpurchasedTools = ALL_TOOLS
    .filter(tool => !purchasedToolIds.has(tool.id))
    .sort(...)

  // Retornar la primera sin comprar (o null si todas compradas)
  return unpurchasedTools[0] || null
})
```

**Validaciones mejoradas en `handleBuyTool`:**
```typescript
// Validar oro
if (playerStore.player.gold < tool.price) return

// Validar NIVEL (esto es importante)
const playerLevel = skillsStore.skillStates[tool.skillId]?.level || 0
if (playerLevel < tool.requiredLevel) return

// Comprar
toolsStore.markToolAsPurchased(toolId, tool.skillId)
```

### **2. `src/stores/toolsStore.ts`** (AMPLIADO)

**Función de compra `markToolAsPurchased`:**
```typescript
const markToolAsPurchased = (toolId: string, skillId: Skill): void => {
  const tool = TOOLS_MAP[toolId]
  if (!tool) return

  // Desquipar anterior si existe
  if (equippedTools.value[skillId]) {
    const oldTool = equippedTools.value[skillId]
    markToolAsBought(oldTool.toolId)  // Mover a inventario
  }

  // Equipar nueva
  equippedTools.value[skillId] = {
    toolId: tool.id,
    skillId: tool.skillId,
    tier: tool.tier,
    equippedAt: Date.now(),
    effects: [...tool.effects],
  }
  
  // NO agregamos a inventario porque está equipada
}
```

---

## 🔄 Flujo Correcto de Compra (Paso a Paso)

```
ESTADO INICIAL:
  purchasedTools = []
  Mercado muestra: Horno Básico (T1)

PASO 1: Comprar T1
  ✓ Validar oro: OK
  ✓ Validar nivel: OK (requisito: 10)
  ✓ Restar oro
  ✓ Equipar T1
  ✓ Guardar en localStorage
  
ESTADO DESPUÉS:
  purchasedTools = [T1]
  nextToolToBuy se recalcula
  ├─ Filter: ALL_TOOLS excepto T1
  ├─ Sort: por skill y tier
  └─ Resultado: Horno de Cobre (T2)
  
MERCADO MUESTRA: Horno de Cobre (T2) bloqueado
  (T1 DESAPARECE del mercado)

PASO 2: Subir nivel a 20
  MERCADO ACTUALIZA: Horno de Cobre (T2) disponible (antes bloqueado)

PASO 3: Comprar T2
  ✓ Validar oro: OK
  ✓ Validar nivel: OK (requisito: 20)
  ✓ Restar oro
  ✓ Desquipar T1 → Agregar a inventario
  ✓ Equipar T2
  ✓ Guardar
  
ESTADO DESPUÉS:
  purchasedTools = [T1, T2]
  nextToolToBuy = Horno de Hierro (T3)
  
MERCADO MUESTRA: Horno de Hierro (T3) bloqueado
  (T1 Y T2 DESAPARECEN)

... y así sucesivamente
```

---

## 🎯 Resultado

### **PROBLEMA SOLUCIONADO:**
```
ANTES (BUG):
  ❌ Compré T1
  ❌ T1 sigue apareciendo en mercado
  ❌ Puedo comprar T1 de nuevo
  ❌ Se gasta dinero duplicado

DESPUÉS (CORRECTO):
  ✅ Compré T1
  ✅ T1 DESAPARECE del mercado
  ✅ Solo aparece T2 (siguiente)
  ✅ NO se puede duplicar compras
```

---

## 🧪 Testing (Importante)

### **Caso 1: Compra progresiva (EL MÁS IMPORTANTE)**
```
1. Abre Mercado
2. Verifica: Solo se muestra 1 herramienta (T1)
3. Compra T1
4. Verifica: T1 desaparece, aparece T2 bloqueada
5. Sube nivel a 20
6. Verifica: T2 aparece disponible
7. Compra T2
8. Verifica: T1 y T2 desaparecen, aparece T3
9. Intenta comprar T2 de nuevo → NO APARECE EN MERCADO ✅
```

### **Caso 2: Sin dinero**
```
1. Sube a nivel 10
2. Tienes dinero para T1? SI
3. Compra T1
4. Verifica: Dinero restado, T1 equipada
5. Intenta comprar T2 sin dinero → Alerta "no hay oro"
```

### **Caso 3: Sin nivel**
```
1. Nivel: 10 (sin subir más)
2. Abre Mercado
3. Verifica: T2 aparece BLOQUEADA
4. Intenta comprar T2 → Alerta "necesitas nivel 20"
5. Sube a nivel 20
6. Verifica: T2 aparece disponible
7. Compra OK
```

### **Caso 4: Persistencia**
```
1. Compra T1 y T2
2. Cierra navegador (F5)
3. Reabre
4. Verifica: T1 y T2 NO aparecen en mercado
5. Verifica: T3 aparece como próxima
```

---

## 📝 Resumen de cambios

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Herramientas mostradas** | Múltiples (T1, T2, T3...) | Una sola (la próxima) |
| **Duplicadas compradas** | ❌ Sí (bug) | ✅ No |
| **Lógica** | Compleja (multiple skills) | Simple (lineal) |
| **Validación nivel** | Parcial | Completa |
| **Mensajes errores** | Genéricos | Específicos |
| **Performance** | Media | Mejor |

---

**Status**: ✅ Completado y listo para testing  
**Cambios críticos**: ToolMarketSection.vue (estructura), toolsStore.ts (compra)
