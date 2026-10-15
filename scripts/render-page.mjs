import { copy, richCopyKeys } from "../content/site-copy.mjs";
import { productionOrigin, structuredData } from "./seo.mjs";
import { routes } from "../content/routes.mjs";

const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export function renderPage(template, language, origin, { page = "home", overrides = {} } = {}) {
  if (!copy[language]) throw new Error(`Unknown language: ${language}`);
  if (!routes[page]) throw new Error(`Unknown page: ${page}`);
  const strings = { ...copy[language], ...overrides };
  const text = (key) => {
    if (!Object.hasOwn(strings, key)) throw new Error(`Missing ${language} copy: ${key}`);
    return strings[key];
  };
  let html = template.replace('<html lang="sk">', `<html lang="${language}">`);
  html = html.replace(/(<([a-z][\w-]*)\b[^>]*\sdata-copy="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (_, opening, tag, key, previous, closing) =>
    opening.replace(/\sdata-copy="[^"]+"/, "") + (richCopyKeys.has(key) ? text(key) : escape(text(key))) + closing);
  html = html.replace(/<([a-z][\w-]*)\b([^>]*?)\sdata-copy-attr="([^"]+)"([^>]*)>/gi, (_, tag, before, mappings, after) => {
    let attributes = before + after;
    for (const pair of mappings.split(";")) {
      const [attribute, key] = pair.split(":");
      if (!/^(aria-label|alt|href|content|data-pause-label|data-resume-label)$/.test(attribute)) throw new Error(`Unsupported copy attribute: ${attribute}`);
      const value = `${attribute}="${escape(text(key))}"`;
      const existing = new RegExp(`\\b${attribute}="[^"]*"`);
      attributes = existing.test(attributes) ? attributes.replace(existing, () => value) : attributes + " " + value;
    }
    return `<${tag}${attributes}>`;
  });
  html = html.replace(/(<a\b[^>]*data-language="(sk|en)"[^>]*)(>)/g, (_, opening, code, end) => opening.replace(/href="[^"]*"/, `href="${routes[page][code]}"`) + (code === language ? ' aria-current="page"' : "") + end);
  const path = routes[page][language];
  html = html.replace(/(<link rel="alternate" hreflang="(sk|en|x-default)" href=")[^"]+"/g, (_, opening, code) => `${opening}${origin}${routes[page][code === "x-default" ? "sk" : code]}"`);
  html = html.replaceAll("https://oliverlibic.dev", origin);
  html = html.replace(/(<link rel="canonical" href=")[^"]+"/, `$1${origin}${path}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]+"/, `$1${origin}${path}"`);
  html = html.replace("</head>", `<meta property="og:locale" content="${language === "en" ? "en_GB" : "sk_SK"}" />\n</head>`);
  const schema = JSON.stringify(structuredData(language, origin, text("meta.description"), page)).replaceAll("<", "\\u003c");
  html = html.replace("</head>", `<script type="application/ld+json">${schema}</script>\n</head>`);
  if (origin !== productionOrigin) html = html.replace("</head>", '<meta name="robots" content="noindex, nofollow" />\n</head>');
  if (/\bdata-copy(?:-attr)?=/.test(html)) throw new Error("Unrendered copy marker");
  return html;
}
