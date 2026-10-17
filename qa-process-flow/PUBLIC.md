# Public process-section verification

2026-10-15. Implementation commit 01ee595. Cloudflare build 3d3a8266-17e4-4f7e-9686-3ee70f0db58a succeeded.

- SK: https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/#process
- EN: https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/en/#process

Both public pages were explicitly reloaded after deployment. Four localized steps, localized email subjects and the new process stylesheet/layout are present. The public SK desktop screenshot 09-public-sk.jpg was captured and inspected. public-browser.json records the observed headings, body copy, list roles, email links, viewport and motion phase for both languages.

Both pages have no horizontal overflow, forms, broken loaded images or console warnings/errors. The normal browser was used for verification. Local QA also covers 320/390/768px layouts, returning scroll progress and the forced-still mode with a fully visible thread. Native language switching keeps #process and the motion query.

All 18 tests pass and build emits 44 public files. The stable local preview on port 8787 was restarted with the new asset allowlist. No main-domain switching is part of this update.
