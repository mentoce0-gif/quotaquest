<#
  QuotaQuest — GitHub 公開 代行スクリプト (Windows / PowerShell)
  ------------------------------------------------------------
  これ1本で:
   1) git init + 初回コミット（先使用の証拠＝公開日を確保）
   2) GitHub にリポジトリ作成 + push
   3) Description / Topics を設定
   4) GitHub Pages を有効化（landing-page を公開）
   5) v0.1.0 リリースを作成し dist zip を添付

  前提: GitHub CLI (gh) がインストール済みで `gh auth login` 済みであること。
        https://cli.github.com/  からインストール → `gh auth login` を一度実行。

  使い方:  powershell -ExecutionPolicy Bypass -File scripts\publish-github.ps1 -Repo quotaquest
#>
param(
  [string]$Repo = "quotaquest",
  [ValidateSet("public","private")][string]$Visibility = "public"
)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$Desc   = "Turn your AI quota into an MMORPG status bar — a half-transparent, always-on-top desktop HUD showing Claude Code usage as HP/MP/EXP with a recovery timer and burn rate. 100% local, MIT core."
$Topics = "claude-code,rainmeter,hud,overlay,ai-tools,usage-monitor,developer-tools,desktop-widget,gamification,mmorpg,windows,nodejs,vibe-coding,llm,token-usage,ccusage,productivity"

# 0) 前提チェック
if (-not (Get-Command gh -ErrorAction SilentlyContinue))   { throw "GitHub CLI (gh) が見つかりません。https://cli.github.com/ からインストールしてください。" }
if (-not (Get-Command git -ErrorAction SilentlyContinue))  { throw "git が見つかりません。" }
gh auth status 2>$null; if ($LASTEXITCODE -ne 0) { throw "`gh auth login` を先に実行してログインしてください。" }

# 1) git init + 初回コミット
if (-not (Test-Path ".git")) { git init -q }
git add -A
git commit -q -m "v0.1.0 — QuotaQuest MVP (monitor + Rainmeter skin + docs + marketing + IP docs)" 2>$null
git branch -M main

# 2) リポジトリ作成 + push（既存ならスキップ）
$exists = (gh repo view $Repo 2>$null)
if ($LASTEXITCODE -ne 0) {
  gh repo create $Repo --$Visibility --source "." --remote origin --description $Desc --push
} else {
  Write-Host "リポジトリは既存。push します。"
  git push -u origin main
}
$owner = (gh api user --jq ".login")

# 3) Description / Topics
gh repo edit "$owner/$Repo" --description $Desc
foreach ($t in $Topics.Split(",")) { gh repo edit "$owner/$Repo" --add-topic $t.Trim() | Out-Null }
Write-Host "  [ok] description + topics 設定"

# 4) GitHub Pages 有効化（landing-page.html を配信）
$pagesBody = '{"source":{"branch":"main","path":"/"}}'
try {
  $pagesBody | gh api -X POST "repos/$owner/$Repo/pages" --input - | Out-Null
  Write-Host "  [ok] Pages 有効化 → https://$owner.github.io/$Repo/landing-page.html"
} catch { Write-Warning "Pages は Settings → Pages → main /root から手動で有効化してください。" }

# 5) Release 作成（dist zip を git archive で再現的に生成して添付）
git archive --format=zip -o "quotaquest-v0.1.0.zip" HEAD
gh release create "v0.1.0" "quotaquest-v0.1.0.zip" `
  --title "v0.1.0 — QuotaQuest MVP (usage HUD for Claude Code)" `
  --notes "MMORPG-style desktop HUD for Claude Code usage. HP/MP/EXP, recovery timer, burn rate, NORMAL/WARNING/CRITICAL. See CHANGELOG.md. 100% local, MIT core. Not affiliated with Anthropic."
Write-Host ""
Write-Host "完了！ https://github.com/$owner/$Repo" -ForegroundColor Green
Write-Host "先使用の証拠（公開日）が確保されました。" -ForegroundColor Cyan
