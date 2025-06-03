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
// Pages
import AuthCallbackPage from './pages/AuthCallbackPage';

// Components
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute, { GuestRoute } from './components/auth/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Add a minimum loading time for smooth UX
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    initializeApp();
  }, [initialize]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-900 relative">
          <div className="relative z-10 flex flex-col min-h-screen">
            <TopBar />

            <main className="flex-1 pb-20">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Guest Only Routes (redirect to home if authenticated) */}
                  <Route path="/login" element={
                    <GuestRoute>
                      <LoginForm />
                    </GuestRoute>
                  } />

                  {/* OAuth Callback */}
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* Protected Routes */}
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />

                  <Route path="/threads" element={
                    <ProtectedRoute>
                      <ThreadsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/vibes" element={
                    <ProtectedRoute>
                      <VibesPage />
                    </ProtectedRoute>
                  } />

                  {/* Public Support and Documentation */}
                  <Route path="/documentation" element={<DocumentationPage />} />

                  {/* Fallback */}
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