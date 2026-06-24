# MARKET_RESEARCH.md — AI Energy HUD

> Phase 1 / 市場調査
> 最終更新: 2026-06-23 / 調査者: Product Lead (Claude)

本書は AI コーディングエージェントの **利用制限・可視化ツール・類似サービス・GitHub OSS** を調査し、`AI Energy HUD`（Claude Code 等の利用量を MMORPG 風 HP/MP ゲージで可視化する Windows 常駐 HUD）の市場機会を確定するためのものである。

---

## 0. エグゼクティブサマリー

2025〜2026年にかけて、主要 AI コーディングツールはこぞって **「不透明なトークン/クレジット従量課金」** へ移行した。その結果、ユーザーは「自分が今どれだけ消費したか・いつ回復するか」を **体感できない** という共通の痛みを抱えている。とくに 2026年6月の GitHub Copilot 課金改定、Codex のサイレント消費問題（Issue #15336）がこの痛みを一気に表面化させた。

既存の可視化ツール（ccusage / tokscale / TokenTracker 等）は **CLI かダッシュボードか macOS メニューバー** に偏っており、**Windows 常駐・常時最前面・ゲーミフィケーション・配信オーバーレイ・複数エージェントのパーティ表示** を同時に満たすプロダクトは存在しない。ここが本プロダクトの空白地帯（ホワイトスペース）である。

---

## 1. 各ツールの利用制限（2026年6月時点）

### 1.1 Claude Code (Anthropic)
- 課金構造は **5時間ローリングウィンドウ + 週次上限** の二層構造（週次上限は2025年8月に追加）。
- 概算トークン配分: **Pro ≒ 44,000 tokens/window、Max5 ≒ 88,000、Max20 ≒ 220,000**。
- 週次上限は **アカウントごとに固定された曜日・時刻にリセット**。`Settings > Usage` で次回リセット時刻を確認可能。
- Max プランは「全モデル横断の週次上限」と「Sonnet専用の週次上限」を別々に持つ。
- Anthropic は固定トークン値ではなく **相対的な表現** に移行しており、モデル・会話長・添付・需要で実効ヘッドルームが変動する → **ユーザーが残量を読みにくい**。

### 1.2 OpenAI Codex (ChatGPT plan / CLI)
- **5時間ウィンドウ + 週次キャップ** の二層構造。週次キャップは「週最初のメッセージから7日ローリング」。
- 2つのウィンドウは独立管理され、**`/status` のメッセージ数と週次消費が線形に一致しない**（直感に反する）。
- クレジット計算例: GPT-5.5 は 100万入力トークンあたり 125 クレジット、キャッシュ 12.5、出力 750 クレジット。
- **【重要な痛点】** GitHub Issue #15336「Codex usage dashboard appears to over-consume weekly quota and may misclassify activity as "Other"」— **バックグラウンドのトークン消費が "Other" に誤分類され、ユーザーが気づかないうちに週次枠を食い潰す**。本プロダクトの「サイレント消費の可視化」訴求の核。

### 1.3 Cursor
- 2026年は5階層: Hobby $0 / Pro $20 / Pro+ $60 / Ultra $200 / Teams $40/seat。
- 旧「fast requests」を廃止し **実トークン従量課金** へ。Pro は **$20分のクレジット**、Pro+ $70、Ultra $400。
- レート例: 入力/キャッシュ書込 $1.25、出力 $6、キャッシュ読込 $0.25（/100万トークン）。
- Auto モードはクレジットを消費しない（Pro で無制限）。
- 2026年6月、Teams プランのプール分割（Composer/Auto と Third-Party API）を導入 → **どのプールをどれだけ使ったか分かりにくい**。

### 1.4 GitHub Copilot
- **2026年6月1日、Premium Request Units を廃止し「AI Credits（1クレジット = $0.01）」のトークン従量へ移行**。
- 現行: Pro $10（$15クレジット込）/ Pro+ $39（$70込）/ Max $100（$200込）。
- エージェント型ワークロードで **請求が 10倍〜100倍に急騰**する事例が報告され、ユーザーの強い反発（backlash）。「初日で月間枠の82%が蒸発した」との報告も。
- → **「予測可能な定額」から「不透明なメーター」への退行** が、可視化ニーズを爆発的に高めている。

### 1.5 Windsurf
- 2026年3月19日、不透明な「Flow Action」クレジットを廃止し **1プロンプト=1クレジット** へ簡素化（ユーザー有利な変更）。
- Pro は日次・週次リフレッシュ。全プレミアムモデル（SWE-1.5, Claude Sonnet 4.6, GPT-5, Gemini 3.1 Pro 等）。
- Copilot とは逆方向の動き → 業界全体で「消費の予測可能性」が競争軸になっている証左。

### まとめ表

| ツール | 課金単位 | ウィンドウ | 残量の見えにくさ | 痛点の強さ |
|---|---|---|---|---|
| Claude Code | トークン（相対表現） | 5h + 週次 | 高（相対表現で実数が不明） | ★★★★★ |
| Codex | クレジット | 5h + 週次 | 非常に高（"Other" 誤計上） | ★★★★★ |
| Cursor | 実トークン$ | 月次$クレジット | 中（プール分割で複雑化） | ★★★★ |
| Copilot | AI Credits($0.01) | 月次 | 高（急騰・不透明） | ★★★★★ |
| Windsurf | 1プロンプト | 日次/週次 | 低（簡素化済み） | ★★ |

---

## 2. 既存の可視化ツール / 類似サービス

| 名称 | 形態 | 対象 | プラットフォーム | 強み | 弱み（=当社の機会） |
|---|---|---|---|---|---|
| **ccusage** (ryoppippi) | CLI / `blocks --live` | Claude Code, Codex | クロス（端末内） | ローカルJSONL解析が高速・軽量、5hブロックレポート、burn rate表示 | 端末内のみ。常駐GUIなし。ゲーム性ゼロ |
| **tokscale** (junhoyeo) | CLI + Webリーダーボード | 多数(OpenCode,CC,Codex,Gemini,Cursor…) | クロス | グローバルリーダーボード、2D/3Dコントリビューショングラフ | デスクトップ常駐HUDではない |
| **TokenTracker** (mm7894215) | macOSメニューバー+デスクトップウィジェット | 22ツール | **macOSのみ** | 4種ウィジェット、美しいダッシュボード、ローカルファースト | **Windows非対応**。ゲーミフィケーション弱い |
| **codex-trace** (PixelPaw-Labs) | セッションログビューア | Codex | デスクトップ/Web | `~/.codex/sessions` のJSONL閲覧、ライブセッション | 閲覧専用。残量HUDではない |
| **claude-usage-monitor** | Python TUI | Claude | クロス（端末） | リアルタイム端末モニタ | GUI/常駐なし |
| **SessionWatcher** | Webガイド/ツール | Codex/CC | Web | `/status` 解説 | 常駐HUDではない |
| Claude/Codex 公式 | `Settings>Usage` / `/status` | 各自 | アプリ内 | 公式・正確 | 能動的に見に行く必要、体感できない |

### 観察
- 既存ツールは **(a) CLI、(b) Webダッシュボード、(c) macOSメニューバー** のいずれか。
- **「Windows・常時最前面・半透明・ゲームUI・配信オーバーレイ・複数エージェントの同時パーティ表示」** を満たすものは **存在しない**。
- データソースは各ツール共通で **ローカルの JSONL ファイル**（後述）→ 我々も同じ堅牢な手法を採れる。

---

## 3. データソース調査（実装に直結）

可視化ツールは外部APIではなく **ローカルのセッションログ** を読む方式が主流。これが軽量・無権限・オフライン動作の鍵。

### 3.1 Claude Code
- ログ: `~/.claude/projects/**/*.jsonl`（ccusage が解析対象とする）。
- 各行に token 使用量（input/output/cache）とタイムスタンプ。これを **5時間ブロック単位** で集計すれば現在ウィンドウの消費・burn rate・回復予測が算出可能。

### 3.2 Codex
- ログ: `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`（`CODEX_HOME` で上書き可、複数ディレクトリ指定可）。
- `token_count` イベントは **2025-09-06 (commit 0269096) 以降** に出力。それ以前のログにトークン量はない。
- 一部の 2025-09 ビルドは `turn_context` 欠落で **モデル判定不能** → "Other" 誤計上問題に直結。
- アーカイブは `~/.codex/archived_sessions/YYYY/MM/DD/`。

### 3.3 Cursor / Copilot
- ローカルログの一貫した公開フォーマットは Claude/Codex ほど安定していない。**MVP では Claude Code と Codex を一級対応**、Cursor/Copilot は将来の手動入力 or API 連携（ロードマップ）。

### 3.4 Rainmeter からの読み取り手段
- **WebParser measure**（プラグインではなくビルトイン measure）が `file://` ローカルJSON を RegExp で抽出可能。`(?siU)` 修飾子で1行・大小無視・非貪欲マッチ。
- 代替: `e2e8/rainmeter-jsonparser` プラグイン（厳密JSONパース）。
- **採用方針**: 我々が JSON を生成する側なので **キー順を固定したフラットJSON** を出力 → WebParser の RegExp で堅牢に抽出（追加プラグイン不要＝軽量・配布容易）。

---

## 4. 市場規模・需要シグナル

- AI コーディングツールの有料ユーザーは数百万規模に拡大、かつ **全社が従量課金へ移行**したことで「残量不安」は構造的・恒常的な痛点になった。
- Copilot 課金改定（2026/6）への大規模 backlash、Codex 週次枠ドレイン記事の多発が **検索・SNS の需要シグナル**。
- ccusage/tokscale 等が GitHub で支持を集めている＝**"使用量を見たい"市場が顕在化済み**。我々は同じ需要を **より体感的・常駐・Windows** で取りに行く。

### ターゲット層（想定ユーザー）
1. Claude Code ヘビーユーザー（月20〜200ドル課金、効率重視）
2. Cursor ユーザー / Vibe Coder（ゲームUI親和性高）
3. AIエージェント多用層（複数ツール併用 → パーティ表示の価値最大）
4. 個人開発者 / スタートアップ創業者（コスト管理意識）
5. 配信者 / VTuber（OBSオーバーレイ、視聴者との残量共有）

---

## 5. 競合空白（ホワイトスペース）の結論

| 要件 | ccusage | tokscale | TokenTracker | **AI Energy HUD** |
|---|---|---|---|---|
| Windows 常駐 | △(端末) | △ | ✕(mac) | ✅ |
| 常時最前面・半透明 | ✕ | ✕ | △ | ✅ |
| ゲーミフィケーション(HP/MP) | ✕ | △(草グラフ) | ✕ | ✅ |
| 配信オーバーレイ(OBS) | ✕ | ✕ | ✕ | ✅ |
| 複数エージェントのパーティHP | ✕ | △ | △(列挙) | ✅(パーティ表示) |
| 軽量・無権限・ローカル | ✅ | ✅ | ✅ | ✅ |

**結論:** 「Windows × ゲームUI × 配信 × マルチエージェント パーティHP」は明確な空白。データソース手法（ローカルJSONL）は既存ツールと同じで技術的に再現可能。**MVP（Rainmeter HUD）でこの空白を最速で取る。**

---

## Sources
- [How do usage and length limits work? — Claude Help Center](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
- [Models, usage, and limits in Claude Code — Claude Help Center](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)
- [Claude Code Rate Limits & Usage Quotas Explained (2026) — TrueFoundry](https://www.truefoundry.com/blog/claude-code-limits-explained)
- [ccusage — GitHub (ryoppippi)](https://github.com/ryoppippi/ccusage)
- [ccusage — Codex guide](https://ccusage.com/guide/codex/)
- [TokenTracker — GitHub (mm7894215)](https://github.com/mm7894215/TokenTracker)
- [tokscale — GitHub (junhoyeo)](https://github.com/junhoyeo/tokscale)
- [codex-trace — GitHub (PixelPaw-Labs)](https://github.com/PixelPaw-Labs/codex-trace)
- [Codex usage dashboard over-consumes weekly quota / misclassifies as "Other" — Issue #15336](https://github.com/openai/codex/issues/15336)
- [Understanding the New Codex Limit System — OpenAI Developer Community](https://community.openai.com/t/understanding-the-new-codex-limit-system-after-the-april-9-update/1378768)
- [Codex CLI Config Location ~/.codex — Inventive HQ](https://inventivehq.com/knowledge-base/openai/where-configuration-files-are-stored)
- [Cursor Pricing Explained 2026 — Vantage](https://www.vantage.sh/blog/cursor-pricing-explained)
- [Cursor Usage and limits — Cursor Docs](https://cursor.com/help/models-and-usage/usage-limits)
- [GitHub Copilot is moving to usage-based billing — GitHub Blog](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
- [GitHub Copilot Pricing Change Drives Backlash — TechTimes](https://www.techtimes.com/articles/317536/20260601/github-copilot-pricing-change-drives-backlash-agentic-bills-jump-10x-50x-power-users.htm)
- [Windsurf Pricing 2026 — Verdent Guides](https://www.verdent.ai/guides/windsurf-pricing-2026)
- [WebParser Tutorial — Rainmeter Documentation](https://docs.rainmeter.net/tips/webparser-tutorial/)
- [rainmeter-jsonparser — GitHub (e2e8)](https://github.com/e2e8/rainmeter-jsonparser)
