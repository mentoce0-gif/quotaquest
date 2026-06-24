# ARCHITECTURE.md — QuotaQuest

> Phase 3 deliverable. MVP-first. Two moving parts only: a **Node monitor** that writes a
> tiny **JSON state file**, and a **Rainmeter skin** that reads it. No server, no account, no cloud.

---

## 1. Design principles

- **MVP > everything.** Ship the smallest thing that visibly works.
- **No over-engineering.** One JSON file is the entire contract between backend and UI.
- **Local-only.** Reads `~/.claude` logs, writes one JSON. Nothing leaves the machine.
- **Decoupled.** Monitor and skin never talk directly — only through `state.json`. Either can
  be replaced (new data source, new UI theme) without touching the other.
- **Lightweight.** Poll on an interval (default 30s); idle CPU ≈ 0; tiny memory footprint.

---

## 2. High-level data flow

```
┌──────────────────────┐   reads    ┌─────────────────────┐   writes   ┌──────────────┐
│  Claude Code logs     │ ─────────▶ │  Node.js Monitor     │ ─────────▶ │  state.json   │
│  ~/.claude/projects/  │            │  (parse + compute)   │            │  (1 small file)│
│  *.jsonl  (+ ccusage) │            │                      │            └──────┬───────┘
└──────────────────────┘            └─────────────────────┘                   │ reads
                                                                                ▼
                                                                   ┌────────────────────────┐
                                                                   │  Rainmeter Skin         │
                                                                   │  HP / MP / EXP / Timer  │
                                                                   │  Burn Rate / Status     │
                                                                   └────────────────────────┘
```

1. **Source:** Claude Code writes a JSONL transcript per session under
   `~/.claude/projects/<encoded>/<session>.jsonl`, each assistant message carrying a
   `usage` block (`input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`,
   `output_tokens`) and `model`.
2. **Monitor (Node.js):** every N seconds it aggregates tokens for (a) the active **5-hour
   window** and (b) the **rolling 7-day** window, compares against the user's plan caps,
   computes burn rate, recovery ETA and status, then writes `state.json`.
3. **State (`state.json`):** the single source of truth for the UI. Schema in §4.
4. **Skin (Rainmeter):** reads `state.json` on its own update interval and renders the bars,
   timer, and status. Pure presentation.

---

## 3. Data-source strategy (MVP → later)

| Mode | How it works | When |
|------|--------------|------|
| **A. ccusage adapter (default)** | Monitor shells out to `npx ccusage@latest --json` and maps its output. | MVP — least parsing risk; ccusage already handles the log format & 5-hour blocks. |
| **B. Direct JSONL parse** | Monitor reads `~/.claude/projects/**/*.jsonl` itself and sums `usage`. | Fallback / zero-dependency mode if ccusage absent. |
| **C. Manual / demo** | `state.json` written from a fixture; great for streamers and screenshots. | Demo + offline. |

The monitor tries A, falls back to B, and supports C via a `--demo` flag. The UI never knows
or cares which mode produced the JSON.

---

## 4. The contract: `state.json` schema

```jsonc
{
  "schemaVersion": 1,
  "updatedAt": "2026-06-23T09:41:00Z",   // ISO-8601, last write
  "plan": "max20x",                        // pro | max5x | max20x | custom
  "status": "NORMAL",                      // NORMAL | WARNING | CRITICAL

  "hp": {                                  // weekly budget (the "health" you protect)
    "label": "WEEKLY",
    "percent": 63,                          // 0–100, drives bar fill
    "used": 152.4,                          // hours (or tokens) used this week
    "max": 240,                             // plan cap
    "unit": "hrs"
  },
  "mp": {                                   // 5-hour rolling window (the "mana" you spend)
    "label": "SESSION",
    "percent": 28,
    "used": 3.6,
    "max": 5,
    "unit": "hrs"
  },
  "exp": {                                  // today's usage (the "grind")
    "label": "TODAY",
    "percent": 47,                          // vs. a soft daily target
    "tokens": 8420000,
    "costUsd": 14.92
  },
  "recovery": {                             // next refill prediction
    "nextResetIso": "2026-06-23T13:00:00Z", // when the 5-hr window frees up
    "secondsRemaining": 7200,
    "human": "2h 00m",
    "weeklyResetIso": "2026-06-28T00:00:00Z"
  },
  "burn": {                                 // consumption speed ("DPS")
    "tokensPerMin": 18250,
    "usdPerHour": 3.10,
    "level": "MODERATE"                     // LOW | MODERATE | HIGH | EXTREME
  },

  "thresholds": { "warning": 30, "critical": 12 } // % of HP that flips status
}
```

**Status rule (single source of truth, computed in the monitor):**
- `hp.percent <= thresholds.critical` **or** `mp.percent <= 5` → `CRITICAL`
- else `hp.percent <= thresholds.warning` **or** `mp.percent <= 20` → `WARNING`
- else → `NORMAL`

The Rainmeter skin maps `status` → bar color and a small text label; it does **no math**.

---

## 5. Components

### 5.1 Node.js Monitor (`monitor/`)
- `index.js` — entry; arg parsing (`--interval`, `--plan`, `--demo`, `--once`).
- `sources.js` — A/B/C data sources (ccusage adapter, JSONL parser, demo fixture).
- `compute.js` — windows, percentages, burn rate, recovery ETA, status.
- `state.js` — atomic write of `state.json` (write temp + rename to avoid torn reads).
- `config.json` — plan caps + thresholds + paths + interval (user-editable).
- Runtime: Node 18+, **zero hard npm deps** for mode B/C (ccusage invoked via `npx`).

### 5.2 JSON State Manager
- Owns the schema, validation, defaults, and **atomic writes**.
- Guarantees the skin never reads a half-written file (temp-file + rename pattern).
- Versioned via `schemaVersion` so UI can guard against format drift.

### 5.3 Rainmeter Skin (`skin/QuotaQuestHUD/`)
- `QuotaQuestHUD.ini` — meters + measures.
- Reads `state.json` via Rainmeter's WebParser plugin (`Plugin=WebParser`, `Url=file://…`).
- Meters: HP bar, MP bar, EXP bar, status text, recovery timer, burn-rate readout.
- `@Resources/` — fonts, images, color variables.
- Always-on-top, draggable, 70% opacity (configurable via `Variables.inc`).

---

## 6. Update / timing model
- Monitor poll: **30s** default (config). Cheap; logs change slowly.
- Skin refresh: **2s** `Update` (reads local file only — negligible cost).
- Recovery countdown ticks **client-side** in the skin between monitor writes (skin computes
  `secondsRemaining` down from `nextResetIso`), so the timer feels live without frequent polls.

---

## 7. Failure handling
- Monitor can't find logs/ccusage → writes a `state.json` with `status:"NORMAL"` and a
  `"source":"demo"` flag so the HUD still renders (never a blank screen).
- `state.json` missing/corrupt → skin shows last-known values + a small "stale" dot.
- All errors logged to `monitor/monitor.log`; UI stays alive.

---

## 8. Folder structure (ships to GitHub as-is)

```
quotaquest/
├── README.md                     # Phase 5
├── LICENSE                       # MIT
├── landing-page.html             # Phase 6
├── docs/
│   ├── MARKET_RESEARCH.md        # Phase 1
│   ├── POSITIONING.md            # Phase 2
│   ├── ARCHITECTURE.md           # this file
│   ├── WIREFRAME.md              # ASCII + notes
│   └── MONETIZATION.md           # Phase 8
├── assets/
│   └── wireframe.svg             # visual mockup / screenshot stand-in
├── monitor/                      # Node.js backend
│   ├── index.js
│   ├── sources.js
│   ├── compute.js
│   ├── state.js
│   ├── config.json
│   └── package.json
├── state/
│   └── state.json                # generated at runtime (sample committed)
├── skin/
│   └── QuotaQuestHUD/
│       ├── QuotaQuestHUD.ini
│       ├── Variables.inc
│       └── @Resources/
│           └── Images/ (bar textures, optional)
├── scripts/
│   ├── install.ps1               # Windows installer (Phase 4)
│   └── start-monitor.bat         # launches the Node monitor
└── marketing/                    # Phase 7
    ├── x-posts.md
    ├── reddit-posts.md
    ├── product-hunt.md
    └── hacker-news.md
```

> In this delivery the same tree lives under `/release/` (docs in `release/docs/`, skin in
> `release/skin/`, etc.). The README maps 1:1 to the GitHub layout above.

---

## 9. Why this is enough for MVP
Two processes, one file, no network. A user can: install Rainmeter → drop in the skin →
run one `.bat` → see their Claude HP on the desktop. Everything beyond that (themes,
multi-tool adapters, tray packaging) is roadmap, not MVP.
