# 🔨 Sistema de Herramientas de Oficios - Neornate Idle Dungeon

## 📋 Concepto General

Las **Herramientas de Oficios** son mejoras especializadas para cada skill (Minería, Tala, Pesca, etc.) que se compran en el mercado y se **equipan permanentemente** al oficio.

A diferencia del equipo de combate (que se equipan al personaje), las herramientas:
- Se asocian a un **oficio específico**
- **No se acumulan** - solo la mejor está activa
- Mejoran **velocidad, cantidad de recursos o XP** del trabajo
- Se compran con **oro del mercado**
- Requieren **alcanzar el nivel correspondiente** en ese oficio

**Filosofía**: Invertir oro en acelerar oficios crea un loop económico que incentiva el balanceo entre dungeon (oro) e idle (herramientas).

---

## 🎯 Estructura General

### Herramientas por Oficio

Cada uno de los **7 oficios** tiene su propia línea de herramientas (T1-T7):

```
MINERÍA (⛏️)
├─ T1: Pico de Cobre      (Nivel Minería 0-20)
├─ T2: Pico de Hierro     (Nivel Minería 20-40)
├─ T3: Pico de Acero      (Nivel Minería 40-60)
├─ T4: Pico de Mithril    (Nivel Minería 60-80)
├─ T5: Pico de Adamantita (Nivel Minería 80-100)
├─ T6: Pico de Orichalco  (Nivel Minería 100-120)
└─ T7: Pico Divino        (Nivel Minería 120+)

TALA (🌲)
├─ T1: Hacha de Madera    (Nivel Tala 0-20)
├─ T2: Hacha de Cobre     (Nivel Tala 20-40)
├─ T3: Hacha de Hierro    (Nivel Tala 40-60)
... [igual estructura]

FUNDICIÓN (🔥)
├─ T1: Horno Básico       (Nivel Fundición 0-20)
├─ T2: Horno de Hierro    (Nivel Fundición 20-40)
... [igual estructura]

PESCA (🎣)
├─ T1: Caña de Bambú      (Nivel Pesca 0-20)
├─ T2: Caña de Madera     (Nivel Pesca 20-40)
... [igual estructura]

COCINA (🍳)
├─ T1: Tabla de Corte Básica    (Nivel Cocina 0-20)
├─ T2: Tabla de Corte de Roble  (Nivel Cocina 20-40)
... [igual estructura]

HERRERÍA (🔨) - Herramienta especial
├─ T1: Yunque Básico      (Nivel Herrería 0-20)
├─ T2: Yunque de Hierro   (Nivel Herrería 20-40)
... [igual estructura]

AVENTURA (🗺️) - Equipable en dungeon
├─ T1: Mochila de Tela    (Nivel Aventura 0-20)
├─ T2: Mochila de Cuero   (Nivel Aventura 20-40)
... [igual estructura]
```

---

## 📊 Escalado por Tier

### Relación Material → Herramienta

El material de la herramienta es el **material top obtenible en ese tier** del oficio correspondiente:

```
MINERÍA:
├─ T1 (produce Cobre)     → Pico de COBRE
├─ T2 (produce Hierro)    → Pico de HIERRO
├─ T3 (produce Acero)     → Pico de ACERO
├─ T4 (produce Mithril)   → Pico de MITHRIL
└─ T5+ → materiales especiales

TALA:
├─ T1 (produce Madera)       → Hacha de MADERA
├─ T2 (produce Roble)        → Hacha de ROBLE
├─ T3 (produce Pino)         → Hacha de PINO
└─ T4+ → maderas exóticas

FUNDICIÓN:
├─ T1 (usa Cobre)      → Horno BÁSICO (piedra)
├─ T2 (usa Hierro)     → Horno DE HIERRO
├─ T3 (usa Acero)      → Horno DE ACERO
└─ T4+ → hornos especializados
```

---

## 🎁 Efectos de Herramientas

### Categorías de Mejora

Cada herramienta puede mejorar **uno o más** aspectos del trabajo:

#### 1. Velocidad (Reduce tiempo del ciclo)

```
Minería sin herramienta: 5 segundos por ciclo
├─ Pico T1: -1s     → 4s por ciclo
├─ Pico T2: -2s     → 3s por ciclo
├─ Pico T3: -3s     → 2s por ciclo
├─ Pico T4: -4s     → 1s por ciclo (límite mínimo)
└─ Pico T5+: Ya no reduce tiempo, suma otros efectos

Tala sin herramienta: 6 segundos por ciclo
├─ Hacha T1: -1.5s  → 4.5s
├─ Hacha T2: -2.5s  → 3.5s
... [similar scaling]
```

**Límite**: No puede bajar de 1s por ciclo (evitar spam infinito).

#### 2. Cantidad (Aumenta recursos por ciclo)

```
Minería sin herramienta: 5 minerales por ciclo
├─ Pico T1: +1      → 6 minerales
├─ Pico T2: +2      → 7 minerales
├─ Pico T3: +3      → 8 minerales
├─ Pico T4: +4      → 9 minerales
└─ Pico T5: +5      → 10 minerales

Tala sin herramienta: 3 madera por ciclo
├─ Hacha T1: +1     → 4 madera
├─ Hacha T2: +2     → 5 madera
... [scaling by tier]
```

**Escalado**: Cada tier suma +1 adicional (acumulativo con otros efectos).

#### 3. Experiencia (Aumenta XP ganada)

```
Sin herramienta: 50 XP por ciclo
├─ Herramienta T1: +10% XP    → 55 XP
├─ Herramienta T2: +20% XP    → 60 XP
├─ Herramienta T3: +30% XP    → 65 XP
├─ Herramienta T4: +40% XP    → 70 XP
└─ Herramienta T5+: +50% XP   → 75 XP

Máximo: +50% XP en T7
```

#### 4. Rareza (Para oficios de crafteo)

Solo aplica a **Fundición, Herrería, Cocina**:

```
Fundición T1 lingote:
├─ Sin horno: 90% common, 10% rare
├─ Horno T1: 80% common, 20% rare
├─ Horno T2: 70% common, 30% rare
├─ Horno T3: 60% common, 40% rare
└─ Horno T5+: 40% common, 60% rare

Herrería (mejora escalada):
├─ Sin yunque: -1% por mejora de rareza
├─ Yunque T1: +1% success rate
├─ Yunque T2: +2% success rate
└─ Yunque T5+: +5% success rate
```

#### 5. Descuento de Materiales (Para Herrería)

Especial para el yunque - reduce costo de mejoras:

```
Sin yunque: Costo base 100%
├─ Yunque T1: -5% costo       → 95%
├─ Yunque T2: -10% costo      → 90%
├─ Yunque T3: -15% costo      → 85%
├─ Yunque T4: -20% costo      → 80%
└─ Yunque T5+: -25% costo     → 75%

Ejemplo:
├─ Mejorar item cuesta 100 minerales
├─ Con Yunque T3: 100 * 0.85 = 85 minerales
```

---

## 💰 Sistema de Precios

### Fórmula de Precio

```
Precio = BasePrecio × (1 + TierMultiplier) × DificultadModificador

BasePrecio = 500 oro (para T1)
TierMultiplier = (Tier - 1) × 1.5
DificultadModificador = 1.2 (para oficios complejos) a 1.0 (simples)
```

### Ejemplos de Precios

#### Minería (SimpleX1.0)
```
Pico T1 (Cobre):   500 oro
Pico T2 (Hierro):  500 × (1 + 0.5) = 750 oro
Pico T3 (Acero):   500 × (1 + 3.0) = 2000 oro
Pico T4 (Mithril): 500 × (1 + 4.5) = 3750 oro
Pico T5:           500 × (1 + 6.0) = 3500 oro
Pico T6:           500 × (1 + 7.5) = 4250 oro
Pico T7:           500 × (1 + 9.0) = 5000 oro
```

#### Herrería (ComplejX1.2)
```
Yunque T1:  500 × 1.2 × (1 + 0)     = 600 oro
Yunque T2:  500 × 1.2 × (1 + 0.5)   = 900 oro
Yunque T3:  500 × 1.2 × (1 + 3.0)   = 2400 oro
Yunque T4:  500 × 1.2 × (1 + 4.5)   = 4500 oro
Yunque T5:  500 × 1.2 × (1 + 6.0)   = 5400 oro
Yunque T6:  500 × 1.2 × (1 + 7.5)   = 6300 oro
Yunque T7:  500 × 1.2 × (1 + 9.0)   = 7200 oro
```

#### Aventura/Dungeon (ComplejX1.2)
```
Mochila T1: 600 oro
Mochila T2: 900 oro
Mochila T3: 2400 oro
... [similar scaling]
```

**Nota**: Los precios están balanceados para que sea **desafiante pero alcanzable** con una mezcla de idle + dungeon.

---

## 🎯 Sistema de Requisitos

### Requisito Único: Nivel del Oficio

Para comprar una herramienta, necesitas alcanzar el **nivel mínimo del tier correspondiente** en ese oficio:

```
Herramienta T1 → Requiere Nivel 0-20   en ese oficio (siempre disponible)
Herramienta T2 → Requiere Nivel 20-40  en ese oficio
Herramienta T3 → Requiere Nivel 40-60  en ese oficio
Herramienta T4 → Requiere Nivel 60-80  en ese oficio
Herramienta T5 → Requiere Nivel 80-100 en ese oficio
Herramienta T6 → Requiere Nivel 100-120 en ese oficio
Herramienta T7 → Requiere Nivel 120+   en ese oficio
```

### Ejemplo Práctico

```
Jugador actual:
├─ Minería Nivel 35
├─ Tala Nivel 10
└─ Pesca Nivel 5

En el Mercado ve:
├─ Pico T1 (Nivel 0+)   ✅ Disponible → Compra
├─ Pico T2 (Nivel 20+)  ✅ Disponible → Compra
├─ Pico T3 (Nivel 40+)  ❌ BLOQUEADO (necesita nivel 40)
├─ Hacha T1 (Nivel 0+)  ✅ Disponible
├─ Hacha T2 (Nivel 20+) ❌ BLOQUEADO (necesita nivel 20)
└─ Caña T1 (Nivel 0+)   ✅ Disponible
```

---

## 🛠️ Gestión de Herramientas Equipadas

### Una Sola Activa por Oficio

Solo **la mejor herramienta** está activa. Si compras una herramienta de menor tier, no reemplaza la actual.

```
Progresión de Minería:
├─ Compras Pico T1 → Se equipa automáticamente
├─ Trabajas con +1s velocidad
├─ Subes a Nivel 20
├─ Compras Pico T2 → Reemplaza automáticamente Pico T1
├─ Trabaja con +2s velocidad
├─ Compras Pico T1 nuevamente (accidentalmente)
│  └─ ❌ NO se equipa (es inferior a T2)
│  └─ Se descarta o entra al inventario como item
└─ Sigues con Pico T2
```

### Lógica de Reemplazo

```typescript
interface ToolEquipped {
  skillId: string           // "mining", "woodcutting", etc.
  toolId: string           // "pickaxe_iron"
  tier: number             // 2
  effects: ToolEffect[]    // [speed -2s, quantity +2, xp +20%]
}

// Al comprar herramienta:
if (newTool.tier > currentEquipped.tier) {
  equipTool(newTool)       // Reemplaza automáticamente
  unequipTool(currentTool) // La anterior se desactiva
} else {
  addToInventory(newTool)  // Va al inventario si es inferior
}
```

---

## 📋 Vista de Mejoras Activas

Nueva view dedicada (`EquipmentBoostsView.vue` o `ToolsView.vue`) que muestra:

### Información Mostrada

```
┌─────────────────────────────────────┐
│      MEJORAS DE OFICIOS ACTIVAS     │
├─────────────────────────────────────┤
│                                     │
│ ⛏️ MINERÍA (Nivel 45)               │
│ ├─ Herramienta: Pico de Acero (T3) │
│ ├─ Velocidad: -3s por ciclo        │
│ ├─ Cantidad: +3 minerales          │
│ ├─ XP: +30% experiencia            │
│ └─ Próxima mejora: Pico T4 (2400o) │
│                                     │
│ 🌲 TALA (Nivel 22)                  │
│ ├─ Herramienta: Hacha de Hierro(T2)│
│ ├─ Velocidad: -2s por ciclo        │
│ ├─ Cantidad: +2 madera             │
│ ├─ XP: +20% experiencia            │
│ └─ Próxima mejora: Hacha T3 (2000o)│
│                                     │
│ 🔥 FUNDICIÓN (Nivel 10)             │
│ ├─ Herramienta: NO EQUIPADA        │
│ ├─ Rareza: Sin mejora (90% common) │
│ └─ Próxima: Horno T1 (600o)        │
│                                     │
│ 🎣 PESCA (Nivel 5)                  │
│ ├─ Herramienta: Caña de Bambú (T1) │
│ ├─ Velocidad: -1s por ciclo        │
│ ├─ Cantidad: +1 pez                │
│ └─ Próxima: Caña T2 (750o)         │
│                                     │
└─────────────────────────────────────┘
```

### Secciones de la View

#### Sección Superior: Resumen Global
```
Total de mejoras activas: 4/7
├─ Velocidad promedio acelerada: -10.5s
├─ Oro invertido en herramientas: 1850
└─ Siguientes herramientas más cercanas:
   ├─ Pico T4 (50 minería/100)
   ├─ Hacha T3 (20 tala/40)
   └─ Horno T1 (60 fundición/100)
```

#### Sección Media: Detalles por Oficio
- Nombre del oficio + emoji
- Nivel actual en ese oficio
- **Si tiene herramienta**:
  - Nombre y tier de herramienta
  - Todos sus efectos listados
  - Próxima herramienta disponible + precio
- **Si NO tiene herramienta**:
  - "Sin herramienta equipada"
  - Primera herramienta disponible + precio + requisitos

#### Sección Inferior: Recomendaciones
```
Sugerencias de Compra:
├─ Urgente: Pico T3 (Minería Lvl 40) - Te falta 5 niveles
├─ Cercano: Hacha T2 (Tala Lvl 20) - Lo desbloqueas pronto
└─ Después: Yunque T1 (Herrería) - Mejora costes de forge
```

---

## 🔄 Integración con Otros Sistemas

### Relación con Mercado

```
MERCADO (MarketView.vue)
├─ Pestaña "Equipo": Items de combate (espadas, armaduras)
├─ Pestaña "Herramientas": Herramientas de oficios ✨ NUEVA
│   ├─ Filtro por oficio
│   ├─ Mostrar solo disponibles (cumple nivel)
│   ├─ Ver efectos de herramienta
│   └─ Botón "Comprar" + confirmación
├─ Pestaña "Consumibles": Pociones, buff
└─ Pestaña "Miscelánea": Otros items

Una vez comprada herramienta:
├─ Se equipa automáticamente (si es mejor)
└─ Desaparece del mercado (no se muestra como disponible)
```

### Relación con Oficios (SkillsView.vue)

```
En cada tarjeta de oficio mostrar:

┌──────────────────────────┐
│ ⛏️ MINERÍA (Nivel 45)     │
├──────────────────────────┤
│ XP: 450/500 ████████░    │
│                          │
│ Ciclo: 5s → 2s (-3s)    │
│ Recurso: 5 → 8 (+3)     │
│ XP Base: 50 → 65 (+30%) │
│                          │
│ Herramienta: Pico T3    │
│ [Ver mejoras] [Mercado] │
└──────────────────────────┘
```

### Relación con Inventario

```
Si el jugador compra una herramienta que es INFERIOR a la equipada:
├─ Se añade al inventario como item apilable
├─ Muestra en InventoryView como "Herramientas Extras"
└─ Se puede vender en el mercado (devuelve 80% del precio)

Ejemplo:
├─ Tienes Pico T2 equipado
├─ Compras Pico T1 accidentalmente
├─ Va al inventario como "Pico de Cobre x1"
├─ Puedes: Vender (400 oro) o Descartar
```

---

## 📊 TypeScript Types

### Tipos Principales

```typescript
// src/types/Tool.ts

export interface Tool {
  id: string                    // "pickaxe_copper", "axe_iron"
  name: string                  // "Pico de Cobre"
  skillId: SkillId              // "mining", "woodcutting", etc.
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7
  baseMaterial: string          // "copper", "iron"
  description: string
  icon: string                  // Emoji o ruta de asset
  price: number                 // En oro
  requiredLevel: number         // Nivel mínimo del oficio
  effects: ToolEffect[]
}

export interface ToolEffect {
  type: 'speed' | 'quantity' | 'xp' | 'rarity' | 'discount'
  value: number                 // -2 (segundos), +3 (cantidad), 0.3 (30% XP)
  description: string           // Para mostrar en UI
}

export interface ToolEquipped {
  toolId: string
  skillId: SkillId
  tier: number
  equippedAt: number           // timestamp
  effects: ToolEffect[]
}

// En skillsStore.ts:
export interface SkillState {
  // ... existing fields
  equippedTools: Map<SkillId, ToolEquipped>  // Una por oficio
}

// En inventoryStore.ts:
export interface InventoryItem {
  // ... existing fields
  isTool?: boolean              // Si es herramienta extra
  toolId?: string
}
```

### Pinia Store para Herramientas

```typescript
// src/stores/toolsStore.ts

export const useToolsStore = defineStore('tools', () => {
  const equippedTools = ref<Map<SkillId, ToolEquipped>>(new Map())
  const availableTools = computed(() => {
    // Retorna tools que el jugador puede comprar (cumple nivel)
  })
  
  const equipTool = (tool: Tool, skillId: SkillId) => {
    // Reemplaza si es mejor que la actual
  }
  
  const buyTool = (toolId: string) => {
    // Compra desde mercado
    // Deduce oro
    // Equipa si es mejor
  }
  
  const getToolEffects = (skillId: SkillId) => {
    // Retorna efectos aplicados al oficio
  }
  
  const calculateBonuses = (skillId: SkillId) => {
    // Calcula velocidad, cantidad, XP aplicada
    return { speedBonus, quantityBonus, xpBonus }
  }
  
  return {
    equippedTools,
    availableTools,
    equipTool,
    buyTool,
    getToolEffects,
    calculateBonuses
  }
})
```

---

## 🎨 Componentes Vue Nuevos

### Componentes Necesarios

```
src/components/tools/
├─ ToolCard.vue              # Muestra herramienta individual
├─ ToolEffects.vue           # Lista de efectos
├─ ToolEquippedBadge.vue     # Badge "Equipado"
├─ ToolMarketSection.vue     # Sección herramientas en mercado
└─ ToolComparison.vue        # Comparar actual vs siguiente

src/views/
├─ ToolsBoostsView.vue       # ✨ NUEVA - Muestra todas mejoras activas
└─ MarketView.vue            # ACTUALIZAR - Agregar sección de herramientas
```

### Flujo de UX

```
1. Jugador abre MERCADO
   ├─ Ve pestaña "Herramientas"
   ├─ Filtra por oficio (Minería, Tala, etc.)
   ├─ Ve herramientas disponibles + precio
   └─ Click "Comprar" → Confirmación

2. Compra Herramienta
   ├─ Si es mejor: Se equipa automáticamente
   └─ Si es peor: Va a inventario

3. Abre MEJORAS ACTIVAS (nueva view)
   ├─ Ve todas las herramientas equipadas
   ├─ Muestra efectos de cada una
   ├─ Ver próxima herramienta a desbloquear
   └─ Click a oficio → Va a SkillsView

4. En SKILLS VIEW
   ├─ Ve efecto de herramienta en tiempo real
   ├─ Ciclo reducido
   ├─ Recursos aumentados
   └─ Link a "Mejorar en Mercado"
```

---

## ⚖️ Balance y Economía

### Ciclo Económico

```
Ganas oro en Dungeon
├─ Enemigos → 100-500 oro
├─ Bosses → 1000-5000 oro
└─ Loot raro vendido → 500-2000 oro

Gastas oro en Herramientas
├─ T1-T3 (primeras 60 niveles): 600-2500 oro c/u
├─ T4-T5 (progreso tardío): 3000-5500 oro c/u
└─ T6-T7 (endgame): 6000+ oro c/u

Beneficio de Herramientas
├─ Minería +30% velocidad = +30% recursos/hora
├─ Eso = +30% oro en vendidas
└─ ROI en ~1-2 horas de minería
```

### Progresión Recomendada

```
Temprano (Levels 1-20):
├─ No gastes en herramientas (fondos limitados)
├─ Gasta en equipo de combate
└─ Ojo: Primera herramienta T1 es muy barata (500 oro)

Medio (Levels 20-60):
├─ Compra herramientas cada 2-3 tiers
├─ Mix dungeon + idle para fondos
├─ Herramientas aceleran progreso
└─ Yunque (T1-T3) importante para forge

Tardío (Levels 60+):
├─ Herramientas T4-T7 son caras pero muy potentes
├─ +50% velocidad en oficios finales
├─ Investir en herramientas = Poder exponencial
└─ Endgame: Todas las herramientas equipadas
```

---

## 🧮 Ejemplos Numéricos Completos

### Ejemplo: Minería Progresiva

```
ESTADO INICIAL (Nivel 1 Minería)
├─ Herramienta: NINGUNA
├─ Ciclo: 5 segundos
├─ Recurso: 5 cobre por ciclo
├─ XP: 50 por ciclo
└─ Precio de herramienta T1: 500 oro

COMPRA PICO T1 (500 oro)
├─ Herramienta: Pico de Cobre
├─ Ciclo: 5s - 1s = 4s (20% más rápido)
├─ Recurso: 5 + 1 = 6 cobre por ciclo (20% más)
├─ XP: 50 × 1.1 = 55 por ciclo (10% más)
└─ Beneficio: +20% producción total

PROGRESA A NIVEL 20 → COMPRA PICO T2 (750 oro)
├─ Herramienta: Pico de Hierro (reemplaza T1)
├─ Ciclo: 5s - 2s = 3s (40% más rápido)
├─ Recurso: 5 + 2 = 7 cobre por ciclo
├─ XP: 50 × 1.2 = 60 por ciclo
└─ Beneficio acumulativo: +40% producción

PROGRESA A NIVEL 40 → COMPRA PICO T3 (2000 oro)
├─ Herramienta: Pico de Acero
├─ Ciclo: 5s - 3s = 2s (60% más rápido)
├─ Recurso: 5 + 3 = 8 cobre por ciclo
├─ XP: 50 × 1.3 = 65 por ciclo
└─ Beneficio acumulativo: +60% producción
└─ Total invertido: 500 + 750 + 2000 = 3250 oro
```

### Impacto en Velocidad

```
Sin herramientas (basal):
├─ Minería: 5s/ciclo = 12 ciclos/min = 60 cobre/min
├─ Con Pico T3: 2s/ciclo = 30 ciclos/min = 240 cobre/min
└─ Aumento: 4x más rápido (300% mejora)

Equivalente a: 3 jugadores minando simultáneamente sin herramienta
```

---

## 📝 Implementación Faseada

### Fase 1: Core Sistema
- [ ] Crear tipos en `src/types/Tool.ts`
- [ ] Crear `toolsStore.ts` con lógica base
- [ ] Agregar herramientas a `data/toolsData.ts`
- [ ] Integrar en `skillsStore.ts` efectos de herramientas
- [ ] Tests unitarios de cálculos

### Fase 2: UI Mercado
- [ ] Componentes `ToolCard.vue`, `ToolEffects.vue`
- [ ] Sección herramientas en `MarketView.vue`
- [ ] Filtrado por oficio
- [ ] Botón comprar + confirmación

### Fase 3: UI Mejoras Activas
- [ ] Crear `ToolsBoostsView.vue` (nueva view)
- [ ] Agregar ruta en router
- [ ] Mostrar herramientas equipadas
- [ ] Mostrar efectos activos
- [ ] Sugerencias de próximas compras

### Fase 4: Integración Completa
- [ ] Badges en SkillsView mostrando herramienta
- [ ] Integración con InventoryView (herramientas extra)
- [ ] i18n para todos los nombres y descripciones
- [ ] Animaciones de equip/desquip

---

## 🌍 i18n Estrutura

```json
{
  "tools": {
    "title": "Herramientas de Oficios",
    "equipped": "Equipada",
    "notEquipped": "Sin equipar",
    "effects": {
      "speed": "Velocidad",
      "quantity": "Cantidad",
      "xp": "Experiencia",
      "rarity": "Rareza",
      "discount": "Descuento"
    },
    "mining": {
      "pickaxe_copper": "Pico de Cobre",
      "pickaxe_iron": "Pico de Hierro",
      ...
    },
    "woodcutting": {
      "axe_wood": "Hacha de Madera",
      ...
    }
  }
}
```

---

**Documento Completado**: 13 de febrero de 2026  
**Versión**: 1.0.0  
**Estado**: Arquitectura completa lista para implementación  
**Próximo Paso**: Crear `toolsStore.ts` y componentes UI
