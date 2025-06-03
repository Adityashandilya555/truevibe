import React from 'react';
import { useLocation, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { User, MessageCircle, Home, Book, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

// New Landing Page Component
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to TruVibe</h1>
      <p className="text-lg mb-8">
        An emotion-aware application designed to connect you with others.
      </p>
      <Link to="/login" className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </Link>
    </div>
  );
};

const BottomTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'threads', label: 'Threads', icon: MessageCircle, path: '/threads' },
    { id: 'vibes', label: 'Vibes', icon: Heart, path: '/vibes' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'docs', label: 'Docs', icon: Book, path: '/documentation' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center p-2 min-h-[60px] min-w-[60px] rounded-lg transition-colors ${
                active 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={tab.label}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
              {active && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  style={{ transform: 'translateX(-50%)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Dummy Components
const ProfileComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Profile Component</div>;
const ThreadsComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Threads Component</div>;
const VibesComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Vibes Component</div>;
const DocumentationComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Documentation Component</div>;

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 z-50">
        <div className="flex justify-start items-center h-16">
          {/* Home Button/Link */}
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>

          {/* Documentation Link */}
          <Link
            to="/documentation"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/documentation' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Documentation</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/profile" element={<ProfileComponent />} />
        <Route path="/threads" element={<ThreadsComponent />} />
        <Route path="/vibes" element={<VibesComponent />} />
        <Route path="/documentation" element={<DocumentationComponent />} />
      </Routes>
      <BottomTabs />
    </>
  );
};

export default AppNavigation;