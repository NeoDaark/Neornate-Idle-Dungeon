# 🎯 Guía Rápida: Game Loop en 5 Minutos

## Dónde está el Game Loop

📍 **`src/App.vue`, líneas 98-126**

```vue
gameLoopInterval = setInterval(() => {
  // ⏰ Se ejecuta cada 100ms
  const activeSkills = skillsStore.activeSkills
  
  activeSkills.forEach(skill => {
    const now = Date.now()
    
    if (skill.cycleEndTime > 0 && now >= skill.cycleEndTime) {
      // ✅ Tiempo de ciclo completado
      const result = skillsStore.completeCycle(skill.skill, inventoryStore)
      
      if (result && skill.isActive) {
        // Reiniciar automáticamente
        skillsStore.activateSkill(...)
      }
    }
  })
}, 100)  // GAME_CONSTANTS.GAME_LOOP_TICK
```

---

## El Flujo en 4 Pasos

### 1️⃣ ACTIVAR (Usuario hace click)
```
[Component: MiningSkill.vue]
  ↓
  skillsStore.activateSkill(Skill.MINERIA, product, 5000)
  
  ✅ Resultado:
    - skillState.isActive = true
    - skillState.cycleEndTime = now + 5000ms
    - El skill aparece en activeSkills (computed)
```

### 2️⃣ MONITOREAR (Game Loop cada 100ms)
```
[Game Loop cada 100ms]
  ↓
  activeSkills.forEach(skill => {
    if (now >= skill.cycleEndTime) {
      // Entrar aquí cuando se cumpla el tiempo
    }
  })
```

### 3️⃣ COMPLETAR (Procesar ciclo)
```
skillsStore.completeCycle(skill, inventoryStore)
  ↓
  Validaciones:
    ❌ ¿Sin producto? → retornar null
    ❌ ¿Sin materiales? → retornar null
    ❌ ¿Sin inventoryStore? → retornar null
  ✅ Todas OK:
    1. Agregar XP (con bonus de herramienta)
    2. Consumir materiales si aplica
    3. Agregar items al inventario
    4. Retornar resultado
```

### 4️⃣ REINICIAR (Automático)
```
if (result && skill.isActive) {
  skillsStore.activateSkill(skill, product, duration)
}
// cycleEndTime se recalcula
// Loop continúa indefinidamente
```

---

## Duración de Ciclos

| Config | Valor |
|---|---|
| Base por skill | 5 segundos |
| Con herramienta speedBonus +1.5s | 3.5 segundos |
| Mínimo (hard limit) | 500ms |

```
cycleDurationMs = max(500, 5000 - speedBonus*1000)
```

---

## Constantes Importantes

```typescript
GAME_LOOP_TICK: 100        // ms entre checks
AUTO_SAVE_INTERVAL: 5000   // ms para guardar
MAX_OFFLINE_TIME: 2h       // Máximo farmeo offline
MIN_OFFLINE_TIME: 5s       // Mínimo para procesar offline
```

---

## Estado de un Skill Activo

```typescript
{
  isActive: true                    // ← Clave: debe ser true
  cycleEndTime: 1708346125000      // ← Clave: timestamp cuando termina
  currentProduct: {                 // ← Qué se está produciendo
    id: 'mineral-cobre',
    quantity: 1,
    xpReward: 10,
    requiredMaterials: []
  }
}
```

**El game loop monitorea `cycleEndTime` cada 100ms.**

---

## ¿Qué Pasa Si Falla completeCycle?

### Escenario: Herrería requiere lingotes, pero no hay

```
completeCycle() retorna null ❌
  ↓
Game Loop evalúa: if (result && skill.isActive)
  → false && true = false
  → Entra en: else if (!result && skill.isActive)
    ↓
    deactivateSkill(skill, true)  // true = preservar cycleEndTime
    
Resultado:
  - skill.isActive = false (pausa visual)
  - skill.cycleEndTime se mantiene
  - Cuando usuario agrega lingotes → puede reactivar manual

Offline:
  Si se reabre app con herrería pausada:
  - cycleEndTime se restaura desde localStorage
  - Si hay materiales ahora → procesa ciclos offline
```

---

## Timeline: Primer Ciclo

```
t=0ms:     User activa MINERIA
           → activateSkill(MINERIA, product, 5000)
           → cycleEndTime = 0 + 5000 = 5000

t=100ms:   Game loop tick #1
           now (100) >= cycleEndTime (5000)? ❌ No
           
t=200ms:   Game loop tick #2
           now (200) >= cycleEndTime (5000)? ❌ No
           
...

t=5000ms:  Game loop tick #50
           now (5000) >= cycleEndTime (5000)? ✅ SÍ
           → completeCycle(MINERIA, inventoryStore)
           → Agregar mineral + XP
           → skill.isActive aún es true
           → activateSkill() nuevamente
           → cycleEndTime = 5000 + 5000 = 10000

t=5100ms:  Game loop tick #51
           now (5100) >= cycleEndTime (10000)? ❌ No
           
...

[El loop continúa indefinidamente]
```

---

## Offline: Cuando App Cierra y Abre

```
App cerrado: 13:00 (lastActiveTime = 1708346040000)
  - MINERIA activo con cycleEndTime = 1708346120000 (13:02)

App reabierto: 13:10 (now = 1708346640000)
  - offlineMs = 600,000ms (10 minutos)

calculateOfflineProgress():
  timeUntilCycleCompletes = 1708346120000 - 1708346040000 = 80,000ms
  offlineMs (600,000) >= 80,000? ✅ SÍ
  
  → Ciclo en progreso: 1 completado
  → Ciclos adicionales: floor((600,000 - 80,000) / 5000) = 104
  → Total: 105 ciclos completados
  
  Si cada ciclo da 1 mineral + 10 XP:
  → 105 minerales + 1050 XP ganados automáticamente
  
  Nuevo cycleEndTime:
  = now + (5000 - (520,000 % 5000))
  = 1708346640000 + 5000
  = 1708346645000

Luego:
  - Mostrar notificación OfflineHarvestNotification
  - Game loop activo comienza
  - Continúa con nuevo cycleEndTime
```

---

## Checklist: Ciclo Completo

- [ ] User clickea "Activar" en componente
- [ ] Component llama `skillsStore.activateSkill(skill, product, duration)`
- [ ] `activeSkills` se actualiza (computed)
- [ ] Game loop detecta skill en `activeSkills`
- [ ] Game loop monitorea `cycleEndTime` cada 100ms
- [ ] Cuando `now >= cycleEndTime`
- [ ] Game loop llama `completeCycle()`
- [ ] `completeCycle()` valida, consume, agrega items
- [ ] Si OK → Game loop re-activa automáticamente
- [ ] Si ERROR (sin materiales) → Game loop pausa (preserva state)
- [ ] Auto-save cada 5 segundos guarda `cycleEndTime`
- [ ] Si app cierra → `calculateOfflineProgress()` procesa cuando reabre
- [ ] Ciclo se repite indefinidamente

---

## Bucle Cerrado: Pseudo-Código

```python
# Game Loop (runs every 100ms in App.vue)
while app_is_active:
    wait(100ms)
    
    for skill in activeSkills:
        now = Date.now()
        
        if skill.cycleEndTime > 0 AND now >= skill.cycleEndTime:
            result = skill_store.completeCycle(skill)
            
            if result and skill.isActive:
                # Re-activate automáticamente
                skill_store.activateSkill(skill, product, duration)
            elif not result and skill.isActive:
                # Pausar (preservar estado)
                skill_store.deactivateSkill(skill, preserveTime=True)
```

```python
# Auto-save (runs every 5 seconds)
every 5s:
    save_all_stores_to_localStorage()
```

```python
# Offline (runs on app open)
on_app_open():
    offlineMs = now - lastActiveTime
    
    for skill in all_skills:
        if skill.currentProduct:
            cyclesCompleted = floor(offlineMs / skill.cycleTime)
            
            for i in range(cyclesCompleted):
                if has_materials(skill):
                    completeCycle(skill, preserveTime=False)
                else:
                    break
            
            update_cycleEndTime(skill)
    
    show_notification_with_summary()
```

---

## Debugging

### Ver si skill está activo
```javascript
// En console mientras juego está abierto
const { useSkillsStore } = await import('@/stores/skillsStore.ts')
const store = useSkillsStore()
console.log(store.activeSkills)
```

### Ver cycleEndTime de un skill
```javascript
const store = useSkillsStore()
const miningState = store.skillStates['mineria']
console.log({
  isActive: miningState.isActive,
  cycleEndTime: miningState.cycleEndTime,
  product: miningState.currentProduct?.id,
  timeRemaining: miningState.cycleEndTime - Date.now()
})
```

### Simular offline manualmente
```javascript
// 1. Cambiar lastActiveTime en localStorage
localStorage.setItem('neornate_lastActiveTime', Date.now() - 600000)  // 10 min atrás

// 2. Cerrar y abrir app
// calculateOfflineProgress() se ejecutará automáticamente
```

---

**Quick Reference**: 18-ANALISIS_GAME_LOOP.md para análisis detallado
