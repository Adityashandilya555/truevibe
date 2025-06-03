
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Heart, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('threads');

  const profileData = {
    name: "Alex Chen",
    username: "@alexchen",
    bio: "Digital creator passionate about authentic connections 🌟",
    followers: 1234,
    following: 567,
    threads: 89,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  const emotions = [
    { name: 'Joy', color: 'bg-yellow-400', percentage: 45 },
    { name: 'Trust', color: 'bg-green-400', percentage: 30 },
    { name: 'Anticipation', color: 'bg-orange-400', percentage: 15 },
    { name: 'Surprise', color: 'bg-cyan-400', percentage: 10 }
  ];

  const mockThreads = [
    {
      id: 1,
      content: "Just discovered this amazing coffee shop downtown! The atmosphere is perfect for deep conversations ☕️",
      timestamp: "2h ago",
      reactions: { joy: 12, trust: 8, anticipation: 3 },
      emotion: "joy"
    },
    {
      id: 2,
      content: "Reflecting on the importance of genuine human connections in our digital age...",
      timestamp: "1d ago",
      reactions: { trust: 15, anticipation: 6, joy: 4 },
      emotion: "trust"
    }
  ];

  const mockStories = [
    { id: 1, preview: "🌅", emotion: "joy" },
    { id: 2, preview: "📚", emotion: "trust" },
    { id: 3, preview: "🎨", emotion: "anticipation" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <TopBar />
      
      <div className="pt-16 pb-20 px-4 max-w-lg mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img 
                src={profileData.avatar} 
                alt={profileData.name}
                className="w-20 h-20 rounded-full border-4 border-indigo-100"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.username}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Edit3 size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{profileData.bio}</p>
          
          <div className="flex justify-around text-center border-t pt-4">
            <div>
              <div className="font-bold text-lg">{profileData.threads}</div>
              <div className="text-gray-600 text-sm">Threads</div>
            </div>
            <div>
              <div className="font-bold text-lg">{profileData.followers}</div>
              <div className="text-gray-600 text-sm">Followers</div>
            </div>
            <div>
              <div className="font-bold text-lg">{profileData.following}</div>
              <div className="text-gray-600 text-sm">Following</div>
            </div>
          </div>
        </motion.div>

        {/* Emotion Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Sparkles className="mr-2 text-indigo-600" size={20} />
            Emotion Profile
          </h2>
          <div className="space-y-3">
            {emotions.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${emotion.color}`}></div>
                  <span className="text-gray-700">{emotion.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${emotion.color}`}
                      style={{ width: `${emotion.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{emotion.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Stories</h2>
          <div className="flex space-x-3 overflow-x-auto">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl border-2 border-dashed border-gray-300">
              +
            </div>
            {mockStories.map(story => (
              <div key={story.id} className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl border-2 border-white shadow-lg">
                {story.preview}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('threads')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'threads' 
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Threads
            </button>
            <button 
              onClick={() => setActiveTab('vibes')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'vibes' 
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Vibes
            </button>
          </div>
          
          <div className="p-4">
            {activeTab === 'threads' && (
              <div className="space-y-4">
                {mockThreads.map(thread => (
                  <div key={thread.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <p className="text-gray-800 mb-2">{thread.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{thread.timestamp}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {Object.values(thread.reactions).reduce((a, b) => a + b, 0)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          2
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'vibes' && (
              <div className="text-center py-8">
                <Sparkles className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No vibes shared yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <BottomTabs />
    </div>
  );
}
