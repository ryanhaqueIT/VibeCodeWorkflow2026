param (
    [Parameter(Mandatory=$true)]
    [string]$BeadId,
    [string]$Message = "Task completed."
)

# 1. Close the bead in official Beads CLI
Write-Host "Closing bead $BeadId..." -ForegroundColor Cyan
& $HOME\go\bin\bd.exe close $BeadId

# 2. Update the vibe-state.json
$StatePath = Join-Path $PSScriptRoot "..\.agent\work\vibe-state.json"
$BackupPath = "$StatePath.bak"

if (Test-Path $StatePath) {
    # Create backup for robustness (B6)
    Copy-Item $StatePath $BackupPath -Force
    Write-Host "Backup created at $BackupPath" -ForegroundColor Gray
    
    $State = Get-Content $StatePath | ConvertFrom-Json
    $State.history += "Completed Bead ${BeadId}: ${Message}"
    $State.current_bead_id = "" # Clear current focusing
    $State | ConvertTo-Json -Depth 10 | Set-Content $StatePath
    Write-Host "State updated in vibe-state.json" -ForegroundColor Green
} else {
    Write-Warning "vibe-state.json not found at $StatePath"
}
