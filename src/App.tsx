import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { QuizListPage } from './pages/QuizListPage';
import { QuizPlayPage } from './pages/QuizPlayPage';
import { FinalExamPage } from './pages/FinalExamPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/quiz/:quizId" element={<QuizPlayPage />} />
            <Route path="/cuoi-ki" element={<FinalExamPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
