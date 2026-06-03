export default {
  slug: "retirement-savings-calculator",
  category: "retirement",
  title: "Retirement Savings Calculator",
  metaTitle: "Retirement Savings Calculator – Project Your Nest Egg",
  metaDescription:
    "Free retirement calculator. Project how much your savings will grow by retirement based on your age, current savings, monthly contributions, and expected return.",
  keywords: [
    "retirement calculator",
    "retirement savings calculator",
    "401k calculator",
    "nest egg calculator",
  ],
  intro:
    "<p>Estimate the size of your retirement nest egg. Enter your age, what you've saved so far, how much you add each month, and an expected return to see your projected balance at retirement — with a growth chart and breakdown.</p>",
  inputs: [
    { id: "currentAge", label: "Current age", type: "number", default: 30, min: 16, max: 90, step: 1, suffix: "yr" },
    { id: "retireAge", label: "Retirement age", type: "number", default: 65, min: 18, max: 95, step: 1, suffix: "yr" },
    { id: "current", label: "Current savings", type: "number", default: 25000, min: 0, step: 1000, prefix: "$" },
    { id: "monthly", label: "Monthly contribution", type: "number", default: 800, min: 0, step: 50, prefix: "$" },
    { id: "rate", label: "Expected annual return", type: "number", default: 6, min: 0, max: 100, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var years = Math.max(0, Math.round(v.retireAge - v.currentAge));
    var monthlyRate = v.rate / 100 / 12;
    var months = years * 12;
    var balance = v.current;
    var totalContrib = v.current;
    var balByYear = [v.current];
    var contribByYear = [v.current];
    var rows = [];
    for (var m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) + v.monthly;
      totalContrib += v.monthly;
      if (m % 12 === 0) {
        balByYear.push(balance);
        contribByYear.push(totalContrib);
        rows.push([
          "Age " + (v.currentAge + m / 12),
          ctx.money(totalContrib),
          ctx.money(balance - totalContrib),
          ctx.money(balance),
        ]);
      }
    }
    var growth = balance - totalContrib;
    var xLabels = [String(v.currentAge)];
    for (var y = 1; y <= years; y++) xLabels.push(String(v.currentAge + y));
    return {
      summary: [
        { label: "Balance at retirement", value: ctx.money(balance), primary: true },
        { label: "Total contributions", value: ctx.money(totalContrib) },
        { label: "Investment growth", value: ctx.money(growth) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Age",
        xLabels: xLabels,
        series: [
          { name: "Balance", color: "#059669", points: balByYear },
          { name: "Contributions", color: "#94a3b8", points: contribByYear },
        ],
      },
      table: {
        columns: ["", "Contributions", "Growth", "Balance"],
        rows: rows,
      },
      note:
        years <= 0
          ? "Retirement age should be greater than your current age."
          : "",
    };
  },
  content: `
    <h2>How much will you need to retire?</h2>
    <p>A common rule of thumb is the <strong>4% rule</strong>: you can withdraw about 4% of your nest egg in your first year of retirement and adjust for inflation thereafter, with a high chance the money lasts 30 years. That implies you need roughly <strong>25× your annual spending</strong> saved. For example, $40,000/year of spending suggests a target around $1,000,000.</p>
    <h2>Levers that move the number most</h2>
    <ul>
      <li><strong>Contribution rate.</strong> Increasing your monthly contribution has an immediate, predictable effect — and any employer 401(k) match is an instant return.</li>
      <li><strong>Years invested.</strong> Starting even five years earlier can dramatically raise the final balance thanks to compounding.</li>
      <li><strong>Fees and asset mix.</strong> Lower-cost, appropriately diversified investments keep more of the return working for you.</li>
    </ul>
  `,
  faq: [
    {
      q: "What return should I assume for retirement planning?",
      a: "Many planners use 5–7% for a stock-heavy portfolio in nominal terms, or lower as you shift toward bonds near retirement. Using a conservative number gives you a margin of safety.",
    },
    {
      q: "Does this include Social Security or a pension?",
      a: "No. It projects only the savings you contribute. Any Social Security, pension, or other income would be on top of the balance shown here.",
    },
    {
      q: "Should I use today's dollars or future dollars?",
      a: "The projection is in nominal (future) dollars. To think in today's purchasing power, lower the expected return by your inflation assumption — for instance use 3–4% instead of 6%.",
    },
  ],
  related: ["compound-interest-calculator", "loan-calculator"],
};
