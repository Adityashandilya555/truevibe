import { create } from 'zustand';
import { supabase } from '../services/supabase';
import FeedGenerator from '../services/feedGenerator';
import FiveReactionSystem from '../services/fiveReactionSystem';
import { analyzeEmotion, getEmotionTrend } from '../services/emotion/vaderEnhanced';

/**
 * Main application store using Zustand
 * - Manages app-wide UI state
 * - Handles theme and preference settings
 * - Manages threads, reactions, and hashtags
 * - Tracks story viewing and creation
 */
const useAppStore = create((set, get) => ({
  // UI state
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isMenuOpen: false,
  activeTab: 'threads',
  notifications: {
    threads: 0,
    profile: 0,
    vibes: 0,
  },

  // Loading states
  isLoadingThreads: false,
  isLoadingStories: false,
  isSubmittingReaction: false,

  // Error states
  error: null,

  // Data states
  threads: [],
  stories: {
    user: [],
    friends: []
  },
  trendingHashtags: [],
  emotionTrends: {},
  feedMetrics: null,

  // Current viewing states
  currentThread: null,
  currentStory: null,
  viewedStories: new Set(),

  // Services
  feedGenerator: new FeedGenerator(),
  reactionSystem: new FiveReactionSystem(),

  /**
   * Toggle dark mode
   */
  toggleDarkMode: () => {
    set(state => ({
      isDarkMode: !state.isDarkMode
    }));

    // Update document class for Tailwind dark mode
    if (get().isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  /**
   * Toggle menu open state
   */
  toggleMenu: () => {
    set(state => ({
      isMenuOpen: !state.isMenuOpen
    }));
  },

  /**
   * Set active tab and clear notifications
   * @param {string} tab - Tab name to set active
   */
  setActiveTab: (tab) => {
    set(state => ({
      activeTab: tab,
      notifications: {
        ...state.notifications,
        [tab]: 0 // Clear notifications for this tab
      }
    }));
  },

  /**
   * Add notification to a tab
   * @param {string} tab - Tab to add notification to
   * @param {number} count - Number of notifications to add
   */
  addNotification: (tab, count = 1) => {
    set(state => ({
      notifications: {
        ...state.notifications,
        [tab]: state.notifications[tab] + count
      }
    }));
  },

  /**
   * Fetch threads from Supabase
   * @param {number} limit - Maximum threads to fetch
   * @param {number} offset - Offset for pagination
   */
  fetchThreads: async (userId = null) => {
    set({ isLoadingThreads: true, error: null });

    try {
      const { feedGenerator } = get();

      // Get current user if not provided
      if (!userId) {
        const user = await supabase.auth.getUser();
        userId = user.data.user?.id;
      }

      if (!userId) {
        // No user, use fallback feed
        const fallbackFeed = await feedGenerator.getFallbackFeed('anonymous', 50);
        set({ 
          threads: fallbackFeed, 
          isLoadingThreads: false,
          feedMetrics: feedGenerator.getFeedMetrics(fallbackFeed)
        });
        return;
      }

      // Generate personalized feed using advanced algorithms
      const personalizedFeed = await feedGenerator.generateFeed(userId, 50);

      set({ 
        threads: personalizedFeed, 
        isLoadingThreads: false,
        feedMetrics: feedGenerator.getFeedMetrics(personalizedFeed)
      });

    } catch (error) {
      console.error('Error fetching threads:', error);

      // Fallback to basic fetch on error
      try {
        const { data } = await supabase
          .from('threads')
          .select(`
            *,
            user_profiles:user_id (
              username,
              avatar_url,
              adjective_one,
              adjective_two,
              adjective_three
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        set({ threads: data || [], isLoadingThreads: false, error: null });
      } catch (fallbackError) {
        set({ error: error.message, isLoadingThreads: false });
      }
    }
  },

  /**
   * Fetch trending hashtags
   */
  fetchTrendingHashtags: async () => {
    try {
      const { data, error } = await supabase
        .from('hashtags')
        .select('tag, count')
        .order('count', { ascending: false })
        .limit(10);

      if (error) throw error;

      set({ trendingHashtags: data });
    } catch (error) {
      console.error('Error fetching hashtags:', error);
    }
  },

  /**
   * Create a new thread
   * @param {string} content - Thread content
   * @param {Object} emotion - Emotion analysis result
   * @param {string} mediaUrl - Optional media URL
   */
  createThread: async (content, emotion, mediaUrl = null) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No authenticated user');

      // Extract hashtags
      const hashtags = (content.match(/#\w+/g) || []).map(tag => tag.substring(1));

      const threadData = {
        content,
        emotion: emotion.dominantEmotion,
        emotion_score: emotion.confidence,
        hashtags,
        user_id: user.data.user.id,
        media_url: mediaUrl,
        reaction_counts: {
          resonate: 0,
          support: 0,
          learn: 0,
          challenge: 0,
          amplify: 0
        }
      };

      // For demo mode, handle locally
      if (user.data.user.id.includes('demo') || user.data.user.id.includes('mock')) {
        const newThread = {
          id: `thread_${Date.now()}`,
          ...threadData,
          created_at: new Date().toISOString(),
          user_profiles: {
            username: user.data.user.email?.split('@')[0] || 'DemoUser',
            avatar_url: null,
            adjective_one: 'Creative',
            adjective_two: 'Authentic',
            adjective_three: 'Inspiring'
          }
        };

        // Store in localStorage for demo
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        demoThreads.unshift(newThread);
        localStorage.setItem('truevibe_demo_threads', JSON.stringify(demoThreads));

        // Add to state
        set(state => ({
          threads: [newThread, ...state.threads]
        }));

        return { success: true, thread: newThread };
      }

      // Real database insert
      const { data, error } = await supabase
        .from('threads')
        .insert(threadData)
        .select(`
          *,
          user_profiles:user_id (
            username,
            avatar_url,
            adjective_one,
            adjective_two,
            adjective_three
          )
        `)
        .single();

      if (error) throw error;

      // Add to the beginning of threads
      set(state => ({
        threads: [data, ...state.threads]
      }));

      // Update trending hashtags
      if (hashtags.length > 0) {
        get().updateTrendingHashtags(hashtags);
      }

      return { success: true, thread: data };
    } catch (error) {
      console.error('Error creating thread:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Add reaction to a thread
   * @param {string} threadId - ID of thread to react to
   * @param {string} reactionType - Type of reaction
   */
  addReaction: async (threadId, reactionType) => {
    const { isSubmittingReaction, reactionSystem } = get();
    if (isSubmittingReaction) return;

    set({ isSubmittingReaction: true });

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No authenticated user');

      // Create reaction event
      const reactionEvent = {
        userId: user.data.user.id,
        threadId,
        reactionType,
        timestamp: new Date(),
        context: {
          deviceType: 'web',
          sessionId: 'session_' + Date.now(),
          sourceLocation: 'feed'
        }
      };

      // Process reaction through advanced system
      const result = await reactionSystem.processReaction(reactionEvent);

      if (result.success) {
        // Update local state with new counts
        set(state => ({
          threads: state.threads.map(thread => {
            if (thread.id === threadId) {
              return { ...thread, reaction_counts: result.newCounts };
            }
            return thread;
          })
        }));
      } else {
        throw new Error('Failed to process reaction');
      }

    } catch (error) {
      console.error('Error adding reaction:', error);
      set({ error: error.message });
    } finally {
      set({ isSubmittingReaction: false });
    }
  },

  /**
   * Fetch user and friend stories
   */
  fetchStories: async () => {
    const userId = supabase.auth.getUser()?.data?.user?.id;
    if (!userId) return;

    set({ isLoadingStories: true, error: null });

    try {
      // Get current timestamp for 24h expiry check
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Fetch user stories
      const { data: userStories, error: userError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Fetch friend stories (for MVP, get all other users' stories)
      const { data: friendStories, error: friendError } = await supabase
        .from('stories')
        .select(`
          *,
          user_profiles:user_id(username, avatar_url)
        `)
        .neq('user_id', userId)
        .gte('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false });

      if (friendError) throw friendError;

      set({
        stories: {
          user: userStories || [],
          friends: friendStories || []
        }
      });
    } catch (error) {
      console.error('Error fetching stories:', error);
      set({ error: error.message });
    } finally {
      set({ isLoadingStories: false });
    }
  },

  /**
   * Create a new story
   * @param {string} mediaUrl - Story media URL
   * @param {string} textContent - Optional text content
   * @param {string} backgroundMusic - Optional background music URL
   */
  createStory: async (mediaUrl, textContent = null, backgroundMusic = null) => {
    const userId = supabase.auth.getUser()?.data?.user?.id;
    if (!userId) return;

    set({ isLoadingStories: true, error: null });

    try {
      // Calculate expiry (24 hours from now)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);

      const { data, error } = await supabase
        .from('stories')
        .insert([
          {
            user_id: userId,
            media_url: mediaUrl,
            text_content: textContent,
            background_music: backgroundMusic,
            expire_at: expiry.toISOString()
          }
        ])
        .select();

      if (error) throw error;

      // Add to stories state
      set(state => ({
        stories: {
          ...state.stories,
          user: [data[0], ...state.stories.user]
        }
      }));
    } catch (error) {
      console.error('Error creating story:', error);
      set({ error: error.message });
    } finally {
      set({ isLoadingStories: false });
    }
  },

  /**
   * Mark a story as viewed
   * @param {string} storyId - ID of story to mark viewed
   */
  markStoryViewed: (storyId) => {
    set(state => {
      const viewedStories = new Set(state.viewedStories);
      viewedStories.add(storyId);
      return { viewedStories };
    });
  },

  /**
   * Set current viewing story
   * @param {Object} story - Story object being viewed
   */
  setCurrentStory: (story) => {
    set({ currentStory: story });
    if (story) {
      get().markStoryViewed(story.id);
    }
  },

  /**
   * Update emotion trends from local storage data
   */
  updateEmotionTrends: () => {
    const trends = getEmotionTrend();
    set({ emotionTrends: trends });
  },

  updateTrendingHashtags: async (hashtags) => {
    try {
      // Update hashtag counts
      for (const hashtag of hashtags) {
        await supabase.rpc('increment_hashtag_count', { tag_name: hashtag });
      }

      // Refresh trending hashtags
      get().fetchTrendingHashtags();
    } catch (error) {
      console.error('Error updating trending hashtags:', error);
    }
  },

  invalidateUserFeed: async (userId) => {
    const { feedGenerator } = get();
    await feedGenerator.invalidateUserFeed(userId);
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  }
}));

// Initialize app state
const initializeAppStore = () => {
  const { isDarkMode } = useAppStore.getState();

  // Set initial dark mode based on preference
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }

  // Set up real-time subscriptions
  const setupRealtimeSubscriptions = async () => {
    // Subscribe to new threads
    supabase
      .channel('public:threads')
      .on('INSERT', (payload) => {
        const { threads, activeTab } = useAppStore.getState();
        const newThread = payload.new;

        // Add to threads list if not already present
        if (!threads.find(t => t.id === newThread.id)) {
          useAppStore.setState(state => ({
            threads: [newThread, ...state.threads]
          }));

          // Add notification if not on threads tab
          if (activeTab !== 'threads') {
            useAppStore.getState().addNotification('threads');
          }
        }
      })
      .subscribe();

    // Subscribe to new stories
    supabase
      .channel('public:stories')
      .on('INSERT', (payload) => {
        const { stories, activeTab } = useAppStore.getState();
        const newStory = payload.new;

        // Check if it's a friend's story or user's own story
        const userId = supabase.auth.getUser()?.data?.user?.id;

        if (newStory.user_id === userId) {
          // Add to user stories if not already present
          if (!stories.user.find(s => s.id === newStory.id)) {
            useAppStore.setState(state => ({
              stories: {
                ...state.stories,
                user: [newStory, ...state.stories.user]
              }
            }));
          }
        } else {
          // Add to friend stories if not already present
          if (!stories.friends.find(s => s.id === newStory.id)) {
            useAppStore.setState(state => ({
              stories: {
                ...state.stories,
                friends: [newStory, ...state.stories.friends]
              }
            }));

            // Add notification if not on profile tab
            if (activeTab !== 'profile') {
              useAppStore.getState().addNotification('profile');
            }
          }
        }
      })
      .subscribe();
  };

  // Initialize subscriptions
  setupRealtimeSubscriptions();
};

// Run initialization
initializeAppStore();

export default useAppStore;