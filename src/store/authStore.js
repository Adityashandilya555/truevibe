
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../services/supabase';

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
      // State
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isLoadingProfile: false,
      error: null,
      selectedAdjectives: {
        one: '',
        two: '',
        three: ''
      },

      // Actions
      setAdjective: (position, adjective) => {
        set((state) => ({
          selectedAdjectives: {
            ...state.selectedAdjectives,
            [position]: adjective
          }
        }));
      },

      resetAdjectives: () => {
        set({
          selectedAdjectives: {
            one: '',
            two: '',
            three: ''
          }
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Sign up new user
      signUp: async (email, password, name = '', adjectives = null) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split('@')[0],
                adjectives: adjectives || get().selectedAdjectives
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            set({
              user: data.user,
              session: data.session,
              isLoading: false
            });
            
            // Create user profile
            await get().createUserProfile(data.user, name, adjectives || get().selectedAdjectives);
          }

          return { data, error: null };
        } catch (error) {
          console.error('Signup error:', error);
          set({
            error: error.message,
            isLoading: false
          });
          return { data: null, error };
        }
      },

      // Sign in existing user
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
            session: data.session,
            isLoading: false
          });

          // Fetch user profile
          if (data.user) {
            await get().fetchUserProfile(data.user.id);
          }

          return { data, error: null };
        } catch (error) {
          console.error('Signin error:', error);
          set({
            error: error.message,
            isLoading: false
          });
          return { data: null, error };
        }
      },

      // Sign out user
      signOut: async () => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase.auth.signOut();
          
          if (error) throw error;

          set({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            selectedAdjectives: {
              one: '',
              two: '',
              three: ''
            }
          });

          return { error: null };
        } catch (error) {
          console.error('Signout error:', error);
          set({
            error: error.message,
            isLoading: false
          });
          return { error };
        }
      },

      // Check authentication status
      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;

          if (session?.user) {
            set({
              user: session.user,
              session: session,
              isLoading: false
            });
            
            // Fetch user profile
            await get().fetchUserProfile(session.user.id);
          } else {
            set({
              user: null,
              profile: null,
              session: null,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            error: error.message
          });
        }
      },

      // Create user profile
      createUserProfile: async (user, name, adjectives) => {
        try {
          const profileData = {
            id: user.id,
            email: user.email,
            name: name || user.email.split('@')[0],
            adjective_one: adjectives?.one || '',
            adjective_two: adjectives?.two || '',
            adjective_three: adjectives?.three || '',
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          const { data, error } = await supabase
            .from('user_profiles')
            .insert([profileData])
            .select()
            .single();

          if (error) throw error;

          set({ profile: data });
          return { data, error: null };
        } catch (error) {
          console.error('Create profile error:', error);
          set({ error: error.message });
          return { data: null, error };
        }
      },

      // Fetch user profile
      fetchUserProfile: async (userId) => {
        set({ isLoadingProfile: true });

        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          set({
            profile: data,
            isLoadingProfile: false
          });

          return { data, error: null };
        } catch (error) {
          console.error('Fetch profile error:', error);
          set({
            profile: null,
            isLoadingProfile: false,
            error: error.message
          });
          return { data: null, error };
        }
      },

      // Update user profile
      updateProfile: async (updates) => {
        set({ isLoadingProfile: true });
        const { user } = get();

        if (!user) {
          set({ isLoadingProfile: false, error: 'No user logged in' });
          return { data: null, error: new Error('No user logged in') };
        }

        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          set({
            profile: data,
            isLoadingProfile: false
          });

          return { data, error: null };
        } catch (error) {
          console.error('Update profile error:', error);
          set({
            isLoadingProfile: false,
            error: error.message
          });
          return { data: null, error };
        }
      },

      // Upload avatar
      uploadAvatar: async (file) => {
        const { user } = get();
        
        if (!user) {
          set({ error: 'No user logged in' });
          return { data: null, error: new Error('No user logged in') };
        }

        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Math.random()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          // Update profile with new avatar URL
          await get().updateProfile({ avatar_url: data.publicUrl });

          return { data: data.publicUrl, error: null };
        } catch (error) {
          console.error('Upload avatar error:', error);
          set({ error: error.message });
          return { data: null, error };
        }
      }
    }),
    {
      name: 'truevibe-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        selectedAdjectives: state.selectedAdjectives
      })
    }
  )
);

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const { checkAuth } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    checkAuth();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      selectedAdjectives: {
        one: '',
        two: '',
        three: ''
      }
    });
  }
});

export default useAuthStore;
