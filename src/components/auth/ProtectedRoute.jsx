
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../common/LoadingScreen';

/**
 * Protected Route component that handles authentication guards
 * Redirects unauthenticated users to login page
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/login')
 * @param {boolean} props.requireProfile - Whether user profile is required (default: false)
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  requireProfile = false 
}) => {
  const { 
    user, 
    session, 
    profile,
    isLoading, 
    isInitialized,
    initialize,
    isAuthenticated
  } = useAuthStore();
  
  const location = useLocation();

  // Initialize auth state on mount if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [isInitialized, isLoading, initialize]);

  // Show loading screen while initializing or processing auth
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  // Check authentication status
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    // Save attempted location for post-login redirect
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Check if profile is required but missing
  if (requireProfile && !profile) {
    return (
      <Navigate 
        to="/profile/setup" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // User is authenticated, render children
  return children;
};

/**
 * Higher-order component for protecting routes
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Protection options
 * @returns {React.Component} Protected component
 */
export const withAuthProtection = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Route component for authenticated users only
 * Redirects to login if not authenticated
 */
export const AuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Route component for guests only (login/signup pages)
 * Redirects to home if already authenticated
 */
export const GuestRoute = ({ children, redirectTo = '/home' }) => {
  const { isAuthenticated, isInitialized, isLoading, initialize } = useAuthStore();
  
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [isInitialized, isLoading, initialize]);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
