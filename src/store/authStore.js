
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth';

/**
 * Zustand store for authentication state management
 * Handles user session, profile data, and auth operations
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      setAuth: (user, session, profile = null) => {
        set({ 
          user, 
          session, 
          profile,
          isLoading: false, 
          error: null,
          isInitialized: true
        });
      },

      clearAuth: () => {
        set({ 
          user: null, 
          session: null, 
          profile: null,
          isLoading: false, 
          error: null,
          isInitialized: true
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      /**
       * Initialize authentication state
       */
      initialize: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { data: session, error } = await authService.getCurrentSession();
          
          if (error) {
            throw new Error(error);
          }

          if (session?.user) {
            // Get user profile
            const { data: profile } = await authService.createOrUpdateProfile(session.user);
            set({ 
              user: session.user, 
              session, 
              profile,
              isLoading: false,
              isInitialized: true,
              error: null 
            });
          } else {
            set({ 
              user: null, 
              session: null, 
              profile: null,
              isLoading: false,
              isInitialized: true,
              error: null 
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            error: error.message, 
            isLoading: false,
            isInitialized: true,
            user: null,
            session: null,
            profile: null
          });
        }
      },

      /**
       * Sign in with Gmail OAuth
       */
      signInWithGmail: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await authService.signInWithGmail();
          
          if (error) {
            throw new Error(error);
          }

          // OAuth redirect will happen, state will be updated via callback
          return { success: true, error: null };
        } catch (error) {
          console.error('Gmail sign in error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Handle OAuth callback
       */
      handleOAuthCallback: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await authService.handleOAuthCallback();
          
          if (error) {
            throw new Error(error);
          }

          if (data) {
            set({ 
              user: data.user, 
              session: data.session,
              profile: data.profile,
              isLoading: false,
              isInitialized: true,
              error: null 
            });
            return { success: true, data };
          }

          throw new Error('No authentication data received');
        } catch (error) {
          console.error('OAuth callback error:', error);
          set({ 
            error: error.message, 
            isLoading: false,
            isInitialized: true
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Sign out current user
       */
      signOut: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await authService.signOut();
          
          if (error) {
            throw new Error(error);
          }

          set({ 
            user: null, 
            session: null, 
            profile: null,
            isLoading: false, 
            error: null 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Sign out error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      /**
       * Refresh current session
       */
      refreshSession: async () => {
        try {
          const { data, error } = await authService.refreshSession();
          
          if (error) {
            throw new Error(error);
          }

          if (data?.user) {
            const { data: profile } = await authService.createOrUpdateProfile(data.user);
            set({ 
              user: data.user, 
              session: data,
              profile,
              error: null 
            });
          }

          return { success: true };
        } catch (error) {
          console.error('Session refresh error:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Getters
      isAuthenticated: () => {
        const { user, session } = get();
        return !!(user && session);
      },

      getUserId: () => {
        const { user } = get();
        return user?.id || null;
      },

      getUserEmail: () => {
        const { user } = get();
        return user?.email || null;
      },

      getUserProfile: () => {
        const { profile } = get();
        return profile;
      }
    }),
    {
      name: 'truevibe-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
        isInitialized: state.isInitialized
      })
    }
  )
);

export default useAuthStore;
