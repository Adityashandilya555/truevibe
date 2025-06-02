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
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const uploadAvatar = useAuthStore(state => state.uploadAvatar);
  const setAdjective = useAuthStore(state => state.setAdjective);
  const resetAdjectives = useAuthStore(state => state.resetAdjectives);
  const clearError = useAuthStore(state => state.clearError);
  
  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} redirectPath - Path to redirect to after login
   */
  const login = async (email, password, redirectPath = '/home') => {
    await signIn(email, password);
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      navigate(redirectPath);
    }
  };
  
  /**
   * Register with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} redirectPath - Path to redirect to after registration
   */
  const register = async (email, password, redirectPath = '/profile') => {
    await signUp(email, password);
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      navigate(redirectPath);
    }
  };
  
  /**
   * Logout the current user
   * @param {string} redirectPath - Path to redirect to after logout
   */
  const logout = async (redirectPath = '/') => {
    await signOut();
    navigate(redirectPath);
  };
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const isAuthenticated = () => {
    return !!session && !!user;
  };
  
  /**
   * Update user profile with new data
   * @param {Object} updates - Profile fields to update
   */
  const updateUserProfile = async (updates) => {
    await updateProfile(updates);
  };
  
  /**
   * Upload and set user avatar
   * @param {File} file - Image file to upload
   */
  const updateAvatar = async (file) => {
    await uploadAvatar(file);
  };
  
  return {
    // State
    user,
    profile,
    session,
    isLoading,
    isLoadingProfile,
    error,
    selectedAdjectives,
    
    // Auth methods
    login,
    register,
    logout,
    isAuthenticated,
    
    // Profile methods
    updateUserProfile,
    updateAvatar,
    fetchUserProfile,
    
    // Adjective methods
    setAdjective,
    resetAdjectives,
    
    // Utility methods
    clearError,
  };
};

export default useAuth;

/**
 * TypeScript types (for documentation)
 * 
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * 
 * @typedef {Object} Profile
 * @property {string} id - Profile ID (same as user ID)
 * @property {string} username - Username
 * @property {string|null} avatar_url - URL to user avatar
 * @property {string} adjective_one - First descriptive adjective
 * @property {string} adjective_two - Second descriptive adjective
 * @property {string} adjective_three - Third descriptive adjective
 * 
 * @typedef {Object} Session
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - JWT refresh token
 * @property {User} user - User object
 */
