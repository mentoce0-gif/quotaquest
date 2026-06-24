# FOLDER_STRUCTURE.md — AI Energy HUD

> Phase 3 / フォルダ構成
> 最終更新: 2026-06-23

GitHub にそのまま配置可能な構成。`/release` がリポジトリルートを想定。

```
release/
├── README.md                  # GitHub トップ (Phase 5)
├── MARKET_RESEARCH.md          # 市場調査 (Phase 1)
├── POSITIONING.md              # 差別化 (Phase 2)
├── Architecture.md             # 設計 (Phase 3)
├── MONETIZATION.md             # 収益化案 (Phase 8)
├── landing-page.html           # LP (Phase 6)
├── LICENSE                     # MIT
│
├── docs/
│   ├── UI_WIREFRAME.md         # UI ワイヤーフレーム
│   └── FOLDER_STRUCTURE.md     # 本書
│
├── monitor/                    # データ層 (Node.js)
│   ├── package.json            # scripts: start/once/mock/bundle/sea
│   ├── index.js                # エントリ: ポーリング & 書き込み
│   ├── config.example.json     # 設定テンプレ (plan上限/間隔/agents/notify)
│   ├── sea-config.json         # 単一exeビルド設定 (Node SEA)
│   └── src/
│       ├── parsers.js          # JSONL → トークン集計 (claude/codex)
│       ├── compute.js          # HP/MP/regen/burn/recovery/status
│       ├── state.js            # 原子的 state.json 書き込み
│       └── notify.js           # WARNING/CRITICAL デスクトップ通知 (edge-trigger)
│
├── skin/                       # 表示層 (Rainmeter)
│   ├── RMSKIN.ini              # .rmskin パッケージ定義
│   └── AIEnergyHUD/
│       ├── AIEnergyHUD.ini      # メインスキン定義 + テーマ切替メニュー
│       ├── Compact.ini          # OBSオーバーレイ向けコンパクト版 (同じstate.jsonを参照)
│       ├── Radial.ini           # 真円ゲージ版 (Roundline)
│       └── @Resources/
│           ├── state.json       # monitor が更新 / 同梱はサンプル
│           ├── variables.inc    # レイアウト + 選択中テーマ
│           └── Themes/          # 6テーマ (Cyberpunk/Fantasy/Minimal/Terminal/Mascot/Radial)
│
├── dist/
│   └── AIEnergyHUD_1.0.0.rmskin # ワンクリックインストール用パッケージ
│
├── assets/                     # プレビュー画像 (README/LP/ストア用)
│   ├── hud_cyberpunk.png       # 実機Rainmeterスクショ (メイン)
│   ├── hud_critical.png
│   ├── themes_grid.png
│   ├── hud_compact.png         # コンパクト版 (OBS) プレビュー
│   ├── hud_radial.png          # 真円ゲージ版プレビュー
│   ├── render_previews.py      # 画像再生成スクリプト (PIL)
│   ├── render_compact.py       # コンパクト版プレビュー生成
│   └── render_radial.py        # 真円ゲージ版プレビュー生成
│
├── install/
│   ├── install.ps1             # 依存チェック→monitor常駐→skin配置
│   ├── install.bat             # ダブルクリック起動ラッパ
│   └── build-exe.ps1           # 単一exeビルド (Node SEA, Windows)
│
└── marketing/                  # Phase 7
    ├── X_posts.md
    ├── reddit_posts.md
    ├── product_hunt.md
    └── hacker_news.md
```

## データフローと所有権
- `monitor/` が **唯一** `@Resources/state.json` に書き込む。
- `skin/` は state.json を **読むだけ**。
- 両者は state.json のスキーマ（Architecture.md §3）でのみ結合。

## 配布物
- **`.rmskin`**: skin/ を Rainmeter 形式にパッケージ（GUIインストール）。
- **monitor**: `npm i && node index.js` もしくは将来 `pkg` で単一exe化。
- **install.bat**: 上記2つを繋ぐワンクリック導入。
```
