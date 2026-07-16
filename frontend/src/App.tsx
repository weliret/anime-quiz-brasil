import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import QuizListPage from './pages/quiz/QuizListPage';
import QuizDetailPage from './pages/quiz/QuizDetailPage';
import QuizPlayPage from './pages/quiz/QuizPlayPage';
import ProfilePage from './pages/user/ProfilePage';
import RankingPage from './pages/ranking/RankingPage';
import AdminPage from './pages/admin/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Routes */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quizzes/:id" element={<QuizDetailPage />} />
            <Route path="/quizzes/:id/play" element={<QuizPlayPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
