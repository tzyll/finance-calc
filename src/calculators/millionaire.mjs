export default {
  slug: "millionaire-calculator",
  category: "saving",
  title: "Millionaire Calculator",
  metaTitle: "Millionaire Calculator – How Long to Save $1 Million",
  metaDescription:
    "Free millionaire calculator. See how many years it takes to reach $1 million (or any target) from your savings, monthly investing, and return. No sign-up.",
  keywords: [
    "millionaire calculator",
    "how long to save a million",
    "become a millionaire calculator",
    "time to 1 million",
  ],
  intro:
    "<p>How long until you hit $1 million? Enter what you've saved, how much you invest each month, and an expected return to see how many years it takes — and how powerful raising your monthly amount can be.</p>",
  inputs: [
    { id: "current", label: "Current savings", type: "number", default: 25000, min: 0, step: 1000, prefix: "$" },
    { id: "monthly", label: "Monthly investment", type: "number", default: 1000, min: 0, step: 50, prefix: "$" },
    { id: "rate", label: "Annual return", type: "number", default: 8, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "target", label: "Target amount", type: "number", default: 1000000, min: 1000, step: 50000, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var mr = v.rate / 100 / 12;
    var bal = v.current;
    var contrib = v.current;
    var months = 0;
    var guard = 0;
    var balByYear = [bal];
    while (bal < v.target && guard < 1200) {
      guard++; months++;
      bal = bal * (1 + mr) + v.monthly;
      contrib += v.monthly;
      if (months % 12 === 0) balByYear.push(bal);
    }
    var reached = bal >= v.target;
    if (reached && balByYear[balByYear.length - 1] < v.target) balByYear.push(bal);
    var yr = Math.floor(months / 12), mo = months % 12;
    var timeStr = v.current >= v.target ? "Already there" : reached ? (yr > 0 ? yr + " yr " : "") + mo + " mo" : "100+ yr";

    var target = balByYear.map(function () { return v.target; });
    var labels = ["0"];
    for (var y = 1; y < balByYear.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Time to reach target", value: timeStr, primary: true },
        { label: "Target", value: ctx.money(v.target) },
        { label: "You'll have invested", value: ctx.money(reached ? contrib : v.current) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Balance", color: "#2563eb", points: balByYear },
          { name: "Target", color: "#94a3b8", points: target },
        ],
      },
      note:
        v.current >= v.target
          ? "You're already at your target — congratulations."
          : !reached
          ? "At this monthly amount it takes over a century. Increase your monthly investment to reach the target in a realistic timeframe."
          : "Raising your monthly investment is the fastest lever — try adding a few hundred dollars and watch the timeline shrink.",
    };
  },
  content: `
    <h2>The two forces that get you there</h2>
    <p>Reaching seven figures comes down to how much you invest and how long compounding has to work. Early on, your contributions do most of the lifting. Later, growth takes over — once the balance is large, it can grow by your annual salary's worth in a single year without you adding a cent. That crossover is why starting early matters so much.</p>
    <h2>Ways to get there faster</h2>
    <ul>
      <li><strong>Invest more each month.</strong> This is the lever you control most directly, and it has an outsized effect early on.</li>
      <li><strong>Start now.</strong> Every year you delay is a year of compounding you can't get back. Time is the ingredient you can't buy later.</li>
      <li><strong>Keep costs and taxes low.</strong> Low-fee funds and tax-advantaged accounts (401k, IRA) let more of your return compound.</li>
    </ul>
    <p>Remember the target is in future dollars — a million decades from now buys less than a million today due to inflation. Aiming a bit higher, or planning in today's dollars, keeps the goal honest.</p>
  `,
  faq: [
    {
      q: "Is $1 million enough to retire on?",
      a: "It depends on your spending. Under the 4% rule, $1 million supports roughly $40,000 a year of withdrawals. If you spend more, you'll want a larger target; if you spend less, a smaller one can work.",
    },
    {
      q: "What return should I assume?",
      a: "A diversified stock portfolio has historically averaged around 8–10% nominally over the long run, though any given year can be very different. Use a conservative figure and treat the result as an estimate.",
    },
    {
      q: "Does this account for inflation?",
      a: "No — the target is in nominal (future) dollars. To think in today's purchasing power, set a higher target or reduce the return by your inflation assumption.",
    },
  ],
  related: ["investment-calculator", "compound-interest-calculator", "fire-calculator"],
  cta: { key: "brokerage", text: "Open an investing account" },
};
