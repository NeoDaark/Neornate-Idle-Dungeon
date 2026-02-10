# 📋 Resumen de Instrucciones Actualizadas para AI Agents

## ✅ Cambios Realizados

Se han actualizado las instrucciones en `.github/copilot-instructions.md` con **3 nuevas secciones críticas**:

---

## 1️⃣ 🌍 Multi-Language Support (i18n) - **CRITICAL**

### Regla Fundamental
**TODA** interfaz de usuario DEBE estar preparada para múltiples idiomas desde el inicio.

### Quick Rules
```
✅ No hardcoded UI strings - Use t('key.path') exclusively
✅ Structure: ui., skills., items., messages., labels., errors.
✅ Default language: Spanish (es)
✅ Supported: Spanish → English → (French, Portuguese future)
```

### Ejemplo Visual
```vue
<!-- ❌ WRONG -->
<h1>Bienvenido</h1>

<!-- ✅ RIGHT -->
<h1>{{ t('ui.welcome') }}</h1>
```

### Referencia Completa
Ver `_documents/03-SISTEMA_i18n.md` para:
- Setup con vue-i18n o composable custom
- Estructura JSON de locales
- Uso en componentes
- Pluralización de items
- Valores dinámicos con interpolación

---

## 2️⃣ 📝 Documentation Standards - **NO REDUNDANCIA**

### ✅ What to Document
- Architectural decisions (why, not what)
- One system = One document (01-SISTEMA_X.md)
- Actionable content (instructions, not descriptions)
- Setup guides (copilot-instructions.md)

### ❌ What NOT to Document
- Redundant explanations (same info in multiple files)
- ASCII art boxes (│ characters misalign across editors)
- Implementation details (use JSDoc in code instead)
- Verbose dumps (keep focused and concise)

### 📊 Documentation Types

| Type | File Pattern | Purpose | Audience |
|------|--------------|---------|----------|
| System Design | `_documents/XX-NOMBRE.md` | Architecture + mechanics | All devs |
| Code Docs | JSDoc in `.ts` files | Function/type reference | Developers (IDE) |
| Progress | `_documents/00-*.md` | What's done, next steps | Team sync |
| Setup Guide | `.github/copilot-instructions.md` | How to contribute | AI agents + devs |

### ⚠️ Ejemplo: Good vs Bad

❌ **Bad - Too verbose + redundant**:
```typescript
// This file contains types for Game
// Game types include Tier, Skill, ItemType
// There are 7 Tiers: T1, T2, T3, T4, T5, T6, T7
export enum Tier { T1, T2, ... }
```

✅ **Good - Concise + purposeful**:
```typescript
/**
 * Tier enum - Defines player progression levels
 * Used for gating content and calculating XP requirements
 */
export enum Tier { T1, T2, ... }
```

---

## 3️⃣ 🎨 Visual Diagrams - **SIN CARACTERES DESALINEADOS**

### ✅ Allowed (Recomendado)
- Markdown tables (clean, readable, parseable)
- Mermaid diagrams (if added to project)
- Inline code examples with comments
- Tree structures con `├─`, `└─`, `│` (SOLO si está bien alineado)

### ❌ NOT Allowed
- ASCII art boxes con `│` en los lados (se desalinean en diferentes editores)
- Complex text diagrams (hard to maintain)
- Decorative elements that break in certain terminals

### ✅ Good Visual - Tree Structure
```
Player
├─ Stats
├─ Equipment
│  ├─ Weapon
│  └─ Armor
└─ Inventory
   ├─ Resources
   └─ Items
```

### ❌ Bad Visual - ASCII Boxes
```
┌─ Game ─────────────────────────────┐
│ Enums: Tier, Skill, ItemType       │
│ Config: TIER_RANGES, SKILL_CONFIGS │
│ Utils: calculateXpForLevel(...)    │
└────────────────────────────────────┘
```
*Los `│` caracteres pueden desalinearse en diferentes editores/terminales*

---

## 📚 Documentación de Referencia

Los agentes AI ahora tienen:

### En `.github/copilot-instructions.md`:
1. **i18n Quick Rules** - Resumen ejecutivo (5 líneas)
2. **Documentation Standards** - Qué sí, qué no (20 líneas)
3. **Visual Diagrams Guide** - Cómo hacer visuals (15 líneas)
4. **Referencia Completa i18n** - Enlace a `_documents/03-SISTEMA_i18n.md`

### En `_documents/`:
- `03-SISTEMA_i18n.md` - **Guía completa** para implementar i18n
  - Setup inicial
  - Estructura JSON
  - Uso en componentes
  - Pluralización
  - Interpolación
  - Cambio de idioma dinámico

---

## 🎯 Impacto para Desarrolladores

### Antes
- Sin directrices sobre i18n → texto hardcoded
- Documentación redundante → confusión
- ASCII art boxes → desalineadas en diferentes editores

### Ahora
- ✅ i18n **obligatorio** desde el inicio
- ✅ Un documento por sistema (sin duplicación)
- ✅ Visuals limpias y mantenibles
- ✅ Toda la info en `.github/copilot-instructions.md` + referencias específicas

---

## 📋 Checklist Actualizado

Cuando agregues una **nueva feature**:

1. **Crear Types** → `src/types/`
2. **Crear Store** → `src/stores/`
3. **Crear View** → `src/views/`
4. **Agregar Rutas** → `src/router/index.ts`
5. **Crear Componentes** → `src/components/`
6. **Agregar Sidebar Entry** → Layout components
7. **Agregar Estilos** → CSS variables en `main.css`
8. **Agregar i18n** → ✨ **NUEVO** - Claves en `src/locales/es.json` + `en.json`
9. **Verificar Tipos** → `npm run type-check`

---

## 🚀 Para AI Agents

Las nuevas instrucciones son **executable**:

```typescript
// ✅ TODO ESTO AHORA TIENE GUÍAS CLARAS:

// 1. i18n
const header = t('ui.welcome') // Con referencia a 03-SISTEMA_i18n.md

// 2. Documentación
// No duplicar info - One source of truth

// 3. Visuals
// Usar tablas Markdown o árboles con ├─, NO boxes
Player
├─ Stats
└─ Equipment
```

---

## 📊 Archivos Modificados

```
.github/copilot-instructions.md
├─ + Sección: 🌍 Multi-Language Support (i18n) - CRITICAL
├─ + Sección: 📝 Documentation Standards
├─ + Sección: 🎨 Visual Diagrams - Style Guide
└─ Referencias a: _documents/03-SISTEMA_i18n.md

_documents/03-SISTEMA_i18n.md (NUEVO)
├─ Objetivo
├─ Regla Fundamental
├─ Estructura de Archivos
├─ Formato JSON
├─ Cómo Usar en Componentes
├─ Checklist para New Features
├─ Setup Inicial (vue-i18n + custom)
├─ Convención de Claves
├─ Testing Multi-idioma
└─ Ejemplo Completo: Skill Card
```

---

## ✅ Status

```
✅ i18n Instructions - COMPLETE
✅ Documentation Standards - COMPLETE
✅ Visual Diagrams Guide - COMPLETE
✅ Referencia a 03-SISTEMA_i18n.md - COMPLETE
✅ Sin Redundancias - COMPLETE
✅ Sin ASCII Boxes Desalineadas - COMPLETE

Total: 3 instrucciones críticas actualizadas
Archivos: 2 (copilot-instructions.md + 03-SISTEMA_i18n.md)
```

---

## 🎯 Próximo Paso

Los agentes AI ahora:
1. **Saben que TODO debe ser multiidioma** desde el inicio
2. **Evitan documentación redundante** (one source of truth)
3. **Usan visuals que no se desalinean** (no ASCII art boxes)

**Siguiente FASE**: Implementar los Stores (Pinia) con estos criterios aplicados.

---

**Actualizado**: 10 de febrero de 2026
**Framework**: Vue 3 + TypeScript + Capacitor
**Estado**: Ready for next phase
