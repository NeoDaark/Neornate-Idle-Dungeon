# Script para verificar que los iconos están en su lugar
# Uso: .\verify-icon-setup.ps1

$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

Write-Host "${Blue}=== Verificador de Iconos ===${Reset}`n"

$ResPath = "android/app/src/main/res"
$RequiredFiles = @(
    "mipmap-mdpi/ic_launcher.png",
    "mipmap-hdpi/ic_launcher.png",
    "mipmap-xhdpi/ic_launcher.png",
    "mipmap-xxhdpi/ic_launcher.png",
    "mipmap-xxxhdpi/ic_launcher.png"
)

$FoundCount = 0
$MissingCount = 0

Write-Host "${Yellow}Verificando iconos necesarios...${Reset}`n"

foreach ($file in $RequiredFiles) {
    $FullPath = Join-Path $ResPath $file
    
    if (Test-Path $FullPath) {
        $FileSize = (Get-Item $FullPath).Length / 1KB
        Write-Host "${Green}✓${Reset} $file ($('{0:F1}' -f $FileSize) KB)"
        $FoundCount++
    } else {
        Write-Host "${Red}✗${Reset} $file (NO ENCONTRADO)"
        $MissingCount++
    }
}

Write-Host ""
Write-Host "${Blue}=== Resumen ===${Reset}"
Write-Host "${Green}Encontrados: $FoundCount${Reset}"
if ($MissingCount -gt 0) {
    Write-Host "${Red}Faltantes: $MissingCount${Reset}"
    Write-Host ""
    Write-Host "${Yellow}Para añadir los iconos, ejecuta:${Reset}"
    Write-Host "  .\update-icon.ps1"
} else {
    Write-Host "${Green}✓ Todos los iconos están en su lugar${Reset}"
    Write-Host ""
    Write-Host "${Yellow}Estás listo para compilar:${Reset}"
    Write-Host "  npm run build"
    Write-Host "  .\build-apk.ps1"
}
