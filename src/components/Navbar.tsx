import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-red-800 transition">
              IT
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 group-hover:text-red-700 transition">
                Ôn tập CNPM (IT3180)
              </div>
              <div className="text-xs text-slate-500 font-medium">
                HUST • Kì 20242 • Stage 1
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/')
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>

            <Link
              to="/quiz"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/quiz')
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kho Quiz LMS</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-bold">
                69
              </span>
            </Link>

            <Link
              to="/cuoi-ki"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/cuoi-ki')
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ôn tập Cuối kỳ</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-500 font-medium">
                Sắp có
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
