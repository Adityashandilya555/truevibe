
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, session, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMPORARY BYPASS - Set a mock user to skip authentication
    const mockUser = {
      id: 'mock-user-123',
      email: 'demo@truevibe.com',
      user_metadata: {
        adjectives: ['Creative', 'Empathetic', 'Curious']
      }
    };
    
    const mockSession = {
      user: mockUser,
      access_token: 'mock-token'
    };

    // Set mock auth immediately
    setAuth(mockUser, mockSession);
    setLoading(false);

    // Comment out Supabase auth for now
    /*
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          setAuth(session.user, session);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Error getting session:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setAuth(session.user, session);
        } else {
          clearAuth();
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
    */
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
