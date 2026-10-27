import { createClient } from 'npm:@supabase/supabase-js@2';

const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([
  'https://dibasala-pw1vnac27-shamima-diba.vercel.app',
  ...configuredOrigins,
])];

// Vercel creates a unique hostname for each deployment. Restrict previews to
// this project's deployment naming pattern, while keeping custom origins exact.
function isAllowedOrigin(origin: string): boolean {
  return allowedOrigins.includes(origin)
    || /^https:\/\/dibasala-[a-z0-9-]+-shamima-diba\.vercel\.app$/.test(origin);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  if (origin && isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  if (request.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin(origin)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, cors);
  if (origin && !isAllowedOrigin(origin)) return jsonResponse({ error: 'Origin not allowed' }, 403, cors);

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return jsonResponse({ error: 'Sign in required' }, 401, cors);

  const maxRequestBytes = 16 * 1024;
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null && Number(contentLength) > maxRequestBytes) {
    return jsonResponse({ error: 'Request body is too large' }, 413, cors);
  }

  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxRequestBytes) {
        await reader.cancel();
        return jsonResponse({ error: 'Request body is too large' }, 413, cors);
      }
      chunks.push(value);
    }
    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    payload = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
  }
  const question = typeof payload === 'object' && payload !== null && 'question' in payload
    ? (payload as { question?: unknown }).question
    : undefined;
  if (typeof question !== 'string' || question.trim().length < 1 || question.length > 2000) {
    return jsonResponse({ error: 'Question must contain 1–2000 characters' }, 400, cors);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const keySet = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS');
  let publishableKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  if (!publishableKey && keySet) {
    try { publishableKey = JSON.parse(keySet).default ?? ''; } catch { /* configuration check below */ }
  }
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const model = Deno.env.get('GEMINI_MODEL');
  if (!supabaseUrl || !publishableKey || !geminiApiKey || !model) {
    return jsonResponse({ error: 'AI service is not configured' }, 503, cors);
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return jsonResponse({ error: 'Invalid session' }, 401, cors);

  const { data: quotaAllowed, error: quotaError } = await supabase.rpc('consume_ai_quota');
  if (quotaError) return jsonResponse({ error: 'Unable to verify AI usage limit' }, 503, cors);
  if (quotaAllowed !== true) return jsonResponse({ error: 'Daily AI limit reached (10 questions/day)' }, 429, cors);

  try {
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiApiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `তুমি বাংলাদেশের শিক্ষার্থীদের জন্য একজন সহায়ক শিক্ষক। প্রশ্নের উত্তর সহজ, নিরাপদ ও ধাপে ধাপে বাংলায় দাও; প্রয়োজন হলে ছোট উদাহরণ দাও। প্রশ্ন: ${question.trim()}` }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 700 },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!aiResponse.ok) {
      return jsonResponse({ error: aiResponse.status === 429 ? 'AI service is busy; try again later' : 'AI provider request failed' }, aiResponse.status === 429 ? 429 : 502, cors);
    }
    const result = await aiResponse.json();
    const answer = result?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('\n')
      .trim();
    if (!answer) return jsonResponse({ error: 'No answer was returned' }, 502, cors);
    return jsonResponse({ answer }, 200, cors);
  } catch {
    return jsonResponse({ error: 'AI service temporarily unavailable' }, 502, cors);
  }
});
