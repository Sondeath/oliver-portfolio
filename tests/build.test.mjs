import test from "node:test";
import assert from "node:assert/strict";
import { publicationOrigin } from "../scripts/build.mjs";

test("production and branch preview use their own canonical and share-image origin", () => {
  assert.equal(publicationOrigin({}), "https://oliverlibic.dev");
  assert.equal(
    publicationOrigin({ WORKERS_CI_BRANCH: "main" }),
    "https://oliverlibic.dev",
  );
  assert.equal(
    publicationOrigin({ WORKERS_CI_BRANCH: "codex/digital-merch" }),
    "https://codex-digital-merch-oliver-portfolio.oliver-6b1.workers.dev",
  );
  assert.equal(
    publicationOrigin({ SITE_ORIGIN: "https://preview.example/" }),
    "https://preview.example",
  );
});

test("invalid metadata origins fail before publication", () => {
  for (const SITE_ORIGIN of [
    "javascript:alert(1)",
    "https://user:secret@example.com",
    "https://example.com/path",
    "https://example.com/?secret=1",
  ])
    assert.throws(() => publicationOrigin({ SITE_ORIGIN }));
});
