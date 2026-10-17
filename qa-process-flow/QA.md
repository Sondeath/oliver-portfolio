# How we work together

final result: passed

2026-10-15. New bilingual process section between services and contact. Four steps cover the first email, agreement on scope/price/timing, design and implementation, and launch or production/handover. Copy distinguishes website content/features from product selection, quantities, print artwork and production. No invented pricing, deadlines or revision limits. The first action is a localized mailto link.

Visual design continues Anton headings, Inter body copy, dark violet numbers and the existing liquid texture. Desktop uses a sticky introduction and an ordered list with a thin vertical thread. On mobile the introduction flows normally; each step's description spans the available width. The section remains transparent and the existing contact aura overlaps its ending.

The thread fills reversibly from the reading position using the existing clamped, damped animation loop. Observed phases: 0.39649 before scrolling, 0.80036 lower down, and 0.36728 after returning. The texture moves only 40px over the full scroll interval; no additional WebGL canvas, dependency or media asset. Reduced-motion/forced-still presentation shows the complete thread and visible text without animation.

Reviewed SK and EN at 1280px, EN at 390px and 768px, and both languages at 320px. No document horizontal overflow, missing loaded images or console warnings/errors. Handover copy and the transition into contact were also reviewed. Screenshots 01-05 show the initial layout review before the final scope/price wording; 06-08 include the final wording. Public evidence records the published version.

Native language switching preserves #process and ?motion=off. The process action uses libic.oliver@gmail.com with an appropriate localized subject. Four ordered list items remain in static HTML, including explicit list semantics. No forms. Existing navigation stays compact; the section is reachable through normal scrolling and its #process anchor.

All 18 existing tests pass; JavaScript syntax and whitespace checks pass. Build emits 44 explicitly allowed public files, including process.css. The local 8787 server was restarted with the new allowlist. Public deployment verification is recorded in PUBLIC.md.
