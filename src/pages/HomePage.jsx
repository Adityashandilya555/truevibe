import React from 'react';
import { motion } from 'framer-motion';
import ProfileHeader from '../components/profile/ProfileHeader';
import StoriesCarousel from '../components/profile/StoriesCarousel';
import ThreadComposer from '../components/threads/ThreadComposer';
import ThreadFeed from '../components/threads/ThreadFeed';
import useAuthStore from '../store/authStore';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

const HomePage = () => {
  const { user, profile } = useAuthStore();

  const handleThreadSubmit = async (threadData) => {
    try {
      console.log('Submitting thread:', threadData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      console.log('Thread posted successfully!', threadData);

      // TODO: Add to thread feed or refresh feed
    } catch (error) {
      console.error('Error submitting thread:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to TrueVibe
          </h1>
          <p className="text-gray-400">
            Share your authentic emotions and connect with others
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">127</div>
            <div className="text-xs text-gray-400">Trending</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">2.1k</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">89%</div>
            <div className="text-xs text-gray-400">Joy</div>
          </div>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileHeader user={user} profile={profile} />
        </motion.div>

        {/* Stories Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StoriesCarousel />
        </motion.div>

        {/* Thread Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ThreadComposer onSubmit={handleThreadSubmit} />
        </motion.div>

        {/* Thread Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ThreadFeed />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;