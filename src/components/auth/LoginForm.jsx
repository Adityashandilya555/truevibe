import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import { HiShieldCheck, HiUserGroup, HiHeart } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';

/**
 * Modern Gmail OAuth login component for TrueVibe
 * Features gradient design, smooth animations, and social proof
 */
const LoginForm = ({ onEnterDemo }) => {
  const { signInWithGmail, isLoading, error, clearAuth } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    if (error) {
      clearAuth();
    }
  }, [error, clearAuth]);

  const handleGmailLogin = async () => {
    try {
      console.log('Starting Gmail login...');
      const result = await signInWithGmail();

      if (result.error) {
        console.error('Gmail login failed:', result.error);
        // Handle error - it should be shown via the store's error state
      } else {
        console.log('Gmail login initiated successfully');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const features = [
    {
      icon: HiShieldCheck,
      title: "Secure Authentication",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: HiUserGroup,
      title: "Connect Authentically", 
      description: "Share your true emotions in a supportive community"
    },
    {
      icon: HiHeart,
      title: "Emotion-Aware",
      description: "AI-powered emotion detection for meaningful connections"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">T</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TrueVibe</h1>
          <p className="text-blue-200 text-lg">Share your authentic emotions</p>
        </motion.div>

        {/* Main Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-200">Sign in to connect with your authentic self</p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-200 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Gmail OAuth Button */}
          <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGmailLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin text-xl" />
                      ) : (
                        <>
                          <FaGoogle className="text-xl" />
                          Continue with Gmail
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onEnterDemo}
                      className="w-full flex items-center justify-center gap-3 bg-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors border border-gray-600"
                    >
                      🚀 Try Demo Mode
                    </motion.button>
                  </div>

          {/* Privacy Notice */}
          <p className="text-xs text-blue-200 text-center mt-4 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Your emotional data is encrypted and never shared without consent.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 rounded-lg p-2">
                  <feature.icon className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                  <p className="text-blue-200 text-xs mt-1">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-blue-300 text-sm">
            Join thousands sharing their authentic emotions
          </p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white/20"
                />
              ))}
            </div>
            <span className="text-blue-300 text-xs ml-2">+5,000 users</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;