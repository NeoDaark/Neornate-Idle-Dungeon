# 📚 Ejemplos de Integración con Stores

Este documento muestra cómo usar los 5 stores principales en tus componentes Vue.

---

## 1. usePlayerStore - Gestionar Jugador

```typescript
import { usePlayerStore } from '@/stores'

export default {
  setup() {
    const playerStore = usePlayerStore()

    // Leer datos del jugador
    const name = playerStore.player.name
    const level = playerStore.player.level
    const xpProgress = playerStore.xpProgress  // Computed: 0-100

    // Ganar experiencia (sube automáticamente si alcanza nextLevelXP)
    playerStore.addExperience(150)

    // Cambiar clase
    playerStore.setClass('knight')  // Aplica bonificaciones

    // Actualizar cuando el usuario se va
    playerStore.updateLastActive()

    return { name, level, xpProgress }
  }
}
```

---

## 2. useInventoryStore - Gestionar Inventario

```typescript
import { useInventoryStore } from '@/stores'
import { EquipmentSlot } from '@/types/Game'
import type { Item, Equipment } from '@/types/Item'

export default {
  setup() {
    const inventory = useInventoryStore()

    // Añadir items
    const mineral: Item = { /* ... */ }
    inventory.addItem(mineral, 5)  // 5 minerales

    // Obtener cantidad de un item
    const quantity = inventory.getItemQuantity('mineral-id')

    // Consumir recursos (para crafting)
    const canCraft = inventory.consumeResources([
      { itemId: 'mineral-id', quantity: 3 },
      { itemId: 'carbon-id', quantity: 1 }
    ])

    if (canCraft) {
      // Crear el item crafteado
      inventory.addItem(ingot, 1)
    }

    // Equipamiento
    const sword: Equipment = { /* ... */ }
    inventory.equipItem(sword, EquipmentSlot.MAIN_HAND)

    // Oro
    inventory.addGold(100)
    const canBuy = inventory.spendGold(50)  // Retorna boolean

    return { quantity, inventory }
  }
}
```

---

## 3. useSkillsStore - Gestionar Oficios

```typescript
import { useSkillsStore } from '@/stores'
import { Skill } from '@/types/Game'

export default {
  setup() {
    const skills = useSkillsStore()

    // Obtener estado de un skill
    const miningState = skills.getSkillState(Skill.MINERIA)
    const level = miningState.level
    const xpProgress = skills.getXPProgress(Skill.MINERIA)

    // Establecer productos disponibles
    skills.setSkillProducts(Skill.MINERIA, [
      { id: 'stone', name: 'Piedra', /* ... */ },
      { id: 'copper', name: 'Cobre', level: 10, /* ... */ }
    ])

    // Iniciar ciclo (skill activo)
    const mineProduct = miningState.products[0]  // Piedra
    skills.activateSkill(Skill.MINERIA, mineProduct, 3000)  // 3 segundos

    // Completar ciclo cuando cycleEndTime <= Date.now()
    const result = skills.completeCycle(Skill.MINERIA)
    if (result) {
      console.log(`¡Ganaste ${result.xpGained} XP!`)
      console.log(`Producto: ${result.product.name} x${result.quantity}`)
    }

    // Auto-complete
    skills.toggleAutoComplete(Skill.MINERIA)

    return { level, xpProgress, miningState }
  }
}
```

---

## 4. useMarketStore - Gestionar Mercado

```typescript
import { useMarketStore } from '@/stores'
import type { Item } from '@/types/Item'

export default {
  setup() {
    const market = useMarketStore()

    // Establecer precios base de items
    market.setBasePrice('mineral-id', 50)
    market.setBasePrice('ingot-id', 100)

    // Vender items (granja -> jugador + oro)
    const mineral: Item = { /* ... */ }
    const sale = market.recordSale(mineral, 10, 50)
    // Jugador gana oro: sale.totalPrice

    // Comprar items (jugador -> tienda - oro)
    const ingot: Item = { /* ... */ }
    const purchase = market.recordPurchase(ingot, 5, 100)
    // Jugador pierde oro: purchase.totalPrice

    // Ver estadísticas
    const totalSpent = market.totalSpent      // Total gastado
    const totalEarned = market.totalEarned    // Total ganado
    const profit = market.netProfit           // Diferencia

    return { market, totalSpent, totalEarned, profit }
  }
}
```

---

## 5. useGameStore - Orquestador Central

```typescript
import { useGameStore } from '@/stores'

export default {
  setup() {
    const gameStore = useGameStore()

    // Juego pausado?
    const isPaused = gameStore.isPaused

    // Pausar/Reanudar
    gameStore.pauseGame()
    gameStore.resumeGame()

    // Guardar manualmente
    gameStore.saveGame()

    // Tiempo transcurrido (ms)
    const gameTime = gameStore.gameTime

    return { isPaused, gameTime }
  }
}
```

---

## 6. Game Loop - Actualización de Ciclos

Este es el patrón recomendado para mantener actualizados los ciclos de skills:

```typescript
import { useSkillsStore } from '@/stores'
import { useInventoryStore } from '@/stores'
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const skills = useSkillsStore()
    const inventory = useInventoryStore()

    let gameLoopInterval: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
      gameLoopInterval = setInterval(() => {
        // Actualizar cada 100ms (10 veces por segundo)
        for (const activeSkill of skills.activeSkills) {
          // Verificar si el ciclo terminó
          if (activeSkill.cycleEndTime <= Date.now()) {
            // Completar ciclo
            const result = skills.completeCycle(activeSkill.skill)

            if (result) {
              // Añadir item al inventario
              inventory.addItem(result.product, result.quantity)
              console.log(`${activeSkill.skill}: +${result.quantity} ${result.product.name}`)
            }

            // Auto-reiniciar si está habilitado
            if (activeSkill.autoComplete && activeSkill.currentProduct) {
              skills.activateSkill(activeSkill.skill, activeSkill.currentProduct, 3000)
            } else {
              // Desactivar si no hay auto-complete
              skills.deactivateSkill(activeSkill.skill)
            }
          }
        }
      }, 100)  // 100ms
    })

    onUnmounted(() => {
      if (gameLoopInterval) {
        clearInterval(gameLoopInterval)
      }
    })

    return { skills }
  }
}
```

---

## 7. Best Practices

### ✅ DO (Bien)
```typescript
// Usar computed() para valores derivados
const xpProgress = playerStore.xpProgress

// Validar antes de remover
if (inventory.getItemQuantity('mineral-id') >= 3) {
  inventory.removeItem('mineral-id', 3)
}

// Usar consumeResources() para transacciones multi-item
const success = inventory.consumeResources([
  { itemId: 'mineral-id', quantity: 3 },
  { itemId: 'carbon-id', quantity: 1 }
])

// Usar tipos específicos
skills.activateSkill(Skill.MINERIA, product, 3000)

// Guardar periódicamente
setInterval(() => gameStore.saveGame(), 30000)
```

### ❌ DON'T (Mal)
```typescript
// ❌ Modificar estado directamente
inventory.items.push(newItem)

// ❌ Olvidar validar
inventory.removeItem('mineral-id', 1000)  // ¿Tenemos 1000?

// ❌ Usar hardcoded IDs
inventory.addItem(mineral, 'mineral-123')

// ❌ Ignorar return values
const success = inventory.spendGold(100)  // Ignorar si falló
if (!success) return
```

---

## 8. Patrón Recomendado

1. **Leer** con getters: `getSkillState()`, `getItemQuantity()`
2. **Calcular** con `computed()` si es derivado
3. **Modificar** con actions: `addItem()`, `activateSkill()`
4. **Guardar** automáticamente con `gameStore.saveGame()`

**Flujo típico de una acción:**
```
Usuario interactúa → Validar → Llamar action → Action modifica state → UI se actualiza
```

---

## 9. Debugging

```typescript
// Ver estado completo
console.log(playerStore.player)
console.log(inventory.inventory)
console.log(skills.skillStates)

// Ver computed values
console.log(playerStore.xpProgress)
console.log(inventory.totalSlots)
console.log(market.netProfit)

// Limpiar (solo en dev)
inventory.clear()
market.clearHistory()
gameStore.resetGame()
```

---

**Última actualización**: 10 de febrero de 2026
