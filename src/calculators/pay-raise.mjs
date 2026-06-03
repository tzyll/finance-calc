export default {
  slug: "pay-raise-calculator",
  category: "budgeting",
  title: "Pay Raise Calculator",
  metaTitle: "Pay Raise Calculator – New Salary & Real (After-Inflation) Raise",
  metaDescription:
    "Free pay raise calculator. See your new salary, the increase per paycheck, and your real raise after inflation. Instant results, no sign-up.",
  keywords: [
    "pay raise calculator",
    "salary increase calculator",
    "raise calculator",
    "real raise after inflation",
  ],
  intro:
    "<p>See what a raise really means. Enter your current salary and the raise percentage to find your new pay, the increase per month and paycheck, and — crucially — your <em>real</em> raise after inflation.</p>",
  inputs: [
    { id: "salary", label: "Current salary", type: "number", default: 60000, min: 0, step: 1000, prefix: "$" },
    { id: "raise", label: "Raise", type: "number", default: 4, min: -50, max: 200, step: 0.5, suffix: "%" },
    { id: "inflation", label: "Inflation rate", type: "number", default: 3, min: 0, max: 50, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var newSalary = v.salary * (1 + v.raise / 100);
    var increase = newSalary - v.salary;
    var realRaise = ((1 + v.raise / 100) / (1 + v.inflation / 100) - 1) * 100;
    return {
      summary: [
        { label: "New salary", value: ctx.money(newSalary), primary: true },
        { label: "Annual increase", value: ctx.money(increase) },
        { label: "Real raise (after inflation)", value: ctx.pct(realRaise) },
      ],
      table: {
        columns: ["Per period", "Before", "After", "Increase"],
        rows: [
          ["Per year", ctx.money(v.salary), ctx.money(newSalary), ctx.money(increase)],
          ["Per month", ctx.money(v.salary / 12), ctx.money(newSalary / 12), ctx.money(increase / 12)],
          ["Per paycheck (bi-weekly)", ctx.money(v.salary / 26), ctx.money(newSalary / 26), ctx.money(increase / 26)],
        ],
      },
      note:
        realRaise < 0
          ? "This raise is below inflation, so in real terms your purchasing power actually falls — it's effectively a pay cut."
          : realRaise < 1
          ? "After inflation this raise barely moves your purchasing power. Worth keeping in mind when negotiating."
          : "After inflation you're genuinely ahead by about " + ctx.pct(realRaise) + " in purchasing power.",
    };
  },
  content: `
    <h2>Why your "real" raise is the number that matters</h2>
    <p>A raise feels good, but inflation quietly eats into it. If you get a 3% raise in a year when prices rise 3%, your paycheck is bigger but it buys exactly the same amount — your real raise is roughly zero. Only the portion of a raise <em>above</em> inflation actually increases what you can afford. That's why this calculator shows both the headline number and the real, after-inflation raise.</p>
    <h2>Using this when you negotiate</h2>
    <ul>
      <li><strong>Anchor to inflation.</strong> If inflation was 4%, a 4% raise just keeps you even. Frame your ask as the real increase you want, on top of inflation.</li>
      <li><strong>Think in total compensation.</strong> Bonuses, a better 401(k) match, or extra time off all add value beyond base salary.</li>
      <li><strong>Compound it forward.</strong> Raises build on each other, so a slightly higher percentage now lifts every future paycheck — and the raises calculated off it.</li>
    </ul>
    <h2>What to do with the extra money</h2>
    <p>To avoid lifestyle creep, decide where a raise goes before it hits your account. Directing even half of each raise to saving or investing lets your income grow your wealth, not just your spending.</p>
  `,
  faq: [
    {
      q: "Is this gross or take-home pay?",
      a: "It's based on gross salary. Your take-home increase will be a bit smaller because part of any raise goes to taxes and any percentage-based deductions like retirement contributions.",
    },
    {
      q: "What inflation rate should I use?",
      a: "Use the recent annual inflation figure for your country, or the rate you expect over the coming year. Long-run inflation in many economies has averaged around 2–3%, but it varies.",
    },
    {
      q: "How do I calculate a raise to a specific new salary?",
      a: "Adjust the raise percentage until the 'New salary' matches your target. The raise percent equals (new ÷ current − 1) × 100.",
    },
  ],
  related: ["hourly-to-salary-calculator", "budget-calculator", "inflation-calculator"],
};
