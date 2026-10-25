export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // base64
  modelUsed?: string;
  audioBase64?: string;
}

export type AssistantMode = 'tutor' | 'code-tutor' | 'quiz-master' | 'math-solver';

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
  category: 'learning' | 'coding' | 'math' | 'practical' | 'english';
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
