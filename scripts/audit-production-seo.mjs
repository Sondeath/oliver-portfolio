// Run against a locally served production build, without making staging indexable.
// LIGHTHOUSE_DEPS points to a directory with lighthouse@13.5.0 installed.
// CHROME_PATH points to an isolated Chromium executable. Requires Node >=22.19.
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { routes } from "../content/routes.mjs";
import { productionOrigin } from "./seo.mjs";

if (!process.env.LIGHTHOUSE_DEPS || !process.env.CHROME_PATH)
  throw new Error("Set LIGHTHOUSE_DEPS and CHROME_PATH before running the audit.");
const deps = createRequire(resolve(process.env.LIGHTHOUSE_DEPS, "package.json"));
const lighthouse = (await import(pathToFileURL(deps.resolve("lighthouse")).href)).default;
const { launch } = await import(pathToFileURL(deps.resolve("chrome-launcher")).href);
const base = "http://127.0.0.1:8790";
const output = resolve("qa-production-seo");
await mkdir(output, { recursive: true });
const results = [];
const chrome = await launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ["--headless=new"] });
try {
  for (const [page, languages] of Object.entries(routes)) for (const [language, path] of Object.entries(languages)) {
    const response = await fetch(base + path);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
    if (response.status !== 200 || /<meta name="robots" content="[^\"]*noindex/.test(html) || canonical !== productionOrigin + path)
      throw new Error(`Not a production build: ${path}`);
    const result = await lighthouse(base + path, {
      port: chrome.port, onlyCategories: ["seo"], output: ["html", "json"], logLevel: "error",
    });
    const name = `${page}-${language}`;
    await writeFile(resolve(output, `${name}.report.html`), result.report[0]);
    await writeFile(resolve(output, `${name}.report.json`), result.report[1]);
    const audits = result.lhr.categories.seo.auditRefs.filter(ref => ref.weight > 0).map(ref => ({
      id: ref.id, title: result.lhr.audits[ref.id].title, score: result.lhr.audits[ref.id].score,
    }));
    const record = { page, language, path, auditedUrl: result.lhr.finalDisplayedUrl,
      productionCanonical: canonical, score: result.lhr.categories.seo.score * 100,
      lighthouseVersion: result.lhr.lighthouseVersion, fetchTime: result.lhr.fetchTime,
      htmlSha256: createHash("sha256").update(html).digest("hex"), audits };
    results.push(record);
    console.log(JSON.stringify({ path, seo: record.score, failures: audits.filter(a => a.score !== 1) }));
  }
} finally { await chrome.kill(); }

const summary = { scope: "Production HTML served locally; not a live-domain PageSpeed report",
  productionOrigin, sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), results };
await writeFile(resolve(output, "summary.json"), JSON.stringify(summary, null, 2));
const cards = results.map(r => `<article><strong>${r.score}<small>/100</small></strong><h2>${r.path}</h2><p>${r.language.toUpperCase()} · ${r.audits.filter(a => a.score === 1).length}/${r.audits.length} kontrol prešlo</p><a href="${r.page}-${r.language}.report.html">Otvoriť originálny Lighthouse report ↗</a></article>`).join("");
await writeFile(resolve(output, "index.html"), `<!doctype html><html lang="sk"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Produkčné SEO — výsledky Lighthouse</title><style>body{margin:0;padding:48px 6%;background:#0b090f;color:#f2eef5;font:16px/1.6 system-ui,sans-serif}main{max-width:1200px;margin:auto}h1{font-size:clamp(28px,4vw,48px);line-height:1.15}header>p{max-width:800px;color:#bfb1d0}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin:36px 0}article{padding:24px;border:1px solid #574663;border-radius:12px;background:#141117}strong{font-size:60px;line-height:1;color:#91ddae}small{font-size:18px;color:#aaa3b5}h2{font-size:17px;overflow-wrap:anywhere;font-weight:500}article p{font-size:14px;color:#aaa3b5}a{color:#c3a1f9;font-size:14px}aside{border-top:1px solid #574663;padding-top:20px;color:#bfb1d0}</style><main><header><p>OLIVERLIBIC.DEV / PRODUKČNÉ ZOSTAVENIE</p><h1>Skutočný výsledok SEO.</h1><p>Originálne audity Lighthouse 13.5.0 pre všetkých šesť stránok. Merané lokálne na produkčnom HTML so správnymi adresami oliverlibic.dev a povoleným indexovaním.</p></header><section>${cards}</section><aside>Verejný náhľad na workers.dev zostáva zámerne noindex a jeho starý PageSpeed report bude naďalej ukazovať 69. Tento výsledok overuje pripravené produkčné zostavenie; meranie ostrej domény nasleduje po jej nasadení.</aside></main></html>`);
if (results.some(result => result.score !== 100)) process.exitCode = 1;
