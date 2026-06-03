export default {
  slug: "hourly-to-salary-calculator",
  category: "budgeting",
  title: "Hourly to Salary Calculator",
  metaTitle: "Hourly to Salary Calculator – Convert Pay to Annual Income",
  metaDescription:
    "Free hourly to salary calculator. Convert an hourly wage to weekly, monthly, and annual pay (and back) based on your hours and weeks worked. No sign-up.",
  keywords: [
    "hourly to salary calculator",
    "hourly to annual salary",
    "wage to salary calculator",
    "annual income calculator",
  ],
  intro:
    "<p>Convert an hourly wage into weekly, monthly, and yearly pay. Enter your hourly rate and how many hours you work to see your income across every pay period. (This shows gross pay, before taxes and deductions.)</p>",
  inputs: [
    { id: "hourly", label: "Hourly rate", type: "number", default: 25, min: 0, step: 0.5, prefix: "$" },
    { id: "hours", label: "Hours per week", type: "number", default: 40, min: 0, max: 168, step: 1, suffix: "hr" },
    { id: "weeks", label: "Weeks worked per year", type: "number", default: 52, min: 1, max: 52, step: 1, suffix: "wk" },
  ],
  compute: function (v, ctx) {
    var weekly = v.hourly * v.hours;
    var annual = weekly * v.weeks;
    var monthly = annual / 12;
    var biweekly = weekly * 2;
    var daysPerWeek = v.hours >= 40 ? 5 : Math.max(1, Math.round(v.hours / 8));
    var daily = weekly / daysPerWeek;
    return {
      summary: [
        { label: "Annual (gross)", value: ctx.money(annual), primary: true },
        { label: "Monthly", value: ctx.money(monthly) },
        { label: "Weekly", value: ctx.money(weekly) },
      ],
      table: {
        columns: ["Pay period", "Gross pay"],
        rows: [
          ["Hourly", ctx.money(v.hourly)],
          ["Daily", ctx.money(daily)],
          ["Weekly", ctx.money(weekly)],
          ["Bi-weekly", ctx.money(biweekly)],
          ["Monthly", ctx.money(monthly)],
          ["Annual", ctx.money(annual)],
        ],
      },
    };
  },
  content: `
    <h2>How the conversion works</h2>
    <p>The math is simple: <code>Annual = hourly rate × hours per week × weeks worked</code>. From there, monthly is the annual divided by 12, and bi-weekly is two weeks of pay. The two inputs that trip people up are hours per week (part-time changes everything) and weeks worked — if you take unpaid time off, drop below 52 weeks.</p>
    <h2>Gross vs. take-home pay</h2>
    <p>These figures are <strong>gross</strong> — your pay before taxes, retirement contributions, and benefits are deducted. Your actual take-home pay will be lower; how much lower depends on your tax situation, where you live, and what you contribute to things like a 401(k) or health insurance.</p>
    <h2>Quick mental shortcut</h2>
    <p>For a standard 40-hour week, a handy estimate is: <strong>hourly rate × 2 ≈ annual salary in thousands</strong>. So $25/hour is roughly a $50,000 salary, and $40/hour is roughly $80,000. It's not exact (it assumes ~50 weeks), but it's close enough for a gut check.</p>
  `,
  faq: [
    {
      q: "Why is my take-home pay lower than this?",
      a: "This calculator shows gross pay — income before deductions. Taxes (federal, state, local), Social Security and Medicare, retirement contributions, and insurance premiums all come out before the money hits your account.",
    },
    {
      q: "How many weeks should I enter?",
      a: "Use 52 if you're paid for every week including vacation. If you take unpaid time off or work seasonally, lower the number to match the weeks you're actually paid.",
    },
    {
      q: "Does this handle overtime?",
      a: "Not automatically. For a rough overtime estimate, you can raise the hourly rate or hours to reflect time-and-a-half pay, but the result will be an approximation.",
    },
  ],
  related: ["budget-calculator", "net-worth-calculator"],
};
