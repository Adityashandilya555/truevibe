
<old_str></old_str>
<new_str>import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Heart, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  const userStats = {
    posts: 45,
    followers: 128,
    following: 89,
    vibes: 32
  };

  const userPosts = [
    {
      id: 1,
      content: 'Just had the most amazing sunset walk. Sometimes nature is the best therapy 🌅',
      emotion: 'peaceful',
      timestamp: '2d ago',
      likes: 23,
      comments: 8
    },
    {
      id: 2,
      content: 'Excited to start this new chapter in my life! Change can be scary but also incredibly liberating ✨',
      emotion: 'excited',
      timestamp: '4d ago',
      likes: 45,
      comments: 12
    },
    {
      id: 3,
      content: 'Been reflecting on gratitude today. There\'s so much beauty in the simple moments we often overlook.',
      emotion: 'contemplative',
      timestamp: '1w ago',
      likes: 31,
      comments: 7
    }
  ];

  const getEmotionColor = (emotion) => {
    const colors = {
      peaceful: 'text-green-400',
      excited: 'text-orange-400',
      contemplative: 'text-purple-400',
      joyful: 'text-yellow-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

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
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                <Edit3 size={12} />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-gray-400">@{user?.email?.split('@')[0] || 'user'}</p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 mt-2">
                Sharing authentic emotions and connecting through real experiences 💫
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{userStats.posts}</p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">{userStats.followers}</p>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">{userStats.following}</p>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">{userStats.vibes}</p>
              <p className="text-gray-400 text-sm">Vibes</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-6"
        >
          {[
            { key: 'posts', label: 'Posts', icon: MessageSquare },
            { key: 'vibes', label: 'Vibes', icon: Sparkles },
            { key: 'activity', label: 'Activity', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'posts' && (
            <>
              {userPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="bg-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium capitalize ${getEmotionColor(post.emotion)}`}>
                      {post.emotion}
                    </span>
                    <span className="text-gray-400 text-sm">{post.timestamp}</span>
                  </div>
                  
                  <p className="text-white mb-4">{post.content}</p>
                  
                  <div className="flex items-center space-x-6 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Heart size={16} />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={16} />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
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

export default ProfilePage;</new_str>
