import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadComposer from '../components/threads/ThreadComposer';
import useAuthStore from '../store/authStore';
import useAppStore from '../store/appStore';
import { supabase } from '../services/supabase';
import { Loader2, RefreshCw, Filter, MessageCircle, Heart, AlertCircle } from 'lucide-react';

/**
 * Error Boundary component for catching errors in child components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Threads page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 my-4">
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p className="text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md text-red-800 dark:text-red-100 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Emotion filter options based on Plutchik's wheel
const EMOTION_FILTERS = [
  { id: 'all', label: 'All', color: 'bg-gray-200 dark:bg-gray-700' },
  { id: 'joy', label: 'Joy', color: 'bg-yellow-400' },
  { id: 'trust', label: 'Trust', color: 'bg-green-400' },
  { id: 'fear', label: 'Fear', color: 'bg-emerald-700' },
  { id: 'surprise', label: 'Surprise', color: 'bg-sky-400' },
  { id: 'sadness', label: 'Sadness', color: 'bg-blue-500' },
  { id: 'disgust', label: 'Disgust', color: 'bg-purple-500' },
  { id: 'anger', label: 'Anger', color: 'bg-red-500' },
  { id: 'anticipation', label: 'Anticipation', color: 'bg-orange-500' }
];

// Thread component to display individual threads
const Thread = ({ thread, onReaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  
  // Get emotion border color
  const getEmotionBorder = (emotion) => {
    switch (emotion) {
      case 'joy': return 'border-yellow-400';
      case 'trust': return 'border-green-400';
      case 'fear': return 'border-emerald-700';
      case 'surprise': return 'border-sky-400';
      case 'sadness': return 'border-blue-500';
      case 'disgust': return 'border-purple-500';
      case 'anger': return 'border-red-500';
      case 'anticipation': return 'border-orange-500';
      default: return 'border-gray-300 dark:border-gray-700';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Handle reaction click
  const handleReaction = async (reactionType) => {
    if (reactionLoading) return;
    
    setReactionLoading(true);
    await onReaction(thread.id, reactionType);
    setReactionLoading(false);
  };
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border-l-4 ${getEmotionBorder(thread.emotion)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        {/* User avatar */}
        <img 
          src={thread.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${thread.user_profiles?.username || 'User'}&background=random`} 
          alt={thread.user_profiles?.username || 'User'}
          className="w-10 h-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700"
        />
        
        <div className="flex-1">
          {/* Username and date */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {thread.user_profiles?.username || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(thread.created_at)}
            </span>
          </div>
          
          {/* Thread content */}
          <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line">
            {thread.content}
          </p>
          
          {/* Media attachment if any */}
          {thread.media_url && (
            <div className="mb-3 rounded-lg overflow-hidden">
              {thread.media_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img 
                  src={thread.media_url} 
                  alt="Attached media" 
                  className="max-h-96 w-auto rounded-lg"
                />
              ) : thread.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video 
                  src={thread.media_url} 
                  controls 
                  className="max-h-96 w-full rounded-lg"
                />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Attached file: {thread.media_url.split('/').pop()}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Hashtags */}
          {thread.hashtags && thread.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {thread.hashtags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-blue-500 dark:text-blue-400 text-sm hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Five-reaction system */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => handleReaction('resonate')}
              className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center"
              disabled={reactionLoading}
            >
              <span className="mr-1">🔊</span>
              Resonate
              {thread.reactions?.find(r => r.reaction_type === 'resonate')?.count > 0 && (
                <span className="ml-1 font-medium">{thread.reactions.find(r => r.reaction_type === 'resonate').count}</span>
              )}
            </button>
            
            <button
              onClick={() => handleReaction('support')}
              className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center"
              disabled={reactionLoading}
            >
              <span className="mr-1">🤝</span>
              Support
              {thread.reactions?.find(r => r.reaction_type === 'support')?.count > 0 && (
                <span className="ml-1 font-medium">{thread.reactions.find(r => r.reaction_type === 'support').count}</span>
              )}
            </button>
            
            <button
              onClick={() => handleReaction('learn')}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center"
              disabled={reactionLoading}
            >
              <span className="mr-1">🧠</span>
              Learn
              {thread.reactions?.find(r => r.reaction_type === 'learn')?.count > 0 && (
                <span className="ml-1 font-medium">{thread.reactions.find(r => r.reaction_type === 'learn').count}</span>
              )}
            </button>
            
            <button
              onClick={() => handleReaction('challenge')}
              className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center"
              disabled={reactionLoading}
            >
              <span className="mr-1">🤔</span>
              Challenge
              {thread.reactions?.find(r => r.reaction_type === 'challenge')?.count > 0 && (
                <span className="ml-1 font-medium">{thread.reactions.find(r => r.reaction_type === 'challenge').count}</span>
              )}
            </button>
            
            <button
              onClick={() => handleReaction('amplify')}
              className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center"
              disabled={reactionLoading}
            >
              <span className="mr-1">📢</span>
              Amplify
              {thread.reactions?.find(r => r.reaction_type === 'amplify')?.count > 0 && (
                <span className="ml-1 font-medium">{thread.reactions.find(r => r.reaction_type === 'amplify').count}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * ThreadsPage Component
 * 
 * Main page for viewing and creating threads with emotion filtering
 * and real-time updates using Supabase subscriptions
 */
const ThreadsPage = () => {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Fetch threads with optional emotion filter
  const fetchThreads = useCallback(async (reset = false, emotionFilter = activeFilter) => {
    if (reset) {
      setIsRefreshing(true);
      setPage(0);
    } else if (page > 0) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Build query
      let query = supabase
        .from('threads')
        .select(`
          *,
          user_profiles:user_id(username, avatar_url),
          reactions(reaction_type, count)
        `)
        .order('created_at', { ascending: false });
      
      // Apply emotion filter if not 'all'
      if (emotionFilter !== 'all') {
        query = query.eq('emotion', emotionFilter);
      }
      
      // Apply pagination
      const limit = 10;
      const from = reset ? 0 : page * limit;
      const to = from + limit - 1;
      
      query = query.range(from, to);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Update threads state
      if (reset || page === 0) {
        setThreads(data || []);
      } else {
        setThreads(prev => [...prev, ...(data || [])]);
      }
      
      // Check if there are more threads to load
      setHasMore(data?.length === limit);
      
      // Increment page for next load
      if (!reset) {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [page, activeFilter]);
  
  // Handle reaction to a thread
  const handleReaction = async (threadId, reactionType) => {
    try {
      // First check if user has already reacted with this type
      const { data: existingReaction, error: checkError } = await supabase
        .from('reactions')
        .select('id')
        .eq('thread_id', threadId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }
      
      if (existingReaction) {
        // User already reacted, so remove the reaction
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
      } else {
        // Add new reaction
        const { error: insertError } = await supabase
          .from('reactions')
          .insert({
            thread_id: threadId,
            user_id: user.id,
            reaction_type: reactionType
          });
          
        if (insertError) throw insertError;
      }
      
      // Update thread in state with new reaction count
      // This will be handled by the real-time subscription
    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchThreads(true, filter);
  };
  
  // Load more threads
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchThreads(false);
    }
  };
  
  // Refresh threads
  const refreshThreads = () => {
    fetchThreads(true);
  };
  
  // Set up real-time subscription for new threads and reactions
  useEffect(() => {
    // Initial fetch
    fetchThreads(true);
    
    // Subscribe to thread changes
    const threadsSubscription = supabase
      .channel('public:threads')
      .on('INSERT', (payload) => {
        // Add new thread to the top of the list if it matches the current filter
        const newThread = payload.new;
        if (activeFilter === 'all' || newThread.emotion === activeFilter) {
          setThreads(prev => [newThread, ...prev]);
        }
      })
      .on('UPDATE', (payload) => {
        // Update thread in the list
        const updatedThread = payload.new;
        setThreads(prev => 
          prev.map(thread => 
            thread.id === updatedThread.id ? { ...thread, ...updatedThread } : thread
          )
        );
      })
      .subscribe();
    
    // Subscribe to reaction changes
    const reactionsSubscription = supabase
      .channel('public:reactions')
      .on('*', () => {
        // Refresh thread reactions
        // This is a simplified approach - in a production app you might
        // want to update just the affected thread
        fetchThreads(true);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(threadsSubscription);
      supabase.removeChannel(reactionsSubscription);
    };
  }, [fetchThreads]);
  
  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-4 px-4 sm:px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <ErrorBoundary>
        <ThreadComposer onThreadCreated={refreshThreads} />
      </ErrorBoundary>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Threads</h2>
          
          <button
            onClick={refreshThreads}
            disabled={isRefreshing}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
            aria-label="Refresh threads"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        
        {/* Emotion filters */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {EMOTION_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center ${activeFilter === filter.id ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                style={{
                  backgroundColor: activeFilter === filter.id ? 
                    'var(--tw-ring-color)' : 
                    filter.color.startsWith('bg-') ? '' : filter.color,
                  color: activeFilter === filter.id ? 'white' : ''
                }}
                aria-pressed={activeFilter === filter.id}
                aria-label={`Filter by ${filter.label}`}
              >
                <Filter size={12} className="mr-1" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4 flex items-start">
            <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error loading threads</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={refreshThreads}
                className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        
        {/* Threads list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={24} className="animate-spin text-gray-500 dark:text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading threads...</span>
          </div>
        ) : threads.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
              No threads found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeFilter === 'all' ? 
                'Be the first to start a conversation!' : 
                `No threads with the emotion "${activeFilter}" yet.`}
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => handleFilterChange('all')}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Show all threads
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {threads.map(thread => (
                <Thread 
                  key={thread.id} 
                  thread={thread} 
                  onReaction={handleReaction} 
                />
              ))}
            </AnimatePresence>
            
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 transition-colors flex items-center"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ThreadsPage;
