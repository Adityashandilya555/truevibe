
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingScreen from '../components/common/LoadingScreen';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Processing OAuth callback...');
        const result = await handleOAuthCallback();
        
        if (result.success) {
          console.log('OAuth callback successful, redirecting to home...');
          navigate('/home', { replace: true });
        } else {
          console.error('OAuth callback failed:', result.error);
          setError(result.error || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [handleOAuthCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">
            {error}
          </div>
          <div className="text-gray-400">
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default AuthCallbackPage;
