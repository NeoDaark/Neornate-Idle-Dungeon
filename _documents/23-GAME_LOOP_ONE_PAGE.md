# ⚡ Game Loop: One-Page Reference

**Ubicación**: `src/App.vue` líneas 98-126 (y `src/stores/`)

---

## El Game Loop en 30 segundos

```javascript
// Corre cada 100ms en segundo plano
setInterval(() => {
  for (skill of activeSkills) {  // Computed que filtra isActive=true
    if (now >= skill.cycleEndTime) {
      completeCycle()  // Procesa item + XP
      
      if (success) {
        activateSkill()  // Reinicia automáticamente
      } else {
        deactivateSkill(preserveTime=true)  // Pausa
      }
    }
  }
}, 100)  // ms
```

---

## 3 Funciones Claves

### 1. `activateSkill(skill, product, duration)`
**Qué hace**: Inicia un ciclo
```
Entrada:  skill='mineria', product={...}, duration=5000ms
Acción:   isActive=true, cycleEndTime=now+duration
Salida:   Skill aparece en activeSkills
```

### 2. `completeCycle(skill, inventoryStore)`
**Qué hace**: Procesa ciclo completado
```
Validaciones:
  ❌ ¿Sin producto? → null
  ❌ ¿Sin materiales? → null
  ❌ ¿Sin inventoryStore? → null

Acciones:
  ✅ +XP (con bonus herramienta)
  ✅ Consumir materiales
  ✅ +Items (con bonus cantidad)

Retorna: result object o null
```

### 3. `calculateOfflineProgress()`
**Qué hace**: Procesa ciclos completados mientras app estaba cerrada
```
Trigger:  App reabre → onMounted
Calcula:  offlineMs = now - lastActiveTime
Procesa:  Múltiples completeCycle() en loop
Resultado: Notificación con resumen
```

---

## Estados de un Skill Activo

```
isActive = true  →  En activeSkills (game loop monitorea)
isActive = false →  NO en activeSkills (pausado)

cycleEndTime > 0 →  Ciclo en progreso (o pausado con estado preservado)
cycleEndTime = 0 →  Sin ciclo en progreso
```

---

## Timeline: 5 Segundos de Minería

```
t=0s    : User clickea → activateSkill(MINERIA, 5000)
          cycleEndTime = 0 + 5000 = 5000

t=0-5s  : Game loop ticks #1-50
          Cada tick: now < cycleEndTime? → NO, skip

t=5s    : Tick #50
          now (5000) >= cycleEndTime (5000)? → ✅ SÍ
          completeCycle() → +1 mineral, +10 XP
          activateSkill() → cycleEndTime = 5000 + 5000 = 10000

t=5-10s : Ticks #51-100
          now < cycleEndTime? → NO, skip

t=10s   : Tick #100
          completeCycle() nuevamente
          
[Se repite indefinidamente]
```

---

## Offline en 10 Minutos

```
App cerrada:  13:00 (cycleEndTime = 13:02)
App abre:     13:10 (offlineMs = 600,000ms)

Cálculo:
  Duración ciclo = 5,000ms
  Ciclos = 600,000 / 5,000 = 120 ciclos
  
Resultado:
  +120 minerales
  +1,200 XP
  [Automático, antes de que inicie game loop]
```

---

## Constantes Clave

```
GAME_LOOP_TICK = 100ms        // Frecuencia
AUTO_SAVE_INTERVAL = 5000ms   // Guardado
MAX_OFFLINE_TIME = 2 horas    // Límite
MIN_OFFLINE_TIME = 5 segundos // Umbral

BaseCycleDuration = 5s        // Cada skill
SpeedBonus tool = -1.5s       // Ejemplo
Final = max(500, 5000-1500) = 3500ms
```

---

## Flujo de Datos

```
MiningSkill.vue (UI)
    ↓ click activar
skillsStore.activateSkill()
    ↓ isActive=true, cycleEndTime=X
activeSkills (computed)
    ↓
Game Loop (100ms)
    ↓ now >= cycleEndTime?
skillsStore.completeCycle()
    ↓ XP + items + materiales
inventoryStore.addItem()
    ↓
skillsStore.activateSkill() [new cycle]
    ↓ cycleEndTime=Y
[LOOP]
```

---

## Checklist: ¿Funciona?

- [ ] `gameLoopInterval` está corriendo (100ms ticks)
- [ ] `activeSkills` contiene mi skill
- [ ] `cycleEndTime` > 0
- [ ] `currentProduct` existe
- [ ] `completeCycle()` retorna result (no null)
- [ ] `inventoryStore` se pasa a `completeCycle()`
- [ ] Items aparecen en inventario
- [ ] Skill se reinicia automáticamente
- [ ] `lastActiveTime` se guarda al cerrar app
- [ ] Offline se procesa antes de game loop inicia

---

## Problemas Rápidos

| Síntoma | Causa | Solución |
|---|---|---|
| Skill no se activa | isActive no se establece | Verificar activateSkill() |
| Ciclo no completa | cycleEndTime no se alcanza | Verificar Date.now() |
| Materiales no se consumen | requiredMaterials no validados | Verificar completeCycle() |
| Sin reinicio automático | currentProduct no existe | Verificar saveToLocalStorage() |
| Offline no procesa | cycleEndTime no guardado | Verificar saveGame() timing |
| Herramienta no acelera | Bonus no aplicado en activateSkill() | Reactivar skill |

---

## Líneas Críticas por Archivo

**App.vue**
- `98-126`: Game loop setInterval
- `53-65`: calculateOfflineProgress call
- `45-80`: Inicialización y timing

**skillsStore.ts**
- `138`: activateSkill() entrada
- `187`: completeCycle() entrada
- `176`: deactivateSkill() entrada
- `395-430`: saveToLocalStorage() entrada

**gameStore.ts**
- `95-280`: calculateOfflineProgress() completa

---

## Debug: Ver Estado Ahora

```javascript
// En browser console
const s = useSkillsStore()
const skill = s.skillStates['mineria']
console.log({
  isActive: skill.isActive,
  cycleEndTime: skill.cycleEndTime,
  timeRemaining: skill.cycleEndTime - Date.now(),
  product: skill.currentProduct?.id,
  inActiveSkills: s.activeSkills.map(x => x.skill)
})
```

---

## Documentación Completa

| Doc | Contenido |
|---|---|
| **18-ANALISIS_GAME_LOOP.md** | Análisis detallado, fórmulas, arquitectura |
| **19-GAME_LOOP_QUICK_REFERENCE.md** | Guía 5 minutos, ejemplos |
| **20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md** | Visualización, timelines |
| **21-DEBUGGING_GAME_LOOP.md** | Troubleshooting, testing |
| **22-MAPA_CODIGO_GAME_LOOP.md** | Ubicaciones de funciones |
| **23-GAME_LOOP_ONE_PAGE.md** | **← AQUÍ** |

---

**Última actualización**: 18 de febrero de 2026
**Mantener actualizado**: Si cambias game loop timing o lógica de ciclos
