import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import ProfilePage from './pages/ProfilePage';
import ThreadsPage from './pages/ThreadsPage';
import VibesPage from './pages/VibesPage';
import LandingPage from './pages/LandingPage';
import AuthFlow from './components/auth/AuthFlow';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-900">
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthFlow />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white">
        <Router>
          <div className="flex flex-col h-screen">
            <TopBar />
            <main className="flex-1 overflow-y-auto pb-16">
              <Routes>
                <Route path="/" element={<Navigate to="/profile" />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/threads" element={<ThreadsPage />} />
                <Route path="/vibes" element={<VibesPage />} />
                <Route path="*" element={<Navigate to="/profile" />} />
              </Routes>
            </main>
            <BottomTabs />
          </div>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;