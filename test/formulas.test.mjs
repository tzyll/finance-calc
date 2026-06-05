// Known-answer regression tests for the core financial formulas.
// These lock in correct math so a future edit can't silently break a calculator.
import { test } from "node:test";
import assert from "node:assert/strict";
import { run, pmt } from "./helpers.mjs";

// Pull a summary value by its label substring.
function val(out, labelPart) {
  const item = out.summary.find((s) => s.label.toLowerCase().includes(labelPart.toLowerCase()));
  assert.ok(item, "no summary item matching: " + labelPart);
  return item.value;
}

test("compound interest: $462,290 future balance (defaults)", () => {
  assert.equal(val(run("compound-interest-calculator"), "future balance"), "$462,290");
});

test("loan: $489/mo for 25k @6.5%/5yr", () => {
  assert.equal(val(run("loan-calculator"), "monthly payment"), "$" + Math.round(pmt(25000, 6.5, 60)).toLocaleString("en-US"));
});

test("mortgage: $2,539 PITI (defaults)", () => {
  assert.equal(val(run("mortgage-calculator"), "monthly payment"), "$2,539");
});

test("cd: $10,920 maturity (10k @4.5% APY, 24mo)", () => {
  assert.equal(val(run("cd-calculator"), "value at maturity"), "$" + Math.round(10000 * Math.pow(1.045, 2)).toLocaleString("en-US"));
});

test("simple interest: $11,500 total (10k, 5%, 3yr)", () => {
  assert.equal(val(run("simple-interest-calculator"), "total amount"), "$11,500");
});

test("roi: 60% total, CAGR matches", () => {
  assert.equal(val(run("roi-calculator"), "total roi"), "60.00%");
  assert.equal(val(run("roi-calculator"), "annualized"), ((Math.pow(1.6, 1 / 4) - 1) * 100).toFixed(2) + "%");
});

test("present value: 10k/1.05^10", () => {
  assert.equal(val(run("present-value-calculator"), "present value"), "$" + Math.round(10000 / Math.pow(1.05, 10)).toLocaleString("en-US"));
});

test("apr to apy: 5% monthly -> effective", () => {
  assert.equal(val(run("apr-to-apy-calculator"), "apy"), ((Math.pow(1 + 0.05 / 12, 12) - 1) * 100).toFixed(2) + "%");
});

test("inflation: 10k*(1.03^20) future cost", () => {
  assert.equal(val(run("inflation-calculator"), "equivalent cost"), "$" + Math.round(10000 * Math.pow(1.03, 20)).toLocaleString("en-US"));
});

test("student loan: $333/mo (30k, 6%, 10yr)", () => {
  assert.equal(val(run("student-loan-calculator"), "monthly payment"), "$" + Math.round(pmt(30000, 6, 120)).toLocaleString("en-US"));
});

test("dti: 40% back-end (2400/6000)", () => {
  assert.equal(val(run("debt-to-income-ratio-calculator"), "back-end"), "40.00%");
});

test("fire: $1,000,000 FI number (40k @4%)", () => {
  assert.equal(val(run("fire-calculator"), "fi number"), "$1,000,000");
});

test("coast fire: FI / 1.05^35", () => {
  assert.equal(val(run("coast-fire-calculator"), "coast fire number"), "$" + Math.round(1000000 / Math.pow(1.05, 35)).toLocaleString("en-US"));
});

test("home affordability: $2,100 max payment (28/36 of 90k income, 500 debt)", () => {
  const mg = 90000 / 12;
  const maxPay = Math.min(0.28 * mg, 0.36 * mg - 500);
  assert.equal(val(run("home-affordability-calculator"), "max monthly payment"), "$" + Math.round(maxPay).toLocaleString("en-US"));
});

test("take-home pay: 2026 federal + FICA (75k single, 6% 401k, 5% state)", () => {
  const gross = 75000, pre = gross * 0.06, taxable = gross - pre - 16100;
  const b = [[0, 0.1], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]];
  let fed = 0;
  for (let i = 0; i < b.length; i++) {
    const lo = b[i][0], hi = i + 1 < b.length ? b[i + 1][0] : Infinity;
    if (taxable > lo) fed += (Math.min(taxable, hi) - lo) * b[i][1];
  }
  const ss = Math.min(gross, 184500) * 0.062; // 2026 wage base
  const med = gross * 0.0145;
  const state = (gross - pre) * 0.05;
  const net = gross - pre - fed - ss - med - state;
  assert.equal(val(run("take-home-pay-calculator"), "take-home"), "$" + Math.round(net).toLocaleString("en-US"));
});

test("take-home pay: SS caps at 2026 wage base $184,500", () => {
  // A high earner pays SS only up to the cap; verify the SS line uses 184500.
  const out = run("take-home-pay-calculator", { salary: 300000, pretax: 0, stateTax: 0, status: "single" });
  const ssRow = out.table.rows.find((r) => /social security/i.test(r[0]));
  assert.ok(ssRow, "no Social Security row");
  // table prefixes deductions with a Unicode minus (−); compare the numeric part
  assert.equal(ssRow[1].replace(/[^0-9,]/g, ""), Math.round(184500 * 0.062).toLocaleString("en-US"));
});

test("rule of 72: 9 yr at 8% (default)", () => {
  assert.equal(val(run("rule-of-72-calculator"), "rule of 72"), "9.0 yr");
});

test("rule of 72: handles 0% rate without Infinity", () => {
  const out = run("rule-of-72-calculator", { rate: 0 });
  assert.equal(val(out, "rule of 72"), "—");
  assert.ok(/never/i.test(out.note || ""), "should explain 0% never doubles");
});

test("rent vs buy: short stay favors renting, long stay favors buying", () => {
  assert.equal(val(run("rent-vs-buy-calculator", { years: 2 }), "cheaper"), "Renting");
  assert.equal(val(run("rent-vs-buy-calculator", { years: 30 }), "cheaper"), "Buying");
});

test("debt payoff: avalanche interest <= snowball interest", () => {
  const out = run("debt-payoff-calculator");
  const av = out.table.rows.find((r) => /avalanche/i.test(r[0]));
  const sn = out.table.rows.find((r) => /snowball/i.test(r[0]));
  const num = (s) => Number(String(s).replace(/[^0-9.]/g, ""));
  assert.ok(num(av[2]) <= num(sn[2]), "avalanche should never cost more interest than snowball");
});

test("roth vs traditional 401k: lower retirement tax favors Traditional", () => {
  assert.equal(val(run("roth-vs-traditional-401k-calculator", { currentTax: 24, retireTax: 22 }), "better choice"), "Traditional 401(k)");
  assert.equal(val(run("roth-vs-traditional-401k-calculator", { currentTax: 24, retireTax: 32 }), "better choice"), "Roth 401(k)");
});
