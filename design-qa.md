# Design QA — closing imprint and contact invitation

final result: passed

## Scope and references

2026-10-15. User requested rethinking the bottom “Poďme na to” section. This continues the selected black/violet type and raster material system. Baseline: qa-contact-finale/01-before.jpg, public contact/footer. Visual vocabulary: approved Anton/Inter, liquid-aura.webp and odtlacok-o.webp already used in projects. Implementation: http://127.0.0.1:8795/#contact; stable preview port 8787 was restarted with the updated 35-file allowlist. Earlier QA preserved in qa-contact-finale/design-qa-before-contact.md.

## Visual comparison

Inspected comparison-finale.jpg (baseline left, revised right) and comparison-contact-region.jpg. Both source/full implementation use 1042 × 1292 CSS viewports, equal 1027 × 1273 raster captures at the contact anchor, clamped to the bottom of the document. Footer top is 1212.18px in both. Contact begins at 625.13px before and 406.46px after because the deliberate finale is taller. No stretching. Focused comparison crops each section at its actual boundary using raster/viewport scale and top-aligns them on a neutral canvas; source 1027 × 578, implementation 1027 × 794. Extra space beneath the shorter source is comparison padding, not UI.

The new contact replaces the opaque purple band with continuous actual liquid artwork and the approved O imprint. The entire two-line invitation now links to email; address remains separately readable below. Oversized type is intentional. On short desktop windows, the invitation is visible immediately and the address/footer follow through native scrolling.

Required surfaces:
- Typography: existing Anton regular for the giant two-line invitation, Inter for kicker, description, labels and address. Explicit line break and narrow-screen scaling preserve readable text. No font substitutions or truncated content.
- Layout: stable foreground text, large O behind the invitation, subtle reversible O departure/arrival, liquid extending 320px upward (220 mobile). Footer separates with one thin rule. At mobile widths, address and personal copy stack.
- Tokens: approved ink, violet, accent and off-white retained. Supporting text #BFB1D0. Hover turns the invitation violet only for fine hover pointers; focus has a visible outline. No generated gradient substitutes for imagery; CSS gradients are compositing masks only.
- Asset fidelity: the existing transparent raster O and liquid texture are reused at their natural ratios. Existing arrow icon retained. No new media payload or imitation SVG artwork. Foreground text stays sharp and stable.
- Content: concise personal invitation, explicit email address, no form or provider signup. Both main invitation and address use mailto:libic.oliver@gmail.com. Footer copyright, location, Instagram and return-to-top links retained.

## Fixes and accepted states

P2: at 320px, the title plus arrow/gap exceeded the invitation row by about 5px. Reduced the narrowest scale from 27vw to 26vw. Final title 209.61px + arrow 36px + gap 12px fits inside 260.67px. No horizontal overflow or hidden controls remain.

04-mobile.jpg and 05-mobile-320.jpg include the fine-pointer hover color while testing responsive viewports. This is an intentional interaction state, not the neutral mobile appearance. 06-mobile-320-final.jpg and 08-mobile-neutral.jpg are the accepted neutral final captures. Initial 02-desktop.jpg uses the normal 1280 × 720 browser viewport; 03-desktop-matched.jpg is the normalized comparison source. 07-static.jpg is the settled reduced-motion-equivalent preview.

## Behavior and verification

- 320, 390, 1042 and 1280px reviewed with no document horizontal overflow. Static 1440px also reviewed. Native mobile menu reaches contact and closes. Footer return-to-top restores scroll 0, work arrival 0 and accessible hero controls.
- Shared pause switches all three initialized liquid canvases to still and all three buttons to aria-pressed false; resuming restores motion. New field retains the existing lazy loader, capped 30fps, offscreen/visibility pause and static fallback.
- ?motion=off: contact progress 1, controls hidden; initialized service/contact canvases still. Work canvas may stay uninitialized while offscreen, as intended. Static content, contact links and footer remain available.
- Correct email URLs inspected without launching a mail client. Browser console on desktop/mobile has no errors or warnings. No forms and no broken loaded images.
- Existing 14 tests pass, including the same reversible bounded workArrival helper now driving contact entry. Production build emits 35 public files. JS syntax and staged whitespace checks pass.

No actionable P0/P1/P2 findings remain. Physical touch input, OS preference switching and GPU-loss fallback were not forced; their behavior is handled in CSS/source and inherited from the tested renderer. Public branch preview remains the publication target, with verification in qa-contact-finale/PUBLIC.md.
