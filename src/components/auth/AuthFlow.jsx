import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const AuthFlow = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAdjectives, setSelectedAdjectives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const adjectives = [
    'Creative', 'Empathetic', 'Curious', 'Analytical', 'Optimistic',
    'Adventurous', 'Thoughtful', 'Passionate', 'Resilient', 'Innovative',
    'Compassionate', 'Ambitious', 'Authentic', 'Mindful', 'Inspiring'
  ];

  const handleAdjectiveToggle = (adjective) => {
    if (selectedAdjectives.includes(adjective)) {
      setSelectedAdjectives(selectedAdjectives.filter(a => a !== adjective));
    } else if (selectedAdjectives.length < 3) {
      setSelectedAdjectives([...selectedAdjectives, adjective]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validation for signup
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (selectedAdjectives.length !== 3) {
          throw new Error('Please select exactly 3 adjectives');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { data, error } = await signUp(email, password, selectedAdjectives);

        if (error) throw error;

        if (data.user) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate('/threads', { replace: true });
          }, 1500);
        }
      } else {
        // Sign in
        const { data, error } = await signIn(email, password);

        if (error) throw error;

        if (data.user) {
          setSuccess('Welcome back! Redirecting...');
          setTimeout(() => {
            navigate('/threads', { replace: true });
          }, 1000);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSelectedAdjectives([]);
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              TrueVibe
            </h1>
            <p className="text-gray-400 mt-2">
              {isSignUp ? 'Create your authentic profile' : 'Welcome back to your community'}
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-300 text-sm">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="••••••••"
                      required={isSignUp}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Adjective Selection (Sign Up only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium text-gray-300">
                    Choose 3 adjectives that describe you
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {adjectives.map((adjective) => (
                      <button
                        key={adjective}
                        type="button"
                        onClick={() => handleAdjectiveToggle(adjective)}
                        disabled={isLoading || (!selectedAdjectives.includes(adjective) && selectedAdjectives.length >= 3)}
                        className={`p-2 rounded-lg text-xs transition-all ${
                          selectedAdjectives.includes(adjective)
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } ${
                          !selectedAdjectives.includes(adjective) && selectedAdjectives.length >= 3
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {adjective}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Selected: {selectedAdjectives.length}/3
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (isSignUp && selectedAdjectives.length !== 3)}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              disabled={isLoading}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthFlow;