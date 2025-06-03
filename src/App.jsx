
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import ThreadsPage from './pages/ThreadsPage';
import VibesPage from './pages/VibesPage';
import ProfilePage from './pages/ProfilePage';
import DocumentationPage from './pages/DocumentationPage';
import LandingPage from './pages/LandingPage';
import AuthFlow from './components/auth/AuthFlow';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Add a minimum loading time for smooth UX
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    initializeApp();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
          {/* Background Effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <TopBar />
            
            <main className="flex-1 pb-20">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/auth" element={<AuthFlow />} />
                  <Route path="/threads" element={<ThreadsPage />} />
                  <Route path="/vibes" element={<VibesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>

            <BottomTabs />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
