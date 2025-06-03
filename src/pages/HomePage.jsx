import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';
import ThreadFeed from '../components/threads/ThreadFeed';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Friend'}! 👋
          </h2>
          <p className="text-gray-400">What's your authentic self feeling today?</p>
        </motion.div>

        {/* Thread Feed */}
        <ThreadFeed />

        {/* Floating Action Button */}
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

export default HomePage;