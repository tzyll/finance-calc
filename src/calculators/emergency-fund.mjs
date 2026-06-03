export default {
  slug: "emergency-fund-calculator",
  category: "saving",
  title: "Emergency Fund Calculator",
  metaTitle: "Emergency Fund Calculator – How Much to Save",
  metaDescription:
    "Free emergency fund calculator. Find your target safety net from your monthly expenses, see the gap, and how long to reach it. Instant, no sign-up.",
  keywords: [
    "emergency fund calculator",
    "how much emergency fund",
    "rainy day fund calculator",
    "savings safety net",
  ],
  intro:
    "<p>An emergency fund is cash set aside for life's surprises — a job loss, a medical bill, a car repair. Enter your monthly expenses to find your target, see how far along you are, and how long it'll take to finish.</p>",
  inputs: [
    { id: "expenses", label: "Monthly expenses", type: "number", default: 3500, min: 0, step: 100, prefix: "$" },
    { id: "months", label: "Months of coverage", type: "number", default: 6, min: 1, max: 24, step: 1, suffix: "mo" },
    { id: "saved", label: "Already saved", type: "number", default: 2000, min: 0, step: 100, prefix: "$" },
    { id: "monthly", label: "Monthly saving", type: "number", default: 400, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var target = v.expenses * v.months;
    var gap = Math.max(0, target - v.saved);
    var monthsToReach = v.monthly > 0 ? Math.ceil(gap / v.monthly) : 0;
    var timeStr;
    if (gap <= 0) timeStr = "Reached";
    else if (v.monthly <= 0) timeStr = "—";
    else {
      var yr = Math.floor(monthsToReach / 12);
      var mo = monthsToReach % 12;
      timeStr = (yr > 0 ? yr + " yr " : "") + mo + " mo";
    }

    var pts = [Math.min(v.saved, target)];
    var labels = ["0"];
    var bal = v.saved;
    var cap = Math.min(monthsToReach || 0, 240);
    for (var m = 1; m <= cap; m++) {
      bal = Math.min(target, bal + v.monthly);
      if (m % Math.max(1, Math.ceil(cap / 12)) === 0 || m === cap) {
        pts.push(bal);
        labels.push(String(m));
      }
    }

    return {
      summary: [
        { label: "Target fund", value: ctx.money(target), primary: true },
        { label: gap > 0 ? "Still needed" : "Surplus", value: ctx.money(gap > 0 ? gap : v.saved - target) },
        { label: "Time to reach", value: timeStr },
      ],
      chart:
        gap > 0 && v.monthly > 0
          ? {
              yFormat: "money",
              xLabel: "Months",
              xLabels: labels,
              series: [{ name: "Emergency fund", color: "#0891b2", points: pts }],
            }
          : null,
      note:
        gap <= 0
          ? "You've already hit your target — nicely done. Consider investing savings beyond this."
          : v.monthly <= 0
          ? "Set a monthly saving amount to see how long it takes to reach your target."
          : "",
    };
  },
  content: `
    <h2>How big should your emergency fund be?</h2>
    <p>The common guideline is <strong>3 to 6 months</strong> of essential expenses. Lean toward 3 months if you have very stable income and few dependents; lean toward 6+ months if your income is variable, you're self-employed, or you're a household's sole earner. The point is to cover the basics — housing, food, utilities, insurance — not your entire lifestyle.</p>
    <h2>Where to keep it</h2>
    <p>An emergency fund's job is to be safe and instantly available, not to earn big returns. A high-yield savings account is ideal: it stays liquid, is protected at insured banks, and still earns some interest. Don't invest your emergency fund in the stock market, where it could drop right when you need it.</p>
    <h2>Building it without feeling the pinch</h2>
    <ul>
      <li><strong>Automate a weekly or monthly transfer</strong> so it grows without willpower.</li>
      <li><strong>Start with a $1,000 starter fund</strong> for small emergencies, then build toward the full target.</li>
      <li><strong>Funnel windfalls in</strong> — tax refunds, bonuses, and gifts can jump-start the fund fast.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should I build an emergency fund or pay off debt first?",
      a: "A common approach is to save a small starter fund (around $1,000) first, then aggressively pay off high-interest debt, then return to fully funding 3–6 months. The starter fund keeps a surprise from sending you deeper into debt.",
    },
    {
      q: "Should the fund cover all my spending or just essentials?",
      a: "Base it on essential expenses — the bills you must pay if income stops. You'd naturally cut discretionary spending in a real emergency, so including it just makes the target harder to reach.",
    },
    {
      q: "Where should I keep my emergency fund?",
      a: "In a safe, liquid account such as a high-yield savings or money-market account. Avoid investing it in stocks; the value could fall exactly when you need the cash.",
    },
  ],
  related: ["savings-goal-calculator", "compound-interest-calculator"],
};
