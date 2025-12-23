# Runs gitingest and captures the output for the agent
$OutputPath = "context-pack.md"

# Try to find a working gitingest call
if (Get-Command gitingest -ErrorAction SilentlyContinue) {
    gitingest . --output $OutputPath
} else {
    python -m gitingest . --output $OutputPath
}

if (Test-Path $OutputPath) {
    Write-Host "Context packed successfully to $OutputPath" -ForegroundColor Green
} else {
    Write-Error "Failed to generate context-pack.md"
}
