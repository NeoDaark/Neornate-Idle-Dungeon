# Script para copiar iconos desde una carpeta local ic_launcher/
# Uso: .\copy-app-icon-from-folder.ps1 -IconFolder "ruta/a/ic_launcher"

param(
    [Parameter(Mandatory=$true)]
    [string]$IconFolder
)

# Colores
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

Write-Host "${Blue}=== Copiador de Icono desde Carpeta ===${Reset}`n"

# Validar que estamos en la raíz del proyecto
if (-not (Test-Path "package.json")) {
    Write-Host "${Red}❌ Error: Ejecuta este script desde la raíz del proyecto${Reset}"
    exit 1
}

# Validar que la carpeta existe
if (-not (Test-Path $IconFolder)) {
    Write-Host "${Red}❌ Error: No se encontró la carpeta: $IconFolder${Reset}"
    exit 1
}

Write-Host "${Green}✓ Carpeta encontrada: $IconFolder${Reset}`n"

# Definir estructura esperada y destinos
# Nota: Android Asset Studio genera estos archivos
$IconMap = @{
    # Mipmap icons PRINCIPALES (REQUERIDOS)
    "mipmap-mdpi/ic_launcher.png" = @("mipmap-mdpi", "ic_launcher.png")
    "mipmap-hdpi/ic_launcher.png" = @("mipmap-hdpi", "ic_launcher.png")
    "mipmap-xhdpi/ic_launcher.png" = @("mipmap-xhdpi", "ic_launcher.png")
    "mipmap-xxhdpi/ic_launcher.png" = @("mipmap-xxhdpi", "ic_launcher.png")
    "mipmap-xxxhdpi/ic_launcher.png" = @("mipmap-xxxhdpi", "ic_launcher.png")
    
    # XML para adaptive icons (Android 8+) - REQUERIDO
    "mipmap-anydpi-v26/ic_launcher.xml" = @("mipmap-anydpi-v26", "ic_launcher.xml")
}

# Definir archivos OPCIONALES (Android Asset Studio también genera estos)
$OptionalIconMap = @{
    # Adaptive back/fore layers (opcionales)
    "mipmap-mdpi/ic_launcher_adaptive_back.png" = @("mipmap-mdpi", "ic_launcher_adaptive_back.png")
    "mipmap-hdpi/ic_launcher_adaptive_back.png" = @("mipmap-hdpi", "ic_launcher_adaptive_back.png")
    "mipmap-xhdpi/ic_launcher_adaptive_back.png" = @("mipmap-xhdpi", "ic_launcher_adaptive_back.png")
    "mipmap-xxhdpi/ic_launcher_adaptive_back.png" = @("mipmap-xxhdpi", "ic_launcher_adaptive_back.png")
    "mipmap-xxxhdpi/ic_launcher_adaptive_back.png" = @("mipmap-xxxhdpi", "ic_launcher_adaptive_back.png")
    
    "mipmap-mdpi/ic_launcher_adaptive_fore.png" = @("mipmap-mdpi", "ic_launcher_adaptive_fore.png")
    "mipmap-hdpi/ic_launcher_adaptive_fore.png" = @("mipmap-hdpi", "ic_launcher_adaptive_fore.png")
    "mipmap-xhdpi/ic_launcher_adaptive_fore.png" = @("mipmap-xhdpi", "ic_launcher_adaptive_fore.png")
    "mipmap-xxhdpi/ic_launcher_adaptive_fore.png" = @("mipmap-xxhdpi", "ic_launcher_adaptive_fore.png")
    "mipmap-xxxhdpi/ic_launcher_adaptive_fore.png" = @("mipmap-xxxhdpi", "ic_launcher_adaptive_fore.png")
    
    # Round icons (opcionales)
    "mipmap-mdpi/ic_launcher_round.png" = @("mipmap-mdpi", "ic_launcher_round.png")
    "mipmap-hdpi/ic_launcher_round.png" = @("mipmap-hdpi", "ic_launcher_round.png")
    "mipmap-xhdpi/ic_launcher_round.png" = @("mipmap-xhdpi", "ic_launcher_round.png")
    "mipmap-xxhdpi/ic_launcher_round.png" = @("mipmap-xxhdpi", "ic_launcher_round.png")
    "mipmap-xxxhdpi/ic_launcher_round.png" = @("mipmap-xxxhdpi", "ic_launcher_round.png")
    
    # Archivos legacy drawable (opcionales)
    "drawable-mdpi/ic_launcher.png" = @("drawable-mdpi", "ic_launcher.png")
    "drawable-hdpi/ic_launcher.png" = @("drawable-hdpi", "ic_launcher.png")
    "drawable-xhdpi/ic_launcher.png" = @("drawable-xhdpi", "ic_launcher.png")
    "drawable-xxhdpi/ic_launcher.png" = @("drawable-xxhdpi", "ic_launcher.png")
    "drawable-xxxhdpi/ic_launcher.png" = @("drawable-xxxhdpi", "ic_launcher.png")
    
    # Adaptive foreground (opcional)
    "mipmap-anydpi-v26/ic_launcher_foreground.xml" = @("mipmap-anydpi-v26", "ic_launcher_foreground.xml")
}

$ResPath = "android/app/src/main/res"
$SuccessCount = 0
$RequiredCount = 0
$FailCount = 0
$OptionalCount = 0

Write-Host "${Blue}📁 Copiando iconos requeridos...${Reset}`n"

# Primero: copiar archivos REQUERIDOS
foreach ($relPath in $IconMap.Keys) {
    $SourcePath = Join-Path $IconFolder $relPath
    $DestDirName = $IconMap[$relPath][0]
    $FileName = $IconMap[$relPath][1]
    $DestDir = Join-Path $ResPath $DestDirName
    $DestPath = Join-Path $DestDir $FileName
    
    $RequiredCount++
    
    if (Test-Path $SourcePath) {
        # Crear directorio si no existe
        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
        }
        
        Copy-Item -Path $SourcePath -Destination $DestPath -Force
        Write-Host "${Green}✓${Reset} $FileName → $DestDirName"
        $SuccessCount++
    } else {
        Write-Host "${Red}✗${Reset} FALTANTE: $relPath"
        $FailCount++
    }
}

# Segundo: copiar archivos OPCIONALES (sin mostrar advertencia si faltan)
Write-Host ""
Write-Host "${Blue}📁 Buscando iconos opcionales...${Reset}`n"

foreach ($relPath in $OptionalIconMap.Keys) {
    $SourcePath = Join-Path $IconFolder $relPath
    $DestDirName = $OptionalIconMap[$relPath][0]
    $FileName = $OptionalIconMap[$relPath][1]
    $DestDir = Join-Path $ResPath $DestDirName
    $DestPath = Join-Path $DestDir $FileName
    
    if (Test-Path $SourcePath) {
        # Crear directorio si no existe
        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
        }
        
        Copy-Item -Path $SourcePath -Destination $DestPath -Force
        Write-Host "${Green}✓${Reset} $FileName → $DestDirName"
        $OptionalCount++
    }
}

Write-Host ""
Write-Host "${Blue}=== Resumen ===${Reset}"
Write-Host "${Green}✓ Iconos requeridos copiados: $SuccessCount / $RequiredCount${Reset}"
if ($OptionalCount -gt 0) {
    Write-Host "${Green}✓ Iconos opcionales copiados: $OptionalCount${Reset}"
}

if ($FailCount -gt 0) {
    Write-Host "${Red}✗ FALTAN ARCHIVOS REQUERIDOS: $FailCount${Reset}"
    Write-Host "${Yellow}Verifica que el archivo ZIP contiene la estructura correcta${Reset}"
}

Write-Host ""
Write-Host "${Green}✓ ¡Icono actualizado correctamente!${Reset}`n"
Write-Host "${Yellow}Próximos pasos:${Reset}"
Write-Host "1. Ejecuta: npm run build"
Write-Host "2. Ejecuta: .\build-apk.ps1"
Write-Host ""
