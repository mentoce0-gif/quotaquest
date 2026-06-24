# Reddit — 3 posts

サブレディットごとにトーンを変える。Reddit はセールス臭を嫌うので「自作OSSの共有」姿勢で。

---

## Post 1 — r/ClaudeAI (or r/Anthropic)

**Title:** I built a free MMORPG-style HUD that shows your Claude Code usage as an HP bar (Windows, reads local logs only)

**Body:**

I kept hitting my Claude Code limit mid-task without realizing how close I was — the relative limits are hard to read, and I didn't want to run `/status` every five minutes.

So I built **AI Energy HUD**: a Rainmeter overlay that turns usage into a game HUD.

- **HP** = remaining budget, **MP** = your 5-hour session window
- Regen/min, Recovery ETA, Burn rate, and a NORMAL/WARNING/CRITICAL status
- It also shows **Claude + Codex side-by-side as a "party"** so you can catch one silently draining the other
- Always-on-top, semi-transparent, drag anywhere, drops onto OBS for streamers

It reads the **same local JSONL files ccusage reads** (`~/.claude/projects`), computes everything locally, and writes a small `state.json` the skin renders. No API key, no network, no telemetry.

Free and MIT-licensed. Repo + install instructions in the comments. Would love feedback on the calibration approach — since limits are "relative," I let you set what a full HP bar means for your plan.

*(Built with Rainmeter + a zero-dependency Node monitor.)*

---

## Post 2 — r/Rainmeter

**Title:** [Skin] AI Energy HUD — visualize Claude Code / Codex AI usage as HP/MP gauges

**Body:**

Sharing a skin I made for the AI-coding crowd. It reads a local `state.json` (written by a small Node monitor that parses Claude Code + Codex usage logs) via a single WebParser measure with a fixed-order RegExp, then renders:

- HP bar (dynamic green/yellow/red via IfConditions on the % measure)
- MP bar (session window)
- Regen / Recovery / Burn / Status text rows
- A "party" row with multiple agents

Design notes that might help others doing JSON-in-Rainmeter:
- I generate the JSON myself, so I keep keys **flat and in fixed order** → the WebParser RegExp stays robust (no JSON plugin needed).
- The monitor writes atomically (tmp + rename) so the skin never reads a half-written file.
- `UpdateRate=1` on the parent WebParser for ~1s refresh.

Open-source, MIT. Feedback on the meter layout / theming variables welcome — I exposed colors and sizes in `variables.inc` so it's easy to reskin.

---

## Post 3 — r/SideProject (or r/coolgithubprojects)

**Title:** I gamified AI usage anxiety — your Claude/Codex budget as an RPG health bar (open-source)

**Body:**

Every AI coding tool switched to opaque token/credit billing this year. Copilot bills jumped 10–100x for some power users; Codex quietly drains weekly quota and labels it "Other." You basically code with a low-grade "how much do I have left?" anxiety.

I tried to turn that anxiety into something fun: **AI Energy HUD**, a desktop overlay where your usage is an HP/MP bar that goes red when you're low.

- Windows (Rainmeter) + a tiny local Node monitor
- Multi-agent **party HP** (Claude + Codex) to catch silent drain
- Local-only, no keys, no telemetry
- Free core (MIT); planning paid themes + a one-click `.rmskin` + Cursor/Copilot adapters

I went full "founder mode" on it — market research, positioning, landing page, the works — but the core is genuinely useful and free. Repo in comments. Honest question for this sub: is **one-time Gumroad ($12) for themes** the right monetization, or should the whole thing just stay donation-ware? Curious what people here would actually pay for.
