import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Emotion-based adjectives with Plutchik's color mapping
const ADJECTIVE_OPTIONS = {
  // Joy (Yellow)
  joy: [
    { value: 'joyful', color: 'bg-yellow-400' },
    { value: 'cheerful', color: 'bg-yellow-400' },
    { value: 'happy', color: 'bg-yellow-400' },
    { value: 'optimistic', color: 'bg-yellow-300' },
  ],
  // Trust (Green)
  trust: [
    { value: 'trustworthy', color: 'bg-green-400' },
    { value: 'loyal', color: 'bg-green-400' },
    { value: 'reliable', color: 'bg-green-500' },
    { value: 'honest', color: 'bg-green-300' },
  ],
  // Fear (Dark Green)
  fear: [
    { value: 'cautious', color: 'bg-emerald-700' },
    { value: 'vigilant', color: 'bg-emerald-700' },
    { value: 'alert', color: 'bg-emerald-600' },
  ],
  // Surprise (Light Blue)
  surprise: [
    { value: 'spontaneous', color: 'bg-sky-300' },
    { value: 'curious', color: 'bg-sky-400' },
    { value: 'inquisitive', color: 'bg-sky-300' },
  ],
  // Sadness (Blue)
  sadness: [
    { value: 'reflective', color: 'bg-blue-500' },
    { value: 'thoughtful', color: 'bg-blue-400' },
    { value: 'deep', color: 'bg-blue-600' },
  ],
  // Disgust (Purple)
  disgust: [
    { value: 'discerning', color: 'bg-purple-500' },
    { value: 'selective', color: 'bg-purple-400' },
    { value: 'critical', color: 'bg-purple-600' },
  ],
  // Anger (Red)
  anger: [
    { value: 'passionate', color: 'bg-red-500' },
    { value: 'intense', color: 'bg-red-600' },
    { value: 'determined', color: 'bg-red-400' },
  ],
  // Anticipation (Orange)
  anticipation: [
    { value: 'creative', color: 'bg-orange-400' },
    { value: 'innovative', color: 'bg-orange-500' },
    { value: 'visionary', color: 'bg-orange-300' },
  ],
};

// Flatten adjective options for selection
const ALL_ADJECTIVES = Object.values(ADJECTIVE_OPTIONS).flat();

// Enhanced error handling for auth
const AUTH_ERRORS = {
  'Invalid login credentials': 'Invalid email or password. Please check your credentials.',
  'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
  'User already registered': 'An account with this email already exists. Try signing in instead.',
  'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
};

const AuthFlow = () => {
  // Auth store state and actions
  const { 
    signUp, 
    signIn, 
    error, 
    isLoading, 
    clearError,
    setAdjective,
    selectedAdjectives
  } = useAuthStore();

  const navigate = useNavigate();

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Small delay to ensure state is updated
    setTimeout(() => {
      navigate('/threads');
    }, 100);
  };

  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Clear errors when switching between login/signup
  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [isLogin, clearError]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (signup only)
    if (!isLogin) {
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      // Adjective validation
      if (!isLogin && (!selectedAdjectives.one || !selectedAdjectives.two || !selectedAdjectives.three)) {
        errors.adjectives = 'Please select three adjectives that describe you';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isLogin) {
        // Login
        const result = await signIn(email, password);
        if (result.error) {
          setFormErrors({ submit: result.error.message });
        } else {
          handleAuthSuccess();
        }
      } else {
        // Signup
        const result = await signUp(email, password, '', selectedAdjectives);
        if (result.error) {
          setFormErrors({ submit: result.error.message });
        } else {
          handleAuthSuccess();
        }
      }
  };

  // Handle adjective selection
  const handleAdjectiveSelect = (position, adjective) => {
    // Prevent selecting the same adjective twice
    const currentSelections = Object.values(selectedAdjectives);
    if (currentSelections.includes(adjective.value) && selectedAdjectives[position] !== adjective.value) {
      return;
    }

    setAdjective(position, adjective.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        {/* Logo and Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">TrueVibe</h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Error message from Supabase */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={clearError}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Signup only) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {/* Adjectives Selection (Signup only) */}
          {!isLogin && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">Choose 3 adjectives that describe you</h3>

              {/* Display validation error */}
              {formErrors.adjectives && (
                <p className="text-sm text-red-600">{formErrors.adjectives}</p>
              )}

              {/* First Adjective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Adjective: {selectedAdjectives.one ? selectedAdjectives.one : 'Select one'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ADJECTIVES.map((adj) => (
                    <button
                      key={`one-${adj.value}`}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm text-white ${adj.color} ${selectedAdjectives.one === adj.value ? 'ring-2 ring-offset-2 ring-gray-500' : 'opacity-80 hover:opacity-100'}`}
                      onClick={() => handleAdjectiveSelect('one', adj)}
                    >
                      {adj.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Second Adjective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Adjective: {selectedAdjectives.two ? selectedAdjectives.two : 'Select one'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ADJECTIVES.map((adj) => (
                    <button
                      key={`two-${adj.value}`}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm text-white ${adj.color} ${selectedAdjectives.two === adj.value ? 'ring-2 ring-offset-2 ring-gray-500' : 'opacity-80 hover:opacity-100'}`}
                      onClick={() => handleAdjectiveSelect('two', adj)}
                    >
                      {adj.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Third Adjective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Third Adjective: {selectedAdjectives.three ? selectedAdjectives.three : 'Select one'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ADJECTIVES.map((adj) => (
                    <button
                      key={`three-${adj.value}`}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm text-white ${adj.color} ${selectedAdjectives.three === adj.value ? 'ring-2 ring-offset-2 ring-gray-500' : 'opacity-80 hover:opacity-100'}`}
                      onClick={() => handleAdjectiveSelect('three', adj)}
                    >
                      {adj.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Toggle between login/signup */}
          <div className="text-sm text-center">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up now' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthFlow;