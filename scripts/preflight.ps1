<#
  QuotaQuest — 事前チェック（今晩の作業前に1回）
  必要ツールの有無・バージョン・ログイン状態・リポジトリ名の空き状況を確認するだけ。
  何も変更しません（読み取りのみ）。
  実行:  powershell -ExecutionPolicy Bypass -File scripts\preflight.ps1 -Repo quotaquest
#>
param([string]$Repo = "quotaquest")
function Test-Cmd($n){ [bool](Get-Command $n -ErrorAction SilentlyContinue) }
Write-Host "== QuotaQuest preflight ==" -ForegroundColor Cyan
$ok = $true

if (Test-Cmd node) { Write-Host "  [ok] Node $(node -v)" } else { Write-Host "  [X] Node 未導入 → https://nodejs.org (18+)" -ForegroundColor Yellow; $ok=$false }
if (Test-Cmd git)  { Write-Host "  [ok] git $(git --version)" } else { Write-Host "  [X] git 未導入 → https://git-scm.com" -ForegroundColor Yellow; $ok=$false }
if (Test-Cmd gh)   { Write-Host "  [ok] gh $(gh --version | Select-Object -First 1)" } else { Write-Host "  [X] GitHub CLI 未導入 → https://cli.github.com" -ForegroundColor Yellow; $ok=$false }

# gh ログイン
if (Test-Cmd gh) {
  gh auth status 2>$null
  if ($LASTEXITCODE -eq 0) { Write-Host "  [ok] gh ログイン済み" }
  else { Write-Host "  [!] gh 未ログイン → `gh auth login` を実行" -ForegroundColor Yellow; $ok=$false }
}

# Rainmeter（HUD描画に必要）
$rm = Test-Path "$env:ProgramFiles\Rainmeter\Rainmeter.exe"
if ($rm) { Write-Host "  [ok] Rainmeter 検出" } else { Write-Host "  [!] Rainmeter 未検出 → https://www.rainmeter.net（HUD描画に必要）" -ForegroundColor Yellow }

# リポジトリ名の空き確認（ログイン時のみ）
if ((Test-Cmd gh) -and ($LASTEXITCODE -eq 0)) {
  $owner = (gh api user --jq ".login" 2>$null)
  if ($owner) {
    gh repo view "$owner/$Repo" 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "  [!] $owner/$Repo は既に存在 → 別名(-Repo)を検討" -ForegroundColor Yellow }
    else { Write-Host "  [ok] リポジトリ名 '$Repo' は使用可能" }
  }
}

# monitor のスモークテスト
if (Test-Cmd node) {
  Push-Location (Join-Path (Split-Path -Parent $PSScriptRoot) "monitor")
  node test/run.js 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) { Write-Host "  [ok] monitor ユニットテスト合格" } else { Write-Host "  [X] monitor テスト失敗" -ForegroundColor Red; $ok=$false }
  Pop-Location
}

Write-Host ""
if ($ok) { Write-Host "準備OK。今晩は install.ps1 → (描画確認) → publish-github.ps1 の順で。" -ForegroundColor Green }
else     { Write-Host "上の [X]/[!] を解消してから本番へ。" -ForegroundColor Yellow }
