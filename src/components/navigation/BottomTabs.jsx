import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'threads', label: 'Threads', icon: MessageCircle, path: '/threads' },
    { id: 'vibes', label: 'Vibes', icon: Heart, path: '/vibes' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-700 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);

            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center p-3 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-300 ${
                  active 
                    ? 'text-white bg-gray-800' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={tab.label}
              >
                <div className="flex flex-col items-center">
                  <Icon size={20} className={`mb-1 ${active ? 'text-white' : ''}`} />
                  <span className={`text-xs font-medium ${active ? 'text-white' : ''}`}>
                    {tab.label}
                  </span>
                </div>

                {active && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-6 h-1 bg-white rounded-full"
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

export default BottomTabs;