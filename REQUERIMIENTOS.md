# NEORNATE - IDLE DUNGEON
## Documento de Requerimientos Funcionales y Técnicos

---

## 1. VISIÓN GENERAL

**Neornate - Idle Dungeon** es un juego RPG Idle hybrid que combina mecánicas de progresión pasiva (idle) con exploración activa de mazmorras procedurales. El jugador gestiona su personaje a través de un sistema de clases escalables (Tiers), equipo dinámico, trabajos alternativos y exploración de mazmorras generadas proceduralmente.

**Plataformas**: Web (HTML5), Android (Capacitor), iOS (Capacitor)

---

## 2. ESTRUCTURA DE NAVEGACIÓN

### 2.1 Pantalla de Inicio (Pre-Juego)
- **Crear Personaje**
  - Campo de entrada: Nombre del personaje
  - Selector de clase base:
    - Warrior (Fuerza y Constitución base)
    - Thief (Destreza y Inteligencia base)
    - Mage (Inteligencia y Sabiduría base)
  - Botón "Comenzar"

### 2.2 Pantalla Principal (Aplicación)
- **Menu Inferior (Tab Navigation)** - Siempre visible, 5 opciones
  - 🏠 Inicio / Home
  - ⚔️ Equipo / Equipment
  - 🏛️ Gremio / Guild
  - 🏪 Tienda / Shop
  - 💼 Trabajos / Jobs
  - (En futuras versiones: 🗺️ Mazmorras / Dungeons)
  - (En futuras versiones: 💎 Premium / Shop Premium)

---

## 3. MÓDULOS FUNCIONALES

### 3.1 MÓDULO: INICIO / HOME

**Descripción**: Panel principal donde se muestran las estadísticas del personaje, progresión y accesos rápidos.

**Contenido a mostrar:**
- Nombre del personaje
- Nivel actual y progresión de XP (barra visual)
- Clase actual y Tier actual
- Oro actual (moneda principal)
- Monedas Tier (moneda para cambio de tier)
- Stats principales (Fuerza, Destreza, Constitución, Inteligencia, Sabiduría, Carisma)
  - Mostrar: Base + Equipado = Total
- Vida actual / Vida máxima (barra visual)
- Armadura / Resistencia (calculada desde equipo)
- Experiencia siguiente nivel (contador)
- Resumen rápido del equipo (slots principales: Arma, Casco, Pechera)

**Acciones disponibles:**
- Ver detalles completos de stats
- Acceso directo a Equipo
- Acceso directo a Trabajos (para revisar progreso)

---

### 3.2 MÓDULO: EQUIPO / EQUIPMENT

**Descripción**: Sistema completo de gestión y mejora de equipo.

**Slots de Equipo (10 total):**
- Arma: 2 huecos (1 mano o 2 manos)
- Casco
- Pechera
- Guantes
- Pantalones
- Botas
- Anillo x2
- Amuleto

**Funcionalidades:**

#### 3.2.1 Visualización de Equipo
- Mostrar slot vacío o equipo equipado
- Nombre, rareza y nivel de mejora del item
- Stats que proporciona
- Color por rareza (Común, Raro, Épico, Legendario)

#### 3.2.2 Gestión de Inventario
- Lista de items disponibles (sin equipar)
- Filtrar por slot
- Buscar por nombre/rareza
- Ordenar por stats/rareza

#### 3.2.3 Comparación de Items
- Mostrar: Stats base vs Stats con candidato
- Mostrar diferencia (+/-)
- Mostrar bonus de mejoras del equipo actual
- Recomendar si es mejor o peor

#### 3.2.4 Mejora de Equipo
- Costo: 4 materiales por +1 de mejora
- Mostrar mejora actual y próxima mejora
- Limitar por materiales disponibles
- Log: "✅ Item +5 mejorado a +6"

#### 3.2.5 Desmantelamiento
- Recuperar: 1 material base + 3/4 de materiales usados en mejoras
- Ejemplo: Item +5 (costó 20 materiales) → Devuelve 16 materiales
- Log: "♻️ Desmantelado: +16 materiales"

#### 3.2.6 Drop de Items
- Rareza progresiva según Tier/Dungeon
- Nombre procedural: [Prefijo] [Slot] [Sufijo] ([Rareza])
- Generación aleatoria de stats (1-3 puntos por stat)

---

### 3.3 MÓDULO: GREMIO / GUILD

**Descripción**: Sistema de progresión de clases mediante Tiers.

**Estructura de Tiers:**
```
Tier 1 (Base)
├── Warrior
├── Thief
└── Mage

Tier 2 (Especialización)
├── Knight (de Warrior)
├── Assassin (de Thief)
└── Sorcerer (de Mage)

Tier 3 (Especialización avanzada)
├── Paladin (de Knight)
├── Shadow Master (de Assassin)
└── Archmage (de Sorcerer)

Tier 4 (Elite)
├── [Especialización Paladin]
├── [Especialización Shadow Master]
└── [Especialización Archmage]

Tier 5 (Legendary)
├── [Especialización Tier 4 Guerrero]
├── [Especialización Tier 4 Pícaro]
└── [Especialización Tier 4 Mago]
```

**Funcionalidades:**

#### 3.3.1 Visualización
- Árbol de clases desbloqueadas/bloqueadas
- Requisitos para siguiente Tier:
  - Nivel mínimo requerido
  - Monedas Tier necesarias
  - Items específicos opcionales

#### 3.3.2 Cambio de Tier
- Costo: X monedas Tier (aumenta por cada tier: 100, 250, 500, 1000, 2500)
- Botón "Ascender" si se cumplen requisitos
- Confirmación antes de cambiar
- Log: "🎖️ ¡Has ascendido a Knight! Stats +10%"

#### 3.3.3 Bonus por Tier
- Cada Tier proporciona bonus a todos los stats
- Bonus de aptitudes especiales (ej: Warrior: +Armadura, Mage: +Magia)
- Descripción detallada de cada clase

---

### 3.4 MÓDULO: TIENDA / SHOP

**Descripción**: Sistema de compra/venta de items, dinámico según Tier.

**Funcionalidades:**

#### 3.4.1 Compra de Items
- Items disponibles según Tier actual
- Precio varía por rareza y tier
- Fórmula: `Precio = 10 * Tier * Rareza_Multiplicador`
- Verificar oro disponible
- Item añadido a inventario

#### 3.4.2 Venta de Items
- Vender items del inventario no equipados
- Precio de venta: 50% del precio original
- Log: "💰 Vendido: +X oro"

#### 3.4.3 Tienda Procedural
- Cada Tier desbloquea mejores items
- Renovación de inventario cada X horas (simulado)
- Items aleatorios pero dentro del rango del Tier

#### 3.4.4 Favoritos
- Marcar items interesantes
- Notificación si están disponibles

---

### 3.5 MÓDULO: TRABAJOS / JOBS

**Descripción**: Sistema Idle principal. Asignación de trabajadores a tareas para recolectar recursos.

**Estructura de Trabajos:**
```
Tier 1:
├── Leñador (Recolecta: Madera)
└── Minero (Recolecta: Mineral)

Tier 2:
├── Herbolario (Recolecta: Hierbas) [Requiere: Leñador]
├── Sastre (Recolecta: Tela) [Requiere: Minero + Leñador]
└── Herrero (Recolecta: Acero) [Requiere: Minero]

Tier 3:
├── Alquimista (Recolecta: Pociones) [Requiere: Herbolario + Herrero]
├── Joyero (Recolecta: Gemas) [Requiere: Minero + Herrero]
└── Erudito (Recolecta: Conocimiento) [Requiere: Alquimista + Joyero]

Tier 4 & 5: [Trabajos especializados de cada tier]
```

**Funcionalidades:**

#### 3.5.1 Asignación de Trabajadores
- Crear trabajadores (nombre personalizado)
- Asignar a un trabajo desbloqueado
- Solo 1 trabajo activo a la vez por trabajador
- Múltiples trabajadores posibles

#### 3.5.2 Progresión de Trabajo
- Tiempo estimado para completar tarea
- Barra de progreso visual
- Eficiencia: depende del stat relevante del jugador
- Tiempo base: 1 hora (escalable por dificultad)

#### 3.5.3 Recolección de Recursos
- Al completar, recibe recurso del Tier actual
- Cantidad: `Random(5, 15) * Tier`
- Recursos se usan para:
  - Crafting de items
  - Quest rewards
  - Currency conversion

#### 3.5.4 Cadenas de Dependencia
- No puedes desbloquear Sastre si no tienes Leñador completado
- Mostrar árbol de dependencias
- Recomendaciones de qué desbloquear

---

### 3.6 MÓDULO: MAZMORRAS / DUNGEONS (FUTURO)

**Descripción**: Sistema de exploración manual con generación procedural.

**Características:**

#### 3.6.1 Generación Procedural
- Seed-based: misma seed = mismo mapa siempre
- Tamaño: 10x10 a 20x20 casillas
- Salas conectadas por pasillos
- Jefe final en sala central/final

#### 3.6.2 Navegación
- 4 flechas de movimiento (Arriba, Abajo, Izquierda, Derecha)
- Canvas con vista del mapa
- Mostrar posición del jugador
- Fog of War opcional

#### 3.6.3 Encuentros
- Enemigos en salas
- Cofres con loot
- Trampas (reducen vida)
- NPCs opcionales

#### 3.6.4 Jefe Final
- Más fuerte que enemigos normales
- Mejor loot garantizado
- Al derrotar: desbloquea siguiente dungeon
- Opción de entrar/salir sin completar

#### 3.6.5 Progresión
- Dungeon 1 -> Dungeon 2 -> ... (5-10 dungeons)
- Dificultad progresiva
- Solo puedes acceder a la siguiente si completaste la anterior
- Select list para elegir dungeon desbloqueada

---

### 3.7 MÓDULO: PREMIUM (FUTURO)

**Descripción**: Sistema de monetización mediante IAP y ads.

**Contenidos:**
- Tienda premium con boosts
- Recompensas por ver anuncios
- Pase de batalla (premium pass)
- Acelerador de trabajos
- Gema premium (moneda premium)

---

## 4. SISTEMAS TRANSVERSALES

### 4.1 Sistema de Combate

**Mecánicas:**
- Jugador vs Enemigo (1v1)
- Múltiples rondas hasta muerte
- Daño = Base + Equipo - Armadura enemiga
- Criticals: 10% chance adicional 50% daño
- Derrota automática si vida ≤ 0

**Recompensas:**
- XP: `Dungeon_Level * 5 + Random(5, 15)`
- Materiales de combate (escasos)
- Items (probabilidad según rareza)

### 4.2 Sistema de XP y Niveles

**Progresión:**
- Fórmula XP: `50 * Nivel^1.2`
- Nivel 1→2: 50 XP
- Nivel 2→3: 109 XP
- Nivel 10→11: 1072 XP

**Bonus por subida:**
- +1 a TODOS los stats
- Recuperación de 20% vida
- Log: "🎉 ¡NIVEL 5! Todos los stats +1"

### 4.3 Sistema de Stats

**Stats disponibles:**
- Fuerza: Aumenta daño físico
- Destreza: Aumenta evasión y crítico
- Constitución: Aumenta vida máxima
- Inteligencia: Aumenta daño mágico
- Sabiduría: Aumenta resistencia mágica
- Carisma: Aumenta oro recibido (5% por punto)

**Cálculo Total:**
- `Total Stat = Base + Equipo + Tier Bonus`

### 4.4 Sistema de Rareza

**Tabla de Rareza:**
| Rareza | Chance | Multiplicador | Color |
|--------|--------|----------------|-------|
| Común | 70% | 1x | Gris |
| Raro | 20% | 1.5x | Azul |
| Épico | 8% | 2x | Púrpura |
| Legendario | 2% | 3x | Naranja |

**Stats por Rareza:**
- Común: 0-1 stats
- Raro: 1-2 stats
- Épico: 1-3 stats
- Legendario: 2-3 stats

### 4.5 Sistema de Progresión

**Curva de Dificultad:**
- Tier 1: Mazmorras 1-3
- Tier 2: Mazmorras 4-6
- Tier 3: Mazmorras 7-9
- Tier 4: Mazmorras 10-12
- Tier 5: Mazmorras 13+

**Moneda Principal (Oro):**
- Obtenido de: Vendas de items, Trabajos, Combates
- Uso: Compra en tienda

**Moneda Tier:**
- Obtenida de: Quest completadas (1 por Tier)
- Rara y valiosa
- Uso: Ascender de Tier

---

## 5. ALMACENAMIENTO DE DATOS

### 5.1 Datos Persistentes
- Nombre del personaje
- Nivel, XP, Oro
- Tier actual
- Equipo equipado
- Inventario
- Trabajadores y su progreso
- Mazmorras desbloqueadas
- Progreso general

### 5.2 Almacenamiento
- **Web**: LocalStorage + IndexedDB
- **Mobile**: Capacitor Storage + SQLite
- **Cloud** (Opcional): Firebase Realtime DB

### 5.3 Sincronización
- Autoguardado cada 5 segundos
- Sync entre dispositivos (si está disponible)
- Backup local automático

---

## 6. REQUISITOS TÉCNICOS

### 6.1 Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js (Express) - Opcional para cloud
- **Mobile**: Capacitor (iOS + Android)
- **Storage**: LocalStorage, IndexedDB, SQLite
- **Assets**: Sprites personalizados (Ornyx)

### 6.2 Rendimiento
- Mínimo 60 FPS en combates
- Carga inicial < 3 segundos
- Optimización de imágenes
- Lazy loading de sprites

### 6.3 Compatibilidad
- Chrome/Firefox/Safari (últimas 2 versiones)
- iOS 13+
- Android 6+
- Modo offline funcional
- Responsive design (móvil prioritario)

---

## 7. ROADMAP

### MVP (Hecho)
- ✅ Sistema de combate multi-ronda
- ✅ Sistema de XP y niveles
- ✅ Equipo básico y mejoras
- ✅ Trabajos (parcial)
- ✅ Tienda básica

### Fase 1
- [ ] Sistema completo de Gremio/Tiers
- [ ] Trabajos con dependencias
- [ ] Sistema de recursos del juego
- [ ] Tienda dinámica por Tier
- [ ] Menu inferior con navegación

### Fase 2
- [ ] Generación procedural de mazmorras
- [ ] Sistema de navegación en mazmorras (Canvas)
- [ ] Jefes y encuentros especiales
- [ ] Progresión de mazmorras

### Fase 3
- [ ] Optimización gráfica
- [ ] Integración de assets Ornyx
- [ ] Sistema de premium/IAP
- [ ] Anuncios (AdMob)
- [ ] Cloud sync

---

## 8. MÉTRICAS DE ÉXITO

- Sesión promedio: 15-30 minutos
- Retención D1: >40%
- Progresión hito: Tier 2 en 2 horas
- Monetización: 1-3% conversion rate (si premium)

---

**Documento versión 1.0**
**Última actualización:** 1 de febrero de 2026
