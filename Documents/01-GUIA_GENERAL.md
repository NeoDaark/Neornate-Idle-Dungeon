# 📚 Guía General - Neoland Dungeon Idle

## Descripción del Proyecto

**Neoland Dungeon Idle** es un juego RPG Idle desarrollado como una aplicación web progresiva (PWA) que puede ejecutarse en navegadores web y también ser compilada como una aplicación nativa para Android usando Capacitor.

### Características Principales
- 🎮 Juego Idle/Incremental con mecánicas de RPG
- 📱 Compatible con dispositivos móviles
- 🔄 Sincronización automática con Capacitor
- ⚡ Servidor Express para desarrollo local
- 🎯 Compilación a APK nativo para Android

---

## Requisitos Previos

### Para Desarrollo Web
- **Node.js** 16+ (descargar desde [nodejs.org](https://nodejs.org/))
- **npm** (incluido con Node.js)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Para Desarrollo Android
- **Java JDK 17+** (recomendado JDK 17 de Oracle o Eclipse Adoptium)
- **Android SDK** 
- **Android Studio** (opcional, pero recomendado)
- **Gradle** (incluido con el proyecto)

### Verificar Instalaciones
```powershell
# Verificar Node.js
node --version
npm --version

# Verificar Java (si planeas compilar APK)
java -version
```

---

## Instalación Inicial

### 1. Clonar o Descargar el Proyecto
```powershell
git clone <url-del-repositorio>
cd Neornate---Idle-Dungeon
```

### 2. Instalar Dependencias
```powershell
npm install
```

Esto instalará:
- **express** - Servidor web
- **@capacitor/core** - Framework para apps nativas
- **@capacitor/cli** - CLI de Capacitor
- **@capacitor/android** - Soporte para Android

---

## Ejecución para Testing

### 🌐 Opción 1: Servidor Web (Recomendado para desarrollo)

**Desarrollo con auto-reload:**
```powershell
npm run dev
```

**Servidor de producción:**
```powershell
npm start
```

Luego accede a:
- **Localmente**: http://localhost:3000
- **Desde otro dispositivo en la red**: http://<tu-ip-local>:3000

#### Encontrar tu IP Local
```powershell
ipconfig
```
Busca la dirección bajo "IPv4 Address" (ej: 192.168.x.x)

### 📱 Opción 2: En Emulador de Android

**Paso 1: Sincronizar cambios**
```powershell
npm run sync
```

**Paso 2: Abrir en Android Studio**
```powershell
npm run open:android
```

**Paso 3: Ejecutar en emulador o dispositivo** desde Android Studio

### 🎮 Opción 3: Compilar APK Debug

```powershell
npm run build:android
.\build-apk.ps1
```

El APK se encontrará en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Estructura del Proyecto

```
📦 Neornate - Idle Dungeon
├── 📄 package.json              # Dependencias y scripts
├── 📄 capacitor.config.json     # Configuración de Capacitor
├── 📄 server.js                 # Servidor Express
├── 📄 build-apk.ps1             # Script para compilar APK
├── 📁 public/                   # Archivos web estáticos
│   ├── index.html               # Página principal
│   ├── game.js                  # Lógica del juego
│   └── manifest.json            # Manifest de PWA
├── 📁 Documents/                # Documentación
├── 📁 android/                  # Código Android (Capacitor)
│   ├── app/                     # App Android principal
│   ├── build.gradle
│   └── gradlew                  # Gradle wrapper
└── 📁 test/                     # Archivos de testing
```

---

## Archivos Principales

### `public/index.html`
Página principal del juego. Aquí va toda la UI.

### `public/game.js`
Lógica principal del juego (mecánicas, estado, etc.)

### `server.js`
Servidor Express que sirve los archivos estáticos y la API.

### `public/manifest.json`
Configuración de la aplicación web progresiva (PWA).

---

## Tareas Comunes

### 🔧 Actualizar Capacitor
```powershell
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest
```

### 🔄 Sincronizar cambios web con Android
```powershell
npm run sync
```

### 🗑️ Limpiar caché y compilaciones
```powershell
# Limpiar node_modules y reinstalar
Remove-Item -Recurse node_modules
npm install

# Limpiar build de Android
cd android
./gradlew clean
cd ..
```

### 📸 Captura de pantalla en emulador
```powershell
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshot.png
```

---

## Debugging

### Consola del Navegador
- Presiona `F12` o `Ctrl+Shift+I` para abrir DevTools
- Revisa la pestaña "Console" para errores

### Debugging Android
```powershell
# Ver logs del dispositivo/emulador
adb logcat

# Especificar solo logs de la app
adb logcat | findstr "DungeonIdle"
```

---

## Problemas Comunes

| Problema | Solución |
|----------|----------|
| Puerto 3000 ya en uso | Cambiar PORT en server.js o `$env:PORT = 8000; npm start` |
| Emulador no responde | Reiniciar emulador desde Android Studio |
| Error de dependencias | Ejecutar `npm install` nuevamente |
| APK no se compila | Verificar JDK 17, ejecutar `cd android && ./gradlew clean` |

---

## Recursos Útiles

- 📖 [Documentación de Capacitor](https://capacitorjs.com/)
- 📖 [Documentación de Express](https://expressjs.com/)
- 🤖 [Documentación de Android](https://developer.android.com/)
- 🔗 [Guía de PWA](https://web.dev/progressive-web-apps/)

---

## Próximos Pasos

1. Lee la documentación específica de Android: `02-GUIA_ANDROID.md`
2. Revisa la guía de arquitectura: `03-ARQUITECTURA_TECNOLOGIA.md`
3. Comienza a testear el juego en diferentes plataformas

---

**Última actualización**: 31 de enero de 2026
