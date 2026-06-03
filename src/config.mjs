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
};

export const categories = {
  saving: { name: "Saving & Investing", order: 1 },
  borrowing: { name: "Loans & Debt", order: 2 },
  retirement: { name: "Retirement", order: 3 },
};
