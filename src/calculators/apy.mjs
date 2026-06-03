export default {
  slug: "apr-to-apy-calculator",
  category: "saving",
  title: "APR to APY Calculator",
  metaTitle: "APR to APY Calculator – Effective Annual Yield",
  metaDescription:
    "Free APR to APY calculator. Convert a nominal interest rate (APR) into the effective annual yield (APY) by compounding frequency. Instant, no sign-up.",
  keywords: [
    "apr to apy calculator",
    "apy calculator",
    "effective annual rate calculator",
    "apr vs apy",
  ],
  intro:
    "<p>APR is the stated annual rate; APY is what you actually earn once compounding is included. Enter an APR and how often it compounds to see the true effective yield — and compare across compounding frequencies.</p>",
  inputs: [
    { id: "apr", label: "APR (nominal rate)", type: "number", default: 5, min: 0, max: 100, step: 0.05, suffix: "%" },
    {
      id: "freq",
      label: "Compounding frequency",
      type: "select",
      default: "12",
      options: [
        { value: "365", label: "Daily" },
        { value: "12", label: "Monthly" },
        { value: "4", label: "Quarterly" },
        { value: "1", label: "Annually" },
      ],
    },
  ],
  compute: function (v, ctx) {
    var apr = v.apr;
    var n = Number(v.freq);
    function apy(nn) {
      return nn <= 0 ? apr : (Math.pow(1 + apr / 100 / nn, nn) - 1) * 100;
    }
    var thisApy = apy(n);
    var diff = thisApy - apr;
    return {
      summary: [
        { label: "APY (effective yield)", value: ctx.pct(thisApy), primary: true },
        { label: "APR (entered)", value: ctx.pct(apr) },
        { label: "Extra on $10,000 / yr", value: ctx.money((10000 * thisApy) / 100 - (10000 * apr) / 100) },
      ],
      table: {
        columns: ["Compounding", "APY", "On $10,000"],
        rows: [
          ["Annually", ctx.pct(apy(1)), ctx.money((10000 * apy(1)) / 100)],
          ["Quarterly", ctx.pct(apy(4)), ctx.money((10000 * apy(4)) / 100)],
          ["Monthly", ctx.pct(apy(12)), ctx.money((10000 * apy(12)) / 100)],
          ["Daily", ctx.pct(apy(365)), ctx.money((10000 * apy(365)) / 100)],
        ],
      },
      note:
        diff > 0.001
          ? "Compounding adds about " + ctx.pct(diff) + " of effective yield over the stated APR. Notice the gain shrinks as frequency rises — daily vs monthly barely differs."
          : "With annual compounding, APR and APY are the same.",
    };
  },
  content: `
    <h2>APR vs. APY — what's the difference?</h2>
    <p><strong>APR</strong> (annual percentage rate) is the simple stated rate. <strong>APY</strong> (annual percentage yield) accounts for compounding — earning interest on your interest within the year — so it's always equal to or higher than the APR. The formula is:</p>
    <p><code>APY = (1 + APR/n)^n − 1</code>, where <code>n</code> is the number of compounding periods per year.</p>
    <h2>Why it matters</h2>
    <ul>
      <li><strong>Comparing savings accounts and CDs:</strong> banks advertise APY for deposits because it's the higher, more attractive number — and the fair one to compare, since it reflects compounding.</li>
      <li><strong>Comparing loans and cards:</strong> lenders often quote APR. To compare a loan's true annual cost, convert to APY, especially when interest compounds monthly or daily.</li>
      <li><strong>Diminishing returns on frequency:</strong> going from annual to monthly compounding helps noticeably; going from daily to continuous barely moves the needle.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is a higher APY always better?",
      a: "For money you're earning (savings, CDs), yes — a higher APY means more interest. For money you owe (loans, credit cards), a higher effective rate means it costs you more, so lower is better.",
    },
    {
      q: "Why do banks quote APY but lenders quote APR?",
      a: "APY is higher than APR, so banks use it to make deposit returns look bigger, while lenders use the lower-sounding APR for loans. Converting both to the same basis lets you compare fairly.",
    },
    {
      q: "What's continuous compounding?",
      a: "It's the theoretical limit of compounding infinitely often, giving APY = e^(APR) − 1. In practice daily compounding is already very close to this limit, so the difference is tiny.",
    },
  ],
  related: ["cd-calculator", "compound-interest-calculator", "loan-calculator"],
};
