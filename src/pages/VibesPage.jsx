
<old_str></old_str>
<new_str>import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';

const VibesPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [vibes] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Kim',
        username: '@alexk',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
      },
      mood: 'energetic',
      color: '#FF6B6B',
      description: 'Feeling pumped and ready to conquer the world! 💪',
      timestamp: '30m ago',
      reactions: 23
    },
    {
      id: 2,
      user: {
        name: 'Maya Patel',
        username: '@mayap',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
      },
      mood: 'serene',
      color: '#4ECDC4',
      description: 'Finding peace in the small moments today 🌿',
      timestamp: '1h ago',
      reactions: 31
    },
    {
      id: 3,
      user: {
        name: 'David Chen',
        username: '@davidc',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      mood: 'creative',
      color: '#9B59B6',
      description: 'Ideas are flowing like a river today! ✨',
      timestamp: '2h ago',
      reactions: 18
    }
  ]);

  const moodOptions = [
    { name: 'energetic', color: '#FF6B6B', icon: '⚡' },
    { name: 'serene', color: '#4ECDC4', icon: '🌸' },
    { name: 'creative', color: '#9B59B6', icon: '🎨' },
    { name: 'grateful', color: '#F39C12', icon: '🙏' },
    { name: 'adventurous', color: '#E74C3C', icon: '🚀' },
    { name: 'contemplative', color: '#3498DB', icon: '🤔' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Daily Vibes</h1>
          <p className="text-gray-400">Share your mood and energy with the world</p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            How are you feeling today?
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMood?.name === mood.name
                    ? 'border-white scale-105'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: mood.color + '20' }}
              >
                <div className="text-2xl mb-2">{mood.icon}</div>
                <p className="text-white text-sm capitalize">{mood.name}</p>
              </button>
            ))}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg border border-gray-600"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedMood.color }}
                />
                <span className="text-white font-medium capitalize">
                  {selectedMood.name}
                </span>
              </div>
              <textarea
                placeholder="Share what's making you feel this way..."
                className="w-full bg-gray-700 text-white rounded-lg p-3 resize-none"
                rows={3}
              />
              <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Share Vibe
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Vibes Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Community Vibes</h2>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                <TrendingUp size={16} />
                <span className="text-sm">Trending</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                <Calendar size={16} />
                <span className="text-sm">Today</span>
              </button>
            </div>
          </div>

          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={vibe.user.avatar}
                  alt={vibe.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{vibe.user.name}</h3>
                  <p className="text-gray-400 text-sm">{vibe.user.username} • {vibe.timestamp}</p>
                </div>
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: vibe.color }}
                />
              </div>

              {/* Mood Display */}
              <div className="mb-4">
                <div 
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: vibe.color }}
                >
                  <span className="capitalize">{vibe.mood}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white mb-4">{vibe.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={18} />
                  <span>{vibe.reactions}</span>
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  style={{ color: vibe.color }}
                >
                  Share this vibe
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Vibe Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all z-50"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <BottomTabs />
    </div>
  );
};

export default VibesPage;</new_str>
