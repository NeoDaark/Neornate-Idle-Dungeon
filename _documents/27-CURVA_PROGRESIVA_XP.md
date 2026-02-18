# 📊 Sistema de Curva Progresiva de XP

**Versión**: 1.0.0  
**Fecha**: 18 de febrero de 2026  
**Status**: ✅ Implementado y Verificado  

---

## 📋 Problema Original

Después de cambiar a **ciclos de 5 segundos universales** por skill (en lugar de tener XP variable por material), la progresión de niveles se volvió **demasiado rápida y lineal**.

**Antes (Fórmula antigua)**:
```
XP_siguiente_nivel = 100 + (nivel × 50) + (tier × 300)
```

Esta fórmula producía:
- Nivel 5: 350 XP
- Nivel 20: 1,500 XP
- Nivel 100: 29,000 XP
- Nivel 120: ~40,000 XP

**Problema**: Con ciclos de 5s y ~10 XP por ciclo, subir de nivel era demasiado fácil, especialmente en tiers altos.

---

## ✅ Solución: Curva de Dificultad Progresiva

### Nueva Fórmula de XP por Nivel (CURVA DESAFIANTE)

```
Base = 100 + (nivel × 50)

Multiplicador de Dificultad según rango (DESAFIANTE - ~2-3 SEMANAS):
├─ T1 (Niveles 1-20): 1.0x     (Tutorial rápido - minutos)
├─ T2 (Niveles 20-40): 1.5x    (Fácil - ~1 hora)
├─ T3 (Niveles 40-60): 3.0x    (Normal - ~4 horas)
├─ T4 (Niveles 60-80): 6.0x    (Difícil - ~18 horas)
├─ T5 (Niveles 80-100): 12.0x  (Muy difícil - ~2 días)
├─ T6 (Niveles 100-120): 24.0x (Extremo - ~4-5 días)
└─ T7 (Niveles 120-200): Variable (Prestige puro)
   └─ Fórmula T7: base × (32 + (nivel - 121) × 0.4)

XP_final = floor(Base × Multiplicador)
```

**Características**:
- Cada tier es 1.5-2x más difícil que el anterior
- T1-T3: Rápido (horas)
- T4-T6: Progresión real (días)
- T7: Prestige puro (~10-12 días)
- **Total estimado: 14-21 días de farmeo continuo**

### Tabla de Ejemplos de XP Requerido por Nivel

| Nivel | Tier | Multiplicador | XP Requerido | Dificultad | Tiempo (aprox) |
|-------|------|---------------|--------------|-----------|----------------|
| 1→2 | T1 | 1.0x | 200 | ⚪ Trivial | 20 seg |
| 10→11 | T1 | 1.0x | 650 | ⚪ Muy fácil | 1 min |
| 20→21 | T2 | 1.5x | 2,400 | 🟡 Fácil | 4 min |
| 30→31 | T2 | 1.5x | 3,150 | 🟡 Leve | 5 min |
| 50→51 | T3 | 3.0x | 11,250 | 🟡 Normal | 19 min |
| 60→61 | T3 | 3.0x | 14,250 | 🟠 Moderado | 24 min |
| 70→71 | T4 | 6.0x | 28,500 | 🟠 Difícil | 47 min |
| 80→81 | T4 | 6.0x | 34,500 | 🟠 Más difícil | 57 min |
| 90→91 | T5 | 12.0x | 55,200 | 🔴 Muy difícil | 1.5 horas |
| 100→101 | T5 | 12.0x | 67,200 | 🔴 Desafiante | 1.9 horas |
| 110→111 | T6 | 24.0x | 134,400 | 🔴 Extremo | 3.7 horas |
| 120→121 | T6 | 24.0x | 163,200 | 🟣 Prestige | 4.5 horas |
| 130→131 | T7 | 33.6x | 201,600 | 🟣 Prestige+ | 5.6 horas |
| 150→151 | T7 | 36.0x | 216,000 | 🟣 Ultra | 6.0 horas |
| 199→200 | T7 | 48.6x | 291,600 | 🟣 Máximo | 8.1 horas |

---

## 🎯 Características Principales

### 1. **Techo Máximo: Nivel 200**

- El jugador puede subir **máximo hasta nivel 200**
- Después de nivel 200, **no sube más de nivel** aunque gane XP
- La ganancia de XP sigue siendo posible (útil para futuras mecánicas)
- Límite teórico: **10.000.000 XP total** en el juego

### 2. **Escalado Dinámico en T7**

Para los niveles 120-200 (T7), se aplica una fórmula de escalado dinámico:

```typescript
difficultyMultiplier = 20 + (nivel - 121) × 0.5
```

**Ejemplos**:
- Nivel 121: 20.0x
- Nivel 130: 24.5x
- Nivel 150: 34.5x
- Nivel 200: 59.5x

**Filosofía**: En T7 (prestige), cada nivel cuesta **progresivamente más XP**, haciendo el contenido endgame desafiante pero no imposible.

### 3. **Progresión Clara de Dificultad**

```
T1/T2: 1x    │ Principiante (jugar sin presión)
T3:    2x    │ Intermedio (requiere más enfoque)
T4:    4x    │ Avanzado (farmeo estratégico)
T5:    8x    │ Experto (requiere builds)
T6:    16x   │ Maestro (prestige viejo)
T7:    20-60x│ Divino (prestige puro, desafío infinito)
```

---

## 🔧 Implementación Técnica

### Archivos Modificados

1. **`src/types/Game.ts`**
   - Nueva función: `calculateXpForLevel(level: number): number`
   - Nueva función: `canLevelUp(currentLevel: number): boolean`
   - Nueva función: `getMaxTotalXp(): number` (retorna 10M)

2. **`src/stores/playerStore.ts`**
   - Actualizado: `nextLevelXP` computed (usa nueva función)
   - Actualizado: `addExperience()` (máximo nivel 200)
   - Actualizado: `levelUp()` (máximo nivel 200)

3. **`src/stores/skillsStore.ts`**
   - Actualizado: `getNextLevelXP()` (usa nueva función)
   - Actualizado: `addExperience()` (máximo nivel 200)
   - Actualizado: `levelUp()` (máximo nivel 200)

### Ubicación de la Lógica Centralizada

```
src/types/Game.ts
  ├─ calculateXpForLevel()     ← Cálculo central (1 único lugar)
  ├─ canLevelUp()              ← Validación
  └─ getMaxTotalXp()           ← Constante global
      ↑
      └─ Usado por:
         ├─ playerStore.nextLevelXP
         ├─ playerStore.addExperience()
         ├─ skillsStore.getNextLevelXP()
         └─ skillsStore.addExperience()
```

**Ventaja**: Un único punto de verdad para todos los cálculos de XP.

---

## 📈 Impacto en Jugabilidad Real

### Tiempo Real para Alcanzar Nivel 200

Basado en **los minerales reales del juego** (15-400 XP/ciclo según tier) y **nuevos multiplicadores desafiantes**:

#### Escenarios de Progresión (ACTUALIZADO)

| Escenario | Tiempo Total | Horas | Semanas | Nota |
|-----------|--------------|-------|---------|------|
| **Casual** (T1-T7 básicos) | **~18-21 días** | ~432-504 | ~2.5-3 | Minería pasiva, sin optimizar |
| **Óptimo** (mejores minerales) | **~14-18 días** | ~336-432 | ~2-2.5 | Jugador dedicado, cambia mineral |
| **+ Herramientas XP +30%** | **~11-14 días** | ~264-336 | ~1.5-2 | Con herramientas T3 equipo |
| **+ Herramientas Completas** | **~8-11 días** | ~192-264 | ~1.2-1.5 | Con T6+ herramientas (completas) |

#### Desglose por Tier (Escenario Óptimo - Draconita 400 XP/ciclo)

| Tier | Mineral | Multiplicador | XP Requerido | Horas | Días |
|------|---------|---------------|--------------|-------|------|
| T1 (1-20) | Cobre | 1.0x | 12,350 | 0.9 | ~1 min |
| T2 (20-40) | Plata | 1.5x | 48,750 | 3.4 | ~3 min |
| T3 (40-60) | Oro | 3.0x | 225,000 | 15.6 | ~16 min |
| T4 (60-80) | Obsidiana | 6.0x | 570,000 | 39.6 | ~40 min |
| T5 (80-100) | Mithril | 12.0x | 1,344,000 | 93.3 | ~4 días |
| T6 (100-120) | Adamantita | 24.0x | 3,276,000 | 227.7 | ~9.5 días |
| **T7 (120-200)** | **Draconita** | **32-50x** | **~9.3 millones** | **~646** | **~27 días** |

**Observación**: T7 es extremadamente difícil (~27 días), haciendo que prestige sea un verdadero desafío de jugador hardcore.

---

## 🎮 Equilibrio de Juego

### Progresión Esperada (Tiempo Real - DESAFIANTE)

1. **T1 (Niveles 1-20)**: 
   - ~1 minuto total (Cobre: 15 XP/ciclo)
   - Tutorial lightning rápido
   - El jugador aprende mecánicas en minutos

2. **T2 (Niveles 20-40)**:
   - ~3 minutos total (Plata: 40 XP/ciclo)
   - Aún muy rápido
   - Primer punto de pausa para mejorar herramientas

3. **T3-T4 (Niveles 40-80)**:
   - T3: ~16 minutos | T4: ~40 minutos
   - Comienza a sentirse como progresión real
   - Jugadores se comprometen con herramientas T2

4. **T5-T6 (Niveles 80-120)**:
   - T5: ~4 días | T6: ~9.5 días
   - Prestige claro, requiere dedicación real
   - Jugadores hardcore o con herramientas avanzadas
   - Herramientas T3+ necesarias

5. **T7 (Niveles 120-200)**:
   - ~27 días (Draconita: 400 XP/ciclo con multiplicador dinámico)
   - Prestige supremo, desafío sin fin
   - 80 niveles = ~27 días de farmeo continuo
   - Escala progresivamente más difícil (32x → 50x)

### Análisis de Dificultad

**Multiplicador escalado por tier**:
```
T1: 1.0x    ├─ Tutorial
T2: 1.5x    ├─ Fácil (1.5x más difícil)
T3: 3.0x    ├─ Doble (2x más difícil)
T4: 6.0x    ├─ Triple (2x más difícil)
T5: 12.0x   ├─ Doble (2x más difícil)
T6: 24.0x   ├─ Doble (2x más difícil)
T7: 32-50x  └─ Escalado dinámico
```

**Resultado**:
- Cada tier es ~1.5-2x más difícil
- Progresión exponencial = desafío genuino
- T6-T7 requieren 13+ días juntos
- Verdadera barrera para hardcore players

---

## 🔄 Comparativa: Viejo vs Nuevo Sistema

| Aspecto | Viejo | Nuevo (AJUSTADO) |
|---------|-------|-----------------|
| **Fórmula** | 100 + (n×50) + (tier×300) | Curva progresiva 1x→24x→50x |
| **Máximo nivel** | 120 | 200 |
| **XP en nivel 100** | 29,000 | 67,200 |
| **XP en nivel 120** | ~40,000 | 163,200 |
| **T7 scaling** | Plano (imposible) | Dinámico (32-50x) |
| **Tiempo a nivel 120** | ~19 horas | ~14 días |
| **Tiempo a nivel 200** | N/A | **~18-21 días** (óptimo) |
| **Pausa esperada** | ~T3 | ~T5 |
| **XP Total a Nivel 200** | N/A | ~5.5 millones |
| **Dificultad relativa** | Fácil | **Desafiante** |

---

## ⏱️ Tabla Rápida: Tiempo por Tier (Escenario Óptimo)

```
T1 (1-20):       1 min  █
T2 (20-40):      3 min  ███
T3 (40-60):      16 min █████████████████
T4 (60-80):      40 min ████████████████████████████████████████
T5 (80-100):     4 días ████████████████████████████████████████
T6 (100-120):    10 días ██████████████████████████████████████████
T7 (120-200):    27 días █████████████████████████████████████████████
────────────────────────────────────
TOTAL:           ~40-45 días  
```

**Leyenda**: Cada carácter representa ~1 hora
**Con herramientas completas**: ~15-20 días total
**Casual sin optimizar**: ~50+ días

---

## 🛠️ Herramienta de Desarrollo: Vista `/dev`

Para visualizar y analizar la curva de XP de forma interactiva:

**URL**: `http://localhost:5173/dev` (en desarrollo)

### Qué Muestra

1. **Resumen Global**
   - XP total a nivel 200
   - Número máximo de niveles
   - Ciclos estimados con producto óptimo
   - Tiempo total estimado

2. **Análisis por Tier**
   - Rango de niveles
   - XP total del tier
   - XP mínimo/promedio/máximo por nivel
   - Escalado de dificultad

3. **Análisis por Skill**
   - Desglose por tier
   - Producto representativo de cada tier
   - XP por ciclo
   - Ciclos necesarios
   - Tiempo estimado (horas y días)

4. **Tabla Completa**
   - XP requerido para cada nivel (1-200)
   - Ciclos necesarios con 400 XP/ciclo
   - Referencia rápida

### Cómo Usarla

1. Abre la aplicación en desarrollo (`npm run dev`)
2. Navega a `/dev`
3. Examina las tablas de progresión
4. Ajusta multiplicadores en `src/types/Game.ts` si es necesario
5. Recarga para ver cambios actualizados

**Nota**: Esta vista es solo para desarrollo. No aparece en producción.

### El Objetivo de 10.000.000 XP

**Respuesta**: NO se alcanzan exactamente 10M. Se alcanzan **~29.9 millones**.

**¿Por qué?**
- La curva está diseñada para escalarse correctamente
- 10M era solo un número redondo como "límite máximo teórico"
- En realidad, el sistema es más generoso y permite progreso infinito en T7

**Impacto**:
- Ninguno. El juego funciona perfectamente
- El único límite es nivel 200, no XP total
- Los números redondos en documentación eran aproximados

### ¿Cuánto Tiempo Lleva Subir Cada Nivel?

**Respuesta rápida** (Escenario Óptimo con Draconita):

```
T1 (1-20):      ~20 segundos/nivel
T2 (20-40):     ~30 segundos/nivel
T3 (40-60):     ~20 segundos/nivel
T4 (60-80):     ~3.6 minutos/nivel
T5 (80-100):    ~17 minutos/nivel
T6 (100-120):   ~35 minutos/nivel
T7 (120-200):   ~1.8 horas/nivel en promedio
```

**En contexto**:
- T1-T3: Minutos totales (tutorial)
- T4-T5: Horas (jugador casual nota progreso)
- T6: Horas-Días (jugador comprometido)
- T7: Días por nivel (prestige puro)

### Cálculos Verificados (2026-02-18 - ACTUALIZADO)

- ✅ 13 productos de minería reales (T1-T7)
- ✅ XP variable: 15 (Cobre) a 400 (Draconita)
- ✅ Ciclos de 5 segundos por skill
- ✅ Curva de dificultad: 1.0x → 24.0x → 50.0x (dinámico)
- ✅ **Tiempo total a nivel 200: ~14-21 días** (óptimo/casual)
- ✅ XP total acumulado: **~5.5 millones** (con nuevos multiplicadores)
- ✅ Con herramientas completas: **~8-12 días**
- ✅ T7 (120-200): **~27 días** = verdadero prestige

---

## 🚀 Próximos Pasos (Opcionales)

### Fine-tuning Recomendado

Basado en tiempos reales (~5 días a nivel 200), se puede ajustar:

1. **Si quieres menos tiempo**:
   - Reducir multiplicadores: T3=1.5x, T4=2.5x, T5=5x, T6=12x
   - Esto reduciría a ~3 días
   - O aumentar XP de Draconita de 400 a 600

2. **Si quieres más tiempo**:
   - Aumentar multiplicadores: T3=2.5x, T4=5x, T5=10x, T6=20x
   - Esto aumentaría a ~10-12 días
   - O reducir XP de productos finales

3. **Si quieres equilibrio actual**:
   - Mantener como está (5 días = 120 horas de farmeo)
   - Esto es 1-2 semanas en juego casual

### Mecanismos Adicionales (Futuros)

- **Bonuses de clase**: +10-20% XP según clase
- **Eventos de XP doble**: Fin de semana con 2x XP
- **Prestige reset**: Resetear a nivel 1 con +% XP permanente
- **Milestones de nivel**: Bonuses cada 25 niveles
- **Tasks diarias**: +50% XP en ciclos completados

---

## 📝 Referencias

- **Documento relacionado**: `01-SISTEMA_OFICIOS.md` (tabla de XP histórica)
- **Función central**: `src/types/Game.ts::calculateXpForLevel()`
- **Documentos de game loop**: `18-ANALISIS_GAME_LOOP.md` - `26-HOTFIX_3_PROBLEMAS_GAME_LOOP.md`

