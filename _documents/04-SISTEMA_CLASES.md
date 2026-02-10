# 🎭 Sistema de Clases Progresivo

## Descripción General

El sistema de clases en Neornate - Idle Dungeon es **progresivo y ramificado**:

- **T1-T2**: Un único personaje con una clase base (Guerrero, Ladrón, Mago)
- **T3-T7**: El jugador elige entre 2-4 especializaciones en cada tier, creando múltiples caminos de progresión

**Filosofía**: Un jugador, un personaje, múltiples caminos de especialización.

---

## Árbol de Clases

### Rama Guerrera

```
T1: Guerrero (⚔️)
    ↓
T2: Caballero (🛡️)
    ├─ T3: Paladín (✨)
    │   └─ T4: Dragoon (🐉)
    └─ T3: Centurión (🏛️)
        └─ T4: Gladiador (⚡)
```

### Rama Pícara

```
T1: Ladrón (🗡️)
    ↓
T2: Errante (🌍)
    ├─ T3: Maestro de Batalla (🎖️)
    │   └─ T4: Hoja Rúnica (📜)
    └─ T3: Creador de Sombras (🌑)
        └─ T4: Espadachín Mágico (✧) [Híbrido Ladrón/Mago]
```

### Rama Mágica

```
T1: Mago (🧙)
    ↓
T2: Brujo (👁️)
    ├─ T3: Mago de la Corte (👑)
    │   └─ T4: Espadachín Mágico (✧) [Híbrido Ladrón/Mago]
    ├─ T3: Místico (🌿)
    │   └─ T4: Druida (🍃)
    └─ T3: Piromante (🔥)
        └─ T4: Archimante (⚡)
```

---

## Estructura de Datos

### Enumeraciones

```typescript
// Clases Base (T1-T2)
export enum BaseClass {
  WARRIOR = 'warrior',
  ROGUE = 'rogue',
  MAGE = 'mage',
}

// Clases Especializadas (T3+)
export enum SpecializedClass {
  // Rama Guerrera
  KNIGHT = 'knight',
  PALADIN = 'paladin',
  DRAGOON = 'dragoon',
  CENTURION = 'centurion',
  GLADIATOR = 'gladiator',
  
  // Rama Pícara
  WANDERER = 'wanderer',
  BATTLE_MASTER = 'battle_master',
  SHADOW_WEAVER = 'shadow_weaver',
  RUNE_BLADE = 'rune_blade',
  MAGIC_SWORDSMAN = 'magic_swordsman', // Híbrido (T4) - accesible desde Ladrón o Mago
  
  // Rama Mágica
  WARLOCK = 'warlock',
  COURT_MAGE = 'court_mage',
  MYSTIC = 'mystic',
  DRUID = 'druid',
  PYROMANCER = 'pyromancer',
  ARCHIMANTE = 'archimante', // Evolución de Piromante
}

// Tipo unificado para cualquier clase
export type PlayerClass = BaseClass | SpecializedClass
```

### Metadatos de Clase

Cada clase tiene metadatos que incluyen:

```typescript
export interface ClassMetadata {
  displayName: string          // Nombre visual (localizado vía i18n)
  description: string          // Descripción de la clase
  emoji: string                // Emoji para UI
  baseClass: BaseClass         // Clase base a la que pertenece
  unlockTier: Tier            // Tier en el que se desbloquea
  stats: {                     // Bonificadores de stats
    strengthBonus: number
    intelligenceBonus: number
    dexterityBonus: number
    defenseBonus: number
    magicResistBonus: number
  }
}
```

### Mapeo: Árbol de Clases

```typescript
export const CLASS_TREES: Record<BaseClass, Record<Tier, SpecializedClass[]>> = {
  [BaseClass.WARRIOR]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.KNIGHT],
    [Tier.T3]: [SpecializedClass.PALADIN, SpecializedClass.CENTURION],
    [Tier.T4]: [SpecializedClass.DRAGOON, SpecializedClass.GLADIATOR],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
  [BaseClass.ROGUE]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.WANDERER],
    [Tier.T3]: [SpecializedClass.BATTLE_MASTER, SpecializedClass.SHADOW_WEAVER],
    [Tier.T4]: [SpecializedClass.RUNE_BLADE, SpecializedClass.MAGIC_SWORDSMAN],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
  [BaseClass.MAGE]: {
    [Tier.T1]: [],
    [Tier.T2]: [SpecializedClass.WARLOCK],
    [Tier.T3]: [SpecializedClass.COURT_MAGE, SpecializedClass.MYSTIC, SpecializedClass.PYROMANCER],
    [Tier.T4]: [SpecializedClass.DRUID, SpecializedClass.ARCHIMANTE, SpecializedClass.MAGIC_SWORDSMAN],
    [Tier.T5]: [],
    [Tier.T6]: [],
    [Tier.T7]: [],
  },
}

/**
 * Mapeo de evoluciones específicas: clase anterior → clases posibles en siguiente tier
 * Permite restringir evoluciones a rutas específicas (ej: Mago de la Corte solo → Espadachín Mágico)
 */
export const SPECIFIC_EVOLUTIONS: Record<SpecializedClass, SpecializedClass[]> = {
  // Rama Guerrera
  [SpecializedClass.KNIGHT]: [SpecializedClass.PALADIN, SpecializedClass.CENTURION],
  [SpecializedClass.PALADIN]: [SpecializedClass.DRAGOON],
  [SpecializedClass.CENTURION]: [SpecializedClass.GLADIATOR],
  
  // Rama Pícara
  [SpecializedClass.WANDERER]: [SpecializedClass.BATTLE_MASTER, SpecializedClass.SHADOW_WEAVER],
  [SpecializedClass.BATTLE_MASTER]: [SpecializedClass.RUNE_BLADE],
  [SpecializedClass.SHADOW_WEAVER]: [SpecializedClass.MAGIC_SWORDSMAN],
  
  // Rama Mágica
  [SpecializedClass.WARLOCK]: [SpecializedClass.COURT_MAGE, SpecializedClass.MYSTIC, SpecializedClass.PYROMANCER],
  [SpecializedClass.COURT_MAGE]: [SpecializedClass.MAGIC_SWORDSMAN],  // Solo Espadachín Mágico
  [SpecializedClass.MYSTIC]: [SpecializedClass.DRUID],
  [SpecializedClass.PYROMANCER]: [SpecializedClass.ARCHIMANTE],
  
  // T4+ (final sin más evoluciones)
  [SpecializedClass.DRAGOON]: [],
  [SpecializedClass.GLADIATOR]: [],
  [SpecializedClass.RUNE_BLADE]: [],
  [SpecializedClass.MAGIC_SWORDSMAN]: [],
  [SpecializedClass.DRUID]: [],
  [SpecializedClass.ARCHIMANTE]: [],
}
```

---

## Funciones de Utilidad

### 1. `getClassMetadata(playerClass: PlayerClass): ClassMetadata | undefined`

Obtiene los metadatos de una clase.

```typescript
const knightMeta = getClassMetadata(SpecializedClass.KNIGHT)
console.log(knightMeta?.displayName) // "Caballero"
console.log(knightMeta?.emoji) // "🛡️"
```

### 2. `isBaseClass(playerClass: PlayerClass): playerClass is BaseClass`

Verifica si es una clase base.

```typescript
if (isBaseClass(PlayerClass.WARRIOR)) {
  // Es clase base
}
```

### 3. `isSpecializedClass(playerClass: PlayerClass): playerClass is SpecializedClass`

Verifica si es una clase especializada.

```typescript
if (isSpecializedClass(SpecializedClass.PALADIN)) {
  // Es clase especializada
}
```

### 4. `getBaseClassForPlayer(playerClass: PlayerClass): BaseClass`

Obtiene la clase base de cualquier clase (base o especializada).

```typescript
const base = getBaseClassForPlayer(SpecializedClass.PALADIN)
console.log(base) // BaseClass.WARRIOR
```

### 5. `getAvailableSpecializations(baseClass: BaseClass, tier: Tier): SpecializedClass[]`

Obtiene las especializaciones disponibles para un tier específico.

```typescript
const t3Options = getAvailableSpecializations(BaseClass.WARRIOR, Tier.T3)
// [SpecializedClass.PALADIN, SpecializedClass.CENTURION]

const t4Options = getAvailableSpecializations(BaseClass.WARRIOR, Tier.T4)
// [SpecializedClass.DRAGOON, SpecializedClass.GLADIATOR]
```

### 6. `canEvolveToClass(currentTier: Tier, currentClass: PlayerClass, targetClass: SpecializedClass, targetTier: Tier): boolean`

Valida si un jugador puede evolucionar a una clase considerando evoluciones específicas.

```typescript
const canEvolve = canEvolveToClass(
  Tier.T2,
  BaseClass.WARRIOR,
  SpecializedClass.PALADIN,
  Tier.T3
)
// true - el Guerrero puede evolucionar a Paladín en T3

// Ejemplo con clase especializada:
const canEvolveSpecific = canEvolveToClass(
  Tier.T3,
  SpecializedClass.COURT_MAGE,
  SpecializedClass.MAGIC_SWORDSMAN,
  Tier.T4
)
// true - Mago de la Corte SOLO puede evolucionar a Espadachín Mágico
```

### 7. `getNextClassOptions(currentClass: PlayerClass, nextTier: Tier): SpecializedClass[]`

Obtiene las opciones de evolución disponibles para la clase actual.

```typescript
// Desde clase base
const warriorOptions = getNextClassOptions(BaseClass.WARRIOR, Tier.T2)
// [SpecializedClass.KNIGHT]

// Desde clase especializada
const knightOptions = getNextClassOptions(SpecializedClass.KNIGHT, Tier.T3)
// [SpecializedClass.PALADIN, SpecializedClass.CENTURION]

// Con evolución restringida
const courtMageOptions = getNextClassOptions(SpecializedClass.COURT_MAGE, Tier.T4)
// [SpecializedClass.MAGIC_SWORDSMAN] (solo una opción)
```

---

## Ejemplo de Uso en Stores

### En `playerStore.ts`

```typescript
import { usePlayerStore } from '@/stores/playerStore'
import { 
  getClassMetadata, 
  getBaseClassForPlayer, 
  getAvailableSpecializations,
  canEvolveToClass 
} from '@/types/Player'

export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player>(createPlayer('id-1', 'Aventurero', BaseClass.WARRIOR))

  // Obtener metadatos de clase actual
  const currentClassMetadata = computed(() => {
    return getClassMetadata(player.value.class)
  })

  // Evolucionar a nueva clase
  const evolveToClass = (targetClass: SpecializedClass) => {
    const nextTier = getNextTier(player.value.currentTier)
    
    if (canEvolveToClass(
      player.value.currentTier,
      player.value.class,
      targetClass,
      nextTier
    )) {
      player.value.class = targetClass
      player.value.currentTier = nextTier
      
      // Aplicar bonificadores de stats
      const metadata = getClassMetadata(targetClass)
      if (metadata) {
        player.value.stats.strength += metadata.stats.strengthBonus
        // ... etc
      }
    }
  }

  // Obtener opciones disponibles para siguiente tier
  const getNextTierOptions = computed(() => {
    const nextTier = getNextTier(player.value.currentTier)
    const baseClass = getBaseClassForPlayer(player.value.class)
    return getAvailableSpecializations(baseClass, nextTier)
  })

  return { player, currentClassMetadata, evolveToClass, getNextTierOptions }
})
```

---

## Integración con i18n

Los nombres y descripciones de clases deben estar localizados. Ejemplo de estructura:

```json
// src/locales/es.json
{
  "classes": {
    "baseClass": {
      "warrior": {
        "name": "Guerrero",
        "description": "Maestro del combate cercano. Especialista en fuerza bruta."
      },
      "rogue": {
        "name": "Ladrón",
        "description": "Ágil y astuto. Especialista en ataque rápido y evasión."
      },
      "mage": {
        "name": "Mago",
        "description": "Maestro de la magia arcana. Especialista en daño a distancia."
      }
    },
    "specialized": {
      "paladin": {
        "name": "Paladín",
        "description": "Caballero sagrado que mezcla fuerza física con magia divina."
      },
      // ... más clases
    }
  }
}
```

**En componentes Vue**:

```vue
<template>
  <div class="class-info">
    <h2>{{ t(`classes.specialized.${currentClass}`) }}</h2>
    <p>{{ t(`classes.descriptions.${currentClass}`) }}</p>
  </div>
</template>
```

---

## Consideraciones de Desarrollo

### TypeScript Type Safety

- Usar discriminated unions: `PlayerClass = BaseClass | SpecializedClass`
- Aprovechar type guards para narrowing
- Nunca usar `any` en el sistema de clases

### Performance

- Los metadatos de clase son datos estáticos (no cambian durante runtime)
- Usar `computed()` en Vue para derivar información de clase
- Cachear llamadas a `getClassMetadata()` si se usan frecuentemente

### Validación

- Siempre validar con `canEvolveToClass()` antes de permitir evolución
- Verificar tier actual contra tier requerido
- Verificar que la clase base coincida

### Clases Híbridas: Espadachín Mágico

El **Espadachín Mágico** es una clase especial accesible desde dos ramas distintas:

- Desde **Ladrón**: Creador de Sombras (T3) → Espadachín Mágico (T4)
- Desde **Mago**: Mago de la Corte (T3) → Espadachín Mágico (T4)

**Cómo funciona en el código**:

1. `CLASS_TREES` incluye `MAGIC_SWORDSMAN` tanto en `ROGUE[T4]` como en `MAGE[T4]`
2. `SPECIFIC_EVOLUTIONS` mapea:
   - `[SHADOW_WEAVER] → [MAGIC_SWORDSMAN]` (rama Ladrón)
   - `[COURT_MAGE] → [MAGIC_SWORDSMAN]` (rama Mago)
3. `canEvolveToClass()` valida que el jugador venga de una de esas dos clases
4. `getNextClassOptions()` retorna `[MAGIC_SWORDSMAN]` solo si el jugador es `SHADOW_WEAVER` o `COURT_MAGE`

**Nota para T5+**: Esta arquitectura permite evoluciones convergentes donde distintas ramas pueden desembocar en una clase superior única.

---

## Casos de Uso Frecuentes

### 1. Mostrar Información de Clase en UI

```typescript
const metadata = getClassMetadata(player.class)
console.log(`${metadata?.emoji} ${metadata?.displayName}`)
```

### 2. Obtener Bonificadores de Stats

```typescript
const metadata = getClassMetadata(player.class)
const statBonus = metadata?.stats.strengthBonus ?? 0
```

### 3. Mostrar Próximas Opciones de Evolución

```typescript
const nextTier = getNextTier(player.currentTier)
const baseClass = getBaseClassForPlayer(player.class)
const options = getAvailableSpecializations(baseClass, nextTier)

// UI: Mostrar 2-4 opciones para evolucionar
options.forEach(specClass => {
  const meta = getClassMetadata(specClass)
  console.log(`${meta?.emoji} ${meta?.displayName}`)
})
```

### 4. Validar Evolución en Acción

```typescript
const targetClass = SpecializedClass.PALADIN

if (canEvolveToClass(player.currentTier, player.class, targetClass, nextTier)) {
  evolveToClass(targetClass)
} else {
  showError('No puedes evolucionar a esta clase')
}
```

---

## Pendiente: Integración Completa

- [ ] Crear stores de Pinia con funciones de evolución
- [ ] Crear componentes Vue para seleccionar clase
- [ ] Localizar todos los nombres/descripciones de clase
- [ ] Aplicar bonificadores de stats al evolucionar
- [ ] Guardar evolución en localStorage/persistencia
- [ ] Tests unitarios para validación de evolución

---

**Última actualización**: Febrero 10, 2026  
**Autor**: Sistema de Clases Neornate  
**Estado**: ✅ Completo - Listo para UI/Store integration
