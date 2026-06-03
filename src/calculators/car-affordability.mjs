export default {
  slug: "car-affordability-calculator",
  category: "borrowing",
  title: "Car Affordability Calculator",
  metaTitle: "Car Affordability Calculator – How Much Car Can I Afford?",
  metaDescription:
    "Free car affordability calculator. See the max car price you can afford from your income and down payment using the 20/4/10 rule. Instant, no sign-up.",
  keywords: [
    "car affordability calculator",
    "how much car can i afford",
    "car budget calculator",
    "20/4/10 rule",
  ],
  intro:
    "<p>How much car can you actually afford? A good rule of thumb is to keep your car payment under 10% of your income, put 20% down, and finance for no more than 4 years. Enter your numbers to see a sensible maximum price.</p>",
  inputs: [
    { id: "income", label: "Gross annual income", type: "number", default: 60000, min: 0, step: 1000, prefix: "$" },
    { id: "down", label: "Down payment + trade-in", type: "number", default: 4000, min: 0, step: 500, prefix: "$" },
    { id: "rate", label: "Auto loan rate (APR)", type: "number", default: 7, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "term", label: "Loan term", type: "number", default: 4, min: 1, max: 8, step: 1, suffix: "yr" },
    { id: "payPct", label: "Max payment (% of income)", type: "number", default: 10, min: 1, max: 25, step: 0.5, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var monthlyGross = v.income / 12;
    var maxPayment = monthlyGross * (v.payPct / 100);
    var r = v.rate / 100 / 12;
    var n = Math.round(v.term * 12);
    var maxLoan = r === 0 ? maxPayment * n : (maxPayment * (1 - Math.pow(1 + r, -n))) / r;
    var maxPrice = maxLoan + v.down;
    return {
      summary: [
        { label: "Car price you can afford", value: ctx.money(maxPrice), primary: true },
        { label: "Max monthly payment", value: ctx.money(maxPayment) },
        { label: "Loan amount", value: ctx.money(maxLoan) },
      ],
      table: {
        columns: ["Item", "Amount"],
        rows: [
          ["Gross monthly income", ctx.money(monthlyGross)],
          ["Max monthly payment (" + ctx.num(v.payPct, 0) + "%)", ctx.money(maxPayment)],
          ["Down payment + trade-in", ctx.money(v.down)],
          ["Maximum loan", ctx.money(maxLoan)],
          ["Maximum car price", ctx.money(maxPrice)],
        ],
      },
      note:
        "Based on keeping the payment under " +
        ctx.num(v.payPct, 0) +
        "% of gross income over a " +
        v.term +
        "-year loan. Remember insurance, gas, and maintenance add to the true cost of owning — many advisors keep ALL car costs under about 15% of income.",
    };
  },
  content: `
    <h2>The 20/4/10 rule</h2>
    <p>A simple framework keeps car buying from wrecking your budget:</p>
    <ul>
      <li><strong>20% down</strong> — a meaningful down payment shrinks the loan and helps you avoid being "underwater" (owing more than the car is worth).</li>
      <li><strong>4 years max</strong> — financing for longer lowers the payment but piles on interest and keeps you in debt past the car's best years.</li>
      <li><strong>10% of income</strong> — keep the monthly payment under 10% of your gross income. Stretch toward 15% only if you account for insurance and gas within it.</li>
    </ul>
    <h2>Don't forget the cost of ownership</h2>
    <p>The sticker price is only part of the story. Insurance, fuel, maintenance, registration, and depreciation all add up — often as much as the loan payment itself. Build those into your budget so the car you "afford" doesn't quietly stretch you thin.</p>
    <h2>Ways to buy smarter</h2>
    <ul>
      <li><strong>Get pre-approved</strong> from your bank or credit union for leverage over dealer financing.</li>
      <li><strong>Consider slightly used</strong> — a 2–3 year old car skips the steepest depreciation.</li>
      <li><strong>Negotiate the price, not the payment</strong> — dealers can lower a monthly payment by stretching the term while the total cost rises.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should the 10% include insurance and gas?",
      a: "The classic rule applies 10% to the loan payment alone. A stricter, safer approach keeps ALL transportation costs — payment, insurance, fuel, and maintenance — under about 15% of gross income.",
    },
    {
      q: "Is a longer loan term a bad idea?",
      a: "Longer terms (72–84 months) lower the monthly payment but greatly increase total interest and keep you owing money on a depreciating asset for years. Sticking to 48 months or less is much cheaper overall.",
    },
    {
      q: "How much should I put down?",
      a: "Around 20% is the guideline. A larger down payment reduces the loan, lowers your interest, and protects against owing more than the car is worth early in the loan.",
    },
  ],
  related: ["auto-loan-calculator", "loan-calculator", "budget-calculator"],
  cta: { key: "autoLoan", text: "Compare auto loan rates" },
};
