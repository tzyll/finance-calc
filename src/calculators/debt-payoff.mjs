export default {
  slug: "debt-payoff-calculator",
  category: "borrowing",
  title: "Debt Payoff Calculator (Snowball vs Avalanche)",
  metaTitle: "Debt Payoff Calculator – Snowball vs Avalanche",
  metaDescription:
    "Free debt payoff calculator. Compare the snowball and avalanche methods across all your debts to see which clears them faster and saves the most interest.",
  keywords: [
    "debt payoff calculator",
    "debt snowball calculator",
    "debt avalanche calculator",
    "pay off debt calculator",
  ],
  intro:
    "<p>Enter your debts and how much extra you can put toward them each month. The calculator runs both the avalanche (highest-rate first) and snowball (smallest-balance first) methods so you can see which clears your debt faster and saves the most interest.</p>",
  inputs: [
    { id: "bal1", label: "Debt 1 balance", type: "number", default: 5000, min: 0, step: 100, prefix: "$" },
    { id: "apr1", label: "Debt 1 APR", type: "number", default: 22, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "min1", label: "Debt 1 min payment", type: "number", default: 100, min: 0, step: 10, prefix: "$" },
    { id: "bal2", label: "Debt 2 balance", type: "number", default: 12000, min: 0, step: 100, prefix: "$" },
    { id: "apr2", label: "Debt 2 APR", type: "number", default: 7, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "min2", label: "Debt 2 min payment", type: "number", default: 250, min: 0, step: 10, prefix: "$" },
    { id: "bal3", label: "Debt 3 balance", type: "number", default: 8000, min: 0, step: 100, prefix: "$" },
    { id: "apr3", label: "Debt 3 APR", type: "number", default: 6, min: 0, max: 100, step: 0.1, suffix: "%" },
    { id: "min3", label: "Debt 3 min payment", type: "number", default: 90, min: 0, step: 10, prefix: "$" },
    { id: "extra", label: "Extra payment / month", type: "number", default: 200, min: 0, step: 25, prefix: "$" },
  ],
  compute: function (v, ctx) {
    var debts = [];
    for (var i = 1; i <= 3; i++) {
      var bal = v["bal" + i];
      if (bal > 0) debts.push({ balance: bal, apr: v["apr" + i], min: v["min" + i] });
    }
    if (!debts.length) {
      return { summary: [{ label: "Total debt", value: ctx.money(0), primary: true }], note: "Enter at least one debt balance to compare payoff plans." };
    }
    var totalDebt = debts.reduce(function (s, d) { return s + d.balance; }, 0);

    function simulate(strategy, track) {
      var d = debts.map(function (x) { return { balance: x.balance, apr: x.apr, min: x.min }; });
      var months = 0, totalInterest = 0, guard = 0;
      var totalByMonth = [d.reduce(function (s, x) { return s + x.balance; }, 0)];
      while (d.some(function (x) { return x.balance > 0; }) && guard < 1200) {
        guard++; months++;
        var pool = v.extra;
        for (var k = 0; k < d.length; k++) if (d[k].balance <= 0.005) pool += d[k].min;
        for (var k = 0; k < d.length; k++) {
          if (d[k].balance <= 0.005) continue;
          var interest = d[k].balance * (d[k].apr / 100 / 12);
          d[k].balance += interest; totalInterest += interest;
          var pay = Math.min(d[k].min, d[k].balance);
          d[k].balance -= pay;
        }
        var active = d.filter(function (x) { return x.balance > 0.005; });
        active.sort(strategy === "avalanche"
          ? function (a, b) { return b.apr - a.apr; }
          : function (a, b) { return a.balance - b.balance; });
        while (pool > 0.005 && active.length) {
          var t = active[0];
          var pay2 = Math.min(pool, t.balance);
          t.balance -= pay2; pool -= pay2;
          if (t.balance <= 0.005) active.shift(); else break;
        }
        if (track && months % 3 === 0) totalByMonth.push(Math.max(0, d.reduce(function (s, x) { return s + x.balance; }, 0)));
      }
      return { months: months, interest: totalInterest, resolved: guard < 1200, totalByMonth: totalByMonth };
    }

    function timeStr(m) {
      var yr = Math.floor(m / 12), mo = m % 12;
      return (yr > 0 ? yr + " yr " : "") + mo + " mo";
    }

    var av = simulate("avalanche", true);
    var sn = simulate("snowball", false);
    var saved = sn.interest - av.interest;

    var labels = ["0"];
    for (var j = 1; j < av.totalByMonth.length; j++) labels.push(String(j * 3));

    return {
      summary: [
        { label: "Debt-free in", value: av.resolved ? timeStr(av.months) : "Never*", primary: true },
        { label: "Total interest (avalanche)", value: ctx.money(av.interest) },
        { label: "Total debt", value: ctx.money(totalDebt) },
      ],
      table: {
        columns: ["Method", "Debt-free in", "Total interest"],
        rows: [
          ["Avalanche (highest APR first)", av.resolved ? timeStr(av.months) : "Never*", ctx.money(av.interest)],
          ["Snowball (smallest balance first)", sn.resolved ? timeStr(sn.months) : "Never*", ctx.money(sn.interest)],
        ],
      },
      chart: av.resolved ? {
        yFormat: "money",
        xLabel: "Months",
        xLabels: labels,
        series: [{ name: "Total balance (avalanche)", color: "#dc2626", points: av.totalByMonth }],
      } : null,
      note: !av.resolved
        ? "*Your payments don't cover the interest on at least one debt — increase the extra payment to make progress."
        : saved > 1
        ? "Avalanche saves about " + ctx.money(saved) + " in interest versus snowball. Snowball clears your smallest debt first for quicker motivation — pick the one you'll stick with."
        : "Both methods finish around the same time here. Snowball gives an earlier first win; avalanche is mathematically cheapest.",
    };
  },
  content: `
    <h2>Snowball vs avalanche: what's the difference?</h2>
    <p>Both methods say: pay the minimum on every debt, then throw all your spare money at <em>one</em> target debt. They differ on which target:</p>
    <ul>
      <li><strong>Avalanche</strong> attacks the <strong>highest interest rate</strong> first. This always costs the least total interest and is mathematically optimal.</li>
      <li><strong>Snowball</strong> attacks the <strong>smallest balance</strong> first. You pay slightly more interest, but you clear a whole debt sooner — and that early win keeps many people motivated.</li>
    </ul>
    <p>As each debt is cleared, its old minimum payment "rolls over" onto the next target, so your payoff accelerates like a snowball gathering snow. This calculator models that rollover for both methods.</p>
    <h2>Which should you choose?</h2>
    <p>If the interest savings are large, avalanche wins. If they're small, or if you've struggled to stay motivated before, snowball's quick wins may be worth a few extra dollars. The best plan is the one you'll actually finish.</p>
    <h2>Speeding it up</h2>
    <ul>
      <li><strong>Find extra money for the "extra payment."</strong> Even $50 more a month can cut months off your timeline.</li>
      <li><strong>Lower your rates.</strong> A balance transfer or consolidation loan can reduce the interest working against you — run the numbers both ways.</li>
      <li><strong>Don't add new debt</strong> while paying off the old, or you'll be refilling the bucket as you empty it.</li>
    </ul>
  `,
  faq: [
    {
      q: "Is snowball or avalanche better?",
      a: "Avalanche always costs less interest because it targets the highest rate first. Snowball costs a bit more but clears individual debts faster, which helps motivation. If the dollar difference is small, choose whichever you'll stick with.",
    },
    {
      q: "What is the payment rollover?",
      a: "When you finish paying off one debt, you don't pocket that payment — you add it to what you're paying on the next debt. This 'rolling' of freed-up payments is what makes both methods accelerate over time.",
    },
    {
      q: "Should I consolidate my debts instead?",
      a: "Sometimes. A lower-rate consolidation loan or 0% balance transfer can reduce total interest, but watch for fees and make sure you don't run the old balances back up. Compare the consolidated rate against your current mix.",
    },
  ],
  related: ["credit-card-payoff-calculator", "loan-calculator", "budget-calculator"],
  cta: { key: "balanceTransfer", text: "See 0% balance-transfer cards" },
};
