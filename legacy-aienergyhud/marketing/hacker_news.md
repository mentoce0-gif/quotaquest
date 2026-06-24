# Hacker News — Show HN

HN は誇張・絵文字・マーケ臭を嫌う。技術的正直さ・実装の中身・トレードオフを率直に語る。

---

## Title
Show HN: AI Energy HUD – Claude Code/Codex usage as an HP/MP desktop overlay

*(代替: "Show HN: A Rainmeter HUD that turns AI coding usage into RPG health bars")*

---

## Text (body)

I use Claude Code and Codex daily, and both moved to limits that are hard to read in the moment — Claude describes them in "relative" terms, and Codex has an open issue (#15336) where background tokens get bucketed as "Other" and quietly eat your weekly cap. I was tired of running `/status` and `ccusage` in another terminal, so I built a desktop overlay that keeps the numbers in my peripheral vision.

It's two decoupled pieces connected by one file:

- A ~150-line, zero-dependency Node monitor reads the local JSONL logs (`~/.claude/projects`, `~/.codex/sessions/.../rollout-*.jsonl`), aggregates tokens into the current 5-hour window, computes HP%/MP%/regen/burn/recovery/status, and writes `state.json` atomically (tmp + rename).
- A Rainmeter skin reads that JSON with a single WebParser measure (fixed-order flat keys → a robust RegExp, no JSON plugin) and renders HP/MP bars that change color via IfConditions, plus a "party" row showing Claude and Codex together.

A few deliberate trade-offs:

- **Calibration over precision.** Since vendor limits are relative, I don't pretend to know your exact cap — you set what a full HP bar means (`hpMaxTokens`). It's tunable so a wording change upstream doesn't break it.
- **Local-only.** It only reads files already on disk (same source as ccusage). No API keys, no network, no telemetry.
- **Schema isolation.** All vendor-format quirks live in one `parsers.js`; the display layer never changes.
- **Honest unknowns.** When Codex emits token events without `turn_context` (model unknown), the party shows `?? UNKNOWN` instead of a false-safe full bar.

It's Windows-only right now because Rainmeter made the always-on-top/semi-transparent/draggable overlay basically free. A cross-platform companion is the obvious next step.

MIT, repo link below. I'd genuinely appreciate scrutiny on the window/burn math and the WebParser approach — and I'm curious whether others have found a cleaner way to read these logs that survives the frequent format churn.

---

## Anticipated comments & honest replies

- **"Why Rainmeter and not Electron?"** Rainmeter gives always-on-top, click-through-ish transparency, and dragging for free, with a tiny footprint. Electron would be ~100MB RAM for a health bar. The cost is Windows-only, which I accepted for the MVP.

- **"ccusage already does this."** Yes, ccusage is the better *engine* and I read the same logs. This is the always-on, glanceable HUD layer. They compose; I don't think it replaces ccusage.

- **"Parsing private logs feels iffy."** It's read-only, never leaves the machine, and you can audit `parsers.js` (it's small). Same files ccusage and TokenTracker read.

- **"The limits aren't real tokens."** Correct — that's why it's calibratable rather than authoritative. It's a fuel gauge, not an invoice.
