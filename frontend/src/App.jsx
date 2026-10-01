import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import BackgroundAnimation from './components/BackgroundAnimation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ShareReceivePage from './pages/ShareReceivePage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MyFilesPage from './pages/MyFilesPage';
import SubjectsPage from './pages/SubjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AdminPage from './pages/AdminPage';
import UploadPage from './pages/UploadPage';
import SharedFilesPage from './pages/SharedFilesPage';
import RecycleBinPage from './pages/RecycleBinPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-100 dark:bg-slate-900 transition-colors duration-300 relative z-0">
          <BackgroundAnimation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/share/:token" element={<ShareReceivePage />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-files" element={<MyFilesPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/shared" element={<SharedFilesPage />} />
              <Route path="/recycle-bin" element={<RecycleBinPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
