import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import TopBar from './components/navigation/TopBar';
import BottomTabs from './components/navigation/BottomTabs';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import useAuthStore from './store/authStore';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load main pages for better performance
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ThreadsPage = lazy(() => import('./pages/ThreadsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));


// Keep your ENTIRE AppLayout component
const AppLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <main className="flex-1 container mx-auto px-4 pt-16 pb-20 sm:pb-16">
        <Outlet />
      </main>
      <BottomTabs />
    </div>
  );
};
// Keep your ENTIRE RequireAuth component
const RequireAuth = () => {
  const { user, isLoading, error } = useAuthStore();
  const location = useLocation();
  
  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingScreen emotion="trust" message="Verifying your credentials..." />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Show error message if there's an authentication error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h2 className="text-lg font-medium text-red-800 mb-2">Authentication Error</h2>
          <p className="text-sm text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return <Outlet />;
};
// Keep your ENTIRE App function with ALL features
function App() {
  // FIXED: Only destructure what actually exists in your authStore
  const { user, isLoading, initializeAuth } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('joy');
  
  // Cycle through emotions for initial loading screen
  useEffect(() => {
    if (!initialLoading) return;
    
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
    let index = 0;
    
    function cycleEmotions() {
      index = (index + 1) % emotions.length;
      setCurrentEmotion(emotions[index]);
    }
    
    const interval = setInterval(cycleEmotions, 2000);
    return () => clearInterval(interval);
  }, [initialLoading]);
  
  // FIXED: Use your existing authStore's initializeAuth method
  useEffect(() => {
    let mounted = true;
    
    const handleAuthInitialization = async () => {
      try {
        // Use your sophisticated authStore method instead of duplicating logic
        await initializeAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        if (mounted) {
          // Set minimum display time for emotion cycling
          setTimeout(() => {
            setInitialLoading(false);
          }, 2000);
        }
      }
    };
    
    handleAuthInitialization();
    
    return () => {
      mounted = false;
    };
  }, [initializeAuth]);
  
  // Show initial loading screen with emotion cycling
  if (initialLoading || isLoading) {
    return <LoadingScreen emotion={currentEmotion} message="Welcome to TrueVibe" fullScreen={true} />;
  }
  
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen emotion="anticipation" message="Loading content..." />}>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/threads" replace /> : <LoginForm />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/threads" replace /> : <SignupForm />} 
            />
            
            {/* Home/Landing route - redirects to threads if logged in */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/threads" replace /> : <HomePage />} 
            />
            
            {/* Protected routes with AppLayout */}
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/threads" element={<ThreadsPage />} />
              </Route>
            </Route>
            
            {/* Fallback route - redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;