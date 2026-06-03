export default {
  slug: "home-affordability-calculator",
  category: "borrowing",
  title: "Home Affordability Calculator",
  metaTitle: "Home Affordability Calculator – How Much House Can I Afford?",
  metaDescription:
    "Free home affordability calculator. See the maximum home price you can afford based on your income, debts, and down payment using the 28/36 rule. No sign-up.",
  keywords: [
    "home affordability calculator",
    "how much house can i afford",
    "house affordability calculator",
    "mortgage affordability calculator",
  ],
  intro:
    "<p>Find out how much house you can afford based on what you earn — not just what a lender might approve. This uses the 28/36 rule (housing under 28% of income, total debt under 36%) to estimate your maximum home price.</p>",
  inputs: [
    { id: "income", label: "Gross annual income", type: "number", default: 90000, min: 0, step: 1000, prefix: "$" },
    { id: "debts", label: "Monthly debt payments", type: "number", default: 500, min: 0, step: 50, prefix: "$" },
    { id: "down", label: "Down payment", type: "number", default: 50000, min: 0, step: 1000, prefix: "$" },
    { id: "rate", label: "Mortgage rate", type: "number", default: 6.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "term", label: "Loan term", type: "number", default: 30, min: 1, max: 40, step: 1, suffix: "yr" },
  ],
  compute: function (v, ctx) {
    var monthlyIncome = v.income / 12;
    var maxFront = 0.28 * monthlyIncome;
    var maxBack = 0.36 * monthlyIncome - v.debts;
    var maxPayment = Math.max(0, Math.min(maxFront, maxBack));
    var r = v.rate / 100 / 12;
    var n = Math.round(v.term * 12);
    var taxInsRate = 0.014; // ~1.1% tax + ~0.3% insurance per year of home value

    function piti(price) {
      var loan = Math.max(0, price - v.down);
      var pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
      return pi + (price * taxInsRate) / 12;
    }
    var lo = v.down, hi = v.down + 5000000;
    for (var i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      if (piti(mid) <= maxPayment) lo = mid;
      else hi = mid;
    }
    var maxPrice = lo;
    var loan = Math.max(0, maxPrice - v.down);
    var pi = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    var taxIns = (maxPrice * taxInsRate) / 12;
    var binding = maxBack < maxFront ? "your existing debts (back-end 36% limit)" : "the 28% housing guideline";

    return {
      summary: [
        { label: "Home price you can afford", value: ctx.money(maxPrice), primary: true },
        { label: "Max monthly payment", value: ctx.money(maxPayment) },
        { label: "Loan amount", value: ctx.money(loan) },
      ],
      table: {
        columns: ["Item", "Amount"],
        rows: [
          ["Gross monthly income", ctx.money(monthlyIncome)],
          ["Max total housing payment (PITI)", ctx.money(maxPayment)],
          ["— Principal & interest", ctx.money(pi)],
          ["— Est. taxes & insurance", ctx.money(taxIns)],
          ["Down payment", ctx.money(v.down)],
          ["Mortgage loan amount", ctx.money(loan)],
          ["Max home price", ctx.money(maxPrice)],
        ],
      },
      note:
        maxPayment <= 0
          ? "Your existing monthly debts already use up the lender guideline — paying some down would free up home budget."
          : "Your budget is limited by " + binding + ". This is a guideline, not a pre-approval — lenders also weigh credit, savings, and job history.",
    };
  },
  content: `
    <h2>The 28/36 rule</h2>
    <p>Lenders gauge affordability with two limits: your housing payment should stay under about <strong>28%</strong> of gross monthly income (the front-end ratio), and your <em>total</em> debt payments — housing plus car, student, and card minimums — under about <strong>36%</strong> (the back-end ratio). This calculator finds the highest home price that keeps you within both, using your down payment, rate, and an estimate for property taxes and insurance.</p>
    <h2>Approved amount vs. comfortable amount</h2>
    <p>A lender may approve you for more than this — sometimes up to a 43%+ back-end ratio. But buying at the very top of approval leaves little room for savings, emergencies, and the real costs of owning (maintenance, higher utilities). Many buyers deliberately aim below their max.</p>
    <h2>Levers that raise what you can afford</h2>
    <ul>
      <li><strong>Pay down other debt</strong> — every $100/month of debt cleared frees roughly the same amount for a mortgage payment.</li>
      <li><strong>Larger down payment</strong> — shrinks the loan and can remove PMI.</li>
      <li><strong>Lower rate</strong> — even a small rate drop meaningfully raises your buying power.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is this how much a lender will approve?",
      a: "It's a sensible guideline based on the 28/36 rule, which is close to how lenders think — but actual approval also depends on your credit score, savings, employment, and the specific loan program. Treat this as an estimate to shop with, then get pre-approved for a real number.",
    },
    {
      q: "Does it include property taxes and insurance?",
      a: "Yes — it reserves roughly 1.4% of the home's value per year for taxes and insurance inside the payment. Your local rates may differ, so adjust your expectations if your area is higher or lower.",
    },
    {
      q: "Should I borrow the maximum?",
      a: "Usually not. Buying below your maximum leaves breathing room for saving, emergencies, and the ongoing costs of homeownership. The most a lender allows isn't necessarily the most you should spend.",
    },
  ],
  related: ["mortgage-calculator", "down-payment-calculator", "debt-to-income-ratio-calculator"],
  cta: { key: "mortgageRates", text: "Compare today's mortgage rates" },
};
