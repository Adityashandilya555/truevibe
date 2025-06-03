
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute, { GuestRoute } from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const { user, initialize, setAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if demo mode is enabled
        const isDemoMode = localStorage.getItem('truevibe_demo_mode') === 'true';
        if (isDemoMode) {
          setDemoMode(true);
          // Set demo user
          const demoUser = {
            id: 'demo_user_123',
            email: 'demo@truevibe.com',
            user_metadata: {
              full_name: 'Demo User',
              avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              user_name: 'demouser'
            }
          };
          const demoSession = { user: demoUser };
          const demoProfile = {
            id: 'demo_user_123',
            username: 'demouser',
            adjective_one: 'Creative',
            adjective_two: 'Empathetic',
            adjective_three: 'Curious'
          };
          setAuth(demoUser, demoSession, demoProfile);
        } else {
          await initialize();
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    initializeApp();
  }, [initialize, setAuth]);

  // Enable demo mode function
  const enableDemoMode = () => {
    localStorage.setItem('truevibe_demo_mode', 'true');
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 relative">
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopBar />

          <main className="flex-1 pb-20">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  demoMode || user ? <Navigate to="/home" replace /> : 
                  <LandingPage onEnterDemo={enableDemoMode} />
                } />

                {/* Guest Only Routes (redirect to home if authenticated) */}
                <Route path="/login" element={
                  (demoMode || user) ? <Navigate to="/home" replace /> :
                  <LoginForm onEnterDemo={enableDemoMode} />
                } />

                {/* OAuth Callback */}
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                {/* Main App Routes (accessible in demo mode or authenticated) */}
                <Route path="/home" element={
                  (demoMode || user) ? <HomePage /> : <Navigate to="/" replace />
                } />

                <Route path="/profile" element={
                  (demoMode || user) ? <ProfilePage /> : <Navigate to="/" replace />
                } />

                <Route path="/threads" element={
                  (demoMode || user) ? <ThreadsPage /> : <Navigate to="/" replace />
                } />

                <Route path="/vibes" element={
                  (demoMode || user) ? <VibesPage /> : <Navigate to="/" replace />
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
    </ErrorBoundary>
  );
}

export default App;
