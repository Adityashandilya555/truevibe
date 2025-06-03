import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, Loader2, Hash, Image, X, File, Camera, Maximize2 } from 'lucide-react';
import { analyzeEmotion, getEmotionColor, getEmotionBorder } from '../../services/emotion/vaderEnhanced';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';

// Generate UUID for demo mode
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Generate UUID v4 for file uploads
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
import { optimizedTimeout } from '../../utils/performanceUtils';

/**
 * ThreadComposer Component
 * 
 * Allows users to create new threads with real-time emotion analysis,
 * hashtag detection, validation checks, and media uploads.
 */
const ThreadComposer = () => {
  // Get user from auth store
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Refs
  const textareaRef = useRef(null);
  const composerRef = useRef(null);
  const fileInputRef = useRef(null);

  // States
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState({ 
    dominantEmotion: 'neutral',
    confidence: 0,
    color: '#A9A9A9',
    scores: { compound: 0, pos: 0, neg: 0, neu: 1 }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [emotionWhiplash, setEmotionWhiplash] = useState(false);

  // Media upload states
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', or 'other'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  // Character count and validation
  const maxChars = 280;
  const minChars = 3;
  const charsLeft = maxChars - content.length;
  const isValid = (content.length >= minChars || mediaFile) && content.length <= maxChars && !emotionWhiplash;

  // Initialize trending hashtags from Supabase
  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const { data, error } = await supabase
          .from('hashtags')
          .select('tag, count')
          .order('count', { ascending: false })
          .limit(5);

        if (error) throw error;

        setTrendingHashtags(data?.map(item => item.tag) || []);
      } catch (err) {
        console.error('Error fetching trending hashtags:', err);
      }
    };

    fetchTrendingHashtags();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setMediaError('File too large. Maximum size is 10MB.');
      return;
    }

    // Determine file type
    let type = 'other';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    }

    setMediaFile(file);
    setMediaType(type);
    setMediaError(null);

    // Create preview URL
    const previewURL = URL.createObjectURL(file);
    setMediaPreview(previewURL);
  };
  // Add this after the handleFileSelect function
  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    };
  }, [mediaPreview]);

  // Remove selected media
  const removeMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setUploadProgress(0);
    setMediaError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger camera on mobile devices
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'camera';
      fileInputRef.current.click();
    }
  };

  // Trigger file input
  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*,video/*';
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  // Upload media to Supabase Storage
  const uploadMedia = async () => {
    if (!mediaFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

      // Upload to Supabase with progress tracking
      const { data, error } = await supabase.storage
        .from('user-content')
        .upload(filePath, mediaFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading media:', err);
      setMediaError('Failed to upload media. Please try again.');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Create a custom debounce function using optimizedTimeout
  const createOptimizedDebounce = (func, wait) => {
    let timeout;

    // Return a debounced function
    const debounced = function(...args) {
      const context = this;

      // Clear the previous timeout
      if (timeout) {
        timeout.clear();
      }

      // Set a new timeout
      timeout = optimizedTimeout(() => {
        func.apply(context, args);
      }, wait);
    };

    // Add cancel method
    debounced.cancel = function() {
      if (timeout) {
        timeout.clear();
        timeout = null;
      }
    };

    return debounced;
  };

  // Create optimized debounced emotion analysis
  const debouncedAnalysis = useRef(
    createOptimizedDebounce(async (text) => {
      if (!text || text.length < minChars) {
        setIsAnalyzing(false);
        setEmotion({
          dominantEmotion: 'neutral',
          confidence: 0,
          color: '#A9A9A9',
          scores: { compound: 0, pos: 0, neg: 0, neu: 1 }
        });
        return;
      }

      try {
        // Start analysis with timeout
        const timeoutPromise = new Promise((_, reject) => 
          optimizedTimeout(() => reject(new Error('Emotion analysis timeout')), 3000)
        );

        const result = await Promise.race([
          analyzeEmotion(text),
          timeoutPromise
        ]);

        setEmotion(result);

        // Check for emotional whiplash (if emotion changes dramatically)
        if (lastEmotion && lastEmotion.dominantEmotion !== result.dominantEmotion) {
          const delta = Math.abs(lastEmotion.scores.compound - result.scores.compound);
          setEmotionWhiplash(delta > 0.7);
        } else {
          setEmotionWhiplash(false);
        }

        setLastEmotion(result);

        // Check for duplicate emotions in past 24h (skip for demo mode)
        const checkDuplicateEmotion = async () => {
          try {
            if (!user) return;
            
            // Skip duplicate checking for demo users
            if (user.id.includes('mock') || user.id.includes('demo') || user.email === 'demo@truevibe.com') {
              setError(null);
              return;
            }

            const { data, error } = await supabase
              .from('threads')
              .select('emotion')
              .eq('user_id', user.id)
              .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
              .eq('emotion', result.dominantEmotion);

            if (error) throw error;

            if (data && data.length > 0) {
              setError(`You've already posted about ${result.dominantEmotion} in the past 24 hours. Consider a different perspective?`);
            } else {
              setError(null);
            }
          } catch (err) {
            console.error('Error checking duplicate emotion:', err);
          }
        };

        checkDuplicateEmotion();

      } catch (err) {
        console.error('Error analyzing emotion:', err);
        // Fallback to neutral on timeout or error
        setEmotion({
          dominantEmotion: 'neutral',
          confidence: 0.3,
          color: '#A9A9A9',
          scores: { compound: 0, pos: 0, neg: 0, neu: 1 }
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 300)
  ).current;

  // Analyze emotion when content changes
  useEffect(() => {
    if (content) {
      setIsAnalyzing(true);
      debouncedAnalysis(content);
    }

    // Extract hashtags and suggest related ones
    const extractedTags = content.match(/#\w+/g) || [];

    if (extractedTags.length > 0) {
      // Generate emotion-based hashtag suggestions
      const emotionSuggestions = {
        joy: ['#happy', '#excited', '#grateful'],
        sadness: ['#support', '#vent', '#healing'],
        anger: ['#frustrated', '#venting', '#boundaries'],
        fear: ['#anxious', '#worried', '#help'],
        disgust: ['#disappointed', '#tired', '#over'],
        surprise: ['#unexpected', '#wow', '#unbelievable'],
        anticipation: ['#looking', '#forward', '#hopeful'],
        trust: ['#believe', '#faithful', '#reliable'],
        neutral: ['#thoughts', '#question', '#discuss']
      };

      // Combine trending and emotion-based suggestions
      const currentEmotion = emotion.dominantEmotion || 'neutral';
      const suggestions = [
        ...(emotionSuggestions[currentEmotion] || []),
        ...trendingHashtags
      ]
        .filter(tag => !extractedTags.includes(tag))
        .slice(0, 5);

      setHashtagSuggestions(suggestions);
    } else {
      setHashtagSuggestions([]);
    }

    return () => {
      debouncedAnalysis.cancel();
    };
  }, [content, debouncedAnalysis, emotion.dominantEmotion, trendingHashtags]);

  // Handle content input
  const handleContentChange = (e) => {
    setContent(e.target.value);
    adjustTextareaHeight();
  };

  // Dynamically adjust textarea height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Add hashtag to content
  const addHashtag = (tag) => {
    setContent((prev) => {
      // Don't add if already exists
      if (prev.includes(tag)) return prev;

      return prev.endsWith(' ') || prev === '' 
        ? `${prev}${tag} ` 
        : `${prev} ${tag} `;
    });

    // Focus textarea after adding hashtag
    optimizedTimeout(() => {
      textareaRef.current?.focus();
      adjustTextareaHeight();
    }, 50);
  };

  // Submit thread
  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to post a thread');
      optimizedTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Extract hashtags
      const hashtags = (content.match(/#\w+/g) || []).map(tag => tag.substring(1));

      // Upload media if present
      let mediaUrl = null;
      if (mediaFile) {
        mediaUrl = await uploadMedia();
      }

      // Create thread - handle demo mode and Supabase
      let threadData;
      
      if (user.id.includes('mock') || user.id.includes('demo') || user.email === 'demo@truevibe.com') {
        // Demo mode - create mock thread
        threadData = {
          id: generateUUID(),
          content,
          emotion: emotion.dominantEmotion,
          emotion_score: emotion.confidence,
          hashtags,
          user_id: user.id,
          media_url: mediaUrl,
          media_type: mediaUrl ? mediaType : null,
          created_at: new Date().toISOString(),
          reaction_counts: {
            resonate: 0,
            support: 0,
            learn: 0,
            challenge: 0,
            amplify: 0
          },
          user_profiles: {
            username: user.email.split('@')[0],
            avatar_url: null,
            adjective_one: user.user_metadata?.adjectives?.[0] || 'Creative',
            adjective_two: user.user_metadata?.adjectives?.[1] || 'Empathetic',
            adjective_three: user.user_metadata?.adjectives?.[2] || 'Curious'
          }
        };
        
        // Store in localStorage for demo
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        demoThreads.unshift(threadData);
        localStorage.setItem('truevibe_demo_threads', JSON.stringify(demoThreads));
        
        // Update app store with demo thread
        useAppStore.setState(state => ({
          threads: [threadData, ...state.threads]
        }));
        
      } else {
        // Real Supabase mode
        const { data, error } = await supabase
          .from('threads')
          .insert({
            content,
            emotion: emotion.dominantEmotion,
            emotion_score: emotion.confidence,
            hashtags,
            user_id: user.id,
            media_url: mediaUrl,
            media_type: mediaUrl ? mediaType : null
          })
          .select(`
            *,
            user_profiles:user_id (
              username,
              avatar_url,
              adjective_one,
              adjective_two,
              adjective_three
            )
          `);

        if (error) throw error;
        threadData = data[0];
      }

      // Clear content and reset states
      setContent('');
      setEmotion({
        dominantEmotion: 'neutral',
        confidence: 0,
        color: '#A9A9A9',
        scores: { compound: 0, pos: 0, neg: 0, neu: 1 }
      });
      setHashtagSuggestions([]);
      setEmotionWhiplash(false);
      setLastEmotion(null);
      removeMedia();

      // Adjust textarea height
      adjustTextareaHeight();

      // Update trending hashtags
      if (hashtags.length > 0) {
        // Update hashtag counts in Supabase (upsert)
        await Promise.all(hashtags.map(async (tag) => {
          await supabase.rpc('increment_hashtag_count', { tag_name: tag });
        }));
      }

    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Please try again.');

      // Retry logic (max 3 attempts)
      if (retryCount < 3 && err.message?.includes('network')) {
        setRetryCount(prev => prev + 1);
        optimizedTimeout(() => handleSubmit(), 1000);
        return;
      }

      if (err.message?.includes('auth') || err.status === 401) {
        setError('Your session has expired. Redirecting to login...');
        optimizedTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate border style based on emotion
  const getBorderStyle = () => {
    if (isAnalyzing) {
      return {
        border: `2px solid ${emotion.color || '#A9A9A9'}`,
        boxShadow: `0 0 8px ${emotion.color || '#A9A9A9'}`
      };
    }

    if (emotion.dominantEmotion === 'neutral' || emotion.confidence < 0.3) {
      return { border: '2px solid #A9A9A9' };
    }

    return {
      border: `2px solid ${emotion.color}`,
      boxShadow: emotion.confidence > 0.7 ? `0 0 8px ${emotion.color}` : 'none'
    };
  };

  // Animation for calming on emotional whiplash
  const calmingAnimation = emotionWhiplash ? {
    animate: {
      opacity: [1, 0.7, 1],
      scale: [1, 0.98, 1],
      transition: { duration: 2, repeat: 3, ease: 'easeInOut' }
    }
  } : {};

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6"
      style={getBorderStyle()}
      ref={composerRef}
      {...calmingAnimation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Thread composer - Current emotion: ${emotion.dominantEmotion}`}
    >
      {/* Emotion indicator with confidence overlay */}
      <div className="absolute top-2 right-2 flex items-center">
        {isAnalyzing ? (
          <motion.div 
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: emotion.color || '#A9A9A9' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            aria-label="Analyzing emotion"
          />
        ) : (
          <div className="relative">
            <div 
              className="h-4 w-4 rounded-full" 
              style={{ backgroundColor: emotion.color || '#A9A9A9' }}
            />
            {emotion.confidence > 0 && (
              <div 
                className="absolute -right-6 -top-1 text-xs font-medium"
                aria-label={`Confidence: ${Math.round(emotion.confidence * 100)}%`}
              >
                {Math.round(emotion.confidence * 100)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media preview */}
      {mediaPreview && (
        <div className="relative mt-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {mediaType === 'image' ? (
            <img
              src={mediaPreview}
              alt="Media preview"
              className="w-full max-h-64 sm:max-h-80 object-contain"
            />
          ) : mediaType === 'video' ? (
            <video
              src={mediaPreview}
              controls
              className="w-full max-h-64 sm:max-h-80 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center p-4">
              <File size={24} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px] sm:max-w-full">
                {mediaFile?.name}
              </span>
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={removeMedia}
            className="absolute top-2 right-2 p-2 min-h-[36px] min-w-[36px] bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-gray-900 transition-colors"
            aria-label="Remove media"
          >
            <X size={16} />
          </button>

          {/* Upload progress */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 py-1 px-2">
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white">{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text area for content */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        placeholder="What's on your mind? Express your true vibe..."
        className="w-full p-2 bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white resize-none overflow-hidden min-h-[100px]"
        maxLength={maxChars}
        disabled={isSubmitting}
        aria-label="Thread content"
        aria-invalid={!isValid}
        aria-describedby="character-count error-message"
      />

      {/* Character count */}
      <div 
        id="character-count"
        className={`text-xs ${charsLeft < 20 ? 'text-red-500' : 'text-gray-500'} text-right mr-8`}
      >
        {charsLeft} characters left
      </div>

      {/* Emotion Detection Display */}
      {emotion && emotion.dominantEmotion !== 'neutral' && emotion.confidence > 0.3 && (
        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4" style={{
          borderLeftColor: emotion.color
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Detected Emotion:
              </span>
              <span className="text-sm font-semibold" style={{ color: emotion.color }}>
                {emotion.dominantEmotion}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Confidence:</span>
              <span className="text-xs font-medium" style={{ color: emotion.color }}>
                {Math.round(emotion.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-2">
          <motion.button
            onClick={handleCameraCapture}
            className="p-3 min-h-[44px] min-w-[44px] bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || isUploading}
            aria-label="Take photo"
          >
            <Camera size={18} />
          </motion.button>

          <motion.button
            onClick={handleBrowseFiles}
            className="p-3 min-h-[44px] min-w-[44px] bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || isUploading}
            aria-label="Upload media"
          >
            <Image size={18} />
          </motion.button>
        </div>

        {/* Clear/Reset button */}
        {(content || mediaFile) && (
          <motion.button
            onClick={() => {
              setContent('');
              removeMedia();
              setError(null);
              adjustTextareaHeight();
            }}
            className="p-2 min-h-[40px] min-w-[40px] text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Clear content"
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      {/* Hashtag suggestions */}
      {hashtagSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2" role="list" aria-label="Hashtag suggestions">
          <span className="text-xs text-gray-500 flex items-center">
            <Hash size={12} className="mr-1" />
            Suggestions:
          </span>
          {hashtagSuggestions.map((tag, index) => (
            <motion.button
              key={tag}
              onClick={() => addHashtag(tag)}
              className="px-3 py-2 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[40px] sm:min-h-0 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              aria-label={`Add hashtag ${tag}`}
              role="listitem"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-2 text-sm text-red-500 flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            id="error-message"
            role="alert"
          >
            <AlertCircle size={14} className="mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotional whiplash warning */}
      <AnimatePresence>
        {emotionWhiplash && (
          <motion.div
            className="mt-2 text-sm text-amber-500 flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <AlertCircle size={14} className="mr-1" />
            Your emotion seems to have shifted dramatically. Take a moment to breathe.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <div className="mt-3 flex justify-end">
        <motion.button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting || isUploading}
          className={`px-4 py-2 min-h-[44px] rounded-full flex items-center justify-center ${isValid && !isSubmitting && !isUploading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white transition-colors`}
          whileHover={isValid && !isSubmitting && !isUploading ? { scale: 1.03 } : {}}
          whileTap={isValid && !isSubmitting && !isUploading ? { scale: 0.97 } : {}}
          aria-label="Post thread"
        >
          {isSubmitting || isUploading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              <span className="truncate max-w-[120px] sm:max-w-full">
                {isUploading ? `Uploading ${uploadProgress}%` : 'Posting...'}
              </span>
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Post
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ThreadComposer;