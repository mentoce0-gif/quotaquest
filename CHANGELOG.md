# Changelog

All notable changes to QuotaQuest are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/); versioning is [SemVer](https://semver.org/).

## [0.6.0] — 2026-06-24
### Added — sellable paid content + storefront copy
- **5 theme packs (20 themes)**: Neon Arcade, Fantasy Guild, Minimal Pro, Streamer Kit,
  Seasonal Vol.1 — each an upload-ready zip in `packs/` (4 `.inc` + install README + preview.png).
- **Gumroad listings** (`docs/GUMROAD_LISTINGS.md`): paste-ready Title/Price/Description/Files/Cover
  for Free / Pro $12 / Multi-Tool $24 / Team $99 + à-la-carte packs + All-Access Pass $15.

## [0.5.0] — 2026-06-23
### Merged — Drive build "AI Energy HUD" integrated
- **Desktop notifications** (`monitor/notify.js`): edge-triggered, cross-platform, zero-dep;
  fires on NORMAL→WARNING→CRITICAL with cooldown. Wired into the monitor (`config.notify`).
- **Standalone .exe build** (`scripts/build-exe.ps1` + `monitor/sea-config.json`): Node SEA,
  runs without Node installed.
- **.rmskin manifest** (`skin/RMSKIN.ini`) to package the QuotaQuest skin.
- **Ported themes**: Mascot, Terminal (now Default/Minimal/Cyberpunk/Mascot/Terminal).
- **Whole original build preserved** under `legacy-aienergyhud/` (incl. prebuilt .rmskin,
  Radial/Compact layouts, Fantasy/Radial themes, install scripts). See `docs/INTEGRATION.md`.

## [0.4.0] — 2026-06-23
### Added — UGC theme system (the supply engine)
- **Theme Maker** (`tools/theme-maker/`): zero-code, live-preview theme editor. Exports
  Rainmeter `.inc`, JSON theme, and a share code. Presets: Default/Cyberpunk/Minimal/Mana/Arcade.
- **Theme format spec** (`docs/THEME_FORMAT.md`, `qq-theme/1`): one format consumed by the
  Maker, the Rainmeter skin, and the web renderer. Basis for packs + future marketplace.
- **Web renderer** now accepts `?theme=<code>` to apply a shared theme instantly (OBS-ready).

## [0.3.1] — 2026-06-23
### Added
- **Cursor / Copilot / Windsurf adapters** (file-backed): read a normalized usage export
  (`providerCfg.path` or `*_USAGE_FILE` env). Party goes real with a second source.
- **Reference web renderer** (`renderers/web/`): self-contained HTML reading `state.json`;
  transparent-background OBS overlay; per-AI party bars + aggregate, status pulse.
- README hero swapped to the multi-AI party view.

## [0.3.0] — 2026-06-23
### Added — EnergyHUD Engine v2 (platform)
- **Multi-AI party**: connect N providers; each is a member with HP/MP/EXP, **Regen** and
  **FullRecover**, plus a token-weighted **aggregate** (party status = worst member).
- **Provider registry** (`sources.js`): add any AI via one `fetch()`; Cursor/Copilot/Windsurf stubbed.
- **Theme system**: `@includeTheme` one-line swap; bundled Default/Minimal/Cyberpunk (`docs/SKINNING.md`).
- **Party skin** `QuotaQuestParty.ini` (per-AI bars) + aggregate skin updated (Regen, FullRecover, AI count).
- **Platform docs**: `ENGINE.md`, `STATE_SCHEMA.md` (v2), `ADAPTERS.md`, `RENDERERS.md`.
### Changed
- `state.json` schema **v2** (party + aggregate). v1 single-bar renderers still work (top-level mirror).

## [0.2.0] — 2026-06-23
### Changed (UI readability pass)
- Bars now show **remaining** unambiguously: `63% · 152h left` (HP/MP) and `47% of target` (EXP).
- Added subtle **weekly / session / today** sub-labels next to HP / MP / EXP (no beginner legend — target users are gamer-fluent).
- **Fixed status label clipping**: NORMAL/WARNING/CRITICAL are now right-aligned with the dot to their left, so long words never overflow the panel.
- `compute.js` emits pre-formatted `bar` + `line` per metric (skin still does no math). Skin bumped to 0.2.0.

## [0.1.1] — 2026-06-23
### Changed
- **Rebrand to QuotaQuest** — removed "Claude" from the product name to avoid trademark
  conflict; now described nominatively as "usage HUD for Claude Code".
### Added
- Legal/IP docs: `docs/RISK_AND_IP.md`, `docs/NAMING.md`, `docs/LICENSING.md`,
  `docs/TRADEMARK_JP.md`, `NOTICE`, `THIRD-PARTY.md`; standardized disclaimers.

## [0.1.0] — 2026-06-23
### Added — initial MVP
- **Node monitor** that reads local Claude Code usage and writes `state.json`.
  - Data sources with automatic fallback: ccusage adapter → direct `~/.claude` JSONL parse → demo.
  - Computes HP (weekly), MP (5-hour session), EXP (today), recovery ETA, burn rate, and
    NORMAL / WARNING / CRITICAL status.
  - Atomic state writes (temp file + rename); zero runtime npm dependencies.
- **Rainmeter skin** (`QuotaQuestHUD`) — always-on-top, half-transparent HUD with HP/MP/EXP
  bars, recovery timer and burn-rate readout; HP color driven by status.
- **Installer** (`scripts/install.ps1`) + launchers (`start-monitor.bat`, `start-monitor-demo.bat`).
- **Docs**: market research, positioning, architecture, wireframe, monetization.
- **Marketing**: X / Reddit / Product Hunt / Hacker News copy.
- **Landing page** (`landing-page.html`) and HUD screenshots.
- 6 unit tests for the compute logic; JSON schema validation.

### Known limitations
- Windows-only (Rainmeter dependency); the data layer is platform-agnostic Node.
- Plan token caps are calibratable defaults (Anthropic does not publish exact numbers).

## [Unreleased]
- Premium themes (Cyberpunk, FF-classic, Minimal, Streamer-overlay).
- Live ticking recovery countdown; WARNING pulse / CRITICAL blink + sound.
- Cursor / GitHub Copilot / Windsurf adapters.
- Cross-platform (Electron/Tauri) renderer.
