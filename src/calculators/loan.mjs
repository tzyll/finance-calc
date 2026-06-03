export default {
  slug: "loan-calculator",
  category: "borrowing",
  title: "Loan Calculator",
  metaTitle: "Loan Calculator – Monthly Payment & Amortization",
  metaDescription:
    "Free loan calculator. Find your monthly payment, total interest, and full amortization schedule for any loan amount, rate, and term. Instant, no sign-up.",
  keywords: [
    "loan calculator",
    "monthly payment calculator",
    "amortization calculator",
    "personal loan calculator",
  ],
  intro:
    "<p>Work out the monthly payment on any fixed-rate loan, plus how much total interest you'll pay over its life. Enter the amount, interest rate, and term to see an instant breakdown and payoff chart.</p>",
  inputs: [
    { id: "amount", label: "Loan amount", type: "number", default: 25000, min: 0, step: 500, prefix: "$" },
    { id: "rate", label: "Annual interest rate (APR)", type: "number", default: 6.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "years", label: "Loan term", type: "number", default: 5, min: 1, max: 40, step: 1, suffix: "yr" },
  ],
  compute: function (v, ctx) {
    var n = Math.round(v.years * 12);
    var r = v.rate / 100 / 12;
    var payment;
    if (r === 0) payment = v.amount / n;
    else payment = (v.amount * r) / (1 - Math.pow(1 + r, -n));
    var balance = v.amount;
    var totalInterest = 0;
    var balByYear = [v.amount];
    var rows = [];
    var yearInterest = 0,
      yearPrincipal = 0;
    for (var m = 1; m <= n; m++) {
      var interest = balance * r;
      var principal = payment - interest;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      yearInterest += interest;
      yearPrincipal += principal;
      if (m % 12 === 0 || m === n) {
        balByYear.push(balance);
        rows.push([
          "Year " + Math.ceil(m / 12),
          ctx.money(yearPrincipal),
          ctx.money(yearInterest),
          ctx.money(balance),
        ]);
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }
    var xLabels = ["0"];
    for (var y = 1; y < balByYear.length; y++) xLabels.push(String(y));
    return {
      summary: [
        { label: "Monthly payment", value: ctx.money(payment), primary: true },
        { label: "Total interest", value: ctx.money(totalInterest) },
        { label: "Total paid", value: ctx.money(v.amount + totalInterest) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: xLabels,
        series: [{ name: "Balance remaining", color: "#dc2626", points: balByYear }],
      },
      table: {
        columns: ["", "Principal paid", "Interest paid", "Balance"],
        rows: rows,
      },
    };
  },
  content: `
    <h2>How loan payments are calculated</h2>
    <p>A fixed-rate loan uses an amortization formula so that every monthly payment is identical. Early payments are mostly interest; later payments are mostly principal. The monthly payment is:</p>
    <p><code>M = P · r / (1 − (1 + r)^−n)</code></p>
    <p>where <code>P</code> is the loan amount, <code>r</code> is the monthly interest rate (APR ÷ 12), and <code>n</code> is the number of monthly payments.</p>
    <h2>Ways to pay less interest</h2>
    <ul>
      <li><strong>Shorten the term.</strong> A shorter term means higher monthly payments but far less total interest. Try dropping the term by a year or two.</li>
      <li><strong>Shop the rate.</strong> Even a 1% lower APR can save thousands over the life of the loan.</li>
      <li><strong>Pay extra toward principal.</strong> Additional principal payments shrink the balance faster and reduce all future interest.</li>
    </ul>
  `,
  faq: [
    {
      q: "What's the difference between APR and interest rate?",
      a: "The interest rate is the cost of borrowing the principal. APR also folds in certain fees, so it's usually slightly higher and is a better apples-to-apples comparison between lenders. This calculator treats the rate you enter as the nominal annual rate.",
    },
    {
      q: "Does this work for car loans, personal loans, and mortgages?",
      a: "Yes — any fixed-rate, fully-amortizing loan uses the same math. For mortgages, remember to separately budget for property tax, insurance, and any HOA fees, which aren't part of the loan payment.",
    },
    {
      q: "Why is so much of my early payment going to interest?",
      a: "Interest is charged on the outstanding balance, which is highest at the start. As the balance falls, the interest portion of each payment shrinks and more goes toward principal.",
    },
  ],
  related: ["compound-interest-calculator", "retirement-savings-calculator"],
  cta: { key: "personalLoan", text: "Compare personal loan offers" },
};
