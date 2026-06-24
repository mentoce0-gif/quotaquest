# X (Twitter) — 投稿台本 ＠151Me

> 投稿アカウントは **@151Me 一本**。VTuber/クリエイターである151Me自身が「自作ツールをローンチする」という切り口。
> 既存フォロワー（日本語）への訴求と、HN/Reddit/PH経由の海外開発者への訴求を両立させるため **日本語スレッド + 英語ツイート** の二段構え。
> ⭐ = ローンチ当日の本命（HN/Reddit/PHからこのツイートにリンクを集める）。`[GIF]`/`[IMG]` はHUDのデモ動画・画像。
> リンクは Public 化後の `https://github.com/151Me/ai-energy-hud`（ユーザー名は要確認）。

---

## A. ローンチ・スレッド（日本語・@151Me の声）

**1/ ⭐ 起点ツイート**
AIに課金してると「あと何回叩けるんだ…？」って毎回不安になりませんか？

その不安、**RPGのHPバー**にしました。

Claude Code / Codex の残量をデスクトップに常駐表示する自作HUD「AI Energy HUD」を作ったので公開します🟢
無料・オープンソース。
[GIF: HPバーが緑→黄→赤に減っていく]

**2/**
HP = AIの残量
MP = セッション残り時間
回復タイマー・消費速度・今日の使用量まで一目で分かる。

赤くなったら「もう休め」のサイン。`/status` を毎回叩かなくていい。

**3/ 🛡️ 推しポイント：パーティ表示**
Claude も Codex も**RPGのパーティみたいに並べて表示**できます。

Codexが裏で勝手にトークンを食う問題（"Other"誤計上）に気づけるのが地味に最強。誰が黙ってMP吸ってるか一目で分かる。

**4/ 配信者として作ったので**
そのまま**OBSにオーバーレイ**できるコンパクト版も同梱しました。
視聴者と一緒に残量をハラハラ見守れる…配信のネタにもなる🎮
[IMG: OBSオーバーレイ]

**5/ 安心ポイント**
APIキー不要・ネット送信なし・テレメトリなし。
ローカルのログを読むだけ。`.rmskin` をダブルクリックで入ります（Windows + Rainmeter）。

**6/ ⭐ 締め**
無料 / MIT / Windows。テーマ6種・真円ゲージ・低残量通知つき。

⭐ GitHub → https://github.com/151Me/ai-energy-hud

「自分のトークンにもHPバーを」って人、よかったらスター＆RTお願いします🙏

---

## B. 単発ツイート（日本語・スレッド以外で使い回し）

**B1（ミーム）**
わたし「あと1回だけエージェント回す」
HPバー「🟥🟥🟥🟥🟥 14%」
わたし「…あと1回だけ」
HPバー「STATUS: CRITICAL」

自作HUDが私の生態を理解しすぎている。

**B2（共感）**
2026年のAIツール課金、不透明すぎ問題。
Copilotは請求10倍、Codexは気づかぬ消費、Claudeは"相対表現"で残量読めない。

課金は直せないけど、**残量を見えるようにする**ことはできる。作った。⚡

**B3（配信者仲間へ）**
配信者の方、AIの残量バーをOBSに置けます。
視聴者と一緒に「うわ赤くなってきた」って盛り上がれるやつ。無料です🎮

---

## C. 英語ツイート（海外開発者・HN/Reddit/PH流入向け）

**C1 ⭐ (English launch)**
I'm a VTuber who codes with Claude all day — so I turned my AI budget into an MMORPG HP bar. 🟢

HP = Claude Code left. MP = session window. Goes red → time to stop.

Windows desktop HUD, reads local logs only, free & open-source. ⚡ AI Energy HUD
[GIF]

**C2 (the Codex hook)**
Codex was silently eating my weekly quota and labeling it "Other."

So the HUD shows Claude + Codex as a *party* — you instantly see which agent is draining you. 🛡️
⭐ https://github.com/151Me/ai-energy-hud

**C3 (streamer angle)**
Bonus: a compact overlay you can drop straight onto OBS, so your chat panics with you as the bar drains. 😅 Free.
[IMG]

**C4 (privacy / close)**
No API keys. No network. No telemetry. Reads the same local logs as ccusage, computes everything on your machine.

Free, MIT, Windows. ⭐ if your tokens deserve a health bar →
https://github.com/151Me/ai-energy-hud

---

## 運用メモ
- 起点(1/ または C1)を **HN / Reddit / Product Hunt の投稿からリンクするツイート**にする（＝拡散の母艦）。
- 日本語スレッド→数時間後に英語C1を別投下、で同じフォロワーに二度当てつつ時差で海外帯も拾う。
- 画像/GIFは `assets/hud_cyberpunk.png`・`hud_compact.png`・低残量の `hud_critical.png` を使用。動画があればHPが赤に変わる瞬間を5秒で。
- 固定ツイートは「1/」または「C1」に。プロフィールに GitHub リンクを一時的に追加。
