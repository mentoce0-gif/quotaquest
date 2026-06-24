# Third-party notices

QuotaQuest is MIT-licensed. It interoperates with, but does **not** bundle or
redistribute, the following third-party software. Users install these separately.

## Rainmeter
- Role: desktop skin host that renders the QuotaQuest HUD.
- License: GNU GPL v2 (the Rainmeter application).
- Important: QuotaQuest ships **skins** (`.ini` config) and a separate **Node.js** process.
  Skins are the skin author's own IP (per Rainmeter docs) and are **not derivative works**
  of Rainmeter's source code; the Node monitor does not link Rainmeter. Therefore the
  GPL does not extend to QuotaQuest's own code, which remains MIT.
- We do **not** bundle the Rainmeter installer. Get it from https://www.rainmeter.net.

## ccusage (optional, runtime)
- Role: optional data source. The monitor may invoke `npx ccusage@latest --json`.
- It is fetched/run on the user's machine via npx; we do not vendor or redistribute it.
- Project: https://github.com/ryoppippi/ccusage  (credit: @ryoppippi)

## Claude Code (data source, not bundled)
- QuotaQuest reads usage logs that Claude Code writes locally under `~/.claude`.
- "Claude" / "Claude Code" are trademarks of Anthropic, PBC. Used nominatively only.

## Fonts / assets
- Screenshots rendered with DejaVu Sans (bundled with the build toolchain only, not shipped).
- The HUD uses the system font (Segoe UI on Windows) at runtime.
