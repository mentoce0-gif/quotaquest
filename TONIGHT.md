# TONIGHT.md — 今晩の作業ランブック（順番に上から）

> 自宅Windows PCで、この `release/` フォルダを開いて上から実行。所要 約30〜45分。
> 迷ったら各行の参照ドキュメントへ。コマンドはコピペでOK。

## 0. 事前チェック（5分）
```powershell
powershell -ExecutionPolicy Bypass -File scripts\preflight.ps1 -Repo quotaquest
```
- [ ] Node / git / gh / Rainmeter の有無を確認
- [ ] 足りないものを導入：Node→nodejs.org / git→git-scm.com / gh→cli.github.com / Rainmeter→rainmeter.net
- [ ] `gh auth login` を一度実行（ブラウザ認証）

## 1. ローカル動作＋HUD描画（10〜15分）  → 詳細 `docs/RENDER_TEST.md`
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Plan max20x
scripts\start-monitor-demo.bat        REM まずデモデータで表示確認
```
- [ ] Rainmeter → Refresh All → `QuotaQuestHUD\QuotaQuestHUD.ini` を Load
- [ ] HP/MP/EXP バー・Recovery・Burn・ステータス色が出る
- [ ] 実データ版に切替：`scripts\start-monitor.bat`
- [ ] **実機スクショを撮る**（Win+Shift+S）→ `assets\` に保存（READMEの生成画像と差し替え可）

## 2. 公開＝先使用の証拠を確保（5分）  → 詳細 `PUBLISH.md`
```powershell
powershell -ExecutionPolicy Bypass -File scripts\publish-github.ps1 -Repo quotaquest
```
自動で：git init+コミット / リポジトリ作成+push / Description+Topics / Pages有効化 / Release v0.1.0+zip添付
- [ ] `https://github.com/ mentoce0-gif/quotaquest` が表示される
- [ ] Social preview に `assets\gallery.png` をアップ（Settings → Social preview）
- [ ] Pages が有効か確認（`https:// mentoce0-gif.github.io/quotaquest/landing-page.html`）

## 3. ブランド資産の確保（任意・10分）  → `docs/BRAND_ASSETS.md`
- [ ] ドメイン（quotaquest.com など）空き確認・取得
- [ ] SNSハンドル（X / Reddit 等）確保
- [ ] これらも「先使用」の傍証になる

## 4. JPO出願の準備（後日でも可）  → `docs/TRADEMARK_JP.md`
- [ ] J-PlatPat で QuotaQuest を正式検索（簡易調査の裏取り）
- [ ] 第9類（最小）or 第9＋42類（標準）を決定
- [ ] 自力電子出願 or 弁理士 or オンラインサービスを選択

## 5. ローンチ（公開を数日先行させてから）  → `marketing/`
- [ ] Show HN（`marketing/hacker-news.md`）
- [ ] Reddit r/ClaudeAI・r/Rainmeter・r/SideProject（`marketing/reddit-posts.md`）
- [ ] X スレッド（`marketing/x-posts.md`、#1をピン留め）
- [ ] Product Hunt（`marketing/product-hunt.md`、12:01 PT 予約）
- [ ] Gumroad 商品作成：Pro $12 / Multi-Tool $24 / Team $99（`docs/MONETIZATION.md`）

---
### つまずいたら
- スキンが空欄 → `monitor\monitor.log` を確認、monitorが起動中か／`config.json` の statePath を確認
- 数値が変 → `monitor\config.json` の `plans.*` トークン上限を自分のプランに合わせて調整
- gh 関連エラー → `gh auth status` を確認、`-Repo` で名前変更
