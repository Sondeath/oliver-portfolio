# Design QA — continuous hero-to-work flow

final result: passed

## Scope and reference

2026-10-14: the user requested a flowing connection between the approved hero and liquid exhibition, removal of the whole copyright/location/scroll-cue/manifesto strip, and preservation of archived projects. This is a scoped motion/layout revision. Prior full exhibition QA: qa-work-liquid/design-qa-before-flow.md.

User annotations: qa-flow-transition/user-before-gap.png and user-remove-strip.png. Browser baseline: existing public branch preview. Implementation: http://127.0.0.1:8793/.

## Combined visual comparison

Inspected qa-flow-transition/comparison-transition.jpg and comparison-boundary.jpg together. Baseline left, implementation right. Both viewport captures use 1440 × 1000 CSS pixels and identical 1425 × 990 raster size, with work top at 600px. Baseline scroll 1200px; implementation scroll 700px because the dead space has been removed. No stretching or density scaling. Focused comparison uses identical y=350–850 crops. Liquid phases differ with time; entering project type is intentionally dimmer before completing its scroll arrival.

Final capture 15-handoff-final.png: arrival 0.32863. The same transparent artwork crosses the garment and section boundary rather than starting in a separate rectangular block. 14-gallery-final.png shows the settled exhibition at arrival 1, work top 110px. Approved website screenshots and desktop arrangement remain intact.

Reviewed typography (Anton/Inter, wrapping), spacing/display geometry, approved black/violet tokens, image quality, real project names/categories, and icon assets. Removed strip has zero DOM instances. Footer copyright, email-only contact and lower archive remain intact; zero forms.

## Corrections

- P2: hero CTA overlapped the work eyebrow in the first attempt (04-handoff.png). Hero copy now leaves before the garment; invisible controls become inert and return on reverse scroll. Final 15, mobile 08 and tall-window 11 confirm clean separation.
- P2: upward decoration initially caused mobile horizontal overflow. Section now clips horizontally but retains vertical overflow for the liquid bridge. No overflow at 320, 390 or 768px.
- Desktop stage bounded to 940px. At 1440 × 1300, work starts at document y=1300 instead of y=2340. 10-tall-initial.png and 11-tall-handoff.png show the shorter composition.

No actionable P0/P1/P2 findings remain. 13-gallery.png is an unsettled anchor capture and excluded. 05 and 07 precede final stage-height normalization; 15 is the final accepted handoff.

## Verification

- Native scroll drives shirt emergence, reversible project arrival and liquid phase from measured geometry. Reverse capture 06 restores arrival 0 and shirt progress 0.71365.
- Mobile handoff 08 visually inspected; stacked projects preserved. 320/390/768px overflow checked. Mobile menu opens/navigates/closes correctly.
- Settled desktop gallery 14 inspected. Pause/resume aria-pressed false/true verified; archive opens/closes with exactly nine links.
- ?motion=off: complete static content, no overlap, hidden motion control, no inert hero content. 12-static.png visually inspected.
- Browser console: no errors/warnings. Contact links and zero forms checked.
- Liquid phase only changes a scalar, preserving the capped 30fps render loop. Existing lazy loading, offscreen pause and static fallback remain.
- npm test: 14/14 pass, including bounded/reversible/proportional handoff. Production build: 33 allowlisted public files. JS syntax and staged whitespace checks pass.

## Limits and publication

OS-level reduced-motion switching and forced WebGL context loss were not emulated; source paths remain implemented. Publication targets the established branch preview, not a main-domain switch. Live verification: qa-flow-transition/PUBLIC.md after deployment.
