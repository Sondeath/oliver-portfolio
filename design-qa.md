# Design QA — approved liquid work exhibition

final result: passed

## Target and state

User explicitly approved the live study on 2026-10-14 and authorized adding it to the website. The selected design is option 1, refined with living violet liquid and then the real marathon page capture in the left display. The existing hero, services, contact and nine archived projects remain functional.

Source visual truth: qa-work-liquid/source-scene.png, captured from the approved study at http://127.0.0.1:8791/. Implementation: http://127.0.0.1:8792/#work.

## Normalization and comparison

Both source and implementation were browser-captured at 1440 × 1300 CSS pixels. The scene regions are 1440 × 1021 raster pixels, clipped from viewport screenshots using DOM-measured region bounds (source-rect.json and implementation-rect.json). No stretching or density scaling was applied. Both are settled exhibition states; exact liquid phase varies with time.

Combined comparison inputs inspected:

- qa-work-liquid/comparison-scene.jpg — approved source left, integrated site right, same-size scene crops.
- qa-work-liquid/comparison-type.jpg — display typography, supporting copy and e-shop caption.
- qa-work-liquid/comparison-project.jpg — real marathon screenshot, aspect, framing, transparency and edge lighting.

Required surfaces:

- Typography: same self-hosted Anton display scale, two-line wrapping, line height and Inter supporting text. Production captions use the existing medium Inter face; the study synthesized a slightly heavier heading weight. Accepted P3 difference.
- Spacing/layout: same staggered display placement, scene aspect and copy position on desktop. E-shop caption sits slightly higher to keep its link clear of the lower display. The pause control moves from the study toolbar into the section eyebrow. Both intentional integration choices.
- Colors/tokens: approved #0B090F, #291440, #A879FF and #F2EEF5 retained. The same generated liquid field and O motif are used as separately compressed transparent WebP layers. Time-dependent flow phase is expected to differ between captures.
- Image quality: real store capture and user-approved real marathon detail, stable and naturally proportioned. Comparison-project.jpg confirms subject and crop match; compression introduces no actionable visual loss. Existing licensed icon assets are reused.
- Copy/content: project names and categories match the approved study. Nine real archive links remain. Contact is email-only; there are zero forms. Study labels and implementation notes are absent from the customer-facing website.

## Findings and correction history

P2-1: At 768px, the desktop stagger put the BeCool.sk caption underneath the larger shop display (08-tablet.png). Changed the stacking breakpoint from 700 to 900px. Re-captured 10-tablet-fixed.png and 11-tablet-lower-fixed.png: projects and captions now stack without collisions. Desktop composition is unchanged. No actionable P0/P1/P2 findings remain.

P2-2: Final public review at 1042px showed the shop caption arrow meeting the upper edge of the lower display. For widths 901–1100px, moved this arrow beside its caption and reserved horizontal space for it. The large desktop and stacked layouts remain unchanged. Narrow desktop evidence: 14-narrow-fixed.png.

Initial 01-desktop.png captured an in-flight anchor/viewport adjustment and 02-integrated-scene.png was an invalid clipped capture. These are diagnostic captures, excluded from the accepted comparison. 03-main-viewport.png and its main-scene.png crop are the settled accepted evidence.

## Interaction and responsive verification

- 1440px: full scene, project links, native archive open/close with exactly nine links, pause/resume and correct aria-pressed state.
- 390px: native menu opens and navigates to work, closes correctly; both project displays and captions reviewed in 05-mobile-top.png and 06-mobile-lower.png.
- 320px: no horizontal overflow; both project images loaded; 07-mobile-320.png.
- 768px: initial collision fixed and reviewed as described above.
- ?motion=off: root motion state off, liquid state still, motion control hidden; 09-static.png.
- Browser console: no errors or warnings. All observed images load. Existing mailto contact and absence of forms verified.
- Asset module is lazy-imported near the work scene. Rendering uses at most 30fps, limited DPR, native intersection/visibility pauses and a static image fallback.
- 13 existing tests pass. Production build emits 32 allowlisted public files. JS syntax and git diff whitespace checks pass.

## Scope and remaining limits

System reduced-motion changes, unavailable WebGL and context-loss fallback are implemented and reviewed in source; GPU loss and OS-level reduced-motion emulation were not forced in the browser. No additional backend or paid service is involved. Existing optional inquiry backend remains unused. No main-domain switch is included: the established branch preview is the publication target for this update.

Earlier hero QA is preserved in qa-purple-motion/design-qa-before-liquid.md. Public deployment verification will be recorded in qa-work-liquid/PUBLIC.md after the build completes.

Public verification completed: Cloudflare build 17851dfb-24a0-4dd7-b9c3-e7b9e51ce0bd succeeded for implementation commit 519addd. All six new/changed client modules and media checked over HTTP match local SHA256. The public browser reports webgl-texture / flowing; pause changes to still and resumes correctly, zero forms/broken images/console errors. See qa-work-liquid/PUBLIC.md and 13-public-final.png. Wrangler 4.150.0 dry-run also passed.
