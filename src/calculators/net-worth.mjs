export default {
  slug: "net-worth-calculator",
  category: "saving",
  title: "Net Worth Calculator",
  metaTitle: "Net Worth Calculator – Assets Minus Liabilities",
  metaDescription:
    "Free net worth calculator. Add up your assets and subtract your debts to see your total net worth and where it stands. Instant results, no sign-up.",
  keywords: [
    "net worth calculator",
    "personal net worth",
    "assets minus liabilities",
    "calculate net worth",
  ],
  intro:
    "<p>Your net worth is everything you own minus everything you owe. Enter your assets and debts below to see your total — the single best number for tracking financial progress over time.</p>",
  inputs: [
    { id: "cash", label: "Cash & savings", type: "number", default: 15000, min: 0, step: 500, prefix: "$" },
    { id: "investments", label: "Investments & retirement", type: "number", default: 40000, min: 0, step: 1000, prefix: "$" },
    { id: "property", label: "Home & property", type: "number", default: 250000, min: 0, step: 1000, prefix: "$" },
    { id: "vehicles", label: "Vehicles & other assets", type: "number", default: 18000, min: 0, step: 500, prefix: "$" },
    { id: "mortgage", label: "Mortgage", type: "number", default: 180000, min: 0, step: 1000, prefix: "$" },
    { id: "loans", label: "Auto & student loans", type: "number", default: 22000, min: 0, step: 500, prefix: "$" },
    { id: "creditCard", label: "Credit card debt", type: "number", default: 3000, min: 0, step: 100, prefix: "$" },
    { id: "otherDebt", label: "Other debts", type: "number", default: 0, min: 0, step: 100, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var assets = v.cash + v.investments + v.property + v.vehicles;
    var debts = v.mortgage + v.loans + v.creditCard + v.otherDebt;
    var net = assets - debts;
    return {
      summary: [
        { label: "Net worth", value: ctx.money(net), primary: true },
        { label: "Total assets", value: ctx.money(assets) },
        { label: "Total liabilities", value: ctx.money(debts) },
      ],
      table: {
        columns: ["", "Assets", "Liabilities"],
        rows: [
          ["Cash & savings", ctx.money(v.cash), ""],
          ["Investments & retirement", ctx.money(v.investments), ""],
          ["Home & property", ctx.money(v.property), ""],
          ["Vehicles & other", ctx.money(v.vehicles), ""],
          ["Mortgage", "", ctx.money(v.mortgage)],
          ["Auto & student loans", "", ctx.money(v.loans)],
          ["Credit card debt", "", ctx.money(v.creditCard)],
          ["Other debts", "", ctx.money(v.otherDebt)],
        ],
      },
      note:
        net < 0
          ? "A negative net worth is common early on (student loans, a new mortgage). Tracking it over time is what matters — the trend, not the snapshot."
          : "",
    };
  },
  content: `
    <h2>What net worth tells you</h2>
    <p>Net worth is the clearest single measure of financial health: <code>Assets − Liabilities</code>. Income matters, but two people with the same salary can have very different net worths depending on how much they keep. Tracking the number every few months shows whether you're truly getting ahead.</p>
    <h2>How to grow it</h2>
    <ul>
      <li><strong>Raise assets.</strong> Invest consistently so savings compound, and pay down a mortgage to build equity.</li>
      <li><strong>Shrink liabilities.</strong> Clear high-interest debt first — credit cards drag net worth down fast.</li>
      <li><strong>Watch the trend.</strong> A rising net worth over time means your financial decisions are working, even if the absolute number feels small today.</li>
    </ul>
  `,
  faq: [
    {
      q: "Should I include my home in net worth?",
      a: "Yes — count the home's market value as an asset and the remaining mortgage as a liability. The difference is your home equity, which is part of your net worth.",
    },
    {
      q: "Is a negative net worth bad?",
      a: "Not necessarily. Many people start with a negative net worth due to student loans or a new mortgage. What matters is the direction over time — a steadily rising net worth is the goal.",
    },
    {
      q: "How often should I calculate it?",
      a: "Every three to six months is plenty. Checking too often adds noise from market swings; quarterly snapshots show the real trend.",
    },
  ],
  related: ["compound-interest-calculator", "retirement-savings-calculator"],
};
