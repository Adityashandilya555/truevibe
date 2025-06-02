import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, handleAuthError, profileUtils, sessionUtils } from '../services/supabase';

/**
 * User authentication and profile store using Zustand
 * - Manages user authentication state
 * - Handles login, signup, and logout
 * - Persists session across page refreshes
 * - Manages profile creation and updates
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      profile: null,
      session: null,

      // Loading states
      isLoading: false,
      isLoadingProfile: false,

      // Error states
      error: null,

      // Adjective selection for signup
      selectedAdjectives: {
        one: '',
        two: '',
        three: ''
      },

      /**
       * Set the selected adjectives for user profile
       * @param {string} position - Which adjective to update (one, two, three)
       * @param {string} value - The adjective value
       */
      setAdjective: (position, value) => {
        set(state => ({
          selectedAdjectives: {
            ...state.selectedAdjectives,
            [position]: value
          }
        }));
      },

      /**
       * Reset all selected adjectives
       */
      resetAdjectives: () => {
        set({
          selectedAdjectives: {
            one: '',
            two: '',
            three: ''
          }
        });
      },

      /**
       * Initialize auth state from Supabase session
       */
      initializeAuth: async () => {
        set({ isLoading: true, error: null });

        try {
          // Get current session
          const session = await sessionUtils.getCurrentSession();

          if (session) {
            const user = session.user;
            set({ user, session });

            // Fetch user profile
            await get().fetchUserProfile(user.id);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Fetch user profile by ID
       * @param {string} userId - User ID to fetch profile for
       */
      fetchUserProfile: async (userId) => {
        set({ isLoadingProfile: true });

        try {
          const { data, error } = await profileUtils.getProfileById(userId);

          if (error) throw error;

          if (data) {
            set({ profile: data });
          } else {
            // If no profile exists but user is authenticated, create one
            const user = get().user;
            if (user) {
              await get().createUserProfile(user.id, user.email);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      /**
       * Create a new user profile
       * @param {string} userId - User ID
       * @param {string} email - User email
       */
      createUserProfile: async (userId, email) => {
        const { selectedAdjectives } = get();

        // Extract username from email (before the @)
        const username = email.split('@')[0];

        const newProfile = {
          id: userId,
          username,
          avatar_url: null,
          adjective_one: selectedAdjectives.one || 'Creative',
          adjective_two: selectedAdjectives.two || 'Thoughtful',
          adjective_three: selectedAdjectives.three || 'Curious'
        };

        try {
          const { data, error } = await profileUtils.createProfile(newProfile);

          if (error) throw error;

          set({ profile: data });
          get().resetAdjectives();
        } catch (error) {
          console.error('Error creating profile:', error);
          set({ error: handleAuthError(error) });
        }
      },

      /**
       * Update user profile
       * @param {Object} updates - Profile fields to update
       */
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoadingProfile: true });

        try {
          const { data, error } = await profileUtils.updateProfile(user.id, updates);

          if (error) throw error;

          set({ profile: data });
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      /**
       * Upload user avatar
       * @param {File} file - Image file to upload
       */
      uploadAvatar: async (file) => {
        const { user } = get();
        if (!user) return;

        set({ isLoadingProfile: true });

        try {
          const { data, error } = await profileUtils.uploadAvatar(user.id, file);

          if (error) throw error;

          // Update profile with new avatar URL
          await get().updateProfile({
            avatar_url: data.publicUrl
          });
        } catch (error) {
          console.error('Error uploading avatar:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      /**
       * Sign up with email and password
       * @param {string} email - User email
       * @param {string} password - User password
       */
      signUp: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          });

          if (error) throw error;

          // If auto-confirmation is enabled
          if (data?.user && data?.session) {
            set({
              user: data.user,
              session: data.session
            });

            // Create user profile with selected adjectives
            await get().createUserProfile(data.user.id, email);
          } else {
            // If email confirmation is required
            set({
              user: null,
              session: null,
              message: 'Please check your email for confirmation link'
            });
          }
        } catch (error) {
          console.error('Signup error:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Sign in with email and password
       * @param {string} email - User email
       * @param {string} password - User password
       */
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          set({
            user: data.user,
            session: data.session
          });

          // Fetch or create user profile
          await get().fetchUserProfile(data.user.id);
        } catch (error) {
          console.error('Login error:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Sign out current user
       */
      signOut: async () => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          set({
            user: null,
            session: null,
            profile: null
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: handleAuthError(error) });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Clear any error messages
       */
      clearError: () => {
        set({ error: null });
      },

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      set({ user, loading: false });
      return user;
    } catch (error) {
      console.error('Auth check error:', error);
      set({ error: error.message, loading: false, user: null });
      return null;
    }
  },
    }),
    {
      name: 'truevibe-auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuthStore;
export { useAuthStore };