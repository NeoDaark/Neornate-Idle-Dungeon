#!/usr/bin/env pwsh

# ============================================
# Script de Compilación APK Release
# Neoland Dungeon Idle
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Compilando APK RELEASE - Neoland Dungeon Idle    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configurar variables de entorno
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\Neepii\AppData\Local\Android\sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Variables del script
$buildType = "release"
$apkDebugPath = "android\app\build\outputs\apk\debug\app-debug.apk"
$apkReleasePath = "android\app\build\outputs\apk\release\app-release.apk"

# ============================================
# Paso 1: Verificar JDK
# ============================================
Write-Host "Step 1️⃣  Verificando JDK 17..." -ForegroundColor Yellow
try {
    java -version 2>&1 | Out-Null
    Write-Host "✅ JDK encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: JDK 17 no encontrado" -ForegroundColor Red
    Write-Host "   Configura JAVA_HOME correctamente en este script" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# ============================================
# Paso 2: Sincronizar cambios con Capacitor
# ============================================
Write-Host "Step 2️⃣  Sincronizando cambios web con Capacitor..." -ForegroundColor Yellow
npm run sync
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en npm sync" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "✅ Sincronización completada" -ForegroundColor Green
Write-Host ""

# ============================================
# Paso 3: Limpiar compilaciones anteriores
# ============================================
Write-Host "Step 3️⃣  Limpiando compilaciones anteriores..." -ForegroundColor Yellow
Push-Location "android"
& ".\gradlew.bat" clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Limpieza retornó código de error" -ForegroundColor Yellow
}
Pop-Location
Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host ""

# ============================================
# Paso 4: Compilar APK en modo RELEASE
# ============================================
Write-Host "Step 4️⃣  Compilando APK en modo RELEASE..." -ForegroundColor Yellow
Write-Host "   (Esto puede tomar 2-5 minutos)" -ForegroundColor Cyan
Write-Host ""

Push-Location "android"
& ".\gradlew.bat" assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Compilación en modo RELEASE completada exitosamente" -ForegroundColor Green
    Pop-Location
    
    # ============================================
    # Paso 5: Verificar que el APK fue creado
    # ============================================
    Write-Host ""
    Write-Host "Step 5️⃣  Verificando APK generado..." -ForegroundColor Yellow
    
    if (Test-Path $apkReleasePath) {
        $fileSize = (Get-Item $apkReleasePath).Length / 1MB
        Write-Host "✅ APK Release encontrado" -ForegroundColor Green
        Write-Host "   Tamaño: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Green
        Write-Host ""
        
        # ============================================
        # Paso 6: Abrir carpeta en Explorador
        # ============================================
        Write-Host "Step 6️⃣  Abriendo carpeta en el Explorador..." -ForegroundColor Yellow
        $releaseFolder = (Resolve-Path "android\app\build\outputs\apk\release").Path
        explorer.exe $releaseFolder
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║             ✅ BUILD COMPLETADO EXITOSAMENTE        ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Ubicación del APK Release:" -ForegroundColor Cyan
        Write-Host "   $apkReleasePath" -ForegroundColor White
        Write-Host ""
        Write-Host "📦 Información del APK:" -ForegroundColor Cyan
        Write-Host "   Nombre: app-release.apk" -ForegroundColor White
        Write-Host "   Tamaño: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor White
        Write-Host "   Tipo: Release (Optimizado)" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "   1. Instalar en dispositivo: adb install -r $apkReleasePath" -ForegroundColor White
        Write-Host "   2. Publicar en Play Store: Google Play Console" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Error: APK Release no encontrado en:" -ForegroundColor Red
        Write-Host "   $apkReleasePath" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    Pop-Location
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║               ❌ ERROR EN LA COMPILACIÓN            ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verifica que JAVA_HOME esté configurado correctamente" -ForegroundColor White
    Write-Host "   2. Verifica que ANDROID_HOME esté configurado correctamente" -ForegroundColor White
    Write-Host "   3. Ejecuta: cd android && .\gradlew clean" -ForegroundColor White
    Write-Host "   4. Intenta nuevamente" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Read-Host "Presiona Enter para salir"
