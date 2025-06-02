import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, X, Music, Volume2, VolumeX } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../services/supabase';
import { analyzeEmotion } from '../../services/emotion/vaderEnhanced';
import { optimizedInterval } from '../../utils/performanceUtils';

// Enhanced emotion colors for TrueVibe with intensity variations
const EMOTION_COLORS = {
  joy: 'from-yellow-400 via-yellow-300 to-amber-300',
  trust: 'from-green-400 via-emerald-400 to-teal-400',
  fear: 'from-purple-600 via-violet-500 to-indigo-500',
  surprise: 'from-orange-400 via-amber-400 to-yellow-400',
  sadness: 'from-blue-500 via-sky-500 to-cyan-500',
  disgust: 'from-purple-500 via-fuchsia-500 to-pink-500',
  anger: 'from-red-500 via-rose-500 to-pink-500',
  anticipation: 'from-orange-500 via-amber-500 to-yellow-500',
  neutral: 'from-gray-400 via-slate-400 to-zinc-400'
};

const StoriesCarousel = () => {
  const { user, profile } = useAuthStore();

  // Stories state
  const [userStories, setUserStories] = useState([]);
  const [friendStories, setFriendStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Story viewer state
  const [viewingStory, setViewingStory] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [viewingUserStories, setViewingUserStories] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // Story creation state
  const [isCreating, setIsCreating] = useState(false);
  const [storyForm, setStoryForm] = useState({
    text: '',
    musicTrack: '',
    mediaFile: null,
    mediaPreview: null,
    emotion: null,
    emotionConfidence: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Fetch user's stories
  const fetchUserStories = async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', now)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserStories(data || []);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    }
  };

  // Fetch friends' stories with emotion analysis
  const fetchFriendStories = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Get followed users
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('followed_id')
        .eq('follower_id', user.id);

      if (followsError) throw followsError;

      const followedIds = followsData.map(follow => follow.followed_id);

      if (followedIds.length === 0) {
        setFriendStories([]);
        return;
      }

      // Get stories with profile data
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .in('user_id', followedIds)
        .gte('expires_at', now)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(story => ({
        ...story,
        username: story.profiles.username,
        avatar_url: story.profiles.avatar_url,
        viewed: false
      })) || [];

      setFriendStories(transformedData);
      await checkViewedStories(transformedData);
    } catch (error) {
      console.error('Error fetching friend stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check viewed stories
  const checkViewedStories = async (stories) => {
    if (!user || !stories.length) return;

    try {
      const storyIds = stories.map(story => story.id);
      const { data, error } = await supabase
        .from('story_views')
        .select('story_id')
        .eq('user_id', user.id)
        .in('story_id', storyIds);

      if (error) throw error;

      const viewedStoryIds = new Set(data.map(view => view.story_id));

      setFriendStories(prev => 
        prev.map(story => ({
          ...story,
          viewed: viewedStoryIds.has(story.id)
        }))
      );
    } catch (error) {
      console.error('Error checking viewed stories:', error);
    }
  };

  // Mark story as viewed
  const markStoryAsViewed = async (storyId) => {
    if (!user || !storyId) return;

    try {
      await supabase
        .from('story_views')
        .upsert({
          user_id: user.id,
          story_id: storyId,
          viewed_at: new Date().toISOString()
        });

      setFriendStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  // Handle text emotion analysis
  const handleTextChange = async (text) => {
    setStoryForm(prev => ({ ...prev, text }));

    if (text.trim()) {
      const emotionResult = await analyzeEmotion(text);
      setStoryForm(prev => ({
        ...prev,
        emotion: emotionResult.dominantEmotion,
        emotionConfidence: emotionResult.confidence
      }));
    } else {
      setStoryForm(prev => ({
        ...prev,
        emotion: null,
        emotionConfidence: 0
      }));
    }
  };

  // Handle media selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setStoryForm(prev => ({
      ...prev,
      mediaFile: file,
      mediaPreview: previewUrl
    }));
  };

  // Create story with emotion analysis
  const createStory = async () => {
    if (!user || !storyForm.mediaFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload media
      const fileExt = storyForm.mediaFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, storyForm.mediaFile, {
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

      // Create story record
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: urlData.publicUrl,
          text_content: storyForm.text || '',
          background_music: storyForm.musicTrack || '',
          emotion: storyForm.emotion || 'neutral',
          emotion_confidence: storyForm.emotionConfidence || 0,
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        });

      if (storyError) throw storyError;

      // Reset form
      setStoryForm({
        text: '',
        musicTrack: '',
        mediaFile: null,
        mediaPreview: null,
        emotion: null,
        emotionConfidence: 0
      });
      setIsCreating(false);

      // Refresh stories
      fetchUserStories();
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Story viewer functions
  const handleViewStory = (storyId, isUserStory = false) => {
    const stories = isUserStory ? userStories : friendStories;
    const index = stories.findIndex(s => s.id === storyId);

    if (index !== -1) {
      setViewingUserStories(isUserStory);
      setActiveStoryIndex(index);
      setViewingStory(stories);
      setStoryProgress(0);

      if (!isUserStory) {
        markStoryAsViewed(storyId);
      }

      // Start progress timer
      startStoryProgress();
    }
  };

  const startStoryProgress = () => {
    setStoryProgress(0);

    // Stop previous interval if exists
    if (progressIntervalRef.current) {
      progressIntervalRef.current.stop();
    }

    // Use optimizedInterval instead of setInterval
    progressIntervalRef.current = optimizedInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + 2; // 5 seconds total (100/2 = 50 intervals * 100ms)
      });
    }, 100);
  };

  const handleNextStory = () => {
    const stories = viewingUserStories ? userStories : friendStories;

    if (progressIntervalRef.current) {
      progressIntervalRef.current.stop();
    }

    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);

      if (!viewingUserStories) {
        markStoryAsViewed(stories[activeStoryIndex + 1].id);
      }

      startStoryProgress();
    } else {
      handleCloseStory();
    }
  };

  const handlePrevStory = () => {
    if (progressIntervalRef.current) {
      progressIntervalRef.current.stop();
    }

    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      startStoryProgress();
    }
  };

  const handleCloseStory = () => {
    if (progressIntervalRef.current) {
      progressIntervalRef.current.stop();
    }

    setViewingStory(null);
    setActiveStoryIndex(0);
    setStoryProgress(0);
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      fetchUserStories();
      fetchFriendStories();
    }
  }, [user]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        progressIntervalRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Stories</h2>

      {/* Your Stories Section */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Your Stories</h3>

        <div className="flex overflow-x-auto pb-3 space-x-4 hide-scrollbar">
          {/* Create Story Button */}
          <div 
            className="flex-shrink-0 w-16 sm:w-20 flex flex-col items-center"
            onClick={() => setIsCreating(true)}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[44px] min-w-[44px]">
              <Plus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="mt-2 text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400">Add Story</span>
          </div>

          {/* User Story Items */}
          {userStories.map(story => {
            const emotion = story.emotion || 'neutral';
            const timeLeft = getTimeLeft(story.created_at, story.expires_at);

            return (
              <div 
                key={story.id} 
                className="flex-shrink-0 w-16 sm:w-20 flex flex-col items-center"
                onClick={() => handleViewStory(story.id, true)}
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer min-h-[44px] min-w-[44px]">
                  {/* Gradient Ring */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${EMOTION_COLORS[emotion]} animate-pulse-slow`}></div>

                  {/* Inner image */}
                  <div className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img 
                      src={story.media_url} 
                      alt="Story" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Time indicator */}
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-[8px] rounded-full w-6 h-6 flex items-center justify-center">
                    {timeLeft}
                  </div>
                </div>
                <span className="mt-2 text-xs sm:text-sm text-center truncate w-full">
                  Your Story
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friends Stories Section */}
      {friendStories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Friend Stories</h3>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {friendStories.map(story => {
              const emotion = story.emotion || 'neutral';
              const timeLeft = getTimeLeft(story.created_at, story.expires_at);
              const viewed = story.viewed;

              return (
                <div 
                  key={story.id} 
                  className="flex flex-col items-center"
                  onClick={() => handleViewStory(story.id)}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer min-h-[44px] min-w-[44px]">
                    {/* Gradient Ring - dimmed if viewed */}
                    <div 
                      className={`absolute inset-0 rounded-full bg-gradient-to-tr ${EMOTION_COLORS[emotion]} ${viewed ? 'opacity-40' : 'animate-pulse-slow'}`}
                    ></div>

                    {/* Inner image */}
                    <div className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img 
                        src={story.media_url} 
                        alt={`${story.username}'s story`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Time indicator */}
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-[8px] rounded-full w-6 h-6 flex items-center justify-center">
                      {timeLeft}
                    </div>
                  </div>
                  <span className="mt-2 text-xs sm:text-sm text-center truncate w-full">
                    {story.username}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Story Creator Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold mb-6 text-center">Create Your Story</h3>

              {/* Media Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Media
                </label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer h-48 flex items-center justify-center transition-all duration-300 ${
                    storyForm.emotion 
                      ? `border-${storyForm.emotion}-400 bg-${storyForm.emotion}-50` 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {storyForm.mediaPreview ? (
                    <img 
                      src={storyForm.mediaPreview} 
                      alt="Preview" 
                      className="max-h-40 max-w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="text-gray-500">
                      <Camera className="w-12 h-12 mx-auto mb-3" />
                      <p className="font-medium">Click to upload</p>
                      <p className="text-xs mt-1">Image or video (max 10MB)</p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*,video/*" 
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                </div>
              </div>

              {/* Text Input with Emotion Analysis */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Story Caption
                </label>
                <div className="relative">
                  <textarea
                    value={storyForm.text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all duration-300 ${
                      storyForm.emotion 
                        ? `border-${storyForm.emotion}-400 focus:border-${storyForm.emotion}-500` 
                        : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    placeholder="Share your vibe..."
                    rows={3}
                  />
                  {storyForm.emotion && (
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${storyForm.emotion}-100 text-${storyForm.emotion}-800`}>
                        {storyForm.emotion} ({Math.round(storyForm.emotionConfidence * 100)}%)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Music Track */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Background Music
                </label>
                <div className="relative">
                  <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={storyForm.musicTrack}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, musicTrack: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 transition-all duration-300"
                    placeholder="Song name - Artist"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                  onClick={() => setIsCreating(false)}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-300"
                  onClick={createStory}
                  disabled={!storyForm.mediaFile || isUploading}
                >
                  {isUploading ? 'Creating...' : 'Share Story'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {viewingStory && viewingStory.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-20">
              {viewingStory.map((_, index) => (
                <div 
                  key={index}
                  className="h-1 bg-white bg-opacity-30 flex-1 rounded-full overflow-hidden"
                >
                  {index === activeStoryIndex && (
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: `${storyProgress}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  )}
                  {index < activeStoryIndex && (
                    <div className="h-full bg-white w-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Story header */}
            <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={
                    viewingUserStories 
                      ? profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=random` 
                      : viewingStory[activeStoryIndex]?.avatar_url || `https://ui-avatars.com/api/?name=${viewingStory[activeStoryIndex]?.username || 'U'}&background=random`
                  } 
                  alt="User" 
                  className="w-10 h-10 rounded-full mr-3 border-2 border-white" 
                />
                <div>
                  <p className="text-white font-semibold text-sm">
                    {viewingUserStories ? profile?.username : viewingStory[activeStoryIndex]?.username}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {new Date(viewingStory[activeStoryIndex]?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseStory} 
                className="text-white hover:text-gray-300 transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Story content */}
            <div className="flex-1 flex items-center justify-center relative">
              <img 
                src={viewingStory[activeStoryIndex]?.media_url}
                alt="Story"
                className="max-h-full max-w-full object-contain"
              />

              {/* Story text overlay */}
              {viewingStory[activeStoryIndex]?.text_content && (
                <div className="absolute bottom-24 left-4 right-4">
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-2xl">
                    <p className="text-white text-lg font-medium text-center line-clamp-4 sm:line-clamp-none overflow-ellipsis">
                      {viewingStory[activeStoryIndex]?.text_content}
                    </p>
                  </div>
                </div>
              )}

              {/* Music info */}
              {viewingStory[activeStoryIndex]?.background_music && (
                <div className="absolute bottom-8 left-4 right-4">
                  <div className="flex items-center justify-center space-x-3 bg-black bg-opacity-40 backdrop-blur-sm p-3 rounded-full max-w-xs mx-auto">
                    <Music className="w-4 h-4 text-white" />
                    <span className="text-white text-sm truncate max-w-[120px] sm:max-w-full">
                      {viewingStory[activeStoryIndex]?.background_music}
                    </span>
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className="text-white hover:text-gray-300 transition-colors p-2 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation tap zones */}
              <div className="absolute inset-0 flex">
                <div className="flex-1" onClick={handlePrevStory}></div>
                <div className="flex-1" onClick={handleNextStory}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoriesCarousel;