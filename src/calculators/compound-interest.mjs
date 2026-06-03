export default {
  slug: "compound-interest-calculator",
  category: "saving",
  title: "Compound Interest Calculator",
  metaTitle: "Compound Interest Calculator – Free, Instant Results",
  metaDescription:
    "Free compound interest calculator with monthly contributions. See how your savings grow over time with a clear chart and year-by-year breakdown. No sign-up.",
  keywords: [
    "compound interest calculator",
    "investment growth calculator",
    "savings calculator",
    "interest compounded monthly",
  ],
  intro:
    "<p>See exactly how your money grows when interest compounds. Enter a starting amount, an optional monthly contribution, an expected return, and a time horizon — get an instant projection with a chart and a year-by-year table.</p>",
  inputs: [
    { id: "principal", label: "Starting amount", type: "number", default: 10000, min: 0, step: 100, prefix: "$" },
    { id: "monthly", label: "Monthly contribution", type: "number", default: 500, min: 0, step: 50, prefix: "$" },
    { id: "rate", label: "Annual return", type: "number", default: 7, min: 0, max: 100, step: 0.1, suffix: "%", help: "Long-run stock market average is ~7% after inflation." },
    { id: "years", label: "Years to grow", type: "number", default: 25, min: 1, max: 80, step: 1, suffix: "yr" },
  ],
  compute: function (v, ctx) {
    var monthlyRate = v.rate / 100 / 12;
    var months = Math.round(v.years * 12);
    var balance = v.principal;
    var totalContrib = v.principal;
    var balanceByYear = [v.principal];
    var contribByYear = [v.principal];
    var rows = [];
    for (var m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) + v.monthly;
      totalContrib += v.monthly;
      if (m % 12 === 0) {
        var yr = m / 12;
        balanceByYear.push(balance);
        contribByYear.push(totalContrib);
        rows.push([
          "Year " + yr,
          ctx.money(totalContrib),
          ctx.money(balance - totalContrib),
          ctx.money(balance),
        ]);
      }
    }
    var interest = balance - totalContrib;
    var xLabels = ["0"];
    for (var y = 1; y <= v.years; y++) xLabels.push(String(y));
    return {
      summary: [
        { label: "Future balance", value: ctx.money(balance), primary: true },
        { label: "Total contributions", value: ctx.money(totalContrib) },
        { label: "Total interest earned", value: ctx.money(interest) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [
          { name: "Balance", color: "#2563eb", points: balanceByYear },
          { name: "Contributions", color: "#94a3b8", points: contribByYear },
        ],
      },
      table: {
        columns: ["", "Contributions", "Interest", "Balance"],
        rows: rows,
      },
    };
  },
  content: `
    <h2>How compound interest works</h2>
    <p>Compound interest means you earn returns not only on your original deposit but also on the returns you have already earned. Over long periods this snowball effect dominates: the interest you earn in later years can dwarf everything you contributed.</p>
    <p>This calculator compounds monthly and assumes contributions are added at the end of each month. The formula for a single lump sum is:</p>
    <p><code>A = P × (1 + r/n)^(n·t)</code></p>
    <p>where <code>P</code> is the principal, <code>r</code> is the annual rate, <code>n</code> is the number of times interest compounds per year, and <code>t</code> is the number of years. When you also add regular contributions, each contribution compounds for the remaining time — which is what the year-by-year table above shows.</p>
    <h2>Tips to get the most from compounding</h2>
    <ul>
      <li><strong>Start early.</strong> Time is the most powerful input here — a decade head start can outweigh a much larger monthly contribution.</li>
      <li><strong>Automate contributions.</strong> Consistent monthly investing smooths out market timing and keeps the snowball rolling.</li>
      <li><strong>Mind fees.</strong> A 1% annual fee can quietly erase a large share of your final balance. Try lowering the return by 1% to see the impact.</li>
    </ul>
  `,
  faq: [
    {
      q: "What is a realistic annual return to use?",
      a: "For a diversified stock portfolio, a long-run average of around 7% after inflation (or ~10% before inflation) is commonly used. For bonds or cash, use a lower figure. Always treat projections as estimates, not guarantees.",
    },
    {
      q: "Does this calculator account for taxes or inflation?",
      a: "No. It shows nominal growth before taxes and inflation. To approximate real (inflation-adjusted) growth, subtract your expected inflation rate from the annual return — for example use 4% instead of 7%.",
    },
    {
      q: "How often is interest compounded here?",
      a: "Monthly. Contributions are added at the end of each month and then compound in every following month.",
    },
  ],
  related: ["retirement-savings-calculator", "loan-calculator"],
};
