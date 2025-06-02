import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';
import useAppStore from '../store/appStore';
import useAuth from './useAuth';
import useEmotion from './useEmotion';

/**
 * Custom hook for thread management
 * Provides thread creation, fetching, and real-time subscription capabilities
 * 
 * @returns {Object} Thread management state and methods
 */
const useThread = () => {
  // Get auth state
  const { user, isAuthenticated } = useAuth();
  
  // Get emotion analysis
  const { analyzeText } = useEmotion();
  
  // Get thread-related state from appStore
  const threads = useAppStore(state => state.threads);
  const isLoadingThreads = useAppStore(state => state.isLoadingThreads);
  const isSubmittingReaction = useAppStore(state => state.isSubmittingReaction);
  const error = useAppStore(state => state.error);
  const trendingHashtags = useAppStore(state => state.trendingHashtags);
  
  // Get thread-related actions from appStore
  const fetchThreads = useAppStore(state => state.fetchThreads);
  const fetchTrendingHashtags = useAppStore(state => state.fetchTrendingHashtags);
  const createThread = useAppStore(state => state.createThread);
  const addReaction = useAppStore(state => state.addReaction);
  const clearError = useAppStore(state => state.clearError);
  
  // Local state for pagination and filtering
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({
    emotion: null,
    hashtag: null,
    userId: null
  });
  
  // Local state for thread composition
  const [composerText, setComposerText] = useState('');
  const [composerMedia, setComposerMedia] = useState(null);
  const [composerEmotion, setComposerEmotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [composerError, setComposerError] = useState(null);
  
  /**
   * Initialize thread data
   */
  useEffect(() => {
    if (isAuthenticated()) {
      fetchThreads();
      fetchTrendingHashtags();
    }
  }, [isAuthenticated, fetchThreads, fetchTrendingHashtags]);
  
  /**
   * Load more threads for infinite scrolling
   */
  const loadMoreThreads = useCallback(async () => {
    if (isLoadingThreads || !hasMore) return;
    
    const nextPage = currentPage + 1;
    const limit = 10;
    const offset = nextPage * limit;
    
    try {
      // Apply filters if needed
      let query = supabase.from('threads').select(`
        *,
        user_profiles:user_id(username, avatar_url),
        reactions(reaction_type, count)
      `);
      
      // Apply emotion filter
      if (filter.emotion) {
        query = query.eq('emotion', filter.emotion);
      }
      
      // Apply hashtag filter
      if (filter.hashtag) {
        query = query.contains('hashtags', [filter.hashtag]);
      }
      
      // Apply user filter
      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      if (data.length < limit) {
        setHasMore(false);
      }
      
      // Append to existing threads
      useAppStore.setState(state => ({
        threads: [...state.threads, ...data]
      }));
      
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more threads:', err);
      useAppStore.setState({ error: err.message });
    }
  }, [currentPage, hasMore, isLoadingThreads, filter]);
  
  /**
   * Apply filters to threads
   * @param {Object} newFilter - Filter criteria
   */
  const applyFilter = useCallback(async (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(0);
    setHasMore(true);
    
    // Reset threads and fetch with new filter
    useAppStore.setState({ threads: [], isLoadingThreads: true });
    
    try {
      let query = supabase.from('threads').select(`
        *,
        user_profiles:user_id(username, avatar_url),
        reactions(reaction_type, count)
      `);
      
      // Apply emotion filter
      if (newFilter.emotion) {
        query = query.eq('emotion', newFilter.emotion);
      }
      
      // Apply hashtag filter
      if (newFilter.hashtag) {
        query = query.contains('hashtags', [newFilter.hashtag]);
      }
      
      // Apply user filter
      if (newFilter.userId) {
        query = query.eq('user_id', newFilter.userId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data.length < 10) {
        setHasMore(false);
      }
      
      useAppStore.setState({ threads: data, isLoadingThreads: false });
    } catch (err) {
      console.error('Error applying filter:', err);
      useAppStore.setState({ error: err.message, isLoadingThreads: false });
    }
  }, []);
  
  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilter({
      emotion: null,
      hashtag: null,
      userId: null
    });
    setCurrentPage(0);
    setHasMore(true);
    fetchThreads();
  }, [fetchThreads]);
  
  /**
   * Handle text change in thread composer
   * @param {string} text - New composer text
   */
  const handleComposerTextChange = useCallback(async (text) => {
    setComposerText(text);
    
    // Analyze emotion if text is long enough
    if (text.length > 3) {
      try {
        const emotionResult = await analyzeText(text);
        setComposerEmotion(emotionResult);
      } catch (err) {
        console.error('Error analyzing emotion:', err);
        // Don't set error here to avoid disrupting the user experience
      }
    } else {
      setComposerEmotion(null);
    }
  }, [analyzeText]);
  
  /**
   * Handle media upload in thread composer
   * @param {File} file - Media file to upload
   */
  const handleComposerMediaUpload = useCallback(async (file) => {
    if (!file) {
      setComposerMedia(null);
      return;
    }
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setComposerError('Invalid file type. Please upload an image or video.');
      return;
    }
    
    if (file.size > maxSize) {
      setComposerError('File too large. Maximum size is 5MB.');
      return;
    }
    
    setComposerError(null);
    setComposerMedia(file);
  }, []);
  
  /**
   * Submit a new thread
   */
  const submitThread = useCallback(async () => {
    if (!isAuthenticated()) {
      setComposerError('You must be logged in to create a thread.');
      return;
    }
    
    if (!composerText.trim()) {
      setComposerError('Thread content cannot be empty.');
      return;
    }
    
    if (composerText.length < 3) {
      setComposerError('Thread content must be at least 3 characters.');
      return;
    }
    
    if (composerText.length > 280) {
      setComposerError('Thread content cannot exceed 280 characters.');
      return;
    }
    
    setIsSubmitting(true);
    setComposerError(null);
    
    try {
      // Ensure we have emotion analysis
      let emotion = composerEmotion;
      if (!emotion) {
        emotion = await analyzeText(composerText);
      }
      
      // Upload media if present
      let mediaUrl = null;
      if (composerMedia) {
        const fileName = `${user.id}/${Date.now()}-${composerMedia.name}`;
        const { data, error } = await supabase.storage
          .from('thread-media')
          .upload(fileName, composerMedia, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('thread-media')
          .getPublicUrl(fileName);
        
        mediaUrl = urlData.publicUrl;
      }
      
      // Create thread
      await createThread(composerText, emotion, mediaUrl);
      
      // Reset composer
      setComposerText('');
      setComposerMedia(null);
      setComposerEmotion(null);
    } catch (err) {
      console.error('Error creating thread:', err);
      setComposerError(err.message || 'Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, user, composerText, composerMedia, composerEmotion, createThread, analyzeText]);
  
  /**
   * Add a reaction to a thread
   * @param {string} threadId - ID of thread to react to
   * @param {string} reactionType - Type of reaction
   */
  const reactToThread = useCallback(async (threadId, reactionType) => {
    if (!isAuthenticated()) {
      useAppStore.setState({ error: 'You must be logged in to react to threads.' });
      return;
    }
    
    try {
      await addReaction(threadId, reactionType);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  }, [isAuthenticated, addReaction]);
  
  return {
    // Thread state
    threads,
    isLoadingThreads,
    isSubmittingReaction,
    error,
    trendingHashtags,
    hasMore,
    filter,
    
    // Composer state
    composerText,
    composerMedia,
    composerEmotion,
    isSubmitting,
    composerError,
    
    // Thread methods
    fetchThreads,
    loadMoreThreads,
    applyFilter,
    resetFilters,
    reactToThread,
    
    // Composer methods
    handleComposerTextChange,
    handleComposerMediaUpload,
    submitThread,
    setComposerText,
    setComposerMedia,
    
    // Utility methods
    clearError: () => {
      clearError();
      setComposerError(null);
    }
  };
};

export default useThread;

/**
 * TypeScript types (for documentation)
 * 
 * @typedef {Object} Thread
 * @property {string} id - Thread ID
 * @property {string} user_id - User ID of thread creator
 * @property {string} content - Thread text content
 * @property {string} emotion - Dominant emotion
 * @property {number} emotion_score - Emotion confidence score
 * @property {Array<string>} hashtags - Array of hashtags in thread
 * @property {string|null} media_url - URL to attached media
 * @property {string} created_at - Creation timestamp
 * @property {Object} user_profiles - User profile data
 * @property {Array<Object>} reactions - Reaction counts by type
 * 
 * @typedef {Object} ThreadFilter
 * @property {string|null} emotion - Filter by emotion
 * @property {string|null} hashtag - Filter by hashtag
 * @property {string|null} userId - Filter by user ID
 */
import { useState, useEffect } from 'react';

const useThread = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);

  const createThread = async (threadData) => {
    setLoading(true);
    try {
      // Mock thread creation
      const newThread = {
        id: Date.now(),
        ...threadData,
        createdAt: new Date().toISOString(),
        reactions: {
          resonate: 0,
          support: 0,
          learn: 0,
          challenge: 0,
          amplify: 0
        }
      };
      
      setThreads(prev => [newThread, ...prev]);
      return { success: true, thread: newThread };
    } catch (error) {
      console.error('Error creating thread:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateThread = async (threadId, updates) => {
    try {
      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, ...updates }
            : thread
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating thread:', error);
      return { success: false, error };
    }
  };

  return {
    threads,
    loading,
    createThread,
    updateThread,
    setThreads
  };
};

export default useThread;
