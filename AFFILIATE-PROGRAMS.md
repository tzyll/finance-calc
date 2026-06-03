# Affiliate programs to join — concrete, vetted shortlist

This removes the research step. Below is what to apply to for each affiliate slot
already wired into the site (`affiliateLinks` in `src/config.mjs`), with typical
payouts and the fastest path. Payouts are approximate and set by each advertiser —
confirm current terms when you apply.

## Fastest path: join ONE network first

Most finance advertisers are reachable through a single affiliate **network**, so
one signup unlocks many. Recommended, in order:

1. **FlexOffers** (flexoffers.com) — free signup, approval usually 24–48h. Strong in
   finance; many advertisers auto-approve. Best single starting point.
2. **Impact** (impact.com) — needed for some big names like **Robinhood**.
3. **CJ Affiliate** (cj.com) — carries banks like Ally, Barclays, USAA.

Apply to FlexOffers today; while it's pending, you can also start a direct
application to any program below.

## What to join per slot

| Config key (slot) | Apply to (real programs) | Typical payout |
|---|---|---|
| `brokerage` (compound, retirement, 401k, rule-of-72) | **Robinhood** (via Impact), **Webull**, **Acorns** | Webull ~$50–75/funded account; Acorns ~$15–25/signup; Robinhood per qualified user |
| `mortgageRates` (mortgage, down-payment) | **LendingTree** | up to ~$85 per qualified mortgage lead (highest-value finance leads) |
| `personalLoan` (loan) | **LendingTree** / personal-loan marketplaces | ~$200–350 per approved/qualified lead (US traffic) |
| `autoLoan` (auto-loan) | Auto-refinance offers on **LendingTree** / network | varies by lead |
| `balanceTransfer` (credit-card-payoff) | **NerdWallet** (cards), **Credit Karma** | NerdWallet up to ~$100 per approved card; Credit Karma ~$7/signup |

Other strong finance options seen across the networks: **Empower** (~$100/qualified
lead), **CIT Bank** (~$125/sale), **BBVA** (~$85/lead).

## Then: paste links and deploy (5 min)

1. In each approved program, generate your tracking link.
2. Open `src/config.mjs`, paste into `affiliateLinks`:
   ```js
   export const affiliateLinks = {
     mortgageRates: "https://your-lendingtree-link...",
     personalLoan: "https://your-personal-loan-link...",
     autoLoan: "",
     balanceTransfer: "https://your-nerdwallet-link...",
     brokerage: "https://your-webull-or-robinhood-link...",
   };
   ```
3. `git add -A && git commit -m "Add affiliate links" && git push` → auto-deploys in
   ~1 min, CTA buttons go live.

## Honest notes

- **Approval isn't guaranteed.** Networks and lenders sometimes want a site with some
  traffic/history first. If a program declines now, the site keeps growing — reapply
  later. FlexOffers and the brokerage signup-bounty programs (Webull/Acorns) tend to
  be the most beginner-friendly.
- **Disclosure is already handled.** The site's Privacy Policy and an `rel="sponsored"`
  on every CTA cover affiliate-disclosure requirements.
- Payouts above come from 2026 affiliate roundups (sources in the chat) and will drift;
  treat them as ballpark.
