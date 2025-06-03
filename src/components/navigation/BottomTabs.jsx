
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, User, Sparkles } from 'lucide-react';

const BottomTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: 'home', label: 'Home', icon: Home, path: '/home' },
    { key: 'threads', label: 'Threads', icon: MessageSquare, path: '/threads' },
    { key: 'vibes', label: 'Vibes', icon: Sparkles, path: '/vibes' },
    { key: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const activeTab = tabs.find(tab => location.pathname === tab.path)?.key || 'home';

  const handleTabPress = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabPress(tab.path)}
              className="flex flex-col items-center py-2 px-4 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600/20 rounded-lg"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <Icon 
                size={24} 
                className={`mb-1 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} 
              />
              <span 
                className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-400'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabs;
