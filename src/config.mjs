// Global site configuration. Edit these once; the whole site updates.
export const site = {
  // Change to your real domain once you buy one. Used for canonical URLs + sitemap.
  // Currently set to the free GitHub Pages URL so the site is live immediately.
  url: "https://tzyll.github.io/finance-calc",
  // Path the site is served from. "" for a root domain (yourdomain.com),
  // "/finance-calc" for a GitHub Pages project site. Set to "" when you move to a custom domain.
  basePath: "/finance-calc",
  name: "Finance Calc",
  tagline: "Free, fast, no-signup financial calculators",
  description:
    "Free online financial calculators: compound interest, loan amortization, retirement savings, and more. Instant results, clear charts, no sign-up.",
  // Default currency + locale for formatting. Targeting US/English search traffic (highest ad CPM).
  locale: "en-US",
  currency: "USD",
  author: "Finance Calc",
  // Paste your AdSense publisher id here once approved, e.g. "ca-pub-XXXXXXXX".
  // Leave empty to render no ad slots.
  adsensePublisherId: "",
  // IndexNow key — lets us notify Bing/Yandex of new pages instantly (no account needed).
  indexNowKey: "19034deca041e6ec2394a7f2279ef15e",
};

// Affiliate links. Calculators show a contextual CTA button ONLY when the
// matching key here has a non-empty URL — so they stay hidden until you paste
// your affiliate links in. Unlike ad networks, affiliate programs need no
// approval and earn from the very first visitor.
//   - mortgageRates: rate-comparison / refinance affiliate (e.g. a lender marketplace)
//   - personalLoan:  personal-loan marketplace affiliate
//   - balanceTransfer: 0% balance-transfer credit card affiliate
//   - brokerage:     brokerage/robo-advisor signup affiliate (often pays a bounty per signup)
export const affiliateLinks = {
  mortgageRates: "",
  personalLoan: "",
  balanceTransfer: "",
  brokerage: "",
};

export const categories = {
  saving: { name: "Saving & Investing", order: 1 },
  borrowing: { name: "Loans & Debt", order: 2 },
  retirement: { name: "Retirement", order: 3 },
};
