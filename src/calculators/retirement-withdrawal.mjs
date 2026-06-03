export default {
  slug: "retirement-withdrawal-calculator",
  category: "retirement",
  title: "Retirement Withdrawal Calculator",
  metaTitle: "Retirement Withdrawal Calculator – How Long Will My Money Last?",
  metaDescription:
    "Free retirement withdrawal calculator. See how long your savings last given your monthly withdrawals, returns, and inflation. Instant results, no sign-up.",
  keywords: [
    "retirement withdrawal calculator",
    "how long will my money last",
    "retirement drawdown calculator",
    "savings withdrawal calculator",
  ],
  intro:
    "<p>Will your savings last through retirement? Enter your nest egg, how much you withdraw each month, and your expected return to see how many years the money lasts — with withdrawals rising each year to keep up with inflation.</p>",
  inputs: [
    { id: "balance", label: "Starting balance", type: "number", default: 600000, min: 0, step: 5000, prefix: "$" },
    { id: "monthly", label: "Monthly withdrawal", type: "number", default: 3000, min: 0, step: 100, prefix: "$" },
    { id: "rate", label: "Annual return in retirement", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "inflation", label: "Inflation (raises withdrawals)", type: "number", default: 2, min: 0, max: 30, step: 0.1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var r = v.rate / 100 / 12;
    var bal = v.balance;
    var w = v.monthly;
    var months = 0, totalWithdrawn = 0, guard = 0;
    var balByYear = [bal];
    while (bal > 0.005 && guard < 1200) {
      guard++; months++;
      bal = bal * (1 + r);
      var draw = Math.min(w, bal);
      bal -= draw;
      totalWithdrawn += draw;
      if (months % 12 === 0) {
        w = w * (1 + v.inflation / 100);
        balByYear.push(bal);
      }
    }
    var lasts = guard < 1200;
    var yr = Math.floor(months / 12), mo = months % 12;
    var timeStr = lasts ? (yr > 0 ? yr + " yr " : "") + mo + " mo" : "30+ yr";

    var labels = ["0"];
    for (var y = 1; y < balByYear.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Your money lasts", value: lasts ? timeStr.trim() : "Indefinitely", primary: true },
        { label: "Total withdrawn", value: ctx.money(totalWithdrawn) },
        { label: "Starting balance", value: ctx.money(v.balance) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Balance", color: "#dc2626", points: balByYear }],
      },
      note: !lasts
        ? "At this withdrawal rate, your returns cover the withdrawals — the balance is sustainable and isn't projected to run out."
        : yr < 30
        ? "This may not last a full retirement. Lowering the monthly withdrawal, even a little, can add many years."
        : "This is on track to last a typical 30-year retirement.",
    };
  },
  content: `
    <h2>The 4% rule, from the withdrawal side</h2>
    <p>A common starting point is to withdraw about 4% of your savings in the first year, then adjust for inflation each year after. On a $600,000 balance that's roughly $24,000 a year, or $2,000 a month. Withdraw much more than that and you risk running out; withdraw less and your money likely lasts indefinitely. Try different monthly amounts to find your sustainable rate.</p>
    <h2>What makes savings last longer</h2>
    <ul>
      <li><strong>A lower withdrawal rate</strong> is the most powerful lever — small cuts to spending dramatically extend how long the money lasts.</li>
      <li><strong>Flexibility:</strong> trimming withdrawals in years the market falls (rather than selling more to cover a fixed amount) protects the balance.</li>
      <li><strong>A sensible return:</strong> too aggressive risks big drops early in retirement; too conservative may not outpace inflation. Many retirees hold a balanced mix.</li>
    </ul>
    <h2>The risk to watch: early losses</h2>
    <p>A market downturn in the first few years of retirement is more damaging than the same drop later, because you're selling investments at low prices to fund withdrawals. This "sequence of returns" risk is why a cash cushion and withdrawal flexibility matter so much in early retirement.</p>
  `,
  faq: [
    {
      q: "Does this account for inflation?",
      a: "Yes. Your monthly withdrawal increases each year by the inflation rate you set, so the projection reflects keeping your purchasing power constant — which is how withdrawals work in real life.",
    },
    {
      q: "What return should I assume in retirement?",
      a: "Retirees often hold a more conservative mix than during their working years, so a return of around 4–6% is a common assumption. Using a cautious figure builds in a margin of safety.",
    },
    {
      q: "What if it says my money lasts indefinitely?",
      a: "That means your investment returns are covering your withdrawals, so the balance isn't projected to shrink to zero. It's a sign your withdrawal rate is comfortably sustainable — though real markets vary year to year.",
    },
  ],
  related: ["retirement-savings-calculator", "fire-calculator", "compound-interest-calculator"],
  cta: { key: "brokerage", text: "Open a retirement account" },
};
