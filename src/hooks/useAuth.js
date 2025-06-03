
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService from '../services/auth';

/**
 * Enhanced authentication hook for TrueVibe app
 * Provides authentication methods, state management, and OAuth handling
 * 
 * @returns {Object} Authentication methods and state
 */
const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    error,
    setAuth,
    clearAuth,
    setLoading,
    setError,
    initialize,
    signInWithGmail,
    handleOAuthCallback,
    signOut,
    refreshSession,
    isAuthenticated,
    getUserId,
    getUserEmail,
    getUserProfile
  } = useAuthStore();

  const [authListenerSetup, setAuthListenerSetup] = useState(false);

  // Initialize authentication state on first load
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Set up auth state change listener
  useEffect(() => {
    if (!authListenerSetup && isInitialized) {
      const { data: authListener } = authService.onAuthStateChange(
        async (event, session, profile) => {
          console.log('Auth state change:', event);
          
          switch (event) {
            case 'SIGNED_IN':
              if (session?.user) {
                setAuth(session.user, session, profile);
                
                // Redirect to intended page or home
                const intendedPath = location.state?.from || '/home';
                navigate(intendedPath, { replace: true });
              }
              break;
              
            case 'SIGNED_OUT':
              clearAuth();
              navigate('/login', { replace: true });
              break;
              
            case 'TOKEN_REFRESHED':
              if (session?.user) {
                setAuth(session.user, session, profile);
              }
              break;
              
            default:
              // Handle other auth events if needed
              break;
          }
        }
      );

      setAuthListenerSetup(true);

      // Cleanup listener on unmount
      return () => {
        if (authListener?.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    }
  }, [authListenerSetup, isInitialized, setAuth, clearAuth, navigate, location.state]);

  /**
   * Handle Gmail OAuth login
   * @returns {Promise<Object>} Login result
   */
  const loginWithGmail = async () => {
    try {
      setError(null);
      const result = await signInWithGmail();
      return result;
    } catch (error) {
      console.error('Gmail login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Handle OAuth callback from redirect
   * @returns {Promise<Object>} Callback handling result
   */
  const handleAuthCallback = async () => {
    try {
      setLoading(true);
      const result = await handleOAuthCallback();
      
      if (result.success) {
        // Redirect will be handled by auth state change listener
        return result;
      } else {
        setError(result.error);
        navigate('/login', { replace: true });
        return result;
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setError(error.message);
      navigate('/login', { replace: true });
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign out current user
   * @returns {Promise<Object>} Sign out result
   */
  const logout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/login', { replace: true });
      }
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Refresh user session
   * @returns {Promise<Object>} Refresh result
   */
  const refreshUserSession = async () => {
    try {
      return await refreshSession();
    } catch (error) {
      console.error('Session refresh error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user has completed profile setup
   * @returns {boolean} Whether profile is complete
   */
  const isProfileComplete = () => {
    if (!profile) return false;
    
    return !!(
      profile.username &&
      profile.adjective_one &&
      profile.adjective_two &&
      profile.adjective_three
    );
  };

  /**
   * Get user's display name
   * @returns {string} User's display name
   */
  const getDisplayName = () => {
    if (profile?.username) return profile.username;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Anonymous User';
  };

  /**
   * Get user's avatar URL
   * @returns {string|null} Avatar URL or null
   */
  const getAvatarUrl = () => {
    return profile?.avatar_url || 
           user?.user_metadata?.avatar_url || 
           user?.user_metadata?.picture || 
           null;
  };

  return {
    // State
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    error,
    isAuthenticated: isAuthenticated(),
    
    // Methods
    loginWithGmail,
    logout,
    handleAuthCallback,
    refreshUserSession,
    
    // Utilities
    getUserId,
    getUserEmail,
    getUserProfile,
    isProfileComplete,
    getDisplayName,
    getAvatarUrl,
    
    // Actions
    clearError: () => setError(null),
    setLoading
  };
};

export default useAuth;
