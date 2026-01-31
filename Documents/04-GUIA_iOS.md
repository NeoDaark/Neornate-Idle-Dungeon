# 🍎 Guía iOS - Compilación y Distribución

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Inicial](#configuración-inicial)
4. [Opción 1: Ionic AppFlow (Recomendado)](#opción-1-ionic-appflow-recomendado)
5. [Opción 2: PWA Web](#opción-2-pwa-web)
6. [Troubleshooting](#troubleshooting)

---

## Introducción

Este documento describe las formas de compilar y distribuir **Neoland Dungeon Idle** para iOS sin necesidad de una Mac local. Dado que Xcode solo está disponible en macOS, usaremos alternativas en la nube.

### ¿Por qué no podemos compilar localmente desde Windows?
- Xcode solo existe para macOS
- Swift y las herramientas de compilación de iOS son exclusivas de Apple
- La alternativa es usar servicios en la nube que tienen Macs

---

## Requisitos Previos

### Sistema Local (Windows)
- **Node.js** 16+ (ya debe estar instalado)
- **npm** (incluido con Node.js)
- **Git** (para sincronizar con repositorios)
- **Capacitor CLI** (lo instalaremos)

### Requisitos para Ionic AppFlow
- Cuenta de **GitHub** (o GitLab, Bitbucket)
- Repositorio público o privado con el código
- Cuenta de **Ionic AppFlow** (gratis con plan límitado)

---

## Configuración Inicial

### 1. Instalar Capacitor iOS

Desde la raíz del proyecto:

```powershell
npm install @capacitor/ios@"^5.0.0" --save-dev
```

### 2. Agregar la Plataforma iOS

```powershell
npx capacitor add ios
```

Esto creará la carpeta `ios/` con el proyecto Xcode.

### 3. Sincronizar el Código Web

```powershell
npx capacitor sync ios
```

Esto copia los archivos de `public/` a la carpeta iOS.

### 4. Configurar capacitor.config.json

Asegúrate de que el archivo tenga la siguiente estructura (ya debe estar configurado):

```json
{
  "appId": "com.neoland.dungeonidle",
  "appName": "Neornate - Idle Dungeon",
  "webDir": "public",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "minWebViewEngineVersion": 51
  },
  "ios": {
    "contentInset": "automatic"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  }
}
```

---

## Opción 1: Ionic AppFlow (Recomendado)

Esta es la forma **más sencilla** de compilar para iOS desde Windows sin necesidad de una Mac local.

### Paso 1: Preparar el Repositorio en GitHub

1. **Sube tu proyecto a GitHub** (si aún no lo has hecho):
   ```powershell
   git add .
   git commit -m "Preparar para compilación iOS"
   git push origin main
   ```

2. Asegúrate de que el repositorio esté **público** (o tu cuenta sea Pro para privados)

### Paso 2: Crear Cuenta en Ionic AppFlow

1. Ve a [ionic.io/appflow](https://ionic.io/appflow)
2. Haz clic en "Sign Up" o "Get Started"
3. Crea tu cuenta (puedes usar GitHub para autenticarte)

### Paso 3: Conectar tu Repositorio

1. En Ionic AppFlow, haz clic en "New App"
2. Selecciona tu repositorio de GitHub (Neornate---Idle-Dungeon)
3. Conecta tu cuenta de GitHub si es necesario

### Paso 4: Configurar el Build para iOS

1. Ve a la sección **"Build"** en Ionic AppFlow
2. Haz clic en **"Create New Build"**
3. Selecciona:
   - **Platform**: iOS
   - **Build Type**: Debug (para pruebas) o Release (para distribución)
   - **Branch**: main

### Paso 5: Generar el Build

1. Haz clic en **"Build"** y espera
2. El proceso toma **5-15 minutos** (Ionic compila en sus servidores Mac)
3. Una vez completado, descargará un archivo `.ipa`

### Paso 6: Instalar en iPhone

**Opción A: TestFlight (Recomendado)**
- En Ionic AppFlow, usa la opción "Deploy to TestFlight"
- Tu amigo recibe un link para instalar la app
- No necesita jailbreak ni configuración complicada

**Opción B: Descarga Directa**
- Descarga el `.ipa` desde Ionic AppFlow
- Usa **Cydia Impactor** o **AltServer** para instalarlo
- Requiere que el iPhone esté conectado por USB

### Paso 7: Compartir con tu Amigo

Si usas **TestFlight**:
1. Invita a tu amigo con su Apple ID
2. Él acepta la invitación
3. Descarga la app desde la app de TestFlight
4. ¡A probar!

---

## Opción 2: PWA Web

Esta es la forma **más rápida** si solo quieres que tu amigo pruebe la app hoy.

### Ventajas
- ✅ Sin compilación
- ✅ Sin tiempos de espera
- ✅ Funciona en cualquier navegador
- ✅ Se "instala" como app en la pantalla de inicio

### Desventajas
- ❌ No es una app nativa compilada
- ❌ Depende de la conexión a internet
- ❌ Limitaciones de acceso a hardware

### Pasos

1. **Publica tu app en internet** (elige uno):
   - [Vercel](https://vercel.com/) (recomendado para Node.js)
   - [Netlify](https://www.netlify.com/)
   - [Railway](https://railway.app/)
   - Tu propio servidor en la nube

2. **Configurar para PWA** (opcional, mejora UX):
   - Asegúrate de que `public/manifest.json` esté correctamente configurado
   - Configura un Service Worker

3. **Compartir el link con tu amigo**

4. **Desde iPhone, tu amigo puede**:
   - Abrir Safari
   - Ir a tu URL
   - Tocar el botón "Compartir"
   - Seleccionar "Añadir a pantalla de inicio"
   - ¡Ya está! La app aparece en la pantalla de inicio como app nativa

---

## Flujo de Trabajo Recomendado

### Para Desarrollo Local
```powershell
# Terminal 1: Ejecuta el servidor
npm start

# Terminal 2: Sincroniza cambios
npx capacitor sync ios
```

### Para Hacer Build en Ionic AppFlow
```powershell
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Cambios para iOS"
git push origin main

# Luego ve a Ionic AppFlow y dispara el build
```

### Para Pruebas Rápidas
```powershell
# Apenas necesitas ejecutar
npm start

# Y compartir el link web con tu amigo
```

---

## Troubleshooting

### Error: "capacitor not found"
```powershell
# Instala Capacitor CLI globalmente
npm install -g @capacitor/cli

# O usa npx
npx capacitor add ios
```

### Error: "ios folder already exists"
```powershell
# Si la carpeta ios/ ya existe, solo sincroniza
npx capacitor sync ios
```

### El build en Ionic AppFlow falla
- Verifica que el archivo `capacitor.config.json` sea válido
- Asegúrate de que `webDir: "public"` apunta a los archivos correctos
- Revisa los logs en Ionic AppFlow para más detalles

### TestFlight: "App no disponible para instalar"
- Verifica que el `.ipa` esté correctamente compilado
- Asegúrate de que el iPhone tenga la versión mínima de iOS requerida
- El build debe tener los certificados correctos (Ionic AppFlow lo maneja)

### El juego no funciona correctamente en iPhone
- Verifica la consola del navegador (Safari Dev Tools)
- Algunos plugins de Capacitor pueden no estar disponibles
- Las dimensiones de pantalla varían; revisa el responsive design

---

## Recursos Útiles

- [Documentación de Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Ionic AppFlow Docs](https://ionic.io/docs/appflow)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [PWA en iOS](https://webkit.org/blog/10882/app-highlights-in-the-smart-app-banner/)

---

## Resumen Rápido

| Opción | Tiempo | Complejidad | Costo |
|--------|--------|-------------|-------|
| **Ionic AppFlow** | 5-15 min | Media | Gratis (plan limitado) |
| **PWA Web** | 1 min | Baja | Gratis (si usas hosting gratis) |
| **Mac Local + Xcode** | N/A | Alta | Caro (Mac + Xcode) |

**Recomendación**: Usa **Ionic AppFlow** para una app compilada real, o **PWA Web** para pruebas rápidas.
