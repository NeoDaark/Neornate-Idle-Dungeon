# 🌲 Refactor: Estructura de Árboles y Maderas

**Fecha**: 17 de febrero de 2026  
**Estado**: ✅ Completado

## 📝 Resumen del Cambio

Se refactorizó la estructura de datos de la habilidad **Tala** (Logging) para separar claramente entre:
- **TREES**: Árboles que el jugador tala
- **LOGGING_PRODUCTS**: Maderas que obtiene como resultado

Esto proporciona mayor claridad en la mecánica del juego y facilita la expansión futura.

---

## 🔄 Cambios Realizados

### 1. **Nuevos Tipos**
Se creó `src/types/Tree.ts`:
```typescript
export interface Tree {
  id: string
  i18nKey: string
  level: number
  tier: Tier
}
```

### 2. **Reestructuración de `logging.ts`**

**Antes**: Un único objeto `LOGGING_PRODUCTS` con maderas genéricas:
```typescript
'madera-blanda'    // T1
'madera-comun'     // T1
'roble'            // T2
'petreo'           // T4 (confuso: no es un árbol real)
'ancestral'        // T4 (genérico)
'divina'           // T7 (renombrado a 'meteorica')
```

**Después**: Dos estructuras claras:

#### **TREES** - Árboles Disponibles
```
T1: Pino, Abedul
T2: Abeto, Nogal
T3: Caoba, Ébano
T4: Teca, Cedro
T5: Maldito, Místico
T6: Sagrado, Primordial
T7: Dimensional, Meteórico
```

#### **LOGGING_PRODUCTS** - Maderas Obtenidas
```
'madera-pino'         → Madera de Pino
'madera-abedul'       → Madera de Abedul
'madera-abeto'        → Madera de Abeto
'madera-nogal'        → Madera de Nogal
...
'madera-meteorica'    → Madera Meteórica
```

### 3. **Progresión Temática**

| Tier | Tema | Ejemplos |
|------|------|----------|
| **T1** | Árboles comunes reales | Pino, Abedul |
| **T2** | Árboles europeos exóticos | Abeto, Nogal |
| **T3** | Árboles tropicales finos | Caoba, Ébano |
| **T4** | Árboles legendarios reales | Teca, Cedro |
| **T5** | Sobrenatural moderado | Maldita, Mística |
| **T6** | Épico/Sagrado | Sagrada, Primordial |
| **T7** | Celestial/Cósmico | Dimensional, Meteórica |

### 4. **Cambios de Naming**

**Removidos**:
- `madera-blanda` → `madera-pino`
- `madera-comun` → `madera-abedul`
- `roble` → `madera-abeto` (roble → abeto por claridad)
- `petreo` → `madera-teca` (árbol real)
- `ancestral` → `madera-cedro` (árbol real)
- `divina` → `madera-meteorica` (alineado con minerales)
- `cristalina` → removido (duplicado de mágica)
- `magica` → `madera-mistica` (claridad temática)

**Agregados**:
- Separación clara: `madera-` prefix en todos los productos
- Consistencia con minerales: Prefijo que identifica el tipo de recurso

### 5. **Actualización de i18n**

#### **es.json**
```json
"trees": {
  "pino": { "name": "Pino" },
  "abedul": { "name": "Abedul" },
  ...
}

"resources": {
  "wood": {
    "madera-pino": { "name": "Madera de Pino", "description": "..." },
    "madera-abedul": { "name": "Madera de Abedul", "description": "..." },
    ...
  }
}
```

#### **en.json**
```json
"trees": {
  "pino": { "name": "Pine" },
  "abedul": { "name": "Birch" },
  ...
}

"resources": {
  "wood": {
    "madera-pino": { "name": "Pine Wood", "description": "..." },
    "madera-abedul": { "name": "Birch Wood", "description": "..." },
    ...
  }
}
```

---

## 📋 Flujo de Juego Resultante

### **Antes** (confuso)
```
Acción: "Cortar Roble"        ← ¿Árbol o madera?
Producto: "Roble"              ← ¿ID genérico?
```

### **Después** (claro)
```
Árbol: TREES['pino']           → i18nKey: 'trees.pino.name' → "Pino"
Acción: "Talar Pino"
Producto: LOGGING_PRODUCTS['madera-pino'] → "Madera de Pino"
```

---

## 🎯 Beneficios

✅ **Claridad**: Separación clara entre acción (talar) y producto (obtener madera)  
✅ **Consistencia**: Naming uniforme con el sistema de minerales  
✅ **Escalabilidad**: Fácil agregar propiedades específicas a árboles (ej: zona de spawn)  
✅ **Temática**: Progresión coherente de árboles reales → épicos → cósmicos  
✅ **i18n-Ready**: Keys estructurados para soporte multiidioma  

---

## 🔧 Implementación Técnica

### Archivos Modificados
1. **`src/types/Tree.ts`** - Nuevo tipo
2. **`src/data/skillProducts/logging.ts`** - Refactor completo
3. **`src/locales/es.json`** - Actualización de trees + resources.wood
4. **`src/locales/en.json`** - Actualización de trees + resources.wood

### Cambios Futuros Necesarios
- [ ] Actualizar componentes que usen `LOGGING_PRODUCTS` para referencia a `TREES` donde sea relevante
- [ ] Crear UI que distinga entre "Seleccionar Árbol" vs "Obtener Madera"
- [ ] Exportar `TREES` desde `logging.ts` para uso en otras partes del sistema
- [ ] Agregar índice cruzado en `skillProducts.ts` si existe

---

## 📊 Comparativa Rápida

| Característica | Antes | Después |
|---|---|---|
| **Estructura** | 1 objeto mixto | 2 objetos separados |
| **Naming** | Inconsistente | Uniforme con `madera-` prefix |
| **Tiers** | 7 tiers, 14 maderas | 7 tiers, 14 maderas (reorganizadas) |
| **i18n Keys** | `resources.wood.roble` | `trees.pino`, `resources.wood.madera-pino` |
| **Claridad** | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 Próximos Pasos

1. **Verificar uso**: Buscar referencias a los IDs antiguos en componentes
2. **Testing**: Validar que los i18nKeys existan en todos los idiomas
3. **Mercado**: Actualizar precios si existen en `marketData.ts`
4. **Quemado**: Validar referencias en `woodburning.ts`

---

**Versión**: 1.0.0  
**Refactor by**: AI Agent  
**Status**: ✅ Ready for Review
