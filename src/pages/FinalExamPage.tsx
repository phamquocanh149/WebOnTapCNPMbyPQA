import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';

export const FinalExamPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-amber-100">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800 mb-4 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Chức năng đang phát triển — Stage 2</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Ôn tập kiểm tra cuối kỳ
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
          Phân hệ ôn tập đề thi cuối kỳ môn <strong>Nhập môn Công nghệ phần mềm (IT3180)</strong> đang trong kế hoạch triển khai của giai đoạn kế tiếp.
        </p>

        <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed text-left mb-8">
          <div className="font-bold text-slate-700 flex items-center space-x-1.5 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            <span>Chính sách kiểm duyệt dữ liệu Stage 1:</span>
          </div>
          Để đảm bảo tính trung thực tuyệt đối và nguyên tắc không sáng tạo dữ liệu giả mạo (Zero Hallucination), Stage 1 không khởi tạo bất kỳ đề thi hoặc câu hỏi mô phỏng nào khi chưa có nguồn đề thi được chuyển giao chính thức.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay về Trang chủ</span>
          </Link>

          <Link
            to="/quiz"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition"
          >
            <span>Vào ôn tập Quiz LMS</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
