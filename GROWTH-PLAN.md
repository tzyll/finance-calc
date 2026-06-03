# 90-Day Growth Plan — from "built" to "earning"

The site is complete: 20 calculators, 6 guides, legal pages, live at
**https://tzyll.github.io/finance-calc/**, auto-deploying, indexed on Bing/Yandex.
What's missing for real income is **traffic** and **activated monetization** — and
most of that is execution only you can do. This is the concrete plan. None of it
needs more than a few hours total across three months.

Honest framing up front: a brand-new site earns little for the first weeks while
Google learns to trust it. Realistic path is **$0 for ~4–8 weeks, then a slow ramp**
as pages start ranking. Anyone promising faster is lying. The upside is it compounds
and needs almost no upkeep.

---

## Phase 0 — Activate (one sitting, ~30 min). Do this first.

1. **Google Search Console** (the single biggest traffic accelerator you control):
   - Go to https://search.google.com/search-console → add property
     `https://tzyll.github.io/finance-calc/`.
   - Verify via the "HTML file" or "HTML tag" method. (If it gives you an HTML file
     to upload, drop it in `src/assets/` and push — I can wire it in for you; just
     paste me the filename/token.)
   - Submit the sitemap: `sitemap.xml`. This tells Google to crawl all 33 URLs now.
2. **Affiliate signup** (earns from visitor #1, no approval wait on some):
   - Open `AFFILIATE-PROGRAMS.md`. Apply to **FlexOffers** (covers many) and one
     beginner-friendly bounty program (Webull/Acorns).
   - Paste the tracking links into `affiliateLinks` in `src/config.mjs`, then
     `git add -A && git commit -m "affiliate links" && git push`. CTAs go live.
3. **Set a contact email** in `src/config.mjs` (`contactEmail`) — needed later for
   AdSense.

That's the whole "ignition." Everything below is about adding fuel (traffic).

---

## Phase 1 — First traffic (weeks 1–4, ~1–2 hrs total)

Google won't send much yet; seed traffic from places you can act on directly:

- **Get a few legitimate backlinks** (these also help Google trust the site):
  - List it on free tool directories: AlternativeTo, SaaSHub, "free online
    calculators" directory sites, and relevant subreddit wikis. (Search
    "submit free online tool directory".)
  - If you have any blog, profile, or social bio, link to the site there.
- **Answer real questions** where a calculator genuinely helps — e.g. a Reddit
  comment in r/personalfinance answering "how long to pay off X" that links the
  payoff calculator. Be helpful, not spammy; one genuinely useful link beats fifty
  drive-by posts (which get removed and can hurt you).
- **Bing Webmaster Tools** (https://www.bing.com/webmasters): add the site + sitemap.
  Bing traffic is smaller but easier to win early.

## Phase 2 — Grow (months 1–3)

- **Content cadence:** this is *my* job — I'll keep shipping high-search-volume
  calculators and guides. More indexed pages = more entry points. Tell me to keep
  going and I will.
- **Watch Search Console weekly (5 min):** see which queries/pages get impressions.
  Whatever shows early promise, tell me and I'll deepen that topic (more related
  calculators + a guide cluster around it). This is how small sites compound — double
  down on what's working.
- **Internal linking is already done** (every guide links calculators and vice
  versa); new content keeps strengthening it.

## Phase 3 — Monetize harder (month 3+, once traffic is real)

- **Apply for AdSense** (https://adsense.google.com) once you have steady visitors;
  paste `ca-pub-…` into `adsensePublisherId` and push. Legal pages are already in
  place, so approval odds are good.
- **Add more affiliates** to fill the remaining `affiliateLinks` slots.
- **Consider a custom domain** (~$10/yr): better trust and branding. Point it at
  GitHub Pages, set `url` + `basePath:""` in config, push. (I'll handle the config.)
- **Higher-paying ad networks** (Ezoic, then Mediavine/Raptive) once you cross their
  traffic thresholds — they pay multiples of AdSense.

---

## Realistic expectations

| Timeframe | What to expect |
|---|---|
| Weeks 1–4 | Near-zero Google traffic; indexing + first directory/referral clicks. |
| Months 2–3 | Long-tail pages start ranking; first affiliate clicks; first small dollars. |
| Months 4–12 | Compounding traffic as authority builds; AdSense + affiliate add up. |
| Year 2+ | The evergreen pages keep working with almost no upkeep — the snowball. |

This is a real business model, not a get-rich-quick scheme. It rewards patience and
consistent content — the consistent-content part is the lever I can pull for you
indefinitely.

## Division of labor

- **You (a few hours total, mostly Phase 0–1):** Search Console, affiliate signup,
  a handful of backlinks, weekly 5-min check of what's ranking.
- **Me (ongoing, no time from you):** keep producing calculators + guides, deepen
  whatever starts ranking, handle all config/deploy.

The machine is built and running. Phase 0 is the ignition — when you have 30 minutes,
start there.
