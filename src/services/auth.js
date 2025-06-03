
import { supabase } from './supabase';

/**
 * Authentication service for TrueVibe app
 * Handles Gmail OAuth, session management, and user profiles
 */
export const authService = {
  /**
   * Sign in with Gmail OAuth
   * @returns {Promise<Object>} Authentication result
   */
  signInWithGmail: async () => {
    try {
      console.log('Starting Gmail login...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });

      if (error) {
        console.error('OAuth initiation error:', error);
        throw error;
      }
      
      console.log('Gmail login initiated successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Gmail OAuth error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<Object>} Sign out result
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data
      localStorage.removeItem('truevibe-user-profile');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  },

  /**
   * Get current session
   * @returns {Promise<Object>} Current session data
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data: data.session, error: null };
    } catch (error) {
      console.error('Session fetch error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get current user
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data: data.user, error: null };
    } catch (error) {
      console.error('User fetch error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Create or update user profile after OAuth
   * @param {Object} user - User object from Supabase auth
   * @returns {Promise<Object>} Profile creation result
   */
  createOrUpdateProfile: async (user) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email,
        username: user.user_metadata.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
        adjective_one: 'Creative',
        adjective_two: 'Authentic', 
        adjective_three: 'Connected',
        updated_at: new Date().toISOString()
      };

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{ ...profileData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (error) {
      console.error('Profile creation/update error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Handle OAuth callback and complete authentication
   * @returns {Promise<Object>} Callback handling result
   */
  handleOAuthCallback: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session?.user) {
        // Create or update user profile
        const profileResult = await authService.createOrUpdateProfile(data.session.user);
        if (profileResult.error) {
          console.warn('Profile creation warning:', profileResult.error);
        }

        return { 
          data: { 
            user: data.session.user, 
            session: data.session,
            profile: profileResult.data 
          }, 
          error: null 
        };
      }

      return { data: null, error: 'No session found' };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Refresh the current session
   * @returns {Promise<Object>} Refresh result
   */
  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { data: data.session, error: null };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Set up auth state change listener
   * @param {Function} callback - Callback function for auth changes
   * @returns {Object} Subscription object
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Ensure profile exists for signed in user
        const profileResult = await authService.createOrUpdateProfile(session.user);
        callback(event, session, profileResult.data);
      } else {
        callback(event, session, null);
      }
    });
  }
};

export default authService;
