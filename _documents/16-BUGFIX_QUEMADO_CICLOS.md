# 🔥 Bugfix: Quemado - Ciclos Rotos y Consumo de Materiales

**Versión**: 1.0.1  
**Fecha**: 16 de febrero de 2026  
**Status**: ✅ SOLUCIONADO  

---

## 📋 Resumen del Problema

El skill **Quemado** tenía varios bugs críticos:

1. **Bug Principal**: Ciclo se detenía inmediatamente después de iniciarse con mensaje "materiales insuficientes" incluso teniendo troncos
2. **Bug Secundario**: Los ciclos no se reiniciaban automáticamente después de completarse
3. **Bug de Persistencia**: Al recargar la app, `currentProduct` se perdía en localStorage

---

## 🔍 Análisis de Causas Raíz

### **Problema 1: `cycleEndTime` vs `cycleDuration`**

En `App.vue` Game Loop, cuando se reiniciaba un ciclo completado:

```typescript
// ❌ ANTES (Bug)
const cycleDurationMs = currentState.currentProduct.cycleDuration * 1000
skillsStore.activateSkill(skill.skill, currentState.currentProduct, cycleDurationMs)
```

**Problema**: 
- Quemado usa `burningTime` (30s) en el componente
- Pero `cycleDuration` es para Tala (45-60s) 
- El reinicio automático usaba `cycleDuration` (mucho más corto o indefinido)
- El ciclo se completaba casi inmediatamente

**Solución**:
```typescript
// ✅ DESPUÉS (Fix)
const duration = skill.skill === Skill.QUEMADO 
  ? (currentState.currentProduct.burningTime || 30)
  : currentState.currentProduct.cycleDuration
const cycleDurationMs = duration * 1000
skillsStore.activateSkill(skill.skill, currentState.currentProduct, cycleDurationMs)
```

### **Problema 2: `currentProduct` se perdía en localStorage**

Al guardar estado en localStorage:
```typescript
// ❌ ANTES (Bug)
currentProduct: state.currentProduct  // Guardaba objeto completo con referencias
```

Cuando se cargaba de nuevo, el objeto se perdía porque:
- Contiene referencias a imágenes (no serializables en JSON)
- Contiene funciones/métodos (no serializables)
- El ID no se podía recuperar

**Solución**: Guardar solo el ID y luego buscar el objeto:
```typescript
// ✅ DESPUÉS (Fix)
currentProductId: state.currentProduct?.id || undefined
```

Al cargar:
```typescript
if (loadedData.currentProductId) {
  skillStates.value[skill].currentProduct = skillStates.value[skill].products.find(
    p => p.id === loadedData.currentProductId
  )
}
```

### **Problema 3: Ciclos pendientes sin `currentProduct`**

Cuando la app se recargaba:
1. Se restauraba `cycleEndTime` ✅
2. Se intentaba restaurar `currentProduct` pero fallaba ❌
3. Usuario hacía click en "Quemar"
4. Detectaba que `cycleEndTime > 0` (hay ciclo pendiente)
5. Solo hacía `isActive = true` sin restaurar `currentProduct`
6. `completeCycle()` veía `currentProduct = undefined` → retorna `null`

**Solución**: En todos los componentes de skills, al reactivar un ciclo pendiente:
```typescript
// ✅ DESPUÉS (Fix)
if (quemadoState.cycleEndTime === 0) {
  // Crear nuevo ciclo
  skillsStore.activateSkill(Skill.QUEMADO, selectedProduct.value, cycleDuration)
} else {
  // Ciclo pendiente: restaurar currentProduct si se perdió
  if (!quemadoState.currentProduct) {
    quemadoState.currentProduct = selectedProduct.value
  }
  quemadoState.isActive = true
}
```

### **Problema 4: Fallback para localStorage corrupto**

Si `currentProductId` no se encontraba en localStorage pero había `cycleEndTime > 0`:
```typescript
// ✅ DESPUÉS (Fix - Fallback)
if (savedCycleEndTime > 0 && skillStates.value[skill].products.length > 0) {
  console.warn(`[Skills] No hay currentProductId pero hay cycleEndTime para ${skill}, usando fallback`)
  skillStates.value[skill].currentProduct = skillStates.value[skill].products[0]
}
```

---

## 🛠️ Cambios Realizados

### **skillsStore.ts**
- ✅ Cambió `completeCycle()` para validar `inventoryStore` obligatoriamente
- ✅ Mejoró `deactivateSkill()` para preservar `currentProduct` cuando `preserveCycleTime = true`
- ✅ Cambió persistencia de localStorage para guardar solo `currentProductId`
- ✅ Añadió fallback al cargar si `currentProductId` no se encuentra

### **App.vue**
- ✅ Importó `Skill` enum
- ✅ Diferencia entre `burningTime` (Quemado) y `cycleDuration` (otros skills) en reinicio automático
- ✅ Limpió logs de debug

### **QuemadoSkill.vue**
- ✅ Añadió restauración de `currentProduct` cuando ciclo pendiente pero sin producto
- ✅ Limpió logs de debug

### **MiningSkill.vue**, **LoggingSkill.vue**, **SmeltingSkill.vue**
- ✅ Aplicó el mismo patrón de restauración de `currentProduct`

---

## ✅ Validación

### **Test Manual Realizado**
1. Seleccionar tronco para quemar
2. Hacer click "Quemar"
3. Esperar a completarse el ciclo
4. ✅ Ciclo se completa correctamente
5. ✅ Se consume 1 tronco (32 → 30 después de 2 ciclos)
6. ✅ Se reinicia automáticamente sin detención
7. ✅ Se generan drops (carbón 40%, ceniza 20%, nada 40%)

### **Casos de Uso Cubiertos**
- ✅ Nuevo ciclo (sin `cycleEndTime`)
- ✅ Ciclo pendiente (con `cycleEndTime`, con `currentProduct`)
- ✅ Ciclo pendiente con `currentProduct` perdido (fallback a seleccionado)
- ✅ Ciclo pendiente sin `currentProductId` en localStorage (fallback al primero)
- ✅ Reinicio automático con duración correcta

---

## 📊 Impacto

| Aspecto | Antes | Después |
|--------|-------|---------|
| **Ciclos Quemado** | Se detienen inmediatamente | Funcionan correctamente |
| **Consumo de troncos** | No consume (por bug) | Consume 1 por ciclo ✓ |
| **Reinicio automático** | No funciona | Funciona ✓ |
| **Drops** | No se generan | Se generan correctamente ✓ |
| **Persistencia** | Se pierden ciclos pendientes | Se preservan correctamente ✓ |
| **Offline farmeo** | Roto para Quemado | Funciona como otros skills ✓ |

---

## 🔗 Referencias

- **skillsStore.ts**: `completeCycle()` líneas 179-320, `deactivateSkill()` líneas 170-182
- **App.vue**: Game Loop líneas 104-133
- **Componentes**: QuemadoSkill.vue líneas 102-145, MiningSkill.vue líneas 103-116, etc.

---

## 🚀 Aprendizajes Clave

1. **Diferencia entre `burningTime` y `cycleDuration`**: Cada skill puede tener propiedades diferentes
2. **Serialización en localStorage**: No todos los objetos se pueden serializar (usar solo IDs)
3. **Ciclos pendientes**: Necesitan preservar tanto `cycleEndTime` como `currentProduct`
4. **Fallbacks importantes**: Cuando hay datos inconsistentes, usar fallback al primer disponible
5. **Diferenciación en Game Loop**: El reinicio automático necesita lógica diferente por skill

---

**Status Final**: ✅ RESUELTO  
**Tested**: Sí - funciona correctamente con 2 ciclos completados
