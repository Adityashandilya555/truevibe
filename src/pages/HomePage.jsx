
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, Bookmark, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        username: '@sarahc',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Just finished an amazing hiking trail! The view was absolutely breathtaking 🏔️',
      emotion: 'joyful',
      timestamp: '2h ago',
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: 2,
      user: {
        name: 'Alex Rivera',
        username: '@alexr',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Feeling grateful for all the support from my friends and family lately. Life is good! ✨',
      emotion: 'grateful',
      timestamp: '4h ago',
      likes: 42,
      comments: 12,
      shares: 6
    },
    {
      id: 3,
      user: {
        name: 'Maya Patel',
        username: '@mayap',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Working on a new art project today. The creative process is so therapeutic 🎨',
      emotion: 'creative',
      timestamp: '6h ago',
      likes: 18,
      comments: 5,
      shares: 2
    }
  ]);

  const getEmotionColor = (emotion) => {
    const colors = {
      joyful: 'border-yellow-400',
      grateful: 'border-pink-400',
      creative: 'border-purple-400',
      peaceful: 'border-green-400',
      energetic: 'border-orange-400'
    };
    return colors[emotion] || 'border-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to TrueVibe</h1>
          <p className="text-gray-400">Discover authentic emotional connections</p>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-xl p-6 border-2 ${getEmotionColor(post.emotion)}`}
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold">{post.user.name}</h3>
                  <p className="text-gray-400 text-sm">{post.user.username} • {post.timestamp}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs capitalize">
                    {post.emotion}
                  </span>
                </div>
              </div>

              {/* Content */}
              <p className="text-white text-lg mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={20} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle size={20} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                  <Share size={20} />
                  <span>{post.shares}</span>
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Bookmark size={20} />
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
          className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Sparkles size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
