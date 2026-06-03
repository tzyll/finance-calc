export default {
  slug: "401k-calculator",
  category: "retirement",
  title: "401(k) Calculator",
  metaTitle: "401(k) Calculator – Project Your Balance with Employer Match",
  metaDescription:
    "Free 401(k) calculator. Project your retirement balance from your salary, contribution rate, and employer match, with a year-by-year growth chart. No sign-up.",
  keywords: [
    "401k calculator",
    "401k growth calculator",
    "employer match calculator",
    "retirement 401k calculator",
  ],
  intro:
    "<p>See how big your 401(k) could grow by retirement. Enter your salary, how much you contribute, and your employer's match to project your balance — and see how much of it is free money from your employer.</p>",
  inputs: [
    { id: "currentAge", label: "Current age", type: "number", default: 30, min: 16, max: 90, step: 1, suffix: "yr" },
    { id: "retireAge", label: "Retirement age", type: "number", default: 65, min: 18, max: 95, step: 1, suffix: "yr" },
    { id: "salary", label: "Annual salary", type: "number", default: 70000, min: 0, step: 1000, prefix: "$" },
    { id: "contribPct", label: "Your contribution", type: "number", default: 6, min: 0, max: 100, step: 0.5, suffix: "%" },
    { id: "matchPct", label: "Employer match", type: "number", default: 50, min: 0, max: 200, step: 5, suffix: "%", help: "How much your employer adds per dollar you contribute (e.g. 50% = 50¢ per $1)." },
    { id: "matchLimit", label: "Match limit", type: "number", default: 6, min: 0, max: 100, step: 0.5, suffix: "%", help: "Employer matches only up to this share of your salary." },
    { id: "balance", label: "Current 401(k) balance", type: "number", default: 20000, min: 0, step: 1000, prefix: "$" },
    { id: "rate", label: "Annual return", type: "number", default: 7, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "raise", label: "Annual raise", type: "number", default: 2, min: 0, max: 50, step: 0.5, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var months = Math.max(0, Math.round((v.retireAge - v.currentAge) * 12));
    var r = v.rate / 100 / 12;
    var salary = v.salary;
    var balance = v.balance;
    var youTotal = 0,
      matchTotal = 0;
    var matchRate = (Math.min(v.contribPct, v.matchLimit) / 100) * (v.matchPct / 100);
    var balByYear = [balance];
    var labels = [String(v.currentAge)];
    for (var m = 1; m <= months; m++) {
      var monthlySalary = salary / 12;
      var you = monthlySalary * (v.contribPct / 100);
      var match = monthlySalary * matchRate;
      balance = balance * (1 + r) + you + match;
      youTotal += you;
      matchTotal += match;
      if (m % 12 === 0) {
        salary = salary * (1 + v.raise / 100);
        balByYear.push(balance);
        labels.push(String(v.currentAge + m / 12));
      }
    }
    var growth = balance - youTotal - matchTotal - v.balance;
    return {
      summary: [
        { label: "Balance at retirement", value: ctx.money(balance), primary: true },
        { label: "Your contributions", value: ctx.money(youTotal) },
        { label: "Employer match (free)", value: ctx.money(matchTotal) },
      ],
      table: {
        columns: ["Source", "Total"],
        rows: [
          ["Starting balance", ctx.money(v.balance)],
          ["Your contributions", ctx.money(youTotal)],
          ["Employer match", ctx.money(matchTotal)],
          ["Investment growth", ctx.money(growth)],
          ["Balance at retirement", ctx.money(balance)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Age",
        xLabels: labels,
        series: [{ name: "401(k) balance", color: "#059669", points: balByYear }],
      },
    };
  },
  content: `
    <h2>Always capture the full employer match</h2>
    <p>An employer match is the closest thing to free money in personal finance — an instant, guaranteed return on what you contribute. If your employer matches 50% up to 6% of salary and you contribute less than 6%, you're leaving part of that match on the table. The first rule of a 401(k) is to contribute at least enough to get the full match.</p>
    <h2>How the projection works</h2>
    <p>Each month the calculator adds your contribution and the employer match, then grows the whole balance at your assumed return. Your salary rises each year by the raise percentage, so your contributions grow too. The result is a nominal (pre-tax, pre-inflation) estimate.</p>
    <h2>Ways to grow your 401(k) faster</h2>
    <ul>
      <li><strong>Increase your contribution with each raise.</strong> Bumping your rate 1% a year is nearly painless and compounds enormously.</li>
      <li><strong>Mind the fees.</strong> Choose low-cost index funds where available; a 1% fee can cost you years of growth.</li>
      <li><strong>Don't cash out when changing jobs.</strong> Roll it over instead, so the balance keeps compounding.</li>
    </ul>
  `,
  faq: [
    {
      q: "What does '50% match up to 6%' mean?",
      a: "It means your employer adds 50 cents for every dollar you contribute, but only on the portion of your contributions up to 6% of your salary. Contribute 6% and you get the full match; contribute more and the extra isn't matched (but still grows tax-advantaged).",
    },
    {
      q: "Does this include contribution limits?",
      a: "No. The IRS caps annual 401(k) contributions, and the limit changes yearly. If your inputs imply contributing above the current limit, treat the projection as a rough ceiling.",
    },
    {
      q: "Is the balance shown before or after taxes?",
      a: "It's the pre-tax balance for a traditional 401(k). Withdrawals in retirement are taxed as income. A Roth 401(k) is funded with after-tax money and withdrawn tax-free, so the same balance is worth more to you.",
    },
  ],
  related: ["retirement-savings-calculator", "compound-interest-calculator"],
  cta: { key: "brokerage", text: "Open a retirement account" },
};
