import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import { getMetadata, getChapters } from '../services/quizService';

export const HomePage: React.FC = () => {
  const meta = getMetadata();
  const chapters = getChapters();

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold mb-4 border border-red-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HUST IT3180 • Kì 20242 • Stage 1 Live</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Ôn tập Nhập môn <span className="text-red-400">Công nghệ phần mềm</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Hệ thống website ôn luyện chuẩn mực cho môn học IT3180 Đại học Bách khoa Hà Nội.
            Toàn bộ ngân hàng câu hỏi, lựa chọn và đáp án được trích xuất 100% nguyên văn từ tài liệu LMS gốc.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>Vào ôn tập Quiz LMS ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/cuoi-ki"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 border border-slate-700 transition"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Khu vực Cuối kỳ (Placeholder)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2 High-level Feature Cards */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Hai phân hệ chức năng ôn tập</h2>
          <p className="text-sm text-slate-500">Truy cập đúng phân hệ ôn tập theo nhu cầu học tập của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Quiz LMS */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hoạt động đầy đủ (Stage 1)</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-700 transition">
                Ôn tập Quiz LMS
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Ngân hàng <strong>69 bài quiz</strong> và <strong>485 câu hỏi</strong> trắc nghiệm được trích xuất
                trực tiếp từ 275 trang tài liệu LMS kì 20242. Bao gồm các câu hỏi bài học, quiz kết thúc chương 1-9
                và các quiz Pr01-Pr12.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">{meta.totalQuizzes}</div>
                  <div className="text-xs text-slate-500 font-medium">Bài Quiz</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">{meta.gradableQuestions}</div>
                  <div className="text-xs text-slate-500 font-medium">Câu chấm được</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">{meta.needsReview}</div>
                  <div className="text-xs text-slate-500 font-medium">Cần rà soát</div>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hỗ trợ câu hỏi đơn, chọn nhiều, đúng/sai và câu có ảnh/sơ đồ UML</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chấm điểm tự động và đối chiếu chi tiết với đáp án LMS chính thức</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hiển thị minh bạch nguồn trang PDF của từng câu</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/quiz"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                <span>Truy cập Kho Quiz LMS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Final Exam Placeholder */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chức năng đang phát triển</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Ôn tập kiểm tra cuối kỳ
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Phân hệ ôn tập các đề thi và bộ câu hỏi trọng tâm kỳ thi cuối kỳ môn Nhập môn Công nghệ phần mềm.
                Theo đúng yêu cầu nghiệp vụ Stage 1, chức năng này được để trống và <strong>tuyệt đối không bịa đặt
                câu hỏi hoặc đề thi giả</strong>.
              </p>

              <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <div className="font-semibold flex items-center space-x-1.5 mb-1 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Chính sách không bịa dữ liệu (Zero Hallucination)</span>
                </div>
                Hệ thống chỉ cung cấp dữ liệu khi có nguồn đề thi cuối kỳ chính thức được xác thực và bàn giao ở các giai đoạn tiếp theo.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/cuoi-ki"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                <span>Xem trạng thái phân hệ cuối kỳ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Summary Grid */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-red-600" />
              <span>Phân bố các chương & Quiz</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Được phân nhóm theo đúng cấu trúc tuần học trong PDF LMS</p>
          </div>
          <Link
            to="/quiz"
            className="mt-3 sm:mt-0 text-sm font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <span>Xem chi tiết danh sách quiz</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map(chap => (
            <div
              key={chap.id}
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition"
            >
              <div className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                {chap.title}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                <span>{chap.quizzes.length} bài quiz</span>
                <span className="font-semibold text-slate-700">{chap.totalQuestions} câu hỏi</span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${(chap.readyQuestions / chap.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Provenance & Audit Info Card */}
      <section className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center space-x-2 mb-4 text-emerald-400 font-bold text-base">
          <Database className="w-5 h-5" />
          <span>Báo cáo nguồn gốc dữ liệu trích xuất (Provenance Report)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <div>
              <span className="text-slate-400">Tập tin nguồn:</span>{' '}
              <span className="font-mono text-white font-medium">Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf</span>
            </div>
            <div>
              <span className="text-slate-400">Số trang PDF:</span>{' '}
              <span className="text-white font-bold">{meta.totalPages} trang</span>
            </div>
            <div>
              <span className="text-slate-400">Mã SHA-256:</span>{' '}
              <span className="font-mono text-emerald-300 text-[11px] block mt-0.5 break-all">
                {meta.sha256}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400">Tổng số câu hỏi:</span>{' '}
              <span className="text-white font-bold">{meta.totalQuestions} câu</span> (446 text + 37 visual + 2 review)
            </div>
            <div>
              <span className="text-slate-400">Số câu có thể chấm điểm:</span>{' '}
              <span className="text-emerald-400 font-bold">{meta.gradableQuestions} câu ({((meta.gradableQuestions / meta.totalQuestions) * 100).toFixed(1)}%)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              2 câu thiếu đáp án từ PDF (do lượt thi bị Incorrect và LMS ẩn đáp án) được giữ nguyên, đánh dấu <span className="text-amber-400 font-semibold">needs_review</span> và loại trừ khỏi hệ thống chấm điểm để đảm bảo tính tuyệt đối trung thực.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
