export default {
  slug: "inflation-calculator",
  category: "saving",
  title: "Inflation Calculator",
  metaTitle: "Inflation Calculator – Future Cost & Purchasing Power",
  metaDescription:
    "Free inflation calculator. See what an amount will cost in the future and how inflation erodes your purchasing power over time. Instant results, no sign-up.",
  keywords: [
    "inflation calculator",
    "purchasing power calculator",
    "future value of money",
    "cost of living calculator",
  ],
  intro:
    "<p>See how inflation changes the value of money over time. Enter an amount, a number of years, and an expected inflation rate to find the future cost of the same goods — and how much buying power you'd lose.</p>",
  inputs: [
    { id: "amount", label: "Amount today", type: "number", default: 10000, min: 0, step: 100, prefix: "$" },
    { id: "years", label: "Years", type: "number", default: 20, min: 1, max: 80, step: 1, suffix: "yr" },
    { id: "rate", label: "Annual inflation rate", type: "number", default: 3, min: 0, max: 50, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var factor = Math.pow(1 + v.rate / 100, v.years);
    var futureCost = v.amount * factor;
    var futurePower = v.amount / factor;
    var lostPower = v.amount - futurePower;

    var costPts = [v.amount];
    var powerPts = [v.amount];
    var labels = ["0"];
    for (var y = 1; y <= v.years; y++) {
      costPts.push(v.amount * Math.pow(1 + v.rate / 100, y));
      powerPts.push(v.amount / Math.pow(1 + v.rate / 100, y));
      labels.push(String(y));
    }

    return {
      summary: [
        { label: "Equivalent cost in " + v.years + " yr", value: ctx.money(futureCost), primary: true },
        { label: "Future buying power of that sum", value: ctx.money(futurePower) },
        { label: "Buying power lost", value: ctx.money(lostPower) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Cost of same goods", color: "#ea580c", points: costPts },
          { name: "Buying power of today's amount", color: "#94a3b8", points: powerPts },
        ],
      },
    };
  },
  content: `
    <h2>How inflation works</h2>
    <p>Inflation is the steady rise in prices over time, which means each dollar buys a little less each year. At 3% annual inflation, something that costs $100 today costs about $134 in ten years — and $100 stashed under the mattress would buy only about $74 worth of goods.</p>
    <p>The future cost is calculated as <code>Amount × (1 + rate)^years</code>, and the lost buying power as <code>Amount ÷ (1 + rate)^years</code>.</p>
    <h2>Protecting your money from inflation</h2>
    <ul>
      <li><strong>Don't hold too much cash long-term.</strong> Money sitting idle loses value every year. Keep an emergency fund, but invest beyond it.</li>
      <li><strong>Aim for returns above inflation.</strong> An investment must beat the inflation rate just to preserve purchasing power.</li>
      <li><strong>Consider inflation-linked assets.</strong> Some bonds and real assets are designed to track or outpace inflation.</li>
    </ul>
  `,
  faq: [
    {
      q: "What inflation rate should I use?",
      a: "Long-run inflation in many developed economies has averaged around 2–3% per year, though it varies and can spike. Use your region's recent average, or run a few rates to see a range.",
    },
    {
      q: "What's the difference between future cost and buying power?",
      a: "Future cost is how many dollars you'll need later to buy the same goods. Buying power is how much today's dollars will be worth in the future — the same idea viewed from opposite ends.",
    },
    {
      q: "Does this predict actual prices?",
      a: "No. It's a projection based on a constant inflation rate you choose. Real inflation varies year to year, so treat the result as an estimate.",
    },
  ],
  related: ["compound-interest-calculator", "savings-goal-calculator"],
};
