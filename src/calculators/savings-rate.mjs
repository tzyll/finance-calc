export default {
  slug: "savings-rate-calculator",
  category: "saving",
  title: "Savings Rate Calculator",
  metaTitle: "Savings Rate Calculator – Years to Financial Independence",
  metaDescription:
    "Free savings rate calculator. Find what percentage of your income you save and how many years until financial independence at that rate. No sign-up.",
  keywords: [
    "savings rate calculator",
    "how much should i save",
    "savings rate financial independence",
    "years to retire savings rate",
  ],
  intro:
    "<p>Your savings rate — the share of your income you save — is the single biggest factor in how soon you could reach financial independence. Enter your income and savings to see your rate and an estimate of how many years until work becomes optional.</p>",
  inputs: [
    { id: "income", label: "Monthly take-home income", type: "number", default: 5000, min: 0, step: 100, prefix: "$" },
    { id: "savings", label: "Monthly amount saved", type: "number", default: 1000, min: 0, step: 50, prefix: "$" },
    { id: "rate", label: "Investment return (after inflation)", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var savingsRate = v.income > 0 ? (v.savings / v.income) * 100 : 0;
    var annualExpenses = Math.max(0, (v.income - v.savings) * 12);
    var annualSavings = v.savings * 12;
    var fiNumber = annualExpenses * 25; // 4% rule
    var r = v.rate / 100;
    var bal = 0, years = 0, guard = 0;
    var balByYear = [0];
    if (annualSavings > 0 && fiNumber > 0) {
      while (bal < fiNumber && guard < 100) {
        guard++; years++;
        bal = bal * (1 + r) + annualSavings;
        balByYear.push(bal);
      }
    }
    var reached = fiNumber === 0 || (annualSavings > 0 && bal >= fiNumber);
    var fiStr = fiNumber === 0 ? "Already there" : reached ? years + " yr" : "—";

    var labels = ["0"];
    for (var y = 1; y < balByYear.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Your savings rate", value: ctx.pct(savingsRate), primary: true },
        { label: "Years to financial independence", value: fiStr },
        { label: "FI number (25× expenses)", value: ctx.money(fiNumber) },
      ],
      chart: reached && fiNumber > 0 ? {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Investments", color: "#059669", points: balByYear }],
      } : null,
      note:
        v.savings <= 0
          ? "At a 0% savings rate, financial independence never arrives. Even saving 10% starts the clock."
          : "The math is striking: at a 50% savings rate you can reach independence in roughly 15–17 years, while a 10% rate takes 40+ — because saving more both builds your fund faster and lowers the number you need.",
    };
  },
  content: `
    <h2>Why savings rate beats income</h2>
    <p>It's tempting to think a bigger salary is the key to retiring early, but the percentage you <em>save</em> matters far more. A high savings rate does double duty: it builds your nest egg faster <strong>and</strong> proves you can live on less, which lowers the amount you need (your "FI number" is 25× your annual spending). Two people with the same income but different savings rates reach financial independence decades apart.</p>
    <h2>Rough years-to-independence by savings rate</h2>
    <ul>
      <li><strong>10% saved →</strong> roughly 40+ years</li>
      <li><strong>25% saved →</strong> roughly 30 years</li>
      <li><strong>50% saved →</strong> roughly 15–17 years</li>
      <li><strong>65% saved →</strong> roughly 10 years</li>
    </ul>
    <p>(These assume you invest the difference at a moderate real return and live off 4% afterward.)</p>
    <h2>How to raise your rate</h2>
    <ul>
      <li><strong>Attack big fixed costs</strong> — housing and transportation move the needle most.</li>
      <li><strong>Bank your raises</strong> instead of inflating your lifestyle, and your rate climbs automatically.</li>
      <li><strong>Automate it</strong> so saving happens before spending.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should I use gross or take-home income?",
      a: "Take-home (after-tax) income gives the most realistic savings rate, since that's the money you actually decide how to use. Be consistent — compare savings to whichever income figure you choose.",
    },
    {
      q: "Why does saving more shorten the timeline so dramatically?",
      a: "Two effects stack: higher savings grows your investments faster, and spending less lowers the target you need (25× a smaller number). Together they compress the years far more than a higher income alone would.",
    },
    {
      q: "Is the years-to-FI estimate guaranteed?",
      a: "No — it assumes a steady real return and the 4% withdrawal rule. Real markets vary, and life changes. Treat it as a motivating estimate that shows the power of your savings rate, not a promise.",
    },
  ],
  related: ["fire-calculator", "budget-calculator", "investment-calculator"],
  cta: { key: "brokerage", text: "Open an investing account" },
};
