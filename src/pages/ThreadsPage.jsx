
<old_str>The code will be updated to include navigation components in the ThreadsPage.
```</old_str>
<new_str>import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Heart, Share, TrendingUp, Clock, Sparkles } from 'lucide-react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';

const ThreadsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [threads] = useState([
    {
      id: 1,
      user: {
        name: 'Jordan Smith',
        username: '@jordans',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Has anyone else noticed how much more creative they become when they\'re slightly stressed? There\'s this sweet spot where pressure actually enhances my problem-solving abilities...',
      emotion: 'contemplative',
      timestamp: '1h ago',
      replies: 15,
      likes: 42,
      shares: 8,
      thread: [
        'I think it\'s because mild stress activates our fight-or-flight response',
        'Which then heightens our focus and makes us think outside the box',
        'But too much stress has the opposite effect - it narrows our thinking'
      ]
    },
    {
      id: 2,
      user: {
        name: 'Luna Martinez',
        username: '@lunam',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      content: 'Today I realized that the people who make me laugh the hardest are usually the ones going through the toughest times. There\'s something beautiful about finding joy in darkness...',
      emotion: 'reflective',
      timestamp: '3h ago',
      replies: 23,
      likes: 67,
      shares: 12,
      thread: [
        'Humor is definitely a coping mechanism',
        'Some of the funniest comedians have had the most tragic backstories',
        'It\'s like they transform pain into something that brings others joy'
      ]
    }
  ]);

  const getEmotionColor = (emotion) => {
    const colors = {
      contemplative: 'border-purple-400',
      reflective: 'border-blue-400',
      joyful: 'border-yellow-400',
      peaceful: 'border-green-400'
    };
    return colors[emotion] || 'border-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Vibe Threads</h1>
          <p className="text-gray-400">Deep conversations that matter</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { key: 'trending', label: 'Trending', icon: TrendingUp },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'foryou', label: 'For You', icon: Sparkles }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Threads */}
        <div className="space-y-6">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-xl p-6 border-2 ${getEmotionColor(thread.emotion)}`}
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={thread.user.avatar}
                  alt={thread.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold">{thread.user.name}</h3>
                  <p className="text-gray-400 text-sm">{thread.user.username} • {thread.timestamp}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs capitalize">
                    {thread.emotion}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <p className="text-white text-lg mb-4">{thread.content}</p>

              {/* Thread Preview */}
              <div className="space-y-2 mb-4 pl-4 border-l-2 border-gray-600">
                {thread.thread.map((reply, idx) => (
                  <p key={idx} className="text-gray-300 text-sm">{reply}</p>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageSquare size={20} />
                  <span>{thread.replies}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={20} />
                  <span>{thread.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                  <Share size={20} />
                  <span>{thread.shares}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Thread Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all z-50"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <BottomTabs />
    </div>
  );
};

export default ThreadsPage;</new_str>
