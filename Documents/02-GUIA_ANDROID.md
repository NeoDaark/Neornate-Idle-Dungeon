# 📱 Guía Android - Compilación y Distribución

## Tabla de Contenidos
1. [Configuración del Entorno](#configuración-del-entorno)
2. [Compilación Debug](#compilación-debug)
3. [Compilación Release](#compilación-release)
4. [Instalación en Dispositivos](#instalación-en-dispositivos)
5. [Troubleshooting](#troubleshooting)

---

## Configuración del Entorno

### 1. Instalar Java JDK 17

**Opción A: Oracle JDK**
- Descargar desde [oracle.com/java](https://www.oracle.com/java/technologies/downloads/)
- Instalar en una ruta sin espacios (ej: `C:\Java\jdk-17`)

**Opción B: Eclipse Adoptium (Gratuito)**
- Descargar desde [adoptium.net](https://adoptium.net/)
- Recomendado para desarrollo

**Verificar instalación:**
```powershell
java -version
javac -version
```

### 2. Instalar Android SDK

**Opción A: Android Studio (Recomendado)**
- Descargar desde [developer.android.com](https://developer.android.com/studio)
- Instalar y ejecutar
- Descargará automáticamente SDK y herramientas

**Opción B: Command Line Tools Only**
- Descargar desde [developer.android.com/studio](https://developer.android.com/studio)
- Descompactar en `C:\Android\cmdline-tools`

### 3. Configurar Variables de Entorno

Agregar al archivo `build-apk.ps1` o `.env`:

```powershell
# En Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\<TuUsuario>\AppData\Local\Android\sdk"
```

**Verificar configuración:**
```powershell
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
```

### 4. Instalar SDK Específicos

Usar `sdkmanager` desde Android Studio o:

```powershell
# Si tienes Android Studio, ve a:
# Tools > SDK Manager > Install
# - Android SDK Platform 33 (o superior)
# - Android Emulator
# - Android SDK Build-tools 33
```

---

## Compilación Debug

### Opción 1: Script Automatizado (Recomendado)

```powershell
.\build-apk.ps1
```

Este script:
- ✅ Verifica JDK 17
- ✅ Ejecuta Gradle
- ✅ Compila APK Debug
- ✅ Abre carpeta de salida

### Opción 2: Manual con npm

```powershell
npm run sync
npm run build:android

cd android
./gradlew.bat assembleDebug
cd ..
```

### Opción 3: Desde Android Studio

```powershell
npm run open:android
```

Luego en Android Studio:
- `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- Esperar a que termine

### Resultado
El APK Debug se encuentra en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Compilación Release

### ⚠️ Requisitos Previos

Necesitas crear un Keystore (certificado de firma):

```powershell
# Generar Keystore (ejecutar UNA SOLA VEZ)
keytool -genkey -v -keystore my-release-key.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias my-key-alias
```

**Guarda la contraseña en un lugar seguro.** La necesitarás siempre.

### Paso 1: Configurar Gradle para Release

Editar `android/app/build.gradle` y agregar la sección de firma:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            storeFile file('my-release-key.jks')
            storePassword 'TU_CONTRASEÑA_KEYSTORE'
            keyAlias 'my-key-alias'
            keyPassword 'TU_CONTRASEÑA_ALIAS'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Paso 2: Compilar APK Release

```powershell
cd android
./gradlew.bat assembleRelease
cd ..
```

### Paso 3: Verificar Firma

```powershell
jarsigner -verify -verbose -certs `
  android/app/build/outputs/apk/release/app-release.apk
```

### Resultado
El APK Release se encuentra en:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Instalación en Dispositivos

### 📱 En Emulador

```powershell
# Ver emuladores disponibles
adb devices

# Si no hay emulador, crear uno desde Android Studio
# Tools > AVD Manager > Create Virtual Device

# Instalar APK en emulador
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 📱 En Dispositivo Físico

**Paso 1: Habilitar Modo Desarrollador**
- Ir a `Configuración > Acerca del teléfono`
- Tocar 7 veces en "Número de compilación"
- Ir a `Configuración > Opciones de desarrollador`
- Activar `Depuración USB`

**Paso 2: Conectar por USB**
```powershell
# Ver dispositivos conectados
adb devices

# Aceptar conexión en el teléfono si se solicita
```

**Paso 3: Instalar APK**
```powershell
# APK Debug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# APK Release
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### Verificar Instalación
```powershell
adb shell pm list packages | findstr "dungeonidle"
```

---

## Publicación en Google Play Store

### Requisitos
1. ✅ Cuenta de Google Play Developer ($25 de pago único)
2. ✅ APK Release firmado
3. ✅ Información de la app (descripción, screenshots, etc.)

### Pasos

**1. Crear Cuenta**
- Ir a [play.google.com/console](https://play.google.com/console)
- Crear cuenta de desarrollador
- Pagar $25

**2. Crear Aplicación**
- Click en "Crear aplicación"
- Completar datos básicos (nombre, categoría, etc.)

**3. Preparar APK Release**
```powershell
# Generar APK firmado (ver sección anterior)
./gradlew.bat assembleRelease
```

**4. Subir APK**
- En Google Play Console: `Versión > Creación > Internal Testing`
- Subir APK Release
- Rellenar información de versión

**5. Rellenar Tienda**
- Describir app
- Agregar screenshots (mínimo 2)
- Seleccionar categoría
- Definir clasificación de contenido

**6. Enviar a Revisión**
- Revisar todo
- Click en "Enviar para revisión"
- Esperar aprobación (típicamente 1-3 días)

---

## Actualización de Versión

### Incrementar Versión

Editar `android/app/build.gradle`:

```gradle
android {
    ...
    defaultConfig {
        applicationId "com.neoland.dungeonidle"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 2          // Incrementar
        versionName "1.1.0"    // Cambiar versión
    }
}
```

**Reglas:**
- `versionCode` debe aumentar siempre (nunca decrecer)
- `versionName` sigue [semantic versioning](https://semver.org/) (ej: 1.0.0)

Luego compilar de nuevo:
```powershell
cd android
./gradlew.bat assembleRelease
cd ..
```

---

## Optimizaciones para Release

### 1. Minificación de Código

En `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. Comprimir Assets Web

En `public/`, minimizar CSS y JavaScript.

### 3. Configurar ProGuard

Editar `android/app/proguard-rules.pro`:
```proguard
# Preservar clases críticas
-keep class com.neoland.dungeonidle.** { *; }
-keep class org.apache.** { *; }

# Optimizaciones generales
-optimizationpasses 5
-dontskipnonpubliclibraryclasses
```

---

## Troubleshooting

### Error: "JAVA_HOME not found"
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### Error: "Android SDK not found"
```powershell
$env:ANDROID_HOME = "C:\Users\<Usuario>\AppData\Local\Android\sdk"
```

### Error: "Gradle build failed"
```powershell
cd android
./gradlew.bat clean
./gradlew.bat assembleDebug
cd ..
```

### Error: "Keystore not found"
- Verificar que `my-release-key.jks` está en `android/app/`
- Regenerar si es necesario: `keytool -genkey -v -keystore my-release-key.jks ...`

### APK no se instala
```powershell
# Desinstalar versión anterior
adb uninstall com.neoland.dungeonidle

# Instalar de nuevo
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Emulador muy lento
- Aumentar RAM asignada en AVD Manager
- Usar aceleración HW: `Settings > Tools > Emulator > Notifications`

---

## Recursos

- 📖 [Documentación Android](https://developer.android.com/docs)
- 📖 [Guía de Gradle](https://gradle.org/guides/)
- 🔗 [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- 📚 [Capacitor Android Guide](https://capacitorjs.com/docs/android)

---

**Última actualización**: 31 de enero de 2026
