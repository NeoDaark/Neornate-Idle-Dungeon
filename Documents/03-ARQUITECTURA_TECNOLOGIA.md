# 🏗️ Arquitectura y Stack Tecnológico

## Stack Tecnológico

```
┌─────────────────────────────────────────────────┐
│           CAPAS DE LA ARQUITECTURA               │
└─────────────────────────────────────────────────┘

┌─────────────────────────┐
│   PRESENTACIÓN (UI)     │
│   - HTML5               │
│   - CSS3                │
│   - JavaScript Vanilla  │
└──────────────┬──────────┘
               │
┌──────────────▼──────────────┐
│   LÓGICA DE NEGOCIO         │
│   - Game.js (Mecánicas)     │
│   - State Management        │
│   - LocalStorage            │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────────┐
│   SERVIDOR / API                │
│   - Express.js                  │
│   - Node.js Runtime             │
│   - Port: 3000                  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────────┐
│   CAPACITOR (Bridge Nativo)         │
│   - Android Bridge                  │
│   - Web View Integration            │
│   - Plugin System                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   CAPA NATIVA (Android)                 │
│   - Android Runtime                    │
│   - Android SDK APIs                   │
│   - Device Hardware Access             │
└─────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. Frontend (Web)

**Ubicación:** `public/`

#### Archivos Clave:
- **`index.html`** - Estructura de la aplicación
- **`game.js`** - Lógica principal del juego
- **`manifest.json`** - Configuración de PWA
- **Otros assets** - CSS, imágenes, fuentes

#### Tecnologías:
```javascript
// HTML5 - Estructura
// CSS3 - Estilos y responsive design
// JavaScript Vanilla (ES6+) - Sin frameworks externo

// APIs del Navegador Utilizadas:
- LocalStorage API (persistencia de datos)
- RequestAnimationFrame (animaciones)
- Web Workers (si aplica)
- Service Workers (PWA)
```

#### Responsabilidades:
- 🎨 Renderizar la UI del juego
- 🎮 Capturar entrada del usuario (clicks, toques)
- 💾 Persistencia local de datos
- 📊 Actualizar estado visual

---

### 2. Backend (Servidor)

**Ubicación:** `server.js`

```javascript
// Express.js - Framework web minimalista
const app = express();

// Sirve archivos estáticos de 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Escucha en puerto 3000
app.listen(3000);
```

#### Responsabilidades:
- 📁 Servir archivos estáticos (HTML, CSS, JS)
- 🔗 Gestionar routing básico
- ⚡ Permitir desarrollo local sin CORS

#### Posibles Extensiones:
```javascript
// Autenticación
app.post('/api/auth/login', (req, res) => { ... });

// Guardar progreso en servidor
app.post('/api/game/save', (req, res) => { ... });

// Obtener rankings
app.get('/api/game/leaderboard', (req, res) => { ... });
```

---

### 3. Capacitor Framework

**Propósito:** Convertir app web a nativa

```
WEB (Ionic/Capacitor)
       ↓
   Bridge Layer (Capacitor)
       ↓
NATIVE (Android APIs)
```

#### Configuración: `capacitor.config.json`

```json
{
  "appId": "com.neoland.dungeonidle",
  "appName": "Neoland Dungeon Idle",
  "webDir": "public",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "minWebViewEngineVersion": 51
  }
}
```

#### Puntos de Integración:
```javascript
// Acceder a plugins de Capacitor
import { Device } from '@capacitor/device';

// Obtener info del dispositivo
const info = await Device.getInfo();
console.log(info.platform); // "android", "ios", "web"
```

---

### 4. Android (Capa Nativa)

**Ubicación:** `android/`

#### Estructura Gradle:
```
android/
├── build.gradle          # Configuración del proyecto
├── settings.gradle       # Módulos del proyecto
├── gradle.properties     # Propiedades globales
├── gradlew / gradlew.bat # Gradle Wrapper
└── app/
    ├── build.gradle      # Configuración de la app
    ├── proguard-rules.pro # Ofuscación de código
    └── src/
        └── main/
            ├── AndroidManifest.xml
            └── ...
```

#### AndroidManifest.xml
Define permisos, actividades y configuración de la app:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.neoland.dungeonidle">
    
    <!-- Permisos -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application>
        <!-- MainActivity generada por Capacitor -->
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────┐
│  USUARIO INTERACTÚA CON LA APP           │
│  (Click en botón, toque en pantalla)     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  JavaScript captura evento     │
│  (Event listener)              │
└────────────┬───────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Procesar lógica del juego       │
│  (game.js)                       │
│  - Cálculos                      │
│  - Actualizaciones de estado     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Actualizar DOM (HTML)           │
│  - Cambiar textos                │
│  - Animar elementos              │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Persistir datos                 │
│  localStorage.setItem(...)       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  USUARIO VE CAMBIOS EN PANTALLA  │
└──────────────────────────────────┘
```

---

## Ciclo de Vida de la Aplicación

### En Web (browser):
```
1. Usuario accede a http://localhost:3000
2. Server sirve index.html
3. Navegador carga game.js
4. game.js inicia el juego
5. Recupera datos de localStorage
6. Renderiza UI
7. Inicia game loop (requestAnimationFrame)
```

### En Android:
```
1. Usuario toca icono de app
2. Android inicia MainActivity
3. Capacitor abre WebView
4. WebView carga la app web desde capacitor://localhost
5. Ejecuta mismo código que en web
6. Acceso a plugins nativos de Capacitor
7. Puede pausar/resumir con lifecycle eventos
```

---

## Estado de la Aplicación

### Gestión de Estado Actual
```javascript
// Probablemente en game.js o similar:

const gameState = {
  level: 1,
  experience: 0,
  gold: 0,
  inventory: [],
  dungeonProgress: {},
  // ...
};

// Guardar
localStorage.setItem('gameState', JSON.stringify(gameState));

// Cargar
const saved = localStorage.getItem('gameState');
if (saved) {
  Object.assign(gameState, JSON.parse(saved));
}
```

### Posible Mejora (Architecture futura):
```javascript
// Implementar patrón Vuex/Redux simplificado
class GameStore {
  constructor() {
    this.state = { /* ... */ };
    this.subscribers = [];
  }
  
  commit(action, payload) {
    // Actualizar state
    this.state = this.reduce(this.state, action, payload);
    // Notificar observadores
    this.subscribers.forEach(fn => fn(this.state));
  }
  
  subscribe(fn) {
    this.subscribers.push(fn);
  }
}
```

---

## Patrones de Diseño Utilizados

### 1. **MVC (Model-View-Controller)**
```
Model:      gameState (datos)
View:       DOM (index.html)
Controller: game.js (lógica)
```

### 2. **Observer Pattern** (a través de localStorage)
```javascript
// Cambios en state -> Persisten automáticamente
```

### 3. **Singleton Pattern** (si aplica)
```javascript
// Una única instancia del juego
const game = GameInstance.getInstance();
```

---

## Flujo de Desarrollo a Producción

```
┌─────────────────────┐
│   Desarrollo Local  │
│   npm run dev       │
│   localhost:3000    │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  Testing en Devices  │
│  Emulador / Físico   │
│  npm run sync        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│  Build Release           │
│  ./gradlew assembleRelease
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Firma Keystore          │
│  jarsigner -sign ...     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Publicar en Play Store  │
│  Google Play Console     │
└──────────────────────────┘
```

---

## Seguridad

### Consideraciones Actuales:
- ✅ HTTPS en Android (por Capacitor)
- ⚠️ Datos en localStorage (vulnerable a XSS)
- ⚠️ No hay autenticación

### Mejoras Recomendadas:
```javascript
// 1. Sanitizar entrada de usuario
function sanitize(input) {
  return input.replace(/[<>]/g, '');
}

// 2. Validar datos en servidor
app.post('/api/game/save', (req, res) => {
  if (!validateGameState(req.body)) {
    return res.status(400).send('Invalid data');
  }
  // Guardar en BD
});

// 3. Implementar autenticación
// - OAuth con Google
// - Tokens JWT
// - Sincronización con servidor
```

---

## Performance

### Optimizaciones Implementadas:
- ✅ Static file serving (Express)
- ✅ LocalStorage para cache
- ✅ Capacitor (aplicación nativa)

### Posibles Mejoras:
```javascript
// 1. Service Workers (offline)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// 2. Code Splitting (si hay múltiples módulos)
const dungeonModule = await import('./modules/dungeon.js');

// 3. Compresión de assets
// - Minificar CSS/JS
// - Comprimir imágenes (WebP)
// - Lazy loading de assets
```

---

## Monitoreo y Analytics

### Recomendado Implementar:
```javascript
// Firebase Analytics
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);
logEvent(analytics, 'game_started');
logEvent(analytics, 'level_completed', { level: 5 });

// Sentry para errores
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "..." });
```

---

## Roadmap Técnico

### Corto Plazo (Próximas 2 semanas):
- [ ] Completar mecánicas base del juego
- [ ] Testing en múltiples dispositivos
- [ ] Optimización de performance

### Mediano Plazo (1-2 meses):
- [ ] Backend para persistencia en servidor
- [ ] Sistema de autenticación
- [ ] Rankings/Leaderboard

### Largo Plazo (3+ meses):
- [ ] Multijugador
- [ ] Cloud Sync
- [ ] Integración con redes sociales
- [ ] Compras en app (IAP)

---

## Referencias y Documentación

- 📖 [Capacitor Docs](https://capacitorjs.com/docs)
- 📖 [Express.js Guide](https://expressjs.com/en/starter/hello-world.html)
- 📖 [Android Developer](https://developer.android.com/)
- 📖 [Web APIs MDN](https://developer.mozilla.org/en-US/docs/Web/API)
- 📖 [Gradle Build System](https://gradle.org/guides/)

---

**Última actualización**: 31 de enero de 2026

**Mantenedor:** Equipo de Desarrollo NeoDaark

