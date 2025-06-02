import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ThreadsPage from './pages/ThreadsPage';
import VibesPage from './pages/VibesPage';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import './App.css';

function AppContent() {
  const { user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <TopBar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/threads" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/threads" element={<ThreadsPage />} />
          <Route path="/vibes" element={<VibesPage />} />
          <Route path="*" element={<Navigate to="/threads" replace />} />
        </Routes>
      </main>
      <BottomTabs />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;