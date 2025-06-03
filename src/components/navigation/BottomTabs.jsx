
import React from 'react';
import { useLocation, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { User, MessageCircle, Home, Book, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-6xl md:text-8xl font-bold text-gradient">
              TrueVibe
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400 ml-4" />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Experience authentic connections through emotion-aware social interactions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/auth" 
              className="btn btn-primary px-8 py-4 text-lg font-semibold"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/documentation" 
              className="btn btn-ghost px-8 py-4 text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
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
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-dark border-t border-white/10 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);

            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center p-3 min-h-[64px] min-w-[64px] rounded-2xl transition-all duration-300 ${
                  active 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={tab.label}
              >
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                  <Icon size={20} className={`mb-1 ${active ? 'text-white' : ''}`} />
                  <span className={`text-xs font-medium ${active ? 'text-white' : ''}`}>
                    {tab.label}
                  </span>
                </div>

                {active && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-6 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Dummy Components
const ProfileComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
    <div className="card card-elevated p-8 text-center max-w-md w-full">
      <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
      <p className="text-gray-300">Your personal space for managing your TrueVibe experience</p>
    </div>
  </div>
);

const ThreadsComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
    <div className="card card-elevated p-8 text-center max-w-md w-full">
      <MessageCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Threads</h2>
      <p className="text-gray-300">Share your thoughts and connect through emotion-aware conversations</p>
    </div>
  </div>
);

const VibesComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
    <div className="card card-elevated p-8 text-center max-w-md w-full">
      <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Vibes</h2>
      <p className="text-gray-300">Explore trending emotions and discover your community's pulse</p>
    </div>
  </div>
);

const DocumentationComponent = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
    <div className="card card-elevated p-8 text-center max-w-md w-full">
      <Book className="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Documentation</h2>
      <p className="text-gray-300">Learn how to make the most of your TrueVibe journey</p>
    </div>
  </div>
);

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/profile" element={<ProfileComponent />} />
          <Route path="/threads" element={<ThreadsComponent />} />
          <Route path="/vibes" element={<VibesComponent />} />
          <Route path="/documentation" element={<DocumentationComponent />} />
        </Routes>
      </AnimatePresence>
      <BottomTabs />
    </>
  );
};

export default AppNavigation;
