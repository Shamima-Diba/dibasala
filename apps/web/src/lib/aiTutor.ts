import { getSupabaseClient } from './supabase';

export async function askAiTutor(question: string): Promise<string> {
  const cleaned = question.trim();
  if (!cleaned || cleaned.length > 2000) throw new Error('প্রশ্ন ১–২০০০ অক্ষরের মধ্যে লিখুন।');
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('AI শিক্ষক ব্যবহার করতে আগে সাইন ইন করুন।');

  const { data, error } = await supabase.functions.invoke('ai-tutor', { body: { question: cleaned } });
  if (error) throw new Error('AI সেবা এখন পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।');
  if (!data || typeof data.answer !== 'string') throw new Error('AI সেবা থেকে বৈধ উত্তর পাওয়া যায়নি।');
  return data.answer;
}
