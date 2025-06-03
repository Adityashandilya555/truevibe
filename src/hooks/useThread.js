import { useState, useCallback, useEffect } from 'react';
import { localThreads } from '../services/localAuth';
import useAuth from './useAuth';
import useEmotion from './useEmotion';

const useThread = () => {
  const { user, isAuthenticated } = useAuth();
  const { analyzeText } = useEmotion();

  // Thread state
  const [threads, setThreads] = useState([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Composer state
  const [composerText, setComposerText] = useState('');
  const [composerMedia, setComposerMedia] = useState(null);
  const [composerEmotion, setComposerEmotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [composerError, setComposerError] = useState(null);

  // Load threads
  const fetchThreads = useCallback(async () => {
    if (!isAuthenticated()) return;

    setIsLoadingThreads(true);
    setError(null);

    try {
      const { threads: fetchedThreads, error } = await localThreads.getThreads(20, 0);

      if (error) {
        setError(error);
      } else {
        setThreads(fetchedThreads);
        setCurrentPage(0);
        setHasMore(fetchedThreads.length === 20);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingThreads(false);
    }
  }, [isAuthenticated]);

  // Load more threads
  const loadMoreThreads = useCallback(async () => {
    if (isLoadingThreads || !hasMore || !isAuthenticated()) return;

    const nextPage = currentPage + 1;
    const offset = nextPage * 20;

    try {
      const { threads: newThreads, error } = await localThreads.getThreads(20, offset);

      if (error) {
        setError(error);
      } else {
        setThreads(prev => [...prev, ...newThreads]);
        setCurrentPage(nextPage);
        setHasMore(newThreads.length === 20);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [currentPage, hasMore, isLoadingThreads, isAuthenticated]);

  // Handle composer text change
  const handleComposerTextChange = useCallback(async (text) => {
    setComposerText(text);

    // Analyze emotion if text is long enough
    if (text.length > 3) {
      try {
        const emotionResult = await analyzeText(text);
        setComposerEmotion(emotionResult);
      } catch (err) {
        console.error('Error analyzing emotion:', err);
      }
    } else {
      setComposerEmotion(null);
    }
  }, [analyzeText]);

  // Handle media upload
  const handleComposerMediaUpload = useCallback(async (file) => {
    if (!file) {
      setComposerMedia(null);
      return;
    }

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setComposerError('Invalid file type. Please upload an image.');
      return;
    }

    if (file.size > maxSize) {
      setComposerError('File too large. Maximum size is 5MB.');
      return;
    }

    // Create data URL for local storage
    const reader = new FileReader();
    reader.onload = (e) => {
      setComposerMedia(e.target.result);
      setComposerError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Submit thread
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

      // Create thread
      const { thread, error } = await localThreads.createThread(
        composerText, 
        emotion, 
        composerMedia
      );

      if (error) {
        setComposerError(error);
      } else {
        // Add to threads list
        setThreads(prev => [thread, ...prev]);

        // Reset composer
        setComposerText('');
        setComposerMedia(null);
        setComposerEmotion(null);
      }
    } catch (err) {
      setComposerError(err.message || 'Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, composerText, composerMedia, composerEmotion, analyzeText]);

  // React to thread
  const reactToThread = useCallback(async (threadId, reactionType) => {
    if (!isAuthenticated()) {
      setError('You must be logged in to react to threads.');
      return;
    }

    try {
      const { thread, error } = await localThreads.addReaction(threadId, reactionType);

      if (error) {
        setError(error);
      } else {
        // Update thread in list
        setThreads(prev => 
          prev.map(t => t.id === threadId ? thread : t)
        );
      }
    } catch (err) {
      setError(err.message);
    }
  }, [isAuthenticated]);

  // Initialize threads on mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchThreads();
    }
  }, [isAuthenticated, fetchThreads]);

  return {
    // Thread state
    threads,
    isLoadingThreads,
    error,
    hasMore,

    // Composer state
    composerText,
    composerMedia,
    composerEmotion,
    isSubmitting,
    composerError,

    // Thread methods
    fetchThreads,
    loadMoreThreads,
    reactToThread,

    // Composer methods
    handleComposerTextChange,
    handleComposerMediaUpload,
    submitThread,
    setComposerText,
    setComposerMedia,

    // Utility methods
    clearError: () => {
      setError(null);
      setComposerError(null);
    }
  };
};

export default useThread;