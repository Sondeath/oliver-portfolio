# Design QA — selected direction 2

final result: passed

This result covers the local frontend and the implemented email-draft journey.
It does not certify production launch or live email delivery.

## Source and capture

- Visual truth: design-review-2026-10-13/navrh-2.png, the second displayed ImageGen result selected by the user.
- Source pixels: 1229 × 1280.
- CSS viewport for primary comparison: 1229 × 1280, devicePixelRatio approximately 1.
- Browser capture: qa-digital-merch/14-desktop-native.png; final handoff capture: qa-digital-merch/22-desktop-verified.png.
- Capture pixels: 1214 × 1264. The screenshot backend returns a slightly smaller raster than the requested CSS frame. The source was resized to the same raster dimensions for comparison, without cropping or changing either original.
- State: page top, default unfilled form, email-draft mode, advanced request details closed.
- Full comparison: qa-digital-merch/comparison-final.jpg. Left is selected visual, right is browser implementation.
- Focused comparisons: comparison-typography.jpg, comparison-offers.jpg, comparison-form.jpg in the same folder.
- Short-desktop evidence: 21-desktop-wide-fixed.png (1440 × 1024 CSS).
- Responsive evidence: 18-mobile-final.png (390 × 844 CSS), 10-mobile-320.png and 11-mobile-merch.png (320 × 844 CSS), 17-tablet-final.png (768 × 1024 CSS).
- Browser: Codex in-app browser. All screenshots were opened and inspected.

## Findings and accepted differences

No actionable P0/P1/P2 findings remain in the local frontend.

- Typography: self-hosted Inter regular and medium preserve the selected sans-serif hierarchy. Large headline, single-line desktop offer headings, modest mono category labels and readable supporting text are present. Both offer headings wrap naturally on mobile.
- Spacing: equal offer columns, matched image baselines and CTA baselines, restrained gutters and compact inquiry layout reproduce the selected hierarchy. The two desktop image tops and CTA tops were measured equal; the same is true at the tablet width.
- Colors: charcoal left surface, warm-white right surface, cobalt CTA and headline accent follow the selected design. Pale focus outlines, visible field borders and plain error text support interaction states.
- Images: dedicated generated laptop and merchandise raster assets match the selected subjects and palette. Production uses compressed WebP files; original PNGs and exact generation prompts remain under assets/offer. Existing real project captures remain in the portfolio. Merchandise is explicitly captioned as an illustrative concept.
- Copy: Slovak navigation, offer, portfolio, process and contact text. No invented prices, production guarantees, clients or turnaround claims. The first call to action is “Chcem web”; the second is “Chcem reklamné predmety”.
- Form: visible labels and an advanced details disclosure intentionally extend the mock's minimal contact band. Service selection, optional quantity/date and explicit transport information are necessary to make a useful inquiry. Default primary action says “Pripraviť dopyt”, since no production email credentials are configured.
- Preserved scope: the mock placed a footer directly after contact. The implementation retains real projects, the archive, personal introduction and automation service below contact so the portfolio is not lost.
- Mobile adaptation: stacked offers with top shortcuts to both categories. There is no source mobile mock; these are responsive adaptations of the chosen desktop design.

## Comparison history

1. Initial capture 01-desktop.png exposed excessive image heights from intrinsic HTML height attributes. This was a P1 layout issue. Explicit CSS height:auto fixed both generated and project images.
2. Source versus 02-desktop-fixed.png, recorded together in comparison-initial.jpg, showed a P2 contact-density issue: the main action fell below the comparison frame. The desktop form was changed to three columns, with labels aligned to the top and advanced fields collapsed.
3. Tablet capture 12-tablet.png showed a P2 alignment issue: a forced description line break made the left image and CTA sit lower than the right. Forced line breaks were removed at tablet widths and offer visuals use flexible top spacing. Post-fix evidence is 17-tablet-final.png; measured image and CTA baselines match.
4. Source versus 14-desktop-native.png, recorded together in comparison-final.jpg and focused comparisons, confirms the fixes. Screenshot 22-desktop-verified.png is the final default state and is pixel-identical to the primary comparison capture. There are no remaining actionable P0/P1/P2 differences.
5. The final 1440 × 1024 check in 20-desktop-wide.png exposed partly cut-off primary CTAs at that viewport height (P2). A height-based desktop media query now reduces the image stage for shorter screens. Post-fix evidence is 21-desktop-wide-fixed.png: both CTA bottoms are at 912 CSS pixels, within the 1024-pixel frame. The source-comparison viewport remains unchanged, confirmed by 22-desktop-verified.png.

## Functional verification

Browser checked:
- Main service CTA selects the correct service and focuses the name field.
- Multiple services can be selected together without losing the brief.
- Product choices reveal optional quantity and requested date.
- Automation-only inquiry disables product fields.
- Missing name, email and description receive inline errors; focus moves to first error.
- A valid combined request produces the correct summary, encoded mailto destination and subject/body.
- Copy-summary action copies the request; dialog opens/closes, Escape works and focus returns.
- Privacy information opens/closes and accurately describes the active email-draft mode.
- Mobile menu opens/closes and contact navigation closes it.
- All nine archived project links remain; archive and automation disclosure expand.
- No horizontal overflow at 320, 390, 768, 1229 and 1440 CSS widths.
- All inspected image resources load, including the portrait after scrolling into view.
- No error or warning console entries in the final preview.

Automated:
- npm test: 9 passed, 0 failed. Includes contact validation, hidden stale data, impossible dates, URI encoding, server origin/body restrictions, captcha hostname/action, rate limiting, provider failure and retry idempotency.
- npm run build: explicit public file list created successfully.
- Wrangler 4.150.0 deploy --dry-run: bundled successfully with ASSETS and rate-limit bindings.
- Clean-checkout deployment check: the first archive of the pushed commit reproduced a missing dist error without a manual build. Added build.command to wrangler.jsonc, then reran deploy --dry-run in the same clean archive with no prebuilt assets. Wrangler ran npm run build and bundled successfully. This confirms the standalone clean-checkout fix; the separate Cloudflare build log still requires account access to establish its precise failure cause.
- git diff --check: passed.

## Production limits

- Live email sending has not been tested. Provider calls in unit tests are mocked.
- The optional direct-send Worker requires verified sender, Resend key and Turnstile keys.
- The current local preview always uses email-draft mode and cannot send external email.
- Cloudflare CLI reports no authenticated account. No deployment was attempted.
- Actual product range and whether Oliver supplies production and delivery still need confirmation.
- Privacy information must be completed for the chosen production operation.
- No broad WCAG conformance claim or exhaustive assistive-technology certification is made.

## Follow-up polish

P3 only: the generated laptop camera angle and merchandise framing differ slightly from the selected image. Both keep the subjects, visual balance and palette. The mock's decorative grain is omitted for a clean lightweight surface.

## Implementation checklist

- [x] Selected second visual implemented.
- [x] Real assets placed and compressed.
- [x] Main inquiry journey and mobile navigation verified.
- [x] Portfolio and existing service retained.
- [x] Browser screenshots compared to source together.
- [x] P1/P2 fixes recaptured and checked.
- [x] Tests, build and deployment dry-run passed.
- [ ] Configure and verify production delivery before claiming live receipt.
- [ ] Publish only after account access and final offer details are settled.
