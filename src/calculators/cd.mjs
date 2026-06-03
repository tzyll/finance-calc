export default {
  slug: "cd-calculator",
  category: "saving",
  title: "CD Calculator",
  metaTitle: "CD Calculator – Certificate of Deposit Maturity & Interest",
  metaDescription:
    "Free CD calculator. See the maturity value and total interest of a certificate of deposit from your deposit, APY, and term. Instant results, no sign-up.",
  keywords: [
    "cd calculator",
    "certificate of deposit calculator",
    "cd interest calculator",
    "cd maturity calculator",
  ],
  intro:
    "<p>Find out what a certificate of deposit (CD) will be worth at maturity. Enter your deposit, the APY your bank offers, and the term to see your final balance and the interest you'll earn.</p>",
  inputs: [
    { id: "principal", label: "Deposit amount", type: "number", default: 10000, min: 0, step: 500, prefix: "$" },
    { id: "apy", label: "APY", type: "number", default: 4.5, min: 0, max: 30, step: 0.05, suffix: "%" },
    { id: "months", label: "Term", type: "number", default: 24, min: 1, max: 120, step: 1, suffix: "mo" },
  ],
  compute: function (v, ctx) {
    var years = v.months / 12;
    var maturity = v.principal * Math.pow(1 + v.apy / 100, years);
    var interest = maturity - v.principal;

    var labels = ["0"];
    var pts = [v.principal];
    for (var m = 12; m <= v.months; m += 12) {
      labels.push(String(m / 12));
      pts.push(v.principal * Math.pow(1 + v.apy / 100, m / 12));
    }
    if (v.months % 12 !== 0) {
      labels.push((years).toFixed(1));
      pts.push(maturity);
    }

    return {
      summary: [
        { label: "Value at maturity", value: ctx.money(maturity), primary: true },
        { label: "Interest earned", value: ctx.money(interest) },
        { label: "APY", value: ctx.pct(v.apy) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [{ name: "Balance", color: "#16a34a", points: pts }],
      },
    };
  },
  content: `
    <h2>How CD interest works</h2>
    <p>A certificate of deposit locks your money away for a fixed term in exchange for a guaranteed interest rate. Banks quote the <strong>APY</strong> (annual percentage yield), which already accounts for compounding, so the maturity value is simply <code>Deposit × (1 + APY)^years</code>.</p>
    <p>CDs are low-risk and, at insured banks, your deposit is protected up to the insurance limit. The trade-off is access: withdrawing early usually triggers a penalty of several months' interest.</p>
    <h2>Getting the most from a CD</h2>
    <ul>
      <li><strong>Shop the APY.</strong> Online banks often pay noticeably more than big brick-and-mortar banks for the same term.</li>
      <li><strong>Match the term to your needs.</strong> Don't lock up money you may need before maturity, or the early-withdrawal penalty can wipe out your interest.</li>
      <li><strong>Build a CD ladder.</strong> Splitting money across CDs of staggered terms keeps part of it accessible while still earning higher long-term rates.</li>
    </ul>
  `,
  faq: [
    {
      q: "What's the difference between APY and APR?",
      a: "APY includes the effect of compounding, while APR does not. Banks advertise CDs by APY, so the maturity value here uses APY directly for an accurate result.",
    },
    {
      q: "Is a CD safe?",
      a: "CDs at insured banks or credit unions are among the safest places for cash, protected up to the deposit-insurance limit. The main risk is locking in a rate before rates rise, or needing the money early.",
    },
    {
      q: "What happens if I withdraw early?",
      a: "Most CDs charge an early-withdrawal penalty, often a set number of months of interest. That can reduce or even erase your earnings, so only deposit money you can leave untouched for the full term.",
    },
  ],
  related: ["compound-interest-calculator", "savings-goal-calculator"],
};
