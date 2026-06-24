# LAUNCH.md — 実行用ローンチ手順（朝そのまま走らせる版）

> 方針: **今夜は仕込みだけ（PART 0）→ 朝、起きてから一気に拡散（PART 2）**。
> Show HN / Reddit / Product Hunt は「投稿後の最初の数時間、本人がコメント即レスして押し上げる」一発勝負。張り付ける状態で投下すること。
> 想定リポジトリ: `https://github.com/151Me/ai-energy-hud`（GitHubユーザー名が違う場合は §補足の一括置換を先に実行）。

---

## PART 0 — 今夜やる「仕込み」（5〜10分・エンゲージ不要）

- [ ] **GitHubユーザー名の確認**。`151Me` 以外なら §補足の一括置換を実行。
- [ ] GitHubで **空のリポジトリ作成**（Public でも Private でも可。名前 `ai-energy-hud`）。
- [ ] `release/` の中身をpush:
  ```bash
  cd release
  git init && git add . && git commit -m "AI Energy HUD v1.0.0"
  git branch -M main
  git remote add origin https://github.com/151Me/ai-energy-hud.git
  git push -u origin main
  ```
- [ ] **X(@151Me)に予告だけ1本**（任意）: 「明日、自作のAI残量HUDを公開します⚡」+ `hud_cyberpunk.png`
- [ ] 寝る😴（本番は明日の自分へ）

> ※ Private のままでもOK。朝、Public化する直前にだけ公開すれば、コールド発見を避けつつ準備できる。

---

## PART 1 — 朝イチの「最終チェック」（公開前・10分）

- [ ] リポジトリを **Public** に。
- [ ] **Release を作成**: タグ `v1.0.0` → タイトル「AI Energy HUD v1.0.0」→ 本文はREADMEの要約 → **`dist/AIEnergyHUD_1.0.0.rmskin` を必ず添付**（READMEの「ダブルクリックで導入」リンク `releases/latest` がこれで機能する）。
- [ ] リポジトリの **About** に一言説明 + Topics設定: `rainmeter` `claude-code` `codex` `developer-tools` `windows` `overlay` `obs` `gamification`。
- [ ] READMEがGitHub上で正しく表示されるか確認（特に `assets/*.png` の画像）。
- [ ] スマホ/別ブラウザで `releases/latest` のDLリンクが生きているか実クリック確認。
- [ ] （任意）GitHub Sponsors を有効化、または `FUNDING.yml` を追加。

---

## PART 2 — 公開＆拡散（本番・火〜木 / 米東部 午前9〜11時＝日本の夜22〜24時 が狙い目）

順番が重要。**GitHub(母艦) → 各プラットフォーム → 全部をXの起点ツイートに集約**。

1. [ ] **Product Hunt** — `marketing/product_hunt.md` の内容で投稿（PHは PT 0:01 公開なので前夜にスケジュール推奨）。Maker初コメントも貼る。
2. [ ] **Show HN** — `marketing/hacker_news.md` のタイトル＆本文で投稿。**投稿後2〜4時間は張り付いてコメント即レス**。
3. [ ] **Reddit** — `marketing/reddit_posts.md` の3本を該当subへ（r/ClaudeAI → r/Rainmeter → r/SideProject）。一度に全部出さず30〜60分ずらす。各subのルール（自己宣伝可否）を確認。
4. [ ] **X(@151Me)** — `marketing/X_posts.md` の日本語スレッド「1/〜6/」を投下 → 数時間後に英語「C1〜」を別投下。起点ツイートを**固定**＆プロフィールにGitHubリンク。
5. [ ] HN/Reddit/PH の各投稿コメントから **GitHub と Xの起点ツイート**にリンクを集める。

### 当日の心得
- 最初の数時間が全て。**コメント返信を最優先**（質問対応・バグ報告に即反応＝上位維持）。
- 「Mac版は？」→「v1.0はWindows先行、クロスプラットフォームはロードマップ。今macならTokenTrackerが良い」（READMEのFAQ通り）。
- バグ報告が来たら素早くIssue化＋修正コミット。誠実な対応が評価される。

---

## 補足 — GitHubユーザー名/リポジトリ名を変える場合（一括置換）

`151Me/ai-energy-hud` を全ファイルで置換（sandboxのbash例。Windowsならエディタの一括置換でも可）:
```bash
cd release
grep -rl "151Me/ai-energy-hud" . | xargs sed -i 's#151Me/ai-energy-hud#YOURNAME/REPONAME#g'
```
対象: `README.md`, `landing-page.html`, `marketing/X_posts.md`, この `LAUNCH.md`。
（`x.com/151Me` のXリンクは別途、自分のハンドルに合わせて確認。）

## 公開前の最終チェックリスト（要差し替え箇所）
- [ ] GitHubリポジトリURL（上記置換）
- [ ] Xハンドル `x.com/151Me`（landing-page.html / X_posts.md）
- [ ] Gumroad/決済リンク — まだ無ければ landing-page.html の「Get Pro」「Subscribe」は当面リポジトリ向け（用意でき次第差し替え）
- [ ] `.rmskin` を Release に添付済みか
- [ ] README画像が表示されるか
