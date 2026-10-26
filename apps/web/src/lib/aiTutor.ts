import { supabase } from './supabase'

export async function askAiTutor(question: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  const token = session?.access_token
  if (!token) throw new Error('Sign in before using AI Tutor.')

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Supabase browser configuration is incomplete.')

  const res = await fetch(`${url}/functions/v1/ai-tutor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: key,
    },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) {
    let message = `AI Tutor request failed (${res.status})`
    try {
      const payload = await res.json()
      if (typeof payload.error === 'string') message = payload.error
    } catch { /* retain generic status */ }
    throw new Error(message)
  }
  return res.json()
}
