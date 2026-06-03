export default {
  slug: "mortgage-calculator",
  category: "borrowing",
  title: "Mortgage Calculator",
  metaTitle: "Mortgage Calculator – Monthly Payment with Taxes & Insurance",
  metaDescription:
    "Free mortgage calculator with taxes, insurance, and HOA. Estimate your full monthly payment (PITI), total interest, and payoff schedule. Instant, no sign-up.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly mortgage payment",
    "PITI calculator",
  ],
  intro:
    "<p>Estimate your real monthly mortgage payment, including principal, interest, property tax, insurance, and HOA dues. Adjust the price, down payment, rate, and term to see how each one moves your payment.</p>",
  inputs: [
    { id: "price", label: "Home price", type: "number", default: 400000, min: 0, step: 5000, prefix: "$" },
    { id: "downPct", label: "Down payment", type: "number", default: 20, min: 0, max: 100, step: 1, suffix: "%" },
    { id: "rate", label: "Interest rate", type: "number", default: 6.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "years", label: "Loan term", type: "number", default: 30, min: 1, max: 40, step: 1, suffix: "yr" },
    { id: "taxPct", label: "Property tax / yr", type: "number", default: 1.1, min: 0, max: 10, step: 0.05, suffix: "%" },
    { id: "insurance", label: "Home insurance / yr", type: "number", default: 1800, min: 0, step: 100, prefix: "$" },
    { id: "hoa", label: "HOA dues / mo", type: "number", default: 0, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var loan = v.price * (1 - v.downPct / 100);
    var n = Math.round(v.years * 12);
    var r = v.rate / 100 / 12;
    var pi;
    if (r === 0) pi = loan / n;
    else pi = (loan * r) / (1 - Math.pow(1 + r, -n));
    var tax = (v.price * (v.taxPct / 100)) / 12;
    var ins = v.insurance / 12;
    var monthly = pi + tax + ins + v.hoa;

    var balance = loan;
    var totalInterest = 0;
    var balByYear = [loan];
    for (var m = 1; m <= n; m++) {
      var interest = balance * r;
      balance = Math.max(0, balance - (pi - interest));
      totalInterest += interest;
      if (m % 12 === 0) balByYear.push(balance);
    }
    var xLabels = ["0"];
    for (var y = 1; y < balByYear.length; y++) xLabels.push(String(y));

    return {
      summary: [
        { label: "Monthly payment", value: ctx.money(monthly), primary: true },
        { label: "Principal & interest", value: ctx.money(pi) },
        { label: "Total interest paid", value: ctx.money(totalInterest) },
      ],
      table: {
        columns: ["Component", "Monthly"],
        rows: [
          ["Principal & interest", ctx.money(pi)],
          ["Property tax", ctx.money(tax)],
          ["Home insurance", ctx.money(ins)],
          ["HOA dues", ctx.money(v.hoa)],
          ["Loan amount", ctx.money(loan)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [{ name: "Balance remaining", color: "#7c3aed", points: balByYear }],
      },
    };
  },
  content: `
    <h2>What goes into a mortgage payment</h2>
    <p>Lenders call the full monthly payment <strong>PITI</strong>: Principal, Interest, Taxes, and Insurance. The principal-and-interest portion is fixed for a fixed-rate loan, but taxes and insurance can rise over time. If your down payment is under 20%, most lenders also add private mortgage insurance (PMI), which this calculator does not include.</p>
    <h2>How to lower your payment</h2>
    <ul>
      <li><strong>Larger down payment.</strong> More money down means a smaller loan and can remove PMI once you reach 20% equity.</li>
      <li><strong>Lower rate.</strong> Even a quarter-point lower rate saves real money over 30 years — shop multiple lenders.</li>
      <li><strong>Longer term.</strong> A 30-year term lowers the monthly payment versus a 15-year, but you pay much more total interest. Compare both.</li>
    </ul>
  `,
  faq: [
    {
      q: "Does this include PMI?",
      a: "No. If your down payment is below 20%, lenders typically charge private mortgage insurance (often 0.3%–1.5% of the loan per year) until you build 20% equity. Add that separately when budgeting.",
    },
    {
      q: "Are property taxes the same everywhere?",
      a: "No — rates vary widely by location, from well under 1% to over 2% of the home's value per year. Use your county's actual rate for an accurate estimate.",
    },
    {
      q: "Should I choose a 15-year or 30-year mortgage?",
      a: "A 15-year loan has higher monthly payments but a lower rate and far less total interest. A 30-year loan is more affordable month to month. Try both terms here to compare the trade-off.",
    },
  ],
  related: ["loan-calculator", "compound-interest-calculator"],
  cta: { key: "mortgageRates", text: "Compare today's mortgage rates" },
};
