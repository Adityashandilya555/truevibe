import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Custom hook for authentication functionality
 * Wraps authStore and provides simplified authentication state and methods
 * 
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const navigate = useNavigate();

  // Select state from authStore
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const session = useAuthStore(state => state.session);
  const isLoading = useAuthStore(state => state.isLoading);
  const isLoadingProfile = useAuthStore(state => state.isLoadingProfile);
  const error = useAuthStore(state => state.error);
  const selectedAdjectives = useAuthStore(state => state.selectedAdjectives);

  // Select actions from authStore
  const signUp = useAuthStore(state => state.signUp);
  const signIn = useAuthStore(state => state.signIn);
  const signOut = useAuthStore(state => state.signOut);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const uploadAvatar = useAuthStore(state => state.uploadAvatar);
  const setAdjective = useAuthStore(state => state.setAdjective);
  const resetAdjectives = useAuthStore(state => state.resetAdjectives);
  const clearError = useAuthStore(state => state.clearError);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} redirectPath - Path to redirect to after login
   */
  const login = async (email, password, redirectPath = '/threads') => {
    try {
      await signIn(email, password);
      navigate(redirectPath);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @param {Object} adjectives - Selected adjectives
   */
  const register = async (email, password, name, adjectives) => {
    try {
      await signUp(email, password, name, adjectives);
      navigate('/threads');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user && !!session;

  return {
    // State
    user,
    profile,
    session,
    isLoading,
    isLoadingProfile,
    error,
    selectedAdjectives,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    signIn,
    signUp,
    signOut,
    checkAuth,
    fetchUserProfile,
    updateProfile,
    uploadAvatar,
    setAdjective,
    resetAdjectives,
    clearError
  };
};

export default useAuth;