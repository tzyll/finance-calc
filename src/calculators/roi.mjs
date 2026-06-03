export default {
  slug: "roi-calculator",
  category: "saving",
  title: "ROI Calculator",
  metaTitle: "ROI Calculator – Return on Investment & Annualized Return",
  metaDescription:
    "Free ROI calculator. Find your total return on investment, net profit, and annualized return (CAGR) from an initial and final value. Instant, no sign-up.",
  keywords: [
    "roi calculator",
    "return on investment calculator",
    "cagr calculator",
    "annualized return calculator",
  ],
  intro:
    "<p>Measure how well an investment performed. Enter what you put in, what it's worth now, and how long you held it to see your total return, profit, and annualized (CAGR) return.</p>",
  inputs: [
    { id: "initial", label: "Amount invested", type: "number", default: 10000, min: 0, step: 100, prefix: "$" },
    { id: "final", label: "Final value", type: "number", default: 16000, min: 0, step: 100, prefix: "$" },
    { id: "years", label: "Years held", type: "number", default: 4, min: 0, max: 80, step: 0.5, suffix: "yr" },
  ],
  compute: function (v, ctx) {
    var profit = v.final - v.initial;
    var roi = v.initial > 0 ? (profit / v.initial) * 100 : 0;
    var cagr = 0;
    if (v.initial > 0 && v.years > 0 && v.final > 0) {
      cagr = (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100;
    }
    var summary = [
      { label: "Total ROI", value: ctx.pct(roi), primary: true },
      { label: "Net profit", value: ctx.money(profit) },
    ];
    var chart = null;
    if (v.years > 0) {
      summary.push({ label: "Annualized (CAGR)", value: ctx.pct(cagr) });
      var pts = [v.initial];
      var labels = ["0"];
      var whole = Math.max(1, Math.round(v.years));
      for (var y = 1; y <= whole; y++) {
        pts.push(v.initial * Math.pow(1 + cagr / 100, y));
        labels.push(String(y));
      }
      chart = {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Value at CAGR", color: "#2563eb", points: pts }],
      };
    } else {
      summary.push({ label: "Final value", value: ctx.money(v.final) });
    }
    return { summary: summary, chart: chart };
  },
  content: `
    <h2>ROI vs. annualized return</h2>
    <p><strong>Total ROI</strong> is simply your profit divided by what you invested: <code>(Final − Initial) ÷ Initial</code>. It's easy to read but ignores time — a 60% return is great over one year and mediocre over twenty.</p>
    <p><strong>Annualized return (CAGR)</strong> fixes that by expressing growth as a steady yearly rate: <code>(Final ÷ Initial)^(1 ÷ years) − 1</code>. Use CAGR to compare investments held for different lengths of time.</p>
    <h2>Things ROI doesn't capture</h2>
    <ul>
      <li><strong>Risk.</strong> A higher return often came with higher risk. ROI alone doesn't tell you how bumpy the ride was.</li>
      <li><strong>Cash flows.</strong> This calculator assumes a single buy and a single sell. If you added or withdrew money along the way, the true return differs.</li>
      <li><strong>Fees and taxes.</strong> Subtract trading costs and taxes for your real, take-home return.</li>
    </ul>
  `,
  faq: [
    {
      q: "What's a good ROI?",
      a: "It depends on the asset and risk. As a benchmark, the broad stock market has historically returned roughly 7–10% per year on average. Compare your annualized (CAGR) figure to a relevant benchmark rather than total ROI.",
    },
    {
      q: "Can ROI be negative?",
      a: "Yes. If the final value is less than what you invested, both ROI and profit are negative — you lost money.",
    },
    {
      q: "Why does the annualized return look lower than total ROI?",
      a: "Total ROI sums up the entire holding period, while annualized return spreads that growth evenly across each year. Over multiple years the per-year figure is naturally smaller.",
    },
  ],
  related: ["compound-interest-calculator", "retirement-savings-calculator"],
};
