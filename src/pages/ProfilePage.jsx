import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Heart, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('threads');

  const stats = [
    { label: 'Threads', value: '127', icon: MessageSquare },
    { label: 'Reactions', value: '1.2K', icon: Heart },
    { label: 'Vibes', value: '89', icon: Sparkles }
  ];

  const tabs = [
    { id: 'threads', label: 'Threads', icon: MessageSquare },
    { id: 'vibes', label: 'Vibes', icon: Sparkles },
    { id: 'activity', label: 'Activity', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-3 border-blue-500"
                />
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.user_metadata?.full_name || 'User'}
                </h1>
                <p className="text-gray-400">@{user?.user_metadata?.user_name || 'username'}</p>
                <p className="text-gray-300 mt-2">
                  Living authentically and sharing genuine emotions ✨
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-center p-4 bg-gray-700 rounded-lg"
              >
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'threads' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-8 text-center"
            >
              <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Your Threads</h3>
              <p className="text-gray-400">Start sharing your thoughts and emotions</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Your First Thread
              </button>
            </motion.div>
          )}

          {activeTab === 'vibes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-8 text-center"
            >
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Your Vibes</h3>
              <p className="text-gray-400">Start sharing your daily moods and energy</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Your First Vibe
              </button>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-8 text-center"
            >
              <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Activity Feed</h3>
              <p className="text-gray-400">Your recent interactions and engagement</p>
            </motion.div>
          )}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
};

export default ProfilePage;