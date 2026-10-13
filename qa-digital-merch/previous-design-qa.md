# Dark studio redesign — design QA, 2026-09-07

final result: passed

## Target and evidence

Selected target: option 1, continuous dark studio.
Source visual: `design-directions/selected-dark-studio.png` (921 × 1708 pixels).
Local implementation: http://127.0.0.1:8765/
Final comparison capture: `qa-dark-studio/12-final-comparison.png` (921 × 2087 pixels).
State: top of page, dark theme, archive and biography collapsed.

Comparison used both source and implementation images together in the same tool input.
The final browser viewport was 936 × 1708 CSS pixels; the screenshot backend produced
a 921-pixel-wide content image. Comparison is aligned by the actual 921-pixel raster width.
The longer document is deliberate: the live page retains an expandable project archive,
biography, real email and copy control absent from the image mock. No claim of pixel equality.
The screenshot backend controls output density; no assumed deviceScaleFactor override.

Additional desktop evidence:
- `qa-dark-studio/08-desktop-1440.png` — 1440 × 900 CSS viewport; output 1425 × 891.
- `qa-dark-studio/10-desktop-services.png` — focused services/contact inspection.
- `qa-dark-studio/09-archive-open.png` — archive expanded.
Mobile evidence:
- `qa-dark-studio/03-mobile-hero.png` — 390 × 844 CSS; output 375 × 812.
- `qa-dark-studio/04-mobile-menu.png` — modal navigation.
- `qa-dark-studio/05-mobile-about.png` — biography opened by navigation.
- `qa-dark-studio/06-mobile-contact.png` — contact and copy feedback.
- `qa-dark-studio/07-mobile-320.png` — narrow 320 × 740 CSS viewport.
The source has no mobile composition: mobile is a responsive adaptation.
Hero, project names and body copy are readable in the full comparison; a separate source
crop was unnecessary. The services capture additionally checks details at normal desktop size.

## Findings and iteration history

1. Initial comparison: `01-initial-desktop.png`.
   - P2: Wide website screenshots cropped project headings and branding in square cards.
     Fixed by capturing actual sites at a suitable near-square viewport.
   - P2: Portrait was too large inside its crop and cut off the torso.
     Fixed image scale, top offset and placement.
   - P2: Fixed description heights and accumulated gaps weakened section rhythm.
     Removed fixed text heights, aligned service links with flex layout, tightened transitions.
2. Second comparison: `02-desktop-refined.png`.
   - P1: BeCool capture had a browser capture/reflow failure and appeared white.
     Recaptured using the verified screenshot surface, inspected it, recompressed and reloaded.
3. Final visual comparisons: `11-final-desktop.png`, then `12-final-comparison.png`.
   - Project images loaded correctly with legible branding and no clipped main titles.
   - Original portrait is integrated into the continuous background.
   - No remaining actionable P0/P1/P2 layout or image findings.
4. Interaction check found two simultaneous current navigation labels at a section boundary.
   Replaced independent observer flags with one current-section calculation.
   Retested at 1440 × 900: Services is the only current item after Services navigation.
   The final comparison was captured after this change.

## Required fidelity surfaces

- Typography: self-hosted Inter regular/medium closely follows the selected sans-serif design.
  Two-line headline, understated section labels and clear project hierarchy preserved.
  Body copy is intentionally slightly larger than the image mock at smaller desktop widths.
  Native system monospace is used only for small labels.
- Layout: one continuous canvas, left copy/right portrait, two equal project cards,
  three aligned service columns and restrained contact section. Consistent container/gutters.
  Added archive/biography are compact disclosures rather than new full-size sections.
- Colors: near-black #101111, off-white text, cobalt #2554ff and lighter blue for small links.
  Hairlines and subtle project radii retained. No alternating cream/dark panels.
- Images: original portrait and actual browser captures, not generated identity or website art.
  BeCool includes its real white product area and Nedelka includes event details; these are
  intentional differences from the generator's rearranged website previews.
  Existing Lucide icons plus matching official monitor/cart/zap SVG assets are used.
- Content: name and real email preserved. Corrected the mock's invented WordPress/WooCommerce
  attribution to the existing Shoptet project information. Footer uses 2026.
  All 13 portfolio destinations remain available: 2 featured + 11 in the archive.

## Functional and responsive validation

- 320, 390, 921 and 1440 CSS widths checked; no horizontal overflow at tested sizes.
- Desktop CTA and Work/Services anchors navigate to real sections.
- Mobile navigation opens as a native modal; close receives focus.
- Escape closes menu, restores toggle focus, resets aria-expanded and unlocks scrolling.
- Mobile About closes the menu, expands biography and focuses the destination.
- Archive expands and collapses; 11 real links are present.
- Copy button resolves the Clipboard API write and displays its success state.
  The browser automation clipboard read returned empty; OS clipboard contents were not
  independently verified. The mailto link remains directly available.
- Mailto destinations and subjects verified in DOM; no email was sent.
- All local images loaded; Inter font loaded.
- Browser console: no warnings/errors returned for the portfolio tab.
- HTML integrity: unique IDs, all internal anchor targets and referenced local assets exist.
- `node --check app.js` and `git diff --check` passed.
- Reduced-motion CSS inspected: smooth scrolling and transitions disabled in that preference.
  OS preference switching, cross-browser and screen-reader testing were not performed.

## Follow-up polish

- P3: Font rendering and the precise portrait silhouette differ slightly from the generated mock.
- P3: Real project captures naturally contain more detail than its illustrative previews.

## Implementation checklist

- [x] Implement selected dark design in the existing static portfolio.
- [x] Preserve actual project/contact data and all portfolio destinations.
- [x] Correct screenshot cropping, portrait proportions and layout rhythm.
- [x] Test desktop/mobile navigation and disclosure interactions.
- [x] Compare final browser rendering with selected visual.
- [x] Keep the local server available for review.
