# GUMROAD_LISTINGS.md — paste-ready storefront (QuotaQuest)

> Goal: from a Gumroad account to "buy now" in ~1 hour. Each product below has a
> Title / Price / Summary / Description / Files-to-upload / Cover. All paid files are built
> and live in `packs/` and the repo. Prices are launch values; tweak freely.
>
> Store setup: Gumroad → create account → connect payout (bank/PayPal) → Profile: "QuotaQuest".
> Global footer to add on every product: *"Independent project. Not affiliated with Anthropic.
> 'Claude'/'Rainmeter' are trademarks of their owners."*

---

## CORE PRODUCTS

### 1) QuotaQuest — Core (Free)
- **Price:** $0 (or "pay what you want", min $0)
- **Permalink:** `quotaquest`
- **Summary:** Turn your AI quota into an MMORPG HP/MP bar. Free & open-source core.
- **Description:**
  Always-on-top desktop HUD that shows your Claude Code usage as HP / MP / EXP with a
  recovery timer, burn rate and NORMAL/WARNING/CRITICAL status. 100% local. MIT core.
  • HP = weekly · MP = 5-hour session · EXP = today
  • Multi-AI "party" view · desktop notifications · web/OBS renderer
  • Windows + Rainmeter. Get updates + themes below.
- **Files:** link to the GitHub release zip (or attach `quotaquest-v*.zip`).
- **Cover:** `assets/hud_party.png`  · **Tags:** rainmeter, claude-code, hud, ai, productivity
- **CTA:** "Download free — then dress it up with a theme pack ↓"

### 2) QuotaQuest Pro (one-time)
- **Price:** $12
- **Permalink:** `quotaquest-pro`
- **Summary:** All 5 theme packs + live recovery countdown + status FX. Lifetime updates.
- **Description:**
  Everything in Free, plus the full cosmetic suite:
  • All 5 theme packs (20 themes) — Neon Arcade, Fantasy Guild, Minimal Pro, Streamer Kit, Seasonal Vol.1
  • Live ticking recovery countdown · WARNING pulse / CRITICAL blink + sound
  • Priority support · lifetime theme drops
- **Files:** all five `packs/*.zip`.
- **Cover:** `assets/gallery.png`  · **Tags:** rainmeter themes, hud, streamer, ai
- **CTA:** "Make your HUD yours."

### 3) QuotaQuest Multi-Tool (one-time)
- **Price:** $24
- **Permalink:** `quotaquest-multitool`
- **Summary:** Pro + Cursor/Copilot/Windsurf adapters + the streamer/OBS kit.
- **Description:**
  Everything in Pro, plus breadth:
  • Cursor · GitHub Copilot · Windsurf adapters (party view across all your AIs)
  • Streamer Kit theme pack + transparent-background OBS renderer
  • Setup guide for multi-AI party mode
- **Files:** `packs/*.zip` + `renderers/web/` (zip) + adapter config templates.
- **Cover:** `assets/hud_party.png`  · **Tags:** cursor, copilot, windsurf, obs, streaming
- **CTA:** "Watch every AI's HP at once."

### 4) QuotaQuest Team (one-time)
- **Price:** $99
- **Permalink:** `quotaquest-team`
- **Summary:** Internal-use license up to 25 seats. Everything included.
- **Description:** All packs + adapters + renderers, licensed for a studio/agency/stream team
  (≤25 seats). Invoice on request.
- **Files:** full repo zip + all packs. · **Cover:** `assets/gallery.png`

---

## THEME PACKS (à la carte) — $5 each

> Each is a ready zip in `packs/<name>.zip` (4 themes + install README + preview). Cover =
> that pack's `preview.png`.

| Product | Price | Permalink | File | Cover | Themes |
|---|---|---|---|---|---|
| Neon Arcade | $5 | `qq-neon-arcade` | `packs/Neon_Arcade.zip` | `packs/Neon_Arcade/preview.png` | Cyberpunk · Synthwave · Vaporwave · Matrix |
| Fantasy Guild | $5 | `qq-fantasy-guild` | `packs/Fantasy_Guild.zip` | `packs/Fantasy_Guild/preview.png` | FF Crystal · Hyrule · Parchment · Mana |
| Minimal Pro | $5 | `qq-minimal-pro` | `packs/Minimal_Pro.zip` | `packs/Minimal_Pro/preview.png` | Mono · Glass · Nord · Solarized |
| Streamer Kit | $7 | `qq-streamer-kit` | `packs/Streamer_Kit.zip` | `packs/Streamer_Kit/preview.png` | OBS Dark · Alert Red · XL Readable · Chroma Green |
| Seasonal Vol.1 | $5 | `qq-seasonal-vol1` | `packs/Seasonal_Vol.1.zip` | `packs/Seasonal_Vol.1/preview.png` | Halloween · Winter · Sakura · Pride |

**Common pack description (reuse):**
> 4 hand-tuned QuotaQuest themes. Drop the `.inc` files into your skin's `@Resources/Themes/`,
> change one line in `Variables.inc`, refresh Rainmeter. Works with the free core. Web/OBS too.

### All-Access Theme Pass (bundle)
- **Price:** $15 (vs $27 à la carte) · **Permalink:** `qq-all-access`
- **Summary:** All 5 packs (20 themes) + every future drop for 12 months.
- **Files:** all `packs/*.zip`. · **Cover:** `assets/gallery.png`

---

## Launch order (1 hour)
1. Create the 4 core products + All-Access Pass first (they reuse pack files).
2. Add the 5 individual packs (cover = each preview.png).
3. Set Pro as the featured product; add Free as the funnel top.
4. Put the Gumroad links in the GitHub README + landing page CTA + Product Hunt.
5. Post launch copy from `marketing/`. First sale possible immediately after.

## Pricing logic (recap)
One-time everywhere (audience is subscription-fatigued). À la carte $5 drives impulse buys;
Pro $12 bundles for the "just give me all of it" buyer; Multi-Tool $24 adds breadth;
All-Access Pass $15 captures the theme-only collector. See `docs/MONETIZATION_ROADMAP.md`.
