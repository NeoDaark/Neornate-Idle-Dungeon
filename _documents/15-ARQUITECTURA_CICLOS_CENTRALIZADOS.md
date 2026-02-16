# 🎯 Arquitectura Centralizada de Ciclos de Skills

**Versión**: 1.0.0  
**Fecha**: 16 de febrero de 2026  
**Propósito**: Unificar la lógica de completación de ciclos para todos los skills

---

## 📋 Resumen

Toda la lógica de ciclos está **centralizada** en un único método: `skillsStore.completeCycle()`. 

**Objetivo**: Evitar código espagueti y tener un único punto de verdad para consumo de materiales, generación de items y cálculo de XP.

---

## 🔄 Flujo de Ciclos

```
1. Usuario hace click "Iniciar"
   ↓
2. Componente (MiningSkill, QuemadoSkill, etc.)
   → llama skillsStore.activateSkill(skill, product, durationMs)
   ↓
3. activateSkill() establece:
   - isActive = true
   - currentProduct = product
   - cycleEndTime = now + durationMs
   ↓
4. App.vue Game Loop (cada 100ms)
   → Detecta: now >= cycleEndTime
   ↓
5. Game Loop llama: completeCycle(skill, inventoryStore)
   ↓
6. completeCycle() ejecuta:
   ├─ Calcula XP ganado (con bonus de herramienta)
   ├─ Suma XP al skill
   ├─ Consume materiales requeridos (si hay)
   ├─ Calcula cantidad con bonus
   ├─ Añade items al inventario
   ├─ Aplica lógica especial de Quemado
   ├─ Retorna CycleResult o null
   ↓
7. Game Loop recibe resultado:
   ├─ Si resultado OK y skill activo → reinicia automáticamente
   ├─ Si resultado null (sin materiales) → detiene pero preserva cycleEndTime
   ↓
8. Componente detecta cambio en isActive
   → Muestra notificación al usuario
```

---

## 🏭 Tipos de Skills

### **Tipo A: Extracción (sin materiales requeridos)**

Ejemplos: Minería, Tala, Pesca

**Ciclo:**
- Gasta: nada
- Genera: item (siempre)
- Particularidad: drop es el "item principal"

**Código en completeCycle():**
```typescript
// 1. Calcula XP
addExperience(skill, xpGained)

// 2. Agrega item (con bonus)
if (inventoryStore && skill !== Skill.QUEMADO) {
  inventoryStore.addItem(product.item, finalQuantity)
}

// 3. Retorna resultado
return {
  skill,
  xpGained,
  product: product.item,
  quantity: finalQuantity,
  // ...
}
```

---

### **Tipo B: Crafting (requiere materiales)**

Ejemplos: Fundición, Herrería, Cocina

**Ciclo:**
- Gasta: materiales requeridos (p. ej., 5 cobre para hacer bronce)
- Genera: item crafteado
- Particularidad: sin materiales = no completar ciclo (retorna null)

**Código en completeCycle():**
```typescript
// 1. Validar materiales disponibles
if (product.requiredMaterials && product.requiredMaterials.length > 0) {
  for (const material of product.requiredMaterials) {
    const available = inventoryStore.getItemQuantity(material.itemId)
    if (available < material.quantity) {
      return null // ← CRÍTICO: Sin materiales, no procesar
    }
  }
}

// 2. Consumir materiales
for (const material of product.requiredMaterials) {
  inventoryStore.removeItem(material.itemId, material.quantity)
}

// 3. Generar item crafteado
addExperience(skill, xpGained)
inventoryStore.addItem(product.item, finalQuantity)

// 4. Retorna resultado
return { skill, xpGained, product: product.item, quantity: finalQuantity }
```

---

### **Tipo C: Quemado (gasta material + drops por probabilidad)**

Ejemplo: Quemado (Woodburning)

**Ciclo:**
- Gasta: 1 tronco (OBLIGATORIO)
- Genera: carbón 40% | ceniza 20% | nada 40%
- Particularidad: tronco siempre se gasta, pero drops son opcionales

**Código en completeCycle():**
```typescript
if (inventoryStore && skill === Skill.QUEMADO) {
  // 1. Consumir tronco (obligatorio)
  const currentProduct = state.currentProduct
  const success = inventoryStore.removeItem(currentProduct.item.id, 1)
  if (!success) {
    return null // ← Sin tronco, no procesar
  }

  // 2. Generar drops por probabilidad
  const roll = Math.random()
  
  if (roll < 0.4) {
    // Carbón (40%)
    inventoryStore.addItem(WOODBURNING_DROP_TABLE.carbon.item, 1)
  } else if (roll < 0.6) {
    // Ceniza (20%)
    inventoryStore.addItem(WOODBURNING_DROP_TABLE.ceniza.item, 1)
  }
  // 40% = nada

  // 3. Retorna resultado
  return { skill, xpGained, product: currentProduct.item, quantity: 1 }
}
```

---

## 🛠️ Bonus de Herramientas

Aplicados automáticamente en `completeCycle()`:

| Bonus | Tipo | Efecto | Cuándo se aplica |
|-------|------|--------|------------------|
| **speedBonus** | Segundos (negativo) | Reduce duración del ciclo | En `activateSkill()` |
| **xpBonus** | Porcentaje (0.1 = +10%) | Multiplica XP ganada | En `completeCycle()` |
| **quantityBonus** | Cantidad (aditiva) | Suma items adicionales | En `completeCycle()` |
| **rarityBonus** | *(no implementado)* | Aumenta rarity de items | En `completeCycle()` (TODO) |
| **discountBonus** | *(no implementado)* | Descuentos en mercado | En mercado (TODO) |

**Ejemplo:**
```typescript
// Si herramienta tiene xpBonus = 0.2 (+20%)
let xpGained = product.xpReward // 100
xpGained = Math.floor(100 * (1 + 0.2)) // = 120

// Si herramienta tiene quantityBonus = 2
let finalQuantity = product.quantity // 1
finalQuantity = 1 + 2 // = 3
```

---

## 📵 Sistema Offline

**Importante:** El offline farmeo también usa `completeCycle()` para procesar ciclos:

```typescript
// En gameStore.calculateOfflineProgress()
for (let i = 0; i < cyclesCompleted; i++) {
  // Validar materiales antes de procesar
  if (hasRequiredMaterials) {
    const result = skillsStore.completeCycle(
      skillState.skill,
      inventoryStore,
      false // ← No resetear cycleEndTime (offline maneja esto)
    )
    
    if (result) {
      totalQuantity += result.quantity
      totalXP += result.xpGained
    } else {
      break // ← Sin materiales, detener procesamiento
    }
  }
}
```

**Esto significa:**
- ✅ Quemado offline gasta troncos correctamente
- ✅ Fundición offline consume minerales
- ✅ No hay código duplicado para offline vs online

---

## 🎯 Patrón: Cómo Añadir un Nuevo Skill

Si añades un nuevo skill (p. ej., Herboristería):

### 1. Definir tipo de skill
```typescript
// ¿Necesita materiales?
const product = {
  id: 'pocion_vida',
  item: { id: 'pocion_vida', name: 'Poción de Vida' },
  requiredMaterials: [
    { itemId: 'hierbas', quantity: 2 },
    { itemId: 'agua_limpia', quantity: 1 }
  ],
  xpReward: 50,
  quantity: 1,
  cycleDuration: 5 // segundos
}
```

### 2. Crear componente de skill
```vue
// HerbalistrySkill.vue
// Nota: NO añadir lógica de consumo de materiales
// Todo se maneja en completeCycle()

const startHerbalism = () => {
  // Solo: activateSkill()
  skillsStore.activateSkill(Skill.HERBALISM, selectedProduct.value, cycleDurationMs)
}
```

### 3. No tocar completeCycle()
```typescript
// El skill funciona automáticamente:
// - Los requiredMaterials se validan en completeCycle()
// - Los materiales se consumen automáticamente
// - XP se calcula y suma
// - Items se añaden al inventario
```

---

## 🐛 Manejo de Errores

### Sin materiales requeridos
```typescript
// En completeCycle()
if (available < required) {
  return null // ← Game Loop detecta esto y detiene el skill
}

// En Game Loop (App.vue)
if (!result && skill.isActive) {
  skillsStore.deactivateSkill(skill.skill, true) // preservar cycleEndTime
}

// En componente (QuemadoSkill, etc.)
watch(() => skillsStore.getSkillState(skill).isActive, (isNow, wasBefore) => {
  if (!isNow && wasBefore) {
    showMessage(`Se acabó ${productName}`)
  }
})
```

### Manejo en offline
```typescript
// Si farmeo offline y se quedan sin materiales en el medio
const hasMaterials = requiredMaterials.every(m => inventory.hasEnough(m))
if (!hasMaterials) {
  break // ← Detener procesamiento de ciclos
}
```

---

## ✅ Checklist: Validación de Lógica

- [ ] `completeCycle()` maneja todos los tipos de skills
- [ ] Validación de materiales ocurre ANTES de consumir
- [ ] Game Loop maneja casos de null (sin materiales)
- [ ] Componentes NO tienen lógica de consumo
- [ ] Offline farmeo usa el mismo `completeCycle()`
- [ ] Bonus de herramientas se aplican siempre
- [ ] XP se suma aunque no haya drops (Quemado)

---

## 📚 Referencias

- **skillsStore.ts**: `completeCycle()` líneas 183-264
- **App.vue**: Game Loop líneas 99-130
- **gameStore.ts**: `calculateOfflineProgress()` líneas 170-330
- **Componentes**: MiningSkill.vue, LoggingSkill.vue, SmeltingSkill.vue, QuemadoSkill.vue

---

**Última actualización**: 16 de febrero de 2026
