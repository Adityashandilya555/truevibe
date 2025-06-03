
import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadCard from './ThreadCard';
import FeedGenerator from '../../services/feedGenerator';

const EMOTION_FILTERS = [
  'all', 'joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'
];

export default function ThreadFeed() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const [emotionFilter, setEmotionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [feedGenerator] = useState(new FeedGenerator());

  useEffect(() => {
    loadFeed();
  }, [activeTab, emotionFilter]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const demoUserId = 'demo_user_123';
      const feedItems = await feedGenerator.generateFeed(demoUserId, 20);
      
      // Filter by emotion if selected
      let filteredItems = feedItems;
      if (emotionFilter !== 'all') {
        filteredItems = feedItems.filter(item => item.emotion === emotionFilter);
      }
      
      // Filter by search query
      if (searchQuery) {
        filteredItems = filteredItems.filter(item => 
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setThreads(filteredItems);
      
      // Load user reactions from localStorage
      const reactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      setUserReactions(reactions);
    } catch (error) {
      console.error('Error loading feed:', error);
      setThreads(getDefaultThreads());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultThreads = () => [
    {
      id: 'demo_1',
      user_id: 'user_1',
      content: 'Just finished an amazing workout session! 💪 The endorphins are hitting and I feel absolutely incredible. There\'s something magical about pushing your limits and discovering you\'re stronger than you thought.',
      hashtags: ['fitness', 'motivation', 'endorphins', 'strength'],
      emotion: 'joy',
      emotion_score: 0.9,
      emotion_intensity: 1.8,
      reaction_counts: { resonate: 12, support: 8, learn: 3, challenge: 0, amplify: 5 },
      reply_count: 4,
      share_count: 2,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_profiles: {
        username: 'FitnessWarrior',
        avatar_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Determined',
        adjective_two: 'Inspiring',
        adjective_three: 'Energetic'
      }
    },
    {
      id: 'demo_2',
      user_id: 'user_2',
      content: 'Watching the sunrise this morning reminded me of how much beauty exists in simple moments. Sometimes we get so caught up in the chaos that we forget to pause and appreciate what\'s right in front of us. 🌅',
      hashtags: ['mindfulness', 'gratitude', 'sunrise', 'beauty'],
      emotion: 'trust',
      emotion_score: 0.85,
      emotion_intensity: 1.2,
      reaction_counts: { resonate: 18, support: 6, learn: 7, challenge: 1, amplify: 3 },
      reply_count: 8,
      share_count: 6,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user_profiles: {
        username: 'MindfulSoul',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616c6106d6a?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Peaceful',
        adjective_two: 'Reflective',
        adjective_three: 'Wise'
      }
    },
    {
      id: 'demo_3',
      user_id: 'user_3',
      content: 'Anyone else feeling overwhelmed by all the changes happening lately? I know growth requires discomfort, but sometimes it feels like everything is shifting at once. Just trying to stay grounded. 😰',
      hashtags: ['growth', 'change', 'overwhelm', 'mentalhealth'],
      emotion: 'fear',
      emotion_score: 0.7,
      emotion_intensity: 1.4,
      reaction_counts: { resonate: 24, support: 15, learn: 2, challenge: 0, amplify: 1 },
      reply_count: 12,
      share_count: 1,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      user_profiles: {
        username: 'GrowingDaily',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Vulnerable',
        adjective_two: 'Honest',
        adjective_three: 'Brave'
      }
    },
    {
      id: 'demo_4',
      user_id: 'user_4',
      content: 'Plot twist: my 5-year-old nephew just taught me more about problem-solving in 10 minutes than I learned in my last corporate training. Kids see solutions where adults see obstacles. 🤯',
      hashtags: ['kids', 'wisdom', 'perspective', 'learning'],
      emotion: 'surprise',
      emotion_score: 0.88,
      emotion_intensity: 1.6,
      reaction_counts: { resonate: 16, support: 4, learn: 11, challenge: 2, amplify: 7 },
      reply_count: 6,
      share_count: 9,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      user_profiles: {
        username: 'LifeLearner',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Curious',
        adjective_two: 'Open-minded',
        adjective_three: 'Thoughtful'
      }
    }
  ];

  const handleReaction = (threadId, reactionType) => {
    const currentReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
    const demoUserId = 'demo_user_123';
    
    // Initialize thread reactions if they don't exist
    if (!currentReactions[threadId]) {
      currentReactions[threadId] = {};
    }
    
    // Toggle reaction
    const previousReaction = currentReactions[threadId][demoUserId];
    if (previousReaction === reactionType) {
      delete currentReactions[threadId][demoUserId];
    } else {
      currentReactions[threadId][demoUserId] = reactionType;
    }
    
    localStorage.setItem('truevibe_user_reactions', JSON.stringify(currentReactions));
    setUserReactions(currentReactions);
    
    // Update thread counts
    setThreads(prevThreads => 
      prevThreads.map(thread => {
        if (thread.id === threadId) {
          const newCounts = { ...thread.reaction_counts };
          
          // Remove previous reaction count
          if (previousReaction && newCounts[previousReaction] > 0) {
            newCounts[previousReaction]--;
          }
          
          // Add new reaction count
          if (previousReaction !== reactionType) {
            newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
          }
          
          return { ...thread, reaction_counts: newCounts };
        }
        return thread;
      })
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadFeed();
  };

  const getUserReaction = (threadId) => {
    const demoUserId = 'demo_user_123';
    return userReactions[threadId]?.[demoUserId] || null;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 bg-gray-900/95 backdrop-blur-sm p-4 border-b border-gray-700 z-30">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics, emotions, hashtags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'trending'
                ? 'bg-cyan-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <TrendingUp size={16} />
            Trending
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'following'
                ? 'bg-cyan-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Users size={16} />
            Following
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Sparkles size={16} />
            AI Curated
          </button>
        </div>

        {/* Emotion Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {EMOTION_FILTERS.map((emotion) => (
            <button
              key={emotion}
              onClick={() => setEmotionFilter(emotion)}
              className={`
                flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize
                ${emotionFilter === emotion
                  ? 'bg-cyan-400 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {emotion === 'all' ? '🌈 All' : `${getEmotionEmoji(emotion)} ${emotion}`}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No threads found</h3>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <AnimatePresence>
            {threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ThreadCard
                  thread={thread}
                  onReact={handleReaction}
                  userReaction={getUserReaction(thread.id)}
                  onClick={() => console.log('Thread clicked:', thread.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function getEmotionEmoji(emotion) {
  const emojis = {
    joy: '😊',
    trust: '🤝',
    fear: '😰',
    surprise: '😲',
    sadness: '😢',
    disgust: '🤢',
    anger: '😡',
    anticipation: '🤗'
  };
  return emojis[emotion] || '😊';
}
