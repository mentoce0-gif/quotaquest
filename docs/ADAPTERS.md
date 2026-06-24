# ADAPTERS.md — add any AI tool to EnergyHUD

> An **adapter** turns one AI tool's local usage into the engine's normalized events.
> Add one and that tool becomes a party member everywhere — no engine/schema/UI changes.

## The contract
```js
// monitor/sources.js — REGISTRY
const myAdapter = {
  id: 'cursor',
  name: 'Cursor',
  defaultModel: 'cursor',
  // Return { source, model?, events } or null if no data / not available.
  fetch(cfg, providerCfg) {
    const events = readMyToolUsageSomehow();        // your logic
    return events.length ? { source: 'cursor', events } : null;
  },
};
```
Each event is normalized:
```js
{ ts: <epochMs>, tokens: <Number>, model: <String>, costUsd: <Number> }
```
That's the whole interface. The engine handles windowing, burn/regen/recovery, status, party,
aggregation, and `state.json`.

## Steps to add a provider
1. Implement `fetch()` in `monitor/sources.js` and register it in `REGISTRY`.
   (Stubs for `cursor`, `copilot`, `windsurf` are already present — fill them in.)
2. Enable it in `monitor/config.json`:
   ```jsonc
   "providers": [
     { "id": "claude-code", "adapter": "claude", "name": "Claude Code", "plan": "max20x" },
     { "id": "cursor",      "adapter": "cursor", "name": "Cursor",      "plan": "pro" }
   ]
   ```
3. Run `node index.js --once --verbose` — your tool shows up as a party member.

## Where each tool's data lives (starting points)
- **Claude Code** — `~/.claude/projects/**/*.jsonl` (implemented), or `npx ccusage`.
- **Cursor / Windsurf** — local app data / their usage export or API.
- **Copilot** — GitHub AI Credits usage (API) — map credits→tokens or keep `costUsd`.
- **OpenAI / Bedrock / others** — usage/billing API → emit events.

## Caps & calibration
Per-provider `plan` selects a cap set in `config.json#plans`. Caps are calibratable defaults
(exact vendor numbers aren't public); a provider can also carry its own `caps` later.

## Good adapter behavior
- Be **read-only** and **local-first**; never send usage anywhere.
- Return `null` cleanly when unavailable (engine just skips you).
- Keep `fetch()` fast (cache if the source is slow); the monitor polls on an interval.

## Built-in file adapters (Cursor / Copilot / Windsurf)
These three are wired to read a **normalized usage export** (a `.json` array or `.jsonl` of
`{ ts|timestamp, tokens|usage, model?, costUsd? }`). Point them at a file via config
`providerCfg.path` or an env var (`CURSOR_USAGE_FILE`, `COPILOT_USAGE_FILE`, `WINDSURF_USAGE_FILE`);
default is `~/.<tool>/usage.json`. They return null (member skipped) when the file is absent.
Swap in a native reader later by replacing that adapter — nothing else changes.
