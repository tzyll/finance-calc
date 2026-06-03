export default {
  slug: "auto-loan-calculator",
  category: "borrowing",
  title: "Auto Loan Calculator",
  metaTitle: "Auto Loan Calculator – Car Payment with Tax & Trade-In",
  metaDescription:
    "Free auto loan calculator. Estimate your monthly car payment including down payment, trade-in, and sales tax, plus total interest. Instant, no sign-up.",
  keywords: [
    "auto loan calculator",
    "car payment calculator",
    "car loan calculator",
    "monthly car payment",
  ],
  intro:
    "<p>Estimate your real monthly car payment. Factor in your down payment, trade-in value, and sales tax to see the financed amount, monthly payment, and total interest.</p>",
  inputs: [
    { id: "price", label: "Vehicle price", type: "number", default: 35000, min: 0, step: 500, prefix: "$" },
    { id: "down", label: "Down payment", type: "number", default: 4000, min: 0, step: 500, prefix: "$" },
    { id: "trade", label: "Trade-in value", type: "number", default: 0, min: 0, step: 500, prefix: "$" },
    { id: "taxPct", label: "Sales tax", type: "number", default: 7, min: 0, max: 20, step: 0.1, suffix: "%" },
    { id: "rate", label: "Interest rate (APR)", type: "number", default: 7.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "months", label: "Loan term", type: "number", default: 60, min: 6, max: 96, step: 6, suffix: "mo" },
  ],
  compute: function (v, ctx) {
    // Sales tax in most states is charged on price minus trade-in.
    var taxable = Math.max(0, v.price - v.trade);
    var tax = taxable * (v.taxPct / 100);
    var loan = Math.max(0, v.price + tax - v.down - v.trade);
    var r = v.rate / 100 / 12;
    var n = Math.round(v.months);
    var payment;
    if (r === 0) payment = loan / n;
    else payment = (loan * r) / (1 - Math.pow(1 + r, -n));

    var balance = loan;
    var totalInterest = 0;
    var balByYear = [loan];
    for (var m = 1; m <= n; m++) {
      var interest = balance * r;
      balance = Math.max(0, balance - (payment - interest));
      totalInterest += interest;
      if (m % 12 === 0 || m === n) balByYear.push(balance);
    }
    var xLabels = ["0"];
    for (var y = 1; y < balByYear.length; y++) xLabels.push(String(y));

    return {
      summary: [
        { label: "Monthly payment", value: ctx.money(payment), primary: true },
        { label: "Amount financed", value: ctx.money(loan) },
        { label: "Total interest", value: ctx.money(totalInterest) },
      ],
      table: {
        columns: ["Item", "Amount"],
        rows: [
          ["Vehicle price", ctx.money(v.price)],
          ["Sales tax", ctx.money(tax)],
          ["Down payment", "−" + ctx.money(v.down)],
          ["Trade-in", "−" + ctx.money(v.trade)],
          ["Amount financed", ctx.money(loan)],
          ["Total of payments", ctx.money(loan + totalInterest)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [{ name: "Balance remaining", color: "#d97706", points: balByYear }],
      },
    };
  },
  content: `
    <h2>What drives your car payment</h2>
    <p>Four things move the monthly number: the amount you finance, the interest rate, the loan length, and any sales tax rolled into the loan. A bigger down payment or trade-in shrinks the financed amount directly. A longer term lowers the monthly payment but increases total interest — and risks leaving you "underwater," owing more than the car is worth.</p>
    <h2>Tips before you sign</h2>
    <ul>
      <li><strong>Get pre-approved.</strong> A rate from your own bank or credit union gives you leverage against dealer financing.</li>
      <li><strong>Keep the term short.</strong> 36–60 months is common; 72–84 month loans pile on interest and stretch you past the warranty.</li>
      <li><strong>Negotiate the price, not the payment.</strong> Dealers can lower a monthly payment by extending the term while the total cost goes up.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is sales tax charged on the trade-in?",
      a: "In most U.S. states, sales tax is calculated on the price after subtracting your trade-in, which lowers the tax. A few states tax the full price. This calculator uses the price-minus-trade-in method.",
    },
    {
      q: "Should I roll tax and fees into the loan?",
      a: "You can, but financing tax and fees increases the amount you borrow and the interest you pay. Paying them up front keeps the loan smaller.",
    },
    {
      q: "What's a good auto loan term?",
      a: "Shorter is cheaper overall. Many buyers choose 48–60 months. Terms of 72 months or longer lower the payment but can leave you owing more than the car's value for years.",
    },
  ],
  related: ["loan-calculator", "credit-card-payoff-calculator"],
  cta: { key: "autoLoan", text: "Compare auto loan rates" },
};
