import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreadComposer from '../components/threads/ThreadComposer';
import ThreadFeed from '../components/threads/ThreadFeed';
import { supabase } from '../services/supabase';
import useAuth from '../hooks/useAuth';

const ThreadsPage = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const emotionFilters = [
    { key: 'all', label: 'All', color: 'bg-gray-600' },
    { key: 'joy', label: 'Joy', color: 'bg-yellow-500' },
    { key: 'trust', label: 'Trust', color: 'bg-blue-500' },
    { key: 'fear', label: 'Fear', color: 'bg-purple-500' },
    { key: 'surprise', label: 'Surprise', color: 'bg-orange-500' },
    { key: 'sadness', label: 'Sadness', color: 'bg-indigo-500' },
    { key: 'disgust', label: 'Disgust', color: 'bg-green-500' },
    { key: 'anger', label: 'Anger', color: 'bg-red-500' },
    { key: 'anticipation', label: 'Anticipation', color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetchThreads();

    // Subscribe to real-time thread updates
    const subscription = supabase
      .channel('threads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'threads'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setThreads(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setThreads(prev => prev.map(thread => 
            thread.id === payload.new.id ? payload.new : thread
          ));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeFilter]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('threads')
        .select(`
          *,
          user_profiles:user_id (
            name,
            avatar_url,
            adjective_one,
            adjective_two,
            adjective_three
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (activeFilter !== 'all') {
        query = query.eq('emotion', activeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewThread = (newThread) => {
    setThreads(prev => [newThread, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Thread Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ThreadComposer onThreadCreated={handleNewThread} />
        </motion.div>

        {/* Emotion Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {emotionFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? `${filter.color} text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Thread Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ThreadFeed threads={threads} loading={loading} />
        </motion.div>

        {/* Empty State */}
        {!loading && threads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {activeFilter === 'all' ? 'No threads yet' : `No ${activeFilter} threads`}
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'all' 
                ? 'Be the first to share your thoughts!'
                : `Try switching to "All" or create a ${activeFilter} thread`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ThreadsPage;