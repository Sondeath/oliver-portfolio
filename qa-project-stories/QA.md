# Project stories

final result: passed

2026-10-15. Added the exact SK and EN stories approved by the user. The user confirmed full delivery of both projects from design to launch, with BeCool Shop built on Shoptet.

Desktop presents two short text columns below the existing monitor exhibition, matching the screen positions: BeCool.sk left and BeCool Shop right. Violet 12px labels, muted 15px Inter body copy and the existing liquid material connect them to the projects and archive without new cards or a separate section background. Wide-screen padding is capped to the exhibition's 1490px maximum frame.

At 900px and below, each story follows its own project name/type and fills the available caption width. Body copy is 14px with 1.75 line height. The link arrow stays beside the project heading. The alternate desktop presentation is display:none, so only one copy of each story is visible and exposed to assistive technology. Both presentations render from the same localization keys; no JavaScript is needed for the layout.

Reviewed screenshots 01/02 (SK/EN desktop), 03/04 (EN mobile), 05/06 (SK/EN at 320px), and 07 (901px boundary). No horizontal overflow, broken loaded images or console warnings/errors were found. Mobile AX snapshot places the descriptions inside their corresponding project articles and omits the desktop duplicate. Desktop AX snapshot contains only the two desktop descriptions.

All 18 existing tests pass. Build emits 43 public files. No new media, libraries or motion code. Public verification is recorded in PUBLIC.md.
