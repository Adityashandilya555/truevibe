import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

/**
 * Protected Route component that handles authentication guards
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  requireProfile = false 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check authentication status
  if (!user) {
    // Save attempted location for post-login redirect
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // User is authenticated, render children
  return children;
};

/**
 * Route component for guests only (login/signup pages)
 * Redirects to home if already authenticated
 */
export const GuestRoute = ({ children, redirectTo = '/home' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;