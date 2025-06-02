
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ThreadsPage from './pages/ThreadsPage';
import VibesPage from './pages/VibesPage';
import AuthFlow from './components/auth/AuthFlow';
import useAuth from './hooks/useAuth';
import './App.css';

function AppContent() {
  const { user, session, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading screen during authentication check
  if (loading) {
    return <LoadingScreen message="Authenticating..." emotion="trust" />;
  }

  // If not authenticated, show auth flow or landing page
  if (!isAuthenticated) {
    // Show AuthFlow for auth-specific routes
    if (location.pathname === '/login' || location.pathname === '/signup') {
      return <AuthFlow />;
    }
    
    // Show landing page for other routes
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthFlow />} />
        <Route path="/signup" element={<AuthFlow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated user layout
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Fixed height header to prevent CLS */}
      <div className="h-16 flex-shrink-0">
        <TopBar />
      </div>
      
      {/* Main content with fixed calculations */}
      <main className="flex-1 overflow-auto" style={{ height: 'calc(100vh - 8rem)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/threads" replace />} />
          <Route path="/login" element={<Navigate to="/threads" replace />} />
          <Route path="/signup" element={<Navigate to="/threads" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/threads" element={<ThreadsPage />} />
          <Route path="/vibes" element={<VibesPage />} />
          <Route path="*" element={<Navigate to="/threads" replace />} />
        </Routes>
      </main>
      
      {/* Fixed height bottom navigation to prevent CLS */}
      <div className="h-16 flex-shrink-0">
        <BottomTabs />
      </div>
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
