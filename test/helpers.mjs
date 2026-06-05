// Test helpers: run a calculator's compute() the same way the browser engine does.
import { calculators } from "../src/calculators/index.mjs";

export const bySlug = Object.fromEntries(calculators.map((c) => [c.slug, c]));

// Mirror of the client engine's ctx formatters (with the non-finite guards).
export const ctx = {
  money: (n) => (isFinite(n) ? "$" + Math.round(n).toLocaleString("en-US") : "—"),
  num: (n, d) => (isFinite(n) ? Number(n).toFixed(d == null ? 2 : d) : "—"),
  pct: (n) => (isFinite(n) ? Number(n).toFixed(2) + "%" : "—"),
};

export function defaults(c) {
  const v = {};
  for (const i of c.inputs) v[i.id] = i.default;
  return v;
}

// Run a calculator by slug with optional input overrides.
export function run(slug, over) {
  const c = bySlug[slug];
  if (!c) throw new Error("no calculator: " + slug);
  return c.compute({ ...defaults(c), ...(over || {}) }, ctx);
}

// Standard fixed-rate payment formula (for cross-checking amortization calcs).
export function pmt(P, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  return r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));
}
