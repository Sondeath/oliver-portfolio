import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { crawlerFiles, productionOrigin } from "../scripts/seo.mjs";
import { renderPage } from "../scripts/render-page.mjs";
import { files } from "../scripts/build.mjs";

const template = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("only production advertises indexable SK and EN URLs to crawlers", () => {
  for (const origin of [productionOrigin, "https://preview.example"]) {
    const { robots, sitemap } = crawlerFiles(origin);
    assert.match(robots, /Disallow: \/api\//);
    assert.doesNotMatch(robots, /Disallow: \/\s*$/m);
    const production = origin === productionOrigin;
    assert.equal((sitemap.match(/<loc>/g) || []).length, production ? 6 : 0);
    assert.equal(robots.includes("Sitemap:"), production);
    assert.doesNotMatch(sitemap, /<lastmod>/); // Never invent content modification dates.
    for (const language of ["sk", "en"]) {
      const html = renderPage(template, language, origin);
      assert.equal(html.includes("noindex"), !production);
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
      const page = schema["@graph"].find(item => item["@type"] === "WebPage");
      const url = origin + (language === "en" ? "/en/" : "/");
      assert.equal(page.url, url);
      assert.equal(page.inLanguage, language);
      assert.ok(html.includes(`rel="canonical" href="${url}"`));
      if (production) assert.ok(sitemap.includes(`<loc>${url}</loc>`));
      assert.doesNotMatch(JSON.stringify(schema), /"(?:aggregateRating|review|telephone)":/);
    }
  }
});

test("every image candidate and font is publishable, while QA/source files stay private", async () => {
  const publicFiles = new Set(files);
  for (const name of ["robots.txt", "sitemap.xml", "site.css", "en/index.html"]) assert.ok(publicFiles.has(name));
  assert.ok(files.every(file => !/^(qa-|design-|content\/|tests\/|scripts\/)|\.(ttf|prompt\.txt)$/.test(file)));
  const imagePaths = [...template.matchAll(/(?:src="|(?:srcset|imagesrcset)="|, )(\/assets\/[^\s",]+)/g)].map(match => match[1].slice(1));
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  const fontPaths = [...css.matchAll(/url\("(assets\/fonts\/[^\"]+)"\)/g)].map(match => match[1]);
  for (const path of [...imagePaths, ...fontPaths]) {
    assert.ok(publicFiles.has(path), `Unpublished asset: ${path}`);
    await access(new URL("../" + path, import.meta.url));
  }
});
