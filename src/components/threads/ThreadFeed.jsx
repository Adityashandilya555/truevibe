import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import ReactionSystem from './ReactionSystem';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';

/**
 * ThreadFeed Component
 * 
 * Displays a feed of threads with emotion-aware styling and reactions
 */
const ThreadFeed = () => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          user_profiles(name, avatar_url, adjective_one, adjective_two, adjective_three),
          reactions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: '#FFD700',
      trust: '#4169E1',
      fear: '#9400D3',
      surprise: '#FF8C00',
      sadness: '#0000FF',
      disgust: '#228B22',
      anger: '#FF0000',
      anticipation: '#FFA500'
    };
    return emotionColors[emotion?.toLowerCase()] || '#4dd0e1';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMins}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No threads yet</h3>
        <p className="text-gray-500">Be the first to share something meaningful!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread, index) => (
        <motion.article
          key={thread.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-xl p-6 border-l-4"
          style={{
            borderLeftColor: getEmotionColor(thread.detected_emotion)
          }}
        >
          {/* Thread Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                {thread.user_profiles?.avatar_url ? (
                  <img
                    src={thread.user_profiles.avatar_url}
                    alt={thread.user_profiles.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm">
                    {thread.user_profiles?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-medium text-white">
                  {thread.user_profiles?.name || 'Anonymous'}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{formatTime(thread.created_at)}</span>
                  {thread.detected_emotion && (
                    <>
                      <span>•</span>
                      <span className="capitalize" style={{ color: getEmotionColor(thread.detected_emotion) }}>
                        {thread.detected_emotion}
                      </span>
                      {thread.emotion_confidence && (
                        <span>({Math.round(thread.emotion_confidence * 100)}%)</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Thread Content */}
          <div className="mb-4">
            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>

            {/* Display hashtags */}
            {thread.hashtags && thread.hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {thread.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-cyan-400 hover:text-cyan-300 cursor-pointer text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thread Image */}
          {thread.image_url && (
            <div className="mb-4">
              <img
                src={thread.image_url}
                alt="Thread attachment"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {/* Reaction System */}
          <ReactionSystem 
            threadId={thread.id}
            reactions={thread.reactions || []}
            currentUserId={user?.id}
          />
        </motion.article>
      ))}
    </div>
  );
};

export default ThreadFeed;