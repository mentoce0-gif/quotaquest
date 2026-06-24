# ENGINE.md — EnergyHUD Engine (the base layer for AI-consumption management)

> QuotaQuest is one *product*. **EnergyHUD Engine** is the reusable *core* underneath it.
> Goal: become the standard mechanism every "AI usage / quota / cost" tool builds on, so
> nobody re-implements log parsing, windowing, burn/regen math, or state plumbing again.

## The thesis
Every AI tool is converging on the same shape: a **depletable, refilling budget**. So every
monitoring tool re-solves the same problems — read local logs, sum tokens over rolling/calendar
windows, compute remaining / burn / regen / recovery, and hand a clean state to some UI.
EnergyHUD Engine does that **once**, behind a stable contract, and opens both ends:

```
  ┌────────── ADAPTERS (data in) ──────────┐        ┌──────── RENDERERS (UI out) ────────┐
  Claude Code · Cursor · Copilot · Windsurf │        │ Rainmeter · Web · OBS · Electron …  │
  OpenAI · Bedrock · your-own            ──▶│ ENGINE │──▶  (anything that reads state.json) │
  (docs/ADAPTERS.md)                        │ core   │     (docs/RENDERERS.md)             │
  └──────────────────────────────────────────┘        └─────────────────────────────────────┘
                        contract = state.json (docs/STATE_SCHEMA.md, versioned)
```

## What the engine guarantees (so you don't rebuild it)
1. **Normalization** — every adapter emits the same event shape `{ ts, tokens, model, costUsd }`.
2. **Windowing** — rolling 5-hour + 7-day + today, per provider.
3. **Party model** — N providers → N members + an aggregate rollup (worst-status wins).
4. **Derived metrics** — remaining, **burn** (DPS), **regen** (refill rate), **recovery** (next
   partial reset) and **full-recover** (back to 100%), plus NORMAL/WARNING/CRITICAL status.
5. **Stable, versioned `state.json`** — one atomic file; the only thing a renderer needs.

## The three seams (where you plug in)
- **Adapters** (`monitor/sources.js` registry) — add a data source. One function: `fetch()`.
- **State schema** (`docs/STATE_SCHEMA.md`) — the contract. Versioned via `schemaVersion`.
- **Renderers** (`docs/RENDERERS.md`) — read `state.json`, draw anything. Rainmeter is just the first.

## Why this is a moat, not just architecture
- A growing **adapter library** = the engine becomes the cheapest way to support any AI tool.
- A growing **renderer/theme library** = the engine becomes the cheapest way to ship any UI.
- The **schema** is the standard everyone codes to. Own the contract, own the category.

## Packaging intent (roadmap)
- `@energyhud/engine` — the core (this `monitor/`), publishable to npm, framework-free.
- `@energyhud/adapters-*` — per-tool adapters.
- `energyhud/renderers-*` — Rainmeter skins, a web component, an OBS source.
- QuotaQuest stays the flagship consumer product (and reference renderer) on top.

## Contribution funnel (the 導線)
1. New data source? → `docs/ADAPTERS.md` (copy the stub, implement `fetch()`).
2. New look? → `docs/SKINNING.md` (theme) or `docs/RENDERERS.md` (new renderer).
3. Need a field? → propose a `schemaVersion` bump in `docs/STATE_SCHEMA.md` (back-compat rules included).
Each path touches exactly one seam and nothing else. That separation is the product.
