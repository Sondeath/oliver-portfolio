# Design QA — black / purple Odtlačok

final result: passed

## Target and scope

Selected source: design-rethink-2026-10-13/navrh-purple-approved.png.
Implementation: http://127.0.0.1:8790/.
The user approved black/dark purple/lilac, the monitor-to-shirt composition,
two actual featured projects and email-only contact, then authorized completing
the functional website autonomously. No form or paid email service is in this UI.

## Normalized comparison

The source is 971x1619 pixels. Its hero 0..940 is the complete-emergence state.
The corresponding implementation was captured at 1440x1393 CSS pixels, progress
0.99970 (scroll 1114.67), producing 1425x1379 raster pixels. Browser screenshots
exclude the 15px scrollbar and scale both dimensions consistently. The source
hero was resized proportionally to 1425x1380 before the combined comparisons;
neither image was stretched.

Accepted comparison inputs, inspected together:

- qa-purple-motion/comparison-hero-final.jpg — full composition, type, color,
  imagery, spatial grouping, header and CTA.
- qa-purple-motion/comparison-type-final.jpg — heading/carons, supporting copy,
  paragraph rhythm, font sizing, icon and CTA.
- qa-purple-motion/comparison-work-final.jpg — work chapter, both real project
  captures, captions and disclosure. Source work 940..1500 and implementation
  work crop are aligned by width, with original vertical spacing preserved.

Native 1440x1000 and 1366x768 layouts intentionally shorten the poster-like source
to keep the heading, offer, email CTA and object visible in a real laptop window.
Tablet/mobile stack the same hierarchy. Actual project captures replace the
generated source's illustrative laptop view so the client work remains factual.

## Findings and corrections

P2-1: Image HTML height hints stretched the independently generated layers.
Fixed with responsive height:auto; desktop 03 and later show natural asset ratios.

P2-2: The 390px heading approached the right edge.
Fixed with proportional mobile display sizing; mobile 08 and 320px capture 11 show clearance.

P2-3: The display heading's caron touched the previous line.
Fixed with explicit line spacing; desktop 18 and the final type comparison show
separation without losing the condensed hierarchy.

P2-4: Tall-viewport supporting text/CTA were too small relative to the source.
Fixed with tall-viewport subtitle 42px, paragraph 24px, CTA 20px/min 80px sizing.
Evidence: 21-source-matched-type-fixed.png and comparison-type-final.jpg.

P2-5: Work heading and captions were weak beside the project imagery.
Fixed with 74.88px desktop section type, 18px introduction and 26px captions.
Evidence: 24-work-type-fixed.png and comparison-work-final.jpg.

The final comparison found no remaining actionable P0/P1/P2 issues.
P3: Generated fabric folds and exact print texture differ from the single
concept image. The independently layered assets preserve material, silhouette,
palette and screen-to-textile framing; no flattened-page screenshot is used.

## Functional and responsive verification

Verified in the in-app browser:

- Desktop 1440x1000, source-matched 1440x1393, laptop 1366x768,
  tablet 768x1024, mobile 390x844 and 320x760.
- Loaded self-hosted Inter/Anton, no broken images or horizontal overflow.
- Progressive shirt emergence, changing subtitle accent and reverse scrolling.
  Progress endpoints 0 and 1 observed; natural scrolling and anchor navigation work.
- Both actual featured links opened the expected shop.becool.sk and www.becool.sk.
- Archive opens all 9 existing projects, focuses SUMMARY from its shortcut,
  and toggles using Enter. Automation disclosure opens with its email link.
- Mobile menu opens, closes through contact selection and focuses the contact
  section. The native dialog provides focus containment.
- Contact, header and service links target libic.oliver@gmail.com; optional
  subjects are encoded. document.forms.length is 0. No mail was sent.
- Still preview ?motion=off: no motion-ready timeline, no intro/reveal animation,
  normal scrolling and a complete static shirt composition.
- Browser console: no errors or warnings on the tested local build.

Accessibility checks include native links/details/dialog, keyboard archive
operation, visible focus styles, skip target, decorative image handling and
reduced-motion path. This is not a full WCAG certification. The OS-level reduced
motion preference was not changed; its shared code path and CSS were inspected
and the deterministic still-preview path was exercised.

## Build and publication checks

13 unit tests pass: 2 publication-origin, 2 motion, 9 retained optional delivery/
inquiry tests. The retained delivery tests mock providers and do not represent
a currently exposed form.
npm run build emits 27 explicitly allowed files. Wrangler 4.150.0 dry-run succeeds.
Wrangler's 32-entry count includes 5 directories; there are 27 actual public files.
Preview-origin metadata and noindex injection were exercised in a branch build.
HTTP smoke checks return 200 for the page, modules, fonts, WebP layers and share
image; source Worker, deployment notes, secrets and removed inquiry.js return 404.

Public branch verification is recorded after the Cloudflare build below.
The public branch preview was verified after commit 61d1348:
https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/
Cloudflare check succeeded (build d71e53cb-1b95-4b7e-bd81-0b6ff9192097).
Public document has the new title, loaded fonts/images, zero forms, its own
canonical/share-image origin and noindex/nofollow. Published app.js, motion.js,
styles.css and social-preview.jpg match local SHA-256 hashes. Private source,
deployment notes, secret paths and removed inquiry.js return 404.
Accepted public captures begin at qa-purple-motion/25-public-desktop.png.

Public mobile verification also passed at 390x844: menu Escape restores focus to
the opener and releases scroll locking; project shortcut opens archive 9 and
focuses SUMMARY; contact navigation focuses its section, retains the correct
mailto and exposes no form. Public scroll progress 0, 0.77574 and 1 observed;
the mobile composition advances upward as the garment unfolds. Public console
has no errors or warnings. Captures 28–31 record these states.
