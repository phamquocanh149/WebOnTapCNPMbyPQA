import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getChapters, getAllQuizzes, getQuestionsForQuiz, getMetadata } from '../services/quizService';

export const QuizListPage: React.FC = () => {
  const meta = getMetadata();
  const chapters = getChapters();
  const allQuizzes = useMemo(() => getAllQuizzes(), []);

  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredChapters = useMemo(() => {
    let result = chapters;

    if (selectedChapter !== 'all') {
      result = result.filter(c => c.id === selectedChapter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.map(chap => {
        const matchingQuizzes = chap.quizzes.filter(quiz => {
          if (quiz.title.toLowerCase().includes(q)) return true;
          // also search question prompts in this quiz
          const qs = getQuestionsForQuiz(quiz.id);
          return qs.some(question => question.prompt.toLowerCase().includes(q));
        });

        return {
          ...chap,
          quizzes: matchingQuizzes
        };
      }).filter(chap => chap.quizzes.length > 0);
    }

    return result;
  }, [chapters, selectedChapter, searchQuery]);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 mb-2 border border-red-100">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ngân hàng Quiz LMS chính thức</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Danh sách Quiz Ôn tập theo Chương
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Chọn bất kỳ quiz bài học, quiz kết thúc chương hoặc quiz Pr để bắt đầu luyện tập và kiểm tra kiến thức.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <div className="px-3 py-1.5 min-w-[80px]">
              <div className="text-xl font-bold text-slate-900">{meta.totalQuizzes}</div>
              <div className="text-xs text-slate-500 font-medium">Bài Quiz</div>
            </div>
            <div className="w-px bg-slate-200 hidden sm:block"></div>
            <div className="px-3 py-1.5 min-w-[80px]">
              <div className="text-xl font-bold text-slate-900">{meta.totalQuestions}</div>
              <div className="text-xs text-slate-500 font-medium">Tổng số câu</div>
            </div>
            <div className="w-px bg-slate-200 hidden sm:block"></div>
            <div className="px-3 py-1.5 min-w-[80px]">
              <div className="text-xl font-bold text-emerald-600">{meta.gradableQuestions}</div>
              <div className="text-xs text-slate-500 font-medium">Sẵn sàng</div>
            </div>
            <div className="w-px bg-slate-200 hidden sm:block"></div>
            <div className="px-3 py-1.5 min-w-[80px]">
              <div className="text-xl font-bold text-amber-600">{meta.needsReview}</div>
              <div className="text-xs text-slate-500 font-medium">Cần rà soát</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên quiz hoặc nội dung câu hỏi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 font-medium"
            >
              <option value="all">Tất cả các chương ({allQuizzes.length} quiz)</option>
              {chapters.map(chap => (
                <option key={chap.id} value={chap.id}>
                  {chap.title} ({chap.quizzes.length} quiz)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chapter Groups List */}
      {filteredChapters.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài quiz nào</h3>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử từ khóa tìm kiếm khác hoặc chuyển bộ lọc sang "Tất cả các chương".
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredChapters.map(chapter => (
            <div key={chapter.id} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <h2 className="text-lg font-bold text-slate-900">{chapter.title}</h2>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {chapter.quizzes.length} quiz • {chapter.totalQuestions} câu hỏi
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapter.quizzes.map(quiz => {
                  const qs = getQuestionsForQuiz(quiz.id);
                  const hasReview = qs.some(q => q.verificationStatus === 'needs_review');
                  const pagesText = quiz.sourcePages.length > 0
                    ? `Trang ${minMax(quiz.sourcePages)}`
                    : '';

                  return (
                    <div
                      key={quiz.id}
                      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {pagesText}
                          </span>
                          {hasReview ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>1 câu cần rà soát</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Sẵn sàng 100%</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition">
                          {quiz.title}
                        </h3>

                        <div className="mt-2 text-xs text-slate-500">
                          {qs.length} câu hỏi trắc nghiệm
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100">
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
                        >
                          <span>Bắt đầu làm bài</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function minMax(pages: number[]): string {
  if (!pages || pages.length === 0) return '';
  const min = Math.min(...pages);
  const max = Math.max(...pages);
  return min === max ? `${min}` : `${min} - ${max}`;
}
