# Finance Calc — programmatic finance-calculator site

A zero-dependency static site of high-quality financial calculators. Built to rank
in search, monetize with display ads (high CPM in personal finance) + affiliate
links, and require almost no maintenance.

- **No frameworks, no dependencies.** Just Node's standard library for the build.
  Nothing to upgrade, nothing to rot.
- **Every page is static HTML.** Deploys free on Cloudflare Pages, Netlify, Vercel,
  or GitHub Pages. Loads instantly, which Google rewards.
- **Calculators run client-side** in vanilla JS, with live results, an SVG chart,
  and a year-by-year breakdown.
- **SEO built in:** per-page title/description, canonical URLs, Open Graph,
  JSON-LD (`WebApplication` + `FAQPage` + `BreadcrumbList`), `sitemap.xml`,
  `robots.txt`.

## Commands

```bash
npm run build     # generate the static site into dist/
npm run serve     # build, then preview at http://localhost:4321
```

## Project layout

```
src/
  config.mjs              # site name, URL, currency, AdSense id — edit these
  calculators/
    index.mjs             # registry: which calculators exist + their order
    *.mjs                 # one self-contained calculator each
  assets/
    styles.css            # all styling
    calc-engine.js        # generic client engine (form -> compute -> chart -> table)
build.mjs                 # the static site generator
serve.mjs                 # tiny local preview server
dist/                     # build output (git-ignored) — this is what you deploy
```

## Add a new calculator (≈5 minutes, the growth engine)

More good pages = more search traffic = more revenue. To add one:

1. Copy any file in `src/calculators/` (e.g. `loan.mjs`) to a new file.
2. Change `slug`, `title`, `metaDescription`, `inputs`, `compute`, `content`, `faq`.
   - `compute(values, ctx)` MUST be a pure function — it is serialized and run in the
     browser, so it can only use its arguments. `ctx.money / ctx.num / ctx.pct` format
     numbers.
3. Register it in `src/calculators/index.mjs`.
4. `npm run build`. Done — new page, sitemap entry, and internal links are automatic.

## How this actually makes money (the 3 human steps only you can do)

The site is ready. Turning it into income needs three things I can't do for you:

1. **Buy a domain (~$10/yr)** — e.g. on Cloudflare or Namecheap. Then set
   `site.url` in `src/config.mjs` to your domain and rebuild.
2. **Deploy it (free).** Easiest path: create a Cloudflare Pages / Netlify project
   and drag-drop the `dist/` folder, or connect a git repo with build command
   `npm run build` and output dir `dist`.
3. **Apply for an ad network once it has content + a little traffic.**
   - Google AdSense is the default. After approval, paste your publisher id
     (`ca-pub-…`) into `adsensePublisherId` in `src/config.mjs` and rebuild — ad
     slots and the script wire up automatically.
   - Ezoic / Mediavine / Raptive pay more but need traffic thresholds first.
   - Add affiliate links (brokerages, refinance, credit cards) inside calculator
     `content` for higher revenue per visit.

Realistic timeline: SEO traffic builds over weeks to a few months. The compounding
part is that every page you publish keeps working forever with no upkeep.

## Disclaimer

The calculators provide general educational estimates, not financial advice. The
footer disclaimer says so on every page.
