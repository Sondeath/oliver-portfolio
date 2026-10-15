import { servicePages } from "../content/service-pages.mjs";
import { copy } from "../content/site-copy.mjs";
import { routes } from "../content/routes.mjs";
import { renderPage } from "./render-page.mjs";

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const lines = values => values.map((value, index) => {
  if (index !== values.length - 1) return escape(value);
  const punctuation = /[.?!]$/.test(value) ? value.slice(-1) : ".";
  const text = /[.?!]$/.test(value) ? value.slice(0, -1) : value;
  return escape(text) + `<span class="accent">${punctuation}</span>`;
}).join("<br />");
const arrow = '<img class="icon" src="/assets/icons/arrow-up-right.svg" width="24" height="24" alt="" />';
const down = '<img class="icon" src="/assets/icons/arrow-down.svg" width="24" height="24" alt="" />';

export function renderServicePage(template, page, language, origin) {
  const service = servicePages[page];
  const c = service?.[language];
  if (!c) throw new Error(`Unknown service page: ${page}/${language}`);
  const common = copy[language];
  const home = routes.home[language];
  const email = `mailto:libic.oliver@gmail.com?subject=${encodeURIComponent(c.subject)}`;
  const briefEmail = email + "&body=" + encodeURIComponent(c.emailBody);
  const artWidth = service.art === "monitor" ? 1159 : 1254;
  const artHeight = service.art === "monitor" ? 1358 : 1254;
  const srcset = `/assets/hero-purple/${service.art}-480.webp 480w, /assets/hero-purple/${service.art}-800.webp 800w, /assets/hero-purple/${service.art}.webp ${artWidth}w`;
  const sizes = "(max-width: 760px) 85vw, (max-width: 1100px) 42vw, 560px";
  let prefix = template.slice(0, template.indexOf('    <main id="main"'))
    .replace('src="/app.js"', 'src="/service-page.js"')
    .replace(/    <link rel="preload" as="image"[^>]+>\s*/g, "")
    .replace('<link rel="stylesheet" href="/site.css" />', `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${sizes}" />\n    <link rel="stylesheet" href="/site.css" />\n    <link rel="stylesheet" href="/service-page.css" />`)
    .replace('<body>', `<body class="service-page service-page--${page}">`)
    .replace('class="wordmark" href="#top"', `class="wordmark" href="${home}"`)
    .replaceAll('href="#work"', `href="${home}#work"`)
    .replaceAll('href="#services"', `href="${home}#services"`);
  const footer = template.slice(template.indexOf('    <footer class="site-footer'));
  const projects = page === "web" ? `
    <section class="detail-section detail-projects" id="examples" aria-labelledby="examples-title">
      <p class="eyebrow">${escape(c.workLabel)}</p>
      <div class="detail-section-heading"><h2 id="examples-title">${lines(c.workHeading)}</h2><p>${escape(c.workIntro)}</p></div>
      <div class="detail-project-grid">${[
        ["BeCool Shop", "becool-shop", 1085, 1085, "https://shop.becool.sk/", "shop"],
        ["BeCool.sk", "becool-marathon", 1280, 800, "https://www.becool.sk/podujatia/csob-maraton", "web"],
      ].map(([name, image, width, height, url, key]) => `<article class="detail-project">
        <a class="detail-screen" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${escape(common[`work.${key}Open`])}"><img src="/assets/projects/live/${image}.webp" srcset="/assets/projects/live/${image}-480.webp 480w, /assets/projects/live/${image}-800.webp 800w, /assets/projects/live/${image}.webp ${width}w" sizes="(max-width: 760px) 90vw, 44vw" width="${width}" height="${height}" loading="lazy" alt="${escape(common[`work.${key}Alt`])}" /></a>
        <h3><a href="${url}" target="_blank" rel="noopener noreferrer">${name}${arrow}<span class="sr-only">${escape(common["archive.external"])}</span></a></h3>
        <p class="detail-project-type">${escape(common[`work.${key}Type`])}</p><p>${escape(common[`work.${key}Story`])}</p></article>`).join("")}</div>
    </section>` : "";
  const main = `<main id="main" tabindex="-1">
    <div class="detail-flow" aria-hidden="true"><img class="detail-liquid" src="/assets/work-liquid/liquid-aura-960.webp" width="960" height="680" alt="" /><canvas class="detail-liquid" hidden></canvas></div>
    <section class="detail-hero section-pad" id="top" aria-labelledby="detail-title">
      <a class="detail-back text-link" href="${home}#services"><span aria-hidden="true">←</span>${escape(common["services.eyebrow"])}</a>
      <div class="detail-hero-grid"><div class="detail-hero-copy"><p class="eyebrow">${service.number} / ${escape(c.label)}</p>
        <h1 id="detail-title">${lines(c.heading)}</h1><h2 class="detail-lead">${escape(c.lead)}</h2><p class="detail-intro">${escape(c.intro)}</p>
        <div class="detail-actions"><a class="button" href="${email}">${escape(c.action)}${arrow}</a><a class="text-link" href="#offer">${escape(c.explore)}${down}</a></div>
      </div><figure class="detail-artwork"><img class="detail-art" src="/assets/hero-purple/${service.art}.webp" srcset="${srcset}" sizes="${sizes}" width="${artWidth}" height="${artHeight}" alt="" fetchpriority="high" /><figcaption class="micro">${escape(c.concept || (language === "sk" ? "Ukážkový koncept" : "Concept illustration"))}</figcaption></figure></div>
      <div class="detail-hero-note micro"><span>${escape(c.note)}</span><button class="detail-motion-toggle" type="button" hidden aria-pressed="true" data-pause-label="${escape(common["motion.pause"])}" data-resume-label="${escape(common["motion.play"])}">${escape(common["motion.pause"])}</button><span aria-hidden="true">↓</span></div>
    </section>
    <section class="detail-section" id="offer" aria-labelledby="offer-title"><p class="eyebrow">${escape(c.offerLabel)}</p>
      <div class="detail-section-heading"><h2 id="offer-title">${lines(c.offerHeading)}</h2><p>${escape(c.offerIntro)}</p></div>
      <div class="detail-offers">${c.offers.map((offer, i) => `<article class="detail-offer"><span class="detail-number" aria-hidden="true">0${i + 1}</span><h3>${escape(offer.title)}</h3><p>${escape(offer.body)}</p><ul>${offer.items.map(item => `<li>${escape(item)}</li>`).join("")}</ul></article>`).join("")}</div>
    </section>
    ${projects}
    <section class="detail-section detail-process" id="process" aria-labelledby="detail-process-title"><div class="detail-process-intro"><p class="eyebrow">${escape(c.processLabel)}</p><h2 id="detail-process-title">${lines(c.processHeading)}</h2></div>
      <ol>${c.steps.map(([heading, body], i) => `<li><span class="detail-number" aria-hidden="true">0${i + 1}</span><div><h3>${escape(heading)}</h3><p>${escape(body)}</p></div></li>`).join("")}</ol>
    </section>
    <section class="detail-section detail-faq" id="questions" aria-label="${escape(c.faqLabel)}"><h2 class="eyebrow">${escape(c.faqLabel)}</h2>${c.faqs.map(([heading, body]) => `<details><summary>${escape(heading)}<span aria-hidden="true">+</span></summary><p>${escape(body)}</p></details>`).join("")}</section>
    <section class="detail-section detail-contact" id="contact" tabindex="-1" aria-labelledby="detail-contact-title"><p class="eyebrow">${escape(common["contact.noteLabel"])}</p>
      <div class="detail-section-heading"><h2 id="detail-contact-title">${lines(c.contactHeading)}</h2><div><p>${escape(c.contactIntro)}</p><a class="button" href="${escape(briefEmail)}">${escape(c.action)}${arrow}</a><a class="detail-email" href="${email}">libic.oliver@gmail.com</a></div></div>
    </section>
    <aside class="detail-section detail-cross" aria-label="${escape(c.crossLabel)}"><p class="eyebrow">${escape(c.crossLabel)}</p><p>${escape(c.crossHeading)}</p><a class="text-link" href="${routes[service.other][language]}">${escape(c.crossAction)}${arrow}</a></aside>
  </main>`;
  return renderPage(prefix + main + footer, language, origin, { page, overrides: {
    "meta.title": c.title, "meta.description": c.description, "meta.socialDescription": c.description,
    "homeLabel": language === "sk" ? "Oliver Libič — hlavná stránka" : "Oliver Libič — home",
  } });
}
