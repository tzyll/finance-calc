export default {
  slug: "debt-to-income-ratio-calculator",
  category: "borrowing",
  title: "Debt-to-Income (DTI) Ratio Calculator",
  metaTitle: "Debt-to-Income Ratio Calculator – DTI for Loan Approval",
  metaDescription:
    "Free debt-to-income ratio calculator. Find your front-end and back-end DTI — the number lenders use to approve mortgages and loans. Instant, no sign-up.",
  keywords: [
    "debt to income ratio calculator",
    "dti calculator",
    "dti ratio",
    "debt to income mortgage",
  ],
  intro:
    "<p>Your debt-to-income (DTI) ratio is the key number lenders use to decide how much you can borrow. Enter your monthly income and debt payments to see your DTI and where you stand against common lending limits.</p>",
  inputs: [
    { id: "income", label: "Gross monthly income", type: "number", default: 6000, min: 0, step: 100, prefix: "$" },
    { id: "housing", label: "Housing payment (rent/mortgage)", type: "number", default: 1600, min: 0, step: 50, prefix: "$" },
    { id: "car", label: "Car / auto loans", type: "number", default: 400, min: 0, step: 25, prefix: "$" },
    { id: "student", label: "Student loans", type: "number", default: 250, min: 0, step: 25, prefix: "$" },
    { id: "creditCard", label: "Credit card minimums", type: "number", default: 150, min: 0, step: 25, prefix: "$" },
    { id: "other", label: "Other monthly debt", type: "number", default: 0, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var debts = v.car + v.student + v.creditCard + v.other;
    var totalDebt = v.housing + debts;
    var backEnd = v.income > 0 ? (totalDebt / v.income) * 100 : 0;
    var frontEnd = v.income > 0 ? (v.housing / v.income) * 100 : 0;
    var status =
      backEnd <= 36
        ? "Healthy — at or below 36%, which most lenders consider strong."
        : backEnd <= 43
        ? "Manageable — under 43%, the common ceiling for a qualified mortgage, but lower is better."
        : "High — above 43%, which makes loan approval harder. Paying down debt or raising income would help.";
    return {
      summary: [
        { label: "Back-end DTI (all debt)", value: ctx.pct(backEnd), primary: true },
        { label: "Front-end DTI (housing)", value: ctx.pct(frontEnd) },
        { label: "Total monthly debt", value: ctx.money(totalDebt) },
      ],
      table: {
        columns: ["Item", "Monthly"],
        rows: [
          ["Gross monthly income", ctx.money(v.income)],
          ["Housing payment", ctx.money(v.housing)],
          ["Car loans", ctx.money(v.car)],
          ["Student loans", ctx.money(v.student)],
          ["Credit card minimums", ctx.money(v.creditCard)],
          ["Other debt", ctx.money(v.other)],
          ["Total debt payments", ctx.money(totalDebt)],
        ],
      },
      note: status,
    };
  },
  content: `
    <h2>Front-end vs. back-end DTI</h2>
    <p>Lenders look at two versions of the ratio:</p>
    <ul>
      <li><strong>Front-end DTI</strong> is just your housing payment divided by gross monthly income. Many lenders like to see this under about 28%.</li>
      <li><strong>Back-end DTI</strong> adds <em>all</em> your monthly debt payments — housing plus car, student loans, credit card minimums, and other loans. This is the headline number, and it's usually the one that decides your approval.</li>
    </ul>
    <h2>What's a good DTI?</h2>
    <p>As a rough guide: <strong>36% or below</strong> is considered strong, up to <strong>43%</strong> is the common maximum for a "qualified mortgage," and above 43% makes borrowing harder (though some loan programs allow more). Note that DTI uses <em>gross</em> income and the minimum payments on debts, not your total balances.</p>
    <h2>How to improve your DTI</h2>
    <ul>
      <li><strong>Pay down debt</strong>, starting with the payments that are largest relative to their balance — this directly lowers the ratio.</li>
      <li><strong>Avoid new loans</strong> before a mortgage application; a new car payment can push you over a limit.</li>
      <li><strong>Increase income</strong>, since DTI is a ratio — a raise or side income lowers it even if your debts stay the same.</li>
    </ul>
  `,
  faq: [
    {
      q: "Does DTI use gross or net income?",
      a: "Gross (pre-tax) monthly income. Lenders calculate DTI on gross income, so use your salary before taxes and deductions here.",
    },
    {
      q: "What debts count in DTI?",
      a: "Recurring debt obligations: your housing payment, car loans, student loans, minimum credit card payments, personal loans, and similar. Everyday expenses like groceries, utilities, and subscriptions are not included.",
    },
    {
      q: "Why does my DTI matter so much for a mortgage?",
      a: "It's a quick measure of how much of your income is already committed to debt. A lower DTI signals you can comfortably take on a mortgage payment, which is why it heavily influences how much a lender will offer.",
    },
  ],
  related: ["mortgage-calculator", "debt-payoff-calculator", "credit-card-payoff-calculator"],
  cta: { key: "mortgageRates", text: "Compare today's mortgage rates" },
};
