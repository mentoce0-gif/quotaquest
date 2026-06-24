# Hacker News — Show HN

> HN rewards substance, honesty, and technical detail. No marketing fluff. No emoji in title.
> Be ready to discuss the log-parsing and the caveat that Anthropic's exact caps aren't public.

---

**Title:**
Show HN: QuotaQuest – your AI usage as an MMORPG HP/MP bar

**URL:** https://github.com/mentoce0-gif/quotaquest

---

**Text (first comment):**

Claude Code enforces two limits simultaneously — a 5-hour rolling window and a weekly cap — and surfaces neither while you're working, so heavy users hit the wall mid-task.

There are good monitors already (ccusage is excellent and I build on the same idea), but they're all dashboard-style. I wanted something ambient and, honestly, fun — so I rendered the quota as a game HUD.

How it works:

- A small Node monitor reads the JSONL transcripts Claude Code writes under ~/.claude/projects/. Each assistant message carries a usage block (input/output/cache tokens), so it aggregates tokens over the 5-hour and 7-day windows.
- It computes burn rate, a recovery ETA (5h after the earliest event still inside the current window), and a NORMAL/WARNING/CRITICAL status, then writes a tiny state.json atomically (temp file + rename).
- A Rainmeter skin reads that one file via WebParser and draws the HP/MP/EXP bars. The two halves only ever talk through state.json, so either can be swapped — e.g. a future Electron UI, or adapters for Cursor/Copilot/Windsurf.

Honest caveats:

- Anthropic doesn't publish exact token caps, so the plan caps in config.json are sensible defaults you calibrate to your own plan. The bars are directional, not billing-accurate.
- Windows-only right now because of the Rainmeter dependency. The data layer is plain Node and platform-agnostic; a cross-platform renderer is the obvious next step.
- It falls back through three data sources: ccusage if present, direct JSONL parse otherwise, and a synthetic demo mode for screenshots/offline.

The core is MIT. I'm curious what this crowd thinks about (a) the reliability of inferring caps from local logs vs. an official API, and (b) whether the "recovery timer" heuristic matches your real reset behavior. Code's linked above — feedback welcome.
