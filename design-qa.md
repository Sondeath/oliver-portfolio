# Design QA — black / purple Odtlačok

final result: passed

## Target and scope

Selected source: design-rethink-2026-10-13/navrh-purple-approved.png.
Implementation: http://127.0.0.1:8790/.
The user approved black/dark purple/lilac, the monitor-to-shirt composition,
two actual featured projects and email-only contact, then authorized completing
the functional website autonomously. No form or paid email service is in this UI.

## Normalized comparison

The source is971x1619 pixels. Its hero0..940 is the complete-emergence state.
The corresponding implementation was captured at1440x1393 CSS pixels, progress
0.99970 (scroll1114.67), producing1425x1379 raster pixels. Browser screenshots
exclude the15px scrollbar and scale both dimensions consistently. The source
hero was resized proportionally to1425x1380 before the combined comparisons;
neither image was stretched.

Accepted comparison inputs, inspected together:

- qa-purple-motion/comparison-hero-final.jpg — full composition, type, color,
  imagery, spatial grouping, header and CTA.
- qa-purple-motion/comparison-type-final.jpg — heading/carons, supporting copy,
  paragraph rhythm, font sizing, icon and CTA.
- qa-purple-motion/comparison-work-final.jpg — work chapter, both real project
  captures, captions and disclosure. Source work940..1500 and implementation
  work crop are aligned by width, with original vertical spacing preserved.

Native1440x1000 and1366x768 layouts intentionally shorten the poster-like source
to keep the heading, offer, email CTA and object visible in a real laptop window.
Tablet/mobile stack the same hierarchy. Actual project captures replace the
generated source's illustrative laptop view so the client work remains factual.

## Findings and corrections

P2-1: Image HTML height hints stretched the independently generated layers.
Fixed with responsive height:auto; desktop03 and later show natural asset ratios.

P2-2: The390px heading approached the right edge.
Fixed with proportional mobile display sizing; mobile08 and320px11 show clearance.

P2-3: The display heading's caron touched the previous line.
Fixed with explicit line spacing; desktop18 and the final type comparison show
separation without losing the condensed hierarchy.

P2-4: Tall-viewport supporting text/CTA were too small relative to the source.
Fixed with tall-viewport subtitle42px, paragraph24px, CTA20px/min80px sizing.
Evidence:21-source-matched-type-fixed.png and comparison-type-final.jpg.

P2-5: Work heading and captions were weak beside the project imagery.
Fixed with74.88px desktop section type,18px introduction and26px captions.
Evidence:24-work-type-fixed.png and comparison-work-final.jpg.

The final comparison found no remaining actionable P0/P1/P2 issues.
P3: Generated fabric folds and exact print texture differ from the single
concept image. The independently layered assets preserve material, silhouette,
palette and screen-to-textile framing; no flattened-page screenshot is used.

## Functional and responsive verification

Verified in the in-app browser:

- Desktop1440x1000, source-matched1440x1393, laptop1366x768,
  tablet768x1024, mobile390x844 and320x760.
- Loaded self-hosted Inter/Anton, no broken images or horizontal overflow.
- Progressive shirt emergence, changing subtitle accent and reverse scrolling.
  Progress endpoints0 and1 observed; natural scrolling and anchor navigation work.
- Both actual featured links opened the expected shop.becool.sk and www.becool.sk.
- Archive opens all9 existing projects, focuses SUMMARY from its shortcut,
  and toggles using Enter. Automation disclosure opens with its email link.
- Mobile menu opens, closes through contact selection and focuses the contact
  section. The native dialog provides focus containment.
- Contact, header and service links target libic.oliver@gmail.com; optional
  subjects are encoded. document.forms.length is0. No mail was sent.
- Still preview ?motion=off: no motion-ready timeline, no intro/reveal animation,
  normal scrolling and a complete static shirt composition.
- Browser console: no errors or warnings on the tested local build.

Accessibility checks include native links/details/dialog, keyboard archive
operation, visible focus styles, skip target, decorative image handling and
reduced-motion path. This is not a full WCAG certification. The OS-level reduced
motion preference was not changed; its shared code path and CSS were inspected
and the deterministic still-preview path was exercised.

## Build and publication checks

13 unit tests pass:2 publication-origin,2 motion,9 retained optional delivery/
inquiry tests. The retained delivery tests mock providers and do not represent
a currently exposed form.
npm run build emits27 explicitly allowed files. Wrangler4.150.0 dry-run succeeds.
Wrangler's32-entry count includes5 directories; there are27 actual public files.
Preview-origin metadata and noindex injection were exercised in a branch build.
HTTP smoke checks return200 for the page, modules, fonts, WebP layers and share
image; source Worker, deployment notes, secrets and removed inquiry.js return404.

Public branch verification is recorded after the Cloudflare build below.
