# Production SEO verification

15 October 2026. All six production pages scored **100/100 SEO** in Lighthouse 13.5.0, with all ten weighted checks passing on every page. This is an actual local Lighthouse audit of the production HTML, not a live PageSpeed measurement of oliverlibic.dev and not a changed score for the noindex branch preview.

The pages were served at `http://127.0.0.1:8790` using the normal development server with `SITE_ORIGIN=https://oliverlibic.dev`. The audit script verified HTTP 200, the correct production canonical and the absence of a noindex meta tag before each run. Reports retain their original local requested/final URLs; no report fields or audit results were rewritten. `summary.json` records source commit, production canonicals, HTML SHA-256 hashes, timestamps, Lighthouse version and all scored checks. Chromium 151 ran with an isolated temporary profile.

| Production URL | SEO | Scored checks |
| --- | ---: | ---: |
| https://oliverlibic.dev/ | 100 | 10/10 |
| https://oliverlibic.dev/en/ | 100 | 10/10 |
| https://oliverlibic.dev/weby-a-eshopy/ | 100 | 10/10 |
| https://oliverlibic.dev/en/websites-and-shops/ | 100 | 10/10 |
| https://oliverlibic.dev/textil-a-predmety/ | 100 | 10/10 |
| https://oliverlibic.dev/en/clothing-and-merch/ | 100 | 10/10 |

Every `*.report.html` is the original self-contained Lighthouse report; `*.report.json` is its original machine-readable counterpart. The local overview links to all six. `verified-results.jpg` shows the inspected overview. These files are not included in the public website's asset allowlist.

Reproduce with Node >=22.19 and lighthouse@13.5.0 installed in an external tools directory: set `LIGHTHOUSE_DEPS` to that directory, set `CHROME_PATH` to Chromium, start `scripts/dev.mjs --port 8790` with the production origin above, then run `scripts/audit-production-seo.mjs`. `scripts/serve-seo-report.mjs` serves only these reports on loopback port 8792. It changes no site content or indexing configuration. The workflow follows the [official Lighthouse CLI/module documentation](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).

The user-visible PageSpeed report for workers.dev remains 69 because the preview deliberately blocks indexing; it measures a different publication configuration. The production configuration has now been verified at 100 locally. Domain deployment, public response headers/routing verification and a fresh PageSpeed report on the live domain remain pending. This basic automated SEO score does not establish rankings, indexing status or a complete search/content audit.
