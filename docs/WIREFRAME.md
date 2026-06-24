# WIREFRAME.md — QuotaQuest UI

> Phase 3 deliverable. Low-fi layout for the always-on-top desktop overlay.
> A rendered visual mock lives at `assets/wireframe.svg`.

---

## 1. The HUD (default compact layout, ~320×150 px)

```
╔══════════════════════════════════════════════╗
║  ⚡ QUOTAQUEST                    ● NORMAL    ║
║                                                ║
║  HP  weekly  ▓▓▓▓▓▓▓▓▓░░░░░    63% · 152h left ║
║  MP  session ▓▓▓▓░░░░░░░░░░░    28% · 1.4h left ║
║  EXP today   ▓▓▓▓▓▓▓░░░░░░░░    47% of target   ║
║  ─────────────────────────────────────────────║
║  ⟳ Recovery 2h 00m            🔥 Burn MODERATE ║
╚══════════════════════════════════════════════╝
```

> Note: HP/MP show **remaining** (`X% · Yh left`); EXP shows **progress** (`X% of target`).
> Status label is right-aligned with the dot on its left so WARNING/CRITICAL never clip.

## 2. Status states (drive HP bar + dot + label color)

```
NORMAL    ● green     HP > 30%       "all good, keep coding"
WARNING   ● amber     HP 12–30%      bar pulses slowly
CRITICAL  ● red       HP <= 12%      bar pulses fast, label blinks
```

## 3. Element spec

| # | Element | Source field | Visual |
|---|---------|--------------|--------|
| 1 | Title | static | small caps, dim |
| 2 | Status dot + label | `status` | colored dot, top-right |
| 3 | HP bar | `hp.percent` | full-width bar, color by `status` |
| 4 | HP value | `hp.used`/`hp.max` | right-aligned text |
| 5 | MP bar | `mp.percent` | cyan bar |
| 6 | EXP bar | `exp.percent` | gold bar |
| 7 | Recovery timer | `recovery.human` | counts down live |
| 8 | Burn rate | `burn.level` | flame icon + LOW/MOD/HIGH/EXTREME |

## 4. Layout variants (roadmap, not MVP)
- **Compact** (default): the box above.
- **Bars-only**: just HP/MP/EXP, no text — minimal streamer overlay.
- **Vertical**: stacked for the screen edge.

## 5. Interaction
- **Drag** to reposition (Rainmeter native).
- **Right-click → Variants/Refresh** via skin context menu.
- **Opacity** set in `Variables.inc` (default 70%).
- No clicks required for normal use — it's ambient.

## 6. Color tokens (`Variables.inc`)
```
HP green   = 60,200,120     HP amber = 240,180,40     HP red = 235,70,70
MP cyan    = 80,200,230     EXP gold = 240,200,90
BG glass   = 18,18,24 @ 70% opacity     Text = 230,230,235     Dim = 150,150,160
```
