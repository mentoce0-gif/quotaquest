# NAMING.md — ブランド名の選定（造語名・識別力評価）

> 目的：他者商標（特に Anthropic「Claude」）に抵触せず、JPOで登録の通りやすい独自名を選ぶ。
> 評価軸：①識別力（造語＞暗示＞記述）②先行衝突の有無（簡易調査）③ブランド適性 ④ドメイン/SNS取得性。
> ※簡易調査はWeb検索ベース。**正式な可否はJ-PlatPat全文調査＋弁理士確認が必須。**

## 候補と評価

| 候補 | 由来 | 識別力 | 簡易衝突調査 | 総合 |
|------|------|--------|--------------|------|
| **QuotaQuest** ★採用 | Quota（残量）+ Quest（冒険） | 高（頭韻・暗示的） | 検索でソフト商標の明確な衝突なし | ◎ |
| ManaMeter | Mana（MP/RPG）+ Meter | 中（"meter"がやや記述的、Rainmeterと語感近接） | 一般語の組合せで弱い | ○ |
| QuotaCraft | Quota + Craft | 中〜高 | 未確認（"-craft"は混雑領域） | ○ |
| Energaia | Energy + Gaia | 高（完全造語） | **米国商標既存＋同名企業あり→除外** | ✕ |
| Manawell | Mana + Well（回復） | 高 | **同名SaaS（manawell.io）/企業あり→除外** | ✕ |

## 採用：QuotaQuest（クォータクエスト）
- **意味が明快**：「AIのQuota（残量）をQuest（冒険＝RPG）化」＝製品コンセプトそのもの。
- **識別力**：頭韻＋暗示的で、記述的すぎず造語性あり → 登録適性が比較的高い。
- **衝突**：簡易調査でソフトウェア分野の明確な先行商標は確認されず（要・正式調査）。
- **拡張性**：将来マルチツール対応でも「Claude」非依存なので名称をそのまま使える。

## 表記ルール（全成果物で統一）
- 製品名（=商標）：**QuotaQuest**
- 説明（記述的・nominative use）：**“usage HUD for Claude Code”** /「Claude Code 対応」
- 必須ディスクレーマー：**“Not affiliated with Anthropic. Claude and Claude Code are
  trademarks of Anthropic, PBC. Rainmeter is a trademark of its respective owner.”**
- リポジトリ：`quotaquest` / スキン：`QuotaQuestHUD` / npm：`quotaquest-monitor`

## 名称を変えたくなったら
全ファイルは機械置換済みなので、`QuotaQuest`→新名、`QuotaQuestHUD`→新スキン名で再置換すれば
差し替え可能（スキンのフォルダ/ini名のリネームも忘れずに）。出願前なら変更コストは小さい。
