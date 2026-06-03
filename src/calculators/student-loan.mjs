export default {
  slug: "student-loan-calculator",
  category: "borrowing",
  title: "Student Loan Calculator",
  metaTitle: "Student Loan Calculator – Payment, Payoff & Extra Payments",
  metaDescription:
    "Free student loan calculator. See your monthly payment, total interest, and how much time and interest an extra monthly payment saves. Instant, no sign-up.",
  keywords: [
    "student loan calculator",
    "student loan payoff calculator",
    "student loan payment calculator",
    "extra payment student loan",
  ],
  intro:
    "<p>Estimate your student loan payment and payoff timeline — then see how powerful even a small extra payment can be. Enter your balance, rate, and term, and add an optional extra monthly amount to watch the interest and years melt away.</p>",
  inputs: [
    { id: "balance", label: "Loan balance", type: "number", default: 30000, min: 0, step: 500, prefix: "$" },
    { id: "rate", label: "Interest rate", type: "number", default: 6, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "years", label: "Repayment term", type: "number", default: 10, min: 1, max: 30, step: 1, suffix: "yr" },
    { id: "extra", label: "Extra payment / month", type: "number", default: 0, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var r = v.rate / 100 / 12;
    var n = Math.round(v.years * 12);
    var basePmt = r === 0 ? v.balance / n : (v.balance * r) / (1 - Math.pow(1 + r, -n));

    function payoff(extra) {
      var bal = v.balance, months = 0, interest = 0, guard = 0;
      var balByYear = [bal];
      while (bal > 0.005 && guard < 1200) {
        guard++; months++;
        var i = bal * r; interest += i;
        var pay = Math.min(basePmt + extra, bal + i);
        bal = bal + i - pay;
        if (bal < 0) bal = 0;
        if (months % 12 === 0) balByYear.push(bal);
      }
      if (balByYear[balByYear.length - 1] !== 0) balByYear.push(0);
      return { months: months, interest: interest, balByYear: balByYear, resolved: guard < 1200 };
    }

    function timeStr(m) {
      var yr = Math.floor(m / 12), mo = m % 12;
      return (yr > 0 ? yr + " yr " : "") + mo + " mo";
    }

    var base = payoff(0);
    var withExtra = payoff(v.extra);
    var interestSaved = base.interest - withExtra.interest;
    var monthsSaved = base.months - withExtra.months;

    var labels = ["0"];
    for (var y = 1; y < withExtra.balByYear.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Monthly payment", value: ctx.money(basePmt), primary: true },
        { label: "Payoff time", value: timeStr(withExtra.months) },
        { label: "Total interest", value: ctx.money(withExtra.interest) },
      ],
      table: {
        columns: ["Scenario", "Payoff time", "Total interest"],
        rows: [
          ["Minimum payment only", timeStr(base.months), ctx.money(base.interest)],
          [v.extra > 0 ? "With $" + ctx.num(v.extra, 0) + "/mo extra" : "With extra payment", timeStr(withExtra.months), ctx.money(withExtra.interest)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Balance", color: "#0891b2", points: withExtra.balByYear }],
      },
      note:
        v.extra > 0
          ? "Paying " + ctx.money(v.extra) + "/month extra clears your loans " + timeStr(monthsSaved).trim() + " sooner and saves " + ctx.money(interestSaved) + " in interest."
          : "Add an extra monthly payment above to see how much time and interest you'd save.",
    };
  },
  content: `
    <h2>Why extra payments are so powerful on student loans</h2>
    <p>Student loan interest accrues on your balance, so every extra dollar of principal you pay removes all the future interest that dollar would have generated. Because the effect compounds over a 10-to-20-year term, even a modest extra payment can cut years off the loan and save thousands. Try adding $50 or $100 in the extra field and watch the difference.</p>
    <h2>Smart ways to pay off student loans</h2>
    <ul>
      <li><strong>Target the highest-rate loan first.</strong> If you have several loans, put extra money toward the one with the highest interest rate (the avalanche method).</li>
      <li><strong>Make sure extra goes to principal.</strong> Tell your servicer to apply extra payments to principal, not toward future payments.</li>
      <li><strong>Consider refinancing</strong> if you have strong credit and steady income — a lower rate sends more of each payment to principal. Weigh this carefully for federal loans, since refinancing gives up federal protections like income-driven repayment and forgiveness.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should I pay off student loans early or invest?",
      a: "It depends on the interest rate. If your loan rate is higher than what you'd reliably earn investing, paying it down is a guaranteed return. For low-rate loans, investing may come out ahead over time. Many people do a mix.",
    },
    {
      q: "Should I refinance my student loans?",
      a: "Refinancing to a lower rate can save money if you have good credit and stable income. But refinancing federal loans into a private loan forfeits federal benefits like income-driven repayment, deferment, and potential forgiveness — only do it if you're confident you won't need those.",
    },
    {
      q: "Does this include income-driven repayment plans?",
      a: "No. This calculator models a standard fixed repayment. Income-driven plans set payments based on your income and can change the timeline and total interest significantly.",
    },
  ],
  related: ["loan-calculator", "debt-payoff-calculator", "compound-interest-calculator"],
  cta: { key: "personalLoan", text: "Compare student loan refinance rates" },
};
