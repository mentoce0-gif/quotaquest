# THEME_FORMAT.md — the QuotaQuest theme spec (the UGC method)

> One theme format, three consumers: the **Theme Maker** (authoring), the **Rainmeter skin**
> (`.inc`), and the **web renderer** (JSON / share code). Anyone — yes, a kid with $0 and a
> color picker — can make their own bar style and it works everywhere. This is the supply
> engine for theme packs and the future marketplace.

## Why this is the lock-in method
- **Zero-code authoring** → infinite supply at ~zero marginal cost (UGC).
- **One spec** → every renderer and pack consumes the same theme; no rework as we add UIs.
- **Self-expression** → "your favorite bar, your character sheet" = the emotional wedge + virality.
- Sets up **packs** (bundle themes) and a **marketplace** (sell/share, rev-share) with no new format.

## Tools & flow
```
tools/theme-maker/index.html   ──(pick colors, live preview)──▶  export:
   • Rainmeter  → MyTheme.inc      (drop in skin/QuotaQuestHUD/@Resources/Themes/, set @includeTheme)
   • Web/JSON   → MyTheme.theme.json
   • Share code → base64; open renderers/web/index.html?theme=<code>  (instant OBS-ready preview)
```

## Token spec (v1 — `schema: "qq-theme/1"`)
| key | meaning | format |
|-----|---------|--------|
| `hp` | HP bar (NORMAL status) | hex `#rrggbb` |
| `mp` | MP bar | hex |
| `exp` | EXP bar | hex |
| `regen` | Regen accent | hex |
| `track` | empty bar track | hex |
| `bg` | panel background | hex |
| `line` | panel border / divider | hex |
| `text` | primary text | hex |
| `dim` | secondary text | hex |
| `opacity` | panel alpha | 60–255 |
| `bh` | bar height (px) | 8–18 |
| `br` | bar corner radius (px) | 0–9 |
| `name` | theme name | string |

WARNING/CRITICAL HP colors stay semantic (amber/red) so "danger" always reads — themes restyle
the *vibe*, not the safety signal.

## Rainmeter `.inc` mapping (what the Maker writes)
`ColBG (with opacity) · ColPanelLine · ColText · ColDim · ColSub · ColTrack · ColMP · ColEXP ·
ColRegen · ColHPNormal · BarHeight · BarRadius`. Matches `skin/QuotaQuestHUD/@Resources/Themes/*.inc`.
(Skin reads HP color from status today; to honor `ColHPNormal` natively, point the NORMAL
substitute at `#ColHPNormal#` — a 1-line skin tweak on the roadmap. Web renderer honors it now.)

## Web mapping (share code)
JSON theme → CSS vars: `hp→--ok, mp→--mp, exp→--exp, regen→--regen, bg→--bg, track→--track,
line→--line, text→--text, dim→--dim`. So a share code instantly themes the web/OBS HUD.

## Turning themes into product
- **Pack** = a folder of `.inc` + JSON + a gallery image (see `docs/THEME_PACKS.md`).
- **Marketplace** = users submit themes (this format), we list/sell, creator gets rev-share.
- **Versioning**: bump `schema` (`qq-theme/2`) for new tokens; renderers ignore unknown keys.

## Next expansion this unlocks (why we lock it tonight)
1. Seed 5 packs from Maker output (cheap, today).
2. Open community submissions (same format) → supply scales without us.
3. Add a one-click in-app theme switcher + gallery → marketplace take-rate.
