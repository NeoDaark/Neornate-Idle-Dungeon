# 🔧 Debugging & Troubleshooting: Game Loop

Guía práctica para diagnosticar problemas en el game loop.

---

## 📋 Checklist de Diagnóstico

### El skill no se activa

```typescript
// 1. Verificar si el componente está enviando la activación
console.log('Attempting to activate:', skill, product)

// 2. Verificar estado post-activación
const store = useSkillsStore()
const state = store.skillStates[skill]
console.log({
  isActive: state.isActive,           // ¿true?
  cycleEndTime: state.cycleEndTime,   // ¿> 0?
  currentProduct: state.currentProduct?.id,
  inActiveSkills: store.activeSkills.map(s => s.skill)
})

// 3. Verificar si el game loop está ejecutándose
// Ver en browser console si hay logs cada 100ms
// Si no hay logs → game loop no inició
```

### El skill se activa pero no completa ciclos

```typescript
// 1. Verificar cycleEndTime
const now = Date.now()
const state = store.skillStates[skill]
console.log({
  now,
  cycleEndTime: state.cycleEndTime,
  timeRemaining: state.cycleEndTime - now,
  isTimeReached: now >= state.cycleEndTime
})

// 2. Si timeRemaining es negativo = debería completarse
// Si no se completa → problema en game loop o completeCycle()

// 3. Ejecutar manualmente completeCycle
const result = store.completeCycle(skill, inventory)
console.log('completeCycle result:', result)
```

### El ciclo completa pero sin reiniciar

```typescript
// Problema: completeCycle OK pero no se reactiva

// Verificar lógica en game loop:
const result = store.completeCycle(skill, inventory)
console.log({
  result,                           // ¿no es null?
  'skill.isActive': state.isActive, // ¿true?
  'result && isActive': result && state.isActive
})

// Si result es OK pero no se reactiva:
// → Problema en la rama: if (result && skill.isActive)
// → Verificar que currentProduct existe para reinicio
```

### Los ciclos offline no se procesan

```typescript
// 1. Verificar si calculateOfflineProgress se ejecutó
console.log('offlineHarvestSummary:', gameStore.offlineHarvestSummary)

// 2. Verificar el timestamp guardado
console.log('lastActiveTime:', localStorage.getItem('neornate_lastActiveTime'))

// 3. Verificar si hay suficiente tiempo offline
const lastActive = parseInt(localStorage.getItem('neornate_lastActiveTime') || '0')
const offlineMs = Date.now() - lastActive
console.log({
  offlineMs,
  MIN_OFFLINE_TIME: 5000,
  qualifies: offlineMs >= 5000
})

// 4. Verificar estado de skill al cargar
const skillState = store.skillStates[skill]
console.log({
  cycleEndTime: skillState.cycleEndTime,
  currentProduct: skillState.currentProduct?.id,
  hasProduct: !!skillState.currentProduct
})
```

---

## 🐛 Problemas Comunes & Soluciones

### Problema 1: Skill se pausa sin razón visible

```
Síntoma:
  - Skill estaba activo
  - Se pausa de repente
  - No hay mensaje de error

Causa probable:
  → completeCycle() retorna null (materiales insuficientes)
  → Esto dispara: deactivateSkill(skill, true)

Diagnóstico:
  const state = store.skillStates[skill]
  if (!state.isActive) {
    const product = state.currentProduct
    console.log('Skill paused. Checking materials...')
    if (product?.requiredMaterials) {
      product.requiredMaterials.forEach(mat => {
        const qty = inventory.getItemQuantity(mat.itemId)
        console.log(`${mat.itemId}: need ${mat.quantity}, have ${qty}`)
      })
    }
  }

Solución:
  → Agregar los materiales necesarios
  → Reactivar skill manualmente
  → O implementar "auto-pause notification"
```

### Problema 2: Ciclos offline calculados incorrectamente

```
Síntoma:
  - App cerrada 10 minutos
  - Solo 2 ciclos procesados (debería ser ~120)

Causa probable:
  → cycleEndTime no se guardó correctamente
  → Falso: requiredMaterials fue inspeccionado incorrectamente
  → O el skill no se guardó como "activo"

Diagnóstico (antes de cerrar app):
  const state = store.skillStates[skill]
  console.log('Pre-close state:', {
    isActive: state.isActive,
    cycleEndTime: state.cycleEndTime,
    currentProduct: state.currentProduct?.id
  })
  
  // Luego verificar localStorage
  const saved = JSON.parse(localStorage.getItem('neornate_skills'))
  console.log('Saved to localStorage:', saved[skill])

Después de reapertura:
  // Ver calculateOfflineProgress logs
  // Buscar: "[Offline] ✓ mineria: ..." o "[Offline] ✗ mineria: ..."

Solución:
  → Verificar que deactivateSkill() se llama con false (no true)
  → Verificar que saveToLocalStorage() se ejecuta en auto-save
```

### Problema 3: Game loop usa mucha CPU

```
Síntoma:
  - Fan ruidoso
  - Batería se drena rápido
  - Lag en otros programas

Causa probable:
  → Game loop tick muy rápido (< 100ms)
  → Demasiadas operaciones por tick
  → Rendering innecesario

Diagnóstico:
  // En App.vue, deshabilitar game loop temporalmente
  let tickCount = 0
  gameLoopInterval = setInterval(() => {
    tickCount++
    if (tickCount % 100 === 0) {
      console.log(`Game loop: ${tickCount} ticks`)
    }
    // ... resto del code
  }, 100)
  
  // En console: medir tiempo de ejecución
  console.time('gameLoopTick')
  // ... game loop code
  console.timeEnd('gameLoopTick')

Solución:
  → GAME_CONSTANTS.GAME_LOOP_TICK debería ser 100+
  → Reducir número de activeSkills monitoreados
  → Usar requestAnimationFrame en lugar de setInterval
```

### Problema 4: Herramientas no aplican bonus a ciclos existentes

```
Síntoma:
  - Equipo herramienta con speedBonus
  - Ciclo en progreso no se acelera

Causa:
  → speedBonus se aplica en activateSkill()
  → NOT en completeCycle()
  → Skill ya tiene cycleEndTime calculado sin bonus

Confirmación:
  // Antes de equipar
  const state = store.skillStates[skill]
  console.log('cycleEndTime before tool:', state.cycleEndTime)
  
  // Equipa herramienta
  // ...
  
  // Verifica que NO cambió
  console.log('cycleEndTime after tool:', state.cycleEndTime)
  // → será el mismo

Solución (expected behavior):
  → User debe reactivar skill para aplicar bonus
  → O implementar "Apply equipment bonus" button
  → O automáticamente: si herramienta se equipa y skill activo
    → Mostrar confirmación
    → Si user acepta: deactivate + reactivate con nuevo bonus
```

---

## 🧪 Estrategias de Testing

### Test 1: Verificar ciclo simple

```javascript
// En DevConsole o browser console
const { useSkillsStore } = await import('@/stores/skillsStore.ts')
const { useInventoryStore } = await import('@/stores/inventoryStore.ts')
const { Skill } = await import('@/types/Game.ts')

const skillStore = useSkillsStore()
const inventoryStore = useInventoryStore()

// Activar
console.log('Activating MINERIA...')
skillStore.activateSkill(Skill.MINERIA, 
  skillStore.skillStates[Skill.MINERIA].products[0], 
  100  // ciclo rápido de 100ms para testing
)

// Esperar 200ms y ver si completó
setTimeout(() => {
  const state = skillStore.skillStates[Skill.MINERIA]
  console.log({
    isActive: state.isActive,
    cycleEndTime: state.cycleEndTime,
    inventory: inventoryStore.inventory
  })
}, 200)
```

### Test 2: Simular offline

```javascript
// Guardar tiempo hace 10 minutos
const now = Date.now()
const tenMinutesAgo = now - (10 * 60 * 1000)
localStorage.setItem('neornate_lastActiveTime', tenMinutesAgo.toString())

// Guardar skill activo con cycleEndTime en el pasado
const skillStore = useSkillsStore()
const state = skillStore.skillStates['mineria']
state.isActive = true
state.cycleEndTime = tenMinutesAgo + 60000  // termina en 1 minuto en el pasado
state.currentProduct = state.products[0]

skillStore.saveToLocalStorage()

// Recargar app (F5)
// calculateOfflineProgress() se ejecutará automáticamente
```

### Test 3: Verificar bonuses de herramienta

```javascript
const { useToolsStore } = await import('@/stores/toolsStore.ts')
const { Skill } = await import('@/types/Game.ts')

const toolStore = useToolsStore()

// Ver bonus actual
const bonus = toolStore.calculateToolBonus(Skill.MINERIA)
console.log('Tool bonus for MINERIA:', bonus)

// Equipar herramienta y verificar cambio
// (asumiendo toolStore.equipTool() exists)
toolStore.equipTool(someToolId)
const newBonus = toolStore.calculateToolBonus(Skill.MINERIA)
console.log('New bonus:', newBonus)
```

### Test 4: Simular falta de materiales

```javascript
const { useSkillsStore } = await import('@/stores/skillsStore.ts')
const { useInventoryStore } = await import('@/stores/inventoryStore.ts')

const skillStore = useSkillsStore()
const inventoryStore = useInventoryStore()

// Activar herrería (requiere lingotes)
const herreriaState = skillStore.skillStates['herreria']
const product = herreriaState.products[0]  // Asumiendo requiere materiales

console.log('Activating HERRERIA without materials...')
skillStore.activateSkill('herreria', product, 1000)

// Esperar a que se cumpla ciclo
setTimeout(() => {
  console.log('Attempting completeCycle...')
  const result = skillStore.completeCycle('herreria', inventoryStore)
  console.log('Result:', result)  // Debería ser null
  
  console.log('Skill status:', {
    isActive: herreriaState.isActive,  // Debería ser false
    cycleEndTime: herreriaState.cycleEndTime  // Debería preservarse
  })
}, 1100)
```

---

## 📊 Monitoring en Tiempo Real

### Setup básico de logging

```typescript
// En App.vue, modificar game loop
gameLoopInterval = setInterval(() => {
  const activeSkills = skillsStore.activeSkills
  const now = Date.now()
  
  activeSkills.forEach(skill => {
    const timeRemaining = skill.cycleEndTime - now
    
    if (timeRemaining % 1000 < 100) {  // Log cada segundo aprox
      console.log(`[GameLoop] ${skill.skill}: ${Math.ceil(timeRemaining/1000)}s remaining`)
    }
    
    if (skill.cycleEndTime > 0 && now >= skill.cycleEndTime) {
      console.log(`[GameLoop] ✓ ${skill.skill} ciclo completado`)
      const result = skillsStore.completeCycle(skill.skill, inventoryStore)
      
      if (result && skill.isActive) {
        console.log(`[GameLoop] ↻ ${skill.skill} reiniciando`)
        // ...
      } else if (!result && skill.isActive) {
        console.log(`[GameLoop] ⏸ ${skill.skill} pausado (sin recursos)`)
        // ...
      }
    }
  })
}, GAME_CONSTANTS.GAME_LOOP_TICK)
```

### Dashboard de monitoreo

```vue
<template>
  <div class="game-loop-monitor">
    <div v-for="skill in allSkills" :key="skill.skill" class="skill-monitor">
      <span>{{ skill.skill }}</span>
      <span v-if="skill.isActive">
        🟢 {{ timeRemaining(skill) }}s
      </span>
      <span v-else>⭕ Inactivo</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'

const skillsStore = useSkillsStore()
const allSkills = computed(() => skillsStore.allSkills)
const now = ref(Date.now())

const timeRemaining = (skill) => {
  return Math.max(0, Math.ceil((skill.cycleEndTime - now.value) / 1000))
}

onMounted(() => {
  setInterval(() => {
    now.value = Date.now()
  }, 100)
})
</script>
```

---

## 🎯 Debugging Checklist

- [ ] Verificar que `gameLoopInterval` está definido (no null/undefined)
- [ ] Verificar que `activeSkills` contiene el skill esperado
- [ ] Verificar que `cycleEndTime > 0` (no 0 o negativo)
- [ ] Verificar que `now >= cycleEndTime` en el tick correcto
- [ ] Verificar que `inventoryStore` se pasa a `completeCycle()`
- [ ] Verificar que `requiredMaterials` se validan correctamente
- [ ] Verificar que `skill.currentProduct` existe para reinicio
- [ ] Verificar que `cycleEndTime` se actualiza post-reinicio
- [ ] Verificar que `lastActiveTime` se guarda en localStorage
- [ ] Verificar que offline se procesa ANTES de que inicie game loop
- [ ] Verificar que bonuses se aplican en `activateSkill()`, no en completeCycle
- [ ] Verificar que `deactivateSkill(skill, true)` preserva cycleEndTime

---

**Referencias**:
- 18-ANALISIS_GAME_LOOP.md (detalles técnicos)
- 19-GAME_LOOP_QUICK_REFERENCE.md (guía rápida)
- 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (visualización)
