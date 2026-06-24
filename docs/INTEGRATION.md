# INTEGRATION.md — merging the Drive "AI Energy HUD" build into QuotaQuest

> Source: `AI-Energy-HUD-release.zip` (Google Drive, 2026-06-23). A parallel build of the
> same concept under the name **AI Energy HUD**. This file records what was merged and why.

## Canonical decision
**QuotaQuest stays the canonical product.** It is trademark-safe (no "Claude"/generic-mark
issue), and further along: rebrand + IP/legal/JPO docs, **EnergyHUD Engine v2** (multi-AI
party, Regen/FullRecover), Theme Maker, web renderer, monetization roadmap + theme-pack ROI.

## What the Drive build had that we lacked → MERGED
| From AI Energy HUD | Action | Where |
|---|---|---|
| **Desktop notifications** (edge-triggered, x-platform, zero-dep) | ported + adapted to v2 state | `monitor/notify.js` (wired in `index.js`; `config.notify`) |
| **Standalone .exe build** (Node SEA) | ported, retargeted to QuotaQuest | `scripts/build-exe.ps1` + `monitor/sea-config.json` |
| **.rmskin packaging** | added manifest for our skin | `skin/RMSKIN.ini` |
| **Rich themes** (HP normal/warn/crit + fonts) | 2 ported to our format | `…/Themes/Mascot.inc`, `Terminal.inc` |

## Preserved intact (zero loss) → `legacy-aienergyhud/`
The **entire** original build is kept untouched for reference and reuse, including assets we
did not port line-by-line:
- `dist/AIEnergyHUD_1.0.0.rmskin` — a prebuilt Rainmeter package.
- Extra layouts: `Compact.ini`, `Radial.ini` (radial gauge), full `AIEnergyHUD.ini`.
- 6 themes incl. **Fantasy**, **Radial**, **Mascot**, **Terminal** (richer key set: HP
  normal/warning/critical + font sizes).
- `install/` (install.bat/.ps1, build-exe.ps1), `monitor/src/` (parsers/notify/state/compute),
  preview render scripts, `LAUNCH.md`, `docs/`.

## Not merged (superseded by QuotaQuest) — and why
- **Their monitor core** (`monitor/src/*`): our engine is v2 (multi-provider party, Regen,
  FullRecover, aggregate) — more capable; we kept ours.
- **Their single-bar skin/state schema**: superseded by our v2 `state.json` + party/aggregate.
- **Brand "AI Energy HUD"**: superseded by **QuotaQuest** (trademark rationale in `docs/RISK_AND_IP.md`).

## Follow-ups (roadmap)
- Converge theme formats: adopt their richer **HP normal/warning/critical + font** keys into
  a `qq-theme/2` schema and update the Theme Maker (`docs/THEME_FORMAT.md`).
- Port the **Radial** and **Compact** layouts to read v2 `state.json` (currently in legacy).
- Rebuild a **QuotaQuest .rmskin** from `skin/RMSKIN.ini` (Rainmeter packager on Windows).
