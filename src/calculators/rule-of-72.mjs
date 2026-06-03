export default {
  slug: "rule-of-72-calculator",
  category: "saving",
  title: "Rule of 72 Calculator",
  metaTitle: "Rule of 72 Calculator – How Long to Double Your Money",
  metaDescription:
    "Free Rule of 72 calculator. Estimate how many years it takes to double your money at a given return, and compare it to the exact doubling time. No sign-up.",
  keywords: [
    "rule of 72 calculator",
    "double your money calculator",
    "doubling time calculator",
    "rule of 72",
  ],
  intro:
    "<p>The Rule of 72 is a quick way to estimate how long an investment takes to double. Just divide 72 by your annual return. Enter a rate to see the estimate, the exact figure, and a doubling timeline.</p>",
  inputs: [
    { id: "rate", label: "Annual return", type: "number", default: 8, min: 0.1, max: 100, step: 0.1, suffix: "%" },
    { id: "principal", label: "Starting amount (optional)", type: "number", default: 10000, min: 0, step: 100, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var rule72 = 72 / v.rate;
    var exact = Math.log(2) / Math.log(1 + v.rate / 100);
    var years = Math.min(80, Math.ceil(exact * 3));
    var pts = [v.principal];
    var labels = ["0"];
    for (var y = 1; y <= years; y++) {
      pts.push(v.principal * Math.pow(1 + v.rate / 100, y));
      labels.push(String(y));
    }
    return {
      summary: [
        { label: "Years to double (Rule of 72)", value: ctx.num(rule72, 1) + " yr", primary: true },
        { label: "Exact doubling time", value: ctx.num(exact, 1) + " yr" },
        { label: "Value after that time", value: ctx.money(v.principal * 2) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Value", color: "#7c3aed", points: pts }],
      },
    };
  },
  content: `
    <h2>How the Rule of 72 works</h2>
    <p>Divide 72 by the annual rate of return (as a whole number) to estimate the years needed to double your money: <code>Years ≈ 72 ÷ rate</code>. At 8% a year, that's about 9 years. It's a mental-math shortcut for the exact formula, <code>ln(2) ÷ ln(1 + rate)</code>.</p>
    <p>The rule is most accurate for rates between roughly 5% and 12%. At very high or very low rates it drifts from the exact figure, which is why this calculator shows both.</p>
    <h2>Why doubling time matters</h2>
    <ul>
      <li><strong>It makes compounding intuitive.</strong> A small change in return has a big effect: money doubles in ~9 years at 8%, but ~12 years at 6%.</li>
      <li><strong>It works in reverse for inflation.</strong> Divide 72 by the inflation rate to estimate how long until prices double and your cash loses half its value.</li>
      <li><strong>It highlights the cost of fees.</strong> A 2% fee that cuts your 8% return to 6% adds years to every doubling.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is the Rule of 72 exact?",
      a: "No, it's an approximation. It's quite close for typical investment returns (about 5%–12%). For precision, this calculator also shows the exact doubling time from the logarithmic formula.",
    },
    {
      q: "Can I use it for inflation?",
      a: "Yes. Divide 72 by the inflation rate to estimate how many years until prices double — and your money's buying power roughly halves.",
    },
    {
      q: "Why 72 and not another number?",
      a: "72 is used because it divides cleanly by many common rates (2, 3, 4, 6, 8, 9, 12) and closely matches the exact math for mid-range returns. Some people use 70 or 69.3 for lower rates.",
    },
  ],
  related: ["compound-interest-calculator", "inflation-calculator"],
  cta: { key: "brokerage", text: "Start investing today" },
};
