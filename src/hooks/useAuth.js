
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
// Generate UUID for demo mode
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const useAuth = () => {
  const { user, session, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a proper UUID for demo user
    const demoUserId = generateUUID();
    
    const mockUser = {
      id: demoUserId,
      email: 'demo@truevibe.com',
      user_metadata: {
        adjectives: ['Creative', 'Empathetic', 'Curious']
      }
    };
    
    const mockSession = {
      user: mockUser,
      access_token: 'demo-token'
    };

    // Set demo auth immediately
    setAuth(mockUser, mockSession);
    setLoading(false);

    // Store demo user in localStorage for consistency
    localStorage.setItem('truevibe_demo_user', JSON.stringify(mockUser));
  }, [setAuth, clearAuth]);

  const signUp = async (email, password, adjectives) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            adjectives: adjectives
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: email.split('@')[0],
            adjective_one: adjectives[0],
            adjective_two: adjectives[1],
            adjective_three: adjectives[2]
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearAuth();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user && !!session
  };
};

export default useAuth;
