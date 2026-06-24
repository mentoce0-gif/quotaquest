# Contributing to QuotaQuest

Thanks for helping make AI quota *fun* to watch. Issues and PRs are welcome — especially
**new skins/themes** and **tool adapters**.

## Project layout
- `monitor/` — Node.js backend (reads usage, writes `state.json`). Start here for data/logic.
- `skin/QuotaQuestHUD/` — Rainmeter skin (the UI). Start here for visuals/themes.
- `state/state.json` — the single contract between the two. Don't break the schema (`schemaVersion`).
- `docs/ARCHITECTURE.md` — read this first.

## Dev setup
```bash
cd monitor
node index.js --demo --once --verbose   # synthetic data, no Claude logs needed
npm test                                # run the unit tests
```
The skin renders on Windows with [Rainmeter](https://www.rainmeter.net). See
`docs/RENDER_TEST.md` for the manual render checklist.

## Ground rules
- **MVP mindset.** Keep it lightweight; avoid heavy dependencies (the monitor ships with zero).
- **Don't break the JSON contract.** If you must change the schema, bump `schemaVersion` and
  update both `state.js` (validation) and the skin's WebParser regex.
- **Add a test** for any change to `compute.js`.
- Keep PRs focused; describe the before/after (screenshots help for skin changes).

## Adding a new data source (e.g. Cursor)
Add a `fromCursor()` in `sources.js` that returns the same normalized event shape
(`{ ts, tokens, model, costUsd }`) and slot it into the `getEvents()` fallback chain.

## Adding a theme
Copy `skin/QuotaQuestHUD` to a new variant, edit `Variables.inc` colors and the meter
shapes, and submit it under `skin/themes/<name>/`. Include a screenshot.

## License
By contributing you agree your contributions are licensed under the MIT License.
