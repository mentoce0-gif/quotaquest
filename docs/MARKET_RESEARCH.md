# MARKET_RESEARCH.md — QuotaQuest

> Phase 1 deliverable. Research date: **June 2026**. Sources at the bottom.
> Goal: understand AI coding-tool usage limits, existing visualization tools, similar
> services and OSS, so we can position an MMORPG-style HUD that nobody else ships.

---

## 1. Executive summary

AI coding subscriptions in 2026 have all moved from "flat-rate, feels unlimited" to
**metered, depletable budgets** — weekly quotas (Claude), AI credits (Copilot),
API-rate caps (Cursor), credit pools (Windsurf). Heavy users now constantly ask
*"how much do I have left, and when does it reset?"*

A micro-category of **usage monitors** has appeared (tray apps, status-bar extensions,
terminal dashboards, desktop overlays). They are accurate but **utilitarian** — they look
like task managers. **None of them gamify the experience.** No tool turns the remaining
quota into an MMORPG HP/MP bar with status states and a recovery timer.

That is the opening for **QuotaQuest**: same data, radically more fun. The data
plumbing is already solved (Claude Code writes machine-readable JSONL logs locally), so we
stand on the shoulders of `ccusage` and ship the *experience layer* nobody else builds.

---

## 2. Usage limits by tool (2026)

### 2.1 Claude Code (Anthropic) — primary target

- **Weekly quotas** introduced **28 Aug 2025** on top of existing **5-hour rolling
  windows**. Two clocks run at once: a short rolling window and a weekly cap (resets every 7 days).
- Approximate budgets (Anthropic frames them as hours of model time):
  - **Pro ($20/mo):** ~40–80 hrs Sonnet / week.
  - **Max 5x ($100/mo):** ~140–280 hrs Sonnet + ~15–35 hrs Opus / week.
  - **Max 20x ($200/mo):** ~240–480 hrs Sonnet + ~24–40 hrs Opus / week.
- Reset times appear under **Settings → Usage** (separate reset for Opus vs. all other models).
- IDE usage (Claude in VS Code/JetBrains) **shares the same pool** as Claude Code.
- Anthropic says limits hit **<5% of subscribers** — i.e. exactly the *heavy users* who are our market.

**Why this matters:** Claude users juggle **three depleting resources at once** (5-hour
window, weekly Sonnet, weekly Opus). That maps perfectly onto a multi-bar HUD — HP (weekly),
MP (5-hour session), EXP (today), and a recovery timer.

### 2.2 GitHub Copilot

- Moved to **usage-based billing on 1 June 2026**: "premium request units" replaced by
  **GitHub AI Credits** (1 credit = $0.01), consumed on token usage at each model's rate.
- Tiers: **Free $0 · Pro $10 · Pro+ $39 · Max $100**. Pro = 1,000 base + 500 flex credits;
  Pro+ = 3,900 + 3,100; Max = 10,000 + 10,000.
- The switch triggered **public backlash** — power users reported agentic bills jumping
  10x–50x. "Am I burning credits?" anxiety is now mainstream.

### 2.3 Cursor

- **Pro $20/mo** = ~$20 of API-rate usage; **Pro+ $60/mo**; **Ultra $200/mo**.
- Effectively a **dollar-denominated budget** that drains as you use premium models.

### 2.4 Windsurf

- **Pro raised to $20/mo** (from $15, May 2026); **Max tier $200/mo**.
- Free tier: unlimited tab completion but a **credit pool** for premium/Cascade agent requests.

### 2.5 Pattern across all four

| Tool | Unit that depletes | Reset cadence | Anxiety driver |
|------|-------------------|---------------|----------------|
| Claude Code | Hours / weekly + 5-hr window | Weekly + rolling 5h | Two clocks, opaque |
| Copilot | AI credits ($) | Monthly | 2026 bill shock |
| Cursor | API-rate $ budget | Monthly | Silent overage |
| Windsurf | Credit pool | Monthly | Cascade burns fast |

Every major tool now has a **finite, refilling resource** — the exact shape of a video-game
energy bar. The category is converging on our metaphor whether it intends to or not.

---

## 3. Existing visualization & monitoring tools (the competitive field)

### 3.1 Data-layer / CLI
- **`ccusage`** (ryoppippi) — the de-facto standard. Reads local CLI logs → daily/weekly/
  monthly/session reports, **5-hour block tracking, live burn-rate, cost projection,
  per-model breakdown**. `npx ccusage@latest`. **Our data backbone.**
- **`better-ccusage`**, **`ccmonitor`** (shinagaki), **claude-usage-monitor** (terminal) —
  forks/dashboards with burn-rate + depletion prediction.

### 3.2 Status bar / tray / menu bar
- **ccusage VS Code/Cursor extension** — token usage in the editor status bar.
- **jens-duttke/usage-monitor-for-claude** — single-EXE Windows tray app, zero-config.
- **CodeZeno/Claude-Code-Usage-Monitor** — Windows taskbar widget (Claude/Codex/Antigravity).
- **rjwalters/claude-monitor** — macOS menu-bar widget, polls API via OAuth.

### 3.3 Desktop overlays / widgets (closest competitors)
- **bozdemir/claude-usage-widget** — PySide6/Qt always-on-top OSD; session + weekly
  utilization, reset timers, burn-rate badge, sparklines, 90-day heatmap, 52-week calendar.
  Feature-rich but **"dashboard" aesthetic**.
- **MattPears1/claude-code-usage-overlay** — always-on-top overlay of session + weekly limits.
- **SlavomirDurej/claude-usage-widget** — Windows usage widget.
- **jarrodwatts/claude-hud** — in-terminal "HUD" via Claude Code's native statusline API
  (note: terminal status line, not a desktop game overlay).

### 3.4 What the whole field has in common
1. **Aesthetic = productivity/analytics tool.** Bars, numbers, sparklines, heatmaps.
2. **Framing = anxiety management.** "Don't run out," "stop checking /usage."
3. **No game layer.** No HP/MP, no NORMAL/WARNING/CRITICAL status, no RPG styling, no
   "burn rate as DPS."
4. **Mostly Python/Qt/Electron or terminal.** **Nobody uses Rainmeter** — the Windows
   desktop-customization community (r/Rainmeter, r/desktops, Wallpaper Engine) is a distinct
   audience that loves exactly this kind of skinnable overlay.

---

## 4. Adjacent / inspiration markets
- **Rainmeter skins** (Wallpaper Engine, r/Rainmeter): huge appetite for sci-fi/RPG HUD
  aesthetics (system monitors styled as spaceship dashboards, Iron-Man UIs, mana bars).
  Proven that people *love* gamified system gauges — but they monitor CPU/RAM/GPU, **not AI usage**.
- **Stream overlays** (OBS, Streamlabs): streamers/"vibe coders" already show stats on
  screen. An AI-energy HUD is natively streamable content.
- **Productivity gamification** (Habitica, Forest): turning a metered resource into game
  mechanics drives engagement and sharing.

**Insight:** two mature communities (AI-usage monitoring + Rainmeter/RPG-HUD customization)
have **never been connected**. QuotaQuest is the bridge.

---

## 5. Gaps & opportunities
1. **No gamified AI-usage HUD exists.** Pure white space.
2. **No Rainmeter-based solution.** Taps the entire desktop-customization audience for free
   distribution (Rainmeter "Add skins," DeviantArt, r/Rainmeter).
3. **Shareability/virality.** A screenshot of "my Claude HP at 12% CRITICAL" is meme-able;
   dashboards aren't. Built-in marketing.
4. **Streamer-native.** Always-on-top + half-transparent = instant OBS overlay for the
   "vibe coding" livestream niche.
5. **Multi-tool future.** Today Claude Code; the same JSON-state design extends to Cursor/
   Copilot/Windsurf as they all expose depletable budgets.

## 6. Risks / threats
- **Anthropic ships an official usage UI** that's "good enough" → we win on *fun*, not data.
- **Local log format changes** → isolate parsing behind `ccusage`/an adapter layer.
- **Competitor adds a skin/theme** → first-mover + Rainmeter community moat + brand.
- **Rainmeter is Windows-only** → acceptable for MVP; roadmap Electron/Tauri later.

---

## 7. Conclusion → product thesis

The data problem is solved; the **experience problem is wide open**. Build the
*Final-Fantasy-status-bar for your AI quota*: read the same local JSONL that `ccusage`
reads, write a tiny JSON state file, and render it as a half-transparent, always-on-top
**Rainmeter MMORPG HUD** (HP / MP / EXP / Recovery Timer / Burn Rate / Status). Ship on
Windows first, ride the Rainmeter + vibe-coder communities, and own the category before
anyone else makes quota *fun*.

---

### Sources
- [Use Claude Code with your Pro or Max plan — Claude Help Center](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
- [Claude Code Rate Limits & Usage Quotas Explained (2026) — Truefoundry](https://www.truefoundry.com/blog/claude-code-limits-explained)
- [Weekly rate limits for Claude Pro and Max — apidog](https://apidog.com/blog/weekly-rate-limits-claude-pro-max-guide/)
- [ccusage — npm](https://www.npmjs.com/package/ccusage/v/15.0.0) · [ccusage — GitHub](https://github.com/ryoppippi/ccusage)
- [ccmonitor — GitHub](https://github.com/shinagaki/ccmonitor)
- [Claude Code/Codex local token logs — DEV](https://dev.to/newtorob/claude-code-and-codex-are-logging-your-token-usage-locally-here-is-how-to-read-it-580)
- [Explore the .claude directory — Claude Code Docs](https://code.claude.com/docs/en/claude-directory)
- [claude-usage-widget (bozdemir) — GitHub](https://github.com/bozdemir/claude-usage-widget)
- [claude-code-usage-overlay (MattPears1) — GitHub](https://github.com/MattPears1/claude-code-usage-overlay)
- [usage-monitor-for-claude (jens-duttke) — GitHub](https://github.com/jens-duttke/usage-monitor-for-claude)
- [Claude-Code-Usage-Monitor (CodeZeno) — GitHub](https://github.com/CodeZeno/Claude-Code-Usage-Monitor)
- [claude-hud (jarrodwatts) — GitHub](https://github.com/jarrodwatts/claude-hud)
- [AI Coding Tools Pricing Comparison 2026 — Developers Digest](https://www.developersdigest.tech/blog/ai-coding-tools-pricing-2026)
- [Changes to GitHub Copilot Individual plans — GitHub Blog](https://github.blog/news-insights/company-news/changes-to-github-copilot-individual-plans/)
- [GitHub Copilot pricing backlash — TechTimes](https://www.techtimes.com/articles/317536/20260601/github-copilot-pricing-change-drives-backlash-agentic-bills-jump-10x-50x-power-users.htm)
- [Windsurf Pricing 2026 — PE Collective](https://pecollective.com/tools/windsurf-pricing/)
