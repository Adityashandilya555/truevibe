import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { User, MessageCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Emotion colors for active states using Plutchik's wheel
const EMOTION_COLORS = {
  profile: 'bg-green-500', // Trust (Green)
  threads: 'bg-yellow-400', // Joy (Yellow)
  vibes: 'bg-orange-400', // Anticipation (Orange)
};

// Badge animations
const BADGE_ANIMATION = 'animate-pulse';

const BottomTabs = () => {
  const { profile } = useAuthStore();
  const location = useLocation();
  
  // State for notification badges
  const [notifications, setNotifications] = useState({
    profile: 0,
    threads: 3, // Example starting value
    vibes: 0,
  });
  
  // Mock function to update notifications (would be replaced with real data)
  useEffect(() => {
    // This would be replaced with a real-time subscription in a production app
    const interval = setInterval(() => {
      // Simulate new thread notifications periodically
      if (Math.random() > 0.7 && location.pathname !== '/threads') {
        setNotifications(prev => ({
          ...prev,
          threads: prev.threads + 1
        }));
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [location.pathname]);
  
  // Clear notifications when visiting the respective tab
  useEffect(() => {
    const path = location.pathname.split('/')[1] || '';
    if (path && notifications[path] > 0) {
      setNotifications(prev => ({
        ...prev,
        [path]: 0
      }));
    }
  }, [location.pathname, notifications]);
  
  const handleTabClick = (tab) => {
    // Add your logic here
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-40 pb-safe">
      <nav className="flex justify-around items-center max-w-lg mx-auto px-4 py-2">
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            relative flex flex-col items-center justify-center p-2 min-h-[56px] min-w-[56px] rounded-lg
            ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
          `}
          onClick={() => handleTabClick('profile')}
          aria-label="Profile"
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
          {notifications.profile > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {notifications.profile}
            </motion.div>
          )}
        </NavLink>
        
        <NavLink
          to="/threads"
          className={({ isActive }) => `
            relative flex flex-col items-center justify-center p-2 min-h-[56px] min-w-[56px] rounded-lg
            ${isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
          `}
          onClick={() => handleTabClick('threads')}
          aria-label="Threads"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Threads</span>
          {notifications.threads > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {notifications.threads}
            </motion.div>
          )}
        </NavLink>
        
        <NavLink
          to="/vibes"
          className={({ isActive }) => `
            relative flex flex-col items-center justify-center p-2 min-h-[56px] min-w-[56px] rounded-lg
            ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
          `}
          onClick={() => handleTabClick('vibes')}
          aria-label="Vibes"
        >
          <Zap className="w-6 h-6" />
          <span className="text-xs mt-1">Vibes</span>
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
            2.0
          </span>
        </NavLink>
      </nav>
      
      {/* Add safe area CSS */}
      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
      `}</style>
    </div>
  );
};

export default BottomTabs;
