# Design QA — portfolio redesign

## Comparison target

- Source visual truth: existing portfolio screens captured during the audit in `/Users/oliver/Documents/OLIVER PORTFOLIO/audit-2026-09-07/`.
- Implementation: `http://127.0.0.1:8765/` serving the current workspace.
- Desktop viewport: 1280 × 720 CSS px; screenshots use the browser's default device density.
- Mobile viewport: 390 × 844 CSS px was checked during implementation.
- States: desktop hero, desktop selected work, expanded BeCool detail, services, contact, copied email, mobile menu open.

## Evidence

- `/Users/oliver/Documents/OLIVER PORTFOLIO/qa-2026-09-07/01-desktop-hero.png`
- `/Users/oliver/Documents/OLIVER PORTFOLIO/qa-2026-09-07/02-desktop-work.png`
- `/Users/oliver/Documents/OLIVER PORTFOLIO/qa-2026-09-07/03-project-detail.png`
- `/Users/oliver/Documents/OLIVER PORTFOLIO/qa-2026-09-07/04-desktop-services.png`
- `/Users/oliver/Documents/OLIVER PORTFOLIO/qa-2026-09-07/05-desktop-contact.png`

Focused comparisons were required for the hero hierarchy, featured project screenshot, project detail disclosure and contact CTA. The implementation was judged directly against those captured states and the existing portfolio audit evidence.

## Required fidelity surfaces

- Fonts and typography: the existing Archivo, Instrument Serif and JetBrains Mono system is retained. The redesign reduces decorative tracking on body copy and uses larger practical text sizes for project and service descriptions.
- Spacing and layout rhythm: the 340vh hero and 340vh Approach runway were removed. The work section begins at approximately 763 px on the tested desktop viewport, immediately after the hero.
- Colors and visual tokens: the existing cream, black and electric blue palette is retained. New controls use the same border and blue accent system.
- Image quality and asset fidelity: real captures from BeCool, BeCool Shop and Nedelka are stored under `assets/projects/` and rendered as project previews. No placeholder project images are used.
- Copy and content: the hero states the profession and user outcome immediately; project descriptions identify context and experience; services are grouped by client need.

## Primary interactions tested

- Hero CTA navigates to `#work`.
- Header links navigate to Work, Services, About and Contact.
- Project details expand and collapse using native `<details>` controls.
- External project links include `target="_blank"`, `rel="noopener noreferrer"` and screen-reader context.
- Contact copy button copied `libic.oliver@gmail.com` and announced `Email address copied. Ready when you are.`.
- At 390 × 844, the menu opened as a native dialog and moved focus to Close navigation. Native Escape handling, focus containment and background inertness are provided by the dialog element.
- No horizontal overflow was observed at 1280 px desktop width; all images loaded with non-zero natural dimensions.

## Findings

- No actionable P0, P1 or P2 issues remain in the redesigned route.
- P3: the project screenshots are full-page captures, so the three preview crops show browser-like page chrome from the source websites. A future pass can replace them with curated browser-free crops if those assets are available.
- P3: the page still uses English copy. This is intentional for the current portfolio audience and can be localized in a separate content pass.

## Comparison history

1. The previous route put a 340vh hero, a manifesto, a 340vh approach section and a long work index before the contact path. The new route moves selected work directly below a compact hero.
2. The previous work index exposed names and tags only. The new route adds three real project images, context, experience, visit links and an expandable archive of the remaining ten projects.
3. The previous services list mixed six overlapping capabilities. The new route groups them into Websites & redesigns, E-commerce and Make your site better, each with a related project link.
4. The previous mobile menu was a transformed div without reliable Escape handling or focus containment. The new route uses a native dialog with `aria-expanded`, a close control, focus return and native keyboard behavior.

## Implementation checklist

- [x] Immediate profession statement and primary CTAs.
- [x] Selected project previews above the archive.
- [x] Expandable project context and external links.
- [x] Services grouped by client need.
- [x] Short, readable collaboration process.
- [x] Semantic main content, headings, skip link and focus-visible states.
- [x] Mobile layout checked at 390 × 844.
- [x] Copy email interaction and live status announcement.
- [x] Local server responds with HTTP 200.

final result: passed
