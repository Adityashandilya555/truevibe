import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { X, Menu, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Emotion-based color transitions
const EMOTION_COLORS = {
  joy: 'from-yellow-300 to-yellow-400',
  trust: 'from-green-300 to-green-500',
  fear: 'from-emerald-600 to-emerald-700',
  surprise: 'from-sky-300 to-sky-400',
  sadness: 'from-blue-400 to-blue-600',
  disgust: 'from-purple-400 to-purple-600',
  anger: 'from-red-400 to-red-600',
  anticipation: 'from-orange-300 to-orange-500',
  default: 'from-indigo-500 to-purple-600'
};

const TopBar = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  // State for hamburger menu, user dropdown, and sign out confirmation
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('default');
  
  // Refs for click outside detection
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const confirmDialogRef = useRef(null);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (confirmDialogRef.current && !confirmDialogRef.current.contains(event.target) && !event.target.closest('[data-signout-button]')) {
        setShowSignOutConfirm(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cycle through emotions every 15 seconds for color transitions
  useEffect(() => {
    const emotions = Object.keys(EMOTION_COLORS).filter(e => e !== 'default');
    let index = 0;
    
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[index]);
      index = (index + 1) % emotions.length;
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    setShowSignOutConfirm(false);
    navigate('/');
  };
  
  // Determine profile icon based on if user has uploaded avatar
  const getProfileIcon = () => {
    if (profile?.avatar_url) {
      return (
        <img 
          src={profile.avatar_url} 
          alt="Profile" 
          className="h-8 w-8 rounded-full object-cover border-2 border-white"
        />
      );
    }
    
    // Default icon if no avatar
    return (
      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
        {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
      </div>
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50 transition-colors duration-300">
      {/* Gradient background nav */}
      <nav className={`bg-gradient-to-r ${EMOTION_COLORS[currentEmotion]} transition-colors duration-1000 ease-in-out`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Hamburger */}
            <div className="flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-expanded={menuOpen ? 'true' : 'false'}
                aria-label="Open main menu"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-white tracking-tight">TrueVibe</span>
              </Link>
            </div>
            
            {/* Right side - User profile dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none min-h-[44px] min-w-[44px]"
                  aria-expanded={dropdownOpen ? 'true' : 'false'}
                  aria-label="Open user menu"
                >
                  {getProfileIcon()}
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
                
                {/* User dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Your Profile
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </div>
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="menuitem"
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowSignOutConfirm(true);
                        }}
                        data-signout-button
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/threads"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                Threads
              </Link>
              
              <Link
                to="/profile"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              
              <Link
                to="/settings"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
              
              <Link
                to="/help"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Documentation
              </Link>
              
              {user && (
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    setShowSignOutConfirm(true);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sign Out Confirmation Dialog */}
      {showSignOutConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div 
              ref={confirmDialogRef}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Sign out from TrueVibe?</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Are you sure you want to sign out? You'll need to sign in again to access your account.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowSignOutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
