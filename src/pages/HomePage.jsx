
<old_str></old_str>
<new_str>import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share, Plus, TrendingUp, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';

const HomePage = () => {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        username: '@sarahc',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Just finished a 10km run and feeling absolutely incredible! 🏃‍♀️ There\'s something magical about pushing your limits and discovering you\'re stronger than you thought.',
      emotion: 'joy',
      timestamp: '2h ago',
      likes: 24,
      comments: 8,
      shares: 3,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      user: {
        name: 'Marcus Johnson',
        username: '@marcusj',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Been reflecting on how much I\'ve grown this year. Sometimes we don\'t realize our progress until we look back. Grateful for every challenge that made me stronger.',
      emotion: 'contemplative',
      timestamp: '4h ago',
      likes: 45,
      comments: 12,
      shares: 7
    },
    {
      id: 3,
      user: {
        name: 'Emma Rodriguez',
        username: '@emmar',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Coffee tastes better when shared with good friends ☕ Had the most amazing conversation today about dreams, fears, and everything in between.',
      emotion: 'peaceful',
      timestamp: '6h ago',
      likes: 18,
      comments: 5,
      shares: 2,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=300&fit=crop'
    }
  ]);

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'border-yellow-400',
      contemplative: 'border-purple-400',
      peaceful: 'border-green-400',
      excited: 'border-orange-400'
    };
    return colors[emotion] || 'border-gray-400';
  };

  const getEmotionBg = (emotion) => {
    const colors = {
      joy: 'bg-yellow-400',
      contemplative: 'bg-purple-400',
      peaceful: 'bg-green-400',
      excited: 'bg-orange-400'
    };
    return colors[emotion] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to TrueVibe</h1>
          <p className="text-gray-400">Share your authentic emotions and connect deeply</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white font-semibold">128</p>
            <p className="text-gray-400 text-sm">Connections</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-semibold">45</p>
            <p className="text-gray-400 text-sm">Vibes Shared</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-white font-semibold">892</p>
            <p className="text-gray-400 text-sm">Reactions</p>
          </div>
        </motion.div>

        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`bg-gray-800 rounded-xl p-6 border-2 ${getEmotionColor(post.emotion)}`}
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{post.user.name}</h3>
                  <p className="text-gray-400 text-sm">{post.user.username} • {post.timestamp}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getEmotionBg(post.emotion)}`}>
                  {post.emotion}
                </div>
              </div>

              {/* Content */}
              <p className="text-white text-lg mb-4 leading-relaxed">{post.content}</p>

              {/* Image if present */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={20} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageSquare size={20} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                  <Share size={20} />
                  <span>{post.shares}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Post Button */}
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

export default HomePage;</new_str>
