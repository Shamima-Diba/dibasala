import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** Lazy initialization keeps the demo UI buildable without configured backend values. */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !publishableKey) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  client = createClient(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
