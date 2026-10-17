import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { copy } from "../content/site-copy.mjs";
import { renderPage } from "../scripts/render-page.mjs";

const template = await readFile(new URL("../index.html", import.meta.url), "utf8");
const origin = "https://preview.example";

test("both languages cover every copy key and render complete static pages", () => {
  assert.deepEqual(Object.keys(copy.sk).sort(), Object.keys(copy.en).sort());
  for (const language of ["sk", "en"]) {
    const html = renderPage(template, language, origin);
    assert.match(html, new RegExp(`^<!doctype html>\\s+<html lang="${language}">`));
    assert.doesNotMatch(html, /data-copy(?:-attr)?=/);
    assert.equal((html.match(/class="hero-line"/g) || []).length, 2);
    assert.ok(html.includes(copy[language]["hero.lineTwo"]));
    // Multiline closing tags must not swallow sibling links or disclosure content.
    assert.equal((html.match(/class="service-feature service-feature--/g) || []).length, 2);
    assert.ok(html.includes('id="automation"'));
    assert.ok(html.includes('href="https://www.instagram.com/oliver_libic_"'));
    assert.ok(html.includes(copy[language]["automation.intro"]));
    assert.ok(html.includes(`data-pause-label="${copy[language]["motion.pause"]}"`));
    assert.ok(html.includes(`data-resume-label="${copy[language]["motion.play"]}"`));
    assert.ok(html.includes(`alt="${copy[language]["work.shopAlt"]}"`));
    assert.ok(html.includes(`aria-label="${copy[language]["menu.open"]}"`));
    for (const service of ["web", "merch"]) {
      const email = copy[language][`services.${service}.email`].replaceAll("&", "&amp;");
      assert.ok(html.includes(`href="${email}"`));
    }
    assert.ok(html.includes('src="/app.js"'));
    assert.ok(html.includes('href="/site.css"'));
    assert.doesNotMatch(html, /<(?:script|link|img)\b[^>]*(?:src|href)="(?:assets\/|app\.js|styles\.css)/);
  }
});

test("language URLs have their own metadata, reciprocal alternates and native switch", () => {
  for (const language of ["sk", "en"]) {
    const path = language === "en" ? "/en/" : "/";
    const html = renderPage(template, language, origin);
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin}${path}"`));
    assert.ok(html.includes(`hreflang="sk" href="${origin}/"`));
    assert.ok(html.includes(`hreflang="en" href="${origin}/en/"`));
    assert.match(html, new RegExp(`data-language="${language}"[^>]*aria-current="page"`));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 2);
    assert.ok(html.includes('<meta name="robots" content="noindex, nofollow"'));
  }
  assert.doesNotMatch(renderPage(template, "en", "https://oliverlibic.dev"), /noindex/);
});

test("unsupported languages and missing copy fail instead of leaking template text", () => {
  assert.throws(() => renderPage(template, "de", origin), /Unknown language/);
  assert.throws(() => renderPage('<p data-copy="missing">old</p>', "en", origin), /Missing en copy/);
  assert.throws(() => renderPage('<p data-copy-attr="onclick:skip">old</p>', "en", origin), /Unsupported copy attribute/);
  assert.equal(renderPage('<span data-copy="nav.work">old</span\n><span>keep</span>', "en", origin), '<span>Work</span\n><span>keep</span>');
});

test("every published project has a real local capture and the archive count is accurate", async () => {
  const html = renderPage(template, "sk", origin);
  const manifest = JSON.parse(await readFile(new URL("../qa-bilingual/project-sources.json", import.meta.url), "utf8"));
  const paths = [...html.matchAll(/src="(\/assets\/projects\/live\/[^\"]+)"/g)].map((match) => match[1]);
  assert.equal(paths.length, 9);
  assert.equal((html.match(/class="archive-row"/g) || []).length, 7);
  assert.match(copy.sk["archive.title"], /\(7\)/);
  assert.match(copy.en["archive.title"], /\(7\)/);
  assert.doesNotMatch(html, /ghostlayer\.uk|marekradic\.sk/);
  for (const path of paths) {
    await access(new URL(".." + path, import.meta.url));
    assert.ok(manifest.projects.some((project) => "/" + project.file === path && project.source.startsWith("https://")));
  }
});
