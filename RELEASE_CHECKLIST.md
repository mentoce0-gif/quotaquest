# RELEASE_CHECKLIST.md — shipping QuotaQuest v0.1.0

## Pre-flight (done in this build)
- [x] All 8 product phases complete (research → monetization)
- [x] Monitor runs; 6/6 unit tests pass; `state.json` schema-validated
- [x] Real `~/.claude` JSONL parse verified (Mode B)
- [x] README with screenshots (NORMAL/WARNING/CRITICAL)
- [x] Landing page self-contained + well-formed
- [x] Marketing copy (X×10, Reddit×3, Product Hunt, Hacker News)
- [x] LICENSE (MIT), CHANGELOG, CONTRIBUTING, issue/PR templates, .gitignore
- [x] Distribution zip built

## Needs a human on Windows (can't be done in this build env)
- [ ] Run `docs/RENDER_TEST.md` — confirm the Rainmeter skin renders + bars update live
- [ ] Capture a real desktop screenshot → replace generated mockups in `assets/`

## Publish to GitHub
- [ ] `git init` done (initial commit created in this build) — set your remote:
      `git remote add origin https://github.com/ mentoce0-gif/quotaquest.git`
- [ ] `git push -u origin main`
- [ ] Set repo **Description** + **Topics** from `GITHUB_METADATA.md`
- [ ] Upload `assets/gallery.png` as the Social preview (Settings → Social preview)
- [ ] Enable GitHub Pages (Settings → Pages → main /root) for the landing page
- [ ] Create Release **v0.1.0**, paste CHANGELOG notes, attach the dist zip
- [ ] Open the 4 "good first issue" tickets from `GITHUB_METADATA.md`

## Go-to-market (launch day)
- [ ] Post Show HN (`marketing/hacker-news.md`)
- [ ] Post r/ClaudeAI + r/Rainmeter + r/SideProject (`marketing/reddit-posts.md`)
- [ ] Schedule X thread (`marketing/x-posts.md`) — pin post #1
- [ ] Submit to Product Hunt (`marketing/product-hunt.md`) — schedule 12:01 PT
- [ ] Set up Gumroad products: Pro $12, Multi-Tool $24, Team $99 (see `docs/MONETIZATION.md`)

## Post-launch
- [ ] Respond to every HN/Reddit comment in the first 4 hours
- [ ] Watch for log-format / cap-calibration issues; ship a patch if needed
- [ ] Tally first-week installs vs. the projection in `docs/MONETIZATION.md`
