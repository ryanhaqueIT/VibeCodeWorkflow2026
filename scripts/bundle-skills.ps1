# Bundles the skills into a ZIP file for distribution
$BundlePath = "vibecode-skills-bundle.zip"
Write-Host "Creating bundle $BundlePath..." -ForegroundColor Cyan

if (Test-Path $BundlePath) { Remove-Item $BundlePath }

Compress-Archive -Path "skills\*" -DestinationPath $BundlePath

if (Test-Path $BundlePath) {
    Write-Host "Bundle created successfully!" -ForegroundColor Green
} else {
    Write-Error "Failed to create bundle."
}
