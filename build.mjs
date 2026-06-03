import { mkdir, writeFile, rm, copyFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { site, categories, affiliateLinks } from "./src/config.mjs";
import { calculators } from "./src/calculators/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const ASSETS = join(__dirname, "src", "assets");

const bySlug = Object.fromEntries(calculators.map((c) => [c.slug, c]));
const base = site.basePath || ""; // URL prefix for internal links (e.g. "/finance-calc")

// ---------- shared layout ----------
function adScript() {
  if (!site.adsensePublisherId) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsensePublisherId}" crossorigin="anonymous"></script>`;
}
function adSlot() {
  if (!site.adsensePublisherId) return "";
  return `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${site.adsensePublisherId}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}
function ctaBlock(c) {
  if (!c.cta) return "";
  const url = affiliateLinks[c.cta.key];
  if (!url) return ""; // dormant until an affiliate URL is set
  return `<a class="cta-button" href="${url}" target="_blank" rel="sponsored noopener">${c.cta.text} →</a>`;
}

function layout({ title, description, canonical, jsonld, body }) {
  const ld = (jsonld || [])
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${site.name}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#2563eb">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%232563eb'/%3E%3Ctext x='50' y='70' font-size='60' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold'%3E$%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${base}/assets/styles.css">
${ld}
${adScript()}
</head>
<body>
<header class="site-header"><div class="container">
  <a class="logo" href="${base}/">Finance<span>Calc</span></a>
  <nav class="nav">
    <a href="${base}/">Home</a>
    ${calculators.map((c) => `<a href="${base}/${c.slug}/">${c.title.replace(" Calculator", "")}</a>`).join("\n    ")}
  </nav>
</div></header>
<main>
${body}
</main>
<footer class="site-footer"><div class="container" style="flex-direction:column;align-items:flex-start;">
  <div style="display:flex;justify-content:space-between;width:100%;flex-wrap:wrap;gap:12px;">
    <span>© ${new Date().getFullYear()} ${site.name}</span>
    <span>${calculators.map((c) => `<a href="${base}/${c.slug}/">${c.title.replace(" Calculator", "")}</a>`).join(" · ")}</span>
  </div>
  <p class="disclaimer">${site.name} provides free educational tools and general information only. It is not financial, investment, tax, or legal advice. Calculations are estimates based on the inputs you provide and do not guarantee future results. Consult a qualified professional before making financial decisions.</p>
</div></footer>
</body>
</html>`;
}

// ---------- homepage ----------
function renderHome() {
  const catOrder = Object.entries(categories).sort((a, b) => a[1].order - b[1].order);
  let groups = "";
  for (const [key, cat] of catOrder) {
    const items = calculators.filter((c) => c.category === key);
    if (!items.length) continue;
    groups += `<div class="cat-group">${cat.name}</div><div class="grid">`;
    for (const c of items) {
      const blurb = c.intro.replace(/<[^>]+>/g, "").trim().split(/(?<=\.)\s/)[0];
      groups += `<a class="card" href="${base}/${c.slug}/">
        <span class="cat">${cat.name}</span>
        <h3>${c.title}</h3>
        <p>${blurb}</p>
      </a>`;
    }
    groups += `</div>`;
  }
  const body = `
  <section class="hero"><div class="container">
    <h1>${site.tagline}</h1>
    <p>${site.description}</p>
  </div></section>
  <div class="container">${groups}</div>`;

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url + "/",
      description: site.description,
    },
  ];
  return layout({
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    canonical: site.url + "/",
    jsonld,
    body,
  });
}

// ---------- calculator page ----------
function renderCalc(c) {
  const canonical = `${site.url}/${c.slug}/`;
  const faqHtml = c.faq
    .map(
      (f) =>
        `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`
    )
    .join("\n");
  const related = (c.related || [])
    .map((s) => bySlug[s])
    .filter(Boolean)
    .map((r) => `<a class="chip" href="${base}/${r.slug}/">${r.title}</a>`)
    .join("\n");

  const calcData = {
    inputs: c.inputs,
    computeSrc: c.compute.toString(),
    locale: site.locale,
    currency: site.currency,
  };

  const body = `
  <article class="calc-page"><div class="container">
    <div class="breadcrumb"><a href="${base}/">Home</a> › ${categories[c.category]?.name || ""} › ${c.title}</div>
    <h1>${c.title}</h1>
    <div class="calc-intro">${c.intro}</div>

    <div class="calc-card"><div id="calc"></div></div>

    ${ctaBlock(c)}
    ${adSlot()}

    <div class="content">${c.content}</div>

    <section class="faq">
      <h2>Frequently asked questions</h2>
      ${faqHtml}
    </section>

    ${related ? `<section class="related"><h2>Related calculators</h2><div class="related-list">${related}</div></section>` : ""}
  </div></article>
  <script>window.__CALC__=${JSON.stringify(calcData)};</script>
  <script src="${base}/assets/calc-engine.js" defer></script>`;

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: c.title,
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: site.currency },
      description: c.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
        { "@type": "ListItem", position: 2, name: c.title, item: canonical },
      ],
    },
  ];

  return layout({
    title: c.metaTitle || `${c.title} – ${site.name}`,
    description: c.metaDescription,
    canonical,
    jsonld,
    body,
  });
}

// ---------- sitemap + robots ----------
function renderSitemap() {
  const urls = [site.url + "/", ...calculators.map((c) => `${site.url}/${c.slug}/`)];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`;
}
function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;
}

// ---------- build ----------
async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await mkdir(join(DIST, "assets"), { recursive: true });

  for (const f of await readdir(ASSETS)) {
    await copyFile(join(ASSETS, f), join(DIST, "assets", f));
  }

  await writeFile(join(DIST, "index.html"), renderHome());

  for (const c of calculators) {
    const dir = join(DIST, c.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), renderCalc(c));
  }

  await writeFile(join(DIST, "sitemap.xml"), renderSitemap());
  await writeFile(join(DIST, "robots.txt"), renderRobots());
  await writeFile(join(DIST, ".nojekyll"), ""); // tell GitHub Pages not to run Jekyll
  if (site.indexNowKey) {
    await writeFile(join(DIST, `${site.indexNowKey}.txt`), site.indexNowKey); // IndexNow ownership proof
  }

  console.log(`Built ${calculators.length} calculators + homepage → dist/`);
  console.log(`Pages: / , ${calculators.map((c) => "/" + c.slug + "/").join(" , ")}`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
