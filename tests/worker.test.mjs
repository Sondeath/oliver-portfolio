import test from "node:test";
import assert from "node:assert/strict";
import worker, { handleInquiry } from "../worker.js";
const raw = {
  services: ["textile"],
  name: "Test",
  email: "client@example.com",
  description: "50 tričiek na podujatie",
  company: "",
  budget: "",
  quantity: "50",
  deadline: "2026-11-30",
  token: "test-token",
  requestId: "00345678-1234-4123-8123-123456789abc",
};
const env = {
  RESEND_API_KEY: "test-only",
  INQUIRY_FROM: "form@example.com",
  TURNSTILE_SITE_KEY: "test-key",
  TURNSTILE_SECRET_KEY: "test-secret",
  INQUIRY_RATE_LIMIT: { limit: async () => ({ success: true }) },
};
function request(body = raw, extra = {}) {
  return new Request("https://portfolio.example/api/inquiry", {
    method: "POST",
    headers: {
      origin: "https://portfolio.example",
      "content-type": "application/json",
      ...extra,
    },
    body: JSON.stringify(body),
  });
}
const proof = () =>
  Response.json({
    success: true,
    hostname: "portfolio.example",
    action: "inquiry",
  });
test("unconfigured deployment advertises honest email flow without secrets", async () => {
  const response = await worker.fetch(
    new Request("https://portfolio.example/api/inquiry-config"),
    { RESEND_API_KEY: "hidden" },
  );
  assert.deepEqual(await response.json(), { mode: "email" });
  assert.equal((await handleInquiry(request(), {})).status, 503);
});
test("wrong origin and malformed requests never contact external providers", async () => {
  const never = () => {
    throw new Error("must not send");
  };
  assert.equal(
    (
      await handleInquiry(
        request(raw, { origin: "https://attacker.example" }),
        env,
        never,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleInquiry(request({ ...raw, email: "bad" }), env, never)).status,
    400,
  );
  assert.equal(
    (await handleInquiry(request({ ...raw, services: ["fake"] }), env, never))
      .status,
    400,
  );
  assert.equal(
    (await handleInquiry(request({ ...raw, requestId: "invalid" }), env, never))
      .status,
    400,
  );
  assert.equal(
    (
      await handleInquiry(
        request({ ...raw, description: "x".repeat(25000) }),
        env,
        never,
      )
    ).status,
    413,
  );
});
test("rate limit and wrong captcha hostname or action block sending", async () => {
  const blocked = {
    ...env,
    INQUIRY_RATE_LIMIT: { limit: async () => ({ success: false }) },
  };
  assert.equal(
    (
      await handleInquiry(request(), blocked, () => {
        throw Error("must not send");
      })
    ).status,
    429,
  );
  for (const mismatch of [
    { hostname: "attacker.example", action: "inquiry" },
    { hostname: "portfolio.example", action: "other" },
  ]) {
    let calls = 0;
    const response = await handleInquiry(request(), env, async () => {
      calls++;
      return Response.json({ success: true, ...mismatch });
    });
    assert.equal(response.status, 400);
    assert.equal(calls, 1);
  }
});
test("provider acceptance uses fixed recipient, reply-to and stable idempotency", async () => {
  const keys = [];
  const send = async (url, options) => {
    if (url.includes("siteverify")) return proof();
    assert.equal(url, "https://api.resend.com/emails");
    const body = JSON.parse(options.body);
    assert.deepEqual(body.to, ["libic.oliver@gmail.com"]);
    assert.equal(body.reply_to, "client@example.com");
    assert.equal(body.from, "form@example.com");
    assert.match(body.text, /50/);
    keys.push(options.headers["Idempotency-Key"]);
    return Response.json({ id: "mock-receipt" });
  };
  assert.deepEqual(await (await handleInquiry(request(), env, send)).json(), {
    accepted: true,
  });
  assert.deepEqual(await (await handleInquiry(request(), env, send)).json(), {
    accepted: true,
  });
  assert.equal(keys[0], keys[1]);
});
test("provider failure, missing receipt and network error cannot return accepted", async () => {
  for (const result of [
    () => new Response("failed", { status: 500 }),
    () => Response.json({}),
    () => {
      throw new Error("network");
    },
  ]) {
    const response = await handleInquiry(request(), env, async (url) =>
      url.includes("siteverify") ? proof() : result(),
    );
    assert.equal(response.status, 502);
    assert.notEqual((await response.json()).accepted, true);
  }
});
