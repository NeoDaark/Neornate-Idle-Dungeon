# 🌍 Sistema Multi-Idioma (i18n) - Neornate

## 📋 Objetivo

Toda la interfaz de usuario DEBE estar preparada para múltiples idiomas desde el inicio.

---

## 🎯 Regla Fundamental

**PROHIBIDO**: Hardcodear texto visible en componentes.

```vue
<!-- ❌ MAL -->
<template>
  <h1>Bienvenido a Neornate</h1>
  <button>Iniciar Juego</button>
  <p>Nivel: {{ level }}</p>
</template>

<!-- ✅ BIEN -->
<template>
  <h1>{{ t('ui.welcome') }}</h1>
  <button>{{ t('ui.button.start') }}</button>
  <p>{{ t('ui.level') }}: {{ level }}</p>
</template>
```

---

## 📁 Estructura de Archivos

```
src/locales/
├─ es.json          # Spanish (Español) - IDIOMA POR DEFECTO
├─ en.json          # English
├─ fr.json          # (Futuro)
└─ index.ts         # Configuración de i18n
```

---

## 📝 Formato de Locales (JSON)

### Estructura de Claves

Usar jerarquía clara con **PUNTOS** para anidar:

```json
{
  "ui": {
    "welcome": "Bienvenido a Neornate",
    "button": {
      "start": "Iniciar",
      "cancel": "Cancelar",
      "confirm": "Confirmar"
    },
    "menu": {
      "home": "Inicio",
      "skills": "Trabajos",
      "market": "Mercado"
    },
    "level": "Nivel"
  },
  "skills": {
    "mineria": "Minería",
    "tala": "Tala",
    "fundicion": "Fundición",
    "herreria": "Herrería",
    "pesca": "Pesca",
    "cocina": "Cocina",
    "aventura": "Aventura"
  },
  "messages": {
    "success": "¡Operación exitosa!",
    "error": "Error al procesar la solicitud",
    "confirmation": "¿Estás seguro?"
  }
}
```

---

## 🔧 Cómo Usar i18n en Componentes

### En `<template>`

```vue
<template>
  <div class="skill-card">
    <h2>{{ t('skills.mineria') }}</h2>
    <p>{{ t('ui.level') }}: {{ playerLevel }}</p>
    <button>{{ t('ui.button.start') }}</button>
  </div>
</template>
```

### En `<script setup>`

```typescript
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Usar en lógica
const skillName = t('skills.mineria')

// Cambiar idioma
const changeLanguage = (lang: string) => {
  locale.value = lang
}
```

### Para Valores Dinámicos (con Interpolación)

```json
{
  "messages": {
    "playerGainXp": "Ganaste {xp} de XP",
    "itemReceived": "Recibiste {quantity}x {itemName}"
  }
}
```

```vue
<template>
  <p>{{ t('messages.playerGainXp', { xp: 250 }) }}</p>
  <p>{{ t('messages.itemReceived', { quantity: 5, itemName: 'Carbón' }) }}</p>
</template>
```

---

## 📋 Checklist para Nuevas Features

Cuando agregues una nueva sección (Skill, Market, etc):

- [ ] **1. Añadir claves de texto a `src/locales/es.json`**
  - Bajo la categoría correspondiente (skills, ui, messages, etc)
  
- [ ] **2. Añadir equivalentes a `src/locales/en.json`**
  - Misma estructura, traducciones en inglés

- [ ] **3. Usar `{{ t('key') }}` en todos los templates**
  - Buscar hardcoded strings en el componente
  - Reemplazar con llamadas `t()`

- [ ] **4. Verificar que sea pluralizable (si aplica)**
  - Items: "1 Carbón" vs "5 Carbones"
  - Usar reglas de pluralización

---

## 🛠️ Setup Inicial (Ya hecho o por hacer)

### Option 1: Vue-i18n (Recomendado)

```typescript
// src/locales/index.ts
import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'es', // idioma por defecto
  fallbackLocale: 'es',
  messages: {
    es,
    en,
  },
})

// src/main.ts
import { i18n } from './locales'
app.use(i18n)
```

### Option 2: Composable Custom (Ligero)

Si prefieres algo más simple sin dependencias:

```typescript
// src/locales/index.ts
import { ref, computed } from 'vue'
import es from './es.json'
import en from './en.json'

const currentLocale = ref('es')
const messages = { es, en }

export const useI18n = () => {
  const t = (key: string, params?: Record<string, unknown>) => {
    const keys = key.split('.')
    let value: any = messages[currentLocale.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (params && typeof value === 'string') {
      return value.replace(/{(\w+)}/g, (_, k) => String(params[k] ?? ''))
    }
    
    return value || key
  }
  
  return { t, currentLocale }
}
```

---

## 🎨 Convención de Claves

| Tipo | Prefijo | Ejemplo |
|------|---------|---------|
| UI General | `ui.` | `ui.welcome`, `ui.button.start` |
| Nombres de Skills | `skills.` | `skills.mineria`, `skills.pesca` |
| Nombres de Items | `items.` | `items.carbon`, `items.espada_corta` |
| Mensajes | `messages.` | `messages.success`, `messages.error` |
| Labels/Etiquetas | `labels.` | `labels.level`, `labels.health` |
| Errores | `errors.` | `errors.insufficient_resources` |

---

## ✅ Testing Multi-idioma

Cuando implementes i18n:

```typescript
// Test que todas las claves existan
const validateLocales = () => {
  const esKeys = Object.keys(messages.es)
  const enKeys = Object.keys(messages.en)
  
  if (esKeys.length !== enKeys.length) {
    console.warn('⚠️ Mismatch entre idiomas')
  }
}
```

---

## 📚 Más Información

- Documentación: [vue-i18n.intlify.dev](https://vue-i18n.intlify.dev)
- Instalación: `npm install vue-i18n`
- Pluralización: [docs.intlify.dev/guide/pluralization](https://docs.intlify.dev/guide/pluralization)

---

## 🎯 Ejemplo Completo: Skill Card

### Component (SkillCard.vue)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SkillState } from '@/types'

defineProps<{ skill: SkillState }>()

const { t } = useI18n()
</script>

<template>
  <div class="skill-card">
    <h3>{{ t(`skills.${skill.skill}`) }}</h3>
    <p>{{ t('labels.level') }}: {{ skill.level }}</p>
    <p>{{ t('labels.experience') }}: {{ skill.experience }}</p>
    <button>{{ t('ui.button.start') }}</button>
  </div>
</template>
```

### Locales

**es.json**:
```json
{
  "skills": {
    "mineria": "Minería",
    "tala": "Tala"
  },
  "labels": {
    "level": "Nivel",
    "experience": "Experiencia"
  }
}
```

**en.json**:
```json
{
  "skills": {
    "mineria": "Mining",
    "tala": "Woodcutting"
  },
  "labels": {
    "level": "Level",
    "experience": "Experience"
  }
}
```

---

**Status**: 📋 Documento de referencia
**Aplicar a**: Todo nuevo componente con texto visible
