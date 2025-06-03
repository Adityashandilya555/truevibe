import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import HomePage from './pages/HomePage';
import ThreadsPage from './pages/ThreadsPage';
import ProfilePage from './pages/ProfilePage';
import VibesPage from './pages/VibesPage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/threads" element={<ThreadsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/vibes" element={<VibesPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
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