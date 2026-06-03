export default {
  slug: "rent-affordability-calculator",
  category: "budgeting",
  title: "Rent Affordability Calculator",
  metaTitle: "Rent Affordability Calculator – How Much Rent Can I Afford?",
  metaDescription:
    "Free rent affordability calculator. See how much rent you can afford on your income using the 30% rule, with conservative and stretch ranges. No sign-up.",
  keywords: [
    "rent affordability calculator",
    "how much rent can i afford",
    "rent calculator",
    "30 percent rule rent",
  ],
  intro:
    "<p>How much rent can you comfortably afford? The common guideline is to keep rent under 30% of your gross income. Enter your income to see your recommended maximum, plus conservative and stretch ranges — and the income most landlords require.</p>",
  inputs: [
    { id: "income", label: "Gross annual income", type: "number", default: 60000, min: 0, step: 1000, prefix: "$" },
    { id: "debts", label: "Monthly debt payments", type: "number", default: 300, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var monthlyGross = v.income / 12;
    var rent30 = monthlyGross * 0.3;
    var rent25 = monthlyGross * 0.25;
    var rent35 = monthlyGross * 0.35;
    // A debt-aware ceiling: total of rent + debts under ~36% of gross
    var debtAware = Math.max(0, monthlyGross * 0.36 - v.debts);
    var recommended = Math.min(rent30, debtAware);
    return {
      summary: [
        { label: "Recommended max rent", value: ctx.money(recommended), primary: true },
        { label: "Conservative (25%)", value: ctx.money(rent25) },
        { label: "Stretch (35%)", value: ctx.money(rent35) },
      ],
      table: {
        columns: ["Guideline", "Monthly rent"],
        rows: [
          ["Gross monthly income", ctx.money(monthlyGross)],
          ["Conservative — 25% of income", ctx.money(rent25)],
          ["Standard — 30% of income", ctx.money(rent30)],
          ["Stretch — 35% of income", ctx.money(rent35)],
          ["Debt-aware ceiling (rent + debts ≤ 36%)", ctx.money(debtAware)],
          ["Income landlords often require (3× rent)", ctx.money(rent30 * 3) + "+"],
        ],
      },
      note:
        debtAware < rent30
          ? "Your existing debts pull your realistic ceiling below the 30% guideline. Recommended max reflects keeping rent plus debts under 36% of income."
          : "Many landlords require your gross income to be at least 3× the monthly rent, which lines up with the 30% guideline. Lower rent leaves more room to save.",
    };
  },
  content: `
    <h2>The 30% rule</h2>
    <p>A long-standing guideline says housing should take no more than <strong>30% of your gross (pre-tax) income</strong>. On a $60,000 salary — $5,000 a month — that's about $1,500 in rent. It's a rule of thumb, not a law: in expensive cities many people spend more, and the rule doesn't account for your other debts, which is why this calculator also shows a debt-aware ceiling.</p>
    <h2>Why landlords look for "3× rent"</h2>
    <p>Many landlords require your gross monthly income to be at least three times the rent — the same math as the 30% rule from the other direction. If you're near the limit, a larger security deposit, a guarantor, or a roommate can help you qualify.</p>
    <h2>Spending less leaves room for everything else</h2>
    <ul>
      <li><strong>Under the 30% line</strong> frees up money for saving, investing, and emergencies — the difference between getting ahead and just keeping up.</li>
      <li><strong>Count the extras:</strong> utilities, renters insurance, parking, and commuting add to your true housing cost.</li>
      <li><strong>Stretching to 35%+</strong> can work short-term, but it leaves little cushion if your income dips or a surprise expense hits.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should rent be based on gross or net income?",
      a: "The 30% rule traditionally uses gross (pre-tax) income, which is also what landlords check. If you'd rather budget from take-home pay, aim to keep rent under about 25% of your net income for similar breathing room.",
    },
    {
      q: "Is it bad to spend more than 30% on rent?",
      a: "Not necessarily — in high-cost cities it's common. But the more you spend on rent, the less is left for saving, debt payoff, and emergencies, so try to make up for it by keeping other spending lean.",
    },
    {
      q: "Does this include utilities?",
      a: "No, it's the rent figure itself. Remember to budget separately for utilities, internet, renters insurance, and any parking or fees, which add to your real monthly housing cost.",
    },
  ],
  related: ["take-home-pay-calculator", "budget-calculator", "rent-vs-buy-calculator"],
};
