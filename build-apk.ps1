#!/usr/bin/env pwsh

# ============================================
# Script de Compilación APK Debug
# Neornate - Idle Dungeon
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Compilando APK DEBUG - Neornate Idle Dungeon   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configurar variables de entorno
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:ANDROID_HOME = "C:\Users\Neepii\AppData\Local\Android\sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Variables del script
$projectDir = Get-Location
$apkDebugPath = Join-Path $projectDir "android\app\build\outputs\apk\debug\app-debug.apk"

# ============================================
# Paso 1: Verificar JDK
# ============================================
Write-Host "Step 1️⃣  Verificando JDK 21..." -ForegroundColor Yellow
try {
    java -version 2>&1 | Out-Null
    Write-Host "✅ JDK encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: JDK 21 no encontrado" -ForegroundColor Red
    Write-Host "   Configura JAVA_HOME correctamente en este script" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# Paso 2: Compilar proyecto web (Vite)
# ============================================
Write-Host "Step 2️⃣  Compilando proyecto web con Vite..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en npm run build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build web completado" -ForegroundColor Green
Write-Host ""

# ============================================
# Paso 3: Sincronizar cambios con Capacitor
# ============================================
Write-Host "Step 3️⃣  Sincronizando cambios web con Capacitor..." -ForegroundColor Yellow
npm run cap-sync
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en npm run cap-sync" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Sincronización completada" -ForegroundColor Green
Write-Host ""

# ============================================
# Paso 4: Limpiar compilaciones anteriores
# ============================================
Write-Host "Step 4️⃣  Limpiando compilaciones anteriores..." -ForegroundColor Yellow
Push-Location "android"
& ".\gradlew.bat" clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Limpieza retornó código de error" -ForegroundColor Yellow
}
Pop-Location
Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host ""

# ============================================
# Paso 5: Compilar APK en modo DEBUG
# ============================================
Write-Host "Step 5️⃣  Compilando APK en modo DEBUG..." -ForegroundColor Yellow
Write-Host "   (Esto puede tomar 3-5 minutos)" -ForegroundColor Cyan
Write-Host ""

Push-Location "android"
& ".\gradlew.bat" assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Compilación en modo DEBUG completada exitosamente" -ForegroundColor Green
    Pop-Location
    
    # ============================================
    # Paso 6: Verificar que el APK fue creado
    # ============================================
    Write-Host ""
    Write-Host "Step 6️⃣  Verificando APK generado..." -ForegroundColor Yellow
    
    if (Test-Path $apkDebugPath) {
        $fileSize = (Get-Item $apkDebugPath).Length / 1MB
        Write-Host "✅ APK Debug encontrado" -ForegroundColor Green
        Write-Host "   Tamaño: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Green
        Write-Host ""
        
        # ============================================
        # Paso 7: Abrir carpeta en Explorador
        # ============================================
        Write-Host "Step 7️⃣  Abriendo carpeta en el Explorador..." -ForegroundColor Yellow
        $debugFolder = (Resolve-Path "android\app\build\outputs\apk\debug").Path
        explorer.exe $debugFolder
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║             ✅ BUILD COMPLETADO EXITOSAMENTE        ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Ubicación del APK Debug:" -ForegroundColor Cyan
        Write-Host "   $apkDebugPath" -ForegroundColor White
        Write-Host ""
        Write-Host "📦 Información del APK:" -ForegroundColor Cyan
        Write-Host "   Nombre: app-debug.apk" -ForegroundColor White
        Write-Host "   Tamaño: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor White
        Write-Host "   Tipo: Debug (Para desarrollo)" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "   1. Conecta tu dispositivo Android" -ForegroundColor White
        Write-Host "   2. Ejecuta: .\install-android.ps1" -ForegroundColor White
        Write-Host "   O manualmente: adb install -r $apkDebugPath" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Error: APK Debug no encontrado en:" -ForegroundColor Red
        Write-Host "   $apkDebugPath" -ForegroundColor Red
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
    exit 1
}
