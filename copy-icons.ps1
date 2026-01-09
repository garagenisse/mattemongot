# Script för att kopiera nedladdade ikoner till Android-projektet
# Kör detta efter att du laddat ner alla ikoner från icon-generator.html

param(
    [string]$DownloadsPath = "$env:USERPROFILE\Downloads"
)

$iconMappings = @{
    "mipmap-xxxhdpi-ic_launcher.png" = "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png"
    "mipmap-xxhdpi-ic_launcher.png" = "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png"
    "mipmap-xhdpi-ic_launcher.png" = "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png"
    "mipmap-hdpi-ic_launcher.png" = "android\app\src\main\res\mipmap-hdpi\ic_launcher.png"
    "mipmap-mdpi-ic_launcher.png" = "android\app\src\main\res\mipmap-mdpi\ic_launcher.png"
}

Write-Host "Kopierar ikoner från $DownloadsPath..." -ForegroundColor Cyan

$copiedCount = 0
foreach ($source in $iconMappings.Keys) {
    $sourcePath = Join-Path $DownloadsPath $source
    $destPath = $iconMappings[$source]
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "✓ Kopierade: $source" -ForegroundColor Green
        $copiedCount++
    } else {
        Write-Host "✗ Hittade inte: $source" -ForegroundColor Yellow
    }
}

Write-Host "`nKopierade $copiedCount av $($iconMappings.Count) ikoner." -ForegroundColor Cyan

if ($copiedCount -eq $iconMappings.Count) {
    Write-Host "`n✓ Alla ikoner kopierade! Bygg om appen med:" -ForegroundColor Green
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host "  npx cap sync android" -ForegroundColor White
    Write-Host "  cd android; .\gradlew bundleRelease" -ForegroundColor White
}
