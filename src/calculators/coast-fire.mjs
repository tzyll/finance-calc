export default {
  slug: "coast-fire-calculator",
  category: "retirement",
  title: "Coast FIRE Calculator",
  metaTitle: "Coast FIRE Calculator – When You Can Stop Saving",
  metaDescription:
    "Free Coast FIRE calculator. Find how much you need invested now so compounding alone reaches your retirement goal — no more contributions required. No sign-up.",
  keywords: [
    "coast fire calculator",
    "coast fi calculator",
    "barista fire calculator",
    "stop saving for retirement calculator",
  ],
  intro:
    "<p>Coast FIRE is the point where you have enough invested that, even if you never contribute another dollar, compounding alone grows it to your retirement goal. Enter your numbers to see your Coast FIRE target and whether you've hit it.</p>",
  inputs: [
    { id: "currentAge", label: "Current age", type: "number", default: 30, min: 16, max: 90, step: 1, suffix: "yr" },
    { id: "retireAge", label: "Retirement age", type: "number", default: 65, min: 18, max: 95, step: 1, suffix: "yr" },
    { id: "expenses", label: "Annual spending in retirement", type: "number", default: 40000, min: 0, step: 1000, prefix: "$" },
    { id: "current", label: "Current investments", type: "number", default: 80000, min: 0, step: 1000, prefix: "$" },
    { id: "rate", label: "Annual return (after inflation)", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "swr", label: "Safe withdrawal rate", type: "number", default: 4, min: 1, max: 10, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var years = Math.max(0, Math.round(v.retireAge - v.currentAge));
    var r = v.rate / 100;
    var fi = v.swr > 0 ? v.expenses * (100 / v.swr) : 0;
    var coastNumber = fi / Math.pow(1 + r, years);
    var projected = v.current * Math.pow(1 + r, years);
    var reached = v.current >= coastNumber;
    var progress = coastNumber > 0 ? Math.min(100, (v.current / coastNumber) * 100) : 0;

    var grown = [v.current];
    var target = [fi];
    var labels = [String(v.currentAge)];
    for (var y = 1; y <= years; y++) {
      grown.push(v.current * Math.pow(1 + r, y));
      target.push(fi);
      labels.push(String(v.currentAge + y));
    }

    return {
      summary: [
        { label: "Coast FIRE number", value: ctx.money(coastNumber), primary: true },
        { label: "Progress to Coast FIRE", value: ctx.pct(progress) },
        { label: "Projected at retirement", value: ctx.money(projected) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Age",
        xLabels: labels,
        series: [
          { name: "Investments (no new savings)", color: "#059669", points: grown },
          { name: "FI target", color: "#94a3b8", points: target },
        ],
      },
      note: reached
        ? "You've reached Coast FIRE. Even if you stopped contributing today, your investments are on track to grow into your retirement number — you only need to cover current expenses from here."
        : "You're " +
          ctx.pct(progress) +
          " of the way to Coast FIRE. Once your investments pass the Coast FIRE number, you can ease off retirement saving and let compounding finish the job.",
    };
  },
  content: `
    <h2>What Coast FIRE means</h2>
    <p>Coast FIRE is a milestone on the road to full financial independence. You hit it when your invested savings are large enough that, with no further contributions, normal compound growth will reach your retirement goal by your target age. After that point, you only need to earn enough to cover your <em>current</em> living expenses — your retirement is effectively already funded.</p>
    <p>The math runs the 4% rule backward: your retirement number is about 25× your annual spending, and the Coast FIRE number is that figure discounted back to today by your expected return: <code>Coast number = FI number ÷ (1 + return)^years</code>.</p>
    <h2>Why it's powerful</h2>
    <ul>
      <li><strong>Freedom to downshift:</strong> reaching Coast FIRE lets you take a lower-paying but more enjoyable job, go part-time ("Barista FIRE"), or take a career break without derailing retirement.</li>
      <li><strong>It rewards saving early.</strong> Because compounding has decades to work, a relatively modest sum invested young can coast to a large retirement balance.</li>
      <li><strong>Less pressure:</strong> you've front-loaded the hard part, so the money keeps working even if you stop adding to it.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is Coast FIRE the same as being able to retire?",
      a: "No — at Coast FIRE you can stop saving for retirement, but you still need income to cover today's expenses until your target retirement age. Full FIRE means your investments cover your living costs now.",
    },
    {
      q: "What return should I assume?",
      a: "Use a real (after-inflation) return, commonly around 5% for a stock-heavy portfolio, so your numbers stay in today's dollars. A lower assumption raises your Coast FIRE number for added safety.",
    },
    {
      q: "What is Barista FIRE?",
      a: "A close cousin: you've saved enough to coast, then take a part-time or lower-stress job that covers current expenses (and maybe health benefits) while your investments grow untouched toward retirement.",
    },
  ],
  related: ["fire-calculator", "retirement-savings-calculator", "compound-interest-calculator"],
  cta: { key: "brokerage", text: "Open an investing account" },
};
