export default {
  slug: "savings-goal-calculator",
  category: "saving",
  title: "Savings Goal Calculator",
  metaTitle: "Savings Goal Calculator – How Much to Save Each Month",
  metaDescription:
    "Free savings goal calculator. Find the exact monthly amount to save to hit a target by a set date, accounting for interest. Instant results, no sign-up.",
  keywords: [
    "savings goal calculator",
    "how much to save calculator",
    "monthly savings calculator",
    "saving target calculator",
  ],
  intro:
    "<p>Have a target in mind — a house deposit, a car, an emergency fund? Enter your goal, what you've already saved, your timeline, and an expected return to find exactly how much to set aside each month.</p>",
  inputs: [
    { id: "goal", label: "Savings goal", type: "number", default: 50000, min: 0, step: 1000, prefix: "$" },
    { id: "current", label: "Already saved", type: "number", default: 5000, min: 0, step: 500, prefix: "$" },
    { id: "years", label: "Time to reach goal", type: "number", default: 5, min: 0.5, max: 60, step: 0.5, suffix: "yr" },
    { id: "rate", label: "Annual return", type: "number", default: 4, min: 0, max: 100, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var n = Math.round(v.years * 12);
    var r = v.rate / 100 / 12;
    var grownCurrent = r === 0 ? v.current : v.current * Math.pow(1 + r, n);
    var remaining = v.goal - grownCurrent;
    var pmt;
    if (remaining <= 0) pmt = 0;
    else if (r === 0) pmt = remaining / n;
    else pmt = remaining / ((Math.pow(1 + r, n) - 1) / r);

    var balance = v.current;
    var totalContrib = v.current;
    var balByYear = [v.current];
    for (var m = 1; m <= n; m++) {
      balance = balance * (1 + r) + pmt;
      totalContrib += pmt;
      if (m % 12 === 0) balByYear.push(balance);
    }
    var xLabels = ["0"];
    for (var y = 1; y < balByYear.length; y++) xLabels.push(String(y));

    return {
      summary: [
        { label: "Save per month", value: ctx.money(pmt), primary: true },
        { label: "Total you'll add", value: ctx.money(totalContrib - v.current) },
        { label: "Interest earned", value: ctx.money(v.goal - totalContrib) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [{ name: "Balance", color: "#0891b2", points: balByYear }],
      },
      note:
        remaining <= 0
          ? "Your current savings will already grow past your goal in this time — no additional monthly saving required."
          : "",
    };
  },
  content: `
    <h2>How the monthly amount is calculated</h2>
    <p>The calculator first grows your existing savings forward to your target date, then works out the regular monthly deposit needed to cover the remaining gap — including the interest those deposits will earn along the way. The math rearranges the future-value-of-an-annuity formula to solve for the payment.</p>
    <h2>Tips to hit your goal faster</h2>
    <ul>
      <li><strong>Automate it.</strong> Set up an automatic transfer on payday so saving happens before you can spend.</li>
      <li><strong>Use the right account.</strong> For short timelines, a high-yield savings account or money-market fund protects your principal. For long timelines, investing can earn more but carries risk.</li>
      <li><strong>Increase with raises.</strong> Each time your income rises, bump the monthly amount and you'll reach the goal sooner.</li>
    </ul>
  `,
  faq: [
    {
      q: "What return should I assume?",
      a: "For a goal within a few years, keep it conservative — a high-yield savings account might earn 3–5%. For long-term goals you can invest for a higher expected return, but the value can fall in the short run.",
    },
    {
      q: "What if I can't save the suggested amount?",
      a: "Extend the timeline, lower the goal, or boost your return assumption (with more risk). Try adjusting the years field to see how a longer runway reduces the required monthly amount.",
    },
    {
      q: "Does it account for inflation?",
      a: "No. If your goal is years away, consider setting the target a bit higher to preserve purchasing power, or reduce the assumed return by your inflation estimate.",
    },
  ],
  related: ["compound-interest-calculator", "retirement-savings-calculator"],
};
