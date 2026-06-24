# MONETIZATION.md — QuotaQuest

> Phase 8 deliverable. Models compared, recommendation, and a 12-month revenue projection
> with explicit assumptions. Figures are planning estimates, not guarantees.

---

## 1. Models compared

| Model | How we'd charge | Pros | Cons | Fit |
|-------|-----------------|------|------|-----|
| **Pure OSS** | Free, donations | Max reach, community trust, virality | ~0 direct revenue; relies on sponsors | ⭐⭐ |
| **Freemium (OSS core + paid add-ons)** | Free core; paid themes/multi-tool packs | Reach **and** revenue; community markets it | Must keep building paid value | ⭐⭐⭐⭐⭐ |
| **Gumroad one-time** | $12–24 one-time digital | Zero infra, instant, keeps ~90% | No recurring revenue; price ceiling | ⭐⭐⭐⭐ |
| **SaaS subscription** | $3–5/mo hosted dashboard | Recurring MRR, retention metrics | Kills "local-only" trust; infra + churn; weak value for a local widget | ⭐⭐ |
| **One-time purchase (closed)** | Paid app, no free tier | Simple, premium feel | No virality, no community moat, hard cold-start | ⭐⭐ |

### Why each scores the way it does
- **OSS** is our **distribution engine**, not our revenue engine. The Rainmeter + r/ClaudeAI crowd shares free, MIT skins; a closed product can't ride that.
- **SaaS** fights the core promise ("100% local, no account"). Hosting a dashboard for a desktop widget adds cost and erodes trust for little added value. Reject as primary.
- **One-time closed** throws away the viral top of funnel.
- **Freemium + one-time paid packs, sold via Gumroad** captures the upside of all three good options: OSS reach, simple checkout, no subscription friction.

---

## 2. Recommended model: **Open-core freemium, monetized with one-time Gumroad packs**

**Free (MIT, open source):** core HUD — HP/MP/EXP, recovery timer, burn rate, status,
Claude Code support, default theme. This is the growth flywheel.

**Paid (one-time, Gumroad):**
- **Pro — $12:** 5 premium themes, live ticking recovery countdown, WARNING pulse /
  CRITICAL blink + sound, priority support, lifetime updates.
- **Multi-Tool — $24:** everything in Pro + Cursor / Copilot / Windsurf adapters +
  streamer kit (transparent OBS source).
- **Team/site license — $99:** internal use up to 25 seats (studios, agencies, streamers' mods).

**Why one-time, not subscription:** the audience is subscription-fatigued (they already pay
$100–200/mo for the AI tools this monitors). A cheap one-time unlock converts far better and
generates goodwill. Recurring revenue comes later from *new packs*, not rent.

**Optional later:** GitHub Sponsors / "buy me a coffee" on the free tier (low but real),
and a Rainmeter-suite bundle.

---

## 3. Funnel assumptions

- **Top of funnel (Year 1 reach):** Show HN + Product Hunt + r/ClaudeAI + r/Rainmeter +
  10 X posts + word of mouth. Conservative: **40,000** unique landing-page visits in 12 months.
- **Free download conversion:** 18% of visits → **7,200 free installs**.
- **Free → paid conversion:** 4% of free installs buy a pack (open-core norms 2–6%).
- **Paid mix:** 70% Pro ($12), 25% Multi-Tool ($24), 5% Team ($99).
- **Gumroad fee:** ~10% all-in (fees + tax handling) → keep ~90%.

---

## 4. Revenue projection (12 months)

**Paid customers:** 7,200 × 4% = **288 buyers**

| Pack | Share | Buyers | Price | Gross |
|------|-------|--------|-------|-------|
| Pro | 70% | 202 | $12 | $2,424 |
| Multi-Tool | 25% | 72 | $24 | $1,728 |
| Team | 5% | 14 | $99 | $1,386 |
| **Total gross** | | **288** | | **$5,538** |
| Net after ~10% | | | | **≈ $4,984** |

**Plus sponsorships/donations (free tier):** ~0.5% of 7,200 free users at ~$3 avg/yr →
**~$110**. Round Year-1 net to **≈ $5,000–5,500**.

### Scenario range (Year 1 net)

| Scenario | Visits | Free conv. | Paid conv. | Net |
|----------|--------|-----------|-----------|-----|
| **Conservative** | 25,000 | 15% | 3% | **~$2,300** |
| **Base** | 40,000 | 18% | 4% | **~$5,000** |
| **Optimistic** (one post goes viral / a streamer adopts it) | 120,000 | 22% | 5% | **~$22,000** |

> Reality check: a single-dev side project. Base case ≈ a few thousand dollars in year one —
> meaningful pocket money and proof of pull, not a salary. The asset is the **audience and
> category ownership**, which compounds.

---

## 5. Year 2+ growth levers (how the curve bends up)

1. **New paid packs** (more themes, sound packs, seasonal skins) → repeat purchases from the
   installed base. Doubling the base to ~15k and adding a $9 theme pack at 8% attach ≈ +$10k.
2. **Multi-tool expansion** as Cursor/Copilot/Windsurf users adopt → widens the free funnel.
3. **Cross-platform (macOS/Linux)** unlocks the largest untapped slice of the market.
4. **B2B/streamer licenses** (Team tier) — higher ACV, low volume, high margin.
5. **Marketplace presence** (Gumroad discover, Rainmeter/DeviantArt featured, PH leaderboard).

**Illustrative Year 2 base:** ~15k free installs, 5% paid, richer pack mix + repeat buys →
**~$15,000–20,000 net**. Still side-project scale, now with a defensible brand.

---

## 6. Costs (deliberately near-zero)

- Hosting: **$0** (static landing page on GitHub Pages / Netlify free).
- Distribution: **$0** (Gumroad takes its cut only on sales).
- Infra: **$0** (no servers — the product is local).
- Time: the only real cost. Keep scope MVP-tight; let the community make themes.

**Gross margin ≈ 90%.** The model is designed so revenue is almost entirely profit.

---

## 7. Recommendation summary

Ship **open-core**: free MIT HUD as the growth engine, one-time Gumroad packs ($12 Pro /
$24 Multi-Tool / $99 Team) as monetization. **Avoid SaaS** — it contradicts the local-only
promise and adds cost. Target **~$5k net in year one** as the base case, with category
ownership and an engaged audience as the real prize that compounds into year two.
