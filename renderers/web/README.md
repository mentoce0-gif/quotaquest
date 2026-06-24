# Web renderer (reference)

A self-contained HTML renderer for the EnergyHUD `state.json`. No build, no deps.
Doubles as an **OBS browser source** (transparent background) for streamers.

## Use
1. Run the monitor so `state.json` is being written.
2. Serve this folder and point it at the file:
   - quickest: copy/symlink `state.json` next to `index.html`, then open `index.html`.
   - or pass a URL: `index.html?src=http://localhost:8080/state.json`.
3. In OBS: add a **Browser Source** → local file `index.html` (or the URL). Background is
   transparent; only the panel shows.

## Why it exists
Proves the engine is renderer-agnostic: this UI never imports engine code — it only reads
`state.json` (see `docs/STATE_SCHEMA.md`). Build your own the same way (`docs/RENDERERS.md`).
