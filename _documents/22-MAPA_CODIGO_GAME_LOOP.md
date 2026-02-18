# 🗺️ Mapa de Código: Game Loop & Stores

Guía visual de dónde encontrar cada función y cómo están conectadas.

---

## 📁 Estructura de Archivos Clave

```
src/
├─ App.vue                           ⭐ PUNTO DE ENTRADA
│  ├─ onMounted()                    │ Inicialización
│  │  ├─ gameStore.initializeGame()  │ Cargar datos
│  │  ├─ setTimeout(3000)            │ Esperar carga
│  │  └─ gameStore.calculateOfflineProgress()  │ Offline
│  │
│  ├─ startGameLoop()                ⭐ GAME LOOP ACTIVO
│  │  ├─ setInterval(100ms)          │ Cada tick
│  │  │  ├─ skillsStore.activeSkills │ Computed
│  │  │  ├─ skillsStore.completeCycle() │ Procesar
│  │  │  └─ skillsStore.activateSkill() │ Reiniciar
│  │  │
│  │  └─ setInterval(5000ms)         │ Auto-save
│  │     └─ saveGame() x todos stores │ Persistencia
│  │
│  └─ onUnmounted()                  │ Cleanup
│     └─ saveGame() x todos stores    │ Guardado final
│
├─ stores/
│  ├─ skillsStore.ts                 ⭐ STATE MANAGEMENT
│  │  ├─ skillStates                 │ Estado de skills
│  │  │
│  │  ├─ getSkillState()             │ Obtener estado
│  │  ├─ setSkillProducts()          │ Asignar productos
│  │  ├─ addExperience()             │ Agregar XP
│  │  ├─ levelUp()                   │ Subir de nivel
│  │  │
│  │  ├─ activateSkill()             ⭐ ACTIVACIÓN
│  │  │  ├─ Desactivar otros skills
│  │  │  ├─ Obtener tool bonus
│  │  │  ├─ Calcular duración final
│  │  │  └─ Establecer cycleEndTime
│  │  │
│  │  ├─ deactivateSkill()           │ Pausa
│  │  │  └─ Opcional: preservar cycleEndTime
│  │  │
│  │  ├─ completeCycle()             ⭐ COMPLETAR CICLO
│  │  │  ├─ Validar producto
│  │  │  ├─ Validar inventoryStore
│  │  │  ├─ Validar materiales
│  │  │  ├─ addExperience()
│  │  │  ├─ inventoryStore.removeItem() (materiales)
│  │  │  ├─ inventoryStore.addItem() (items generados)
│  │  │  └─ [Caso especial: QUEMADO drops]
│  │  │
│  │  ├─ toggleAutoComplete()        │ Futuro
│  │  ├─ saveToLocalStorage()        │ Persistencia
│  │  └─ loadFromLocalStorage()      │ Restauración
│  │
│  ├─ gameStore.ts                   ⭐ LÓGICA GLOBAL
│  │  ├─ gameState
│  │  ├─ offlineHarvestSummary
│  │  │
│  │  ├─ initializeGame()            │ Primera carga
│  │  ├─ saveGame()                  │ Guardar todos stores
│  │  ├─ pauseGame() / resumeGame()   │ Pausa del juego
│  │  │
│  │  └─ calculateOfflineProgress()  ⭐ PROCESAMIENTO OFFLINE
│  │     ├─ Obtener lastActiveTime
│  │     ├─ Calcular offlineMs
│  │     ├─ [Para cada skill activo]
│  │     │  ├─ Calcular ciclos completados
│  │     │  ├─ [Para cada ciclo]
│  │     │  │  ├─ Validar materiales
│  │     │  │  └─ completeCycle(resetTime=false)
│  │     │  └─ Actualizar cycleEndTime
│  │     ├─ Crear offlineHarvestSummary
│  │     └─ saveGame()
│  │
│  ├─ inventoryStore.ts
│  │  ├─ inventory (items)
│  │  ├─ addItem()
│  │  ├─ removeItem()
│  │  ├─ getItemQuantity()
│  │  └─ [conectado con completeCycle()]
│  │
│  ├─ toolsStore.ts
│  │  ├─ equippedTools
│  │  ├─ calculateToolBonus()        │ speedBonus, xpBonus, etc
│  │  └─ [conectado con activateSkill() y completeCycle()]
│  │
│  ├─ playerStore.ts
│  │  ├─ player (stats generales)
│  │  └─ [persistencia]
│  │
│  └─ marketStore.ts
│     ├─ prices
│     └─ [persistencia]
│
├─ types/
│  ├─ Game.ts
│  │  ├─ enum Skill { MINERIA, TALA, ... }
│  │  ├─ enum Tier { T1, T2, ... }
│  │  ├─ GAME_CONSTANTS
│  │  │  ├─ GAME_LOOP_TICK: 100
│  │  │  ├─ AUTO_SAVE_INTERVAL: 5000
│  │  │  └─ [constantes globales]
│  │  │
│  │  └─ SKILL_CONFIGS
│  │     ├─ [MINERIA]: { baseCycleDuration: 5 }
│  │     ├─ [TALA]: { baseCycleDuration: 5 }
│  │     └─ [...todos]
│  │
│  ├─ Skill.ts
│  │  ├─ interface SkillState
│  │  │  ├─ skill: Skill
│  │  │  ├─ isActive: boolean        │ ← CLAVE para game loop
│  │  │  ├─ cycleEndTime: number     │ ← CLAVE para game loop
│  │  │  ├─ currentProduct: SkillProduct
│  │  │  └─ [XP, level, tier, etc]
│  │  │
│  │  └─ interface SkillProduct
│  │     ├─ id: string
│  │     ├─ item: Item
│  │     ├─ quantity: number
│  │     ├─ xpReward: number
│  │     └─ requiredMaterials?: Material[]
│  │
│  └─ [otros types...]
│
├─ components/
│  └─ skills/
│     ├─ MiningSkill.vue
│     │  ├─ handleActivateSkill()    │ Dispara activateSkill()
│     │  └─ [UI para skill]
│     │
│     ├─ LoggingSkill.vue
│     ├─ SmeltingSkill.vue
│     └─ [otros...]
│
└─ data/
   ├─ skillProducts.ts
   │  ├─ SKILL_PRODUCTS_MAP { MINERIA: {...}, TALA: {...} }
   │  └─ WOODBURNING_DROP_TABLE (caso especial)
   │
   └─ toolsData.ts
      └─ [definiciones de herramientas]
```

---

## 🔗 Flujos de Datos

### Flujo 1: Activación (User → Game Loop)

```
MiningSkill.vue
  │
  ├─ @click: handleActivateSkill()
  │
  └─→ skillsStore.activateSkill(
        skill: Skill.MINERIA
        product: SkillProduct
        cycleDurationMs: 5000
      )
       │
       ├─ Desactivar otros skills
       │
       ├─ toolsStore.calculateToolBonus(Skill.MINERIA)
       │   └─ Retorna: { speedBonus, xpBonus, quantityBonus }
       │
       ├─ Calcular: finalDurationMs = max(500, 5000 - speedBonus*1000)
       │
       └─ state.cycleEndTime = now + finalDurationMs
           state.isActive = true
           state.currentProduct = product
           │
           └─→ activeSkills computed se actualiza
               │
               └─→ Game Loop detecta en próximo tick (100ms)
```

### Flujo 2: Procesamiento (Game Loop)

```
Game Loop (cada 100ms en App.vue)
  │
  ├─ const activeSkills = skillsStore.activeSkills
  │   └─ Filtra: { isActive: true }
  │
  └─→ FOR EACH activeSkill:
      │
      ├─ const now = Date.now()
      │
      ├─ if (now >= skill.cycleEndTime)
      │   │
      │   ├─→ skillsStore.completeCycle(skill, inventoryStore)
      │   │    │
      │   │    ├─ Validar: ¿producto?
      │   │    ├─ Validar: ¿inventoryStore?
      │   │    ├─ Validar: ¿materiales?
      │   │    │
      │   │    ├─ addExperience() → levelUp si aplica
      │   │    │
      │   │    ├─ [Si crafting]:
      │   │    │  └─ inventoryStore.removeItem(materiales)
      │   │    │
      │   │    ├─ toolsStore.calculateToolBonus() → xpBonus, quantityBonus
      │   │    │
      │   │    ├─ Calcular: finalQuantity = qty + quantityBonus
      │   │    │
      │   │    └─ [Si NO quemado]:
      │   │       └─ inventoryStore.addItem(producto, finalQuantity)
      │   │
      │   │    [Caso especial: QUEMADO]
      │   │    ├─ Consumir 1 tronco
      │   │    └─ Random drop: carbón (40%) o ceniza (20%)
      │   │
      │   │    └─ return result
      │   │
      │   ├─ if (result && skill.isActive)
      │   │   └─→ skillsStore.activateSkill() [RE-INICIAR]
      │   │       └─ cycleEndTime = now + duration
      │   │
      │   └─ else if (!result && skill.isActive)
      │       └─→ skillsStore.deactivateSkill(skill, true)
      │           └─ isActive = false, cycleEndTime preservado
      │
      └─ [Si timeRemaining > 0]
          └─ Esperar siguiente tick
```

### Flujo 3: Offline (App Reopen)

```
App.vue → onMounted()
  │
  ├─ gameStore.initializeGame()
  │   └─ Cargar todos stores desde localStorage
  │       └─ skillState.cycleEndTime restaurado
  │
  ├─ setTimeout(3000)
  │   │
  │   └─→ gameStore.calculateOfflineProgress()
  │        │
  │        ├─ lastActiveTime = localStorage['neornate_lastActiveTime']
  │        │
  │        ├─ offlineMs = now - lastActiveTime
  │        │   ├─ Limitar: max 2 horas
  │        │   └─ Umbral: min 5 segundos
  │        │
  │        └─→ FOR EACH skillState:
  │            │
  │            ├─ if (!currentProduct) skip
  │            │
  │            ├─ baseCycleDuration = SKILL_CONFIGS[skill].baseCycleDuration * 1000
  │            │
  │            ├─ toolBonus = toolsStore.calculateToolBonus(skill)
  │            │   └─ cycleDuration = max(500, baseDuration - speedBonus*1000)
  │            │
  │            ├─ timeUntilCycleCompletes = cycleEndTime - lastActiveTime
  │            │
  │            ├─ if (offlineMs >= timeUntilCycleCompletes)
  │            │   ├─ cyclesCompleted = 1
  │            │   └─ cyclesCompleted += floor((offlineMs - timeUntilCycleCompletes) / cycleDuration)
  │            │
  │            └─→ FOR i=0 TO cyclesCompleted:
  │                │
  │                ├─ if (no hay materiales) break
  │                │
  │                ├─ completeCycle(skill, inventory, resetTime=false)
  │                │   ├─ Procesar XP, items, materiales
  │                │   └─ NO resetear cycleEndTime (false)
  │                │
  │                └─ Acumular totalQuantity, totalXP
  │
  │        ├─ offlineHarvestSummary = { totalOfflineMs, skillHarvests }
  │        │
  │        └─ saveGame()
  │
  ├─ isLoading = false
  │
  ├─→ OfflineHarvestNotification muestra notificación
  │
  └─→ startGameLoop()
      └─ Game Loop activo comienza con nuevo cycleEndTime
```

---

## 🎛️ Parámetros Clave

| Parámetro | Tipo | Rango | Default | Notas |
|---|---|---|---|---|
| **GAME_LOOP_TICK** | number | ms | 100 | Frecuencia del game loop |
| **AUTO_SAVE_INTERVAL** | number | ms | 5000 | Frecuencia de guardado |
| **MAX_OFFLINE_TIME_MS** | number | ms | 7,200,000 | 2 horas máximo |
| **MIN_OFFLINE_TIME** | number | ms | 5000 | Umbral mínimo offline |
| **baseCycleDuration** | number | s | 5 | Por cada skill (en SKILL_CONFIGS) |
| **speedBonus** | number | s | 0 | Negativo = más rápido (herramienta) |
| **xpBonus** | number | % | 0 | Multiplicador XP (herramienta) |
| **quantityBonus** | number | items | 0 | Items adicionales (herramienta) |

---

## 🔍 Búsqueda Rápida de Funciones

### Funciones de Activación
```
activateSkill()          src/stores/skillsStore.ts:138
deactivateSkill()        src/stores/skillsStore.ts:176
```

### Funciones de Completar Ciclo
```
completeCycle()          src/stores/skillsStore.ts:187
addExperience()          src/stores/skillsStore.ts:102
levelUp()                src/stores/skillsStore.ts:118
```

### Funciones Offline
```
calculateOfflineProgress() src/stores/gameStore.ts:95
clearOfflineHarvestSummary() src/stores/gameStore.ts:275
```

### Funciones de Herramientas
```
calculateToolBonus()     src/stores/toolsStore.ts
equipTool()              src/stores/toolsStore.ts
unequipTool()            src/stores/toolsStore.ts
```

### Funciones de Inventario
```
addItem()                src/stores/inventoryStore.ts
removeItem()             src/stores/inventoryStore.ts
getItemQuantity()        src/stores/inventoryStore.ts
```

---

## 📍 Puntos de Entrada por Caso de Uso

### Caso: User activa skill
```
1. Component: MiningSkill.vue → handleActivateSkill()
2. Store: skillsStore.activateSkill()
3. State: skillState.isActive = true, cycleEndTime establecido
4. Siguiente: Game Loop detecta en ~100ms
```

### Caso: Game loop completa ciclo
```
1. App.vue: setInterval cada 100ms
2. Check: now >= cycleEndTime?
3. Call: skillsStore.completeCycle()
4. Update: inventoryStore, skillState.experience
5. Reinicio: skillsStore.activateSkill() si OK
```

### Caso: App se cierra y abre
```
1. App.vue → onMounted()
2. Load: initializeGame() desde localStorage
3. Calculate: calculateOfflineProgress()
4. Process: Múltiples completeCycle() offline
5. Notify: OfflineHarvestNotification
6. Start: Game Loop activo
```

### Caso: Falta de materiales
```
1. Game Loop: completeCycle() validación falla
2. Return: null
3. Condition: (!result && skill.isActive) = true
4. Action: deactivateSkill(skill, true)
5. Preserve: cycleEndTime se mantiene
6. User: Debe reactivar manualmente
```

---

## 🧭 Navegación del Código

Para entender X, leer en este orden:

### Entender el Game Loop
1. `src/App.vue` líneas 98-126
2. `src/stores/skillsStore.ts` función `completeCycle()`
3. `src/stores/skillsStore.ts` función `activateSkill()`

### Entender Offline
1. `src/stores/gameStore.ts` función `calculateOfflineProgress()`
2. Ejemplo en `src/App.vue` líneas 53-65

### Entender Bonuses
1. `src/stores/toolsStore.ts` función `calculateToolBonus()`
2. `src/stores/skillsStore.ts` líneas 155-162 (speedBonus)
3. `src/stores/skillsStore.ts` líneas 200-207 (xpBonus, quantityBonus)

### Entender Persistencia
1. `src/stores/skillsStore.ts` función `saveToLocalStorage()`
2. `src/stores/skillsStore.ts` función `loadFromLocalStorage()`
3. `src/stores/gameStore.ts` función `saveGame()`

---

## 🎯 Componentes Críticos

| Componente | Criticidad | Impacto si Falla |
|---|---|---|
| **gameLoopInterval** | CRÍTICA | Nada se procesa |
| **skillState.cycleEndTime** | CRÍTICA | Ciclos nunca se completan |
| **skillState.isActive** | CRÍTICA | Skill no entra en activeSkills |
| **inventoryStore en completeCycle()** | CRÍTICA | Crash si es null |
| **calculateOfflineProgress()** | ALTA | No se procesan ciclos offline |
| **toolBonus.speedBonus** | MEDIA | Herramientas no aceleran ciclos |
| **requiredMaterials validación** | MEDIA | Ciclos sin materiales se procesan |

---

**Referencias cruzadas**:
- 18-ANALISIS_GAME_LOOP.md (análisis detallado)
- 19-GAME_LOOP_QUICK_REFERENCE.md (guía rápida)
- 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (visualización)
- 21-DEBUGGING_GAME_LOOP.md (troubleshooting)
