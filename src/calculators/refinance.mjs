export default {
  slug: "refinance-calculator",
  category: "borrowing",
  title: "Mortgage Refinance Calculator",
  metaTitle: "Refinance Calculator – Monthly Savings & Break-Even",
  metaDescription:
    "Free mortgage refinance calculator. Compare your current loan to a new one to see monthly savings, total interest, and how long to break even on closing costs.",
  keywords: [
    "refinance calculator",
    "mortgage refinance calculator",
    "refinance break even calculator",
    "should i refinance",
  ],
  intro:
    "<p>Thinking about refinancing? Compare your current mortgage to a new one to see your monthly savings, the change in total interest, and how many months it takes to break even on closing costs.</p>",
  inputs: [
    { id: "balance", label: "Remaining loan balance", type: "number", default: 300000, min: 0, step: 1000, prefix: "$" },
    { id: "curRate", label: "Current interest rate", type: "number", default: 7, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "curYears", label: "Years left on current loan", type: "number", default: 26, min: 1, max: 40, step: 1, suffix: "yr" },
    { id: "newRate", label: "New interest rate", type: "number", default: 5.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "newYears", label: "New loan term", type: "number", default: 30, min: 1, max: 40, step: 1, suffix: "yr" },
    { id: "closing", label: "Closing costs", type: "number", default: 5000, min: 0, step: 250, prefix: "$" },
  ],
  compute: function (v, ctx) {
    function pmt(bal, rate, months) {
      var r = rate / 100 / 12;
      return r === 0 ? bal / months : (bal * r) / (1 - Math.pow(1 + r, -months));
    }
    var curMonths = Math.round(v.curYears * 12);
    var newMonths = Math.round(v.newYears * 12);
    var curPmt = pmt(v.balance, v.curRate, curMonths);
    var newPmt = pmt(v.balance, v.newRate, newMonths);
    var monthlySavings = curPmt - newPmt;
    var curInterest = curPmt * curMonths - v.balance;
    var newInterest = newPmt * newMonths - v.balance + v.closing; // include closing in lifetime cost
    var breakEven = monthlySavings > 0 ? v.closing / monthlySavings : 0;
    var beYr = Math.floor(breakEven / 12), beMo = Math.round(breakEven % 12);

    return {
      summary: [
        { label: "Monthly savings", value: ctx.money(monthlySavings), primary: true },
        { label: "New monthly payment", value: ctx.money(newPmt) },
        {
          label: "Break-even",
          value: monthlySavings > 0 ? (beYr > 0 ? beYr + " yr " : "") + beMo + " mo" : "—",
        },
      ],
      table: {
        columns: ["", "Current", "Refinanced"],
        rows: [
          ["Monthly payment", ctx.money(curPmt), ctx.money(newPmt)],
          ["Remaining term", v.curYears + " yr", v.newYears + " yr"],
          ["Interest remaining", ctx.money(curInterest), ctx.money(newPmt * newMonths - v.balance)],
          ["Closing costs", "—", ctx.money(v.closing)],
          ["Lifetime cost (interest + closing)", ctx.money(curInterest), ctx.money(newInterest)],
        ],
      },
      note:
        monthlySavings <= 0
          ? "The new payment isn't lower — usually because the new term is shorter. A shorter term raises the payment but can cut total interest; check the lifetime-cost row."
          : "You'd save " +
            ctx.money(monthlySavings) +
            "/month and recover the " +
            ctx.money(v.closing) +
            " in closing costs in about " +
            (beYr > 0 ? beYr + " yr " : "") +
            beMo +
            " mo. Refinancing pays off if you'll stay past the break-even point.",
    };
  },
  content: `
    <h2>The break-even rule</h2>
    <p>Refinancing isn't free — you pay closing costs to get the new loan. The key question is the <strong>break-even point</strong>: how long it takes for your monthly savings to recover those costs. If you'll stay in the home well past break-even, refinancing usually makes sense. If you might move or refinance again before then, it may not.</p>
    <p>Break-even (in months) = closing costs ÷ monthly savings. Pay $5,000 to save $250/month and you break even in 20 months.</p>
    <h2>Watch the term reset</h2>
    <p>Refinancing into a fresh 30-year loan lowers the monthly payment partly because you're stretching the balance over more years. That can mean paying more <em>total</em> interest even at a lower rate. Compare the lifetime-cost row, and consider refinancing into a shorter term if you can afford the payment — you'll often save dramatically more.</p>
    <h2>When refinancing makes sense</h2>
    <ul>
      <li><strong>Rates have dropped</strong> meaningfully since you got your loan (often cited as ~0.5–1%+).</li>
      <li><strong>You'll stay</strong> in the home past the break-even point.</li>
      <li><strong>Your credit improved</strong>, qualifying you for a better rate than before.</li>
      <li><strong>You want to shorten the term</strong> to slash total interest, not just lower the payment.</li>
    </ul>
  `,
  faq: [
    {
      q: "How much does refinancing cost?",
      a: "Closing costs typically run about 2%–5% of the loan amount — lender fees, appraisal, title, and so on. Some lenders offer 'no-closing-cost' refinances, but they recover it through a higher rate, so compare carefully.",
    },
    {
      q: "Does refinancing reset my loan term?",
      a: "Usually yes — a new 30-year refinance restarts the clock. That lowers the payment but can increase total interest. Refinancing into a shorter term (like 15 or 20 years) avoids stretching the balance out again.",
    },
    {
      q: "Should I roll closing costs into the loan?",
      a: "You can, which avoids paying out of pocket, but it increases your balance and the interest you pay. This calculator assumes you pay closing costs separately when figuring the break-even.",
    },
  ],
  related: ["mortgage-calculator", "loan-calculator", "down-payment-calculator"],
  cta: { key: "mortgageRates", text: "Compare refinance rates" },
};
