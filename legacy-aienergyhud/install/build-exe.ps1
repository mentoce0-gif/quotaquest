<#
  build-exe.ps1 — produce a standalone Windows monitor exe (no Node required to run).
  Uses Node's Single Executable Applications (SEA). Requires Node 20+ to BUILD.
  Result: monitor\dist\ai-energy-hud.exe  (run it instead of `node index.js`)

  Run:  powershell -ExecutionPolicy Bypass -File install\build-exe.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$monitor = Join-Path $root 'monitor'
Set-Location $monitor

Write-Host "=== AI Energy HUD — build standalone exe ===" -ForegroundColor Cyan
$nv = (& node --version).TrimStart('v'); $major = [int]($nv.Split('.')[0])
if ($major -lt 20) { throw "Node 20+ required to build (found $nv). The exe still runs without Node." }

New-Item -ItemType Directory -Force -Path (Join-Path $monitor 'dist') | Out-Null

# 1) bundle index.js + src/* into one file
Write-Host "[1/4] bundling with esbuild..."
& npx --yes esbuild index.js --bundle --platform=node --outfile=dist/bundle.js

# 2) generate the SEA blob
Write-Host "[2/4] generating SEA blob..."
& node --experimental-sea-config sea-config.json

# 3) copy the node binary as our exe
Write-Host "[3/4] copying node binary..."
$exe = Join-Path $monitor 'dist\ai-energy-hud.exe'
Copy-Item (Get-Command node).Source $exe -Force

# 4) inject the blob with postject
Write-Host "[4/4] injecting blob (postject)..."
& npx --yes postject $exe NODE_SEA_BLOB dist/sea-prep.blob `
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

Write-Host "Done -> $exe" -ForegroundColor Green
Write-Host "Place config.json next to the exe and run it (use --mock for a demo)."
