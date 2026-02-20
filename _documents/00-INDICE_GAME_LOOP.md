# 📚 Índice: Documentación Game Loop

Guía para navegar la documentación del game loop.

---

## 🎯 Por Nivel de Profundidad

### ⚡ **Necesito Respuesta Rápida (5 min)**
→ Leer: **23-GAME_LOOP_ONE_PAGE.md**
- Qué es el game loop en 30 segundos
- 3 funciones clave
- Timeline de ejemplo
- Tabla de troubleshooting

### 📖 **Quiero Entender los Conceptos (15 min)**
→ Leer: **19-GAME_LOOP_QUICK_REFERENCE.md**
- Dónde está el game loop
- 4 pasos del flujo
- Duración de ciclos
- Procesamiento offline explicado
- Pseudo-código

### 🔬 **Análisis Técnico Completo (30+ min)**
→ Leer: **18-ANALISIS_GAME_LOOP.md**
- Ciclo de vida completo
- Estructura de SkillState
- Fórmulas exactas
- Casos edge
- Optimizaciones implementadas

### 📊 **Necesito Visualización**
→ Leer: **20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md**
- Diagramas ASCII de flujos
- Secuencias de activación
- Timeline visual
- Estados del skill
- Ejemplo offline paso a paso

### 🧭 **Necesito Ubicar Código**
→ Leer: **22-MAPA_CODIGO_GAME_LOOP.md**
- Estructura de archivos
- Flujos de datos
- Búsqueda rápida de funciones
- Puntos de entrada por caso de uso
- Componentes críticos

### 🔧 **Tengo un Bug / Problema**
→ Leer: **21-DEBUGGING_GAME_LOOP.md**
- Checklist de diagnóstico
- Problemas comunes & soluciones
- Estrategias de testing
- Monitoring en tiempo real
- Comandos de debugging

---

## 🎓 Por Caso de Uso

### "El skill no se activa"
```
1. Leer: 23-GAME_LOOP_ONE_PAGE.md (checklist)
2. Leer: 21-DEBUGGING_GAME_LOOP.md (problema #1)
3. Verificar: skillsStore.activateSkill()
```

### "¿Cómo funciona el reinicio automático?"
```
1. Leer: 19-GAME_LOOP_QUICK_REFERENCE.md (paso 4)
2. Ver: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (reinicio automático)
3. Código: src/App.vue líneas 107-117
```

### "¿Por qué los ciclos offline no se calculan?"
```
1. Leer: 19-GAME_LOOP_QUICK_REFERENCE.md (offline section)
2. Leer: 18-ANALISIS_GAME_LOOP.md (procesamiento offline)
3. Ver: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (flujo offline)
4. Debug: 21-DEBUGGING_GAME_LOOP.md (problema #2)
```

### "¿Cuánto tiempo debe pasar para completar ciclos?"
```
1. Leer: 23-GAME_LOOP_ONE_PAGE.md (constantes)
2. Leer: 18-ANALISIS_GAME_LOOP.md (sección Duración de Ciclos)
3. Calcular: Fórmula: max(500, baseDuration - speedBonus*1000)
```

### "¿Las herramientas aceleran ciclos que ya están corriendo?"
```
1. Leer: 18-ANALISIS_GAME_LOOP.md (casos edge #3)
2. Leer: 19-GAME_LOOP_QUICK_REFERENCE.md (herramientas)
3. Conclusión: NO - se aplica solo en activateSkill()
```

### "Necesito monitorear qué está pasando en el game loop"
```
1. Leer: 21-DEBUGGING_GAME_LOOP.md (monitoring en tiempo real)
2. Copiar: Código de setup básico de logging
3. Usar: Dashboard de monitoreo (componente Vue incluido)
```

### "Quiero hacer un test del ciclo completo"
```
1. Leer: 21-DEBUGGING_GAME_LOOP.md (strategies testing)
2. Test 1: Verificar ciclo simple (100ms)
3. Test 2: Simular offline
4. Test 3: Verificar bonuses
5. Test 4: Simular sin materiales
```

---

## 📋 Estructura de Documentos

```
18-ANALISIS_GAME_LOOP.md
  ├─ Ubicación del game loop
  ├─ Ciclo de vida completo (6 fases)
  ├─ Estructura de SkillState
  ├─ Duración de ciclos
  ├─ Flujo: Activar skill
  ├─ Flujo: Completar ciclo
  ├─ Reinicio automático
  ├─ Procesamiento offline
  ├─ Diagrama flujo completo
  ├─ Constantes de configuración
  ├─ Optimizaciones
  ├─ Casos edge
  └─ Resumen de responsabilidades

19-GAME_LOOP_QUICK_REFERENCE.md
  ├─ Dónde está (3 líneas)
  ├─ Flujo en 4 pasos
  ├─ Duración de ciclos (tabla)
  ├─ Constantes importantes
  ├─ Estado de un skill activo
  ├─ ¿Qué pasa si falla completeCycle?
  ├─ Timeline: primer ciclo
  ├─ Offline: cuando app cierra/abre
  ├─ Checklist: ciclo completo
  ├─ Bucle cerrado: pseudo-código
  └─ Debugging: comandos console

20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md
  ├─ Secuencia: Activación
  ├─ Secuencia: Game loop en acción
  ├─ Secuencia: Fallo por materiales
  ├─ Secuencia: Offline processing
  ├─ Timeline: ejemplo concreto
  └─ Estados de un skill

21-DEBUGGING_GAME_LOOP.md
  ├─ Checklist de diagnóstico
  ├─ Problemas comunes & soluciones
  ├─ Estrategias de testing (4 tests)
  ├─ Monitoring en tiempo real
  └─ Debugging checklist final

22-MAPA_CODIGO_GAME_LOOP.md
  ├─ Estructura de archivos clave
  ├─ Flujos de datos (3 flujos)
  ├─ Parámetros clave (tabla)
  ├─ Búsqueda rápida de funciones
  ├─ Puntos de entrada por caso de uso
  ├─ Componentes críticos
  └─ Navegación del código

23-GAME_LOOP_ONE_PAGE.md
  ├─ El game loop en 30 segundos
  ├─ 3 funciones clave
  ├─ Estados de un skill
  ├─ Timeline: 5 segundos
  ├─ Offline en 10 minutos
  ├─ Constantes clave
  ├─ Flujo de datos
  ├─ Checklist
  ├─ Problemas rápidos
  ├─ Debug comando
  └─ Índice de documentación
```

---

## 🔗 Conexiones Cruzadas

### Si estás en una función específica:

**`activateSkill()`**
- 📖 Explicación: 19-GAME_LOOP_QUICK_REFERENCE.md (paso 1)
- 📊 Diagrama: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (secuencia 1)
- 🗺️ Ubicación: 22-MAPA_CODIGO_GAME_LOOP.md (flujo 1)
- 🔍 Debugging: 21-DEBUGGING_GAME_LOOP.md (problema 1)

**`completeCycle()`**
- 📖 Explicación: 18-ANALISIS_GAME_LOOP.md (sección flujo completo)
- 📊 Diagrama: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (secuencia 2)
- 🧪 Testing: 21-DEBUGGING_GAME_LOOP.md (test 1)

**`calculateOfflineProgress()`**
- 📖 Explicación: 18-ANALISIS_GAME_LOOP.md (sección offline)
- 📊 Diagrama: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (secuencia 4)
- 🔧 Debug: 21-DEBUGGING_GAME_LOOP.md (problema 2)
- 🧪 Testing: 21-DEBUGGING_GAME_LOOP.md (test 2)

**Game Loop principal**
- 📍 Ubicación: 23-GAME_LOOP_ONE_PAGE.md
- 📖 Explicación: 19-GAME_LOOP_QUICK_REFERENCE.md
- 📊 Diagrama: 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (secuencia 2)
- 🧭 Mapeo: 22-MAPA_CODIGO_GAME_LOOP.md (líneas de código)

---

## � Documentación Relacionada (No Game Loop, pero Importante)

### 27-CURVA_PROGRESIVA_XP.md
**Tema**: Sistema de curva de XP progresiva y niveles  
**Cuándo leer**: Si preguntas "¿Por qué subo de nivel tan rápido/lento?"

Contiene:
- Problema: Ciclos de 5s universales hicieron progresión muy fácil
- Solución: Curva de dificultad progresiva (1x → 16x → 60x)
- Tabla: XP requerido por nivel (niveles 1-200)
- Impacto: Ciclos necesarios para subir de nivel
- Implementación: Función centralizada `calculateXpForLevel()`

**Archivos modificados:**
- `src/types/Game.ts` → Nueva función de cálculo de XP
- `src/stores/playerStore.ts` → Usa nueva función
- `src/stores/skillsStore.ts` → Usa nueva función

---

## �📍 Ubicaciones de Código

| Función | Archivo | Líneas |
|---|---|---|
| Game Loop | `src/App.vue` | 98-126 |
| Inicialización | `src/App.vue` | 45-80 |
| activateSkill | `src/stores/skillsStore.ts` | 138-172 |
| completeCycle | `src/stores/skillsStore.ts` | 187-310 |
| calculateOfflineProgress | `src/stores/gameStore.ts` | 95-280 |

---

## 🎯 Recomendación de Lectura

### Primer viaje (entender qué es)
```
1. 23-GAME_LOOP_ONE_PAGE.md (5 min)
2. 19-GAME_LOOP_QUICK_REFERENCE.md (10 min)
3. 20-DIAGRAMAS_SECUENCIA_GAME_LOOP.md (visuals) (10 min)
Total: 25 minutos
```

### Segundo viaje (entender cómo funciona)
```
1. 18-ANALISIS_GAME_LOOP.md (análisis completo) (30 min)
2. 22-MAPA_CODIGO_GAME_LOOP.md (ubicaciones) (15 min)
Total: 45 minutos
```

### Cuando hay un bug
```
1. 21-DEBUGGING_GAME_LOOP.md (diagnóstico) (5 min)
2. Volver a doc específica según problema
Total: 5+ minutos
```

---

## ✅ Verificación de Comprensión

**¿Entiendes el game loop si puedes responder?**

- [ ] ¿Dónde está el game loop? (archivo y líneas)
- [ ] ¿Cada cuánto se ejecuta? (100ms)
- [ ] ¿Qué funciones principales llama?
- [ ] ¿Cuál es el parámetro crítico? (cycleEndTime)
- [ ] ¿Qué pasa si completeCycle() retorna null?
- [ ] ¿Cómo se procesan ciclos offline?
- [ ] ¿Las herramientas aceleran ciclos que ya están corriendo?
- [ ] ¿Cuánto tiempo máximo de offline se procesa?
- [ ] ¿Qué se guarda cada 5 segundos?
- [ ] ¿En qué orden se ejecuta: offline, game loop o UI?

**Si respondiste todas → Dominas el game loop** ✅

---

## 🔄 Cómo Mantener Esta Documentación

**Si cambias el game loop:**
1. Actualiza primero: 23-GAME_LOOP_ONE_PAGE.md
2. Luego: 19-GAME_LOOP_QUICK_REFERENCE.md
3. Luego: 18-ANALISIS_GAME_LOOP.md (secciones relevantes)
4. Finalmente: otros documentos según cambios

**Si añades un case edge:**
→ Actualizar: 18-ANALISIS_GAME_LOOP.md (sección "Casos Edge")

**Si cambias constantes:**
→ Actualizar: 23-GAME_LOOP_ONE_PAGE.md + 18-ANALISIS_GAME_LOOP.md

---

**Última actualización**: 18 de febrero de 2026  
**Mantenedor**: [Tu nombre]  
**Versión**: 1.0
