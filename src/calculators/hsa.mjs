export default {
  slug: "hsa-calculator",
  category: "saving",
  title: "HSA Calculator",
  metaTitle: "HSA Calculator – Health Savings Account Growth & Tax Savings",
  metaDescription:
    "Free HSA calculator. Project your Health Savings Account balance over time and the tax you save with its triple tax advantage. Instant, no sign-up.",
  keywords: [
    "hsa calculator",
    "health savings account calculator",
    "hsa growth calculator",
    "hsa retirement calculator",
  ],
  intro:
    "<p>A Health Savings Account (HSA) has a rare triple tax advantage: contributions are tax-deductible, growth is tax-free, and withdrawals for medical costs are tax-free too. If you invest it, an HSA can become a powerful retirement account. Enter your numbers to project the balance and tax savings.</p>",
  inputs: [
    { id: "balance", label: "Current HSA balance", type: "number", default: 2000, min: 0, step: 500, prefix: "$" },
    { id: "annual", label: "Annual contribution", type: "number", default: 4000, min: 0, step: 250, prefix: "$" },
    { id: "years", label: "Years invested", type: "number", default: 20, min: 1, max: 60, step: 1, suffix: "yr" },
    { id: "rate", label: "Annual return", type: "number", default: 6, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "taxRate", label: "Your marginal tax rate", type: "number", default: 24, min: 0, max: 60, step: 1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var r = v.rate / 100 / 12;
    var n = Math.round(v.years * 12);
    var monthly = v.annual / 12;
    var bal = v.balance;
    var contrib = v.balance;
    var balByYear = [bal];
    for (var m = 1; m <= n; m++) {
      bal = bal * (1 + r) + monthly;
      contrib += monthly;
      if (m % 12 === 0) balByYear.push(bal);
    }
    var newContribs = contrib - v.balance;
    var taxSaved = newContribs * (v.taxRate / 100);
    var growth = bal - contrib;
    var labels = ["0"];
    for (var y = 1; y < balByYear.length; y++) labels.push(String(y));
    return {
      summary: [
        { label: "Balance after " + v.years + " yr", value: ctx.money(bal), primary: true },
        { label: "Total contributions", value: ctx.money(contrib) },
        { label: "Tax saved on contributions", value: ctx.money(taxSaved) },
      ],
      table: {
        columns: ["", "Amount"],
        rows: [
          ["Total contributions", ctx.money(contrib)],
          ["Tax-free growth", ctx.money(growth)],
          ["Balance after " + v.years + " years", ctx.money(bal)],
          ["Upfront tax savings (deductions)", ctx.money(taxSaved)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "HSA balance", color: "#0891b2", points: balByYear }],
      },
      note:
        "If you pay current medical costs out of pocket and let the HSA grow invested, that balance becomes tax-free money for healthcare — and after age 65 it works like a traditional IRA for any purpose.",
    };
  },
  content: `
    <h2>The triple tax advantage</h2>
    <p>An HSA is the only account that's tax-advantaged on all three fronts:</p>
    <ul>
      <li><strong>Going in:</strong> contributions are tax-deductible (and avoid payroll tax if made through your employer), lowering your taxable income today.</li>
      <li><strong>Growing:</strong> investment gains are never taxed.</li>
      <li><strong>Coming out:</strong> withdrawals for qualified medical expenses are tax-free — at any age.</li>
    </ul>
    <p>No other account gives you all three. That's why many savers treat the HSA as a stealth retirement account.</p>
    <h2>The HSA-as-retirement strategy</h2>
    <p>If you can afford to pay current medical bills from regular cash, you can leave the HSA invested to grow for decades. Save your medical receipts and you can reimburse yourself tax-free anytime in the future. After age 65, you can also withdraw HSA funds for <em>any</em> purpose and just pay ordinary income tax — exactly like a traditional IRA — so it's never wasted.</p>
    <h2>Things to know</h2>
    <ul>
      <li>You need a qualifying high-deductible health plan (HDHP) to contribute.</li>
      <li>Annual contribution limits apply and change yearly; this projection doesn't enforce them.</li>
      <li>Many HSAs let you invest the balance once it passes a minimum — investing (rather than leaving it as cash) is what unlocks long-term growth.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is an HSA better than a 401(k) or IRA?",
      a: "For eligible savers, the HSA's triple tax advantage can make it the single most tax-efficient account. A common priority: capture your 401(k) match first, then max the HSA, then return to other retirement accounts.",
    },
    {
      q: "What if I don't have medical expenses?",
      a: "The money isn't lost. Qualified medical withdrawals are always tax-free, and after age 65 you can withdraw for any reason paying only ordinary income tax — just like a traditional IRA.",
    },
    {
      q: "Do I have to invest my HSA?",
      a: "No, but leaving it as cash means it barely grows. To get the retirement-account benefit shown here, invest the balance once your provider allows it, similar to a 401(k) or IRA.",
    },
  ],
  related: ["roth-ira-calculator", "401k-calculator", "retirement-savings-calculator"],
  cta: { key: "brokerage", text: "Open an investment account" },
};
