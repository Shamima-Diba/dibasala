# DIBASALA access-code administration

## Current access model

- Standard learning features remain available without a payment.
- Premium / Pro is activated by a server-validated code. Online checkout is intentionally not the default path while merchant payment testing is incomplete.
- Codes are never embedded in the web app or returned to a public API.
- Codes are configured by an authorized project administrator through the Supabase SQL editor. Do not give users database access.

## Create a code

Open Supabase Dashboard → SQL Editor for project `ruamhcchaeogodsltskw` and run a statement like this, replacing the sample code with a long, random value that you distribute privately:

```sql
insert into public.premium_access_codes
  (code, plan_slug, access_days, max_redemptions, expires_at, created_by)
values
  ('DIBA-PRO-REPLACE-WITH-RANDOM-CODE', 'premium_monthly', 30, 1, null, 'admin');
```

- `plan_slug`: `premium_monthly` or `premium_annual`
- `access_days`: how long the code grants access (1–3660)
- `max_redemptions`: total accounts allowed to redeem the code
- `expires_at`: optional deadline for redeeming the code; null means no redemption deadline
- `active`: set false to disable a code

To create a 365-day Pro code, use `plan_slug='premium_annual'` and `access_days=365`. A code is case-insensitive, but use uppercase letters/numbers/hyphens/underscores for reliable sharing.

## Audit / disable

```sql
select code, plan_slug, access_days, max_redemptions, redeemed_count, active, expires_at
from public.premium_access_codes order by created_at desc;

update public.premium_access_codes
set active = false
where code = 'DIBA-PRO-REPLACE-WITH-RANDOM-CODE';
```

Do not commit real access codes to GitHub. The tables are not readable by anonymous or authenticated clients. The Edge Function authenticates the user, and a database transaction enforces expiry, redemption limits, and one redemption per code/account.

## Android build

The `.github/workflows/android-build.yml` workflow builds the web app, wraps it in a Capacitor Android debug APK, and uploads both APK and a clean source ZIP with SHA-256 checksums as a GitHub Actions artifact. The APK is a **debug/test build**, not a Play Store signed release. The artifact download link appears on the successful workflow run; it is not available until the workflow passes.
