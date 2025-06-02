import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Clock, Users } from 'lucide-react';
import ReactionSystem from './ReactionSystem';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';

const ThreadFeed = () => {
  const { threads, isLoadingThreads } = useAppStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Create some demo threads if none exist
  useEffect(() => {
    if (user && threads.length === 0) {
      const demoThreads = [
        {
          id: '1',
          content: 'Just launched TrueVibe and feeling incredibly excited about connecting with authentic emotions! 🚀✨',
          emotion: 'joy',
          emotion_score: 0.8,
          hashtags: ['launch', 'excited', 'truevibe'],
          created_at: new Date(Date.now() - 10 * 60000).toISOString(),
          reaction_counts: { resonate: 5, support: 3, learn: 2, challenge: 0, amplify: 8 },
          user_profiles: {
            username: 'creator',
            adjective_one: 'Visionary',
            adjective_two: 'Passionate',
            adjective_three: 'Innovative'
          }
        },
        {
          id: '2',
          content: 'Sometimes the most profound connections happen when we share our vulnerabilities. Today I learned that asking for help is actually a sign of strength.',
          emotion: 'trust',
          emotion_score: 0.7,
          hashtags: ['vulnerability', 'strength', 'learning'],
          created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
          reaction_counts: { resonate: 12, support: 15, learn: 8, challenge: 1, amplify: 6 },
          user_profiles: {
            username: 'mindfuljourney',
            adjective_one: 'Reflective',
            adjective_two: 'Empathetic',
            adjective_three: 'Growing'
          }
        },
        {
          id: '3',
          content: 'The anticipation before a big presentation always gets me. But I\'ve learned to channel that nervous energy into excitement! 💪',
          emotion: 'anticipation',
          emotion_score: 0.6,
          hashtags: ['presentation', 'nerves', 'growth'],
          created_at: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
          reaction_counts: { resonate: 8, support: 6, learn: 4, challenge: 0, amplify: 3 },
          user_profiles: {
            username: 'publicspeaker',
            adjective_one: 'Determined',
            adjective_two: 'Brave',
            adjective_three: 'Inspiring'
          }
        }
      ];

      useAppStore.setState({ threads: demoThreads });
    }
  }, [user, threads.length]);

  if (isLoadingThreads) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'anticipation', 'trust'].map((emotion) => (
          <button
            key={emotion}
            onClick={() => setFilter(emotion)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === emotion
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </button>
        ))}
      </div>

      {/* Thread List */}
      <AnimatePresence>
        {threads.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-gray-500 dark:text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No threads yet</h3>
              <p>Be the first to share your vibe!</p>
            </div>
          </motion.div>
        ) : (
          threads
            .filter(thread => filter === 'all' || thread.emotion === filter)
            .map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
        )}
      </AnimatePresence>
    </div>
  );
};

const ThreadCard = ({ thread }) => {
  const { user } = useAuthStore();
  const [showActions, setShowActions] = useState(false);

  const timeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: '#FFD700',
      sadness: '#4682B4',
      anger: '#DC143C',
      fear: '#800080',
      surprise: '#FF6347',
      disgust: '#228B22',
      anticipation: '#FF8C00',
      trust: '#00CED1',
      neutral: '#A9A9A9'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {thread.user_profiles?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {thread.user_profiles?.username || 'Anonymous'}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{thread.user_profiles?.adjective_one}</span>
              <span>•</span>
              <span>{thread.user_profiles?.adjective_two}</span>
              <span>•</span>
              <span>{thread.user_profiles?.adjective_three}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getEmotionColor(thread.emotion) }}
            title={`Emotion: ${thread.emotion} (${Math.round(thread.emotion_score * 100)}%)`}
          />
          <span className="text-sm text-gray-500">
            <Clock size={14} className="inline mr-1" />
            {timeAgo(thread.created_at)}
          </span>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
          {thread.content}
        </p>

        {/* Hashtags */}
        {thread.hashtags && thread.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {thread.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Media */}
        {thread.media_url && (
          <div className="mt-4 rounded-lg overflow-hidden">
            {thread.media_type?.startsWith('image') ? (
              <img
                src={thread.media_url}
                alt="Thread media"
                className="w-full max-h-96 object-cover"
              />
            ) : thread.media_type?.startsWith('video') ? (
              <video
                src={thread.media_url}
                controls
                className="w-full max-h-96"
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Reaction System */}
      <ReactionSystem 
        threadId={thread.id} 
        reactions={thread.reaction_counts || {}} 
      />
    </motion.div>
  );
};

export default ThreadFeed;