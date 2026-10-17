# Launch readiness audit — 15 October 2026

Result: ready for production cutover, with the domain cutover still pending.

Scope: final speed, responsive behaviour and technical SEO of the approved black/violet portfolio. All screenshots here were captured during this audit. No main-branch merge, DNS change or production deployment was performed. Public preview changes are on `codex/digital-merch`.

## Measured performance

PageSpeed Insights, Lighthouse 13.5.0, HeadlessChromium 153.0.8010.36. Mobile uses an emulated Moto G Power and slow 4G. These are individual lab runs, not measurements from real visitors or a field Core Web Vitals assessment. The preview has no CrUX data.

| Page / run | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| SK mobile, before | 91 | 1.801 s | 3.001 s | 1 ms | 0 | 4.525 s |
| SK desktop, before | 98 | 0.401 s | 0.581 s | 128 ms | 0 | 0.836 s |
| SK mobile, optimized | 97 | 1.353 s | 1.653 s | 0 ms | 0 | 4.158 s |
| SK desktop, optimized | 100 | 0.282 s | 0.362 s | 74 ms | 0 | 0.615 s |
| EN mobile, optimized | 97 | 1.352 s | 1.652 s | 0 ms | 0 | 4.216 s |
| EN desktop, optimized | 96 | 0.321 s | 0.384 s | 162 ms | 0 | 0.613 s |

All runs scored 100 for automated accessibility and best practices. This is not a complete WCAG certification. SEO scored 69 because the branch preview deliberately carries `noindex, nofollow`; all nine other automated SEO checks passed. No SEO score is claimed for the future production deployment.

Reports:

- [Baseline SK, 21:14 CEST](https://pagespeed.web.dev/analysis/https-codex-digital-merch-oliver-portfolio-oliver-6b1-workers-dev/v1xjure00j?form_factor=mobile)
- [Optimized SK, 21:29 CEST](https://pagespeed.web.dev/analysis/https-codex-digital-merch-oliver-portfolio-oliver-6b1-workers-dev/qbrdkq2nyl?form_factor=mobile)
- [Optimized EN, 21:31 CEST](https://pagespeed.web.dev/analysis/https-codex-digital-merch-oliver-portfolio-oliver-6b1-workers-dev-en/slojxobzsc?form_factor=mobile)

The report DOM snapshots are saved alongside this file. `12-pagespeed-mobile.jpg` is the actual saved SK result, inspected after capture. The score reports measure the optimized preview; the final follow-up only reserves the contact arrow's dimensions and removes blank-line whitespace. Public HTML verification confirms that follow-up is present. A previously cached report can still list the old arrow diagnostic; its final width/height are present in the live DOM.

## Fixes

- Original TTF fonts totalled 820,936 bytes. WOFF2 subsets total 124,096 bytes: **84.9% smaller**. Glyph coverage was checked against every visible character in both rendered pages, with no missing characters in any of the three fonts. Slovak diacritics, punctuation and original font outlines are retained. Original TTFs and OFL licences remain in the repository; only WOFF2 and licences are published.
- Hero and featured-project images now have responsive 480/800/full-size candidates. Matching responsive hero preloads prevent a separate full-size fallback download. Service illustrations reuse those candidates. Original project captures and full-resolution hero assets are retained.
- The transparent liquid fallback is resized to 960 × 680, from 388,770 to 166,376 bytes. The O texture has 640, 800 and 1254px versions. Transparency is retained. Native mobile and desktop screenshots were inspected against the original design; static-mode screenshots also verify the fallback rather than only the animated canvas.
- Seven authoring stylesheets are combined in their original cascade order into `/site.css` at build time. No runtime library, remote font service or new canvas was added.
- Icons now reserve width/height, including the final contact arrow. Service illustration dimensions were corrected to their actual source aspect ratios.

Remaining Lighthouse suggestions concern further decorative-image compression, CSS minification (about 3 KiB), render blocking and layout measurement. Current performance is green; more aggressive compression or changes to the approved animation are not needed for this launch. Desktop EN TBT remains below 200ms in this lab run. No long-scroll frame-rate claim is made from a Lighthouse loading test.

## Journey review

1. **Arrival and navigation — healthy.** Checked at 320 × 720, 390 × 844, 768 × 1024 and 1280 × 720 CSS viewports. Both language headers fit. Mobile menu opens, closes and navigates to work/services/contact. Escape closes the native dialog and restores focus to the menu button; `aria-expanded` returns to false.
2. **Projects and services — healthy.** Both featured projects retain their real captures and stories. The archive opens/closes and shows seven image-backed links. No broken loaded images or horizontal document overflow appeared. Service email actions retain localized subjects. `04`, `05`, `06` and `18` document the inspected states.
3. **Collaboration and contact — healthy.** Mobile steps remain readable; the narrow Slovak title wraps naturally. Desktop English retains the sticky composition. Contact still has zero forms and uses `mailto:libic.oliver@gmail.com`; no email was sent during testing. `07`, `08`, `09`, `11`, `13` and `19` are the inspected evidence.
4. **Language and motion — healthy.** Native SK/EN navigation preserves the contact section and `?motion=off#process`. Static mode hides liquid controls and keeps content available. Native desktop scroll changed hero progress from 0 to 0.75 and the shirt transform from scale 0.85/0.73 toward its expanded state; `16` and `17` show that change. A liquid pause updated initialized controls consistently. Uninitialized controls stay hidden until their field loads. Browser warning/error logs were empty in the final local review and public EN review.

Screenshots `01`/`03` and `02`/`04` use matching mobile viewports before and after optimization. They retain the same typography, spacing and composition. Browser screenshots can include mouse hover states; viewport resizing does not emulate a physical touch device. Physical iOS/Safari, Android hardware, OS reduced-motion changes and forced GPU/context loss were not tested in this session. The existing reduced-motion implementation was retained and the explicit static mode was tested.

## SEO and routing

- Production build has canonical `https://oliverlibic.dev/` and `https://oliverlibic.dev/en/`, reciprocal SK/EN/x-default alternates, localized titles/descriptions/OG/Twitter metadata, image alt descriptions and correct document languages.
- Production `robots.txt` allows public pages, excludes `/api/` and points to the absolute sitemap. The valid XML sitemap contains only the two canonical pages with language alternates. It invents no modification dates.
- Person, WebSite and language-specific WebPage JSON-LD use the confirmed identity and public Instagram link. No fabricated ratings, reviews or business address are included; rich-result eligibility is not promised.
- Preview keeps `noindex, nofollow`, allows crawlers to read that instruction and advertises no indexable sitemap URLs. This follows [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Sitemap and alternates follow [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).
- `production-seo.json` records the generated production metadata and sitemap. Public browser DOM confirms preview-specific canonical, JSON-LD, `/site.css`, noindex and the final arrow dimensions in both languages.
- Local route checks in `local-routes.json` confirm HTML/CSS/WOFF2/XML MIME types, `/en` redirect with query preservation, and 404 for unknown routes, scripts and QA files. Public plain-text `robots.txt` navigation was blocked by the browser automation client, so its live response is not claimed as independently inspected. The generated files, allowlist and successful Cloudflare build are verified.
- Cloudflare's default [automatic trailing-slash handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/) matches the `/en/` canonical. No SPA fallback was introduced.

## Validation and publication

20 automated tests passed. New coverage verifies production/preview indexing separation, language-specific structured data, canonical/sitemap agreement and publication of every image candidate/font while excluding source and QA files. Build emits 50 explicitly allowed public files. `git diff --check` passes. Asset generation is reproducible with `scripts/optimize-assets.py` (Pillow, fonttools, brotli); the prebuilt files require no Python dependency in Cloudflare.

Implementation `9c4706e` passed Cloudflare build `4aa6d9c8-b8ce-4bff-a1d6-cb954d7dfabf`. Final contact dimension follow-up `d94548f` passed build `d80960c4-659f-496f-9466-6996798caf01`. Public SK and EN were reloaded and checked after that deployment.

No P0/P1/P2 launch blockers remain in the audited scope. Next action: merge the reviewed preview into main to launch on oliverlibic.dev. At cutover, verify the production origin is `https://oliverlibic.dev`, check both public language URLs and live robots/sitemap, rerun production PageSpeed/SEO, then submit the sitemap in Search Console if an account is available. The actual domain cutover and post-launch indexing checks remain pending.
