import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Heart, Users, Zap } from 'lucide-react';

const VibesPage = () => {
  const [activeFilter, setActiveFilter] = useState('trending');

  const vibes = [
    {
      id: 1,
      hashtag: '#MondayMotivation',
      emotion: 'joy',
      posts: 1247,
      trend: '+15%',
      description: 'Starting the week with positive energy'
    },
    {
      id: 2,
      hashtag: '#TechInnovation',
      emotion: 'anticipation',
      posts: 892,
      trend: '+32%',
      description: 'Exploring the future of technology'
    },
    {
      id: 3,
      hashtag: '#MindfulMoments',
      emotion: 'trust',
      posts: 654,
      trend: '+8%',
      description: 'Finding peace in everyday life'
    },
    {
      id: 4,
      hashtag: '#CreativeJourney',
      emotion: 'joy',
      posts: 543,
      trend: '+22%',
      description: 'Sharing artistic expressions and inspiration'
    },
    {
      id: 5,
      hashtag: '#EmotionalWellness',
      emotion: 'trust',
      posts: 432,
      trend: '+12%',
      description: 'Supporting mental health awareness'
    }
  ];

  const emotionColors = {
    joy: '#FFD700',
    anticipation: '#FFA500',
    trust: '#4169E1',
    fear: '#800080',
    surprise: '#FF69B4',
    sadness: '#4682B4',
    disgust: '#228B22',
    anger: '#FF4500'
  };

  const filters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'popular', label: 'Popular', icon: Heart },
    { id: 'community', label: 'Community', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <h1 className="text-xl font-bold text-cyan-400 mb-4">✨ Vibes</h1>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotion Overview */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-xl p-6 mb-6 border border-purple-500/30">
          <h2 className="text-lg font-semibold mb-3">Today's Emotional Landscape</h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(emotionColors).slice(0, 4).map(([emotion, color]) => (
              <div key={emotion} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
                >
                  <span style={{ color }}>●</span>
                </div>
                <p className="text-xs text-gray-400 capitalize">{emotion}</p>
                <p className="text-sm font-semibold">{Math.floor(Math.random() * 100)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Vibes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Trending Vibes</h2>

          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-cyan-400">#{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-cyan-400">{vibe.hashtag}</h3>
                    <p className="text-sm text-gray-400">{vibe.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{vibe.posts.toLocaleString()} posts</p>
                  <p className="text-xs text-green-400">{vibe.trend}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: emotionColors[vibe.emotion] }}
                  ></div>
                  <span className="text-sm text-gray-400 capitalize">{vibe.emotion}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Hot
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Discover Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Discover New Vibes</h2>
          <div className="grid grid-cols-2 gap-3">
            {['#WeekendVibes', '#TechTalk', '#ArtisticFlow', '#MindfulMonday'].map((tag, index) => (
              <div 
                key={tag}
                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-4 text-center hover:from-gray-700 hover:to-gray-600 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-cyan-400">{tag}</p>
                <p className="text-xs text-gray-400 mt-1">{Math.floor(Math.random() * 500)} posts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibesPage;