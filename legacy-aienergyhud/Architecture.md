# Architecture.md — AI Energy HUD

> Phase 3 / MVP 設計
> 最終更新: 2026-06-23

---

## 1. 設計原則

1. **MVP 最優先** — まず Windows で動く HP/MP HUD。過剰設計禁止。
2. **疎結合の2層** — 「データ層（Node.js monitor）」と「表示層（Rainmeter skin）」を **1枚の JSON ファイル**で接続。互いを知らない。
3. **無権限・ローカル・オフライン** — 外部 API キー不要。ローカル JSONL を読むだけ。プライバシー安全。
4. **壊れにくさ** — ツール仕様変更はパーサ層で吸収。データ取得失敗時は `--mock` / 最終値保持でフォールバック。
5. **軽量** — Node 常駐は数秒間隔ポーリング、CPU/メモリ最小。Rainmeter はネイティブで軽い。

---

## 2. システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│  ローカル AI ツールのログ (読み取り専用)                       │
│   ~/.claude/projects/**/*.jsonl     (Claude Code)            │
│   ~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl  (Codex)      │
└───────────────┬─────────────────────────────────────────────┘
                │  read (fs, 軽量ポーリング 5s)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Node.js Monitor  (monitor/index.js)                         │
│   ├ parsers.js   : JSONL → 5時間ブロック集計 / トークン合算   │
│   ├ compute.js   : HP%, MP%, regen, burn, recovery, status  │
│   └ state.js     : 原子的書き込み (tmp→rename)               │
└───────────────┬─────────────────────────────────────────────┘
                │  write (atomic)
                ▼
        @Resources/state.json   ◀── 単一の契約 (Single Source of Truth)
                │
                │  WebParser measure (file://, RegExp, 1s update)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Rainmeter Skin  (AIEnergyHUD.ini)                           │
│   ├ Meters : HPバー / MPバー / Recovery / Burn / Status      │
│   ├ Party  : claude + codex の HP を横並び表示               │
│   └ 常時最前面・半透明・ドラッグ移動                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. データ契約: `state.json`（最重要・両層の唯一の接点）

WebParser の RegExp 抽出を堅牢にするため **フラット & キー順固定** とする。

```json
{
  "schema": 1,
  "updated": "2026-06-23T10:00:00Z",
  "status": "NORMAL",
  "model": "Claude Sonnet 4.6",
  "primary_agent": "claude",
  "hp_percent": 87,
  "hp_current": 425362,
  "hp_max": 500000,
  "mp_percent": 63,
  "mp_minutes": 186,
  "mp_max_minutes": 300,
  "regen_per_min": 2140,
  "burn_per_hour": 12400,
  "recovery": "01:52:18",
  "exp_today": 1820000,
  "exp_week": 8730000,
  "exp_month": 32410000,
  "claude_hp_percent": 87,
  "claude_status": "NORMAL",
  "codex_hp_percent": 54,
  "codex_status": "WARNING"
}
```

### フィールド定義
| key | 意味 | 算出 |
|---|---|---|
| `status` | 総合ステータス | HP% に応じ NORMAL(>40) / WARNING(15–40) / CRITICAL(<15) |
| `hp_percent` | Claude Code 残量% | `(hp_max - 現5hブロック消費) / hp_max` |
| `hp_current/max` | 残トークン / 上限 | プラン別上限（設定）− 消費 |
| `mp_percent` | セッション(5h窓)残量% | 経過時間ベース。`(max−経過)/max` |
| `regen_per_min` | トークン回復/分 | 上限 / 窓長(300分) |
| `burn_per_hour` | 消費速度 | 直近窓の消費 ÷ 経過時間 |
| `recovery` | 次回満タン予測 | 残不足分 ÷ regen を hh:mm:ss |
| `exp_*` | 当日/週/月 累計消費 | 各期間のトークン総和 |
| `*_hp_percent/status` | パーティ各員 | エージェント別に同計算 |

---

## 4. HP/MP/ステータスの算出ロジック（compute）

```
window = 5h = 300 min
used    = Σ tokens (現在の5hブロック内)
hp_max  = plan上限 (Pro=44000 … 設定で上書き可。表示はトークン or %)
hp_pct  = clamp(100 * (hp_max - used) / hp_max, 0, 100)

elapsed_min = now - block_start
mp_pct      = clamp(100 * (window - elapsed_min) / window, 0, 100)

regen_per_min = hp_max / window
burn_per_hour = used / max(elapsed_min,1) * 60
deficit       = hp_max - (hp_max - used)        # = used
recovery_min  = deficit / regen_per_min
status        = hp_pct>40 ? NORMAL : hp_pct>=15 ? WARNING : CRITICAL
```

> 注: プラン上限値は Anthropic が「相対表現」へ移行しているため固定値は概算。MVP は **設定ファイルで上限を上書き可能**にし、ユーザーが自分の体感に合わせてキャリブレーションできる方式を採る（実用上これが最も破綻しない）。

---

## 5. パーティ HP（マルチエージェント）

- monitor が `agents: ["claude","codex"]` をループし、各々のログ源を集計。
- `primary_agent`（既定 claude）をメインの大ゲージに、全員を下段パーティ行に表示。
- Codex のトークンが `turn_context` 欠落で不明な場合は `codex_status: "UNKNOWN"`（"?" 表示）として **誤った安心を与えない**。これがサイレント消費可視化の肝。

---

## 6. 信頼性・フォールバック

| 事象 | 挙動 |
|---|---|
| ログ未検出 | `--mock` 値 or 直近 state.json を保持し `status` に `NO DATA` |
| パース例外 | 当該行スキップ、ログ出力、HUD は最後の正常値を維持 |
| 書き込み競合 | tmp ファイルへ書き `fs.rename` で原子的差し替え（破損JSON防止） |
| ツール仕様変更 | `src/parsers.js` のみ修正で吸収（表示層は無変更） |

---

## 7. 技術選定の根拠

- **Rainmeter**: Windows ネイティブ・軽量・常時最前面/半透明/ドラッグが標準。配布が容易（.rmskin）。配信オーバーレイ実績多数。
- **Node.js**: JSONL ストリーム処理が簡潔、クロスインストール容易、`pkg` 等で単一exe化も将来可能。
- **JSON ファイル連携**: 両層を完全分離。Rainmeter/Node どちらも単体テスト可能。WebSocket等は MVP には過剰。

---

## 8. 非機能要件（MVP）

- 更新間隔: monitor 5s / Rainmeter 1s（設定可）。
- フットプリント: アイドル CPU < 1%、メモリ < 50MB 目標。
- 権限: 管理者不要。読み取りのみ。ネットワーク送信なし（テレメトリ無し）。
