import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Shuffle,
  Eye,
  Award,
  Layers
} from 'lucide-react';
import {
  getQuizById,
  getQuestionsForQuiz,
  gradeQuiz,
  QuizGradeReport
} from '../services/quizService';
import { Question, UserQuizAnswers } from '../types/quiz';

export const QuizPlayPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const quiz = useMemo(() => quizId ? getQuizById(quizId) : undefined, [quizId]);
  const rawQuestions = useMemo(() => quizId ? getQuestionsForQuiz(quizId) : [], [quizId]);

  // Shuffle toggle (default false, as mandated by prompt guidelines)
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserQuizAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gradeReport, setGradeReport] = useState<QuizGradeReport | null>(null);

  // Storage key for auto-save
  const storageKey = `quiz_progress_${quizId}`;

  // Shuffled or raw questions
  const questions: Question[] = useMemo(() => {
    if (!isShuffled) return rawQuestions;
    // Keep a stable shuffle per session
    return [...rawQuestions].sort((a, b) => {
      const hA = (a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 100;
      const hB = (b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 100;
      return hA - hB;
    });
  }, [rawQuestions, isShuffled]);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!quizId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex < rawQuestions.length) {
          setCurrentIndex(parsed.currentIndex);
        }
      }
    } catch {
      // ignore
    }
  }, [quizId, storageKey, rawQuestions.length]);

  // Save progress to localStorage
  useEffect(() => {
    if (!quizId || isSubmitted) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, currentIndex }));
    } catch {
      // ignore
    }
  }, [answers, currentIndex, quizId, isSubmitted, storageKey]);

  const currentQuestion: Question | undefined = questions[currentIndex];

  // Option selection handler
  const handleSelectOption = useCallback((optionId: string) => {
    if (isSubmitted || !currentQuestion) return;

    setAnswers(prev => {
      const currentSelected = prev[currentQuestion.id] || [];
      if (currentQuestion.type === 'multiple_choice') {
        const exists = currentSelected.includes(optionId);
        const next = exists
          ? currentSelected.filter(id => id !== optionId)
          : [...currentSelected, optionId];
        return { ...prev, [currentQuestion.id]: next };
      } else {
        // single_choice or true_false
        return { ...prev, [currentQuestion.id]: [optionId] };
      }
    });
  }, [isSubmitted, currentQuestion]);

  // Keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Arrows for next / prev
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }

      // 1-5 or A-E keys for option selection
      if (!isSubmitted && currentQuestion) {
        const key = e.key.toLowerCase();
        let targetIdx = -1;
        if (['1', '2', '3', '4', '5'].includes(key)) {
          targetIdx = parseInt(key, 10) - 1;
        } else if (['a', 'b', 'c', 'd', 'e'].includes(key)) {
          targetIdx = key.charCodeAt(0) - 'a'.charCodeAt(0);
        }

        if (targetIdx >= 0 && targetIdx < currentQuestion.options.length) {
          handleSelectOption(currentQuestion.options[targetIdx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, isSubmitted, currentQuestion, handleSelectOption]);

  // Clear current question selection
  const handleClearCurrent = () => {
    if (isSubmitted || !currentQuestion) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Submit Quiz
  const handleSubmit = () => {
    if (!quizId) return;
    const unansweredCount = questions.filter(q => !(answers[q.id] && answers[q.id].length > 0)).length;
    if (unansweredCount > 0) {
      const confirm = window.confirm(`Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài không?`);
      if (!confirm) return;
    }

    const report = gradeQuiz(quizId, answers);
    setGradeReport(report);
    setIsSubmitted(true);
    localStorage.removeItem(storageKey);
  };

  // Retake Quiz
  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setGradeReport(null);
    setCurrentIndex(0);
    localStorage.removeItem(storageKey);
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy bài Quiz</h2>
        <p className="text-sm text-slate-500 mt-2">Bài quiz yêu cầu không tồn tại trong ngân hàng câu hỏi.</p>
        <Link
          to="/quiz"
          className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Quiz</span>
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).filter(k => answers[k] && answers[k].length > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Control Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link to="/quiz" className="hover:text-red-700 flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kho Quiz LMS</span>
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-700">{quiz.chapterTitle}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>{quiz.title}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Trang {quiz.sourcePages.join(', ')}
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Shuffle Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSubmitted) return;
              setIsShuffled(prev => !prev);
              setCurrentIndex(0);
            }}
            disabled={isSubmitted}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isShuffled
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Xáo trộn câu hỏi (Mặc định: Tắt theo thứ tự gốc của PDF)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Xáo trộn: {isShuffled ? 'Bật' : 'Tắt'}</span>
          </button>

          {isSubmitted ? (
            <button
              onClick={handleRetake}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại Quiz</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center space-x-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp bài & Chấm điểm</span>
            </button>
          )}
        </div>
      </div>

      {/* Submitted Result Scorecard Banner */}
      {isSubmitted && gradeReport && (
        <div className="bg-gradient-to-r from-slate-900 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Kết quả chấm điểm LMS</span>
              </div>
              <h2 className="text-2xl font-bold">
                Điểm số: <span className="text-red-400 font-extrabold">{gradeReport.score}</span> / 10.0
                <span className="text-base text-slate-300 font-normal ml-2">({gradeReport.percentage}%)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Đúng {gradeReport.correctCount}/{gradeReport.gradableQuestions} câu có thể chấm điểm.
                {gradeReport.unverifiedQuestions > 0 && (
                  <span className="text-amber-300 ml-1">
                    ({gradeReport.unverifiedQuestions} câu chưa xác minh không tính điểm).
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleRetake}
                className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài này</span>
              </button>
              <Link
                to="/quiz"
                className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition"
              >
                <span>Kho Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Runner Grid (Content + Navigator Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Active Question Card */}
        <div className="lg:col-span-3 space-y-4">
          {currentQuestion && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              {/* Question Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-red-700 font-bold text-sm flex items-center justify-center">
                    {currentIndex + 1}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Câu hỏi {currentIndex + 1} / {questions.length}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Số thứ tự trong quiz gốc: Câu {currentQuestion.questionNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Type Badge */}
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {currentQuestion.type === 'multiple_choice' && 'Chọn một hoặc nhiều đáp án'}
                    {currentQuestion.type === 'single_choice' && 'Chọn một đáp án'}
                    {currentQuestion.type === 'true_false' && 'Đúng hoặc Sai'}
                  </span>

                  {/* Verification Status Badge */}
                  {currentQuestion.verificationStatus === 'needs_review' ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cần rà soát (Không chấm điểm)</span>
                    </span>
                  ) : currentQuestion.verificationStatus === 'verified_visual' ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xác minh trực quan</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Xác minh văn bản LMS</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed mb-6 whitespace-pre-line">
                {currentQuestion.prompt}
              </div>

              {/* Prompt Images if any */}
              {currentQuestion.promptImages && currentQuestion.promptImages.length > 0 && (
                <div className="my-6 space-y-4">
                  {currentQuestion.promptImages.map((imgSrc, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-w-full flex justify-center"
                    >
                      <img
                        src={imgSrc}
                        alt={`Sơ đồ câu hỏi ${currentQuestion.questionNumber}`}
                        className="max-h-96 object-contain rounded-lg shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Options List */}
              <div className="space-y-3">
                {currentQuestion.options.map(option => {
                  const selectedList = answers[currentQuestion.id] || [];
                  const isChecked = selectedList.includes(option.id);
                  const isCorrect = currentQuestion.correctOptionIds.includes(option.id);

                  let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                    } else if (isChecked && !isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      optionStyle = 'border-slate-200 opacity-60';
                    }
                  } else if (isChecked) {
                    optionStyle = 'border-red-500 bg-red-50/70 text-slate-900 font-medium shadow-sm';
                  }

                  return (
                    <label
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`flex items-start space-x-3.5 p-4 rounded-xl border-2 transition cursor-pointer ${optionStyle}`}
                    >
                      <div className="pt-0.5">
                        <input
                          type={currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                          name={`q_${currentQuestion.id}`}
                          checked={isChecked}
                          onChange={() => {}} // handled by label onClick
                          disabled={isSubmitted}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 rounded border-slate-300"
                        />
                      </div>

                      <div className="flex-1 text-sm leading-relaxed">
                        {option.label && (
                          <span className="font-bold text-slate-700 mr-2">
                            {option.label.toUpperCase()}.
                          </span>
                        )}
                        {option.text && <span>{option.text}</span>}

                        {option.image && (
                          <div className="mt-2">
                            <img
                              src={option.image}
                              alt={`Phương án ${option.label}`}
                              className="max-h-48 object-contain rounded border border-slate-200 bg-white p-2"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post-submit indicators */}
                      {isSubmitted && (
                        <div className="pt-0.5">
                          {isCorrect ? (
                            <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Đáp án đúng</span>
                            </span>
                          ) : isChecked ? (
                            <span className="flex items-center space-x-1 text-xs font-bold text-rose-700">
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>Đã chọn sai</span>
                            </span>
                          ) : null}
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Review Feedback Notice when Submitted */}
              {isSubmitted && (
                <div className="mt-6 pt-5 border-t border-slate-200">
                  {currentQuestion.verificationStatus === 'needs_review' ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      <div className="font-bold flex items-center space-x-1.5 mb-1 text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        <span>Câu hỏi chưa có đáp án LMS chính thức</span>
                      </div>
                      <p>
                        {currentQuestion.verificationNote ||
                          'Tài liệu PDF gốc bị Incorrect ở lượt thi này và không hiển thị đáp án đúng. Để tuân thủ chính sách Zero Hallucination, hệ thống không tự ý đoán mò đáp án và không tính điểm câu này.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                        <Eye className="w-4 h-4 text-slate-600" />
                        <span>Đối chiếu đáp án nguồn:</span>
                      </div>
                      <div className="text-slate-700">
                        Đáp án đúng theo LMS: {' '}
                        <strong className="text-emerald-700">
                          {currentQuestion.options
                            .filter(o => currentQuestion.correctOptionIds.includes(o.id))
                            .map(o => (o.label ? `${o.label.toUpperCase()}. ${o.text}` : o.text))
                            .join('; ')}
                        </strong>
                      </div>
                      {currentQuestion.verificationNote && (
                        <div className="text-slate-500 italic">
                          Ghi chú: {currentQuestion.verificationNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Card Footer with Actions */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400">
                  Phím tắt: <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-slate-600">A-D</kbd> chọn đáp án • <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-slate-600">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-slate-600">→</kbd> chuyển câu
                </div>

                <div className="flex items-center space-x-2">
                  {!isSubmitted && (
                    <button
                      onClick={handleClearCurrent}
                      className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-medium transition"
                    >
                      Bỏ chọn
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Câu trước</span>
                  </button>

                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Provenance Trace */}
          {currentQuestion && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Truy vết nguồn gốc:</span>
                <span className="font-mono text-slate-700 font-medium">{currentQuestion.source.file}</span>
                <span>•</span>
                <span>Trang PDF: <strong>{currentQuestion.source.pages.join(', ')}</strong></span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ID: {currentQuestion.id}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Question Navigator Palette */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Bảng điều hướng câu hỏi</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                {answeredCount}/{questions.length}
              </span>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = answers[q.id] && answers[q.id].length > 0;
                const isReview = q.verificationStatus === 'needs_review';

                let btnStyle = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';

                if (isSubmitted && gradeReport) {
                  const gr = gradeReport.results.find(r => r.questionId === q.id);
                  if (gr) {
                    if (!gr.isGradable) {
                      btnStyle = 'bg-amber-100 text-amber-900 border-amber-300';
                    } else if (gr.isCorrect) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else {
                      btnStyle = 'bg-rose-500 text-white border-rose-500';
                    }
                  }
                } else if (isCurrent) {
                  btnStyle = 'bg-red-600 text-white border-red-600 font-bold shadow-sm';
                } else if (hasAnswer) {
                  btnStyle = 'bg-red-50 text-red-800 border-red-300 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition font-mono ${btnStyle}`}
                    title={`Câu ${idx + 1}${isReview ? ' (Cần rà soát)' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              {isSubmitted ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-emerald-600"></span>
                    <span>Đúng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-rose-500"></span>
                    <span>Sai</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                    <span>Chưa xác minh</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-red-600"></span>
                    <span>Đang làm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-red-50 border border-red-300"></span>
                    <span>Đã trả lời</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-slate-50 border border-slate-200"></span>
                    <span>Chưa trả lời</span>
                  </div>
                </>
              )}
            </div>

            {/* Submit / Finish button in sidebar */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              {isSubmitted ? (
                <button
                  onClick={handleRetake}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp bài ({answeredCount}/{questions.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
