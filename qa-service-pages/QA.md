# Bilingual service pages — 15 October 2026

Result: implemented and verified on the public branch preview. Production cutover is still pending.

## Pages and content

| Service | Slovak | English |
| --- | --- | --- |
| Websites and shops | `/weby-a-eshopy/` | `/en/websites-and-shops/` |
| Clothing and products | `/textil-a-predmety/` | `/en/clothing-and-merch/` |

The two service presentations on the homepage now link to these pages instead of opening email immediately. Each page has a focused introduction, concrete offer, its own four-step process, native FAQ disclosures, a contact section and a link to the other service. Header work/services links return to the corresponding homepage language; contact stays on the current service page. Native SK/EN links point to the matching service, rather than sending the visitor back to the homepage.

Website content reuses the confirmed BeCool Shop and BeCool.sk stories and their actual captured images. Shoptet and full design-to-launch delivery are confirmed by the user. Clothing imagery is labelled as a concept; no finished merchandise project, client result, minimum order, fixed delivery time or price is invented. Product choice, quantities, finish, price and timing are agreed before production. English is written as a separate natural version of the same offer.

Contact remains email-only. The final CTA opens an editable draft with a short service-specific brief; it sends nothing automatically. Header and direct email links work without a form. No service account, paid dependency or newsletter was introduced.

## Visual and interaction checks

- Inspected desktop SK hero screenshots `01`/`02` at 1280 × 900, then the final web hero in `16`. Typography, transparent artwork and liquid use the existing approved system. Public SK clothing at its native 1042px viewport is in `15`.
- Mobile 390px checks cover the clothing introduction, offer, process and contact (`03`–`08`). Verified 320 × 720 captures are explicitly `10`, `11` and `12`; both language versions and both services fit without document horizontal overflow. Earlier `07`/`08` are 390px captures, despite an attempted viewport change; their filenames have been corrected to their measured size. `09` is the actual 1042px native view.
- Tablet EN at 768 × 1024 is in `13` (FAQ/contact, static mode). Desktop SK process at 1280 × 900 is in `14`. Viewport overrides were checked against live `innerWidth` rather than inferred from a request.
- Native FAQ opens its answer. Mobile menu opens, Escape closes it, focus returns to the toggle, and contact navigation works. Language switching preserves the reading section and `?motion=off`. Static mode keeps the poster visible and hides the liquid control.
- First load shows the raster liquid. The animated field starts on scroll, pointer or keyboard interaction. Its new optional 450,000-pixel budget limits the service background without changing the homepage renderer's default. Verified live WebGL canvas dimensions were 596 × 755 (449,980 pixels), with the renderer active after scrolling. Pause changed the label to “Spustiť pohyb” and `aria-pressed` to false.
- Local final and public English browser error/warning logs were empty. No broken loaded images or forms were found. Actual email delivery was not triggered. Physical touch devices, Safari and OS preference changes were not tested; the explicit static mode was tested.

## Performance and SEO

An initial desktop measurement exposed a costly eager WebGL startup, including 12.8s of blocking time in the intermediate run. The fix defers enhancement until interaction and caps the decorative canvas. Service pages now load one stylesheet containing shared base/navigation styles and their own layout, excluding homepage-specific scene styles. The homepage's bundle is unchanged.

Final public SK website-service measurement, Lighthouse 13.5.0, HeadlessChromium 153.0.8010.36:

| Metric | Mobile (slow 4G, Moto G Power) | Desktop |
| --- | ---: | ---: |
| Performance | 96 | 100 |
| FCP | 1.201s | 0.322s |
| LCP | 2.401s | 0.502s |
| TBT | 0ms | 0ms |
| CLS | 0.071 | 0 |
| Speed Index | 2.326s | 0.342s |
| Automated accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO on non-indexable preview | 69 | 69 |

[Final report, 22:54 CEST](https://pagespeed.web.dev/analysis/https-codex-digital-merch-oliver-portfolio-oliver-6b1-workers-dev-weby-a-eshopy/9zrw2fawo8?form_factor=mobile). DOM snapshots of the initial, intermediate and final reports are preserved here. These are lab measurements of the website-service page; the clothing page and English pages were not given separate Lighthouse runs. They are not field Core Web Vitals data or full accessibility certification.

The sole failed SEO audit is the deliberate preview `noindex, nofollow`; the other nine checks pass. The user's target is 100/100 for production. **100/100 production SEO has not yet been measured and is not claimed.** The production build has no noindex tag. At launch, run Lighthouse on the actual production routes and resolve any production-specific result before calling that target achieved. Keeping preview noindex follows [Google's indexing guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

All six production URLs (home and the two services, each in both languages) are in the generated sitemap. Every service page has a unique localized title/description, canonical URL, reciprocal SK/EN/x-default alternates, OG/Twitter metadata and a language-specific WebPage JSON-LD URL. The registry in `content/routes.mjs` drives rendering, metadata, build output, local redirects and the sitemap. Public browser DOM verifies the new canonical/alternate URLs, localized titles and single stylesheet after deployment.

## Build and publication

All 22 tests pass. New service coverage checks unique metadata, matching language counterparts, indexable production vs noindex preview, valid local anchors, image publication, two real web projects, concept labelling and encoded editable email drafts. Build emits 56 allowed public files. Local `routes.json` records four working service paths, query-preserving slash redirects, correct MIME types and 404 for source/QA/unknown paths. Syntax and whitespace checks pass.

Source implementation `2dc0bcf` passed Cloudflare build `ec4ea8da-0bcc-4a98-baf9-26767e6a115a`; stylesheet/startup refinement `2e7f40c` passed `f8408cae-854a-4d67-84f3-0aff8c833ea4`; final interaction/pixel-budget fix `f07685d` passed `647b4c82-7f10-4c6d-91c8-f49350defb3c`. Native navigation from the public homepage into the website service and between public service/language pages was verified.

No launch blocker remains in the implemented service-page scope. Main-domain publication and the production SEO 100/100 measurement remain pending.
