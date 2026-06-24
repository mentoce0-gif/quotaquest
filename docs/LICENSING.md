# LICENSING.md — ライセンス衛生（なぜMITのままで安全か）

> 結論：QuotaQuest の自作コードは **MIT** で問題なし。Rainmeter(GPLv2)に「汚染」されない設計。

## 1. なぜGPLが伝染しないか
GPLv2は「**派生物（derivative work）**」や「GPLコードと**リンク**した成果物」に伝染する。QuotaQuestは：
- **スキン（`.ini`）はRainmeterのソースを改変・リンクしない**設定ファイル。Rainmeter公式も
  「スキンは作者のIP、自由にライセンスしてよい」と明言 → 派生物にならない。
- **Node監視プロセスは完全に独立**。Rainmeterのバイナリと一切リンクしない（別プロセス・
  ファイル`state.json`経由の疎結合）。
→ よって自作コードはMITを維持できる。

## 2. 守るべき1点：Rainmeter本体を同梱しない
GPLv2の配布義務（ソース提供等）は**Rainmeter本体を再配布したときに発生**する。本プロジェクトは
インストーラで**自作スキンのみコピー**し、Rainmeterは**ユーザーが公式から別途インストール**する
設計。これを変えない限りクリーン。（将来同梱するなら、その時点でGPLv2義務を満たすこと。）

## 3. ccusage（任意の依存）
`npx ccusage` を**ユーザー環境で実行**するだけで、コードを同梱・再配布しない。クレジットは
`THIRD-PARTY.md` に記載。ライセンスは利用前に各自確認。

## 4. 商標の扱い（著作権とは別物）
- 「Claude」「Claude Code」「Rainmeter」は各社の商標。**記述的（nominative）使用**に限定し、
  提携を示唆しない。`NOTICE` のディスクレーマーを全配布物に表示。
- 自社の独占名は **QuotaQuest** のみ（→ JPO出願で確保）。

## 5. チェックリスト（配布前）
- [ ] README/LP/PH/アプリ内に統一ディスクレーマー表示
- [ ] Rainmeter本体を同梱していない
- [ ] `NOTICE` と `THIRD-PARTY.md` を同梱
- [ ] 製品名に他者商標（Claude等）を使っていない（記述的"for Claude Code"はOK）
