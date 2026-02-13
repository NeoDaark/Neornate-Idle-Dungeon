# 🛌 Sistema de Farmeo Offline

## 📖 Descripción General

El **sistema offline** permite que los jugadores continúen generando recursos incluso cuando el juego está cerrado. Cuando reabre la app, se procesan automáticamente todos los ciclos de skills que se completaron mientras estuvo offline y se **muestra una notificación visual** con el resumen del farmeo.

---

## 🎯 Características Principales

### ✅ Implementado
1. **Cálculo de tiempo offline** - Compara `lastActiveTime` con `Date.now()`
2. **Procesamiento de ciclos** - Ejecuta automáticamente los ciclos completados
3. **Aplicación de bonuses** - Respeta bonuses de herramientas (velocidad, XP, cantidad)
4. **Persistencia** - Guarda estado de inventario, XP y items generados
5. **Validación de materiales** - En crafting, verifica si hay suficientes materiales
6. **✨ Notificación Visual** - Muestra UI elegante con resumen del farmeo offline

---

## � Notificación Visual

### Flujo
1. Usuario abre la app → `App.vue` se monta
2. Se cargan datos desde localStorage
3. Se muestra `LoadingOverlay` (componente inline, z-index: 10000)
   - Simula 3 segundos de carga con barra de progreso
   - Mensajes aleatorios de tips
4. Después de 3 segundos:
   - Se oculta `LoadingOverlay`
   - Se ejecuta `calculateOfflineProgress()` 
   - Se muestra `ResponsiveLayout` (layout principal)
5. Si hay ciclos completados, se guardan en `offlineHarvestSummary`
6. `OfflineHarvestNotification.vue` muestra la notificación automáticamente (z-index: 9999)
7. Usuario presiona "Continuar" o cierra (✕) para descartar

### Componente: `LoadingOverlay.vue`
- **Ubicación**: `src/components/layouts/LoadingOverlay.vue`
- **Props**: Ninguno
- **Timing**: Se muestra 3 segundos (setTimeout en App.vue)
- **Z-index**: 10000 (sobre todo)
- **Features**:
  - Barra de progreso animada
  - Mensajes de tips aleatorios
  - Spinner
  - Estadísticas de jugador
  - Animaciones suaves (slide, bounce)
  - Multiidioma (i18n)
- **Props**: Ninguno (usa `gameStore.offlineHarvestSummary`)
- **Transiciones**: Desliza hacia arriba con animación suave
- **Responsive**: Mobile-friendly con scroll
- **Multiidioma**: Soporta español e inglés (i18n)

### Datos Mostrados
```
┌─────────────────────────────────────┐
│ 💤 Farmeo mientras dormías           │ ← Título
├─────────────────────────────────────┤
│ Farmeaste durante: 1h 23m           │ ← Tiempo total offline
├─────────────────────────────────────┤
│ ⛏️ Minería                 | 45x +270 +3,150 XP
│ 🌲 Tala                    | 30x +180 +1,500 XP
│ 🔥 Fundición               | 12x +120 +600 XP
├─────────────────────────────────────┤
│           [Continuar]               │ ← Acción
└─────────────────────────────────────┘
```

### Estilos
- Tema oscuro: Gradiente `bg-card` + bordes primarios
- Animación: Slide-up 0.4s ease-out
- Badges de color:
  - **Verde** (Ciclos): Numero de ciclos completados
  - **Naranja** (Cantidad): Items generados
  - **Azul** (XP): Experiencia ganada

---

## �🏗️ Arquitectura

### Flow de Inicialización
```
App.vue onMounted()
  ↓
gameStore.initializeGame()          # Carga timestamps iniciales
  ↓
skillsStore.loadFromLocalStorage()  # Carga niveles, XP, estado de skills
inventoryStore.loadFromLocalStorage() # Carga items
  ↓
gameStore.calculateOfflineProgress() # ← NUEVO: Procesa farmeo offline
  ↓
gameStore.saveGame()                # Guarda estado actualizado
```

### Datos Persistidos

**localStorage keys**:
- `neornate_skills` - Estado de cada skill (nivel, XP, producto activo, timestamps)
- `neornate_lastActiveTime` - Timestamp Unix de última actividad (guardado en `saveGame()`)
- `neornate_inventory` - Items del inventario
- `neornate_player` - Datos del jugador
- `neornate_tools` - Herramientas equipadas

---

## 📐 Algoritmo de Cálculo

### Pasos

1. **Obtener timestamp de última actividad**
   ```typescript
   const lastActiveTime = localStorage.getItem('neornate_lastActiveTime')
   const offlineMs = now - lastActiveTime
   ```

2. **Por cada skill activo:**
   - Obtener duración del ciclo base: `skillState.currentProduct.cycleDuration * 1000` (ms)
   - Aplicar bonus de herramienta: `cycleDuration -= speedBonus * 1000`
   - Calcular tiempo disponible: `offlineMs + tiempoRestanteDelCiclo`
   - Ciclos completados: `Math.floor(timeAvailable / cycleDuration)`

3. **Procesar cada ciclo:**
   ```typescript
   for (let i = 0; i < cyclesCompleted; i++) {
     const result = skillsStore.completeCycle(skill, inventory)
     // - Suma XP (con bonus de herramienta)
     // - Añade items al inventario (con bonus de cantidad)
     // - Consume materiales si es crafting
   }
   ```

4. **Actualizar cycleEndTime:**
   ```typescript
   const timeUsedByCompletedCycles = cyclesCompleted * cycleDuration
   const remainingTime = totalTimeAvailable - timeUsedByCompletedCycles
   skillState.cycleEndTime = now + (cycleDuration - remainingTime)
   ```

### Ejemplo Numérico

**Escenario:**
- Skill: Minería (Carbón)
- Duración base: 3 segundos (3000 ms)
- Herramienta: Pico Oxidado (+5% velocidad = -150 ms)
- Ciclo activo cuando se cierra: 2 ciclos 50% completados
- Tiempo offline: 1 minuto (60,000 ms)

**Cálculo:**
```
cycleDuration = 3000 - 150 = 2850 ms
timeInProgressAtClose = (2.5 * 2850) - 60000 = 7125 - 60000 = -52875 ms
                       → MAX(0, -52875) = 0
totalTimeAvailable = 60000 + 0 = 60000 ms
cyclesCompleted = FLOOR(60000 / 2850) = 21 ciclos
timeUsedByCompletedCycles = 21 * 2850 = 59850 ms
remainingTime = 60000 - 59850 = 150 ms
cycleEndTime = ahora + (2850 - 150) = ahora + 2700 ms
```

→ **Resultado**: Se generaron 21 carbones, 21 * XP base + bonus herramienta

---

## ⚙️ Detalles Técnicos

### Umbrales y Límites
- **Mínimo para procesar offline**: 5 segundos
  - Evita procesamiento innecesario en tests o refreschs rápidos
- **Máximo tiempo offline procesado**: 2 horas (7,200,000 ms)
  - Si el usuario estuvo offline >2 horas, solo se procesan 2 horas
  - Previene abuso y lag por procesamiento de ciclos enormes
  - Future: Items/bonuses pueden aumentar este límite

### Bonuses Aplicados
El `completeCycle()` automáticamente aplica:

| Bonus | Fuente | Efecto |
|-------|--------|--------|
| `speedBonus` | Herramienta | Reduce duración de ciclo (segundos) |
| `xpBonus` | Herramienta | Multiplica XP ganada |
| `quantityBonus` | Herramienta | Suma items adicionales |
| `rarityBonus` | Herramienta | *(No implementado)* Aumenta rarity |
| `discountBonus` | Herramienta | *(No implementado)* Descuentos mercado |

### Validaciones
- ✅ Se valida que `currentProduct` existe
- ✅ Se valida que el skill estaba activo (`isActive === true`)
- ✅ Se valida que hay materiales (para crafting)
- ✅ Se ignoran skills sin progreso visible

---

## 🔄 Flujo de Guardado

```
User deja la app o cierra el navegador
  ↓
onUnmounted() en App.vue
  ↓
gameStore.saveGame()
  ↓
 - playerStore.saveToLocalStorage()
 - inventoryStore.saveToLocalStorage()
 - skillsStore.saveToLocalStorage()
 - marketStore.saveToLocalStorage()
 - toolsStore.saveToStorage()
 - localStorage.setItem('neornate_lastActiveTime', now)
```

Esto ocurre **cada 30 segundos** automáticamente (auto-save) y cuando:
- El usuario cierra la app
- El usuario navega a otra sección
- La página se recarga

---

## 🧪 Testing

### Caso 1: Offline Simple (Minería)
1. Activar Minería con Carbón
2. Esperar ~1 segundo
3. Cerrar tab/app
4. Esperar 30 segundos real
5. Reabrir → Deberías ver carbones añadidos

### Caso 2: Con Bonus de Herramienta
1. Equipar Pico Oxidado (+5% velocidad)
2. Activar Minería
3. Cerrar app
4. Esperar 1 minuto
5. Reabrir → Deberías ver más ciclos de lo normal

### Caso 3: Crafting Offline
1. Activar Herrería (requiere lingotes)
2. Tener suficientes lingotes guardados
3. Cerrar app, esperar
4. Reabrir → Lingotes consumidos, armas creadas

### Caso 4: Edge Case - No Hay Materiales
1. Activar Fundición (requiere carbón)
2. Limpiar inventario (0 carbón)
3. Cerrar app, esperar
4. Reabrir → No se procesan ciclos, se mantiene estado activo

---

## 📝 Ejemplo de Logs

Cuando se carga el juego después de offline:

```
[Offline] Procesando 62345ms de farmeo offline
[Offline] Skill MINERIA: 21 ciclos completados
[Offline] +14 carbon, +525 XP
[Offline] +14 carbon, +525 XP
...
[Offline] +14 carbon, +525 XP
[Game] Auto-save realizado
```

---

## � Mejoras Futuras

1. **Aumentar Límite con Items**
   - Item: "Cristal del Tiempo" → +1 hora offline
   - Item: "Amuleto de Eternidad" → +3 horas offline
   
2. **Notificación de Cap Alcanzado**
   - Si offline > 2 horas: Mostrar "Farmeaste el máximo permitido (2h)"
   
3. **Bonuses de Herramienta para Offline**
   - Nuevas propiedades: `offlineMultiplier` (ej: +50% recursos offline)
   
4. **Premium Feature**
   - Suscripción de 7 días → Sin límite de offline
   - O aumentar a 8 horas con suscripción

5. **Rate Limiting Visual**
   - Si hay >1000 ciclos, mostrar popup: "¡Wow! Farmeaste mucho"
   - Evitar lag por procesamiento masivo

---

## �🐛 Known Issues & Limitaciones

### ⚠️ Limitación: Energía/Stamina
Actualmente **NO hay sistema de energía**, así que los jugadores pueden farmear indefinidamente offline.
- Future: Implementar "cap" de resources offline (ej. max 1 hora de farmeo)

### ⚠️ Limitación: Materiales Limitados
Si los materiales requeridos se acaban durante offline:
- La skill se detiene automáticamente
- El jugador necesita recolectar más materiales manualmente

### ⚠️ Edge Case: Múltiples Skills Activos
Si el usuario hubiera dejado múltiples skills activos (manualmente), todos se procesan en paralelo.
- Esto es **correcto**, pero no es viable en la UI (solo 1 skill visible a la vez)

---

## 🚀 Mejoras Futuras

1. **Energy System**: Limitar offline a N horas/día
2. **Afk Cap**: "Puedes farmear max 8 horas offline"
3. **Notifications**: Notificar cuánto se farmeo (`+500 carbón mientras dormías`)
4. **Rate Limiting**: No procesar si hay >1000 ciclos (prevenir lag)
5. **Leaderboards**: "Total offline farming this week"

---

**Última actualización**: 13 de febrero de 2026  
**Versión**: 1.0.2 (Con límite de 2 horas offline)
**Estado**: ✅ Implementado y Visible al Usuario

---

## 📋 Archivos Modificados

### Stores
- `src/stores/gameStore.ts`:
  - Agregado: `MAX_OFFLINE_TIME_MS` = 2 horas (7,200,000 ms)
  - Agregado: `offlineHarvestSummary` ref
  - Agregado: `clearOfflineHarvestSummary()` action
  - Actualizado: `calculateOfflineProgress()` para:
    - Limitar tiempo offline a máximo 2 horas
    - Acumular estadísticas de farmeo
    - Log si se alcanza el límite

### Componentes
- `src/components/layouts/LoadingOverlay.vue` (NUEVO):
  - Loading overlay inline (sin rutas)
  - Se muestra 3 segundos al iniciar
  - Z-index: 10000

- `src/components/notifications/OfflineHarvestNotification.vue` (NUEVO):
  - Notificación visual de farmeo offline
  - Teleport a body para evitar z-index issues
  - Transiciones suaves
  - Responsive design
  - **Fix**: Se usa `skills.${skill}.name` para traducción correcta
  - **Fix**: z-index aumentado a 9999 para asegurar que está sobre todo

### App
- `src/App.vue`:
  - Agregado import de `LoadingOverlay` y `OfflineHarvestNotification`
  - Estado `isLoading` ref (comienza en true)
  - Renderizado condicional: muestra `LoadingOverlay` si `isLoading` es true
  - Después de 3 segundos: ejecuta `calculateOfflineProgress()` y oculta loading
  - Removida lógica de router guard (ya no necesaria)

### i18n
- `src/locales/es.json`:
  - Agregado: `ui.continue`
  - Agregado: `notifications.*` (offlineHarvest, farmedFor)

- `src/locales/en.json`:
  - Agregado: `ui.continue`
  - Agregado: `notifications.*` (offlineHarvest, farmedFor)

---

**Última actualización**: 13 de febrero de 2026  
**Versión**: 1.0.1 (Con notificación visual)
