# v0.6.0 — QuotaQuest: multi-AI party HUD, theme system & storefront copy

**Turn your AI quota into an MMORPG status bar.** An always-on-top, half-transparent
desktop HUD that shows your Claude Code usage as HP / MP / EXP, with a recovery timer,
burn rate, and NORMAL / WARNING / CRITICAL status. 100% local. MIT core.

This is the first tagged release since the v0.1.0 MVP and rolls up everything shipped
in `[0.2.0]` through `[0.6.0]` of `CHANGELOG.md`:

## Highlights
- **Multi-AI party HUD** — connect more than one AI tool; each gets its own HP/MP/EXP,
  Regen and FullRecover, plus a token-weighted party aggregate (worst member drives status).
- **Theme system** — one-line `@includeTheme` skin swap; bundled Default/Minimal/Cyberpunk/
  Mascot/Terminal, plus a no-code **Theme Maker** (`tools/theme-maker/`) that exports
  Rainmeter `.inc`, JSON, or a shareable theme code (web renderer reads `?theme=`).
- **5 sellable theme packs** (20 themes total) under `packs/`: Neon Arcade, Fantasy Guild,
  Minimal Pro, Streamer Kit, Seasonal Vol.1 — each a ready-to-upload zip.
- **Desktop notifications**, a **standalone .exe build** (Node SEA), and a **.rmskin**
  installer manifest, merged in from the earlier "AI Energy HUD" build
  (preserved for reference under `legacy-aienergyhud/`).
- **Web renderer** (`renderers/web/`) — transparent-background OBS-ready overlay.
- **UI readability pass** — bars show remaining unambiguously; status labels no longer clip.
- **Rebrand to QuotaQuest** with legal/IP docs (`docs/RISK_AND_IP.md`, `NOTICE`,
  `THIRD-PARTY.md`) and standardized disclaimers.
- **Gumroad storefront copy** (`docs/GUMROAD_LISTINGS.md`) for Free / Pro $12 /
  Multi-Tool $24 / Team $99 + à-la-carte packs + All-Access Pass $15.

## Install (Windows)
```powershell
git clone https://github.com/mentoce0-gif/quotaquest.git
cd quotaquest
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
