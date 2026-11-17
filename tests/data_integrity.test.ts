import { describe, it, expect } from 'vitest';
import rawData from '../src/data/quiz_data.json';
import { QuizDataset } from '../src/types/quiz';
import { gradeQuiz, getQuizById, getQuestionsForQuiz, getChapters, getMetadata } from '../src/services/quizService';

const dataset = rawData as QuizDataset;

describe('Data Integrity and Schema Verification', () => {
  it('should have accurate metadata matching original PDF', () => {
    expect(dataset.metadata).toBeDefined();
    expect(dataset.metadata.totalPages).toBe(275);
    expect(dataset.metadata.totalQuizzes).toBe(69);
    expect(dataset.metadata.totalQuestions).toBe(485);
    expect(dataset.metadata.verifiedText).toBe(446);
    expect(dataset.metadata.verifiedVisual).toBe(37);
    expect(dataset.metadata.needsReview).toBe(2);
    expect(dataset.metadata.gradableQuestions).toBe(483);
    expect(dataset.metadata.sha256).toBe('61b8410e69e2fe12ab6047c6630829385b5eb33c43a95b9ea56e53e5027b6c48');
  });

  it('should have exactly 69 unique quiz IDs and valid quizzes', () => {
    expect(dataset.quizzes.length).toBe(69);
    const quizIds = new Set(dataset.quizzes.map(q => q.id));
    expect(quizIds.size).toBe(69);

    for (const q of dataset.quizzes) {
      expect(q.id).toBeTruthy();
      expect(q.title).toBeTruthy();
      expect(q.questionIds.length).toBeGreaterThan(0);
      expect(q.sourcePages.length).toBeGreaterThan(0);
    }
  });

  it('should have exactly 485 unique question IDs', () => {
    expect(dataset.questions.length).toBe(485);
    const qIds = new Set(dataset.questions.map(q => q.id));
    expect(qIds.size).toBe(485);
  });

  it('every question must have valid quizId and provenance', () => {
    const quizIdSet = new Set(dataset.quizzes.map(q => q.id));

    for (const q of dataset.questions) {
      expect(quizIdSet.has(q.quizId)).toBe(true);
      expect(q.source).toBeDefined();
      expect(q.source.file).toBe('Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf');
      expect(q.source.pages.length).toBeGreaterThan(0);
      expect(q.prompt).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every verified question must have non-empty correctOptionIds matching options', () => {
    const verifiedQuestions = dataset.questions.filter(
      q => q.verificationStatus === 'verified_text' || q.verificationStatus === 'verified_visual'
    );
    expect(verifiedQuestions.length).toBe(483);

    for (const q of verifiedQuestions) {
      expect(q.correctOptionIds.length).toBeGreaterThan(0);
      const optionIdSet = new Set(q.options.map(o => o.id));
      for (const cId of q.correctOptionIds) {
        expect(optionIdSet.has(cId)).toBe(true);
      }
    }
  });

  it('needs_review questions must have empty correctOptionIds and valid reason', () => {
    const reviewQuestions = dataset.questions.filter(q => q.verificationStatus === 'needs_review');
    expect(reviewQuestions.length).toBe(2);

    for (const q of reviewQuestions) {
      expect(q.correctOptionIds.length).toBe(0);
      expect(q.verificationNote).toBeDefined();
      expect(q.verificationNote!.length).toBeGreaterThan(0);
    }

    const reviewIds = reviewQuestions.map(q => q.id);
    expect(reviewIds).toContain('quiz_0803_q4');
    expect(reviewIds).toContain('quiz_ket_thuc_chuong_8_q8');
  });

  it('should support all question types: single_choice, multiple_choice, true_false', () => {
    const single = dataset.questions.filter(q => q.type === 'single_choice');
    const multiple = dataset.questions.filter(q => q.type === 'multiple_choice');
    const tf = dataset.questions.filter(q => q.type === 'true_false');

    expect(single.length).toBeGreaterThan(300);
    expect(multiple.length).toBeGreaterThan(20);
    expect(tf.length).toBeGreaterThan(10);
  });

  it('getChapters correctly organizes all 69 quizzes into 10 academic units', () => {
    const chapters = getChapters();
    expect(chapters.length).toBe(10);

    const totalQuizzesInChapters = chapters.reduce((sum, c) => sum + c.quizzes.length, 0);
    expect(totalQuizzesInChapters).toBe(69);

    const totalQuestionsInChapters = chapters.reduce((sum, c) => sum + c.totalQuestions, 0);
    expect(totalQuestionsInChapters).toBe(485);

    const totalReadyInChapters = chapters.reduce((sum, c) => sum + c.readyQuestions, 0);
    expect(totalReadyInChapters).toBe(483);

    const totalReviewInChapters = chapters.reduce((sum, c) => sum + c.reviewQuestions, 0);
    expect(totalReviewInChapters).toBe(2);
  });
});

describe('Grading Engine Tests', () => {
  it('correctly grades single choice questions', () => {
    const report = gradeQuiz('quiz_0102', {
      'quiz_0102_q1': ['opt_d'],
      'quiz_0102_q2': ['opt_a'],
      'quiz_0102_q3': ['opt_a'],
      'quiz_0102_q4': ['opt_b'],
      'quiz_0102_q5': ['opt_c']
    });

    expect(report.totalQuestions).toBe(5);
    expect(report.gradableQuestions).toBe(5);
    expect(report.correctCount).toBe(5);
    expect(report.score).toBe(10);
    expect(report.percentage).toBe(100);
  });

  it('excludes needs_review questions from score', () => {
    const report = gradeQuiz('quiz_0803', {
      'quiz_0803_q1': ['opt_a'],
      'quiz_0803_q2': ['opt_b'],
      'quiz_0803_q3': ['opt_a'],
      'quiz_0803_q4': ['opt_d'], // unverified question
      'quiz_0803_q5': ['opt_d']
    });

    expect(report.totalQuestions).toBe(5);
    expect(report.gradableQuestions).toBe(4);
    expect(report.unverifiedQuestions).toBe(1);

    const q4Result = report.results.find(r => r.questionId === 'quiz_0803_q4');
    expect(q4Result).toBeDefined();
    expect(q4Result?.isGradable).toBe(false);
  });

  it('correctly grades true/false questions', () => {
    // quiz_0103_q1 correct answer is opt_a ('Sai')
    const reportWrong = gradeQuiz('quiz_0103', {
      'quiz_0103_q1': ['opt_b'] // 'Đúng' -> wrong
    });
    const q1Wrong = reportWrong.results.find(r => r.questionId === 'quiz_0103_q1');
    expect(q1Wrong?.isCorrect).toBe(false);

    const reportRight = gradeQuiz('quiz_0103', {
      'quiz_0103_q1': ['opt_a'] // 'Sai' -> correct
    });
    const q1Right = reportRight.results.find(r => r.questionId === 'quiz_0103_q1');
    expect(q1Right?.isCorrect).toBe(true);
  });

  it('strictly requires all options for multiple choice questions', () => {
    // quiz_0904_q1 correct answers are opt_a and opt_d
    const reportPartial = gradeQuiz('quiz_0904', {
      'quiz_0904_q1': ['opt_a'] // only partial
    });
    const q1Partial = reportPartial.results.find(r => r.questionId === 'quiz_0904_q1');
    expect(q1Partial?.isCorrect).toBe(false);

    const reportFull = gradeQuiz('quiz_0904', {
      'quiz_0904_q1': ['opt_a', 'opt_d'] // full correct set
    });
    const q1Full = reportFull.results.find(r => r.questionId === 'quiz_0904_q1');
    expect(q1Full?.isCorrect).toBe(true);
  });
});
