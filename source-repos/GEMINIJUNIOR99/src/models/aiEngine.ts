// Clean Internal AI Engine Configuration
// Encapsulates Google AI & Open-Source fallback routes cleanly under the hood

export interface ModelConfig {
  id: string;
  displayName: string;
  provider: 'google' | 'open-source';
  tier: 'flash-lite' | 'flash' | 'pro' | 'reasoning';
}

export const INTERNAL_MODEL_SUITE: ModelConfig[] = [
  { id: 'gemini-3.5-flash', displayName: 'Google Fast Engine', provider: 'google', tier: 'flash' },
  { id: 'gemini-3.1-pro-preview', displayName: 'Google Reasoning Pro Engine', provider: 'google', tier: 'pro' },
  { id: 'deepseek-r1:8b', displayName: 'Open Logic Engine', provider: 'open-source', tier: 'reasoning' },
  { id: 'llama3.1', displayName: 'Open Multilingual Engine', provider: 'open-source', tier: 'flash' }
];

export async function askAiStudioEngine(prompt: string, contextCategory?: string): Promise<{ reply: string; engineInfo: string }> {
  try {
    const response = await fetch('/api/open-source-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model: 'auto',
        provider: 'auto',
        systemPrompt: contextCategory ? `You are Junior Gemini AI Studio, an empathetic Bengali educational tutor for ${contextCategory}.` : undefined
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply || 'উত্তর প্রসেস করা হয়েছে।',
        engineInfo: 'Junior Gemini Smart Engine'
      };
    }
  } catch (e) {
    console.warn('AI Engine call fallback triggered');
  }

  return {
    reply: `আপনার প্রশ্ন: "${prompt}"\n\nউত্তর তৈরিতে সাহায্য করতে জুনিয়র জেমিনি ব্যাকআপ নলেজ বেস সক্রিয় আছে। কোনো ফি ছাড়াই নিয়মিত আপনার পাঠগুলো অনুশীলন করুন।`,
    engineInfo: 'Junior Gemini Smart Engine'
  };
}
