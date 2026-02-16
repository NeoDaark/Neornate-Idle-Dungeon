# 🎯 Cambios Críticos - Quick Reference

## Archivos Modificados

### 1. **App.vue** (Game Loop)
```typescript
// ✅ ANTES: Usaba cycleDuration para todos (incorrecto para Quemado)
const cycleDurationMs = currentState.currentProduct.cycleDuration * 1000

// ✅ DESPUÉS: Diferencia entre Quemado y otros skills
const duration = skill.skill === Skill.QUEMADO 
  ? (currentState.currentProduct.burningTime || 30)
  : currentState.currentProduct.cycleDuration
const cycleDurationMs = duration * 1000
```

### 2. **skillsStore.ts** (Persistencia)
```typescript
// ✅ ANTES: Guardaba objeto completo
currentProduct: state.currentProduct

// ✅ DESPUÉS: Guarda solo el ID
currentProductId: state.currentProduct?.id || undefined
```

```typescript
// ✅ DESPUÉS: Al cargar con fallback
if (loadedData.currentProductId) {
  skillStates.value[skill].currentProduct = skillStates.value[skill].products.find(
    p => p.id === loadedData.currentProductId
  )
  if (!skillStates.value[skill].currentProduct && savedCycleEndTime > 0) {
    // Fallback si producto no encontrado
    skillStates.value[skill].currentProduct = skillStates.value[skill].products[0]
  }
}
```

### 3. **Todos los Skills** (QuemadoSkill, MiningSkill, LoggingSkill, SmeltingSkill)
```typescript
// ✅ ANTES: Solo reactivaba sin restaurar currentProduct
if (quemadoState.cycleEndTime === 0) {
  // Crear nuevo
} else {
  quemadoState.isActive = true  // ❌ currentProduct podría ser undefined
}

// ✅ DESPUÉS: Restaura currentProduct si se perdió
if (quemadoState.cycleEndTime === 0) {
  // Crear nuevo
} else {
  if (!quemadoState.currentProduct) {
    quemadoState.currentProduct = selectedProduct.value
  }
  quemadoState.isActive = true  // ✅ Ahora tiene currentProduct
}
```

## Líneas Clave

| Archivo | Línea | Cambio |
|---------|-------|--------|
| App.vue | 114-118 | Diferencia burningTime vs cycleDuration |
| skillsStore.ts | 323 | Guardar currentProductId en lugar de currentProduct |
| skillsStore.ts | 358-368 | Fallback al cargar si currentProductId no existe |
| skillsStore.ts | 170-182 | deactivateSkill preserva currentProduct si preserveCycleTime=true |
| QuemadoSkill.vue | 138-141 | Restaura currentProduct antes de reactivar |
| MiningSkill.vue | 108-111 | Restaura currentProduct antes de reactivar |
| LoggingSkill.vue | 108-111 | Restaura currentProduct antes de reactivar |
| SmeltingSkill.vue | 124-127 | Restaura currentProduct antes de reactivar |

## Resultado

**Antes**: Ciclo se detenía inmediatamente  
**Después**: Ciclo funciona, 2 ciclos = 2 troncos consumidos ✓

