
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';

/**
 * OAuth callback page that handles authentication redirects
 * Processes the OAuth response and redirects to appropriate page
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { handleAuthCallback, isLoading, error } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleAuthCallback();
        
        if (result.success) {
          // Redirect will be handled by auth state change
          console.log('OAuth callback successful');
        } else {
          console.error('OAuth callback failed:', result.error);
          navigate('/login?error=auth_failed', { replace: true });
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        navigate('/login?error=callback_failed', { replace: true });
      }
    };

    processCallback();
  }, [handleAuthCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <LoadingScreen message="Completing authentication..." />;
};

export default AuthCallbackPage;
