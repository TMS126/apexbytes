# Security Remediation Handoff

This project is **safe by default**. `POST /api/upload` stays unavailable until all required environment variables are set and `UPLOADS_ENABLED=true` is deliberately enabled. No Cloudflare, Upstash, Vercel, Cloudinary, or GitHub account setting has been changed by this source patch.

## Source-level remediation completed

| Area | Implemented control |
|---|---|
| Upload validation | The route accepts only PDF, JPG, PNG, WEBP, DOC, and DOCX; checks extension/MIME agreement and basic signature bytes; applies a 5 MB limit; generates a UUID identifier; and does not return a delivery URL. |
| Cloudinary privacy | Documents use authenticated delivery in the `apexbyteshub/pending-review` folder. The browser and WhatsApp message receive an internal upload reference, not a public URL. |
| Durable rate limiting | `POST /api/upload` uses a Redis-backed Upstash sliding window of **5 attempts per 10 minutes per trusted client identifier**. It fails closed when Redis is unavailable or unconfigured. [1] |
| Bot verification | The upload modal renders Cloudflare Turnstile when its public key is configured. The server validates the token with Siteverify and checks the expected hostname and action (`document_upload`); missing, invalid, expired, replayed, or unavailable verification fails closed. [2] |
| Retention | A protected scheduled route searches up to **10 Cloudinary pages of 100 candidates** per invocation (1,000 items), deletes pending uploads older than `UPLOAD_RETENTION_DAYS`, and records bounded audit events in Redis. `vercel.json` schedules it daily at 03:00 UTC in production. [3] |
| Staff administration | Protected metadata-only endpoints list pending uploads, delete an approved object, and return a bounded deletion audit trail. They require the server-only `x-admin-upload-secret` header. Delivery URLs are intentionally not exposed by the app. |
| Dependency risk | `jspdf` is upgraded to `4.2.1`, Next.js to `16.3.3`, and PostCSS to `8.5.26`. The final lockfile audit reports **0 critical, 0 high, 0 moderate, and 0 low** known advisories. [4] |
| CI/CD | Write-capable legacy workflows were removed. The Quality Gate has read-only permissions, SHA-pinned official actions, Corepack, and frozen-lockfile installation before typecheck, lint, test, and build. |
| CSP | The static `unsafe-inline` CSP was replaced with a per-request nonce policy generated in `proxy.ts`. The policy is also forwarded in the request headers so Next.js can attach the nonce to its own output, and it explicitly permits only the Cloudflare Turnstile host required by the widget. |
| Test baseline | The suite now has **11 focused unit tests** covering shared upload choices, client identifier parsing, rate-limit fail-closed behavior, CSP policy construction, and staff/cron authentication. |

## Verified GitHub Action pins

The listed immutable pins were checked against the official repositories and the current `v4` references on 26 August 2026. Raw JSON responses, a plain-text comparison record, and checksums are included in the accompanying `raw-evidence/` bundle; no PDF or document-extraction layer is used for those values.

| Action | Pinned commit | Official tag match | Commit verification |
|---|---|---:|---:|
| `actions/checkout` | `11d5960a326750d5838078e36cf38b85af677262` | `v4` | Verified |
| `actions/setup-node` | `49933ea5288caeca8642d1e84afbd3f7d6820020` | `v4` | Verified |

## Required provider-account activation steps

The source is ready, but the provider controls below require your account credentials and approval. Vercel and Cloudflare integrations are not enabled for this task, and no Upstash account connection is configured.

| Order | Provider | Required action | Do not proceed until |
|---:|---|---|---|
| 1 | Upstash | Create a Redis database, then add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the hosting provider’s encrypted environment settings. | The upload route returns a durable-limit result in a staging test. |
| 2 | Cloudflare | Create a Turnstile widget for the exact production hostname. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_EXPECTED_HOSTNAME`. | A staged valid widget token is accepted and an expired/replayed token is rejected. [2] |
| 3 | Cloudinary | Confirm authenticated delivery, avoid unsigned upload presets for the pending-review folder, limit staff access, and define the final retention policy. Store `CLOUDINARY_*` only as encrypted server-side variables. | Staff can retrieve an approved document through Cloudinary’s authenticated workflow without a public URL. [5] |
| 4 | Vercel | Add `ADMIN_UPLOADS_SECRET`, `CRON_SECRET`, and `UPLOAD_RETENTION_DAYS` (recommended initial value: `30`). Deploy the included `vercel.json` and verify the production cron call is authorised. | `GET /api/admin/cleanup` with an invalid bearer token returns `401`; the authorised cron creates an audit event. [3] |
| 5 | GitHub | Protect `main`, require the **Quality Gate**, require resolved conversations, enable Dependabot alerts/security updates, secret scanning/push protection, CodeQL, and automatic deletion of merged branches. [6] [7] | The Quality Gate blocks an intentionally failing test on a test pull request. |
| 6 | Hosting provider | Only now set `UPLOADS_ENABLED=true` in production. | The test matrix below has passed in staging. |

## Staff administration endpoints

These server APIs are intentionally headless. Use a staff-only tool, a controlled API client, or an authenticated internal interface; do not place `ADMIN_UPLOADS_SECRET` in browser code.

| Endpoint | Method | Authentication | Purpose |
|---|---|---|---|
| `/api/admin/uploads?limit=50` | `GET` | `x-admin-upload-secret` | Lists pending upload metadata only. |
| `/api/admin/uploads` | `DELETE` | `x-admin-upload-secret` | Deletes a pending `publicId` and `resourceType` (`image` or `raw`). |
| `/api/admin/upload-audit?limit=50` | `GET` | `x-admin-upload-secret` | Reads the bounded Redis deletion audit trail. |
| `/api/admin/cleanup` | `GET` | `Authorization: Bearer <CRON_SECRET>` | Deletes pending documents older than the configured retention period. |

> The cleanup route handles up to 1,000 matching documents per invocation across ten cursor-based Cloudinary search pages and returns `remainingCandidates: true` when another scheduled run is needed. If the pending queue ever exceeds this batch size, run the authorised cleanup repeatedly or raise the schedule frequency after confirming the provider’s execution limits.

## Pre-launch test matrix

| Test | Expected result |
|---|---|
| Upload with unset `UPLOADS_ENABLED` | `503`; no object is sent to Cloudinary. |
| Upload with valid file but no Redis configuration | `503`; no object is sent to Cloudinary. |
| Upload with valid file but no/invalid/expired Turnstile token | `403` or `503`; no object is sent to Cloudinary. |
| Six upload attempts from one trusted client within ten minutes | The sixth request returns `429` with `Retry-After`. |
| Upload with a renamed executable or mismatched file signature | `400`; no object is sent to Cloudinary. |
| Valid staged upload | `201` with an internal `upload_id`; no public URL is returned. |
| Authorised staff deletion | The document is removed from Cloudinary and an audit event is present. |
| Authorised scheduled cleanup | Expired pending objects are deleted; recent pending objects remain. |

## Local validation performed

| Check | Result |
|---|---|
| Frozen-lockfile install with lifecycle scripts disabled | Passed |
| TypeScript check | Passed |
| ESLint | Passed with **0 errors** and 171 inherited migration warnings |
| Vitest | Passed: **11/11 tests** |
| Next.js production build | Passed |
| Lockfile-only dependency audit | Passed: **0 known advisories by severity**; raw JSON evidence is included outside this archive in `raw-evidence/`. |

## References

[1]: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview "Upstash Rate Limit overview"
[2]: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ "Cloudflare Turnstile server-side validation"
[3]: https://vercel.com/docs/cron-jobs/quickstart "Vercel Cron Jobs quickstart"
[4]: https://pnpm.io/cli/audit "pnpm audit documentation"
[5]: https://cloudinary.com/documentation/control_access_to_media "Cloudinary media access methods"
[6]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches "GitHub protected branches"
[7]: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions "GitHub Actions security hardening"
