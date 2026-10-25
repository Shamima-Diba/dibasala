import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// The Vercel Supabase integration injects SUPABASE_* / NEXT_PUBLIC_SUPABASE_* rather than VITE_*.
// Map only browser-safe values (URL + publishable/anon key); never expose secret or service-role keys.
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const pick = (...keys: string[]) => keys.map((key) => env[key]).find((value) => value && value.trim()) ?? '';

  const supabaseUrl = pick('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
  const supabasePublishableKey = pick(
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_ANON_KEY',
  );

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabasePublishableKey),
    },
  };
});
