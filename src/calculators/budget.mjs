export default {
  slug: "budget-calculator",
  category: "budgeting",
  title: "Budget Calculator (50/30/20)",
  metaTitle: "50/30/20 Budget Calculator – Split Your Income",
  metaDescription:
    "Free 50/30/20 budget calculator. Split your monthly take-home pay into needs, wants, and savings to build a simple, balanced budget. Instant, no sign-up.",
  keywords: [
    "budget calculator",
    "50/30/20 budget calculator",
    "50 30 20 rule",
    "monthly budget calculator",
  ],
  intro:
    "<p>The 50/30/20 rule is the simplest budget that works: 50% of your take-home pay for needs, 30% for wants, and 20% for savings and debt payoff. Enter your monthly take-home pay to see your targets.</p>",
  inputs: [
    { id: "income", label: "Monthly take-home pay", type: "number", default: 4000, min: 0, step: 100, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var needs = v.income * 0.5;
    var wants = v.income * 0.3;
    var savings = v.income * 0.2;
    return {
      summary: [
        { label: "Needs (50%)", value: ctx.money(needs), primary: true },
        { label: "Wants (30%)", value: ctx.money(wants) },
        { label: "Savings & debt (20%)", value: ctx.money(savings) },
      ],
      table: {
        columns: ["Category", "Share", "Monthly"],
        rows: [
          ["Needs — housing, food, utilities, insurance, minimum debt payments", "50%", ctx.money(needs)],
          ["Wants — dining out, entertainment, travel, subscriptions", "30%", ctx.money(wants)],
          ["Savings & extra debt payoff — emergency fund, investing, paying down loans faster", "20%", ctx.money(savings)],
          ["Total", "100%", ctx.money(v.income)],
        ],
      },
    };
  },
  content: `
    <h2>What goes in each bucket</h2>
    <ul>
      <li><strong>50% Needs:</strong> the essentials you can't skip — rent or mortgage, groceries, utilities, transportation, insurance, and the minimum payments on any debt.</li>
      <li><strong>30% Wants:</strong> the lifestyle spending that makes life enjoyable — restaurants, streaming, hobbies, travel, and upgrades you could live without.</li>
      <li><strong>20% Savings &amp; debt:</strong> building your emergency fund, investing for the future, and any <em>extra</em> debt payments beyond the minimums.</li>
    </ul>
    <h2>Why it works</h2>
    <p>Most budgets fail because they're too detailed to maintain. The 50/30/20 rule gives you just three numbers to watch, which is easy to stick with. It's based on take-home (after-tax) pay, so it reflects the money you can actually spend.</p>
    <h2>Adjusting the rule</h2>
    <p>The percentages are a starting point, not a law. In high-cost areas, needs may exceed 50% — in that case, trim wants rather than savings if you can. If you're chasing a big goal or paying off high-interest debt, flip toward saving more than 20%. Use the <a href="{{base}}/emergency-fund-calculator/">emergency fund</a> and <a href="{{base}}/savings-goal-calculator/">savings goal</a> calculators to put that 20% to work.</p>
  `,
  faq: [
    {
      q: "Should I use gross or take-home pay?",
      a: "Take-home (after-tax) pay. The 50/30/20 rule budgets the money that actually lands in your account, since taxes are already spoken for.",
    },
    {
      q: "What if my needs are more than 50%?",
      a: "That's common in expensive cities. Try to keep savings near 20% and trim the wants bucket first. Over time, increasing income or reducing fixed costs (like housing) brings needs back toward 50%.",
    },
    {
      q: "Does debt go in needs or savings?",
      a: "Minimum required payments are a 'need.' Any extra you pay to clear debt faster counts in the 20% savings-and-debt bucket, since paying down debt builds your net worth.",
    },
  ],
  related: ["hourly-to-salary-calculator", "emergency-fund-calculator", "savings-goal-calculator"],
};
