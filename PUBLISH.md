# PUBLISH.md — QuotaQuest を GitHub に公開する（代行スクリプト付き）

> 目的：公開して **「先使用の証拠（公開日）」** を確保しつつ、説明文・トピック・Pages・Release まで一気に整える。
> 私（AI）は資格情報を持てないので、最後の実行だけあなたの環境で。スクリプトが全自動でやります。

## 最短ルート（推奨・ほぼ全自動）
1. **GitHub CLI を入れる** → https://cli.github.com/ → 一度だけ `gh auth login`。
2. このフォルダ（`release/`）で実行：
   - Windows: `powershell -ExecutionPolicy Bypass -File scripts\publish-github.ps1 -Repo quotaquest`
   - mac/Linux: `bash scripts/publish-github.sh quotaquest`
3. 終わると以下が完了します：
   - リポジトリ作成 + push（**初回コミット＝公開日の記録**）
   - Description / Topics 設定
   - GitHub Pages 有効化 → `https:// mentoce0-gif.github.io/quotaquest/landing-page.html`
   - Release **v0.1.0** 作成 + dist zip 添付

## gh CLI を使わない手動ルート
1. GitHub で空のリポジトリ `quotaquest` を作成（READMEは追加しない）。
2. このフォルダで：
   ```bash
   git init && git add -A
   git commit -m "v0.1.0 — QuotaQuest MVP"
   git branch -M main
   git remote add origin https://github.com/ mentoce0-gif/quotaquest.git
   git push -u origin main
   ```
3. リポジトリの **About**（右上の歯車）→ Description と Topics を `GITHUB_METADATA.md` から貼付。
4. **Settings → Pages** → Source: `main` / `/ (root)` → Save（landing-page を配信）。
5. **Releases → Draft a new release** → タグ `v0.1.0` → `CHANGELOG.md` の内容を貼付 → `quotaquest-v0.1.0.zip` を添付 → Publish。
6. **Settings → Social preview** に `assets/gallery.png` をアップロード。

## 「先使用の証拠」を強くするコツ
- **公開コミット＋Release のタグ日時**が、第三者に対する「この日には使っていた」記録になります。
- 余裕があれば、ローンチ時の **Product Hunt / Show HN / Reddit 投稿のURLと日付**も保存（`marketing/` の各文面）。これらも公開使用の傍証になります。
- リポジトリは **public** が証拠として最も強い（private だと第三者証拠になりにくい）。

## 公開後すぐの確認
- [ ] README の画像（`assets/gallery.png` 等）が表示される
- [ ] `NOTICE` / `THIRD-PARTY.md` / ディスクレーマーが見える
- [ ] Pages の landing-page が開く
- [ ] Release に zip が添付されている
- [ ] （任意）`docs/RENDER_TEST.md` で実機スキン描画 → 実スクショに差し替え

## 次の一手
公開＝先使用の証拠が確保できたら、`docs/TRADEMARK_JP.md` の手順で **JPO 出願**へ。
公開とローンチ（`marketing/`）は同日でも、公開を**数日先行**させると証拠が安定します。
