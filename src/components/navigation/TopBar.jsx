import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Bell } from 'lucide-react';

const TopBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white">TrueVibe</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => console.log('Search clicked')}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => console.log('Notifications clicked')}
            className="text-gray-400 hover:text-white transition-colors p-2 relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;