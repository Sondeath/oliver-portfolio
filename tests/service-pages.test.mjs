import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { routes } from "../content/routes.mjs";
import { servicePages } from "../content/service-pages.mjs";
import { renderServicePage } from "../scripts/render-service-page.mjs";
import { crawlerFiles, productionOrigin } from "../scripts/seo.mjs";
import { files } from "../scripts/build.mjs";

const template = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("every service URL has native language counterparts, distinct metadata and indexable production output", () => {
  const { sitemap } = crawlerFiles(productionOrigin);
  const titles = new Set();
  for (const page of ["web", "merch"]) for (const language of ["sk", "en"]) {
    const html = renderServicePage(template, page, language, productionOrigin);
    const path = routes[page][language];
    assert.ok(files.includes(path.slice(1) + "index.html"));
    assert.ok(html.includes(`<html lang="${language}">`));
    assert.ok(html.includes(`rel="canonical" href="${productionOrigin}${path}"`));
    assert.ok(sitemap.includes(`<loc>${productionOrigin}${path}</loc>`));
    for (const [code, alternate] of Object.entries(routes[page])) {
      assert.ok(html.includes(`hreflang="${code}" href="${productionOrigin}${alternate}"`));
      assert.match(html, new RegExp(`href="${alternate}"[^>]*data-language="${code}"`));
    }
    const title = html.match(/<title[^>]*>(.*?)<\/title>/s)[1];
    assert.ok(!titles.has(title)); titles.add(title);
    assert.doesNotMatch(html, /\bdata-copy(?:-attr)?=|noindex|<form\b|src="\/app\.js"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema["@graph"].find(item => item["@type"] === "WebPage").url, productionOrigin + path);
    assert.match(renderServicePage(template, page, language, "https://preview.example"), /noindex, nofollow/);
  }
});

test("service journeys have valid internal links, real website captures and editable email briefs", async () => {
  for (const page of ["web", "merch"]) for (const language of ["sk", "en"]) {
    const html = renderServicePage(template, page, language, productionOrigin);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(hash), `Missing #${hash}`);
    assert.ok(html.includes(`href="${routes[page === "web" ? "merch" : "web"][language]}"`));
    const email = html.match(/href="(mailto:[^"]+&amp;body=[^"]+)"/);
    assert.ok(email);
    const draft = new URL(email[1].replaceAll("&amp;", "&"));
    assert.equal(draft.pathname, "libic.oliver@gmail.com");
    assert.equal(draft.searchParams.get("body"), servicePages[page][language].emailBody);
    assert.equal((html.match(/class="detail-project"/g) || []).length, page === "web" ? 2 : 0);
    assert.ok(html.includes(language === "sk" ? "Ukážkový koncept" : "Concept illustration"));
    for (const [, asset] of html.matchAll(/src="(\/assets\/[^\"]+)"/g)) {
      assert.ok(files.includes(asset.slice(1)));
      await access(new URL(".." + asset, import.meta.url));
    }
  }
});
