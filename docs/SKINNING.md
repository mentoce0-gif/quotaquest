# SKINNING.md — themes & skin swapping

> Status: **theme-swapping is implemented** (color themes you switch with one line).
> A full one-click theme switcher and a marketplace of community skins are on the roadmap.

QuotaQuest is **renderer-agnostic**: the engine writes `state.json`, the skin only draws it.
So "bringing a skin and swapping" works at two levels.

## 1. Swap the THEME (colors/look) — one line
Bundled themes live in `skin/QuotaQuestHUD/@Resources/Themes/`:
`Default.inc` · `Minimal.inc` · `Cyberpunk.inc`.

Edit `skin/QuotaQuestHUD/Variables.inc`:
```ini
@includeTheme=#@#Themes/Cyberpunk.inc   ; <- change this one line
```
Then in Rainmeter: right-click the skin → **Refresh**. Done.

### Make your own theme
Copy `Default.inc`, change the `Col*` values (RGBA), save as `Themes/MyTheme.inc`, and
point `@includeTheme` at it. Keys: `ColBG ColPanelLine ColText ColDim ColSub ColTrack
ColMP ColEXP ColRegen` (HP color is driven by status). Share it as a `.inc` — that's a skin.

## 2. Swap the LAYOUT (different skin entirely)
Because every skin just reads `state.json`, anyone can build a completely different
Rainmeter skin (or a non-Rainmeter renderer) against the same file. Bundled layouts:
- `QuotaQuestHUD.ini` — compact **aggregate** (party rollup) view.
- `QuotaQuestParty.ini` — **per-AI** bars (one row per connected model).

Load whichever you want from Rainmeter → Manage → Load. Drop a third-party `.ini` into the
skin folder and it appears in the list — that's the "bring a skin" path.

## 3. Roadmap (not yet)
- One-click theme switcher (context-menu bang `!WriteKeyValue` to flip `@includeTheme`).
- Theme gallery / community submissions (DeviantArt, r/Rainmeter, in-repo `themes/`).
- Non-Rainmeter renderers (web/OBS/Electron) reading the same `state.json` — see `docs/RENDERERS.md`.

## Why this is the platform play
Themes and skins are **just files that read the engine's `state.json`**. That means the
community can extend the *look* without touching the engine — the same way the adapter
registry lets them extend the *data sources* (`docs/ADAPTERS.md`). Engine in the middle,
open on both ends.
