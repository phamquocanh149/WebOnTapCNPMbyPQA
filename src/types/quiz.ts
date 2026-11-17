export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false';

export type Option = {
  id: string;
  label?: string;
  text?: string;
  image?: string;
};

export type Question = {
  id: string;
  quizId: string;
  questionNumber: number;
  type: QuestionType;
  prompt: string;
  promptImages?: string[];
  options: Option[];
  correctOptionIds: string[];
  verificationStatus: 'verified_text' | 'verified_visual' | 'needs_review';
  verificationNote?: string;
  source: {
    file: string;
    pages: number[];
    quizTitle: string;
  };
};

export type Quiz = {
  id: string;
  title: string;
  chapterId?: string;
  chapterTitle?: string;
  questionIds: string[];
  sourcePages: number[];
};

export type QuizDataset = {
  metadata: {
    pdfPath: string;
    sha256: string;
    totalPages: number;
    totalQuizzes: number;
    totalQuestions: number;
    verifiedText: number;
    verifiedVisual: number;
    needsReview: number;
    gradableQuestions: number;
    extractedAt: string;
  };
  quizzes: Quiz[];
  questions: Question[];
};

export type UserQuizAnswers = {
  [questionId: string]: string[]; // array of option IDs selected
};
