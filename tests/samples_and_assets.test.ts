import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import rawData from '../src/data/quiz_data.json';
import { QuizDataset } from '../src/types/quiz';
import { getQuizById, getQuestionsForQuiz } from '../src/services/quizService';

const dataset = rawData as QuizDataset;

describe('Sample Verification Against Source PDF', () => {
  it('Sample Beginning: Quiz 0102 Q1 (Page 1) - Single choice', () => {
    const q1 = dataset.questions.find(q => q.id === 'quiz_0102_q1');
    expect(q1).toBeDefined();
    expect(q1?.prompt).toContain('Công nghệ phần mềm được hiểu là một lĩnh vực ...... nhằm phát triển phần mềm.');
    expect(q1?.options.length).toBe(4);
    expect(q1?.correctOptionIds).toEqual(['opt_d']);
    const optD = q1?.options.find(o => o.id === 'opt_d');
    expect(optD?.text).toBe('Tất cả các đáp án');
    expect(q1?.source.pages).toEqual([1]);
  });

  it('Sample Beginning: Quiz 0102 Q2 (Page 1) - Single choice', () => {
    const q2 = dataset.questions.find(q => q.id === 'quiz_0102_q2');
    expect(q2).toBeDefined();
    expect(q2?.prompt).toContain('Theo Pressman, công nghệ phần mềm là bộ môn tích hợp … để phát triển phần mềm máy tính.');
    expect(q2?.correctOptionIds).toEqual(['opt_a']);
    const optA = q2?.options.find(o => o.id === 'opt_a');
    expect(optA?.text).toBe('quy trình, các phương pháp, các công cụ');
    expect(q2?.source.pages).toEqual([1]);
  });

  it('Sample Middle: Quiz KT Chương 3 Q15 (Page 56) - Prompt with image', () => {
    const q15 = dataset.questions.find(q => q.id === 'quiz_ket_thuc_chuong_3_q15');
    expect(q15).toBeDefined();
    expect(q15?.prompt).toContain('Hình vẽ sau đây mô tả loại mô hình chế thử nào?');
    expect(q15?.promptImages).toBeDefined();
    expect(q15?.promptImages?.length).toBeGreaterThan(0);
    expect(q15?.correctOptionIds).toEqual(['opt_c']);
    const optC = q15?.options.find(o => o.id === 'opt_c');
    expect(optC?.text).toBe('Evolutionary Prototype');
    expect(q15?.source.pages).toEqual([56]);
  });

  it('Sample Middle: Quiz 0605 Q4 (Page 115) - Image options via UML usecase', () => {
    const q = dataset.questions.find(q => q.id === 'quiz_0605_q4');
    expect(q).toBeDefined();
    expect(q?.verificationStatus).toBe('verified_visual');
    expect(q?.options.length).toBe(4);
    // Every option must have an image
    for (const opt of q!.options) {
      expect(opt.image).toBeDefined();
      expect(opt.image?.startsWith('/images/quiz/')).toBe(true);
    }
    expect(q?.correctOptionIds).toEqual(['opt_a']);
    expect(q?.source.pages).toEqual([115]);
  });

  it('Sample Middle: Quiz 0803 Q4 (Page 189) - Unverified LMS question (needs_review)', () => {
    const q = dataset.questions.find(q => q.id === 'quiz_0803_q4');
    expect(q).toBeDefined();
    expect(q?.verificationStatus).toBe('needs_review');
    expect(q?.correctOptionIds).toEqual([]);
    expect(q?.verificationNote).toContain('không hiển thị dòng');
    expect(q?.source.pages).toEqual([189]);
  });

  it('Sample End: Quiz 0904 Q1 (Page 211) - Multiple choice with flowchart image', () => {
    const q = dataset.questions.find(q => q.id === 'quiz_0904_q1');
    expect(q).toBeDefined();
    expect(q?.type).toBe('multiple_choice');
    expect(q?.prompt).toContain('Các node nào trên đồ thị tương ứng với các điều kiện cần kiểm tra');
    expect(q?.promptImages).toEqual(['/images/quiz/quiz_0904_flowchart.png']);
    expect(q?.correctOptionIds).toEqual(['opt_a', 'opt_d']);
    expect(q?.verificationStatus).toBe('verified_visual');
    expect(q?.source.pages).toEqual([211]);
  });

  it('Sample End: Quiz 0906 Q3 (Page 221) - Graph image and single choice', () => {
    const q = dataset.questions.find(q => q.id === 'quiz_0906_q3');
    expect(q).toBeDefined();
    expect(q?.type).toBe('single_choice');
    expect(q?.prompt).toContain('Các miền tương ứng với trường hợp "Không đạt" là:');
    expect(q?.promptImages).toEqual(['/images/quiz/quiz_0906_graph.png']);
    expect(q?.correctOptionIds).toEqual(['opt_a']);
    expect(q?.source.pages).toEqual([221]);
  });

  it('Sample End: Quiz Pr12 Q5 (Page 274) - Last question of entire PDF', () => {
    const q = dataset.questions.find(q => q.id === 'quiz_pr12_q5');
    expect(q).toBeDefined();
    expect(q?.source.pages).toEqual([274]);
    expect(q?.options.length).toBeGreaterThanOrEqual(2);
    expect(q?.correctOptionIds.length).toBe(1);
    expect(q?.verificationStatus).toBe('verified_text');
  });
});

describe('Image Asset Existence Verification', () => {
  it('every referenced prompt image and option image must physically exist in public directory', () => {
    const publicDir = path.resolve(__dirname, '../public');

    for (const q of dataset.questions) {
      if (q.promptImages) {
        for (const imgUrl of q.promptImages) {
          // url starts with /images/quiz/...
          const relPath = imgUrl.replace(/^\//, '');
          const fullPath = path.join(publicDir, relPath);
          expect(fs.existsSync(fullPath), `Missing image file: ${fullPath} for question ${q.id}`).toBe(true);
        }
      }

      for (const opt of q.options) {
        if (opt.image) {
          const relPath = opt.image.replace(/^\//, '');
          const fullPath = path.join(publicDir, relPath);
          expect(fs.existsSync(fullPath), `Missing option image file: ${fullPath} for question ${q.id}`).toBe(true);
        }
      }
    }
  });
});
