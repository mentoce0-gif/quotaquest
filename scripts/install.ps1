<#
  QuotaQuest — installer (Windows / PowerShell)
  -----------------------------------------------------
  1. Verifies Node.js (18+).
  2. Copies the Rainmeter skin into your Rainmeter Skins folder.
  3. Points the monitor at the installed skin's state.json.
  4. Prints the final steps (load skin in Rainmeter + run the monitor).

  Usage:   powershell -ExecutionPolicy Bypass -File install.ps1
  Options: -Plan max20x   (pro | max5x | max20x | custom)
#>
param(
  [string]$Plan = "max20x"
)

$ErrorActionPreference = "Stop"
$Root      = Split-Path -Parent $PSScriptRoot          # repo root (/release)
$SkinSrc   = Join-Path $Root "skin\QuotaQuestHUD"
$MonitorDir= Join-Path $Root "monitor"
$ConfigPath= Join-Path $MonitorDir "config.json"

Write-Host "== QuotaQuest installer ==" -ForegroundColor Cyan

# 1. Node check ---------------------------------------------------------------
try {
  $nodeV = (& node --version) 2>$null
  Write-Host "  [ok] Node.js $nodeV"
} catch {
  Write-Warning "Node.js not found. Install Node 18+ from https://nodejs.org then re-run."
  exit 1
}

# 2. Locate Rainmeter Skins folder -------------------------------------------
$SkinsRoot = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "Rainmeter\Skins"
if (-not (Test-Path $SkinsRoot)) {
  Write-Warning "Rainmeter Skins folder not found at $SkinsRoot."
  Write-Warning "Install Rainmeter from https://www.rainmeter.net then re-run (or copy the skin manually)."
  $SkinsRoot = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "Rainmeter\Skins"
}
$SkinDst = Join-Path $SkinsRoot "QuotaQuestHUD"

# 3. Copy skin ----------------------------------------------------------------
New-Item -ItemType Directory -Force -Path $SkinDst | Out-Null
Copy-Item -Recurse -Force (Join-Path $SkinSrc "*") $SkinDst
Write-Host "  [ok] Skin copied -> $SkinDst"

# 4. Point monitor at the installed skin's state.json -------------------------
$StateTarget = Join-Path $SkinDst "@Resources\state.json"
$cfg = Get-Content $ConfigPath -Raw | ConvertFrom-Json
$cfg.statePath = $StateTarget
$cfg.plan = $Plan
($cfg | ConvertTo-Json -Depth 8) | Set-Content $ConfigPath -Encoding UTF8
Write-Host "  [ok] Monitor will write -> $StateTarget"
Write-Host "  [ok] Plan set to '$Plan'"

# 5. Prime one reading so the HUD shows data immediately ----------------------
Push-Location $MonitorDir
& node index.js --once | Out-Null
Pop-Location
Write-Host "  [ok] Primed first reading."

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1) Open Rainmeter -> Refresh All -> load QuotaQuestHUD\QuotaQuestHUD.ini"
Write-Host "  2) Start the monitor (keeps the HUD live):"
Write-Host "       double-click scripts\start-monitor.bat"
Write-Host "     or for synthetic data: scripts\start-monitor-demo.bat"
Write-Host ""
Write-Host "Done. Watch your HP." -ForegroundColor Cyan
