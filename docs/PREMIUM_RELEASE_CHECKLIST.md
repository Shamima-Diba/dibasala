# DIBASALA Premium / SSLCOMMERZ release checklist

## Current implementation

- Plan catalog: Premium monthly BDT 299 and annual BDT 2,990.
- Supabase stores subscriptions and payment orders. Client roles can read only their own subscription/order records; writes happen in the server-side billing function.
- The billing Edge Function initiates a hosted SSLCOMMERZ v4 session, accepts IPN/callbacks, validates each transaction against the gateway validation API, and activates access only for matching amount, currency, transaction ID, validation ID and low-risk successful transactions.
- This is fixed-term billing. It does **not** implement automatic recurring charges or automatic renewal. Users need a separate renewal flow after expiry.
- Sandbox is the default. Do not switch to live mode until all sandbox tests pass and merchant production credentials are issued.

## Configure Edge Function secrets (never commit these)

In Supabase Dashboard → Edge Functions → Secrets, configure:

- `SSL_COMMERZ_STORE_ID`: merchant store ID
- `SSL_COMMERZ_STORE_PASSWORD`: merchant store password
- `SSL_COMMERZ_SANDBOX=true` for sandbox; use `false` only after live approval
- `SITE_URL=https://dibasala-pw1vnac27-shamima-diba.vercel.app`
- `ALLOWED_ORIGINS`: comma-separated exact allowed app origins
- Confirm the platform-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are available to the function runtime. Never expose the service role key to Vite/client code.

Configure the SSLCOMMERZ merchant IPN URL to:
`https://ruamhcchaeogodsltskw.supabase.co/functions/v1/billing/ipn`

The checkout handler also uses these callback paths: `/success`, `/fail`, and `/cancel`.

## Smoke checks

Run from the repository root:

```sh
SUPABASE_URL=https://ruamhcchaeogodsltskw.supabase.co \
SITE_URL=https://dibasala-pw1vnac27-shamima-diba.vercel.app \
node scripts/production-smoke.mjs
```

This checks CORS preflight for AI Tutor and billing, plus that anonymous checkout is rejected. It does not make a real payment.

## Required sandbox release tests

1. Signed-out user cannot start checkout; API returns 401.
2. Signed-in user can create a monthly sandbox session; browser redirects only to the returned SSLCOMMERZ `GatewayPageURL`.
3. Repeat with annual plan; verify the amount matches the server-side plan catalog.
4. Successful sandbox payment triggers IPN and callback; subscription becomes active only after validation API reports VALID/VALIDATED and the order amount/currency/tran_id match.
5. Send duplicate IPN/callback; entitlement is not duplicated.
6. Failed/cancelled/pending/high-risk/mismatched amount/mismatched currency/unknown transaction do not activate Premium.
7. Verify one learner cannot read another learner's orders or subscriptions, and cannot insert/update these tables from the browser.
8. Expired subscriptions cannot access paid-only resources; test the renewal flow after implementing it.
9. Verify secrets are absent from git history, Vite bundles, browser network responses and logs.
10. Confirm Vercel deployment succeeds and test on a real mobile browser.

## Known launch blockers

- Add/configure SSLCOMMERZ merchant secrets; this tool connection cannot set those secrets.
- Run the smoke script after the current function versions are live.
- Complete authenticated sandbox checkout/IPN validation with merchant test credentials.
- Premium pricing UI exists, but each premium-only course/lesson/API must still enforce `has_active_premium()` server-side before commercial launch.
- Enable Supabase leaked-password protection.
- Implement renewal, cancellation/refund support and support/contact workflow before advertising recurring subscriptions.
