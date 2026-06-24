# v0.1.0 — QuotaQuest MVP (usage HUD for Claude Code)

**Turn your AI quota into an MMORPG status bar.** An always-on-top, half-transparent
desktop HUD that shows your Claude Code usage as HP / MP / EXP, with a recovery timer,
burn rate, and NORMAL / WARNING / CRITICAL status. 100% local. MIT core.

## Features
- **HP** = weekly budget · **MP** = 5-hour session window · **EXP** = today
- **Recovery timer** (predicts when your session window frees up)
- **Burn rate**: LOW / MODERATE / HIGH / EXTREME
- Reads logs Claude Code already writes locally (ccusage → JSONL → demo fallback)
- Rainmeter skin + zero-dependency Node monitor talking through one `state.json`

## Install (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Plan max20x
scripts\start-monitor.bat
```
See `README.md` and `docs/RENDER_TEST.md`.

## Notes
- Plan token caps are calibratable defaults (Anthropic doesn't publish exact numbers).
- Windows-only for now (Rainmeter); the data layer is platform-agnostic Node.

> QuotaQuest is an independent project. Not affiliated with, sponsored by, or endorsed by
> Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic, PBC. "Rainmeter" is a
> trademark of its respective owner. Used nominatively for compatibility.
