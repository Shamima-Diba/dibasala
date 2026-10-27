const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const siteUrl = process.env.SITE_URL || 'https://dibasala-pw1vnac27-shamima-diba.vercel.app';

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL. Set it to the project API URL before running this smoke test.');
  process.exit(2);
}

let failed = 0;
async function check(name, fn) {
  try {
    const result = await fn();
    console.log(`${result.ok ? 'PASS' : 'FAIL'} ${name}: ${result.detail}`);
    if (!result.ok) failed += 1;
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const functionName of ['ai-tutor', 'billing']) {
  await check(`${functionName} CORS preflight`, async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'OPTIONS',
      headers: {
        Origin: siteUrl,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization, apikey, content-type',
      },
    });
    const allowOrigin = response.headers.get('access-control-allow-origin');
    return {
      ok: response.status >= 200 && response.status < 300 && allowOrigin === siteUrl,
      detail: `HTTP ${response.status}; allow-origin=${allowOrigin || '(missing)'}`,
    };
  });
}

await check('billing rejects unauthenticated checkout', async () => {
  const response = await fetch(`${supabaseUrl}/functions/v1/billing`, {
    method: 'POST',
    headers: { Origin: siteUrl, 'Content-Type': 'application/json' },
    body: JSON.stringify({ planSlug: 'premium_monthly' }),
  });
  const body = await response.json().catch(() => ({}));
  return {
    ok: response.status === 401,
    detail: `HTTP ${response.status}; ${body.error || 'no error detail'}`,
  };
});

if (failed) {
  console.error(`Smoke test failed: ${failed} check(s).`);
  process.exit(1);
}
console.log('All production smoke checks passed. This does not replace authenticated sandbox-payment testing.');
