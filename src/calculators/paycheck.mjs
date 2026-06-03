export default {
  slug: "take-home-pay-calculator",
  category: "budgeting",
  title: "Take-Home Pay Calculator",
  metaTitle: "Take-Home Pay Calculator – 2026 Paycheck After Taxes",
  metaDescription:
    "Free take-home pay calculator using 2026 US federal tax brackets, Social Security, and Medicare. Estimate your paycheck after taxes and 401(k). No sign-up.",
  keywords: [
    "take home pay calculator",
    "paycheck calculator",
    "salary after tax calculator",
    "net pay calculator 2026",
  ],
  intro:
    "<p>Estimate your real paycheck after taxes. This uses 2026 US federal tax brackets, Social Security, and Medicare, plus your pre-tax 401(k) and an estimated state rate, to show your annual, monthly, and bi-weekly take-home pay.</p>",
  inputs: [
    { id: "salary", label: "Annual gross salary", type: "number", default: 75000, min: 0, step: 1000, prefix: "$" },
    {
      id: "status",
      label: "Filing status",
      type: "select",
      default: "single",
      options: [
        { value: "single", label: "Single" },
        { value: "married", label: "Married filing jointly" },
      ],
    },
    { id: "pretax", label: "Pre-tax 401(k)", type: "number", default: 6, min: 0, max: 90, step: 1, suffix: "%" },
    { id: "stateTax", label: "State income tax (est.)", type: "number", default: 5, min: 0, max: 15, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var gross = v.salary;
    var married = v.status === "married";
    var pretaxAmt = gross * (v.pretax / 100);
    var stdDed = married ? 32200 : 16100;
    var taxable = Math.max(0, gross - pretaxAmt - stdDed);

    var brackets = married
      ? [[0, 0.1], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]]
      : [[0, 0.1], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]];
    var fed = 0;
    for (var i = 0; i < brackets.length; i++) {
      var lo = brackets[i][0];
      var hi = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
      if (taxable > lo) fed += (Math.min(taxable, hi) - lo) * brackets[i][1];
    }

    var ss = Math.min(gross, 176100) * 0.062;
    var medicare = gross * 0.0145;
    var addlThreshold = married ? 250000 : 200000;
    if (gross > addlThreshold) medicare += (gross - addlThreshold) * 0.009;
    var fica = ss + medicare;

    var state = (gross - pretaxAmt) * (v.stateTax / 100);
    var totalTax = fed + fica + state;
    var net = gross - pretaxAmt - totalTax;
    var effRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    return {
      summary: [
        { label: "Take-home pay (year)", value: ctx.money(net), primary: true },
        { label: "Per month", value: ctx.money(net / 12) },
        { label: "Effective tax rate", value: ctx.pct(effRate) },
      ],
      table: {
        columns: ["", "Amount"],
        rows: [
          ["Gross salary", ctx.money(gross)],
          ["Pre-tax 401(k)", "−" + ctx.money(pretaxAmt)],
          ["Federal income tax", "−" + ctx.money(fed)],
          ["Social Security", "−" + ctx.money(ss)],
          ["Medicare", "−" + ctx.money(medicare)],
          ["State income tax (est.)", "−" + ctx.money(state)],
          ["Take-home (annual)", ctx.money(net)],
          ["Take-home (monthly)", ctx.money(net / 12)],
          ["Take-home (bi-weekly)", ctx.money(net / 26)],
        ],
      },
      note:
        "Estimate using 2026 US federal tax brackets, Social Security (6.2% to $176,100), and Medicare (1.45%). State tax is the flat rate you enter — actual state and local taxes vary. Doesn't include other deductions or tax credits.",
    };
  },
  content: `
    <h2>Why your take-home is smaller than your salary</h2>
    <p>Several things come out of your gross pay before it reaches your account: federal income tax, Social Security and Medicare (FICA), state and sometimes local income tax, and any pre-tax contributions like a 401(k) or health insurance. Together these can easily take 25%–35% of a paycheck, which is why your "effective tax rate" — total tax divided by gross — is the number that really matters for budgeting.</p>
    <h2>Marginal vs. effective tax rate</h2>
    <p>The US uses progressive brackets, so only the income <em>within</em> each bracket is taxed at that rate. Earning into the 22% bracket doesn't tax all your income at 22% — just the portion above the bracket's threshold. That's why your effective rate is always lower than your top (marginal) rate.</p>
    <h2>How to keep more of your pay</h2>
    <ul>
      <li><strong>Pre-tax contributions</strong> to a 401(k) or HSA lower your taxable income, reducing federal (and usually state) tax today.</li>
      <li><strong>Capture your employer match</strong> — it's extra compensation that doesn't show in base salary.</li>
      <li><strong>Mind your state.</strong> State income tax ranges from 0% to over 13%. It's often a real factor in where take-home pay goes furthest.</li>
    </ul>
  `,
  faq: [
    {
      q: "How accurate is this?",
      a: "It's a solid estimate using 2026 federal brackets, the standard deduction, Social Security, and Medicare. It can't capture every detail — itemized deductions, tax credits, local taxes, and the exact rules of your state — so treat it as a close approximation, not an official figure.",
    },
    {
      q: "Does the 401(k) reduce all my taxes?",
      a: "Pre-tax 401(k) contributions lower your federal (and usually state) income tax, but they do NOT reduce Social Security and Medicare taxes, which are calculated on your full gross pay.",
    },
    {
      q: "Why enter state tax manually?",
      a: "State income taxes vary enormously — from zero in several states to progressive systems over 13% elsewhere. A single flat field you control keeps the estimate simple; enter your state's approximate effective rate, or 0 if your state has no income tax.",
    },
  ],
  related: ["hourly-to-salary-calculator", "pay-raise-calculator", "budget-calculator"],
};
