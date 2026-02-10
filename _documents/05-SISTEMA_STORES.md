# 📦 Sistema de Stores (Pinia)

## Visión General

**Neornate - Idle Dungeon** usa **Pinia** como state management. Cada store representa un aspecto principal del juego:

| Store | Responsabilidad |
|-------|-----------------|
| `gameStore` | Orquestador central, tiempo de juego, pausa/resume |
| `playerStore` | Jugador: stats, clase, nivel, XP |
| `inventoryStore` | Items: stacks, equipamiento, oro |
| `skillsStore` | 7 oficios: nivel, XP, productos activos |
| `marketStore` | Precios, transacciones, historial |

---

## 🎯 gameStore

**Orquestador central del juego.** Coordina la inicialización, guardado y ciclo de vida.

### Estado Principal
```typescript
gameState {
  isInitialized: boolean      // ¿Juego cargado?
  gameStartedAt: number       // Timestamp inicio del juego
  lastSaveTime: number        // Último guardado
  gamePausedAt: number        // 0 si no está pausado
}
```

### Computed
- `gameTime`: Tiempo transcurrido desde el inicio (ms)
- `isPaused`: ¿Juego pausado?

### Actions
```typescript
initializeGame()           // Cargar datos desde localStorage
saveGame()                 // Guardar todos los stores
pauseGame()               // Pausar
resumeGame()              // Reanudar
calculateOfflineProgress() // Calcular progreso offline
resetGame()               // Limpiar todo (DEBUG)
```

### Ejemplo
```typescript
import { useGameStore } from '@/stores'

const gameStore = useGameStore()

// En App.vue montado:
gameStore.initializeGame()

// Guardar periódicamente (cada 30s):
setInterval(() => gameStore.saveGame(), 30000)
```

---

## 👤 playerStore

**Gestiona el jugador: stats, clase, nivel, XP.**

### Estado Principal
```typescript
player: Player {
  id: string
  name: string
  class: PlayerClass           // ej: 'warrior', 'paladin'
  level: number                // 1-120
  experience: number           // XP en nivel actual
  currentTier: Tier            // T1-T7
  stats: Stats {
    maxHealth: number
    maxMana: number
    strength: number
    intelligence: number
    dexterity: number
    defense: number
    magicResist: number
  }
  gold: number
  createdAt: number            // Timestamp creación
  lastActive: number           // Para offline progress
}
```

### Computed
- `classMetadata`: Datos de la clase actual (nombre, bonificaciones, emoji)
- `nextLevelXP`: XP requerido para siguiente nivel
- `xpProgress`: Progreso como porcentaje (0-100)
- `healthPercent`: Salud actual / máxima (porcentaje)
- `manaPercent`: Maná actual / máxima (porcentaje)

### Actions
```typescript
setPlayerName(name: string)          // Cambiar nombre
addExperience(xpAmount: number)      // Ganar XP (auto-levelup)
levelUp()                            // Subir nivel (+stats)
setClass(playerClass: PlayerClass)   // Cambiar clase
updateLastActive()                   // Actualizar timestamp
saveToLocalStorage()                 // Guardar persistencia
loadFromLocalStorage()               // Cargar persistencia
```

### Ejemplo
```typescript
import { usePlayerStore } from '@/stores'

const playerStore = usePlayerStore()

// Ganar XP en minería
playerStore.addExperience(150)  // Auto-levelup si alcanza nextLevelXP

// Cambiar clase a Caballero
playerStore.setClass('knight')

// Ver progreso
console.log(`${playerStore.player.name} Lvl ${playerStore.player.level}`)
console.log(`XP: ${playerStore.xpProgress}%`)
```

---

## 🎒 inventoryStore

**Gestiona items: stacks, equipamiento, oro.**

### Estado Principal
```typescript
inventory: InventoryState {
  items: InventoryStack[] {       // Array de stacks (item + cantidad)
    itemId: string
    quantity: number
    item: Item
  }
  equipment: Record<EquipmentSlot, Equipment> {
    // Slots: head, chest, hands, legs, feet, main_hand, off_hand, ring_1, ring_2, accessory
  }
  gold: number
}
```

### Computed
- `totalSlots`: Número de stacks en inventario
- `equippedItems`: Array de items actualmente equipados

### Actions
```typescript
// Gestión de items
getItemQuantity(itemId: string): number
addItem(item: Item, quantity?: number)
removeItem(itemId: string, quantity?: number): boolean
consumeResources(resources: {itemId, quantity}[]): boolean

// Equipamiento
equipItem(equipment: Equipment, slot: EquipmentSlot)
unequipItem(slot: EquipmentSlot)

// Oro
addGold(amount: number)
spendGold(amount: number): boolean

// Persistencia
saveToLocalStorage()
loadFromLocalStorage()
clear()  // DEBUG
```

### Ejemplo
```typescript
import { useInventoryStore } from '@/stores'
import { EquipmentSlot } from '@/types/Game'

const inventory = useInventoryStore()

// Añadir minerales después de completar ciclo
inventory.addItem(mineral, 3)

// Consumir recursos para crafting
const success = inventory.consumeResources([
  { itemId: 'mineral-id', quantity: 5 },
  { itemId: 'carbon-id', quantity: 2 }
])

// Equipar arma
inventory.equipItem(mySword, EquipmentSlot.MAIN_HAND)

// Verificar oro
if (inventory.spendGold(100)) {
  console.log('Compra realizada')
}
```

---

## ⚒️ skillsStore

**Gestiona los 7 oficios: nivel, XP, ciclos activos.**

### Estado Principal
```typescript
skillStates: Record<Skill, SkillState> {
  // Hay un estado por cada skill: MINERIA, TALA, FUNDICION, etc.
  
  skill: Skill                  // MINERIA, TALA, etc.
  level: number                 // 1-120
  experience: number            // XP en nivel actual
  totalExperience: number       // Acumulada
  tier: Tier                    // T1-T7
  isActive: boolean             // ¿Ciclo en progreso?
  autoComplete: boolean         // ¿Completar automáticamente?
  lastCycleTime: number         // Timestamp último ciclo
  cycleEndTime: number          // Cuándo termina el ciclo actual
  currentProduct?: SkillProduct // Producto siendo generado
  products: SkillProduct[]      // Productos disponibles
}
```

### Computed
- `allSkills`: Array con estado de los 7 skills
- `activeSkills`: Skills que están activos en este momento

### Actions
```typescript
// Consultas
getSkillState(skill: Skill): SkillState
getNextLevelXP(skill: Skill): number
getXPProgress(skill: Skill): number

// Configuración
setSkillProducts(skill: Skill, products: SkillProduct[])
toggleAutoComplete(skill: Skill)

// Ciclos
activateSkill(skill: Skill, product: SkillProduct, cycleDurationMs?: number)
deactivateSkill(skill: Skill)
completeCycle(skill: Skill): CycleResult | null

// Progresión
addExperience(skill: Skill, xpAmount: number)
levelUp(skill: Skill)

// Persistencia
saveToLocalStorage()
loadFromLocalStorage()
```

### Ejemplo
```typescript
import { useSkillsStore } from '@/stores'
import { Skill } from '@/types/Game'

const skills = useSkillsStore()

// Obtener estado de minería
const miningState = skills.getSkillState(Skill.MINERIA)
console.log(`Minería Lvl ${miningState.level}, XP: ${skills.getXPProgress(Skill.MINERIA)}%`)

// Iniciar ciclo de minería (3 segundos)
skills.activateSkill(Skill.MINERIA, mineProduct, 3000)

// En un game loop (cada 100ms aproximadamente):
if (miningState.cycleEndTime <= Date.now()) {
  const result = skills.completeCycle(Skill.MINERIA)
  if (result) {
    console.log(`Ganaste ${result.xpGained} XP!`)
    inventory.addItem(result.product, result.quantity)
  }
  // Auto-reiniciar o parar
  if (miningState.autoComplete) {
    skills.activateSkill(Skill.MINERIA, mineProduct, 3000)
  }
}
```

---

## 🏪 marketStore

**Gestiona precios, transacciones, historial.**

### Estado Principal
```typescript
basePrices: Record<string, number>      // Precios base por itemId
transactionHistory: Transaction[]        // Historial de compras/ventas
vendorListings: MarketListing[]         // Inventario de NPCs

Transaction {
  id: string
  itemId: string
  item: Item
  quantity: number
  pricePerUnit: number
  totalPrice: number
  type: 'buy' | 'sell'
  timestamp: number
}
```

### Computed
- `purchases`: Transacciones de compra
- `sales`: Transacciones de venta
- `totalSpent`: Total gastado
- `totalEarned`: Total ganado
- `netProfit`: Ganancias - Gastos

### Actions
```typescript
// Precios
setBasePrice(itemId: string, price: number)
getBasePrice(itemId: string): number
calculatePrice(itemId: string): number  // TODO: dinámico

// Transacciones
recordPurchase(item: Item, quantity: number, pricePerUnit: number): Transaction
recordSale(item: Item, quantity: number, pricePerUnit: number): Transaction

// Inventario de vendedores
addVendorListing(item: Item, quantity: number, pricePerUnit: number)
getVendorListing(itemId: string): MarketListing | undefined
removeVendorListing(itemId: string, quantity: number): boolean

// Persistencia
saveToLocalStorage()
loadFromLocalStorage()
clearHistory()  // DEBUG
```

### Ejemplo
```typescript
import { useMarketStore } from '@/stores'

const market = useMarketStore()

// Establecer precio base de mineral
market.setBasePrice('mineral-id', 50)

// Vender 10 minerales
const sale = market.recordSale(mineral, 10, 50)
inventory.addGold(sale.totalPrice)

// Comprar 5 lingotes
const purchase = market.recordPurchase(ingot, 5, 100)
inventory.spendGold(purchase.totalPrice)
inventory.addItem(ingot, 5)

// Ver historial
console.log(`Total ganado: ${market.totalEarned}`)
console.log(`Profit neto: ${market.netProfit}`)
```

---

## 🔄 Patrón de Uso Recomendado

### 1. **Inicialización en App.vue**
```typescript
import { useGameStore, usePlayerStore } from '@/stores'

export default {
  setup() {
    const gameStore = useGameStore()
    
    onMounted(() => {
      gameStore.initializeGame()
    })
    
    onUnmount(() => {
      gameStore.saveGame()
    }
  }
}
```

### 2. **Game Loop en View**
```typescript
// En SkillsView.vue o similar
const skills = useSkillsStore()
const inventory = useInventoryStore()

onMounted(() => {
  const interval = setInterval(() => {
    // Actualizar ciclos activos
    for (const skill of skills.activeSkills) {
      if (skill.cycleEndTime <= Date.now()) {
        const result = skills.completeCycle(skill.skill)
        if (result) {
          inventory.addItem(result.product, result.quantity)
        }
      }
    }
  }, 100)  // Actualizar cada 100ms
  
  onUnmount(() => clearInterval(interval))
})
```

### 3. **Acceso desde Componentes**
```typescript
import { usePlayerStore } from '@/stores'

export default {
  setup() {
    const playerStore = usePlayerStore()
    
    const displayName = computed(() => {
      return `${playerStore.player.name} (Lvl ${playerStore.player.level})`
    })
    
    return { displayName, playerStore }
  }
}
```

---

## 📝 Convenciones

### Nombres
- **Actions que modifican**: `add`, `set`, `remove`, `toggle`, `clear`
- **Actions que leen**: `get`
- **Persistencia**: `saveToLocalStorage`, `loadFromLocalStorage`
- **Debugging**: `clear`, `reset`

### Tipos
- Siempre importar tipos de `@/types/`
- Usar interfaces de `SkillState`, `InventoryState`, etc.
- Discriminar tipos con `Skill`, `Tier`, `PlayerClass`, etc.

### Seguridad
- No permitir valores negativos (usar `Math.max(0, value)`)
- Validar cantidades antes de remover items
- Sanity checks para límites (Lvl 120, Tier T7, etc.)

---

## 🚀 Siguientes Pasos

- [ ] Crear UI components para cada store
- [ ] Implementar game loop en App.vue
- [ ] Conectar mercado con compra/venta UI
- [ ] Implementar sistema dinámico de precios
- [ ] Auto-save cada 30 segundos

---

**Última actualización**: 10 de febrero de 2026
