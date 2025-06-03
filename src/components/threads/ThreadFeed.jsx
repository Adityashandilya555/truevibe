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
  const [showReplyComposer, setShowReplyComposer] = useState(false);

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

  const getEmotionGradient = (emotion) => {
    const gradients = {
      joy: 'from-yellow-400 to-orange-400',
      sadness: 'from-blue-400 to-indigo-500',
      anger: 'from-red-500 to-pink-500',
      fear: 'from-purple-500 to-indigo-600',
      surprise: 'from-orange-400 to-red-400',
      disgust: 'from-green-500 to-teal-500',
      anticipation: 'from-orange-500 to-yellow-400',
      trust: 'from-cyan-400 to-blue-500',
      neutral: 'from-gray-400 to-gray-500'
    };
    return gradients[emotion] || gradients.neutral;
  };

  return (
    <motion.div
      className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 overflow-hidden`}
      style={{
        borderColor: getEmotionColor(thread.emotion),
        boxShadow: `0 8px 32px ${getEmotionColor(thread.emotion)}20`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Emotion gradient bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getEmotionGradient(thread.emotion)}`}
      />
      
      {/* Glowing border effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-20 blur-sm"
        style={{
          background: `linear-gradient(45deg, ${getEmotionColor(thread.emotion)}, transparent, ${getEmotionColor(thread.emotion)})`
        }}
      />
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowReplyComposer(!showReplyComposer)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">Reply</span>
          </button>
          
          {user && thread.user_profiles?.username === user.email?.split('@')[0] && (
            <button
              onClick={() => {/* TODO: Add edit functionality */}}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span className="text-sm">Edit</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Share size={18} className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Reaction System */}
      <ReactionSystem 
        threadId={thread.id} 
        reactions={thread.reaction_counts || {}} 
      />

      {/* Reply Composer */}
      {showReplyComposer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4"
          style={{ borderLeftColor: getEmotionColor(thread.emotion) }}
        >
          <textarea
            placeholder="Write a thoughtful reply..."
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowReplyComposer(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reply
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ThreadFeed;