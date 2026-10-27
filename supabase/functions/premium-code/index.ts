import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const siteUrl = (Deno.env.get('SITE_URL') ?? 'https://dibasala-pw1vnac27-shamima-diba.vercel.app').replace(/\/$/, '');
const allowedOrigins = new Set([siteUrl, 'https://dibasala-pw1vnac27-shamima-diba.vercel.app', ...(Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map(v => v.trim()).filter(Boolean)]);
const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : siteUrl,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
});
const reply = (body: unknown, status = 200, origin: string | null = null) => new Response(JSON.stringify(body), {
  status, headers: { ...cors(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

Deno.serve(async request => {
  const origin = request.headers.get('origin');
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
  if (request.method !== 'POST') return reply({ error: 'Method not allowed' }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return reply({ error: 'Origin not allowed' }, 403, origin);
  if (!supabaseUrl || !anonKey || !serviceKey) return reply({ error: 'Premium access service is not configured' }, 503, origin);
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return reply({ error: 'Sign in required' }, 401, origin);
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return reply({ error: 'Invalid session' }, 401, origin);
  let body: { code?: unknown };
  try { body = await request.json(); } catch { return reply({ error: 'Invalid request' }, 400, origin); }
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (code.length < 4 || code.length > 100 || !/^[A-Z0-9_-]+$/.test(code)) return reply({ error: 'Enter a valid access code' }, 400, origin);
  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.rpc('redeem_premium_access_code', { p_code: code, p_user_id: user.id });
  if (error) {
    const safeMessages = [
      'Enter a valid access code', 'Access code is invalid or inactive', 'Access code has expired',
      'Access code redemption limit reached', 'This account has already used this code',
      'Premium is already active for this account', 'Premium plan is not configured',
    ];
    const message = safeMessages.find(value => error.message.includes(value)) ?? 'Could not activate Premium with this code';
    return reply({ error: message }, 400, origin);
  }
  return reply(data, 200, origin);
});
