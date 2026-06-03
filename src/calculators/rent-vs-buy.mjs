export default {
  slug: "rent-vs-buy-calculator",
  category: "borrowing",
  title: "Rent vs Buy Calculator",
  metaTitle: "Rent vs Buy Calculator – Which Is Cheaper for You?",
  metaDescription:
    "Free rent vs buy calculator. Compare the true cost of renting versus buying over the years you'll stay, including equity, appreciation, and opportunity cost.",
  keywords: [
    "rent vs buy calculator",
    "should i rent or buy",
    "renting vs buying a home",
    "buy vs rent calculator",
  ],
  intro:
    "<p>Renting isn't 'throwing money away' and buying isn't always cheaper — it depends on how long you stay, prices, and what your money could earn elsewhere. Enter your numbers to compare the real, all-in cost of each over your time horizon.</p>",
  inputs: [
    { id: "price", label: "Home price", type: "number", default: 400000, min: 0, step: 5000, prefix: "$" },
    { id: "downPct", label: "Down payment", type: "number", default: 20, min: 0, max: 100, step: 1, suffix: "%" },
    { id: "rate", label: "Mortgage rate", type: "number", default: 6.5, min: 0, max: 100, step: 0.05, suffix: "%" },
    { id: "rent", label: "Monthly rent", type: "number", default: 2000, min: 0, step: 50, prefix: "$" },
    { id: "years", label: "Years you'll stay", type: "number", default: 7, min: 1, max: 40, step: 1, suffix: "yr" },
    { id: "appr", label: "Home appreciation / yr", type: "number", default: 3, min: -10, max: 30, step: 0.5, suffix: "%" },
    { id: "rentInc", label: "Rent increase / yr", type: "number", default: 3, min: 0, max: 30, step: 0.5, suffix: "%" },
    { id: "invReturn", label: "Investment return / yr", type: "number", default: 5, min: 0, max: 30, step: 0.5, suffix: "%", help: "What your down payment could earn if invested instead." },
  ],
  compute: function (v, ctx) {
    var loan = v.price * (1 - v.downPct / 100);
    var upfront = v.price * (v.downPct / 100) + v.price * 0.03; // down + ~3% closing
    var r = v.rate / 100 / 12;
    var n = 30 * 12;
    var pmt = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    var N = Math.round(v.years * 12);
    var balance = loan;
    var totalBuyMonthly = 0;
    var totalRent = 0;
    var buyCum = [upfront];
    var rentCum = [0];
    for (var m = 1; m <= N; m++) {
      var interest = balance * r;
      balance = Math.max(0, balance - (pmt - interest));
      var monthTax = (v.price * 0.011) / 12; // ~1.1% property tax
      var monthMaint = (v.price * 0.01) / 12; // ~1% maintenance
      totalBuyMonthly += pmt + monthTax + monthMaint;
      var yearIdx = Math.floor((m - 1) / 12);
      totalRent += v.rent * Math.pow(1 + v.rentInc / 100, yearIdx);
      if (m % 12 === 0) {
        buyCum.push(upfront + totalBuyMonthly);
        rentCum.push(totalRent);
      }
    }
    var homeValue = v.price * Math.pow(1 + v.appr / 100, v.years);
    var equity = homeValue * 0.94 - balance; // net of ~6% selling costs
    var buyNet = upfront + totalBuyMonthly - equity;
    var invGain = upfront * (Math.pow(1 + v.invReturn / 100, v.years) - 1);
    var rentNet = totalRent - invGain;
    var diff = rentNet - buyNet; // >0 => buying cheaper

    var labels = ["0"];
    for (var y = 1; y < buyCum.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Cheaper over " + v.years + " yr", value: diff >= 0 ? "Buying" : "Renting", primary: true },
        { label: "Net cost of buying", value: ctx.money(buyNet) },
        { label: "Net cost of renting", value: ctx.money(rentNet) },
      ],
      table: {
        columns: ["Item", "Amount"],
        rows: [
          ["Upfront (down + closing)", ctx.money(upfront)],
          ["Housing payments over " + v.years + " yr", ctx.money(totalBuyMonthly)],
          ["Home value at sale", ctx.money(homeValue)],
          ["Equity recovered (net of selling)", ctx.money(equity)],
          ["Net cost of BUYING", ctx.money(buyNet)],
          ["Total rent paid", ctx.money(totalRent)],
          ["Investment gain on down payment", ctx.money(invGain)],
          ["Net cost of RENTING", ctx.money(rentNet)],
        ],
      },
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Buying (cash out)", color: "#7c3aed", points: buyCum },
          { name: "Renting (cash out)", color: "#94a3b8", points: rentCum },
        ],
      },
      note:
        "Over " +
        v.years +
        " years, " +
        (diff >= 0 ? "buying" : "renting") +
        " is about " +
        ctx.money(Math.abs(diff)) +
        " cheaper in this scenario. This is an estimate — results are very sensitive to appreciation, rent growth, and investment return. Try a few assumptions.",
    };
  },
  content: `
    <h2>It's really about time and opportunity cost</h2>
    <p>Two things decide rent vs buy more than anything: <strong>how long you'll stay</strong> and <strong>what your money could earn elsewhere</strong>. Buying has big upfront costs (down payment, closing) and selling costs (~6%), so the longer you stay, the more time there is to spread those out and build equity. Stay only a couple of years and buying often loses.</p>
    <p>The "opportunity cost" matters too: a renter who invests the down payment instead of tying it up in a house can earn returns on it. This calculator credits the renter with that investment gain, which is why a high investment return can tip the math toward renting.</p>
    <h2>What this model includes and assumes</h2>
    <ul>
      <li>Buying: 30-year mortgage, ~3% closing costs, ~1.1% property tax and ~1% maintenance per year, and ~6% selling costs, offset by your equity and home appreciation.</li>
      <li>Renting: rent rising each year, offset by investing your down payment at the return you choose.</li>
      <li>It does not model income-tax effects (such as mortgage-interest deductions) or PMI, which vary by situation.</li>
    </ul>
    <h2>How to use it well</h2>
    <p>Don't trust a single result — run a few scenarios. Lower the appreciation rate and watch buying weaken; raise the years you'll stay and watch it strengthen. The decision is rarely just financial anyway: stability, flexibility, and how much you value owning all count.</p>
  `,
  faq: [
    {
      q: "Is renting really throwing money away?",
      a: "No. Renting buys flexibility and frees your down payment to be invested elsewhere. Buying builds equity but ties up cash and adds maintenance, taxes, and transaction costs. Which 'wastes' less depends entirely on your numbers and timeline.",
    },
    {
      q: "How many years do I need to stay for buying to win?",
      a: "There's no universal number, but a common rule of thumb is around 5 years — below that, the upfront and selling costs often outweigh the equity you build. Use the 'years you'll stay' input to find your own break-even.",
    },
    {
      q: "Why does the investment return change the answer so much?",
      a: "Because a renter can invest the large down payment instead of locking it into a home. The higher that money could grow elsewhere, the more attractive renting becomes — it's the opportunity cost of buying.",
    },
  ],
  related: ["mortgage-calculator", "down-payment-calculator", "compound-interest-calculator"],
  cta: { key: "mortgageRates", text: "Compare today's mortgage rates" },
};
