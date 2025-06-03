import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { localAuth } from '../services/localAuth';

const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    profile,
    isLoading,
    setUser,
    setProfile,
    setLoading,
    logout: storeLogout
  } = useAuthStore();

  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const { user } = await localAuth.getCurrentUser();
        if (user) {
          const { profile } = await localAuth.getCurrentProfile();
          setUser(user);
          setProfile(profile);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [setUser, setProfile, setLoading]);

  const signUp = async (email, password, username) => {
    setLoading(true);
    setError(null);

    try {
      const { user, profile, error } = await localAuth.signUp(email, password, username);

      if (error) {
        setError(error);
        return { success: false, error };
      }

      setUser(user);
      setProfile(profile);
      navigate('/home', { replace: true });
      return { success: true, user, profile };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const { user, profile, error } = await localAuth.signIn(email, password);

      if (error) {
        setError(error);
        return { success: false, error };
      }

      setUser(user);
      setProfile(profile);

      // Redirect to intended page or home
      const intendedPath = location.state?.from || '/home';
      navigate(intendedPath, { replace: true });
      return { success: true, user, profile };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await localAuth.signOut();
      storeLogout();
      navigate('/login', { replace: true });
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);

    try {
      const { profile, error } = await localAuth.updateProfile(updates);

      if (error) {
        setError(error);
        return { success: false, error };
      }

      setProfile(profile);
      return { success: true, profile };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getUserId = () => {
    return user?.id || null;
  };

  const getUserEmail = () => {
    return user?.email || null;
  };

  const getUserProfile = () => {
    return profile;
  };

  const getDisplayName = () => {
    if (profile?.username) return profile.username;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'Anonymous User';
  };

  const getAvatarUrl = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url || null;
  };

  return {
    // State
    user,
    profile,
    isLoading,
    isInitialized,
    error,
    isAuthenticated: isAuthenticated(),

    // Methods
    signUp,
    signIn,
    logout,
    updateProfile,

    // Utilities
    getUserId,
    getUserEmail,
    getUserProfile,
    getDisplayName,
    getAvatarUrl,

    // Actions
    clearError: () => setError(null),
    setLoading
  };
};

export default useAuth;