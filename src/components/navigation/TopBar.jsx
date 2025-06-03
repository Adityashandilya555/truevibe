import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Bell } from 'lucide-react';

const TopBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-40"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold text-white">TrueVibe</h1>
        </div>

        {/* Search and Notifications */}
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-white transition-colors p-2">
            <Search size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors p-2 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;