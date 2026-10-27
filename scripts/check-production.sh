#!/usr/bin/env bash
set -Eeuo pipefail

# Production smoke check for DIBASALA. This script never prints keys or tokens.
# Required: SUPABASE_URL, SITE_ORIGIN
# Optional: SITE_URL (deployed frontend URL)
: "${SUPABASE_URL:?Set SUPABASE_URL to the Supabase project URL}"
: "${SITE_ORIGIN:?Set SITE_ORIGIN to the exact browser origin, e.g. https://your-domain.example}"

SUPABASE_URL="${SUPABASE_URL%/}"
SITE_ORIGIN="${SITE_ORIGIN%/}"
FUNCTION_URL="${SUPABASE_URL}/functions/v1/ai-tutor"
HEADERS_FILE="$(mktemp)"
trap 'rm -f "$HEADERS_FILE"' EXIT

echo "Checking AI Tutor CORS preflight for configured site origin..."
STATUS="$(curl --silent --show-error --output /dev/null --dump-header "$HEADERS_FILE" \
  --write-out '%{http_code}' --request OPTIONS "$FUNCTION_URL" \
  --header "Origin: $SITE_ORIGIN" \
  --header 'Access-Control-Request-Method: POST' \
  --header 'Access-Control-Request-Headers: authorization, apikey, content-type')"

ALLOW_ORIGIN="$(awk 'BEGIN{IGNORECASE=1} /^access-control-allow-origin:/ {sub(/^[^:]*:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit}' "$HEADERS_FILE")"

if [[ "$STATUS" != "204" ]]; then
  echo "FAIL: preflight returned HTTP $STATUS (expected 204)." >&2
  echo "Check the Supabase ai-tutor function deployment and ALLOWED_ORIGINS secret." >&2
  exit 1
fi

if [[ "$ALLOW_ORIGIN" != "$SITE_ORIGIN" ]]; then
  echo "FAIL: Access-Control-Allow-Origin does not exactly match SITE_ORIGIN." >&2
  echo "Check ALLOWED_ORIGINS in Supabase; use the exact scheme + host + optional port." >&2
  exit 1
fi

echo "PASS: AI Tutor preflight returns 204 and allows the configured origin."

if [[ -n "${SITE_URL:-}" ]]; then
  echo "Checking deployed frontend HTTP response..."
  FRONTEND_STATUS="$(curl --silent --show-error --location --output /dev/null --write-out '%{http_code}' "$SITE_URL")"
  if [[ "$FRONTEND_STATUS" != 200 ]]; then
    echo "FAIL: frontend returned HTTP $FRONTEND_STATUS (expected 200)." >&2
    exit 1
  fi
  echo "PASS: deployed frontend returned HTTP 200."
fi

echo "Smoke checks passed. This does not replace sign-up, email-confirmation, sign-in, or authenticated AI request tests."
