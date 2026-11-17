import React from 'react';
import { ShieldCheck, FileCheck } from 'lucide-react';
import { getMetadata } from '../services/quizService';

export const Footer: React.FC = () => {
  const meta = getMetadata();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 py-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-white font-bold text-base mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Website Ôn tập Công nghệ Phần mềm (IT3180)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống ôn luyện trắc nghiệm LMS chuẩn xác cho sinh viên Đại học Bách khoa Hà Nội (HUST).
              Mọi câu hỏi và đáp án được bảo tồn nguyên vẹn từ tài liệu đề thi thực tế kì 20242.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chính sách tính trung thực dữ liệu</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• 100% câu hỏi từ PDF gốc, không bịa đặt hoặc đoán mò.</li>
              <li>• Đáp án theo chứng thực LMS chính thức.</li>
              <li>• 2 câu thiếu đáp án gốc được đánh dấu minh bạch <code className="text-amber-400">needs_review</code> và không chấm điểm.</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-2 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-sky-400" />
              <span>Nguồn tài liệu xác thực</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>File: <span className="font-mono text-slate-200">Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf</span></div>
              <div>Số trang: <span className="text-slate-200 font-semibold">{meta.totalPages} trang</span> | Checksum:</div>
              <div className="font-mono text-[11px] text-emerald-300 break-all bg-slate-950 p-1.5 rounded border border-slate-800">
                {meta.sha256}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>© 2026 Ôn tập IT3180 HUST — Stage 1 Implementation.</div>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span>69 Quizzes</span>
            <span>•</span>
            <span>485 Câu hỏi</span>
            <span>•</span>
            <span>483 Câu có thể chấm</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
