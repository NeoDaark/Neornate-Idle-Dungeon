# 🎮 Game Loop: Cheat Sheet Visual

Print this or keep open while coding.

---

## WHERE IS IT?

```
src/App.vue
  ↓ onMounted (línea 45)
    ├─ gameStore.initializeGame()
    ├─ setTimeout(3000)
    │  └─ gameStore.calculateOfflineProgress()
    │
    └─ startGameLoop() (línea 98)
       ├─ setInterval(100ms) ← AQUÍ ESTÁ
       │  └─ skillsStore.completeCycle()
       │
       └─ setInterval(5000ms)
          └─ gameStore.saveGame()
```

---

## WHAT HAPPENS

```
USER CLICKS "ACTIVATE"
       ↓
activateSkill()
  • isActive = true
  • cycleEndTime = now + 5000
       ↓
GAME LOOP EVERY 100ms
  ↓ now >= cycleEndTime? NO → wait
  ↓ now >= cycleEndTime? YES ↓
completeCycle()
  • +1 item
  • +10 XP
  • return result
       ↓
  ✅ result && isActive?
     → activateSkill() AGAIN ↻
  ❌ !result && isActive?
     → deactivateSkill(preserve=true) ⏸
```

---

## 3 FUNCTIONS

| Name | File | Does |
|---|---|---|
| **activateSkill** | skillsStore.ts:138 | Starts cycle: `cycleEndTime = now + duration` |
| **completeCycle** | skillsStore.ts:187 | Process: `+item, +XP, validate materials` |
| **calculateOfflineProgress** | gameStore.ts:95 | Offline: `multiple completeCycle() in loop` |

---

## KEY VARIABLES

```
skillState {
  isActive: true/false        ← Game loop only processes if TRUE
  cycleEndTime: 1708346125000 ← Timer: now >= this? Execute!
  currentProduct: {...}       ← What to produce
  level: 50                    ← XP tracking
  experience: 1250             ← XP progress
}

GAME_CONSTANTS {
  GAME_LOOP_TICK: 100          ← Check every 100ms
  AUTO_SAVE_INTERVAL: 5000     ← Save every 5s
}
```

---

## CYCLE TIMING

| Time | Event |
|---|---|
| t=0s | User activates → `cycleEndTime = 5000` |
| t=0-5s | Game loop ticks → `now < cycleEndTime` → skip |
| t=5s | Game loop tick → `now >= cycleEndTime` → execute |
| t=5s | completeCycle() → +1 item, +10 XP |
| t=5s | activateSkill() → `cycleEndTime = 10000` |
| t=5-10s | Repeat |

---

## OFFLINE MATH

```
App closes at t=0s
App opens at t=600s (10 minutes later)

offlineMs = 600,000ms
cycleDuration = 5,000ms
cycles = 600,000 / 5,000 = 120

Result: +120 items, +1200 XP (calculated before game loop starts)
```

---

## BONUS FORMULA

```
Tool with speedBonus = -1.5s

cycleDurationMs = max(500, baseDuration - speedBonus * 1000)
                = max(500, 5000 - (-1500))
                = max(500, 5000 + 1500)  ← ⚠️ Wait, this is wrong
                
Actually:
                = max(500, 5000 - 1500)
                = max(500, 3500)
                = 3500ms  ← 1.5s faster ✓
```

---

## PROBLEM SOLVING

```
"Skill won't activate"
└─ Check: isActive = true after activateSkill()?

"Cycles not completing"
└─ Check: now >= cycleEndTime on game loop tick?
  └─ Check: activeSkills contains the skill?

"No items appearing"
└─ Check: completeCycle() returns result (not null)?
  └─ Check: inventoryStore.addItem() called?

"Not restarting automatically"
└─ Check: if (result && skill.isActive) is TRUE?
  └─ Check: currentProduct exists?

"Offline cycles not processing"
└─ Check: cycleEndTime > 0 in localStorage?
  └─ Check: offlineMs >= 5000 (min threshold)?
  └─ Check: currentProduct exists?
```

---

## CONSOLE TRICKS

```javascript
// See skill state RIGHT NOW
const s = useSkillsStore()
console.log(s.skillStates['mineria'])

// See what game loop will process
console.log(s.activeSkills)

// Manual cycle test
s.completeCycle('mineria', inventoryStore)

// Simulate offline (10 min ago)
localStorage.setItem('neornate_lastActiveTime', 
  Date.now() - 600000)
```

---

## CONSTANTS

```
GAME_LOOP_TICK        100ms    (how often game loop runs)
AUTO_SAVE_INTERVAL    5000ms   (how often to save)
MAX_OFFLINE_TIME      2 hours  (limit processed offline)
MIN_OFFLINE_TIME      5 sec    (minimum to process)

baseCycleDuration     5 sec    (all skills default)
speedBonus range      -N sec   (tool improvement)
```

---

## FLOW DIAGRAM

```
┌──────────────────────────────────────────────┐
│ User Activates Skill (UI Click)             │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
          ┌────────────────────┐
          │ activateSkill()    │
          │ isActive = true    │
          │ cycleEndTime = X   │
          └────────┬───────────┘
                   │
                   ▼
          ┌────────────────────┐
          │ Game Loop (100ms)  │
          │ now >= X?          │
          └────────┬───────────┘
                   │
         ┌─────────┴─────────┐
         NO (wait)          YES
         │                   │
        skip                 ▼
         │          ┌──────────────────┐
         │          │ completeCycle()  │
         │          │ +item, +XP       │
         │          └────────┬─────────┘
         │                   │
         │          ┌────────┴──────────┐
         │          │                   │
         │       success             fail
         │          │                  │
         │          ▼                  ▼
         │  activateSkill() deactivateSkill()
         │  (new cycle)    (pause, preserve)
         │          │                  │
         └──────────┴──────────────────┘
                    │
              [LOOP BACK TO
               GAME LOOP]
```

---

## QUICK CHECKLIST

- [ ] Game loop running? → Check DevTools (console) every 100ms
- [ ] Skill in activeSkills? → Check `useSkillsStore().activeSkills`
- [ ] cycleEndTime set? → Check `skillState.cycleEndTime > 0`
- [ ] Passing inventoryStore? → Check completeCycle(skill, inventory)
- [ ] Materials available? → Check inventory.getItemQuantity()
- [ ] Results OK? → Check completeCycle() returns object (not null)
- [ ] Restarting? → Check activateSkill() called after completeCycle()
- [ ] Offline processed? → Check offlineHarvestSummary exists

---

## REFERENCE DOCS

| Doc | Purpose |
|---|---|
| 23-GAME_LOOP_ONE_PAGE | 1-page summary |
| 19-GAME_LOOP_QUICK_REFERENCE | 5-min guide |
| 18-ANALISIS_GAME_LOOP | Deep dive (30+ min) |
| 20-DIAGRAMAS_SECUENCIA_GAME_LOOP | Flowcharts + timelines |
| 21-DEBUGGING_GAME_LOOP | Troubleshooting |
| 22-MAPA_CODIGO_GAME_LOOP | Code locations |
| **00-INDICE_GAME_LOOP** | **Navigation guide** |

---

**Print & Tape to Monitor** 📌
