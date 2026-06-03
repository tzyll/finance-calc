export default {
  slug: "investment-calculator",
  category: "saving",
  title: "Investment Calculator",
  metaTitle: "Investment Calculator – Future Value in Today's Dollars",
  metaDescription:
    "Free investment calculator. Project your portfolio's future value from contributions and returns — and see it in today's dollars after inflation. No sign-up.",
  keywords: [
    "investment calculator",
    "investment growth calculator",
    "investment return calculator",
    "inflation adjusted investment",
  ],
  intro:
    "<p>Project how an investment grows from a starting amount and regular contributions — then see what it's really worth in today's dollars after inflation. The gap between the two is bigger than most people expect.</p>",
  inputs: [
    { id: "initial", label: "Initial investment", type: "number", default: 10000, min: 0, step: 500, prefix: "$" },
    { id: "monthly", label: "Monthly contribution", type: "number", default: 500, min: 0, step: 50, prefix: "$" },
    { id: "years", label: "Years invested", type: "number", default: 30, min: 1, max: 80, step: 1, suffix: "yr" },
    { id: "rate", label: "Annual return", type: "number", default: 8, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "inflation", label: "Inflation rate", type: "number", default: 3, min: 0, max: 50, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var mr = v.rate / 100 / 12;
    var n = Math.round(v.years * 12);
    var bal = v.initial;
    var contrib = v.initial;
    var nominalByYear = [bal];
    var realByYear = [bal];
    for (var m = 1; m <= n; m++) {
      bal = bal * (1 + mr) + v.monthly;
      contrib += v.monthly;
      if (m % 12 === 0) {
        var yr = m / 12;
        nominalByYear.push(bal);
        realByYear.push(bal / Math.pow(1 + v.inflation / 100, yr));
      }
    }
    var real = bal / Math.pow(1 + v.inflation / 100, v.years);
    var labels = ["0"];
    for (var y = 1; y <= v.years; y++) labels.push(String(y));
    return {
      summary: [
        { label: "Future value", value: ctx.money(bal), primary: true },
        { label: "In today's dollars", value: ctx.money(real) },
        { label: "Total contributions", value: ctx.money(contrib) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Nominal value", color: "#2563eb", points: nominalByYear },
          { name: "Today's dollars (real)", color: "#94a3b8", points: realByYear },
        ],
      },
      table: {
        columns: ["", "Amount"],
        rows: [
          ["Future value (nominal)", ctx.money(bal)],
          ["Value in today's dollars", ctx.money(real)],
          ["Total contributions", ctx.money(contrib)],
          ["Investment growth", ctx.money(bal - contrib)],
        ],
      },
    };
  },
  content: `
    <h2>Nominal vs. real: why both numbers matter</h2>
    <p>The <strong>nominal</strong> value is the dollar figure your account will show. The <strong>real</strong> value adjusts for inflation to express that balance in today's purchasing power — what it could actually buy. Over decades the difference is large: at 3% inflation, prices roughly double every 24 years, so a future million isn't worth a million in today's terms.</p>
    <p>Planning in real dollars keeps your goals honest. A common shortcut is to use a single "real return" (your return minus inflation) so the projection is already in today's money.</p>
    <h2>What drives investment growth</h2>
    <ul>
      <li><strong>Time:</strong> the longer you stay invested, the more compounding dominates. The final years add the most because they grow the largest balance.</li>
      <li><strong>Contributions:</strong> steady monthly investing (dollar-cost averaging) builds the base that compounding works on.</li>
      <li><strong>Costs:</strong> fees come straight out of your return. Lowering the return by even 1% to model fees shows how much they quietly cost over time.</li>
    </ul>
  `,
  faq: [
    {
      q: "What return should I use?",
      a: "For a diversified stock portfolio, a long-run nominal average around 8–10% is common, or about 5–7% after inflation. Use a conservative figure for a margin of safety, and remember real markets are volatile year to year.",
    },
    {
      q: "What's the difference between this and a compound interest calculator?",
      a: "The core growth math is the same. This calculator adds an inflation adjustment so you can see your future balance in today's purchasing power — useful for long-term goals where inflation meaningfully erodes value.",
    },
    {
      q: "Does it account for taxes?",
      a: "No. Returns are shown before taxes. In tax-advantaged accounts (401k, IRA) growth is sheltered; in a taxable account, taxes on gains and dividends would reduce the net result.",
    },
  ],
  related: ["compound-interest-calculator", "retirement-savings-calculator", "inflation-calculator"],
  cta: { key: "brokerage", text: "Open an investing account" },
};
