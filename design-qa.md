# Design QA — Slovak / English and real project captures

final result: passed

2026-10-15. Scope: natural Slovak and English copy, native language switching, real website previews. The approved black/violet layout, Anton/Inter typography, monitor/shirt scroll sequence and shared liquid effects remain the visual reference. Previous QA is preserved in qa-bilingual/design-qa-before-bilingual.md.

## Copy and visual review

Both versions describe Oliver's offer in the first person, without invented results, client quotes or production guarantees. English is written for an English reader rather than translated word for word. Services explain websites/online shops and clothing/branded products; automation remains an optional disclosure. Every contact action still leads to email. No form or subscription was added.

Inspected comparison-copy.jpg: before and revised SK root at the same 1280 × 720 CSS viewport and 1265 × 712 raster size. Captures are placed side by side without stretching. The revised description is more concrete; the header adds a compact SK/EN switch. Type scale, artwork and composition match the approved design.

Reviewed SK and EN at desktop, tablet and mobile widths (1440, 1280, 768, 390 and 320px). Evidence is in the numbered qa-bilingual/*.jpg captures. English headline, service descriptions, email actions and contact finale fit their layouts. Archive thumbnails sit beside project names and descriptions on desktop and stack the labels on mobile. Supporting text retains the existing muted violet palette. Fine-pointer hover colours appear in a few responsive captures; these are interaction states, not OS touch simulation.

## Real work

Nine assets were captured through the browser from actual websites: two featured projects and seven archive entries. qa-bilingual/project-sources.json records source URLs, viewport, capture date, raster sizes and output sizes. The contact sheet was inspected; originals are retained in qa-bilingual/sources/. Images were resized/compressed as WebP, without generated website content. Public assets total 703 KiB (720 KB) and archive thumbnails load lazily.

- BeCool Shop: homepage, with native optional cookies disabled and the informational toast dismissed.
- BeCool.sk: actual ČSOB Bratislava Marathon event page, retaining the approved finish-line image.
- Nedelka: past-events archive because the homepage currently has no upcoming events.
- BeCool Catering, Zakopane Night Run, VibeClub, Bratislava Marathon / BeCool Sport, PH Sport Horses and Jump Studio: real pages, with captions reflecting their observed content.
- Ghostlayer redirects to the old personal portfolio and is omitted at the user's explicit request. Marek Radič's domain failed DNS resolution and is temporarily omitted rather than given a fabricated screenshot.

## Behaviour and fixes

- Static / and /en/ pages have localized copy, alt text, accessible labels, email subjects and motion controls. Root-relative assets load on both paths. Native language links work without a translation runtime.
- Language switching keeps the current section, query parameters and the open archive/automation disclosure when it occupies the reading area. Verified contact, services, archive, automation and ?motion=off switches. Fixed an initial case where a small part of an open archive above the header could pull the reader back to projects.
- Mobile dialog opens/closes and supports language changes. At 768px the full English header fits without collisions; mobile navigation starts at 760px. No document horizontal overflow was found at tested sizes.
- Pause/resume labels are localized. After lazy initialization, all three liquid controls agree on paused state. Existing motion renderer and scroll choreography are retained. ?motion=off hides motion controls in both languages and keeps content and email links available.
- Fixed template rendering of valid multiline closing tags so adjacent hero lines, service links and footer links remain intact. Regression coverage checks these structures.
- Browser console has no errors/warnings in the final local review. No broken loaded images and no forms. Physical touch, GPU loss and OS preference switching were not forced; existing reduced-motion/fallback handling is unchanged.

## Build and publication

All 18 tests pass, including copy-key parity, static localization, language-specific metadata, native URLs, missing-copy failures and project asset provenance/count. Build emits 43 explicitly allowed public files. QA files, copy sources and render scripts are excluded from publication. Whitespace/syntax checks pass. Public branch deployment verification is recorded in qa-bilingual/PUBLIC.md; the main domain remains outside this preview update.

No actionable P0/P1/P2 findings remain in the reviewed scope.
