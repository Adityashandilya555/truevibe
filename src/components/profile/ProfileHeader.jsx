import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../services/supabase';
import LoadingScreen from '../common/LoadingScreen';

// Emotion-based colors for adjective tags using Plutchik's wheel
const ADJECTIVE_COLORS = {
  // Joy (Yellow)
  creative: 'bg-yellow-400 text-yellow-900',
  playful: 'bg-yellow-300 text-yellow-900',
  enthusiastic: 'bg-yellow-400 text-yellow-900',
  // Trust (Green)
  honest: 'bg-green-400 text-green-900',
  loyal: 'bg-green-500 text-white',
  supportive: 'bg-green-300 text-green-900',
  // Fear (Dark Green)
  cautious: 'bg-emerald-700 text-white',
  vigilant: 'bg-emerald-700 text-white',
  alert: 'bg-emerald-600 text-white',
  // Surprise (Light Blue)
  spontaneous: 'bg-sky-300 text-sky-900',
  curious: 'bg-sky-400 text-sky-900',
  inquisitive: 'bg-sky-300 text-sky-900',
  // Sadness (Blue)
  reflective: 'bg-blue-500 text-white',
  thoughtful: 'bg-blue-400 text-white',
  deep: 'bg-blue-600 text-white',
  // Disgust (Purple)
  discerning: 'bg-purple-500 text-white',
  selective: 'bg-purple-400 text-white',
  critical: 'bg-purple-600 text-white',
  // Anger (Red)
  passionate: 'bg-red-500 text-white',
  intense: 'bg-red-600 text-white',
  determined: 'bg-red-400 text-white',
  // Anticipation (Orange)
  innovative: 'bg-orange-500 text-white',
  visionary: 'bg-orange-300 text-orange-900',
  // Default fallback
  default: 'bg-gray-300 text-gray-800'
};

const tagAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 }
};

const ProfileHeader = () => {
  const { profile, user, updateProfile, uploadAvatar, isLoadingProfile } = useAuthStore();
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    adjective_one: '',
    adjective_two: '',
    adjective_three: ''
  });
  
  // State for stats (these would come from API in a real app)
  const [stats, setStats] = useState({
    threads: 0,
    followers: 0,
    following: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch real stats from Supabase
  const fetchProfileStats = async () => {
    if (!user) return;
    
    setIsLoadingStats(true);
    try {
      // Get thread count
      const { count: threadsCount, error: threadsError } = await supabase
        .from('threads')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
        
      if (threadsError) throw threadsError;
      
      // Get followers count
      const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('follower_id', { count: 'exact' })
        .eq('followed_id', user.id);
        
      if (followersError) throw followersError;
      
      // Get following count
      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('followed_id', { count: 'exact' })
        .eq('follower_id', user.id);
        
      if (followingError) throw followingError;
      
      setStats({
        threads: threadsCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Refs for file input
  const fileInputRef = React.useRef();
  
  // Initialize edit form when profile changes
  React.useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || '',
        adjective_one: profile.adjective_one || '',
        adjective_two: profile.adjective_two || '',
        adjective_three: profile.adjective_three || ''
      });
      
      // Fetch real stats from Supabase
      fetchProfileStats();
    }
  }, [profile]);
  
  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type and size
    const isImage = file.type.match('image.*');
    const isSizeValid = file.size <= 2 * 1024 * 1024; // 2MB max
    
    if (!isImage) {
      alert('Please upload an image file');
      return;
    }
    
    if (!isSizeValid) {
      alert('Image size should be less than 2MB');
      return;
    }
    
    await uploadAvatar(file);
  };
  
  // Open file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(editForm);
    setIsEditModalOpen(false);
  };
  
  // Get appropriate color for an adjective
  const getAdjectiveColor = (adjective) => {
    if (!adjective) return ADJECTIVE_COLORS.default;
    
    const adjLower = adjective.toLowerCase();
    return ADJECTIVE_COLORS[adjLower] || ADJECTIVE_COLORS.default;
  };
  
  // Render adjective tag with correct color
  const renderAdjectiveTag = (adjective, index) => {
    if (!adjective) return null;
    
    const colorClass = getAdjectiveColor(adjective);
    
    return (
      <motion.span
        key={`${adjective}-${index}`}
        className={`inline-block px-3 py-1 rounded-full text-sm ${colorClass}`}
        initial="initial"
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        variants={tagAnimation}
        transition={{ delay: index * 0.1 }}
      >
        <span className="inline-block truncate max-w-[100px] sm:max-w-full">
          {adjective}
        </span>
      </motion.span>
    );
  };

  if (isLoadingProfile || !profile) {
    return <LoadingScreen emotion="trust" message="Loading profile..." />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center">
          {/* Avatar */}
          <div className="relative group mb-4 sm:mb-0 sm:mr-6">
            <div 
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
              onClick={triggerFileInput}
            >
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white text-2xl font-bold">
                  {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            
            {/* Upload overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={triggerFileInput}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          {/* User info */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {profile?.username || 'Loading...'}
            </h2>
            
            {/* Adjectives */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              {profile?.adjective_one && renderAdjectiveTag(profile.adjective_one, 0)}
              {profile?.adjective_two && renderAdjectiveTag(profile.adjective_two, 1)}
              {profile?.adjective_three && renderAdjectiveTag(profile.adjective_three, 2)}
            </div>
            
            {/* Edit button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 min-h-[44px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 text-center">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="p-2 sm:p-3">
              <div className="text-lg sm:text-xl font-bold">{value}</div>
              <div className="text-xs sm:text-sm text-gray-500 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              {/* Adjectives */}
              <div>
                <label htmlFor="adjective_one" className="block text-sm font-medium text-gray-700">First Adjective</label>
                <input
                  type="text"
                  id="adjective_one"
                  name="adjective_one"
                  value={editForm.adjective_one}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="adjective_two" className="block text-sm font-medium text-gray-700">Second Adjective</label>
                <input
                  type="text"
                  id="adjective_two"
                  name="adjective_two"
                  value={editForm.adjective_two}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="adjective_three" className="block text-sm font-medium text-gray-700">Third Adjective</label>
                <input
                  type="text"
                  id="adjective_three"
                  name="adjective_three"
                  value={editForm.adjective_three}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 min-h-[44px] border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 min-h-[44px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
