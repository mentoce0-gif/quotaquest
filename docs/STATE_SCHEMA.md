# STATE_SCHEMA.md — the EnergyHUD contract (`state.json`)

> This file is the **standard** that adapters write toward and renderers read from.
> Versioned via `schemaVersion`. Current: **v2** (multi-provider "party").

## Top level
```jsonc
{
  "schemaVersion": 2,
  "updatedAt": "ISO-8601",
  "engine": "energyhud",
  "providerCount": 2,
  "status": "NORMAL|WARNING|CRITICAL",   // party-worst

  // aggregate mirror (so single-bar renderers work unchanged). ORDER is stable
  // for regex renderers: hp, mp, exp, regen, recovery, burn.
  "hp":   <Bar>, "mp": <Bar>, "exp": <Bar>,
  "regen":   { "tokensPerMin": 166000, "line": "+166,000 tok/min" },
  "recovery":{ "human": "2h 00m", "secondsRemaining": 7200, "fullHuman": "4h 58m" },
  "burn":    { "tokensPerMin": 18250, "level": "LOW|MODERATE|HIGH|EXTREME" },

  "party": [ <Member>, ... ],            // one per connected AI
  "aggregate": <Aggregate>,              // same shape as the top-level mirror
  "thresholds": { "warning": 30, "critical": 12 }
}
```

## `<Bar>`
```jsonc
{
  "bar": 63,                       // 0-100, drives fill width
  "line": "63% · 152h left",       // pre-formatted display string (renderer shows verbatim)
  "label": "WEEKLY|SESSION|TODAY|PARTY HP|PARTY MP",
  "percent": 63,                   // = bar (REMAINING for hp/mp; PROGRESS for exp)
  "used": 88, "remaining": 152, "max": 240, "unit": "hrs|tok"
}
```

## `<Member>` (a party member = one AI provider)
```jsonc
{
  "id": "claude-code", "name": "Claude Code", "model": "claude-sonnet",
  "source": "ccusage|jsonl|demo|<adapter>",
  "status": "NORMAL|WARNING|CRITICAL",
  "hp": <Bar>,   // weekly budget remaining
  "mp": <Bar>,   // 5-hour session remaining
  "exp": <Bar>,  // today's usage vs target
  "regen": { "tokensPerMin": Number, "line": String },
  "burn":  { "tokensPerMin": Number, "usdPerHour": Number, "level": String },
  "recovery": {
    "human": "2h 00m",              // next PARTIAL reset (window starts freeing)
    "secondsRemaining": 7200,
    "fullHuman": "4h 58m",          // FULL recover (session back to 100%)
    "fullSecondsRemaining": 17880,
    "weeklyHuman": "4d 14h",        // weekly (HP) full reset
    "nextResetIso": "ISO", "fullRecoverIso": "ISO", "weeklyResetIso": "ISO"
  }
}
```

## Member field order (for regex renderers)
`name, status, hp{bar,line}, mp{bar,line}, exp{...}, regen, burn, recovery`.
Renderers that use regex (e.g. Rainmeter WebParser) rely on this ordering — keep it stable.

## Semantics
- **HP** = weekly budget remaining. **MP** = current 5-hour session remaining. **EXP** = today vs a soft target.
- **bar/percent are REMAINING** for hp/mp (full = lots left); **PROGRESS** for exp.
- **Regen** = average rate (tokens/min) the rolling window frees budget.
- **Recovery** = time until the window *starts* to free; **FullRecover** = until it's 100% again.
- **status** per member, and **party status = worst member**. Aggregate bars are token-weighted.

## Versioning rules
- Additive changes (new optional fields) **do not** bump `schemaVersion`.
- Renames/removals/semantic changes **do** bump it; renderers should check `schemaVersion`.
- v1 (single-bar) → v2 (party): top-level `hp/mp/exp` retained as the aggregate mirror, so
  v1 renderers keep working against v2 output.

## Atomicity
The engine writes `state.json` via temp-file + rename, so readers never see a partial file.
