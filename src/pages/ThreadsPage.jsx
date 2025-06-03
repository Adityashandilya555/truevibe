import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';
import ThreadFeed from '../components/threads/ThreadFeed';

const ThreadsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Threads</h1>
            <p className="text-gray-400">Authentic conversations and thoughts</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors p-2">
              <TrendingUp size={16} />
              <span className="text-sm">Trending</span>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2">
              <Filter size={20} />
            </button>
          </div>
        </motion.div>

        {/* Thread Feed */}
        <ThreadFeed />

        {/* Create Thread Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all z-50"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <BottomTabs />
    </div>
  );
};

export default ThreadsPage;