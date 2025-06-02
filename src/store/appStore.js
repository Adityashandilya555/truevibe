import { create } from 'zustand';
import { supabase } from '../services/supabase';
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
  
  // Current viewing states
  currentThread: null,
  currentStory: null,
  viewedStories: new Set(),
  
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
  fetchThreads: async (limit = 10, offset = 0) => {
    set({ isLoadingThreads: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          user_profiles:user_id(username, avatar_url),
          reactions(reaction_type, count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // If first load, replace threads, otherwise append
      if (offset === 0) {
        set({ threads: data });
      } else {
        set(state => ({
          threads: [...state.threads, ...data]
        }));
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      set({ error: error.message });
    } finally {
      set({ isLoadingThreads: false });
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
    const userId = supabase.auth.getUser()?.data?.user?.id;
    if (!userId) return;
    
    set({ isLoadingThreads: true, error: null });
    
    // Extract hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = content.match(hashtagRegex) || [];
    
    try {
      // Create thread
      const { data, error } = await supabase
        .from('threads')
        .insert([
          {
            user_id: userId,
            content,
            emotion: emotion.dominantEmotion,
            emotion_score: emotion.confidence,
            hashtags,
            media_url: mediaUrl
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Update hashtag counts
      if (hashtags.length > 0) {
        // Use Promise.all for concurrent updates
        await Promise.all(hashtags.map(async (tag) => {
          const { error } = await supabase.rpc('increment_hashtag', {
            tag_name: tag.slice(1) // Remove # prefix
          });
          
          if (error) console.error('Error incrementing hashtag:', error);
        }));
      }
      
      // Add to threads state
      set(state => ({
        threads: [data[0], ...state.threads]
      }));
      
      // Update emotion trends
      get().updateEmotionTrends();
    } catch (error) {
      console.error('Error creating thread:', error);
      set({ error: error.message });
    } finally {
      set({ isLoadingThreads: false });
    }
  },
  
  /**
   * Add reaction to a thread
   * @param {string} threadId - ID of thread to react to
   * @param {string} reactionType - Type of reaction
   */
  addReaction: async (threadId, reactionType) => {
    const userId = supabase.auth.getUser()?.data?.user?.id;
    if (!userId) return;
    
    set({ isSubmittingReaction: true });
    
    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('thread_id', threadId)
        .eq('user_id', userId)
        .single();
      
      if (existingReaction) {
        // Update existing reaction
        if (existingReaction.reaction_type !== reactionType) {
          const { error } = await supabase
            .from('reactions')
            .update({ reaction_type: reactionType })
            .eq('id', existingReaction.id);
          
          if (error) throw error;
        }
      } else {
        // Create new reaction
        const { error } = await supabase
          .from('reactions')
          .insert([
            {
              thread_id: threadId,
              user_id: userId,
              reaction_type: reactionType
            }
          ]);
        
        if (error) throw error;
      }
      
      // Update local thread state
      set(state => ({
        threads: state.threads.map(thread => {
          if (thread.id === threadId) {
            // Update reaction counts
            const updatedReactions = { ...thread.reactions };
            
            if (existingReaction) {
              // Decrement old reaction type
              updatedReactions[existingReaction.reaction_type] -= 1;
            }
            
            // Increment new reaction type
            updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
            
            return { ...thread, reactions: updatedReactions };
          }
          return thread;
        })
      }));
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