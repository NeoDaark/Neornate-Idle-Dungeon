# 🏰 Sistema de Mazmorras - Neornate Idle Dungeon

## 📋 Concepto General

**Neornate Idle Dungeon** es un juego híbrido que mezcla:
- **Sistema Idle**: Progresión automática mediante oficios
- **Exploración de Mazmorras**: Mapas 2D estilo retro generados proceduralmente
- **Builds de Clases Evolutivas**: Especializaciones del sistema de clases progresivas
- **Generación Procedural con Seeds**: Reproducibilidad + variación

**Objetivo**: Crear un loop infinito de progresión y descubrimiento donde cada sistema se alimenta del otro.

---

## 🔄 Core Loop Principal

El ciclo jugable base que mantiene la progresión:

```
Jobs Idle
    ↓ (generan recursos)
Recursos
    ↓ (se transforman en equipo)
Equipo
    ↓ (permite explorar dungeons)
Dungeon
    ↓ (otorga loot raro)
Loot Raro
    ↓ (mejoras permanentes)
Mejoras Permanentes
    ↓ (hacen jobs más eficientes)
Jobs Idle [LOOP]
```

### Ejemplo Práctico
1. **Minería** produce hierro (job idle)
2. **Fundición** transforma hierro en acero
3. **Herrero** crea espada de acero
4. **Dungeon** con espada mejorada → derrota boss
5. **Loot**: Reliquia rara que da +20% a minería
6. Ciclo se repite con progresión exponencial

---

## 🏗️ Arquitectura Técnica

Separación obligatoria de capas:

```
src/
├─ engine/
│   ├─ dungeon/          # Lógica de mazmorras
│   ├─ combat/           # Sistema de combate
│   ├─ loot/             # Generación de loot
│   └─ seeds/            # Manejo de seeds
├─ canvas/
│   ├─ renderer.ts       # Renderizado Canvas
│   └─ tiles/            # Sistema de tiles
├─ components/
│   └─ dungeon/          # Componentes Vue del UI
├─ data/
│   ├─ dungeonConfig.ts  # Contenido JSON
│   └─ enemies.ts        # Definiciones de enemigos
└─ stores/
    └─ dungeonStore.ts   # Estado Pinia
```

**Ventaja**: Cambiar UI Vue sin romper la lógica del juego.

---

## 🗺️ Sistema de Mazmorras

### Tipo Híbrido: Salas Prefabricadas + Procedurales

#### A) Salas Prefabricadas (Diseñadas)
- **Boss Rooms**: Boss único con mecanique especial
- **Secretos**: Salas ocultas, desafíos especiales
- **Puzzles**: Salas que requieren lógica

#### B) Salas Procedurales (Aleatorias)
- **Enemigos Variables**: Spawns aleatorios basados en seed
- **Loot Random**: Drops generados proceduralmente
- **Layout Variable**: Disposición de tiles diferente

### Ejemplo de Generación
```
Seed 12345
├─ Entrada (prefab)
├─ Boss Room (prefab fija)
├─ Sala Random 1 (enemigos del seed)
├─ Sala Random 2
├─ Sala Random 3
├─ Sala Random 4
├─ Sala Random 5
├─ Sala Random 6
└─ Sala Secreta Posible (según sub-seed)
```

---

## 🌱 Sistema de Seeds

Las seeds controlan la reproducibilidad y variación de los dungeons.

### Tipos de Seeds

#### Seeds Fijas
- Usadas para **progreso de campaña**
- Permiten diseñar experiencias específicas
- El jugador siempre obtiene el mismo mapa
- El loot puede variar con sub-seeds

#### Seeds Aleatorias
- Usadas en **portales infinitos** (endgame)
- Cada entrada genera dungeon único
- Permite infinita variabilidad

### Sub-Seeds
Cada seed principal contiene sub-seeds para diferentes aspectos:

```typescript
interface DungeonSeed {
  mainSeed: number          // Seed general
  layoutSeed: number        // Disposición de salas
  enemySeed: number         // Tipos y ubicación de enemigos
  lootSeed: number          // Drops y rarezas
  eventSeed: number         // Eventos especiales
  secretSeed: number        // Ubicación de secretos
}
```

### Ejemplo Práctico
```
Seed 777 (mainSeed) genera:
├─ layoutSeed: 777-layout → mismo mapa físico
├─ enemySeed: 777-enemy → mismos enemigos
├─ lootSeed: 777-loot → DIFERENTE loot si cambias este
└─ Si cambias lootSeed a 778
   → mismo mapa, mismos enemigos, DIFERENTE loot
```

---

## 💰 Sistema de Recompensas

Las recompensas operan en **3 capas de progresión** para mantener motivación a corto, medio y largo plazo.

### Capa 1: Inmediata (Por sesión)
- **Loot**: Equipo, dinero
- **Oro**: Moneda consumible
- **Materiales**: Recursos para jobs y herrero
- **XP de Aventura**: Progresa skill de dungeon

### Capa 2: Permanente (Desbloqueos)
- **Recetas**: Nuevos crafteos en herrero
- **Perks**: Bonificaciones globales desbloqueadas
- **Mejoras Globales**: +% a stats, drops, XP
- **Modificadores**: Afectan siguientes runs

### Capa 3: Meta (Endgame)
- **Reliquias**: Items únicos con efectos globales
- **Talentos Globales**: Árbol de talentos desbloqueables
- **Prestigio**: Sistema de reset + bonificaciones
- **Clases Secretas**: Desbloqueos por logros ocultos

### Ejemplo de Run Típica
```
Entro dungeon → Derroto miniboss
  ↓
Drop Raro: "Reliquia del Fuego"
  ↓
Desbloquea receta: "Armadura ígnea" (Capa 2)
  ↓
Con receta → mejoro equipo permanentemente
  ↓
Próximas runs más fáciles (Capa 3 progresa)
```

---

## 🛡️ Sistema de Equipo y Rarezas

### Tiers de Rareza

```
Common
├─ Solo stats básicos
├─ Fácil de encontrar
└─ Bajo poder

Rare
├─ Stats extra
├─ Más difícil
└─ Poder medio

Epic
├─ Efecto especial
├─ Raro
└─ Poder alto

Legendary
├─ Efecto fuerte y sinérgico
├─ Muy raro
└─ Poder muy alto

Mythic
├─ Mecánica única del juego
├─ Extremadamente raro
└─ Gamebreaker potencial
```

### Escalado de Poder

```
Common (5 stats) 
  ↓ +1 stat
Rare (6 stats + 1 efecto)
  ↓ +1 stat
Epic (7 stats + 2 efectos)
  ↓ +1 stat
Legendary (8 stats + 3 efectos)
  ↓ +1 stat
Mythic (10 stats + mecánica única)
```

### Ejemplo Mythic
**Espada Temporal**
- Stats: +15 ATK, +10 SPD
- Efecto: Críticos reducen el cooldown de habilidad en 0.5s
- Sinergia: En clases rápidas es gamebreaker, en lentas es útil

---

## 🔨 Sistema de Herrero (Smithing)

Tres niveles de mejora con costes escalonados:

### Nivel 1: Mejorar Stats (+1, +2, +3)
```
Costs:
+1: 10 minerales + 100 oro
+2: 20 minerales + 250 oro
+3: 30 minerales + 500 oro

Límite: +10 por equipo
```

**Efecto**: Aumenta stats del item linealmente

### Nivel 2: Reforjar (Reroll Stats)
```
Costs:
Reroll 1: 15 minerales + 200 oro
Reroll 2: 25 minerales + 400 oro
Reroll 3: 40 minerales + 700 oro

Límite: 3 rerolls por equipo
```

**Efecto**: Regenera stats aleatorios manteniendo rareza. Chance de mejor roll.

### Nivel 3: Ascender (Subir Tier)
```
Costs:
Common → Rare: 50 minerales + 1000 oro + 1 Esencia Rara
Rare → Epic: 100 minerales + 3000 oro + 3 Esencias Épicas
Epic → Legendary: 200 minerales + 7500 oro + 5 Esencias Legendarias
Legendary → Mythic: 500 minerales + 20000 oro + 1 Reliquia Mítica
```

**Efecto**: Sube rareza, regenera todos los stats, añade nuevo efecto

### Costes Combinados
- **Materiales Dungeon**: Esencias (rareza), Reliquias (míticas)
- **Materiales Job**: Minerales (minería), Oro (loot base)

---

## 👥 Sistema de Clases Progresivas

### Estructura de 7 Tiers

Cada clase base evoluciona en una rama con especializaciones:

```
TIER 1 (Levels 0-20): Base
├─ Guerrero
├─ Mago
└─ Ladrón

TIER 2 (Levels 20-40): Archetipo
├─ Guerrero → Caballero
├─ Mago → Hechicero
└─ Ladrón → Asesino

TIER 3 (Levels 40-60): Especialización
├─ Caballero → {Paladín, Centurión}
├─ Hechicero → {Arcano, Brujo}
└─ Asesino → {Acechador, Envenenador}

... y así hasta TIER 7 (Levels 120-200+)
```

### Ejemplo Rama Completa: Guerrero

```
Guerrero (T1)
  ↓ (Level 20, 500 moneda dungeon)
Caballero (T2)
  ↓ (Level 40, 1000 moneda dungeon)
  ├─ Paladín (T3)
  │   ├─ Defensor Divino (T4)
  │   │   ├─ Dragoon Celestial (T5)
  │   │   │   └─ Titán Invencible (T6)
  │   │   │       └─ Dios de la Guerra (T7)
  │   │   └─ Guardián Sagrado (T5)
  │   └─ Cruzado (T4)
  └─ Centurión (T3)
      └─ [similar branching]
```

### Clases Híbridas
Combinar elementos de dos arquetipos base:

```
Guerrero + Mago = Spell Knight
├─ Habilidades: Espada + Magia
├─ Stats: Balanced STR/INT
└─ Desbloqueo: 1000 moneda + tener ambas clases T1

Ladrón + Mago = Hexblade
├─ Habilidades: Agilidad + Maldiciones
├─ Stats: DEX + INT
└─ Desbloqueo: 1500 moneda + ambas T2
```

### Desbloqueo de Clases
- **Moneda Dungeon**: Obtenida como loot en mazmorras
- **Progreso Previo**: Acceso a nuevas ramas solo si completaste rama anterior
- **Secretos**: Clases ocultas se desbloquean por condiciones especiales

---

## ✨ Pasivas Permanentes por Clase

Desbloquear una clase otorga un **bonus global permanente** para toda la partida.

### Bonificaciones Globales

```
Guerrero desbloqueado   → +2% Health
Caballero desbloqueado  → +5% Defensa
Paladín desbloqueado    → +3% Defensa + Regeneración
Dragoon desbloqueado    → +4% Crítico

Mago desbloqueado       → +3% Magia
Arcano desbloqueado     → +5% Velocidad Cast
Brujo desbloqueado      → +2% Daño Magia + Lifesteal 1%

Ladrón desbloqueado     → +4% Crítico
Asesino desbloqueado    → +6% Crítico
Envenenador desbloqueado → Ataques aplican veneno
```

**Objetivo**: Incentivar coleccionar todas las clases para maximizar stats globales.

---

## 🔐 Clases Secretas

Clases ocultas con desbloqueos especiales y mecánicas únicas.

### Características
- **Ocultas**: No anunciadas, el jugador las descubre
- **Desbloqueo por Secretos**: Requieren completar condiciones especiales
- **Mecánicas Únicas**: Habilidades que rompen reglas normales
- **Alto Valor**: Muy poderosas cuando se desbloquean

### Ejemplo: Invocador

**Desbloqueo**:
```
1. Drop raro en dungeon: "Fragmento de Grieta"
2. Combinar con 5 reliquias comunes → "Cristal Invocador"
3. Entrar dungeon específico con el cristal
4. Encontrar sala oculta (requiere secretSeed específico)
5. Interactuar con altar → DESBLOQUEO
```

**Mecánica Única**:
- Invocación de minions aliados
- Los minions combaten por el jugador
- Escalado con INT
- Sinergia con clases mágicas

### Otros Secretos Potenciales

```
Nómada (viajero entre dimensiones)
├─ Desbloqueo: Visitar 100 dungeons diferentes
├─ Mecánica: Cambiar stats entre combates
└─ Bonus: +10% velocidad de movimiento

Alquimista (transforma poder en recursos)
├─ Desbloqueo: Crear 50 items en herrero
├─ Mecánica: Convertir items en recursos
└─ Bonus: +15% drops de materiales

Bardo (buffs y utilidad)
├─ Desbloqueo: Coleccionar 10 reliquias
├─ Mecánica: Aura de bonificaciones
└─ Bonus: +5% a todos los stats aliados
```

---

## 🎭 Sistema de Secretos Universal

Modelo genérico para crear secretos sin modificar el motor:

### Estructura Base

```typescript
interface Secret {
  id: string
  name: string
  trigger: Condition          // Condición que debe cumplirse
  effect: Action             // Qué pasa cuando se cumple
  hidden: boolean            // ¿Oculto o visible?
  reward: Reward             // Qué se obtiene
}

interface Condition {
  type: 'trigger' | 'item' | 'class' | 'location' | 'composite'
  value: any
}

interface Action {
  type: 'spawn' | 'unlock' | 'transform' | 'trigger'
  target: string
}

interface Reward {
  type: 'class' | 'item' | 'recipe' | 'perk'
  value: any
}
```

### Ejemplos de Secretos

```
Secreto: Portal Dimensional
├─ Trigger: Entrar dungeon + llevar Reliquia Rara
├─ Effect: Aparece portal en sala final
├─ Reward: Classe Nómada + Item único

Secreto: Forja Antigua
├─ Trigger: Llegar a herrero nivel 3 + tener 5 items Legendary
├─ Effect: Desbloquea receta oculta
├─ Reward: Receta "Forja Legendaria" (-20% costes)

Secreto: Maestro Oscuro
├─ Trigger: Matar 1000 enemigos + tener 50% crítico
├─ Effect: Boss especial en siguiente dungeon
├─ Reward: Clase Asesino Dark + Daga Legendaria
```

**Ventaja**: Permite crear secretos sin tocar código del motor.

---

## ⚖️ Filosofía de Balance

### Regla Central

```
Dungeon = Progreso CUALITATIVO (mejora exponencial)
Idle    = Progreso CUANTITATIVO (mejora lineal)
```

### Lo que NUNCA debe pasar

❌ **Idle sustituye Dungeon**
- No permitir ganar equipo legendary solo con idle jobs
- No permitir completar quest solo acumulando recursos

❌ **Dungeon sustituye Idle**
- No permitir jugar sin sistemas idle
- El progreso idle debe ser valioso incluso si no explorasdungeons

### Ejemplo de Balance Correcto

```
Scenario 1: Solo Idle (sin dungeon)
├─ Progresión: Lenta pero constante
├─ Velocidad: 10 minerales/s
└─ Objetivo: Accesible para jugadores pasivos

Scenario 2: Idle + Dungeon ocasional
├─ Progresión: 2x-5x más rápida
├─ Obtiene: Equipos raros + reliquias
└─ Objetivo: La mayoría de jugadores

Scenario 3: Mostly Dungeon (optimizado)
├─ Progresión: 10x-20x más rápida
├─ Pero: Requiere habilidad + atención
└─ Objetivo: Jugadores hardcore
```

---

## 📱 Optimización Móvil

Restricciones debido a plataforma (iOS/Android):

### Reglas de Renderizado

```
1. FPS Target: 30 máximo (no 60)
   └─ Móviles con budget limitado
   
2. Viewport Culling: Renderizar solo visible
   └─ Si hay 100 enemigos, renderizar solo 20 visibles
   
3. Pausar Loops: Cuando app está en background
   └─ `onPause()` → pausar game loop
   └─ `onResume()` → reanudar con catch-up
   
4. Spritesheets: No cargar sprites individuales
   └─ Usar atlas de texturas
   └─ Máximo 2-3 atlas por dungeon
   
5. Separación Lógica/Render:
   └─ Game loop: update @ 30fps
   └─ Canvas loop: draw @ 30fps (sincronizado)
```

### Estructura de Game Loop

```typescript
// Game loop (30fps = 33.3ms)
setInterval(() => {
  updateGameState()    // Actualizar lógica
  updatePhysics()      // Mover enemigos, jugador
  checkCollisions()    // Detectar interacciones
}, 33.3)

// Render loop (throttled a 30fps con requestAnimationFrame)
function renderLoop() {
  canvas.clearRect(0, 0, w, h)
  drawBackground()
  drawTiles()
  drawEnemies()
  drawPlayer()
  drawUI()
  requestAnimationFrame(renderLoop)
}

renderLoop()
```

### Gestión de Memoria

```
Antes de entrar dungeon:
├─ Descargar assets de anterior
├─ Pre-cargar sprites del nuevo dungeon
├─ Pre-generar enemigos con pooling
└─ Inicializar canvas

Durante dungeon:
├─ Pool de objetos (reusable)
├─ Límite máximo de enemigos simultáneos (20-30)
└─ Limpieza de eventos listeners

Al salir dungeon:
├─ Destruir canvas
├─ Liberar memoria de enemigos
└─ Guardar progreso en localStorage
```

---

## 🌈 Endgame: Portal de Infinitud

Sistema de contenido infinito para mantener jugadores enganchados post-campaña.

### Concepto

Zona especial con **portales procedurales infinitos** donde dificultad escala indefinidamente.

### Características

```
Portales Infinitos
├─ Seeds aleatorias cada vez
├─ Dificultad escalable
├─ Modificadores variables
├─ Leaderboards
└─ Rewards infinitos (pero cada vez más caros)
```

### Modificadores (Modifiers)

Cada portal puede tener mods que cambian reglas:

```
Modifier: Nemigos Rápidos
├─ Todos los enemigos +50% velocidad
├─ Recompensa: +25% loot
└─ Dificultad: +30%

Modifier: Doble Loot
├─ Todos los drops x2
├─ Recompensa: +50% oro
└─ Dificultad: +20%

Modifier: Niebla
├─ Viewport reducido
├─ Solo ves 3 tiles alrededor
├─ Recompensa: +15% rareza
└─ Dificultad: +25%

Modifier: Enemigos Élite
├─ Todos los enemigos son tier superior
├─ Stats +100%
├─ Recompensa: +75% experiencia
└─ Dificultad: +50%
```

### Sistema de Combinación

```
1 modifier: +30% dificultad
2 modifiers: +60% dificultad
3 modifiers: +100% dificultad
4 modifiers: +150% dificultad (hardcore)
5 modifiers: +200% dificultad (impossible)
```

### Rewards Escalados

```
Portal 1: 1000 oro, 10 minerales
Portal 5: 2500 oro, 50 minerales
Portal 10: 5000 oro, 150 minerales
Portal 50: 25000 oro, 1000 minerales
Portal 100+: Escala exponencialmente
```

### Leaderboard

```
Top jugadores por:
├─ Portales alcanzados (profundidad)
├─ Modificadores más difíciles
├─ Tiempo de completar
└─ Mayor drop conseguido
```

---

## 🎯 Objetivo Final de Diseño

La filosofía general es crear un juego con:

### Progresión Infinita
- Siempre hay algo nuevo que desbloquear
- Leveling de clases vs nuevo contenido
- Mejora de equipo sin límite

### Descubrimiento Constante
- Secretos ocultos por encontrar
- Clases especiales por desbloquear
- Sinergias de equipo por experimentar

### Builds Variadas
- 7+ clases evolutivas
- Híbridos combinables
- Equipos con sinergia
- Modificadores de gameplay

### Secretos Ocultos
- No anunciar existencia
- Encontrar es recompensa
- Lore escondido

### Contenido Expandible
- Nueva arquitectura modular
- Fácil agregar enemigos, items, clases
- Actualizaciones sin romper progreso

## 🎮 Meta Última

**Que el jugador SIEMPRE tenga un objetivo nuevo.**

```
Jugador sin objetivo = Jugador que abandona
Jugador con 5 objetivos = Jugador que sigue jugando
```

---

**Documento Completado**: 13 de febrero de 2026  
**Versión**: 1.0.0  
**Estado**: Arquitectura de Sistema lista para implementación
