<#
  AI Energy HUD — installer (Windows / PowerShell)
  - Verifies Node.js
  - Seeds monitor/config.json from the example
  - Copies the Rainmeter skin into Documents\Rainmeter\Skins
  - Starts the monitor (hidden) and (if Rainmeter is installed) loads the skin
  Run:  Right-click install.bat > Run, or  powershell -ExecutionPolicy Bypass -File install.ps1
#>

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$monitor = Join-Path $root 'monitor'
$skinSrc = Join-Path $root 'skin\AIEnergyHUD'

Write-Host "=== AI Energy HUD installer ===" -ForegroundColor Cyan

# 1) Node.js check
try {
  $nodeV = (& node --version) 2>$null
  Write-Host "[ok] Node.js $nodeV detected"
} catch {
  Write-Warning "Node.js not found. Install Node 16+ from https://nodejs.org then re-run."
  Write-Host "Tip: you can still preview the HUD with bundled sample state.json (skin only)."
}

# 2) Seed config.json
$cfg = Join-Path $monitor 'config.json'
$cfgExample = Join-Path $monitor 'config.example.json'
if (-not (Test-Path $cfg)) {
  Copy-Item $cfgExample $cfg
  Write-Host "[ok] Created monitor\config.json (edit hpMaxTokens to calibrate your plan)"
}

# 3) Copy skin into Rainmeter Skins folder
$skinsRoot = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Rainmeter\Skins'
if (Test-Path $skinsRoot) {
  $dest = Join-Path $skinsRoot 'AIEnergyHUD'
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Copy-Item (Join-Path $skinSrc '*') $dest -Recurse -Force
  Write-Host "[ok] Skin copied to $dest"
} else {
  Write-Warning "Rainmeter Skins folder not found. Install Rainmeter (https://www.rainmeter.net), then copy skin\AIEnergyHUD there."
}

# 4) Start the monitor hidden (live mode). Use --mock for a demo without real logs.
if ($nodeV) {
  Write-Host "[..] Starting monitor (live). For a demo run: node index.js --mock"
  Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory $monitor -WindowStyle Hidden
  Write-Host "[ok] Monitor running. It writes skin\AIEnergyHUD\@Resources\state.json every few seconds."
}

# 5) Try to load the skin in Rainmeter
$rm = "$env:ProgramFiles\Rainmeter\Rainmeter.exe"
if (Test-Path $rm) {
  & $rm "!ActivateConfig" "AIEnergyHUD" "AIEnergyHUD.ini"
  Write-Host "[ok] Asked Rainmeter to load AI Energy HUD."
} else {
  Write-Host "[i] Open Rainmeter > Manage > refresh, then load AIEnergyHUD.ini."
}

Write-Host "Done. Drag the HUD anywhere; right-click for Rainmeter options." -ForegroundColor Green
