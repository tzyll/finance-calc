export default {
  slug: "fire-calculator",
  category: "retirement",
  title: "FIRE Calculator (Financial Independence)",
  metaTitle: "FIRE Calculator – Years to Financial Independence",
  metaDescription:
    "Free FIRE calculator. Find how many years until you can retire early, based on your savings rate, expenses, and returns, using the 4% rule. No sign-up.",
  keywords: [
    "fire calculator",
    "financial independence calculator",
    "retire early calculator",
    "years to financial independence",
  ],
  intro:
    "<p>FIRE — Financial Independence, Retire Early — means having enough invested that work becomes optional. Enter your savings, spending, and expected return to see your FI number and how many years until you reach it.</p>",
  inputs: [
    { id: "current", label: "Current investments", type: "number", default: 50000, min: 0, step: 1000, prefix: "$" },
    { id: "expenses", label: "Annual spending in retirement", type: "number", default: 40000, min: 0, step: 1000, prefix: "$" },
    { id: "saving", label: "You invest per year", type: "number", default: 24000, min: 0, step: 1000, prefix: "$" },
    { id: "rate", label: "Annual return (after inflation)", type: "number", default: 5, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "swr", label: "Safe withdrawal rate", type: "number", default: 4, min: 1, max: 10, step: 0.1, suffix: "%", help: "The 4% rule implies a target of 25x your annual spending." },
  ],
  compute: function (v, ctx) {
    var fiNumber = v.swr > 0 ? v.expenses * (100 / v.swr) : 0;
    var r = v.rate / 100;
    var bal = v.current;
    var years = 0;
    var balByYear = [bal];
    var guard = 0;
    while (bal < fiNumber && guard < 100) {
      guard++; years++;
      bal = bal * (1 + r) + v.saving;
      balByYear.push(bal);
    }
    var reached = bal >= fiNumber;
    var progress = fiNumber > 0 ? Math.min(100, (v.current / fiNumber) * 100) : 0;

    // flat target line for the chart
    var target = balByYear.map(function () { return fiNumber; });
    var labels = ["0"];
    for (var y = 1; y < balByYear.length; y++) labels.push(String(y));

    return {
      summary: [
        { label: "Years to financial independence", value: reached ? (years === 0 ? "Already there" : years + " yr") : "30+ yr", primary: true },
        { label: "Your FI number", value: ctx.money(fiNumber) },
        { label: "Progress so far", value: ctx.pct(progress) },
      ],
      chart: {
        yFormat: "money",
        xLabel: "Years",
        xLabels: labels,
        series: [
          { name: "Investments", color: "#059669", points: balByYear },
          { name: "FI target", color: "#94a3b8", points: target },
        ],
      },
      note:
        v.current >= fiNumber
          ? "Your investments already cover your spending at this withdrawal rate — you're financially independent."
          : "Your savings rate is the biggest lever here. Investing more each year, or trimming retirement spending, both pull this date dramatically closer.",
    };
  },
  content: `
    <h2>How FIRE works</h2>
    <p>The core idea: once your investments are large enough that a safe withdrawal covers your spending, you no longer need a paycheck. Under the <strong>4% rule</strong>, that target is about <strong>25 times your annual spending</strong> (because 1 ÷ 0.04 = 25). Spend $40,000 a year and your FI number is roughly $1,000,000.</p>
    <p>The calculator grows your current investments plus what you add each year until the balance reaches that number. Because returns compound, the last stretch goes faster than the first.</p>
    <h2>The one number that matters most: your savings rate</h2>
    <p>Time to FIRE is driven less by income than by the <em>percentage</em> of income you save. Someone saving 50% of their take-home reaches independence far faster than someone saving 10%, because high savings does double duty — it builds the nest egg <em>and</em> proves you can live on less, which lowers the FI number itself.</p>
    <h2>Flavors of FIRE</h2>
    <ul>
      <li><strong>Lean FIRE:</strong> a smaller nest egg supporting a frugal lifestyle.</li>
      <li><strong>Fat FIRE:</strong> a larger target for a more comfortable retirement.</li>
      <li><strong>Coast FIRE:</strong> saving enough early that, even if you stop adding, compounding alone reaches your number by traditional retirement age.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is the 4% rule safe?",
      a: "It's a well-studied guideline suggesting a 4% initial withdrawal (adjusted for inflation) has historically lasted 30+ years. Early retirees with longer horizons sometimes use 3.5% for extra safety, which raises the target to about 28x spending. Adjust the withdrawal rate above to see the effect.",
    },
    {
      q: "Should I use real or nominal returns?",
      a: "Use a real (after-inflation) return — around 5% for a stock-heavy portfolio is a common assumption — so your FI number stays in today's dollars and reflects real purchasing power.",
    },
    {
      q: "Does FIRE mean I have to stop working?",
      a: "No. Financial independence simply makes work optional. Many people who reach FI keep working on their own terms, switch to lower-paid but fulfilling work, or take long breaks — the point is choice.",
    },
  ],
  related: ["retirement-savings-calculator", "compound-interest-calculator", "savings-goal-calculator"],
  cta: { key: "brokerage", text: "Open an investing account" },
};
