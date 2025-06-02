import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';
import useAuth from './useAuth';

/**
 * Custom hook for profile management
 * Provides profile fetching, updating, and avatar management capabilities
 * 
 * @returns {Object} Profile management state and methods
 */
const useProfile = () => {
  // Get auth state and methods
  const { 
    user, 
    profile, 
    isLoadingProfile, 
    error: authError,
    fetchUserProfile, 
    updateUserProfile, 
    updateAvatar,
    clearError: clearAuthError
  } = useAuth();
  
  // Local state
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    threadCount: 0,
    followerCount: 0,
    followingCount: 0
  });
  
  /**
   * Fetch profile stats (thread count, follower count, following count)
   */
  const fetchProfileStats = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      // Get thread count
      const { count: threadCount, error: threadError } = await supabase
        .from('threads')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (threadError) throw threadError;
      
      // Get follower count
      const { count: followerCount, error: followerError } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId);
      
      if (followerError) throw followerError;
      
      // Get following count
      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId);
      
      if (followingError) throw followingError;
      
      setStats({
        threadCount: threadCount || 0,
        followerCount: followerCount || 0,
        followingCount: followingCount || 0
      });
    } catch (err) {
      console.error('Error fetching profile stats:', err);
      setError('Failed to load profile statistics');
    }
  }, []);
  
  /**
   * Fetch followers for a user
   */
  const fetchFollowers = useCallback(async (userId) => {
    if (!userId) return;
    
    setIsLoadingFollowers(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          id,
          follower:follower_id(id, username, avatar_url),
          created_at
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFollowers(data.map(item => ({
        id: item.id,
        user: item.follower,
        createdAt: item.created_at
      })));
    } catch (err) {
      console.error('Error fetching followers:', err);
      setError('Failed to load followers');
    } finally {
      setIsLoadingFollowers(false);
    }
  }, []);
  
  /**
   * Fetch users that a user is following
   */
  const fetchFollowing = useCallback(async (userId) => {
    if (!userId) return;
    
    setIsLoadingFollowing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          id,
          following:following_id(id, username, avatar_url),
          created_at
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFollowing(data.map(item => ({
        id: item.id,
        user: item.following,
        createdAt: item.created_at
      })));
    } catch (err) {
      console.error('Error fetching following:', err);
      setError('Failed to load following users');
    } finally {
      setIsLoadingFollowing(false);
    }
  }, []);
  
  /**
   * Follow a user
   */
  const followUser = useCallback(async (targetUserId) => {
    if (!user) {
      setError('You must be logged in to follow users');
      return;
    }
    
    if (user.id === targetUserId) {
      setError('You cannot follow yourself');
      return;
    }
    
    setError(null);
    
    try {
      // Check if already following
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is not found error
        throw checkError;
      }
      
      if (existingFollow) {
        setError('You are already following this user');
        return;
      }
      
      // Create follow relationship
      const { error: followError } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });
      
      if (followError) throw followError;
      
      // Update local state
      if (user.id === profile?.id) {
        setStats(prev => ({
          ...prev,
          followingCount: prev.followingCount + 1
        }));
        
        // Refresh following list if we're viewing our own profile
        fetchFollowing(user.id);
      }
    } catch (err) {
      console.error('Error following user:', err);
      setError('Failed to follow user. Please try again.');
    }
  }, [user, profile, fetchFollowing]);
  
  /**
   * Unfollow a user
   */
  const unfollowUser = useCallback(async (targetUserId) => {
    if (!user) {
      setError('You must be logged in to unfollow users');
      return;
    }
    
    setError(null);
    
    try {
      // Delete follow relationship
      const { error: unfollowError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      
      if (unfollowError) throw unfollowError;
      
      // Update local state
      if (user.id === profile?.id) {
        setStats(prev => ({
          ...prev,
          followingCount: Math.max(0, prev.followingCount - 1)
        }));
        
        // Refresh following list if we're viewing our own profile
        fetchFollowing(user.id);
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      setError('Failed to unfollow user. Please try again.');
    }
  }, [user, profile, fetchFollowing]);
  
  /**
   * Check if current user is following a specific user
   */
  const isFollowing = useCallback(async (targetUserId) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is not found error
        throw error;
      }
      
      return !!data;
    } catch (err) {
      console.error('Error checking follow status:', err);
      return false;
    }
  }, [user]);
  
  /**
   * Update profile with new data
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    setError(null);
    
    try {
      await updateUserProfile(updates);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  }, [user, updateUserProfile]);
  
  /**
   * Upload and set avatar
   */
  const uploadProfileAvatar = useCallback(async (file) => {
    if (!user) {
      setError('You must be logged in to update your avatar');
      return;
    }
    
    if (!file) {
      setError('No file selected');
      return;
    }
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      return;
    }
    
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 2MB.');
      return;
    }
    
    setError(null);
    
    try {
      await updateAvatar(file);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar. Please try again.');
    }
  }, [user, updateAvatar]);
  
  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
    clearAuthError();
  }, [clearAuthError]);
  
  // Initialize profile data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfileStats(user.id);
    }
  }, [user, fetchProfileStats]);
  
  return {
    // State
    profile,
    followers,
    following,
    stats,
    isLoadingProfile,
    isLoadingFollowers,
    isLoadingFollowing,
    error: error || authError,
    
    // Methods
    fetchUserProfile,
    fetchProfileStats,
    fetchFollowers,
    fetchFollowing,
    followUser,
    unfollowUser,
    isFollowing,
    updateProfile,
    uploadProfileAvatar,
    clearError
  };
};

export default useProfile;

/**
 * TypeScript types (for documentation)
 * 
 * @typedef {Object} Profile
 * @property {string} id - Profile ID (same as user ID)
 * @property {string} username - Username
 * @property {string|null} avatar_url - URL to user avatar
 * @property {string} adjective_one - First descriptive adjective
 * @property {string} adjective_two - Second descriptive adjective
 * @property {string} adjective_three - Third descriptive adjective
 * 
 * @typedef {Object} ProfileStats
 * @property {number} threadCount - Number of threads created
 * @property {number} followerCount - Number of followers
 * @property {number} followingCount - Number of users being followed
 * 
 * @typedef {Object} FollowRelation
 * @property {string} id - Relation ID
 * @property {Object} user - User profile data
 * @property {string} createdAt - Creation timestamp
 */
