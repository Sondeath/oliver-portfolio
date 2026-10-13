# Digital + merch portfolio

The root website implements selected design 2. Existing project links and the
automation service are retained. Merchandise photography is an illustrative
concept; product availability, printing and delivery scope need confirmation.

## Local preview

Requires Node 22 or newer; no npm dependencies are needed.

    npm run build
    npm test
    node scripts/dev.mjs --host 127.0.0.1 --port 8787

The preview serves only the explicit publication list from dist.
It never reads delivery credentials and never sends real email.
Restart the preview or rerun the build after changing source files.

## Contact modes

Without complete server configuration, visitors prepare a request summary and
open it in their own mail application, or copy it. The interface explicitly says
the message has not been sent. Direct email remains available without JavaScript.

The optional Cloudflare Worker enables direct sending only when all of these exist:

- RESEND_API_KEY: a Resend sending key, stored as a Worker secret.
- INQUIRY_FROM: a bare email address on a verified sending domain, stored as a
  secret or server variable; without a display name.
- TURNSTILE_SITE_KEY: public widget key restricted to the deployed hostname.
- TURNSTILE_SECRET_KEY: matching server key, stored as a Worker secret.
- INQUIRY_RATE_LIMIT: the binding in wrangler.jsonc.

Use the Cloudflare dashboard or this command to enter each credential:

    wrangler secret put NAME

Never paste keys into source files, commit them, or send them through chat.
The receiver is fixed to libic.oliver@gmail.com. Customer email is reply-to,
never the sender. The server validates the body, origin, captcha hostname and
action before contacting the email provider. Provider idempotency prevents
duplicate sends of identical requests within its retention window.
Rate limiting is per Cloudflare location; visitors on a shared IP share its limit.
No personal request content is intentionally logged by this code.

## Deploying

Run the build, then deploy the Worker using the root wrangler.jsonc through the
account's normal Cloudflare process. Do not use the old branch's assets directory
of the entire repository: it can publish source files, reviews and private setup.
Review existing namespace IDs in the account before using 731029 for rate limiting.
If the project is hosted as Cloudflare Pages rather than Workers, adapt the API
to Pages Functions or migrate configuration before enabling direct submission.

Before launch, confirm the actual product offer, complete the privacy information
for the chosen operation, verify the sending domain and widget hostname, and test
one real request end to end with authorization. Unit tests mock provider responses;
they do not prove inbox delivery. No deployment or real email was performed here.

References:
[Worker static assets](https://developers.cloudflare.com/workers/static-assets/binding/),
[Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/),
[rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/),
[Resend sending API](https://resend.com/docs/api-reference/emails/send-email).
