<#
  build-exe.ps1 — standalone Windows monitor exe (no Node needed to RUN).
  Ported from the AI Energy HUD build; targets the QuotaQuest monitor.
  Node 20+ required to BUILD. Result: monitor\dist\quotaquest.exe
  Run: powershell -ExecutionPolicy Bypass -File scripts\build-exe.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$monitor = Join-Path $root 'monitor'
Set-Location $monitor
Write-Host "=== QuotaQuest — build standalone exe ===" -ForegroundColor Cyan
$nv = (& node --version).TrimStart('v'); if ([int]($nv.Split('.')[0]) -lt 20) { throw "Node 20+ required to build (found $nv)." }
New-Item -ItemType Directory -Force -Path (Join-Path $monitor 'dist') | Out-Null
Write-Host "[1/4] bundling (esbuild)..."; & npx --yes esbuild index.js --bundle --platform=node --outfile=dist/bundle.js
Write-Host "[2/4] SEA blob...";          & node --experimental-sea-config sea-config.json
Write-Host "[3/4] copy node binary...";  $exe = Join-Path $monitor 'dist\quotaquest.exe'; Copy-Item (Get-Command node).Source $exe -Force
Write-Host "[4/4] inject blob...";        & npx --yes postject $exe NODE_SEA_BLOB dist/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
Write-Host "Done -> $exe" -ForegroundColor Green
Write-Host "Place config.json next to the exe; run it instead of 'node index.js' (--demo for a demo)."
