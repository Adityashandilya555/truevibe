
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading TrueVibe...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 relative">
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopBar />

          <main className="flex-1 pb-20">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/threads" element={<ThreadsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/vibes" element={<VibesPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>

          <BottomTabs />
        </div>
      </div>
    </Router>
  );
}

export default App;
