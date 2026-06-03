export default {
  slug: "roth-vs-traditional-401k-calculator",
  category: "retirement",
  title: "Roth vs Traditional 401(k) Calculator",
  metaTitle: "Roth vs Traditional 401(k) Calculator – After-Tax Comparison",
  metaDescription:
    "Free Roth vs Traditional 401(k) calculator. Compare the after-tax retirement value of each based on your tax rates now and in retirement. No sign-up.",
  keywords: [
    "roth vs traditional 401k calculator",
    "401k tax calculator",
    "roth 401k calculator",
    "traditional vs roth 401k",
  ],
  intro:
    "<p>Roth or traditional 401(k)? It comes down to whether your tax rate is higher now or in retirement. Enter your contribution and tax rates to compare the real, after-tax value of each at retirement.</p>",
  inputs: [
    { id: "contribution", label: "Annual contribution (pre-tax)", type: "number", default: 10000, min: 0, step: 500, prefix: "$" },
    { id: "years", label: "Years until retirement", type: "number", default: 30, min: 1, max: 60, step: 1, suffix: "yr" },
    { id: "rate", label: "Annual return", type: "number", default: 7, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "currentTax", label: "Tax rate now", type: "number", default: 24, min: 0, max: 60, step: 1, suffix: "%" },
    { id: "retireTax", label: "Tax rate in retirement", type: "number", default: 22, min: 0, max: 60, step: 1, suffix: "%" },
  ],
  compute: function (v, ctx) {
    var r = v.rate / 100;
    // Same gross salary contribution. Roth invests after-tax dollars; traditional invests the full pre-tax amount.
    var rothAnnual = v.contribution * (1 - v.currentTax / 100);
    var tradAnnual = v.contribution;
    var rothBal = 0, tradBal = 0;
    var rothByYear = [0], tradAfterTaxByYear = [0];
    for (var y = 1; y <= v.years; y++) {
      rothBal = rothBal * (1 + r) + rothAnnual;
      tradBal = tradBal * (1 + r) + tradAnnual;
      rothByYear.push(rothBal);
      tradAfterTaxByYear.push(tradBal * (1 - v.retireTax / 100));
    }
    var rothFinal = rothBal; // tax-free
    var tradFinal = tradBal * (1 - v.retireTax / 100);
    var diff = rothFinal - tradFinal;
    var winner = Math.abs(diff) < 1 ? "Tie" : diff > 0 ? "Roth 401(k)" : "Traditional 401(k)";

    var labels = ["0"];
    for (var i = 1; i < rothByYear.length; i++) labels.push(String(i));

    return {
      summary: [
        { label: "Better choice", value: winner, primary: true },
        { label: "Roth — after-tax value", value: ctx.money(rothFinal) },
        { label: "Traditional — after-tax value", value: ctx.money(tradFinal) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Roth (tax-free)", color: "#059669", points: rothByYear },
          { name: "Traditional (after tax)", color: "#94a3b8", points: tradAfterTaxByYear },
        ],
      },
      note:
        winner === "Tie"
          ? "With equal tax rates now and in retirement, the two are mathematically identical."
          : "For the same salary contribution, " +
            winner +
            " comes out ahead by about " +
            ctx.money(Math.abs(diff)) +
            " after taxes — because your retirement tax rate is " +
            (v.retireTax < v.currentTax ? "lower than" : "higher than") +
            " your current rate.",
    };
  },
  content: `
    <h2>The core trade-off: tax now or tax later</h2>
    <p>Both accounts are powerful, and the difference is purely about <em>when</em> you pay tax:</p>
    <ul>
      <li><strong>Traditional 401(k):</strong> contributions are pre-tax (lowering your taxable income today), grow tax-deferred, and are taxed as income when you withdraw in retirement.</li>
      <li><strong>Roth 401(k):</strong> contributions are after-tax (no break today), grow tax-free, and withdrawals in retirement are completely tax-free.</li>
    </ul>
    <h2>The simple rule</h2>
    <p>If you expect a <strong>higher</strong> tax rate in retirement than now, the <strong>Roth</strong> wins — pay tax at today's lower rate and withdraw tax-free later. If you expect a <strong>lower</strong> rate in retirement, the <strong>traditional</strong> wins — take the deduction now while your rate is high. If the rates are equal, they're mathematically identical.</p>
    <h2>Why younger savers often choose Roth</h2>
    <p>Early in your career your income (and tax rate) is often lower than it will be later, and a Roth locks in that low rate forever on decades of tax-free growth. It also gives you tax diversification: having both pre-tax and Roth money in retirement lets you manage your tax bracket year to year.</p>
  `,
  faq: [
    {
      q: "Can I contribute to both?",
      a: "Often yes — many plans let you split contributions between traditional and Roth 401(k), up to the combined annual limit. Splitting gives you tax diversification and hedges against not knowing your future tax rate.",
    },
    {
      q: "Does the employer match go in Roth too?",
      a: "Traditionally employer matches were pre-tax (traditional) even if your contributions were Roth, though some plans now allow Roth matches. Either way, always contribute enough to get the full match.",
    },
    {
      q: "Why does the comparison assume the same salary contribution?",
      a: "Because a traditional contribution costs less take-home pay (it's pre-tax), the fair comparison invests the full pre-tax amount in the traditional and the after-tax equivalent in the Roth. That's what this calculator does, so the result reflects a true apples-to-apples outcome.",
    },
  ],
  related: ["401k-calculator", "roth-ira-calculator", "retirement-savings-calculator"],
  cta: { key: "brokerage", text: "Open a retirement account" },
};
