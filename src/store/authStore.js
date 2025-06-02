import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      setAuth: (user, session) => {
        set({ 
          user, 
          session, 
          isLoading: false, 
          error: null 
        });
      },

      clearAuth: () => {
        set({ 
          user: null, 
          session: null, 
          isLoading: false, 
          error: null 
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      checkAuth: async () => {
        // This will be called by useAuth hook
        set({ isLoading: true });
      },

      // Helper getters
      isAuthenticated: () => {
        const { user, session } = get();
        return !!(user && session);
      }
    }),
    {
      name: 'truevibe-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      })
    }
  )
);

export default useAuthStore;