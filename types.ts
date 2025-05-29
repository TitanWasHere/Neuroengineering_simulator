
export enum QuestionType {
  TRUE_FALSE = 'TRUE_FALSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface Question {
  id: string;
  part: 'A' | 'B';
  text: string;
  maxScore: number;
  type: QuestionType;
  options: string[];
  answer: string[]; // Correct answers. For T/F, will be like ["Vero"] or ["Falso"]
  explanation: string;
}

// Represents the user's selections for a single question
export type UserSelection = string[]; // Array of selected option strings, e.g., ["Vero"] or ["Option A", "Option C"]

// Maps question ID to the user's selected options for that question
export type UserAnswers = Record<string, UserSelection>;

export enum ExamPhase {
  SETUP,
  IN_PROGRESS,
  REVIEW,
}

export interface ExamConfig {
  numQuestionsA: number;
  numQuestionsB: number;
  timeLimitMinutes: number;
}
