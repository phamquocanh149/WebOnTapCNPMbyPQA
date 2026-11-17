import rawData from '../data/quiz_data.json';
import { Quiz, Question, QuizDataset, UserQuizAnswers } from '../types/quiz';

const dataset: QuizDataset = rawData as QuizDataset;

export interface Chapter {
  id: string;
  title: string;
  quizzes: Quiz[];
  totalQuestions: number;
  readyQuestions: number;
  reviewQuestions: number;
}

export function getMetadata() {
  return dataset.metadata;
}

export function getAllQuizzes(): Quiz[] {
  return dataset.quizzes;
}

export function getQuizById(id: string): Quiz | undefined {
  return dataset.quizzes.find(q => q.id === id);
}

export function getQuestionsForQuiz(quizId: string): Question[] {
  return dataset.questions.filter(q => q.quizId === quizId);
}

export function getQuestionById(questionId: string): Question | undefined {
  return dataset.questions.find(q => q.id === questionId);
}

export function getChapters(): Chapter[] {
  const map = new Map<string, Chapter>();

  const chapterOrder = [
    { id: 'chuong_1', title: 'Chương 1. Tổng quan về Công nghệ phần mềm' },
    { id: 'chuong_2', title: 'Chương 2. Vòng đời phần mềm' },
    { id: 'chuong_3', title: 'Chương 3. Phương pháp Agile' },
    { id: 'chuong_4', title: 'Chương 4. Quản lý dự án phần mềm' },
    { id: 'chuong_5', title: 'Chương 5. Quản lý cấu hình phần mềm' },
    { id: 'chuong_6', title: 'Chương 6. Kỹ nghệ yêu cầu phần mềm' },
    { id: 'chuong_7', title: 'Chương 7. Thiết kế phần mềm' },
    { id: 'chuong_8', title: 'Chương 8. Xây dựng phần mềm' },
    { id: 'chuong_9', title: 'Chương 9. Đảm bảo chất lượng phần mềm' },
    { id: 'kiem_tra_btt_lon', title: 'Kiểm tra kết quả bài tập lớn (Pr)' },
  ];

  for (const c of chapterOrder) {
    map.set(c.id, {
      id: c.id,
      title: c.title,
      quizzes: [],
      totalQuestions: 0,
      readyQuestions: 0,
      reviewQuestions: 0
    });
  }

  for (const quiz of dataset.quizzes) {
    const cId = quiz.chapterId || 'khac';
    if (!map.has(cId)) {
      map.set(cId, {
        id: cId,
        title: quiz.chapterTitle || 'Chương khác',
        quizzes: [],
        totalQuestions: 0,
        readyQuestions: 0,
        reviewQuestions: 0
      });
    }

    const chap = map.get(cId)!;
    chap.quizzes.push(quiz);

    const qs = getQuestionsForQuiz(quiz.id);
    chap.totalQuestions += qs.length;
    chap.readyQuestions += qs.filter(q => q.verificationStatus !== 'needs_review').length;
    chap.reviewQuestions += qs.filter(q => q.verificationStatus === 'needs_review').length;
  }

  return Array.from(map.values()).filter(c => c.quizzes.length > 0);
}

export interface QuestionGradingResult {
  questionId: string;
  isCorrect: boolean;
  isGradable: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  verificationStatus: 'verified_text' | 'verified_visual' | 'needs_review';
  verificationNote?: string;
}

export interface QuizGradeReport {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  gradableQuestions: number;
  unverifiedQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number; // out of 10
  percentage: number;
  results: QuestionGradingResult[];
}

export function gradeQuiz(quizId: string, answers: UserQuizAnswers): QuizGradeReport {
  const quiz = getQuizById(quizId);
  const questions = getQuestionsForQuiz(quizId);

  const results: QuestionGradingResult[] = [];
  let correctCount = 0;
  let gradableCount = 0;
  let unverifiedCount = 0;

  for (const q of questions) {
    const userSelected = answers[q.id] || [];
    const isGradable = q.verificationStatus !== 'needs_review' && q.correctOptionIds.length > 0;

    if (!isGradable) {
      unverifiedCount++;
      results.push({
        questionId: q.id,
        isCorrect: false,
        isGradable: false,
        selectedOptionIds: userSelected,
        correctOptionIds: q.correctOptionIds,
        verificationStatus: q.verificationStatus,
        verificationNote: q.verificationNote
      });
      continue;
    }

    gradableCount++;

    // Compare sets
    const userSet = new Set(userSelected);
    const correctSet = new Set(q.correctOptionIds);

    const isCorrect = userSet.size === correctSet.size &&
      Array.from(userSet).every(id => correctSet.has(id));

    if (isCorrect) {
      correctCount++;
    }

    results.push({
      questionId: q.id,
      isCorrect,
      isGradable: true,
      selectedOptionIds: userSelected,
      correctOptionIds: q.correctOptionIds,
      verificationStatus: q.verificationStatus,
      verificationNote: q.verificationNote
    });
  }

  const percentage = gradableCount > 0 ? (correctCount / gradableCount) * 100 : 0;
  const score = gradableCount > 0 ? Math.round((correctCount / gradableCount) * 100) / 10 : 0;

  return {
    quizId,
    quizTitle: quiz ? quiz.title : quizId,
    totalQuestions: questions.length,
    gradableQuestions: gradableCount,
    unverifiedQuestions: unverifiedCount,
    correctCount,
    incorrectCount: gradableCount - correctCount,
    score,
    percentage: Math.round(percentage * 10) / 10,
    results
  };
}
