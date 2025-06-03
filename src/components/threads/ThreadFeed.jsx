import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreadCard from './ThreadCard';
import LoadingScreen from '../common/LoadingScreen';
import { Sparkles, TrendingUp, Clock, Filter } from 'lucide-react';

const ThreadFeed = ({ filter = 'trending' }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filter);

  // Sample thread data for demo
  const sampleThreads = [
    {
      id: 'thread-1',
      content: "Just finished working on an exciting new project! The combination of creativity and technical challenges always energizes me. 🚀",
      emotion: 'joy',
      emotion_score: 0.85,
      hashtags: ['coding', 'creativity', 'motivation'],
      user_profiles: {
        username: 'creativecoder',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Creative',
        adjective_two: 'Passionate',
        adjective_three: 'Innovative'
      },
      reaction_counts: {
        resonate: 12,
        support: 8,
        learn: 5,
        challenge: 2,
        amplify: 15
      },
      reply_count: 7,
      share_count: 3,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'thread-2',
      content: "Sometimes I wonder if we're moving too fast in this digital age. There's beauty in slowing down and truly connecting with people around us.",
      emotion: 'contemplation',
      emotion_score: 0.72,
      hashtags: ['mindfulness', 'connection', 'reflection'],
      user_profiles: {
        username: 'mindfultech',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Thoughtful',
        adjective_two: 'Empathetic',
        adjective_three: 'Wise'
      },
      reaction_counts: {
        resonate: 28,
        support: 15,
        learn: 12,
        challenge: 6,
        amplify: 9
      },
      reply_count: 18,
      share_count: 8,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'thread-3',
      content: "Learning a new language is like discovering a whole new way to think! Every word carries cultural nuances that reshape how I see the world.",
      emotion: 'curiosity',
      emotion_score: 0.91,
      hashtags: ['learning', 'language', 'culture', 'growth'],
      user_profiles: {
        username: 'polyglotjourney',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Curious',
        adjective_two: 'Adventurous',
        adjective_three: 'Dedicated'
      },
      reaction_counts: {
        resonate: 24,
        support: 11,
        learn: 31,
        challenge: 3,
        amplify: 18
      },
      reply_count: 13,
      share_count: 12,
      created_at: new Date(Date.now() - 10800000).toISOString()
    },
    {
      id: 'thread-4',
      content: "Climate change affects us all, but we can make a difference through small daily choices. Every action counts when we act together! 🌱",
      emotion: 'determination',
      emotion_score: 0.78,
      hashtags: ['climate', 'sustainability', 'action', 'hope'],
      user_profiles: {
        username: 'ecofuture',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        adjective_one: 'Passionate',
        adjective_two: 'Determined',
        adjective_three: 'Hopeful'
      },
      reaction_counts: {
        resonate: 45,
        support: 38,
        learn: 22,
        challenge: 8,
        amplify: 52
      },
      reply_count: 29,
      share_count: 35,
      created_at: new Date(Date.now() - 14400000).toISOString()
    }
  ];

  useEffect(() => {
    fetchThreads();
  }, [selectedFilter]);

  const fetchThreads = async () => {
    try {
      setLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        // Filter threads based on selected filter
        let filteredThreads = [...sampleThreads];

        if (selectedFilter === 'recent') {
          filteredThreads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (selectedFilter === 'trending') {
          filteredThreads.sort((a, b) => {
            const aEngagement = Object.values(a.reaction_counts).reduce((sum, count) => sum + count, 0);
            const bEngagement = Object.values(b.reaction_counts).reduce((sum, count) => sum + count, 0);
            return bEngagement - aEngagement;
          });
        } else if (selectedFilter === 'foryou') {
          // Simulate personalized feed
          filteredThreads = filteredThreads.filter(thread => 
            ['joy', 'curiosity', 'determination'].includes(thread.emotion)
          );
        }

        setThreads(filteredThreads);
        setLoading(false);
      }, 800);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleReaction = async (threadId, reactionType) => {
    try {
      // Update local state optimistically
      setThreads(prevThreads => 
        prevThreads.map(thread => {
          if (thread.id === threadId) {
            return {
              ...thread,
              reaction_counts: {
                ...thread.reaction_counts,
                [reactionType]: (thread.reaction_counts[reactionType] || 0) + 1
              }
            };
          }
          return thread;
        })
      );

      console.log('React to thread:', threadId, reactionType);
      // TODO: Implement actual API call
    } catch (error) {
      console.error('Error reacting to thread:', error);
    }
  };

  const handleReply = (thread) => {
    console.log('Reply to thread:', thread.id);
    // TODO: Open reply composer
  };

  const handleShare = (thread) => {
    console.log('Share thread:', thread.id);
    // TODO: Implement sharing functionality
  };

  if (loading) return <LoadingScreen />;
  if (error) return (
    <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg border border-red-800">
      <p>Error: {error}</p>
      <button 
        onClick={fetchThreads}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
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
      {threads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-400 py-12"
        >
          <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No threads yet</h3>
          <p>Be the first to share your vibe!</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThreadCard
                thread={thread}
                onReaction={handleReaction}
                onReply={handleReply}
                onShare={handleShare}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadFeed;