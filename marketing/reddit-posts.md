# Reddit — 3 posts (subreddit-tailored)

> Reddit hates ads. Lead with value, be honest it's yours, link last. Engage in comments.

---

## Post 1 — r/ClaudeAI (or r/Anthropic)
**Title:** I got tired of hitting Claude Code's weekly limit mid-task, so I built an HP/MP bar for my desktop

**Body:**
Claude runs two limits at once — the 5-hour rolling window and the weekly cap — and you can't feel either while you're deep in a session. I kept getting wall-slammed with no warning.

So I built **QuotaQuest**: it reads the usage logs Claude Code already writes locally and renders them as an MMORPG-style overlay.

- **HP** = weekly budget remaining
- **MP** = current 5-hour session window
- **EXP** = today's usage
- **Recovery timer** = when your window frees up
- **Burn rate** = how fast you're spending (LOW→EXTREME)
- **Status** = NORMAL / WARNING / CRITICAL (HP bar changes color)

It's always-on-top, half-transparent, 100% local (no account/cloud), and the core is open source (MIT). Windows + Rainmeter + Node for now; cross-platform is on the roadmap.

Happy to answer questions about how it parses the logs or how I estimate the caps (Anthropic doesn't publish exact numbers, so they're calibratable). Repo + download in the comments.

---

## Post 2 — r/Rainmeter
**Title:** [Skin] QuotaQuest — visualize your AI coding usage as RPG HP/MP bars

**Body:**
Most usage monitors for AI coding tools look like dashboards. I wanted something that fit the Rainmeter aesthetic, so I made an RPG energy HUD.

A tiny Node monitor writes a `state.json`; the skin reads it via WebParser and draws three bars (HP/MP/EXP) plus a recovery timer, burn rate, and a NORMAL/WARNING/CRITICAL status that recolors the HP bar.

- Glassy half-transparent panel, draggable, always-on-top
- All values come from one JSON file — easy to reskin or theme
- Looking for feedback on the layout and ideas for theme variants (Cyberpunk / FF-classic / Minimal)

Free + MIT. Screenshots, .ini, and install steps in the comments. Would love critique from this crowd on the meter setup.

---

## Post 3 — r/SideProject (or r/indiehackers)
**Title:** Turned a boring AI-usage monitor into an MMORPG status bar — launching QuotaQuest

**Body:**
There's a whole category of "Claude usage monitor" tools now, but they're all spreadsheets. I bet that *fun* was the missing wedge, so I built the gamified version.

**What it is:** a desktop overlay that shows your Claude Code quota as HP (weekly), MP (5-hour session) and EXP (today), with a recovery timer and burn rate.

**The model:** core is free/open-source to ride the Rainmeter + r/ClaudeAI communities; paid Pro themes ($12 one-time) and a multi-tool pack ($24, adds Cursor/Copilot/Windsurf) fund it. No SaaS, no subscription.

**Why I think it works:** it's screenshot-native ("my HP is at 8% 🩸" is a tweet), streamer-native (drops into OBS), and nobody else connects the AI-usage and desktop-customization audiences.

Looking for feedback on the pricing and the wedge. Does "make quota fun" sound like a real product or a toy to you? Link in comments.
