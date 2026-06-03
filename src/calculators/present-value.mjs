export default {
  slug: "present-value-calculator",
  category: "saving",
  title: "Present Value Calculator",
  metaTitle: "Present Value Calculator – What a Future Sum Is Worth Today",
  metaDescription:
    "Free present value calculator. Find what a future amount of money is worth in today's dollars at a given discount rate. Instant results, no sign-up.",
  keywords: [
    "present value calculator",
    "pv calculator",
    "time value of money calculator",
    "discount rate calculator",
  ],
  intro:
    "<p>Money in the future is worth less than money today, because today's money can be invested to grow. The present value tells you what a future amount is worth right now. Enter a future sum, a time frame, and a rate to find its value today.</p>",
  inputs: [
    { id: "future", label: "Future amount", type: "number", default: 10000, min: 0, step: 500, prefix: "$" },
    { id: "years", label: "Years from now", type: "number", default: 10, min: 0, max: 80, step: 1, suffix: "yr" },
    { id: "rate", label: "Discount rate (return)", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var r = v.rate / 100;
    var pv = v.future / Math.pow(1 + r, v.years);
    var discount = v.future - pv;
    var pts = [pv];
    var labels = ["0"];
    for (var y = 1; y <= v.years; y++) {
      pts.push(pv * Math.pow(1 + r, y));
      labels.push(String(y));
    }
    return {
      summary: [
        { label: "Present value (today)", value: ctx.money(pv), primary: true },
        { label: "Future amount", value: ctx.money(v.future) },
        { label: "Time-value discount", value: ctx.money(discount) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Value over time", color: "#2563eb", points: pts }],
      },
      note:
        "Receiving " +
        ctx.money(v.future) +
        " in " +
        v.years +
        " years is worth about " +
        ctx.money(pv) +
        " today — because that smaller amount, invested at " +
        ctx.pct(v.rate) +
        ", would grow to the future sum.",
    };
  },
  content: `
    <h2>The time value of money</h2>
    <p>A dollar today is worth more than a dollar tomorrow, because today's dollar can be invested and earn a return. <strong>Present value (PV)</strong> reverses that growth: it discounts a future amount back to what it's worth right now. The formula is:</p>
    <p><code>PV = Future Value ÷ (1 + r)^n</code></p>
    <p>where <code>r</code> is the discount rate (your expected return) and <code>n</code> is the number of years. A higher rate or a longer time makes the future money worth less today.</p>
    <h2>Where present value is useful</h2>
    <ul>
      <li><strong>Lump sum vs. payments:</strong> deciding whether to take a buyout, settlement, or lottery prize now versus larger payments later — compare their present values.</li>
      <li><strong>Comparing offers</strong> that pay at different times — present value puts them on equal footing.</li>
      <li><strong>Valuing a future goal:</strong> how much a future payout is really worth to you today.</li>
    </ul>
    <h2>Choosing a discount rate</h2>
    <p>The discount rate is what you could reasonably earn on the money instead. A higher rate (say, a stock-market return) discounts the future more heavily; a lower rate (a savings account) discounts it less. There's no single "right" number — it reflects your opportunity cost and how certain the future amount is.</p>
  `,
  faq: [
    {
      q: "What's the difference between present value and future value?",
      a: "Future value grows a present amount forward in time; present value discounts a future amount back to today. They're two sides of the same time-value-of-money coin.",
    },
    {
      q: "Should I take a lump sum now or payments later?",
      a: "Compare the present value of the future payments to the lump sum on offer. If the lump sum exceeds the present value of the payments (at a realistic discount rate), taking it and investing can come out ahead — but also weigh taxes, risk, and your discipline to invest it.",
    },
    {
      q: "What discount rate should I use?",
      a: "Use the return you could realistically earn on the money instead — your opportunity cost. A conservative rate (like a high-yield savings rate) is safer for near-term decisions; a higher rate suits long-term, risk-tolerant comparisons.",
    },
  ],
  related: ["compound-interest-calculator", "investment-calculator", "inflation-calculator"],
};
