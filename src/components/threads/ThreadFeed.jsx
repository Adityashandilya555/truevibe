
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import ReactionSystem from './ReactionSystem';
import { formatDistanceToNow } from 'date-fns';

const EMOTION_COLORS = {
  joy: '#FFD700',
  trust: '#4169E1',
  fear: '#800080',
  surprise: '#FFA500',
  sadness: '#4682B4',
  disgust: '#228B22',
  anger: '#DC143C',
  anticipation: '#FF69B4'
};

const ThreadFeed = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    fetchThreads();
    subscribeToThreads();
  }, [activeTab]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('threads')
        .select(`
          *,
          user_profiles!threads_user_id_fkey (
            username,
            avatar_url,
            adjectives
          ),
          reactions (
            type,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      // Add filtering logic based on active tab
      if (activeTab === 'following') {
        // TODO: Implement following logic when user relationships are added
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Process reaction counts
      const processedThreads = data.map(thread => {
        const reactionCounts = {};
        thread.reactions.forEach(reaction => {
          reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
        });
        
        return {
          ...thread,
          reactionCounts
        };
      });

      setThreads(processedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToThreads = () => {
    const subscription = supabase
      .channel('threads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'threads'
      }, () => {
        fetchThreads();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const renderHashtags = (content) => {
    return content.replace(/#(\w+)/g, '<span class="text-cyan-400 hover:text-cyan-300 cursor-pointer">#$1</span>');
  };

  const ThreadCard = ({ thread }) => {
    const emotionColor = EMOTION_COLORS[thread.emotion?.toLowerCase()] || '#6B7280';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border-l-4"
        style={{ borderLeftColor: emotionColor }}
      >
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {thread.user_profiles?.avatar_url ? (
              <img 
                src={thread.user_profiles.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-cyan-500 text-white font-semibold">
                {thread.user_profiles?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {thread.user_profiles?.username || 'Anonymous'}
              </h3>
              {thread.user_profiles?.adjectives && (
                <div className="flex space-x-1">
                  {thread.user_profiles.adjectives.slice(0, 2).map((adj, idx) => (
                    <span key={idx} className="text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-0.5 rounded-full">
                      {adj}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Thread Content */}
        <div className="mb-3">
          <p 
            className="text-gray-900 dark:text-white mb-2"
            dangerouslySetInnerHTML={{ __html: renderHashtags(thread.content) }}
          />
          
          {thread.image_url && (
            <img 
              src={thread.image_url} 
              alt="Thread attachment" 
              className="rounded-lg max-w-full h-auto"
            />
          )}
        </div>

        {/* Emotion Badge */}
        {thread.emotion && (
          <div className="mb-3">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: emotionColor }}
            >
              {thread.emotion} {thread.confidence && `${Math.round(thread.confidence * 100)}%`}
            </span>
          </div>
        )}

        {/* Reaction System */}
        <ReactionSystem threadId={thread.id} initialReactions={thread.reactionCounts} />
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'trending'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'following'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Following
        </button>
      </div>

      {/* Thread List */}
      <div>
        {threads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No threads yet. Be the first to share!</p>
          </div>
        ) : (
          threads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadFeed;
