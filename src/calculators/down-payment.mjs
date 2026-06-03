export default {
  slug: "down-payment-calculator",
  category: "borrowing",
  title: "Down Payment Calculator",
  metaTitle: "Down Payment Calculator – Cash Needed to Buy a Home",
  metaDescription:
    "Free down payment calculator. See your down payment, loan amount, and total cash needed at closing — plus whether you'll owe PMI. Instant, no sign-up.",
  keywords: [
    "down payment calculator",
    "home down payment",
    "cash to close calculator",
    "how much down payment",
  ],
  intro:
    "<p>Find out how much cash you need to buy a home. Enter the price and your down payment percentage to see the down payment, the loan amount, your estimated closing costs, and whether you'll need to pay PMI.</p>",
  inputs: [
    { id: "price", label: "Home price", type: "number", default: 400000, min: 0, step: 5000, prefix: "$" },
    { id: "downPct", label: "Down payment", type: "number", default: 10, min: 0, max: 100, step: 1, suffix: "%" },
    { id: "closingPct", label: "Closing costs", type: "number", default: 3, min: 0, max: 10, step: 0.5, suffix: "%", help: "Typically 2%–5% of the price for fees, taxes, and escrow." },
  ],
  compute: function (v, ctx) {
    var down = v.price * (v.downPct / 100);
    var loan = v.price - down;
    var closing = v.price * (v.closingPct / 100);
    var cash = down + closing;
    var needsPMI = v.downPct < 20;
    var toAvoidPMI = Math.max(0, v.price * 0.2 - down);
    return {
      summary: [
        { label: "Down payment", value: ctx.money(down), primary: true },
        { label: "Loan amount", value: ctx.money(loan) },
        { label: "Cash needed at closing", value: ctx.money(cash) },
      ],
      table: {
        columns: ["Item", "Amount"],
        rows: [
          ["Home price", ctx.money(v.price)],
          ["Down payment (" + ctx.num(v.downPct, 0) + "%)", ctx.money(down)],
          ["Estimated closing costs", ctx.money(closing)],
          ["Total cash to close", ctx.money(cash)],
          ["Mortgage loan amount", ctx.money(loan)],
        ],
      },
      note: needsPMI
        ? "With less than 20% down you'll likely pay PMI (private mortgage insurance). Putting down " +
          ctx.money(toAvoidPMI) +
          " more would reach 20% and avoid it."
        : "At 20% or more down, you typically avoid PMI — nice.",
    };
  },
  content: `
    <h2>How much should you put down?</h2>
    <p>The classic target is <strong>20%</strong>, because it lets you avoid private mortgage insurance (PMI) — an extra monthly cost that protects the lender, not you. But 20% isn't required: many loans allow 3%–5% down, and some government-backed loans even less. A smaller down payment gets you into a home sooner but means a bigger loan, a higher monthly payment, and usually PMI until you build 20% equity.</p>
    <h2>Don't forget closing costs</h2>
    <p>Beyond the down payment, you'll owe closing costs — lender fees, title, escrow, and prepaid taxes and insurance — usually 2%–5% of the price. This calculator adds them so the "cash to close" reflects what you actually need in the bank.</p>
    <h2>Tips</h2>
    <ul>
      <li><strong>Keep a cushion.</strong> Don't drain every dollar into the down payment; keep an emergency fund for the surprises that come with homeownership.</li>
      <li><strong>Weigh PMI vs. waiting.</strong> Sometimes buying sooner with PMI beats waiting years to save 20% while prices and rents rise. Run both scenarios.</li>
      <li><strong>Ask about PMI removal.</strong> You can usually request PMI cancellation once you reach 20% equity.</li>
    </ul>
  `,
  faq: [
    {
      q: "What is PMI and how much does it cost?",
      a: "Private mortgage insurance is typically required when you put down less than 20%. It commonly runs about 0.3%–1.5% of the loan amount per year, added to your monthly payment, until you reach 20% equity.",
    },
    {
      q: "Are closing costs always 2%–5%?",
      a: "That's the typical range, but it varies by location, lender, and loan type. Your lender must provide a Loan Estimate with itemized costs — use that for the precise figure.",
    },
    {
      q: "Can I get help with a down payment?",
      a: "Possibly. Many areas have down-payment assistance programs for first-time or income-qualified buyers, and gifts from family are often allowed. Check local housing-agency programs.",
    },
  ],
  related: ["mortgage-calculator", "savings-goal-calculator"],
  cta: { key: "mortgageRates", text: "Compare today's mortgage rates" },
};
