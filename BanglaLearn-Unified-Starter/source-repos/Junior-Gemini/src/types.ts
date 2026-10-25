export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // base64
  modelUsed?: string;
  audioBase64?: string;
}

export type AssistantMode = 'tutor' | 'code-tutor' | 'quiz-master' | 'math-solver' | 'legal-advisor';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: 'learning' | 'coding' | 'math' | 'practical' | 'english' | 'legal';
  prompt: string;
  promptBn: string;
  iconName: string;
}

export interface DeploymentStep {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  command: string;
}

export interface LegalRule {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  summaryBn: string;
  summaryEn: string;
  detailsBn: string[];
  detailsEn: string[];
  actionItemBn: string;
  actionItemEn: string;
  iconName: string;
}

