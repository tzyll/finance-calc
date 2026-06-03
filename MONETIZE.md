# Turn on the money — your ~15-minute activation guide

The site is live, indexed, and built to monetize two ways. Everything technical is
done. This file is the short, copy-paste path to flip the revenue switch. You don't
need to touch code beyond pasting links into one file (`src/config.mjs`) and running
two commands.

## The two revenue channels

| Channel | Approval needed? | Earns from | Best for |
|---|---|---|---|
| **Affiliate links** | No (instant) | The first visitor who clicks + converts | Fastest first dollar |
| **Display ads (AdSense)** | Yes (days, needs traffic) | Every page view | Passive, scales with traffic |

Start with **affiliate** — it needs no approval and earns from visitor #1.

---

## Path A — Affiliate (do this first, ~15 min)

Each calculator already has a contextual call-to-action button wired up. It stays
**hidden** until you paste a link. The four slots, and what to sign up for:

| Config key | Goes on | Sign up for (search these) |
|---|---|---|
| `mortgageRates` | Mortgage calculator | "mortgage rate marketplace affiliate program" (e.g. a lender-comparison network) |
| `personalLoan` | Loan calculator | "personal loan marketplace affiliate" |
| `autoLoan` | Auto loan calculator | "auto loan / auto refinance affiliate" |
| `balanceTransfer` | Credit card payoff | "balance transfer credit card affiliate" or a card-comparison network |
| `brokerage` | Compound interest, retirement, rule of 72 | "brokerage / robo-advisor referral or affiliate program" — these often pay a flat bounty per signup |

The easiest on-ramp is a single affiliate **network** that covers many finance
advertisers at once (search "finance affiliate network"), so one signup fills
several slots. Apply, grab your tracking links, then:

1. Open `src/config.mjs`, find the `affiliateLinks` block, and paste each link:
   ```js
   export const affiliateLinks = {
     mortgageRates: "https://your-affiliate-link...",
     personalLoan: "",
     autoLoan: "",
     balanceTransfer: "https://your-affiliate-link...",
     brokerage: "https://your-affiliate-link...",
   };
   ```
   (Leave any you don't have yet as `""` — that button just stays hidden.)
2. Deploy:
   ```bash
   git add -A && git commit -m "Add affiliate links" && git push
   ```
   GitHub Actions rebuilds and redeploys automatically (~1 min). The CTA buttons go
   live. Done — every visitor now has a way to convert.

---

## Path B — Display ads (AdSense), once you have a little traffic

1. Apply at https://adsense.google.com with the live site URL.
2. After approval, open `src/config.mjs` and set:
   ```js
   adsensePublisherId: "ca-pub-XXXXXXXXXXXXXXXX",
   ```
3. `git add -A && git commit -m "Enable AdSense" && git push`. Ad slots wire up
   automatically. (Later, higher-paying networks like Ezoic/Mediavine need traffic
   thresholds first.)

---

## Faster Google indexing (2 min, optional but worth it)

Bing/Yandex are already being notified automatically (IndexNow). For Google:

1. Go to https://search.google.com/search-console and add the property
   `https://tzyll.github.io/finance-calc/`.
2. Submit the sitemap: `https://tzyll.github.io/finance-calc/sitemap.xml`.
   This gets your pages crawled in days instead of weeks.

---

## When you buy a custom domain (optional, better trust + branding)

1. Point the domain at GitHub Pages (add a `CNAME` file or set it in repo Settings →
   Pages).
2. In `src/config.mjs`: set `url` to your domain and `basePath` to `""`.
3. Commit + push. Re-run `node notify-indexnow.mjs` after it's live.

---

## The honest expectation

Affiliate buttons can convert from day one, but only if there are visitors — and
search traffic builds over **weeks to months**. There is no button that makes a
brand-new site earn today; anyone who says otherwise is selling something. The
realistic plan: turn on affiliate now (so nothing is left on the table), keep
publishing guides + calculators to grow traffic, and let it compound.
