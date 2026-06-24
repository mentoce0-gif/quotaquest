# Product Hunt — launch kit

## Name
AI Energy HUD

## Tagline (60 char max)
Your Claude Code & Codex usage, as an MMORPG HP bar

## Topics
Developer Tools · Artificial Intelligence · Productivity · Open Source

## Thumbnail / Gallery
1. HUD mock (cyberpunk) draining green→yellow→red (GIF)
2. Party row: Claude + Codex side-by-side
3. OBS overlay shot (streamer use case)
4. Theme variations grid (cyberpunk / FF / minimal / terminal / mascot / radial)

---

## Description (first comment from maker)

Hey hunters 👋

Every AI coding tool moved to opaque token/credit billing this year — Claude's "relative" limits, Codex silently draining your weekly quota as "Other," Copilot bills spiking 10–100x. You end up coding with a constant *"how much do I have left?"* anxiety, and the existing trackers are CLIs, web dashboards, or macOS-only menu bar apps.

**AI Energy HUD** turns that anxiety into a game. It's a Windows desktop overlay (Rainmeter + a tiny local Node monitor) that shows:

- ❤️ **HP** = remaining budget, 🔵 **MP** = your 5-hour session window
- ↻ Regen/min · ⏳ Recovery ETA · 🔥 Burn rate · 🟢 NORMAL / 🟡 WARNING / 🔴 CRITICAL
- 🛡️ **Party HP** — Claude + Codex side-by-side like RPG party members, so you instantly spot which agent is silently draining you
- 📌 Always-on-top, semi-transparent, draggable, and OBS-overlay friendly for streamers

It reads the **same local JSONL logs ccusage reads** and computes everything on your machine. **No API keys, no network calls, no telemetry.**

The core is **free & open-source (MIT)**. Pro themes + a one-click installer + Cursor/Copilot adapters are coming.

I'd love your feedback on two things:
1. Which extra agents should join the "party" next — Cursor? Gemini? Amp?
2. Is one-time ($12) the right model for the theme pack, or freemium?

Thanks for checking it out! 🙏

---

## Maker comment — "Why I built this"
I lost a 2-hour flow state because Codex quietly burned my weekly cap and I didn't see it coming. I wanted my budget to *feel* like a health bar in a game — something my peripheral vision tracks without thinking. Turns out a lot of devs wanted the same thing.

## First-day engagement replies (pre-written)
- **"Mac version?"** → "Windows-first for v1.0 (Rainmeter). Cross-platform companion is on the roadmap — for macOS today, TokenTracker is great. Want me to ping you when the Mac build lands?"
- **"Is it accurate?"** → "It reads the same local logs as ccusage; limits are vendor-'relative' so you calibrate what a full bar means. It's tunable on purpose so it never breaks on a wording change."
- **"How is this different from ccusage?"** → "ccusage is the engine; this is the always-on game HUD on top. They pair well — run both."
