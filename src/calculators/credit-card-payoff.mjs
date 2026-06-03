export default {
  slug: "credit-card-payoff-calculator",
  category: "borrowing",
  title: "Credit Card Payoff Calculator",
  metaTitle: "Credit Card Payoff Calculator – Time & Interest to Pay Off",
  metaDescription:
    "Free credit card payoff calculator. See how long it takes to clear your balance and how much interest you'll pay at a given monthly payment. No sign-up.",
  keywords: [
    "credit card payoff calculator",
    "credit card interest calculator",
    "debt payoff calculator",
    "how long to pay off credit card",
  ],
  intro:
    "<p>See how long it will take to clear your credit card balance and the total interest it will cost. Then try a higher monthly payment — the difference in time and interest is usually striking.</p>",
  inputs: [
    { id: "balance", label: "Current balance", type: "number", default: 6000, min: 0, step: 100, prefix: "$" },
    { id: "apr", label: "Interest rate (APR)", type: "number", default: 22, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "payment", label: "Monthly payment", type: "number", default: 250, min: 0, step: 10, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var r = v.apr / 100 / 12;
    var balance = v.balance;
    var firstInterest = balance * r;

    if (v.payment <= firstInterest && r > 0) {
      return {
        summary: [
          { label: "Time to pay off", value: "Never", primary: true },
          { label: "Monthly interest", value: ctx.money(firstInterest) },
          { label: "Your payment", value: ctx.money(v.payment) },
        ],
        note:
          "Your monthly payment is less than the interest charged each month, so the balance will never go down. Increase the payment above " +
          ctx.money(firstInterest) +
          " to make progress.",
      };
    }

    var months = 0;
    var totalInterest = 0;
    var balByYear = [balance];
    var guard = 0;
    while (balance > 0 && guard < 1200) {
      var interest = balance * r;
      totalInterest += interest;
      balance = balance + interest - v.payment;
      if (balance < 0) balance = 0;
      months++;
      if (months % 12 === 0) balByYear.push(balance);
      guard++;
    }
    if (balByYear[balByYear.length - 1] !== 0) balByYear.push(0);

    var years = Math.floor(months / 12);
    var rem = months % 12;
    var timeStr =
      (years > 0 ? years + " yr " : "") + (rem > 0 || years === 0 ? rem + " mo" : "");

    var xLabels = ["0"];
    for (var y = 1; y < balByYear.length; y++) xLabels.push(String(y));

    return {
      summary: [
        { label: "Time to pay off", value: timeStr.trim(), primary: true },
        { label: "Total interest", value: ctx.money(totalInterest) },
        { label: "Total paid", value: ctx.money(v.balance + totalInterest) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [{ name: "Balance", color: "#dc2626", points: balByYear }],
      },
    };
  },
  content: `
    <h2>Why credit card interest is so costly</h2>
    <p>Credit cards typically charge interest daily on your balance at a high APR, often around 20% or more. Because interest compounds on the unpaid balance, making only the minimum payment can stretch a modest balance into years of payments and hundreds or thousands in interest.</p>
    <h2>Fastest ways to get out of card debt</h2>
    <ul>
      <li><strong>Pay more than the minimum.</strong> Even a small increase to your monthly payment can cut years off the timeline. Try raising the payment field and watch the interest drop.</li>
      <li><strong>Avalanche method.</strong> If you have several cards, put extra money toward the highest-APR card first to minimize total interest.</li>
      <li><strong>Consider a balance transfer.</strong> A 0% introductory-APR transfer can pause interest while you pay down principal — just mind the transfer fee and the promo end date.</li>
    </ul>
  `,
  faq: [
    {
      q: "Why does paying the minimum take so long?",
      a: "Minimum payments are often just 1–3% of the balance, barely above the monthly interest. Most of your payment goes to interest rather than principal, so the balance shrinks very slowly.",
    },
    {
      q: "Is a balance transfer worth it?",
      a: "It can be, if you can pay down a large share of the balance during the 0% promotional period. Factor in the one-time transfer fee (commonly 3%–5%) and make sure you can pay it off before the regular APR kicks in.",
    },
    {
      q: "Does this assume no new charges?",
      a: "Yes. The estimate assumes you stop adding to the balance and make the same payment each month until it's cleared. New purchases would extend the timeline.",
    },
  ],
  related: ["loan-calculator", "savings-goal-calculator"],
};
