export const productionOrigin = "https://oliverlibic.dev";
const xml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export function crawlerFiles(origin) {
  const production = origin === productionOrigin;
  // Let crawlers read the preview's noindex tag; robots.txt is not an index ban.
  const robots = "User-agent: *\nDisallow: /api/\n" +
    (production ? `\nSitemap: ${origin}/sitemap.xml\n` : "");
  const alternatives = [ ["sk", "/"], ["en", "/en/"], ["x-default", "/"] ];
  const urls = production ? ["/", "/en/"].map(path =>
    `  <url>\n    <loc>${xml(origin + path)}</loc>\n` +
    alternatives.map(([language, alternate]) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${xml(origin + alternate)}" />`).join("\n") +
    "\n  </url>").join("\n") : "";
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls + '\n</urlset>\n';
  return { robots, sitemap };
}

export function structuredData(language, origin, description) {
  const person = `${origin}/#oliver`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": person, name: "Oliver Libič", url: `${origin}/`,
        sameAs: ["https://www.instagram.com/oliver_libic_"] },
      { "@type": "WebSite", "@id": `${origin}/#website`, name: "Oliver Libič",
        url: `${origin}/`, inLanguage: ["sk", "en"], author: { "@id": person } },
      { "@type": "WebPage", "@id": `${origin}${language === "en" ? "/en/" : "/"}#page`,
        url: `${origin}${language === "en" ? "/en/" : "/"}`, inLanguage: language, description,
        isPartOf: { "@id": `${origin}/#website` }, about: { "@id": person } },
    ],
  };
}
