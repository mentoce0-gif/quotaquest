# RENDERERS.md — build any UI on EnergyHUD

> A **renderer** reads `state.json` and draws it. Rainmeter is the first; the contract is
> UI-agnostic, so a web widget, OBS source, menu-bar app, or CLI are all just renderers.

## All you need
Read `state.json` (schema: `docs/STATE_SCHEMA.md`). Poll it, or watch the file. That's it —
no engine coupling, no API. The file is local and updates every interval.

## Pick your level
- **Compact / aggregate** — read top-level `status, hp, mp, exp, regen, recovery, burn`.
  Great for a single glanceable widget. (Rainmeter: `QuotaQuestHUD.ini`.)
- **Party / per-AI** — iterate `party[]`, one row per member. (Rainmeter: `QuotaQuestParty.ini`.)

## Minimal web renderer (example)
```html
<script>
async function tick() {
  const s = await fetch('state.json').then(r => r.json());
  document.body.dataset.status = s.status;                 // color theme by status
  hp.style.width = s.hp.bar + '%'; hpTxt.textContent = s.hp.line;
  mp.style.width = s.mp.bar + '%'; mpTxt.textContent = s.mp.line;
  party.innerHTML = s.party.map(m =>
    `<div class="m ${m.status}">${m.name}: HP ${m.hp.bar}% · MP ${m.mp.bar}%</div>`).join('');
}
setInterval(tick, 2000); tick();
</script>
```

## Rendering rules (match the engine's intent)
- HP/MP bars show **remaining** (full = healthy). EXP shows **progress**.
- Map `status` → color (NORMAL green / WARNING amber / CRITICAL red); recolor the HP bar.
- Show `line` strings verbatim (the engine pre-formats them — keep "renderer does no math").
- Use `regen` (refill rate) and `recovery.fullHuman` (FullRecover) for the RPG feel.
- For a party, show each member and let `status` (worst-wins) drive the overall vibe.

## Renderer ideas (roadmap / good first contributions)
- Web component / embeddable widget · OBS browser source (transparent) · Electron/Tauri tray
  app (cross-platform) · VS Code status bar · terminal TUI · stream alert webhooks.

## Versioning
Check `schemaVersion` (currently 2). Additive fields won't bump it; treat unknown fields as optional.
