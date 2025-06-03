
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Sparkles, User } from 'lucide-react';

const BottomTabs = () => {
  const tabs = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: MessageSquare, label: 'Threads', path: '/threads' },
    { icon: Sparkles, label: 'Vibes', path: '/vibes' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-50"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-blue-500 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`
            }
          >
            <tab.icon size={20} />
            <span className="text-xs font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomTabs;
