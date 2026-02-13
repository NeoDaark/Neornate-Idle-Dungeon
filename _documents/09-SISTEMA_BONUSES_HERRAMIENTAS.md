# 🔧 Sistema de Bonuses de Herramientas

## 📋 Descripción

Las herramientas equipadas en `playerStore.equippedTools` proporcionan bonuses automáticos a los skills cuando se completa un ciclo. El sistema se implementa en `toolsStore.ts` y se aplica en `skillsStore.ts`.

---

## 🎯 Tipos de Bonuses

Cada herramienta tiene una estructura `ToolBonus` con 5 tipos de bonuses:

```typescript
interface ToolBonus {
  speedBonus: number        // En segundos (negativo = más rápido)
  quantityBonus: number     // Cantidad adicional de items
  xpBonus: number           // Porcentaje (0.3 = +30%)
  rarityBonus: number       // Porcentaje (0.1 = +10% rarity)
  discountBonus: number     // Porcentaje (0.2 = -20% precio)
}
```

**Ejemplos:**
- `speedBonus: -2` = Reduce ciclo en 2 segundos
- `speedBonus: 1` = Aumenta ciclo en 1 segundo
- `quantityBonus: 5` = +5 items por ciclo
- `xpBonus: 0.5` = +50% XP por ciclo
- `rarityBonus: 0.15` = +15% probabilidad de mejor rarity
- `discountBonus: 0.25` = -25% en precios de mercado

---

## 📍 Puntos de Aplicación

### 1. **Speed Bonus** → `skillsStore.activateSkill()`
Reduce o aumenta la duración del ciclo.

```typescript
// Original: cycleDurationMs = 3000 (3 segundos)
// Con speedBonus: -2 segundos → finalDurationMs = 1000

finalDurationMs = Math.max(500, cycleDurationMs - (toolBonus.speedBonus * 1000))
```

**Constante de seguridad:** Mínimo 500ms para evitar ciclos infinitos.

---

### 2. **Quantity Bonus** → `skillsStore.completeCycle()`
Aumenta la cantidad de items generados (aditivo).

```typescript
// Original: finalQuantity = 2 (dos items)
// Con quantityBonus: +1 → finalQuantity = 3

finalQuantity = product.quantity + Math.floor(toolBonus.quantityBonus)
```

---

### 3. **XP Bonus** → `skillsStore.completeCycle()`
Aumenta XP ganada (multiplicativo con porcentaje).

```typescript
// Original: xpGained = 100
// Con xpBonus: 0.3 (30%) → xpGained = 130

xpGained = Math.floor(product.xpReward * (1 + toolBonus.xpBonus))
```

---

### 4. **Rarity Bonus** → **Pendiente**
⚠️ Requiere sistema de rarity en items (probabilidad de mejor tier).

**TODO**: Implementar cuando se añada rarity system a `Item`:
```typescript
// Pseudo-código
interface Item {
  rarity: 'común' | 'rara' | 'épica' | 'legendaria'
}

// En completeCycle():
if (toolBonus.rarityBonus > 0) {
  // Aumentar probabilidad de mejor rarity
  finalItem = applyRarityBonus(product.item, toolBonus.rarityBonus)
}
```

---

### 5. **Discount Bonus** → **Pendiente**
⚠️ Se aplica en `MarketView` al comprar/vender.

**TODO**: Implementar descuentos en mercado:
```typescript
// En marketData.ts o MarketView.vue:
const finalPrice = basePrice * (1 - toolBonus.discountBonus)
```

---

## 🔄 Flujo de Activación

```
1. Usuario selecciona producto en skill
   ↓
2. Componente llama a skillsStore.activateSkill(skill, product, 3000)
   ↓
3. activateSkill() obtiene toolBonus via toolsStore.calculateToolBonus()
   ↓
4. activateSkill() aplica speedBonus:
   finalDurationMs = 3000 - (speedBonus * 1000)
   ↓
5. Usuario espera o hace auto-complete
   ↓
6. skillsStore.completeCycle() ejecuta:
   a. Obtiene toolBonus nuevamente
   b. Calcula xpGained con xpBonus
   c. Calcula finalQuantity con quantityBonus
   d. Agrega items al inventario
   ↓
7. Retorna CycleResult con bonus aplicados
```

---

## 📊 Ejemplo Práctico

**Herramienta: Pico de Acero (T2, Minería)**
```
Base Stats:
  speedBonus: -1
  quantityBonus: 2
  xpBonus: 0.15
  rarityBonus: 0.0
  discountBonus: 0.05

Ciclo de Minería (original):
  - Duración: 3 segundos
  - Cantidad: 2 carbón
  - XP: 100
  - Precio venta carbón: 1g cada uno

Ciclo con Pico de Acero:
  - Duración: 2 segundos (-1s)
  - Cantidad: 4 carbón (+2)
  - XP: 115 (+15%)
  - Precio venta: 0.95g cada uno (-5%)
```

---

## ✅ Checklist de Implementación

- [x] Crear `Tool.ts` con `ToolBonus` interface
- [x] Crear `toolsStore.ts` con `calculateToolBonus()`
- [x] Aplicar **speedBonus** en `activateSkill()`
- [x] Aplicar **quantityBonus** en `completeCycle()`
- [x] Aplicar **xpBonus** en `completeCycle()`
- [ ] Aplicar **rarityBonus** (requiere rarity en Item)
- [ ] Aplicar **discountBonus** (requiere update en MarketView)

---

## 🐛 Debugging

Si los bonuses no se aplican:

1. **Verificar herramienta equipada:**
   ```typescript
   playerStore.equippedTools[Skill.Mining] // Debe no ser null
   ```

2. **Verificar cálculo de bonus:**
   ```typescript
   const toolBonus = toolsStore.calculateToolBonus(Skill.Mining)
   console.log(toolBonus) // Ver valores
   ```

3. **Verificar ciclo completo:**
   - Activar skill → Ver `speedBonus` aplicado en duración
   - Completar ciclo → Ver `quantityBonus` y `xpBonus` en resultado
   - Revisar console para warnings

---

**Última actualización:** 10 de febrero de 2026  
**Status:** 3/5 bonuses implementados (speed, quantity, xp)
