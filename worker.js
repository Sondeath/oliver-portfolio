import {
  SERVICE_LABELS,
  CONTACT_EMAIL,
  readInquiry,
  validateInquiry,
  formatInquiry,
} from "./inquiry.js";
const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
const configured = (env) =>
  Boolean(
    env.RESEND_API_KEY &&
      env.INQUIRY_FROM &&
      env.TURNSTILE_SITE_KEY &&
      env.TURNSTILE_SECRET_KEY &&
      env.INQUIRY_RATE_LIMIT &&
      /^[^\r\n<>@\s]+@[^\r\n<>@\s]+\.[^\r\n<>@\s]+$/.test(env.INQUIRY_FROM),
  );
async function boundedJson(request) {
  if (Number(request.headers.get("content-length")) > 24000)
    throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  let size = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 24000) {
      await reader.cancel();
      throw new Error("size");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function handleInquiry(request, env, send = fetch) {
  if (request.method !== "POST") return json({ error: "method" }, 405);
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin)
    return json({ error: "origin" }, 403);
  if (!configured(env)) return json({ error: "unavailable" }, 503);
  if (
    !(request.headers.get("content-type") || "").startsWith("application/json")
  )
    return json({ error: "content_type" }, 415);
  let raw;
  try {
    raw = await boundedJson(request);
  } catch (error) {
    return json(
      { error: error.message === "size" ? "too_large" : "invalid" },
      error.message === "size" ? 413 : 400,
    );
  }
  if (!raw || Array.isArray(raw) || typeof raw !== "object")
    return json({ error: "invalid" }, 400);
  const keys = [
    "name",
    "email",
    "description",
    "company",
    "budget",
    "quantity",
    "deadline",
  ];
  if (
    keys.some((key) => raw[key] !== undefined && typeof raw[key] !== "string")
  )
    return json({ error: "invalid" }, 400);
  if (
    !Array.isArray(raw.services) ||
    !raw.services.length ||
    raw.services.length > 5 ||
    raw.services.some((key) => !Object.hasOwn(SERVICE_LABELS, key))
  )
    return json({ error: "services" }, 400);
  if (
    typeof raw.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      raw.requestId,
    )
  )
    return json({ error: "request_id" }, 400);
  if (typeof raw.token !== "string" || !raw.token || raw.token.length > 2048)
    return json({ error: "verification" }, 400);
  const data = new FormData();
  for (const key of keys) data.set(key, raw[key] || "");
  raw.services.forEach((service) => data.append("services", service));
  const value = readInquiry(data);
  if (Object.keys(validateInquiry(value)).length)
    return json({ error: "validation" }, 400);
  try {
    // Contact forms have no authenticated user; shared IPs share this modest abuse limit.
    const limit = await env.INQUIRY_RATE_LIMIT.limit({
      key: "inquiry:" + (request.headers.get("cf-connecting-ip") || "unknown"),
    });
    if (!limit.success) return json({ error: "rate_limited" }, 429);
    const verification = await send(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: raw.token,
          remoteip: request.headers.get("cf-connecting-ip") || undefined,
        }),
        signal: AbortSignal.timeout(7000),
      },
    );
    if (!verification.ok)
      return json({ error: "verification_unavailable" }, 502);
    const proof = await verification.json();
    if (
      !proof.success ||
      proof.action !== "inquiry" ||
      proof.hostname !== url.hostname
    )
      return json({ error: "verification" }, 400);
    const message = {
      from: env.INQUIRY_FROM,
      to: [CONTACT_EMAIL],
      reply_to: value.email,
      subject:
        "Nezáväzný dopyt — " +
        value.services.map((key) => SERVICE_LABELS[key]).join(", "),
      text: formatInquiry(value),
    };
    const body = JSON.stringify(message);
    const hash = Array.from(
      new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body)),
      ),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");
    const delivered = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": raw.requestId + "/" + hash,
      },
      body,
      signal: AbortSignal.timeout(9000),
    });
    if (!delivered.ok) return json({ error: "delivery_unavailable" }, 502);
    const receipt = await delivered.json();
    if (typeof receipt.id !== "string" || !receipt.id)
      return json({ error: "delivery_unconfirmed" }, 502);
    // Provider acceptance is not a promise of inbox delivery.
    return json({ accepted: true });
  } catch {
    return json({ error: "unavailable" }, 502);
  }
}
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/api/inquiry-config") {
      if (request.method !== "GET") return json({ error: "method" }, 405);
      return json(
        configured(env)
          ? { mode: "direct", siteKey: env.TURNSTILE_SITE_KEY }
          : { mode: "email" },
      );
    }
    if (path === "/api/inquiry") return handleInquiry(request, env);
    if (path.startsWith("/api/")) return json({ error: "not_found" }, 404);
    return env.ASSETS.fetch(request);
  },
};
