# 🔄 Análisis Detallado: Game Loop Principal

**Documento de Ingeniería**: Arquitectura y ciclo de vida del sistema de automación de skills.

---

## 📍 Ubicación del Game Loop

| Componente | Archivo | Líneas | Responsabilidad |
|---|---|---|---|
| **Game Loop** | `src/App.vue` | 98-126 | Ciclo principal que monitorea skills activos |
| **Activación** | `src/App.vue` | 45-65 | Inicialización y punto de entrada |
| **Skill State** | `src/stores/skillsStore.ts` | 1-435 | Gestión del estado de skills |
| **Completar Ciclo** | `src/stores/skillsStore.ts` | 187-310 | Procesamiento de ciclos completados |
| **Offline Progress** | `src/stores/gameStore.ts` | 95-280 | Cálculo de ciclos offline |

---

## 🚀 Ciclo de Vida Completo

### 1️⃣ **FASE 1: INICIALIZACIÓN (onMounted en App.vue)**

```
App.vue montado
    ↓
[onMounted hook]
    ├─ gameStore.initializeGame()
    │   └─ Cargar datos guardados desde localStorage
    │       ├─ playerStore.loadFromLocalStorage()
    │       ├─ inventoryStore.loadFromLocalStorage()
    │       ├─ skillsStore.loadFromLocalStorage()
    │       └─ marketStore.loadFromLocalStorage()
    │
    ├─ setTimeout(3000ms) → Simulación de carga
    │
    └─ Cuando termina timeout:
        ├─ gameStore.calculateOfflineProgress()
        │   └─ Procesar ciclos completados mientras app estaba cerrada
        │
        ├─ isLoading = false (mostrar layout)
        │
        └─ startGameLoop()
            └─ COMENZAR GAME LOOP ACTIVO
```

**Timing crítico**: `calculateOfflineProgress()` DEBE ejecutarse antes de que comience el game loop activo.

---

### 2️⃣ **FASE 2: GAME LOOP ACTIVO (tick cada 100ms)**

```typescript
// En App.vue, líneas 98-126
gameLoopInterval = setInterval(() => {
  // Cada 100ms (GAME_CONSTANTS.GAME_LOOP_TICK)
  
  const activeSkills = skillsStore.activeSkills  // ← Skills con isActive=true
  
  activeSkills.forEach(skill => {
    const now = Date.now()
    
    // ✅ CONDICIÓN PRINCIPAL: ¿Se completó el ciclo?
    if (skill.cycleEndTime > 0 && now >= skill.cycleEndTime) {
      
      // 1️⃣ PROCESAR CICLO
      const result = skillsStore.completeCycle(skill.skill, inventoryStore)
      
      // 2️⃣ EVALUAR RESULTADO
      if (result && skill.isActive) {
        // ✅ Ciclo completado + skill sigue activo
        // → REINICIAR AUTOMÁTICAMENTE
        
        const currentState = skillsStore.getSkillState(skill.skill)
        if (currentState.currentProduct) {
          const duration = SKILL_CONFIGS[skill.skill].baseCycleDuration
          const cycleDurationMs = duration * 1000
          skillsStore.activateSkill(skill.skill, currentState.currentProduct, cycleDurationMs)
        }
        
      } else if (!result && skill.isActive) {
        // ❌ Ciclo falló (sin materiales) pero skill sigue activo
        // → PAUSAR PRESERVANDO ESTADO
        skillsStore.deactivateSkill(skill.skill, true)
        // true = preservar cycleEndTime para offline
      }
    }
  })
  
}, GAME_CONSTANTS.GAME_LOOP_TICK)  // 100ms
```

**Lógica simplificada:**
```
Cada 100ms:
  Para cada skill activo:
    ¿Pasó el tiempo de ciclo?
      NO  → Esperar siguiente tick
      SÍ  → Completar ciclo
          ¿Resultado exitoso?
            SÍ  → Reiniciar ciclo automáticamente
            NO  → Pausar (preservar estado)
```

---

### 3️⃣ **FASE 3: AUTO-SAVE PERIÓDICO (cada 5 segundos)**

```typescript
// En App.vue, líneas 128-135
saveInterval = setInterval(() => {
  gameStore.saveGame()
  skillsStore.saveToLocalStorage()
  inventoryStore.saveToLocalStorage()
  playerStore.saveToLocalStorage()
  toolsStore.saveToStorage()
}, GAME_CONSTANTS.AUTO_SAVE_INTERVAL)  // 5000ms
```

**Qué se guarda:**
- Níveis y experiencia de skills
- Inventario actual
- Estado activo/inactivo de skills
- `cycleEndTime` (CRÍTICO para offline)
- Timestamp: `localStorage['neornate_lastActiveTime']`

---

## 🔍 Estructura de Estado: SkillState

```typescript
interface SkillState {
  skill: Skill                    // 'mineria', 'tala', etc
  level: number                   // 1-120
  experience: number              // XP actual para siguiente nivel
  totalExperience: number         // XP acumulado (histórico)
  tier: Tier                      // T1-T7
  isActive: boolean               // ¿Skill ejecutándose actualmente?
  autoComplete: boolean           // Toggle futuro
  lastCycleTime: number          // Timestamp inicio último ciclo
  cycleEndTime: number           // ⏰ TIMESTAMP de finalización (crítico)
  currentProduct: SkillProduct   // Item que se está produciendo
  products: SkillProduct[]       // Todos los productos disponibles
}

interface SkillProduct {
  id: string                      // 'mineral-cobre', etc
  item: Item                      // Item que genera
  quantity: number                // Cantidad por ciclo
  xpReward: number               // XP ganado
  requiredMaterials?: Material[] // Materiales necesarios (crafting)
}
```

---

## ⏱️ Duración de Ciclos (Constantes)

| Skill | Base Duration | Modificadores |
|---|---|---|
| **MINERIA** | 5s | Tool speedBonus |
| **TALA** | 5s | Tool speedBonus |
| **FUNDICION** | 5s | Tool speedBonus |
| **QUEMADO** | 5s | Tool speedBonus |
| **HERRERIA** | 5s | Tool speedBonus |
| **PESCA** | 5s | Tool speedBonus |
| **COCINA** | 5s | Tool speedBonus |
| **AVENTURA** | 5s | Tool speedBonus |

**Fórmula final:**
```
cycleDurationMs = max(500, baseDuration*1000 - speedBonus*1000)
```

Ejemplo: Tool con speedBonus=1.5s
```
cycleDurationMs = max(500, 5000 - 1500) = 3500ms
```

---

## 🔄 Flujo: Activar un Skill

### Punto de entrada: Component (ej. MiningSkill.vue)
```typescript
// Usuario hace click en "Activar"
const handleActivateSkill = () => {
  const cycleDuration = SKILL_CONFIGS[Skill.MINERIA].baseCycleDuration * 1000
  
  skillsStore.activateSkill(Skill.MINERIA, selectedProduct, cycleDuration)
  // selectedProduct: { id: 'mineral-cobre', item: {...}, quantity: 1, xpReward: 10 }
}
```

### Ejecución en skillsStore.activateSkill()
```typescript
const activateSkill = (skill: Skill, product: SkillProduct, cycleDurationMs: number = 3000) => {
  // 1️⃣ Desactivar otros skills (máximo 1 activo)
  Object.entries(skillStates.value).forEach(([otherSkill, state]) => {
    if ((otherSkill as Skill) !== skill && state.isActive) {
      state.isActive = false
      state.currentProduct = undefined
      state.cycleEndTime = 0
    }
  })

  const state = skillStates.value[skill]

  // 2️⃣ Aplicar bonus de herramienta
  const toolsStore = useToolsStore()
  const toolBonus = toolsStore.calculateToolBonus(skill)
  let finalDurationMs = cycleDurationMs
  
  if (toolBonus.speedBonus !== 0) {
    finalDurationMs = Math.max(500, cycleDurationMs - (toolBonus.speedBonus * 1000))
  }

  // 3️⃣ Establecer estado
  const now = Date.now()
  state.isActive = true
  state.currentProduct = product
  state.lastCycleTime = now
  state.cycleEndTime = now + finalDurationMs  // ⏰ TIMESTAMP CRÍTICO
}
```

**Estado después:**
```
skillStates['mineria'] = {
  isActive: true
  currentProduct: { id: 'mineral-cobre', ... }
  cycleEndTime: 1708346125000  // now + 5000ms
  lastCycleTime: 1708346120000
}
```

---

## ✅ Flujo: Completar Ciclo

### Trigger: Game Loop detecta `now >= cycleEndTime`

```typescript
// En skillsStore.completeCycle()
const completeCycle = (skill: Skill, inventoryStore: any, resetCycleEndTime: boolean = true) => {
  const state = skillStates.value[skill]

  // ❌ VALIDACIÓN 1: ¿Hay producto?
  if (!state.currentProduct || state.cycleEndTime === 0) {
    return null
  }

  // ❌ VALIDACIÓN 2: ¿Tenemos inventoryStore?
  if (!inventoryStore) {
    console.error(`completeCycle(${skill}): inventoryStore is UNDEFINED!`)
    return null
  }

  const product = state.currentProduct

  // 1️⃣ CALCULAR XP CON BONUSES
  const toolsStore = useToolsStore()
  const toolBonus = toolsStore.calculateToolBonus(skill)
  
  let xpGained = product.xpReward
  if (toolBonus.xpBonus > 0) {
    xpGained = Math.floor(product.xpReward * (1 + toolBonus.xpBonus))
  }
  addExperience(skill, xpGained)

  // 2️⃣ CONSUMIR MATERIALES (si aplica)
  if (product.requiredMaterials && product.requiredMaterials.length > 0) {
    // Verificar disponibilidad
    for (const material of product.requiredMaterials) {
      const available = inventoryStore.getItemQuantity(material.itemId)
      if (available < material.quantity) {
        console.warn(`No hay suficientes materiales para ${product.id}`)
        return null  // ❌ Falso - retornar null
      }
    }
    
    // Consumir
    for (const material of product.requiredMaterials) {
      inventoryStore.removeItem(material.itemId, material.quantity)
    }
  }

  // 3️⃣ CALCULAR CANTIDAD CON BONUSES
  let finalQuantity = product.quantity
  if (toolBonus.quantityBonus > 0) {
    finalQuantity = product.quantity + Math.floor(toolBonus.quantityBonus)
  }

  // 4️⃣ AGREGAR AL INVENTARIO
  if (inventoryStore && skill !== Skill.QUEMADO) {
    inventoryStore.addItem(product.item, finalQuantity)
  }

  // 5️⃣ CASO ESPECIAL: QUEMADO (probabilidad drops)
  if (skill === Skill.QUEMADO) {
    const success = inventoryStore.removeItem(product.item.id, 1)  // Consumir tronco
    if (!success) {
      console.warn(`No hay suficientes troncos para quemar`)
      return null
    }

    const roll = Math.random()
    const carbonChance = WOODBURNING_DROP_TABLE.carbon.chance
    const ashChance = WOODBURNING_DROP_TABLE.ceniza.chance
    
    if (roll < carbonChance) {
      inventoryStore.addItem(WOODBURNING_DROP_TABLE.carbon.item, WOODBURNING_DROP_TABLE.carbon.quantity)
    } else if (roll < carbonChance + ashChance) {
      inventoryStore.addItem(WOODBURNING_DROP_TABLE.ceniza.item, WOODBURNING_DROP_TABLE.ceniza.quantity)
    }
  }

  // 6️⃣ RESETEAR CICLO (solo si se especifica)
  if (resetCycleEndTime) {
    state.cycleEndTime = 0
  }

  // ✅ RETORNAR RESULTADO
  return {
    skill,
    xpGained,
    product: product.item,
    quantity: finalQuantity,
    materialsConsumed: product.requiredMaterials || [],
    leveledUp: false,
  }
}
```

**Posibles resultados:**
```
✅ result object     → Ciclo completado exitosamente
❌ null             → Falló (sin materiales o validación)
```

---

## 🔁 Reinicio Automático (Loop Cerrado)

### Sequence en Game Loop
```
Tick 1 (t=1000ms):
  skill.cycleEndTime = 1705000000  (now = 1704995000)
  now < cycleEndTime → SIN HACER NADA

Tick 2 (t=1100ms): 
  now = 1704995100
  now < cycleEndTime → SIN HACER NADA

Tick N (t=5000ms):
  now = 1705000000
  now >= cycleEndTime → EJECUTAR completeCycle()
    ✅ Resultado exitoso
    skill.isActive = true
    → Entrar en bloque: if (result && skill.isActive)
      → skillsStore.activateSkill(skill, product, cycleDurationMs)
        → cycleEndTime = now + cycleDurationMs
        → cycleEndTime = 1705000000 + 5000 = 1705005000

Tick N+1 (t=5100ms):
  now = 1705000100
  now < cycleEndTime (1705005000) → SIN HACER NADA

[Ciclo se repite indefinidamente...]
```

**Ventaja**: No requiere input del usuario - automático mientras isActive=true

---

## 🌙 Procesamiento Offline (calculateOfflineProgress)

### Trigger: App abierta después de cierre

```typescript
// En gameStore.ts
const calculateOfflineProgress = () => {
  const lastActiveStr = localStorage.getItem('neornate_lastActiveTime')
  if (!lastActiveStr) return

  const lastActiveTime = parseInt(lastActiveStr, 10)
  const now = Date.now()
  let offlineMs = now - lastActiveTime

  // 1️⃣ LIMITAR TIEMPO MÁXIMO (2 horas)
  if (offlineMs > MAX_OFFLINE_TIME_MS) {
    offlineMs = MAX_OFFLINE_TIME_MS  // 2 * 60 * 60 * 1000
  }

  // 2️⃣ UMBRAL MÍNIMO (5 segundos)
  if (offlineMs < 5000) {
    return  // No procesar farmeo < 5s
  }

  // 3️⃣ PROCESAR CADA SKILL ACTIVO
  Object.values(skillsStore.skillStates).forEach((skillState) => {
    // ¿Hay producto en progreso?
    if (!skillState.currentProduct) {
      return  // Saltear
    }

    // Obtener duración del ciclo CON bonuses
    const baseCycleDuration = SKILL_CONFIGS[skillState.skill].baseCycleDuration * 1000
    const toolBonus = toolsStore.calculateToolBonus(skillState.skill)
    let cycleDuration = baseCycleDuration
    
    if (toolBonus.speedBonus !== 0) {
      cycleDuration = Math.max(500, baseCycleDuration - (toolBonus.speedBonus * 1000))
    }

    // 4️⃣ CALCULAR CICLOS COMPLETADOS
    const timeUntilCycleCompletes = skillState.cycleEndTime - lastActiveTime
    let cyclesCompleted = 0

    if (timeUntilCycleCompletes >= 0 && offlineMs >= timeUntilCycleCompletes) {
      // El ciclo en progreso se completó
      cyclesCompleted = 1
      
      // + ciclos adicionales después
      const timeAfterFirstComplete = offlineMs - timeUntilCycleCompletes
      const additionalCycles = Math.floor(timeAfterFirstComplete / cycleDuration)
      cyclesCompleted += additionalCycles

    } else {
      // Todos los ciclos son nuevos
      cyclesCompleted = Math.floor(offlineMs / cycleDuration)
    }

    // 5️⃣ PROCESAR CADA CICLO
    if (cyclesCompleted > 0) {
      let totalQuantity = 0
      let totalXP = 0
      let actualCyclesCompleted = 0

      for (let i = 0; i < cyclesCompleted; i++) {
        // VERIFICACIÓN: ¿Tenemos materiales?
        if (skillState.currentProduct?.requiredMaterials?.length > 0) {
          const hasMaterials = skillState.currentProduct.requiredMaterials.every((mat) => {
            return inventoryStore.getItemQuantity(mat.itemId) >= mat.quantity
          })
          if (!hasMaterials) {
            console.warn(`Ciclo ${i + 1} bloqueado: sin materiales`)
            break  // Parar
          }
        }

        // Completar ciclo (false = no resetear cycleEndTime)
        const result = skillsStore.completeCycle(skillState.skill, inventoryStore, false)
        if (result) {
          totalQuantity += result.quantity
          totalXP += result.xpGained
          actualCyclesCompleted++
        } else {
          break  // Error inesperado
        }
      }

      // 6️⃣ ACTUALIZAR cycleEndTime
      if (actualCyclesCompleted > 0) {
        const timeUsedByCompletedCycles = actualCyclesCompleted * cycleDuration
        const timeIntoCycleAfterComplete = offlineMs - timeUsedByCompletedCycles
        
        skillState.cycleEndTime = now + Math.max(0, cycleDuration - timeIntoCycleAfterComplete)
      } else {
        skillState.cycleEndTime = Math.max(0, skillState.cycleEndTime - offlineMs)
      }
    }
  })

  // 7️⃣ GUARDAR Y MOSTRAR RESUMEN
  saveGame()
  // offlineHarvestSummary se muestra en OfflineHarvestNotification
}
```

### Ejemplo de cálculo offline

```
Escenario:
  - App cerrada: 13:00:00
  - App abierta: 13:10:00
  - offlineMs = 10 * 60 * 1000 = 600,000ms (10 minutos)
  
  - Skill MINERIA activo con ciclo de 5000ms (5 segundos)
  - cycleEndTime guardado = 1708346120000 (13:02:00)
  - lastActiveTime = 1708346040000 (13:00:00)

Cálculos:
  timeUntilCycleCompletes = 1708346120000 - 1708346040000 = 80000ms
  offlineMs (600000) >= timeUntilCycleCompletes (80000) ✅
  
  cyclesCompleted = 1 (ciclo en progreso)
  timeAfterFirstComplete = 600000 - 80000 = 520000ms
  additionalCycles = floor(520000 / 5000) = 104
  cyclesCompleted TOTAL = 1 + 104 = 105 ciclos

Resultado:
  Si cada ciclo genera: 1 mineral + 10 XP
  → 105 minerales + 1050 XP ganados offline
  
  Nuevo cycleEndTime = now + (5000 - (520000 % 5000))
                     = 1708346640000 + (5000 - 0)
                     = 1708346645000
```

---

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    App.vue → onMounted                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ├─→ gameStore.initializeGame()
                             │   └─ Cargar localStorage
                             │
                             ├─→ setTimeout(3000ms)
                             │
                             └─→ gameStore.calculateOfflineProgress()
                                 └─ Procesar ciclos offline
                                    
                             ↓ CUANDO TERMINA TIMEOUT

┌─────────────────────────────────────────────────────────────────────┐
│              startGameLoop() → Game Loop Activo                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
         CADA 100ms      CADA 5000ms      UNMOUNT
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐ ┌──────────────┐ ┌─────────┐
    │  Game Loop    │ │ Auto-Save    │ │ onUnmount
    │  (setInterval)│ │ (setInterval)│ │ (cleanup)
    └───────────────┘ └──────────────┘ └─────────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                    guardaAllStores()
```

---

## 🎛️ Constantes de Configuración

```typescript
// src/types/Game.ts
export const GAME_CONSTANTS: GameConstants = {
  MAX_LEVEL: 200,
  PRESTIGE_LEVEL: 120,
  AUTO_SAVE_INTERVAL: 5000,      // 5 segundos
  GAME_LOOP_TICK: 100,           // 100ms
}

// Máximo tiempo offline a procesar
const MAX_OFFLINE_TIME_MS = 2 * 60 * 60 * 1000  // 2 horas

// Umbral mínimo offline
const MIN_OFFLINE_TIME = 5000  // 5 segundos
```

---

## ⚡ Optimizaciones Implementadas

| Optimización | Implementación | Beneficio |
|---|---|---|
| **Tick granular** | 100ms (no 16ms) | Reduce CPU vs 60 FPS |
| **Computed activeSkills** | Filtra isActive=true | Solo procesa skills activos |
| **Tool bonus cache** | calculateToolBonus() | No recalcular en cada tick |
| **Offline batching** | Procesar múltiples ciclos | No simular cada frame |
| **LocalStorage async** | Fallback try-catch | App sigue si localStorage falla |
| **Presample componentes** | Pre-carga en onMounted | Evita lag al navegar |

---

## 🐛 Casos Edge / Puntos Críticos

### 1. **Materiales insuficientes**
```
Escenario: Herrero requiere 10 lingotes, pero solo hay 5
Resultado: completeCycle() retorna null
Game Loop: Deactiva skill con true (preserva cycleEndTime)
Usuario: Ve skill pausado (no desaparece estado)
Solución: Cuando tenga materiales → activar manualmente
```

### 2. **Skill activo mientras app cierra**
```
Escenario: MINERIA activo, app se cierra con skill en medio de ciclo
Guardado: cycleEndTime se persiste en localStorage
Reapertura: calculateOfflineProgress() usa cycleEndTime para calcular
Resultado: Ciclos offline se completan antes de game loop inicia
```

### 3. **Herramientas equipadas después de ciclo iniciado**
```
Escenario: Equipa herramienta con speedBonus mientras MINERIA activo
Problema: cycleEndTime ya se calculó sin bonus
Solución: User debe re-activar skill para aplicar bonus
Nota: El bonus se APLICA en activateSkill(), no en completeCycle()
```

### 4. **Offline > 2 horas**
```
Escenario: App cerrada 4 horas
Limitación: MAX_OFFLINE_TIME_MS = 2 horas
Resultado: Solo procesa 2 horas de farmeo
Justificación: Evitar overflow de XP/items
```

---

## 📝 Resumen: Responsabilidades por Archivo

| Archivo | Responsabilidad |
|---|---|
| **App.vue** | Ciclo principal (100ms), coordinación lifecycle |
| **skillsStore.ts** | activateSkill(), completeCycle(), estado |
| **gameStore.ts** | calculateOfflineProgress(), persistencia |
| **toolsStore.ts** | calculateToolBonus() (speedBonus, xpBonus, quantityBonus) |
| **inventoryStore.ts** | addItem(), removeItem(), getItemQuantity() |
| **Components (MiningSkill, etc)** | Activación inicial (via UI) |

---

## 🔗 Conexiones Clave

```
User activates skill (UI)
    ↓
Component llama → skillsStore.activateSkill()
    ↓
cycleEndTime se establece = now + duration
    ↓
Game Loop detecta condición (cada 100ms)
    ↓
completeCycle() procesa item + XP
    ↓
Si resultado OK → activateSkill() nuevamente
    ↓
[Loop se repite indefinidamente]
```

---

**Última actualización**: 18 de febrero de 2026
