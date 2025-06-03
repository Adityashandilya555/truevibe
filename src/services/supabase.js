import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create and export the main Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

/**
 * @typedef {Object} UserProfile
 * @property {string} id - User ID from auth.users
 * @property {string} username - User's chosen username
 * @property {string} avatar_url - URL to user's avatar image
 * @property {string} adjective_one - First descriptive adjective
 * @property {string} adjective_two - Second descriptive adjective
 * @property {string} adjective_three - Third descriptive adjective
 * @property {Date} created_at - When profile was created
 * @property {Date} updated_at - When profile was last updated
 */

/**
 * @typedef {Object} Thread
 * @property {string} id - Thread ID
 * @property {string} user_id - User ID who created the thread
 * @property {string} content - Thread content
 * @property {string} emotion - Detected emotion (joy, trust, fear, etc.)
 * @property {number} emotion_score - Emotion confidence score (-1 to 1)
 * @property {string[]} hashtags - Array of hashtags
 * @property {string} media_url - URL to attached media
 * @property {string} media_type - Type of attached media
 * @property {Object} reaction_counts - Count of each reaction type
 * @property {string} visibility - Thread visibility (public, friends, private)
 * @property {Date} created_at - When thread was created
 */

/**
 * Custom error handler for authentication operations
 * @param {Error} error - The error object from Supabase
 * @returns {string} Formatted error message
 */
export const handleAuthError = (error) => {
  const errorMessage = error?.message || 'Unknown error occurred';
  
  // Map common Supabase auth errors to user-friendly messages
  if (errorMessage.includes('Email not confirmed')) {
    return 'Please check your email to confirm your account';
  }
  
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Incorrect email or password';
  }
  
  if (errorMessage.includes('Email already registered')) {
    return 'This email is already in use';
  }
  
  if (errorMessage.includes('Password should be')) {
    return 'Password must be at least 6 characters';
  }
  
  if (errorMessage.includes('User not found')) {
    return 'No account found with this email address';
  }
  
  if (errorMessage.includes('signup disabled')) {
    return 'Account registration is currently disabled';
  }
  
  // Return original error if no mapping exists
  return errorMessage;
};

/**
 * Session management utilities for TrueVibe
 */
export const sessionUtils = {
  /**
   * Get the current session
   * @returns {Promise<Object|null>} The current session or null
   */
  getCurrentSession: async function() {
    try {
      const response = await supabase.auth.getSession();
      if (response.error) {
        console.error('Error getting session:', response.error.message);
        return null;
      }
      return response.data?.session || null;
    } catch (error) {
      console.error('Session fetch error:', error);
      return null;
    }
  },
  
  /**
   * Get the current user
   * @returns {Promise<Object|null>} The current user or null
   */
  getCurrentUser: async function() {
    try {
      const response = await supabase.auth.getUser();
      if (response.error) {
        console.error('Error getting user:', response.error.message);
        return null;
      }
      return response.data?.user || null;
    } catch (error) {
      console.error('User fetch error:', error);
      return null;
    }
  },
  
  /**
   * Refresh the current session
   * @returns {Promise<Object|null>} The refreshed session or null
   */
  refreshSession: async function() {
    try {
      const response = await supabase.auth.refreshSession();
      if (response.error) {
        console.error('Error refreshing session:', response.error.message);
        return null;
      }
      return response.data?.session || null;
    } catch (error) {
      console.error('Session refresh error:', error);
      return null;
    }
  },
  
  /**
   * Set up session change listener
   * @param {Function} callback - Function to call when session changes
   * @returns {Object} Object with subscription data
   */
  onSessionChange: function(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

/**
 * Profile management utilities for TrueVibe users
 */
export const profileUtils = {
  /**
   * Get a user profile by user ID
   * @param {string} userId - User ID to fetch profile for
   * @returns {Promise<Object>} Object containing the profile data or error
   */
  getProfileById: async function(userId) {
    try {
      const response = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Create a new user profile
   * @param {Object} profile - Profile data to insert
   * @returns {Promise<Object>} Object containing the inserted profile or error
   */
  createProfile: async function(profile) {
    try {
      const response = await supabase
        .from('user_profiles')
        .insert([profile])
        .select()
        .single();
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Update an existing user profile
   * @param {string} userId - User ID of profile to update
   * @param {Object} updates - Profile fields to update
   * @returns {Promise<Object>} Object containing the updated profile or error
   */
  updateProfile: async function(userId, updates) {
    try {
      const response = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Upload a user avatar
   * @param {string} userId - User ID
   * @param {File} file - File object to upload
   * @returns {Promise<Object>} Object containing the upload result or error
   */
  uploadAvatar: async function(userId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const uploadResponse = await supabase.storage
        .from('user-content')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });
        
      if (uploadResponse.error) {
        return { data: null, error: uploadResponse.error };
      }
      
      // Get public URL for the uploaded file
      const urlResponse = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
        
      return { data: urlResponse.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

/**
 * Thread management utilities for TrueVibe emotion-aware posts
 */
export const threadUtils = {
  /**
   * Create a new thread
   * @param {Object} threadData - Thread data to insert
   * @returns {Promise<Object>} Object containing the created thread or error
   */
  createThread: async function(threadData) {
    try {
      const response = await supabase
        .from('threads')
        .insert([threadData])
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
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Get threads with pagination and emotion filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Object containing threads or error
   */
  getThreads: async function(options = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        emotion = null,
        userId = null,
        visibility = 'public'
      } = options;
      
      let query = supabase
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
        .eq('visibility', visibility)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (emotion) {
        query = query.eq('emotion', emotion);
      }
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const response = await query;
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Add reaction to a thread
   * @param {string} threadId - Thread ID
   * @param {string} userId - User ID
   * @param {string} reactionType - Type of reaction (resonate, support, learn, challenge, amplify)
   * @returns {Promise<Object>} Object containing the reaction or error
   */
  addReaction: async function(threadId, userId, reactionType) {
    try {
      const response = await supabase
        .from('reactions')
        .upsert([{
          thread_id: threadId,
          user_id: userId,
          reaction_type: reactionType
        }])
        .select()
        .single();
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

/**
 * Real-time subscription utilities for TrueVibe live features
 */
export const realtimeUtils = {
  /**
   * Subscribe to thread changes
   * @param {Function} callback - Function to call when threads change
   * @returns {Object} Subscription object
   */
  subscribeToThreads: function(callback) {
    return supabase
      .channel('threads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'threads'
      }, callback)
      .subscribe();
  },
  
  /**
   * Subscribe to reaction changes
   * @param {Function} callback - Function to call when reactions change
   * @returns {Object} Subscription object
   */
  subscribeToReactions: function(callback) {
    return supabase
      .channel('reactions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reactions'
      }, callback)
      .subscribe();
  },
  
  /**
   * Unsubscribe from a channel
   * @param {Object} subscription - Subscription object to unsubscribe
   */
  unsubscribe: function(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
};

/**
 * Storage utilities for TrueVibe media uploads
 */
export const storageUtils = {
  /**
   * Upload thread media
   * @param {string} userId - User ID
   * @param {File} file - File to upload
   * @param {string} type - Type of upload (thread, story)
   * @returns {Promise<Object>} Object containing upload result or error
   */
  uploadMedia: async function(userId, file, type = 'thread') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;
      
      const uploadResponse = await supabase.storage
        .from('user-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadResponse.error) {
        return { data: null, error: uploadResponse.error };
      }
      
      const urlResponse = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
        
      return { 
        data: {
          path: filePath,
          url: urlResponse.data.publicUrl,
          type: file.type
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  /**
   * Delete media file
   * @param {string} filePath - Path to file to delete
   * @returns {Promise<Object>} Object containing deletion result or error
   */
  deleteMedia: async function(filePath) {
    try {
      const response = await supabase.storage
        .from('user-content')
        .remove([filePath]);
        
      return { data: response.data, error: response.error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Export default client for compatibility
export default supabase;
