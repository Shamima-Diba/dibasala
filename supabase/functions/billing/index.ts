import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const siteUrl = (Deno.env.get('SITE_URL') ?? 'https://dibasala-pw1vnac27-shamima-diba.vercel.app').replace(/\/$/, '');
const sandbox = (Deno.env.get('SSL_COMMERZ_SANDBOX') ?? 'true').toLowerCase() !== 'false';
const storeId = Deno.env.get('SSL_COMMERZ_STORE_ID') ?? '';
const storePassword = Deno.env.get('SSL_COMMERZ_STORE_PASSWORD') ?? '';
const gatewayBase = sandbox ? 'https://sandbox.sslcommerz.com' : 'https://securepay.sslcommerz.com';
const allowedOrigins = new Set([siteUrl, 'https://dibasala-pw1vnac27-shamima-diba.vercel.app', ...(Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map(v => v.trim()).filter(Boolean)]);
const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : siteUrl,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
});
const json = (body: unknown, status = 200, origin: string | null = null) => new Response(JSON.stringify(body), { status, headers: { ...cors(origin), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const admin = () => createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function validateAndApply(form: Record<string, string>) {
  if (!storeId || !storePassword || !serviceKey) throw new Error('Payment gateway is not configured');
  const valId = form.val_id;
  const tranId = form.tran_id;
  if (!valId || !tranId) throw new Error('Missing gateway transaction identifiers');
  const validateUrl = new URL(`${gatewayBase}/validator/api/validationserverAPI.php`);
  validateUrl.searchParams.set('val_id', valId);
  validateUrl.searchParams.set('store_id', storeId);
  validateUrl.searchParams.set('store_passwd', storePassword);
  validateUrl.searchParams.set('format', 'json');
  const validationResponse = await fetch(validateUrl, { signal: AbortSignal.timeout(15000) });
  if (!validationResponse.ok) throw new Error('Could not validate gateway transaction');
  const verified = await validationResponse.json();
  const db = admin();
  const { data: order, error } = await db.from('payment_orders').select('id,user_id,plan_id,subscription_id,tran_id,amount_bdt,currency,status').eq('tran_id', tranId).maybeSingle();
  if (error || !order) throw new Error('Payment order not found');
  if (order.status === 'paid') return { ok: true, duplicate: true };
  const valid = ['VALID', 'VALIDATED'].includes(String(verified.status))
    && verified.tran_id === order.tran_id
    && Number(verified.amount).toFixed(2) === Number(order.amount_bdt).toFixed(2)
    && String(verified.currency) === order.currency
    && String(verified.risk_level ?? '0') === '0'
    && verified.val_id === valId;
  if (!valid) {
    await db.from('payment_orders').update({ status: 'review', gateway_status: String(verified.status ?? 'INVALID') }).eq('id', order.id);
    throw new Error('Payment validation failed; subscription not activated');
  }
  const { data: plan, error: planError } = await db.from('subscription_plans').select('billing_interval').eq('id', order.plan_id).single();
  if (planError || !plan) throw new Error('Subscription plan not found');
  const start = new Date();
  const end = new Date(start);
  if (plan.billing_interval === 'year') end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  let subscriptionId = order.subscription_id;
  if (subscriptionId) {
    const { error: subError } = await db.from('subscriptions').update({
      status: 'active', current_period_start: start.toISOString(), current_period_end: end.toISOString(),
    }).eq('id', subscriptionId).eq('user_id', order.user_id);
    if (subError) throw new Error('Payment validated but subscription activation failed');
  } else {
    const { data: sub, error: subError } = await db.from('subscriptions').insert({
      user_id: order.user_id, plan_id: order.plan_id, status: 'active',
      current_period_start: start.toISOString(), current_period_end: end.toISOString(), gateway: 'sslcommerz',
    }).select('id').single();
    if (subError || !sub) throw new Error('Payment validated but subscription activation failed');
    subscriptionId = sub.id;
  }
  const { error: updateError } = await db.from('payment_orders').update({
    status: 'paid', gateway_status: String(verified.status), validation_id: valId,
    bank_tran_id: verified.bank_tran_id ?? null, paid_at: start.toISOString(), subscription_id: subscriptionId,
  }).eq('id', order.id).neq('status', 'paid');
  if (updateError) throw new Error('Payment validated but order update failed');
  return { ok: true, duplicate: false };
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  const path = new URL(request.url).pathname;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

  // IPN and hosted-gateway callbacks are server-to-server/browser form posts.
  if (path.endsWith('/ipn') || path.endsWith('/success') || path.endsWith('/fail') || path.endsWith('/cancel')) {
    if (request.method !== 'POST' && request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, origin);
    const formData = request.method === 'POST'
      ? await request.formData().catch(() => null)
      : null;
    const form: Record<string, string> = {};
    if (formData) formData.forEach((v, k) => { if (typeof v === 'string') form[k] = v; });
    else new URL(request.url).searchParams.forEach((v, k) => { form[k] = v; });
    const isIpn = path.endsWith('/ipn');
    if (!isIpn && !path.endsWith('/success')) {
      if (form.tran_id && serviceKey) {
        await admin().from('payment_orders').update({ status: path.endsWith('/cancel') ? 'cancelled' : 'failed', gateway_status: form.status ?? path.slice(path.lastIndexOf('/') + 1) }).eq('tran_id', form.tran_id).eq('status', 'pending');
      }
      return Response.redirect(`${siteUrl}/?billing=${path.endsWith('/cancel') ? 'cancelled' : 'failed'}`, 303);
    }
    try {
      const result = await validateAndApply(form);
      if (isIpn) return new Response(result.ok ? 'OK' : 'INVALID', { status: result.ok ? 200 : 400, headers: { 'Content-Type': 'text/plain' } });
      return Response.redirect(`${siteUrl}/?billing=success`, 303);
    } catch {
      if (isIpn) return new Response('Payment validation failed', { status: 400 });
      return Response.redirect(`${siteUrl}/?billing=verification_pending`, 303);
    }
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
  if (!serviceKey || !anonKey || !storeId || !storePassword) return json({ error: 'Billing is not configured. Contact support.' }, 503, origin);
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Sign in required' }, 401, origin);
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return json({ error: 'Invalid session' }, 401, origin);
  let body: { planSlug?: string };
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400, origin); }
  const planSlug = body.planSlug;
  if (planSlug !== 'premium_monthly' && planSlug !== 'premium_annual') return json({ error: 'Select a valid plan' }, 400, origin);
  const db = admin();
  const { data: plan, error: planError } = await db.from('subscription_plans').select('id,slug,name,billing_interval,amount_bdt,currency').eq('slug', planSlug).eq('active', true).single();
  if (planError || !plan) return json({ error: 'Plan unavailable' }, 404, origin);
  await db.from('subscriptions').update({ status: 'expired' }).eq('user_id', user.id).eq('status', 'active').lte('current_period_end', new Date().toISOString());
  await db.from('subscriptions').update({ status: 'expired' }).eq('user_id', user.id).eq('status', 'pending').lt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString());
  const { data: active } = await db.from('subscriptions').select('id,status').eq('user_id', user.id).in('status', ['active','past_due']).maybeSingle();
  if (active) return json({ error: 'An active subscription already exists. Renewal is not yet enabled; contact support before purchasing again.' }, 409, origin);
  await db.from('subscriptions').update({ status: 'expired' }).eq('user_id', user.id).eq('status', 'pending');
  const tranId = `DBS${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`.slice(0, 30);
  const { data: subscription, error: subError } = await db.from('subscriptions').insert({ user_id: user.id, plan_id: plan.id, status: 'pending', gateway: 'sslcommerz' }).select('id').single();
  if (subError || !subscription) return json({ error: 'Could not create subscription' }, 500, origin);
  const { data: order, error: orderError } = await db.from('payment_orders').insert({
    user_id: user.id, plan_id: plan.id, subscription_id: subscription.id,
    tran_id: tranId, amount_bdt: plan.amount_bdt, currency: plan.currency,
  }).select('id').single();
  if (orderError || !order) {
    await db.from('subscriptions').delete().eq('id', subscription.id);
    return json({ error: 'Could not create payment order' }, 500, origin);
  }
  const params = new URLSearchParams({
    store_id: storeId, store_passwd: storePassword, total_amount: Number(plan.amount_bdt).toFixed(2), currency: 'BDT',
    tran_id: tranId, product_category: 'education', product_name: plan.name, product_profile: 'non-physical-goods',
    success_url: `${supabaseUrl}/functions/v1/billing/success`,
    fail_url: `${supabaseUrl}/functions/v1/billing/fail`,
    cancel_url: `${supabaseUrl}/functions/v1/billing/cancel`,
    ipn_url: `${supabaseUrl}/functions/v1/billing/ipn`,
    cus_name: user.user_metadata?.full_name ?? user.email ?? 'DIBASALA Learner',
    cus_email: user.email ?? 'support@dibasala.com',
    cus_add1: 'Bangladesh', cus_city: 'Dhaka', cus_postcode: '1000', cus_country: 'Bangladesh',
    cus_phone: user.user_metadata?.phone ?? '01700000000',
    shipping_method: 'NO', num_of_item: '1', product_amount: Number(plan.amount_bdt).toFixed(2),
    vat: '0', discount_amount: '0', convenience_fee: '0',
  });
  try {
    const gatewayResponse = await fetch(`${gatewayBase}/gwprocess/v4/api.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(), signal: AbortSignal.timeout(15000),
    });
    const gateway = await gatewayResponse.json();
    if (!gatewayResponse.ok || gateway.status !== 'SUCCESS' || !gateway.GatewayPageURL) {
      await db.from('payment_orders').update({ status: 'failed', gateway_status: 'SESSION_CREATE_FAILED' }).eq('id', order.id);
      await db.from('subscriptions').update({ status: 'expired' }).eq('id', subscription.id);
      return json({ error: 'Could not start SSLCOMMERZ checkout. Check merchant sandbox/live credentials.' }, 502, origin);
    }
    await db.from('payment_orders').update({ sessionkey: gateway.sessionkey ?? null }).eq('id', order.id);
    return json({ checkoutUrl: gateway.GatewayPageURL }, 200, origin);
  } catch {
    await db.from('payment_orders').update({ status: 'failed', gateway_status: 'GATEWAY_UNREACHABLE' }).eq('id', order.id);
    await db.from('subscriptions').update({ status: 'expired' }).eq('id', subscription.id);
    return json({ error: 'SSLCOMMERZ is temporarily unreachable. Please try again.' }, 502, origin);
  }
});
