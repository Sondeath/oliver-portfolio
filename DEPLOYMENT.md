# Portfolio — Odtlačok

The current website implements the selected monitor-to-textile concept in the
approved black/lilac palette. It is a static HTML/CSS/ES module site with native
scrolling, a layered scroll-driven hero, two featured real projects, an expandable
project archive, a concise service section and email contact.

## Preview and checks

Requires Node 22 or newer. There are no npm dependencies.

    npm run build
    npm test
    node scripts/dev.mjs --host 127.0.0.1 --port 8790

The dev server only serves the explicit publication list in scripts/build.mjs.
Restart it when changing the list. The build validates and clears its dist output
before copying files, so removed files cannot carry forward between builds.

## Contact

The user explicitly chose email links for this version. There is no contact form,
no client-side request collection and no call to the inquiry API or Turnstile.
Every contact link uses libic.oliver@gmail.com; service links optionally set a
subject. No email service account or payment is required.

The earlier optional Worker delivery backend and its tests remain in the
repository for a possible later decision. It is not used by this interface.
Do not configure email credentials or restore a form without the user's request.

## Motion

The hero uses two generated transparent WebP layers, not a flattened screenshot.
Its progress follows the measured sticky interval, supports reverse scrolling,
and gently damps updates independently of screen refresh rate. Pointer depth is
limited to devices with a fine mouse pointer. Animation work stops when settled.

The approved work exhibition uses separate transparent WebP artwork in
assets/work-liquid. liquid-aura.js gently displaces that texture with WebGL;
actual project screenshots, headings and links remain stable HTML. The module
loads when the work scene approaches the viewport, pauses offscreen and when
the document is hidden, and provides a native pause/resume button. It respects
the system reduced-motion preference and ?motion=off, and retains a static
image when WebGL is unavailable. Tablet and mobile layouts stack the projects.
The left display shows the approved real ČSOB Bratislava Marathon page capture.

prefers-reduced-motion disables the scroll timeline, pointer movement, looping
cue and reveal animations, and presents the complete static composition.
For a reproducible still preview, append ?motion=off to the URL. This is also
used for browser QA. Navigation and project disclosure use native controls.

## Assets

Monitor and shirt originals, exact prompts and optimized WebP files are in
assets/hero-purple. These are illustrative product concepts, not completed
client merchandise. The project previews are actual captured BeCool pages.

Inter and Anton are self-hosted Google Fonts under their included SIL OFL
licenses. Existing licensed Lucide SVG icons are reused. Design exploration,
prompts, source PNG files and QA reports are excluded from publication.

## Cloudflare

wrangler.jsonc invokes npm run build before bundling the Worker and publishes
only dist through the ASSETS binding. The branch build uses Wrangler versions
upload to produce a review preview. It does not switch the main domain.

## Preview metadata

WORKERS_CI_BRANCH selects this branch's stable review origin, so canonical and
Open Graph image URLs resolve on the preview itself. Preview builds include
noindex/nofollow. Main builds keep https://oliverlibic.dev as the canonical origin.
SITE_ORIGIN can explicitly override the origin for a future deployment; invalid
protocols, credentials and paths fail validation before output is published.

Cloudflare documents the injected branch variable in
[Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).
