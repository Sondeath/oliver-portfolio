# Design QA — services in the approved liquid visual system

final result: passed

## Scope and visual sources

Completed 2026-10-15. User asked to make “Čo robím” match the approved portfolio and flow from projects. This is a scoped extension of that selected design and existing service content. Source style: approved hero assets and qa-flow-transition/14-gallery-final.png. Content/layout baseline: qa-services-flow/01-before.png, captured from the public site. Local implementation: http://127.0.0.1:8787/#services. Previous QA preserved in qa-services-flow/design-qa-before-services.md.

## Comparison and fidelity surfaces

Combined comparison-services.jpg and comparison-type.jpg inspected: baseline left, final implementation right. Both 1440 × 1100 CSS viewport, 1425 × 1089 raster, section top 110px, closed automation/archive. Same density, no stretching. Focused title comparison uses identical x=0–780, y=150–535 crops. The increased section height, typography and image inclusion are intentional changes requested by the user, not fidelity failures against the old layout.

comparison-approved-vocabulary.jpg compares the selected work section with the new services, using equal 660 × 390 crops at original density. This checks continuity rather than exact geometry: services deliberately use a smaller display scale. 16-projects-to-services.jpg shows the actual shared boundary with the unchanged archive between them.

- Typography: existing self-hosted Anton now carries the services heading and two main offering titles, matching the selected work design. Inter remains for descriptions, controls, email actions and secondary automation. Two-line main titles remain readable down to 320px; complete text remains in the accessibility tree.
- Spacing/layout: open three-column service rows, fine separators, transparent artwork and stable text. At 700px and below, title/art share a row and supporting text follows. The continuation layer extends 360px upward (240px mobile), with a compositing mask; no opaque section seam or new artwork substitute. The archive remains in front of decoration and functional.
- Colors/tokens: existing #0B090F, #291440, #A879FF, #F2EEF5 retained. Supporting copy uses #BFB1D0. Violet opacity is lower than the exhibition so descriptions remain readable.
- Image quality: actual approved monitor.webp, shirt.webp and liquid-aura.webp reused without new downloads. Their proportions, transparency and focus remain intact; full raster assets, no hand-drawn replacements. Existing licensed SVG icons retained.
- Copy/content: same web/e-shop, textil/promotional-object and automation offers. Added concise email action labels; all three mailto links preserve recipient and relevant encoded subject. Zero forms, prices, invented projects or paid service dependencies.

## Findings fixed

- P2: inherited mobile display:block collapsed the intended heading-to-description gap (06-mobile-services.png). Set the section heading explicitly to flex. Final 08-mobile-fixed.png shows a 24px gap.
- P2: the mobile textile title orphaned “a” onto a separate line (07-mobile-merch.png). Adjusted responsive title scale and prevented implicit wrapping inside its explicit two lines. Final 10-mobile-merch-fixed.png and 12-mobile-320.png confirm clean text/asset separation.
- Tablet automation inherited obsolete summary grid positions. Reset explicit description/icon placement for desktop and mobile; 11-tablet-automation.png confirms the open state without collision.

No actionable P0/P1/P2 findings remain. Early 02/05 captures show in-flight anchor/viewport positions and are contextual only. Final desktop acceptance: 15-final-desktop.jpg. Mobile acceptance: 08, 10 and 12; tablet: 09 and 11.

## Behavior and validation

- Real scroll and reverse scroll move the illustrations subtly and update the liquid phase; text stays stable. Progress moves from 0.41061 at services top 110px to 0.24194 when reversed to top 516.69px.
- Both liquid controls share pause/resume. Browser verified both canvases and aria-pressed switch to still/false, then resume to true. Lazy-created effects inherit the shared pause variable; that specific creation-after-pause timing path was reviewed in code, not separately forced.
- 320, 390, 768, 1024 and 1440px reviewed with no horizontal overflow. Mobile navigation opens, reaches services and closes. Tablet/open automation and its email action verified.
- Archive opens/closes with nine links. With archive open, services document start changes to 3011.58px and measured scroll progress matches expected 0. ResizeObserver tracks both content sections so expanding details does not leave stale geometry.
- ?motion=off: both canvases still, both controls hidden, service progress 0, hero not inert, no overflow. 13-still.jpg inspected.
- Browser console on desktop and narrow test: no warnings/errors. No broken loaded images; zero forms. Mailto recipient/subjects inspected without launching an email client.
- Existing 14 tests pass. Build emits 34 public allowlisted files. JS syntax and staged whitespace checks pass. No new library or media payload; the already cached artwork is reused. Both renderers retain the existing capped 30fps and offscreen/visibility pause behavior.

## Limits and publication

OS-level reduced-motion switching, GPU context loss and the non-WebGL fallback were reviewed in source but not forced in this pass. The fallback continues to use the same static asset. Main-domain switching remains outside this update: publication is the existing branch preview. Live verification is recorded in qa-services-flow/PUBLIC.md after the build.
