#!/usr/bin/env bash
# QuotaQuest — GitHub 公開 代行スクリプト (macOS / Linux)
# 前提: gh CLI を入れて `gh auth login` 済みであること (https://cli.github.com/)
# 使い方: bash scripts/publish-github.sh [repo-name] [public|private]
set -euo pipefail
REPO="${1:-quotaquest}"
VIS="${2:-public}"
cd "$(dirname "$0")/.."

DESC="Turn your AI quota into an MMORPG status bar — a half-transparent, always-on-top desktop HUD showing Claude Code usage as HP/MP/EXP with a recovery timer and burn rate. 100% local, MIT core."
TOPICS="claude-code rainmeter hud overlay ai-tools usage-monitor developer-tools desktop-widget gamification mmorpg windows nodejs vibe-coding llm token-usage ccusage productivity"

command -v gh  >/dev/null || { echo "gh CLI が必要: https://cli.github.com/"; exit 1; }
command -v git >/dev/null || { echo "git が必要"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "先に: gh auth login"; exit 1; }

# 1) git init + 初回コミット（先使用の証拠）
[ -d .git ] || git init -q
git add -A
git commit -q -m "v0.1.0 — QuotaQuest MVP (monitor + Rainmeter skin + docs + marketing + IP docs)" || true
git branch -M main

# 2) repo 作成 + push
if gh repo view "$REPO" >/dev/null 2>&1; then
  git push -u origin main
else
  gh repo create "$REPO" --"$VIS" --source . --remote origin --description "$DESC" --push
fi
OWNER="$(gh api user --jq .login)"

# 3) description + topics
gh repo edit "$OWNER/$REPO" --description "$DESC"
for t in $TOPICS; do gh repo edit "$OWNER/$REPO" --add-topic "$t" >/dev/null; done
echo "  [ok] description + topics"

# 4) Pages
echo '{"source":{"branch":"main","path":"/"}}' | gh api -X POST "repos/$OWNER/$REPO/pages" --input - >/dev/null 2>&1 \
  && echo "  [ok] Pages -> https://$OWNER.github.io/$REPO/landing-page.html" \
  || echo "  [warn] Pages は Settings → Pages から手動で有効化を"

# 5) Release（git archive で zip を再現生成して添付）
git archive --format=zip -o quotaquest-v0.1.0.zip HEAD
gh release create v0.1.0 quotaquest-v0.1.0.zip \
  --title "v0.1.0 — QuotaQuest MVP (usage HUD for Claude Code)" \
  --notes "MMORPG-style desktop HUD for Claude Code usage. HP/MP/EXP, recovery timer, burn rate, status. See CHANGELOG.md. 100% local, MIT core. Not affiliated with Anthropic."

echo ""
echo "完了: https://github.com/$OWNER/$REPO"
echo "先使用の証拠（公開日）が確保されました。"
