import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Heart, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';
import ProfileHeader from '../components/profile/ProfileHeader';
import StoriesCarousel from '../components/profile/StoriesCarousel';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('threads');

  const profileStats = {
    threads: 24,
    reactions: 156,
    followers: 89,
    following: 67
  };

  const mockThreads = [
    {
      id: 1,
      content: "Just had the most amazing coffee this morning! ☕ Sometimes it's the little things that make your day.",
      emotion: 'joy',
      timestamp: '2h ago',
      reactions: 12,
      comments: 3
    },
    {
      id: 2,
      content: "Reflecting on this week's challenges. Growth happens outside our comfort zone, but it's not always easy.",
      emotion: 'contemplative',
      timestamp: '1d ago',
      reactions: 8,
      comments: 5
    },
    {
      id: 3,
      content: "Grateful for the support from my friends today. Human connection is everything 💙",
      emotion: 'gratitude',
      timestamp: '2d ago',
      reactions: 19,
      comments: 7
    }
  ];

  const emotionColors = {
    joy: 'bg-yellow-100 text-yellow-800',
    contemplative: 'bg-purple-100 text-purple-800',
    gratitude: 'bg-blue-100 text-blue-800',
    excitement: 'bg-orange-100 text-orange-800',
    calm: 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="pt-16 pb-20">
        <ProfileHeader />
        <StoriesCarousel />

        {/* Profile Stats */}
        <div className="bg-white mx-4 rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(profileStats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white mx-4 rounded-xl shadow-sm mb-4">
          <div className="flex border-b border-gray-200">
            {['threads', 'vibes', 'saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-center capitalize font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 space-y-4">
          {activeTab === 'threads' && (
            <div className="space-y-4">
              {mockThreads.map((thread) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${emotionColors[thread.emotion] || 'bg-gray-100 text-gray-800'}`}>
                      {thread.emotion}
                    </span>
                    <span className="text-xs text-gray-500">{thread.timestamp}</span>
                  </div>

                  <p className="text-gray-900 mb-3">{thread.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{thread.reactions}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{thread.comments}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'vibes' && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Vibes</h3>
              <p className="text-gray-600">Share your daily emotional journey</p>
              <p className="text-sm text-gray-500 mt-2">Coming in Phase 2</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Saved Content</h3>
              <p className="text-gray-600">Your bookmarked threads and vibes</p>
            </div>
          )}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
};

export default ProfilePage;