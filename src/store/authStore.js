import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: {
    id: 'demo-user-1',
    email: 'demo@truevibe.com',
    created_at: new Date().toISOString()
  },
  profile: {
    id: 'demo-user-1',
    username: 'DemoUser',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    adjective_one: 'Creative',
    adjective_two: 'Passionate',
    adjective_three: 'Empathetic',
    bio: 'Welcome to TrueVibe! This is a demo account.',
    created_at: new Date().toISOString()
  },
  isLoading: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => set({ user: null, profile: null })
}));

export default useAuthStore;