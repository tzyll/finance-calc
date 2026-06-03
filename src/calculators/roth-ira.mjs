export default {
  slug: "roth-ira-calculator",
  category: "retirement",
  title: "Roth IRA Calculator",
  metaTitle: "Roth IRA Calculator – Tax-Free Growth & Tax Savings",
  metaDescription:
    "Free Roth IRA calculator. Project your tax-free balance at retirement and see how much you save versus a taxable account. Instant results, no sign-up.",
  keywords: [
    "roth ira calculator",
    "roth ira growth calculator",
    "roth ira retirement calculator",
    "tax free retirement calculator",
  ],
  intro:
    "<p>A Roth IRA grows tax-free, and qualified withdrawals in retirement aren't taxed at all. Enter your contributions and timeline to project your balance — and see how much you'd save compared with the same investments in a taxable account.</p>",
  inputs: [
    { id: "currentAge", label: "Current age", type: "number", default: 30, min: 16, max: 90, step: 1, suffix: "yr" },
    { id: "retireAge", label: "Retirement age", type: "number", default: 65, min: 18, max: 95, step: 1, suffix: "yr" },
    { id: "balance", label: "Current Roth balance", type: "number", default: 10000, min: 0, step: 1000, prefix: "$" },
    { id: "annual", label: "Annual contribution", type: "number", default: 7000, min: 0, step: 500, prefix: "$" },
    { id: "rate", label: "Annual return", type: "number", default: 7, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "taxRate", label: "Tax rate on gains", type: "number", default: 15, min: 0, max: 60, step: 1, suffix: "%", help: "Capital-gains rate used for the taxable-account comparison." },
  ],
  compute: function (v, ctx) {
    var years = Math.max(0, Math.round(v.retireAge - v.currentAge));
    var r = v.rate / 100;
    var bal = v.balance;
    var contrib = v.balance;
    var balByYear = [bal];
    var labels = [String(v.currentAge)];
    for (var y = 1; y <= years; y++) {
      bal = bal * (1 + r) + v.annual;
      contrib += v.annual;
      balByYear.push(bal);
      labels.push(String(v.currentAge + y));
    }
    var growth = bal - contrib;
    var rothAdvantage = (v.taxRate / 100) * growth; // tax you'd owe on gains in a taxable account
    return {
      summary: [
        { label: "Tax-free balance at retirement", value: ctx.money(bal), primary: true },
        { label: "Total contributions", value: ctx.money(contrib) },
        { label: "Tax saved vs taxable account", value: ctx.money(rothAdvantage) },
      ],
      table: {
        columns: ["", "Amount"],
        rows: [
          ["Total contributions", ctx.money(contrib)],
          ["Tax-free investment growth", ctx.money(growth)],
          ["Balance at retirement (all yours)", ctx.money(bal)],
          ["Tax you'd owe in a taxable account", ctx.money(rothAdvantage)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Age",
        xLabels: labels,
        series: [{ name: "Roth IRA balance", color: "#059669", points: balByYear }],
      },
      note:
        "In a Roth IRA, the entire balance is yours tax-free in retirement. The same gains in a regular taxable account would owe roughly " +
        ctx.money(rothAdvantage) +
        " in taxes — that's the Roth advantage.",
    };
  },
  content: `
    <h2>Why a Roth IRA is so powerful</h2>
    <p>You fund a Roth IRA with money you've already paid tax on. In return, it grows completely tax-free, and qualified withdrawals after age 59½ are never taxed. Over decades, the tax-free growth is the whole point: a taxable account would chip away at your gains through taxes on dividends and the sale of investments, while the Roth lets the full balance compound and stay yours.</p>
    <h2>Who benefits most</h2>
    <p>The Roth wins biggest if you expect to be in the same or a higher tax bracket in retirement — common for younger savers early in their careers. You give up a deduction today in exchange for tax-free income later. (For a side-by-side with the traditional IRA, the choice comes down to whether you want the tax break now or in retirement.)</p>
    <h2>Things to know</h2>
    <ul>
      <li><strong>Contribution limits</strong> apply each year and change over time; this projection doesn't enforce them, so keep your annual amount within the current limit.</li>
      <li><strong>Income limits:</strong> high earners may be phased out of direct Roth contributions.</li>
      <li><strong>Flexibility:</strong> you can generally withdraw your contributions (not earnings) at any time without tax or penalty — a useful backstop, though it's best left to grow.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is the balance shown really all tax-free?",
      a: "Yes — qualified Roth IRA withdrawals in retirement (after age 59½ and a 5-year holding period) are completely tax-free, including all the growth. That's the key advantage the calculator highlights.",
    },
    {
      q: "Roth IRA or traditional IRA?",
      a: "Roth if you expect equal or higher taxes in retirement (pay tax now, withdraw tax-free); traditional if you expect lower taxes later and want the deduction today. Many people hold some of each.",
    },
    {
      q: "What return should I assume?",
      a: "A diversified stock portfolio has historically averaged around 7% after inflation over the long run. Use a conservative figure and treat the projection as an estimate, not a guarantee.",
    },
  ],
  related: ["retirement-savings-calculator", "401k-calculator", "compound-interest-calculator"],
  cta: { key: "brokerage", text: "Open a Roth IRA" },
};
