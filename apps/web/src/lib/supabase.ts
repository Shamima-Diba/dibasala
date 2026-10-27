import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://ruamhcchaeogodsltskw.supabase.co'
// Publishable/anon keys are intended for browser use; row-level security remains the security boundary.
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_zQpK1tTzUXCYe17R6e6j9g_Bc4IqZCG'

if (!url || !key) {
  console.warn('Supabase environment variables are absent; using the configured public DIBASALA Supabase project.')
}

// Do not create a fake client with placeholder credentials. A null client makes
// missing configuration explicit and prevents accidental requests to a bogus URL.
export const supabase = url && key ? createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) : null
