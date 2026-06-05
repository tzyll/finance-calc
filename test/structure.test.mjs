// Structural contract tests: every calculator/article/page is well-formed and
// every default compute() returns finite, renderable output.
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculators } from "../src/calculators/index.mjs";
import { articles } from "../src/articles/index.mjs";
import { pages } from "../src/pages/index.mjs";
import { affiliateLinks } from "../src/config.mjs";
import { ctx, defaults } from "./helpers.mjs";

const slugSet = new Set(calculators.map((c) => c.slug));
const affKeys = new Set(Object.keys(affiliateLinks));

test("calculator slugs are unique", () => {
  assert.equal(slugSet.size, calculators.length, "duplicate calculator slug");
});

test("article slugs are unique", () => {
  const s = new Set(articles.map((a) => a.slug));
  assert.equal(s.size, articles.length, "duplicate article slug");
});

for (const c of calculators) {
  test(`calculator: ${c.slug}`, () => {
    // required fields
    for (const f of ["slug", "category", "title", "metaDescription", "inputs", "compute", "content", "faq"]) {
      assert.ok(c[f] != null, `${c.slug} missing ${f}`);
    }
    assert.ok(Array.isArray(c.inputs) && c.inputs.length > 0, `${c.slug} has no inputs`);
    assert.ok(typeof c.compute === "function", `${c.slug} compute not a function`);

    // every input has an id + default
    const ids = new Set();
    for (const i of c.inputs) {
      assert.ok(i.id, `${c.slug} input missing id`);
      assert.ok(!ids.has(i.id), `${c.slug} duplicate input id ${i.id}`);
      ids.add(i.id);
      assert.ok(i.default != null, `${c.slug} input ${i.id} missing default`);
      if (i.type === "select") {
        assert.ok(Array.isArray(i.options) && i.options.length, `${c.slug} select ${i.id} has no options`);
      }
    }

    // related slugs resolve
    for (const r of c.related || []) {
      assert.ok(slugSet.has(r), `${c.slug} related -> unknown slug ${r}`);
    }
    // cta key is a real affiliate slot
    if (c.cta) assert.ok(affKeys.has(c.cta.key), `${c.slug} cta.key ${c.cta.key} not in affiliateLinks`);

    // default compute() must not throw and must return a valid shape
    const out = c.compute(defaults(c), ctx);
    assert.ok(out && Array.isArray(out.summary) && out.summary.length, `${c.slug} returned no summary`);
    for (const s of out.summary) {
      assert.ok(s.label && s.value != null, `${c.slug} summary item malformed`);
      assert.ok(!/NaN|Infinity|undefined|∞/.test(String(s.value)), `${c.slug} summary value bad: ${s.value}`);
    }
    // chart points (if any) are finite
    if (out.chart) {
      for (const ser of out.chart.series) {
        for (const p of ser.points) {
          assert.ok(Number.isFinite(p), `${c.slug} chart point not finite: ${p}`);
        }
      }
    }
  });
}

for (const a of articles) {
  test(`article: ${a.slug}`, () => {
    for (const f of ["slug", "title", "metaDescription", "date", "excerpt", "body"]) {
      assert.ok(a[f] != null, `${a.slug} missing ${f}`);
    }
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(a.date), `${a.slug} bad date ${a.date}`);
    for (const r of a.related || []) {
      assert.ok(slugSet.has(r), `${a.slug} related -> unknown slug ${r}`);
    }
  });
}

test("pages are well-formed", () => {
  for (const p of pages) {
    for (const f of ["slug", "title", "metaDescription", "body"]) {
      assert.ok(p[f] != null, `page ${p.slug} missing ${f}`);
    }
  }
});

// Degenerate-input safety: zero out every numeric input; nothing should render NaN/Infinity.
for (const c of calculators) {
  test(`zero-input safety: ${c.slug}`, () => {
    const v = {};
    for (const i of c.inputs) v[i.id] = i.type === "select" ? i.default : 0;
    const out = c.compute(v, ctx);
    const text =
      out.summary.map((s) => s.value).join(" ") + " " + (out.note || "");
    assert.ok(!/NaN|Infinity|∞|undefined/.test(text), `${c.slug} bad zero output: ${text}`);
  });
}
