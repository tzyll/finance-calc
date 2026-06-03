export default {
  slug: "simple-interest-calculator",
  category: "saving",
  title: "Simple Interest Calculator",
  metaTitle: "Simple Interest Calculator – Interest & Total Amount",
  metaDescription:
    "Free simple interest calculator. Find the interest and final amount using principal, rate, and time with the I = P·r·t formula. Instant, no sign-up.",
  keywords: [
    "simple interest calculator",
    "simple interest formula",
    "interest calculator",
    "I = Prt calculator",
  ],
  intro:
    "<p>Calculate simple interest — interest paid only on the original principal, not on accumulated interest. Enter the principal, annual rate, and time to see the interest and final amount.</p>",
  inputs: [
    { id: "principal", label: "Principal", type: "number", default: 10000, min: 0, step: 100, prefix: "$" },
    { id: "rate", label: "Annual interest rate", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "years", label: "Time", type: "number", default: 3, min: 0, max: 80, step: 0.5, suffix: "yr" },
  ],
  compute: function (v, ctx) {
    var interest = v.principal * (v.rate / 100) * v.years;
    var total = v.principal + interest;
    var whole = Math.max(1, Math.round(v.years));
    var pts = [v.principal];
    var labels = ["0"];
    for (var y = 1; y <= whole; y++) {
      pts.push(v.principal + v.principal * (v.rate / 100) * y);
      labels.push(String(y));
    }
    return {
      summary: [
        { label: "Total amount", value: ctx.money(total), primary: true },
        { label: "Interest earned", value: ctx.money(interest) },
        { label: "Principal", value: ctx.money(v.principal) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Balance", color: "#2563eb", points: pts }],
      },
    };
  },
  content: `
    <h2>The simple interest formula</h2>
    <p>Simple interest is calculated only on the original principal: <code>I = P × r × t</code>, where <code>P</code> is the principal, <code>r</code> is the annual rate, and <code>t</code> is the time in years. The final amount is <code>A = P + I = P(1 + r·t)</code>.</p>
    <p>Because interest never compounds, the balance grows in a straight line — unlike compound interest, which curves upward as interest earns interest.</p>
    <h2>Where simple interest shows up</h2>
    <ul>
      <li><strong>Many car loans and short-term personal loans</strong> accrue interest on the principal balance.</li>
      <li><strong>Some bonds and notes</strong> pay simple interest on their face value.</li>
      <li><strong>Quick estimates:</strong> simple interest is an easy back-of-the-envelope figure, though savings and investments usually compound.</li>
    </ul>
  `,
  faq: [
    {
      q: "What's the difference between simple and compound interest?",
      a: "Simple interest is charged only on the original principal, so it grows in a straight line. Compound interest is charged on the principal plus previously earned interest, so it grows faster over time. For the same rate, compound interest always yields more.",
    },
    {
      q: "How do I find the rate or time instead?",
      a: "Rearrange I = P·r·t. To find the rate: r = I ÷ (P·t). To find the time: t = I ÷ (P·r). You can also just adjust the inputs above until the interest matches your target.",
    },
    {
      q: "Is interest here monthly or annual?",
      a: "The rate is annual. The time is entered in years, so the formula gives total interest over that whole period.",
    },
  ],
  related: ["compound-interest-calculator", "loan-calculator"],
};
