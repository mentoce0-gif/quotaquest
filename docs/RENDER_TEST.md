# RENDER_TEST.md — verify the Rainmeter skin on Windows

> The data layer (Node monitor + `state.json`) is automatically tested (`npm test`).
> The **skin** must be eyeballed on a real Windows + Rainmeter install. This is that checklist.

## Prerequisites
- Windows 10/11
- [Rainmeter](https://www.rainmeter.net) (4.5+) installed
- [Node.js 18+](https://nodejs.org) installed (`node -v` works in a terminal)

## 1. Install
```powershell
cd path\to\quotaquest
powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Plan max20x
```
Expected: "Skin copied", "Monitor will write -> ...@Resources\state.json", "Primed first reading".

## 2. Load the skin
1. Open Rainmeter → **Manage**.
2. **Refresh All**.
3. Under `QuotaQuestHUD`, select `QuotaQuestHUD.ini` → **Load**.
4. The HUD panel appears on the desktop. Drag it where you want it.

## 3. Visual checklist (NORMAL state from the seeded state.json)
- [ ] Panel is rounded, dark, and **half-transparent** (desktop shows through).
- [ ] Title reads **QUOTAQUEST**; a **green** status dot + `NORMAL` top-right.
- [ ] **HP** bar ~63% filled, **green**; value `63%  152/240 hrs` right-aligned.
- [ ] **MP** bar ~28% filled, **cyan**; value `28%  3.6/5.0 hrs`.
- [ ] **EXP** bar ~47% filled, **gold**; `47% today`.
- [ ] Footer: `⟳ Recovery 2h 00m` left, `🔥 Burn MODERATE` right.
- [ ] Window stays **always-on-top** over other apps.

## 4. Live data test
```powershell
scripts\start-monitor.bat          REM real Claude Code usage
REM ...or, with no logs / for a demo:
scripts\start-monitor-demo.bat
```
- [ ] Within ~30s the bars update from the monitor (right-click skin → **Refresh** to force).
- [ ] `monitor\monitor.log` shows `ok mode=jsonl ...` (or `ccusage` / `demo`).

## 5. Status-color test (WARNING / CRITICAL)
Temporarily simulate low HP to confirm the bar recolors:
```powershell
REM lower the weekly cap so usage looks high, then prime once:
node monitor\index.js --plan pro --once
```
- [ ] When HP ≤ 30% the dot/label/HP bar turn **amber** (WARNING).
- [ ] When HP ≤ 12% (or MP ≤ 5%) they turn **red** (CRITICAL).
Reset by restoring your real plan in `monitor/config.json`.

## 6. Troubleshooting
| Symptom | Fix |
|--------|-----|
| Bars empty / "stale" | Check `monitor\monitor.log`; ensure the monitor is running and `statePath` in `config.json` points to `...\@Resources\state.json`. |
| Numbers look wrong | Calibrate `plans.*` token caps in `config.json` to your real plan. |
| Skin won't load | Rainmeter → Refresh All; confirm the folder copied to `Documents\Rainmeter\Skins\QuotaQuestHUD`. |
| Emoji glyphs missing | Cosmetic; Segoe UI Emoji ships with Windows. Replace the ⚡/⟳/🔥 in the `.ini` with text if preferred. |

## 7. Capture a real screenshot
Once it looks right, `Win+Shift+S` the HUD and drop the PNG into `assets/` to replace the
generated mockups in the README. That's the only step that needs a human on Windows.
