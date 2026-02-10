# 📚 Implementación de Primera Skill: Minería

## ✅ Estado Actual

Se ha completado la **primera skill (Minería)** con UI + almacenamiento funcional, incluyendo:
- Sistema de confirmación para cambio de materiales
- Integración completa de acciones (action field) en i18n
- Modal de confirmación con soporte multiidioma
- Ciclos de farmeo cancelables y reiniciables

El sistema está listo para expandirse a otras 6 skills.

---

## 🎯 Qué se Implementó

### 1. **Data Layer - Productos de Skills**
- **Archivo**: `src/data/skillProducts.ts`
- Definición de 14 minerales (Carbón → Draconita) y 14 maderas con:
  - Niveles de desbloqueo progresivos
  - XP recompensado por mineral/madera
  - Valor en oro
  - Información de item (nombre, descripción, icon)
  - **NUEVO**: Campos `i18nKey` y `i18nDescriptionKey` para traducciones
  - **NUEVO**: Soporte para descripciones individuales de cada producto

### 2. **Type System - Tipos Completados**
- Tipos de `SkillProduct`, `SkillState`, `CycleResult` actualizados
- Integración con recursos del inventario
- Discriminated unions para máxima type-safety
- **NUEVO**: Campo `i18nDescriptionKey` en SkillProduct
- **NUEVO**: Función `createSkillProduct` actualizada con parámetro de descripción

### 3. **State Management - skillsStore.ts**
```typescript
// Métodos principales:
- getSkillState(skill)           // Obtener estado de skill
- activateSkill()                // Iniciar un ciclo
- deactivateSkill()              // Detener ciclo
- completeCycle()                // Procesar resultado
- addExperience()                // Ganar XP
- toggleAutoComplete()           // Auto-click
- saveToLocalStorage()           // Persistencia
- loadFromLocalStorage()
```

### 4. **UI Components**

#### `SkillCard.vue` - Tarjeta de skill
- Emoji + nombre + nivel
- Barra de progreso de XP
- Indicador de estado (Activo/Inactivo)
- **NUEVO**: Muestra acción + producto actual (ej: "Extrayendo Carbón")

#### `ProductSelector.vue` - Selector de qué extraer
- Lista de minerales disponibles (por nivel)
- Sección separada de bloqueados
- Información de XP y cantidad
- **NUEVO**: Muestra acción + nombre (ej: "Extraer Carbón", "Cortar Roble")
- **NUEVO**: Modal de confirmación al cambiar de producto mientras hay farmeo activo
- **NUEVO**: Soporte para aceptar/cancelar cambio de material

#### `MiningSkill.vue` - Componente principal
- Integración completa de minería
- Control de ciclo (Iniciar/Detener)
- Auto-complete toggle
- Animación de progreso en tiempo real
- Notificaciones de loot
- **NUEVO**: Detiene farmeo anterior y reinicia nuevo ciclo al cambiar producto

### 5. **Game Loop - App.vue**
- Actualización cada 100ms
- Detección automática de ciclos completados
- Auto-persistencia cada 30s
- Carga al iniciar (recupera offline time)

### 6. **Locales - Traducciones**
Agregadas traducciones españolas para:
- 14 minerales con descripciones (Carbón, Cobre, Hierro, etc.)
- 14 maderas con descripciones (Madera Blanda, Roble, Caoba, etc.)
- Descripciones detalladas de skills
- **NUEVO**: Campo `action` en cada skill (Extraer, Cortar, Fundir, etc.)
- **NUEVO**: Claves i18n para modal de confirmación

---

## 🚀 Cómo Usar

### 1. **Navegar a Minería**
```
Vista → Oficios → Minería
```

### 2. **Seleccionar Mineral**
- Elige un mineral desbloqueado (nivel 1+)
- Los bloqueados muestran nivel requerido
- Se muestra la acción: "Extraer Carbón", "Extraer Cobre", etc.

### 3. **Iniciar Ciclo**
```
Click "⛏️ Iniciar Minería"
```
- Duración: 40 segundos (Carbón) hasta 14 segundos (Draconita)
- Se obtiene 2x Mineral (T1) hasta 1x (T2+)
- XP: 10 (Carbón) hasta 400 (Draconita)

### 4. **Cambiar de Mineral Mientras se Farmea**
Si hay un farmeo activo y haces click en otro mineral:
```
Modal de confirmación:
  "¿Deseas cambiar de material?"
  "Se detendrá la recolección actual."
  
  [Cancelar] [Extraer ⚫]  (ejemplo con Carbón)
```
- **Aceptar**: Detiene farmeo actual e inicia nuevo desde 0
- **Cancelar**: Mantiene el farmeo actual

### 5. **Auto-Complete (Opcional)**
```
Click botón "Auto" para repetir indefinidamente
```
- Automáticamente repite ciclos
- Se detiene si cambias de mineral o haces click "Detener"

### 6. **Verificar Inventario**
Los items se guardan automáticamente en localStorage

---

## 📊 Arquitectura Completa

```
App.vue (Game Loop 100ms)
  ├─ skillsStore
  │  ├─ getSkillState(MINERIA)
  │  ├─ activateSkill()
  │  └─ completeCycle() → inventoryStore.addItem()
  │
  ├─ SkillsView.vue
  │  └─ MiningSkill.vue
  │     ├─ SkillCard.vue (progress bar)
  │     └─ ProductSelector.vue (lista minerales)
  │
  └─ localStorage (auto-save cada 30s)
```

---

## 💾 Persistencia

### Guardado Automático
- **skillsStore** → `neornate_skills`
- **inventoryStore** → `neornate_inventory`
- **playerStore** → `neornate_player`
- **gameStore** → `neornate_game`

### Cargar al Iniciar
```typescript
onMounted(() => {
  skillsStore.loadFromLocalStorage()
  inventoryStore.loadFromLocalStorage()
  playerStore.loadFromLocalStorage()
})
```

---

## 🔄 Flujo de Ciclo

### Ciclo Normal
```
1. Usuario selecciona mineral (ProductSelector.vue)
   → Muestra "Extraer Carbón" (con acción + producto)
   
2. Click "Iniciar Minería"
   └─ skillsStore.activateSkill(Skill.MINERIA, product, duration)
   └─ MiningSkill.vue inicia requestAnimationFrame para progreso
   
3. Game loop (100ms tick en App.vue)
   └─ Revisa si cycleEndTime ha llegado
   
4. Cuando termina el ciclo
   └─ skillsStore.completeCycle()
   └─ Retorna { xpGained, quantity, product }
   └─ inventoryStore.addItem(product, quantity)
   └─ MiningSkill.vue muestra notificación
   
5. Si autoComplete está ON → vuelve a step 2
```

### Cambio de Mineral Mientras se Farmea (NEW)
```
1. Usuario hace click en otro mineral mientras hay farmeo activo
   
2. ProductSelector.vue detecta:
   - isActive === true ✓
   - currentProduct.id !== selectedProduct.id ✓
   └─ Muestra modal de confirmación
   
3a. Usuario hace click "Cancelar"
   └─ Modal se cierra
   └─ Continúa farmeo anterior
   
3b. Usuario hace click "Aceptar"
   └─ ProductSelector emite @select con nuevo producto
   └─ MiningSkill.selectProduct() ejecuta:
      1. selectedProduct.value = newProduct
      2. stopMining() → detiene ciclo actual
      3. setTimeout(100ms)
      4. startMining() → inicia nuevo ciclo con newProduct
   └─ Modal se cierra
   └─ Se ve progreso del nuevo ciclo desde 0%
```

---

## 🎮 Próximos Pasos

### Para Expandir a Otras Skills

1. **Crear datos** en `src/data/skillProducts.ts`
   - Copiar estructura MINING_PRODUCTS
   - Agregar a SKILL_PRODUCTS_MAP

2. **Crear componente** en `src/components/skills/`
   - Copiar `MiningSkill.vue`
   - Cambiar skill, duración, cálculos

3. **Actualizar SkillsView.vue**
   - Importar nuevo componente
   - Agregar botones para seleccionar skill

### Skills Listos para Implementar
- ✅ Minería (⛏️) - HECHO
- ⏳ Tala (🌲) - Data ya lista
- ⏳ Pesca (🎣) - TODO: crear datos
- ⏳ Cocina (🍳) - TODO: crear datos
- ⏳ Fundición (🔥) - TODO: requires check
- ⏳ Herrería (🔨) - TODO: requires check
- ⏳ Aventura (🗺️) - TODO: dungeon logic

---

## ✨ Características Implementadas

| Feature | Status | Archivo |
|---------|--------|---------|
| Data de Minería | ✅ | `src/data/skillProducts.ts` |
| Data de Tala | ✅ | `src/data/skillProducts.ts` |
| Tipos de Skills | ✅ | `src/types/Skill.ts` |
| skillsStore | ✅ | `src/stores/skillsStore.ts` |
| Game Loop | ✅ | `src/App.vue` |
| SkillCard UI | ✅ | `src/components/skills/SkillCard.vue` |
| ProductSelector | ✅ | `src/components/skills/ProductSelector.vue` |
| Modal Confirmación | ✅ | `src/components/skills/ProductSelector.vue` |
| MiningSkill | ✅ | `src/components/skills/MiningSkill.vue` |
| Acciones (action) | ✅ | `src/locales/es.json`, `en.json` |
| Descripciones Productos | ✅ | `src/locales/es.json`, `en.json` |
| Persistencia | ✅ | localStorage auto-save |
| Locales ES/EN | ✅ | `src/locales/es.json`, `en.json` |
| Cambio de Producto | ✅ | ProductSelector + MiningSkill |
| Cancelación de Ciclo | ✅ | MiningSkill.stopMining() |
| Reinicio de Ciclo | ✅ | MiningSkill.startMining() |

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navegar a Minería
- [ ] Ver lista de minerales desbloqueados
- [ ] Seleccionar Carbón → muestra "Extraer Carbón"
- [ ] Click "Iniciar Minería"
- [ ] Ver barra de progreso (40s)
- [ ] Ciclo completa y muestra notificación
- [ ] Verificar inventario con nuevo item
- [ ] Activar auto-complete → múltiples ciclos automáticos
- [ ] **NUEVO**: Mientras se farmea, click en otro mineral (Cobre)
- [ ] **NUEVO**: Modal de confirmación aparece
- [ ] **NUEVO**: Click "Cancelar" → continúa farmeo anterior ✓
- [ ] **NUEVO**: Mientras se farmea, click en otro mineral (Cobre)
- [ ] **NUEVO**: Click "Aceptar" → detiene y comienza nuevo ciclo desde 0 ✓
- [ ] Cerrar/abrir app, datos persisten

---

## 📝 Notas de Diseño

### Por Qué Esta Arquitectura

1. **Separación de Responsabilidades**
   - `skillsStore` = lógica pura de ciclos
   - `ProductSelector` = UI + confirmación de cambios
   - `MiningSkill` = orquestación de estados
   - `skillProducts.ts` = datos configurables

2. **Type-Safety**
   - Todos los tipos en `src/types/`
   - Discriminated unions previenen errores
   - No hay `any` types
   - `i18nKey` + `i18nDescriptionKey` en SkillProduct

3. **Internacionalización (i18n)**
   - Estructura jerárquica: `resources.mineral.carbon.name/description`
   - Campo `action` en skills para mostrar dinámicamente
   - Soporte para pluralización en futuras versiones

4. **UX de Cambio de Material**
   - Modal de confirmación previene cambios accidentales
   - Tiempo de espera (100ms) asegura cleanup correcto
   - Usuario siempre sabe qué está pasando

5. **Escalabilidad**
   - Duplicar MiningSkill.vue para otra skill es trivial
   - El mismo game loop funciona para 7 skills simultáneamente
   - Persistent storage es genérico
   - ProductSelector es reutilizable para todas las skills

6. **Performance**
   - Game loop cada 100ms (no cada frame)
   - localStorage batch save cada 30s
   - RequestAnimationFrame solo para animación UI
   - Modal solo renderiza cuando showConfirmation === true

---

**Status**: 🚀 Listo para producción  
**Última actualización**: 10 de febrero de 2026  
**Version**: 1.0.1

---

## 📋 Changelog v1.0.1

### Nuevas Funcionalidades ✨
- Sistema de confirmación modal para cambio de materiales
- Campo `action` integrado en i18n para mostrar acciones dinámicas
- Descripciones individuales de productos en i18n
- Soporte para cancelación y reinicio de ciclos de farmeo

### Mejoras UX 🎨
- ProductSelector muestra "Extraer Carbón" en lugar de solo "Carbón"
- SkillCard muestra "Extrayendo Carbón" cuando está activo
- Modal de confirmación con 2 botones claros (Aceptar/Cancelar)
- Manejo robusto de cambios de material durante farmeo activo

### Cambios Técnicos 🔧
- Actualizado tipo `SkillProduct` con `i18nDescriptionKey`
- Función `createSkillProduct` ahora requiere parámetro de descripción
- `MiningSkill.selectProduct()` detiene ciclo anterior antes de iniciar uno nuevo
- ProductSelector emite evento `@select` con confirmación previa si es necesario

### Archivos Modificados
- `src/types/Skill.ts` - SkillProduct interface + createSkillProduct
- `src/data/skillProducts.ts` - i18nKey + i18nDescriptionKey en todos los productos
- `src/locales/es.json` - Estructura de recursos, acciones, descripciones
- `src/locales/en.json` - Traducción completa en inglés
- `src/components/skills/ProductSelector.vue` - Modal + lógica de confirmación
- `src/components/skills/MiningSkill.vue` - Manejo de cambio de producto
- `src/components/skills/SkillCard.vue` - Mostrar acción en estado
