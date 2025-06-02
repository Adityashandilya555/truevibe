import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';
import ThreadComposer from '../components/threads/ThreadComposer';
import useEmotion from '../hooks/useEmotion';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import ThreadFeed from '../components/threads/ThreadFeed';

const ThreadsPage = () => {
  const { user } = useAuthStore();
  const { getColorForEmotion } = useEmotion();
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const emotions = [
    { key: 'all', label: 'All', icon: '🌈' },
    { key: 'joy', label: 'Joy', icon: '😊' },
    { key: 'trust', label: 'Trust', icon: '🤝' },
    { key: 'fear', label: 'Fear', icon: '😨' },
    { key: 'surprise', label: 'Surprise', icon: '😲' },
    { key: 'sadness', label: 'Sadness', icon: '😢' },
    { key: 'disgust', label: 'Disgust', icon: '🤢' },
    { key: 'anger', label: 'Anger', icon: '😡' },
    { key: 'anticipation', label: 'Anticipation', icon: '🎯' }
  ];

  const fetchThreads = async () => {
    try {
      setIsRefreshing(true);
      let query = supabase
        .from('threads')
        .select(`
          *,
          user_profiles (
            username,
            avatar_url,
            adjectives
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (selectedEmotion !== 'all') {
        query = query.eq('emotion', selectedEmotion);
      }

      const { data, error } = await query;

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [selectedEmotion]);

  const filteredThreads = threads.filter(thread =>
    thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (thread.hashtags && thread.hashtags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const handleRefresh = () => {
    fetchThreads();
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Emotion Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="text-gray-400 flex-shrink-0" size={16} />
          {emotions.map((emotion) => (
            <button
              key={emotion.key}
              onClick={() => setSelectedEmotion(emotion.key)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedEmotion === emotion.key
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{emotion.icon}</span>
              <span>{emotion.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`${isRefreshing ? 'animate-spin' : ''}`} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Thread Composer */}
      <div className="p-4">
        <ThreadComposer />
        <div className="mt-8">
          <ThreadFeed />
        </div>
      </div>

      {/* Threads List */}
      <div className="px-4 space-y-4">
        <AnimatePresence>
          {filteredThreads.length === 0 ? (
            <motion.div
              className="text-center py-12 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg">No threads found</p>
              <p className="text-sm">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Be the first to share your vibe!'}
              </p>
            </motion.div>
          ) : (
            filteredThreads.map((thread, index) => (
              <motion.div
                key={thread.id}
                className="bg-gray-800 rounded-lg p-4 border-l-4"
                style={{ borderLeftColor: getColorForEmotion(thread.emotion) }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-gray-900 font-semibold">
                    {thread.user_profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">
                      {thread.user_profiles?.username || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(thread.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getColorForEmotion(thread.emotion) }}
                    />
                    <span className="text-xs text-gray-400 capitalize">
                      {thread.emotion}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-100 mb-3 whitespace-pre-wrap">
                  {thread.content}
                </p>

                {/* Media */}
                {thread.media_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    {thread.media_type === 'image' ? (
                      <img 
                        src={thread.media_url} 
                        alt="Thread media"
                        className="w-full max-h-64 object-cover"
                      />
                    ) : thread.media_type === 'video' ? (
                      <video 
                        src={thread.media_url} 
                        controls
                        className="w-full max-h-64 object-cover"
                      />
                    ) : null}
                  </div>
                )}

                {/* Hashtags */}
                {thread.hashtags && thread.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {thread.hashtags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-1 bg-gray-700 rounded-full text-cyan-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Placeholder for reactions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>🤝 Resonate</span>
                    <span>👍 Support</span>
                    <span>🧠 Learn</span>
                    <span>⚡ Challenge</span>
                    <span>📢 Amplify</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThreadsPage;