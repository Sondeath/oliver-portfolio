# Public verification — Slovak / English portfolio

2026-10-15. Implementation commit: 233e797. Cloudflare build 2484fbcc-354c-49ed-a3b2-4cb72b1bf970 completed successfully.

- SK: https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/
- EN: https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev/en/

Both pages were opened in the normal browser after deployment. SK and EN title, document language and canonical URL match their own language. English locale is en_GB and branch preview retains noindex/nofollow. Public English root and projects were captured and visually inspected (20-public-en.jpg, 21-public-en-work.jpg). The archive is recorded in 22-public-archive.jpg.

All nine new WebP assets loaded successfully with their intended natural dimensions: 1085 × 1085 shop, 1280 × 800 featured event page, and seven 960 × 600 archive thumbnails. Seven archive links remain. No horizontal overflow, forms or console errors/warnings were found. Public observations are saved in public-browser.json.

The native EN → SK switch at the expanded archive lands on /#archive with the disclosure still open. /en?motion=off redirects to /en/?motion=off, remains English and hides all three motion controls. Local checks also cover mobile menu switching, service/contact anchors, automation disclosure and query preservation.

An independent Python HTTP probe received Cloudflare 403 / code 1010. It was not used to claim byte-for-byte verification; no access-control workaround was attempted. Public verification used the normal authorized browser, where the pages and assets work correctly. The successful GitHub/Cloudflare check identifies the deployed implementation commit.

The local server at http://127.0.0.1:8787/ was restarted with the 43-file publication list and serves /en/ and the new assets. All 18 tests pass. Main-domain switching is outside this preview update.
