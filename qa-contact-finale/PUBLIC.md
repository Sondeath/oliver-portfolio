# Public verification — contact finale

Date: 2026-10-15. Implementation commit 6550fd9. Cloudflare build 2edca5b5-06f0-45fc-a319-626b9ea60e8b succeeded.

Target: https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/#contact

contact.css, app.js, services.css, flow.css and liquid-aura.js returned HTTP 200 and exactly matched SHA256 of committed Git blobs. Public HTML includes the contact stylesheet, email invitation and renderer. Results: public-http.json.

Public browser at the existing 1042 × 1292 viewport: contact top 406.46px, phase 0.79706, webgl-texture / flowing. CTA points to mailto:libic.oliver@gmail.com. No horizontal overflow, forms, broken loaded images, console errors or warnings. 10-public-finale.jpg captured and visually inspected, including transition from automation, invitation, address and footer.

Pausing the contact field switches initialized services/contact canvases to still and both controls to aria-pressed false. Motion resumed afterward. Shared three-field pause was also verified locally after all fields initialized.

Existing public and local tabs were refreshed, not only moved to a new hash, to load the changed HTML. Stable local preview http://127.0.0.1:8787/#contact now serves the 35-file build. Temporary responsive viewport override reset. Main-domain switching is outside this update.
