import { supabase } from './supabase'

export async function askAiTutor(question: string) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ question }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'AI Tutor request failed')
  }
  return res.json()
}
