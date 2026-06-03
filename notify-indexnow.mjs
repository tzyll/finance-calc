// Notify IndexNow (Bing, Yandex, and partners) of all site URLs so they crawl
// quickly — no search-engine account required. Run after deploying new pages:
//   node notify-indexnow.mjs
import { readFile } from "node:fs/promises";
import { site } from "./src/config.mjs";

if (!site.indexNowKey) {
  console.error("No indexNowKey set in src/config.mjs — nothing to submit.");
  process.exit(1);
}

const sitemap = await readFile(new URL("./dist/sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(site.url).host;
const keyLocation = `${site.url}/${site.indexNowKey}.txt`;

const body = { host, key: site.indexNowKey, keyLocation, urlList };
console.log(`Submitting ${urlList.length} URLs for ${host} ...`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`IndexNow responded: ${res.status} ${res.statusText}`);
console.log(res.status === 200 || res.status === 202 ? "Accepted." : await res.text());
