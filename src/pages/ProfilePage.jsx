import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import ProfileHeader from '../components/profile/ProfileHeader';
import StoriesCarousel from '../components/profile/StoriesCarousel';
import useAuthStore from '../store/authStore';
import useAppStore from '../store/appStore';

/**
 * Error Boundary component for catching errors in child components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Profile page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 my-4">
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p className="text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md text-red-800 dark:text-red-100 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Profile Page Component
 * 
 * Displays the user's profile header and stories carousel
 * with proper error boundaries and responsive layout
 */
const ProfilePage = () => {
  const { profile, isLoadingProfile } = useAuthStore();
  const { isDarkMode } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-4 px-4 sm:px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {isLoading || isLoadingProfile ? (
        <div className="space-y-4">
          {/* Profile header skeleton */}
          <div className="animate-pulse">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="mt-4 flex justify-center space-x-8">
              <div className="h-10 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          
          {/* Stories carousel skeleton */}
          <div className="mt-8 animate-pulse">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ErrorBoundary>
            <ProfileHeader />
          </ErrorBoundary>
          
          <div className="mt-8">
            <ErrorBoundary>
              <StoriesCarousel />
            </ErrorBoundary>
          </div>
          
          {/* Future sections can be added here */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Your recent threads and interactions will appear here.
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProfilePage;
