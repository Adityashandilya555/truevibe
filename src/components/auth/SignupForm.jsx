import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Signup form component with email/password authentication
 * Integrates with Zustand auth store for state management
 * Includes adjective selection for user profile
 */
const SignupForm = () => {
  // Get auth store functions and state
  const { 
    signUp, 
    error, 
    isLoading, 
    clearError,
    selectedAdjectives,
    setAdjective
  } = useAuthStore();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Adjective options based on Plutchik's emotion wheel
  const adjectiveOptions = {
    one: ['Joyful', 'Optimistic', 'Peaceful', 'Loving', 'Grateful', 'Excited'],
    two: ['Creative', 'Curious', 'Thoughtful', 'Focused', 'Determined', 'Brave'],
    three: ['Compassionate', 'Empathetic', 'Authentic', 'Resilient', 'Mindful', 'Balanced']
  };
  
  // Clear auth store errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!selectedAdjectives.one) {
      errors.adjective1 = 'Please select your first adjective';
    }
    
    if (!selectedAdjectives.two) {
      errors.adjective2 = 'Please select your second adjective';
    }
    
    if (!selectedAdjectives.three) {
      errors.adjective3 = 'Please select your third adjective';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      await signUp(email, password, name, selectedAdjectives);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join TrueVibe</h1>
        <p className="text-gray-600 dark:text-gray-400">Create your account to get started</p>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg"
          role="alert"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            placeholder="Your name"
            disabled={isLoading}
            aria-invalid={formErrors.name ? 'true' : 'false'}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
            placeholder="you@example.com"
            disabled={isLoading}
            aria-invalid={formErrors.email ? 'true' : 'false'}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-10`}
              placeholder="u2022u2022u2022u2022u2022u2022u2022u2022"
              disabled={isLoading}
              aria-invalid={formErrors.password ? 'true' : 'false'}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-10`}
              placeholder="u2022u2022u2022u2022u2022u2022u2022u2022"
              disabled={isLoading}
              aria-invalid={formErrors.confirmPassword ? 'true' : 'false'}
            />
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Choose 3 adjectives that describe you</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">These will be visible on your profile</p>
          
          <div>
            <label htmlFor="adjective1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Adjective
            </label>
            <select
              id="adjective1"
              value={selectedAdjectives.one}
              onChange={(e) => setAdjective('one', e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.adjective1 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              disabled={isLoading}
              aria-invalid={formErrors.adjective1 ? 'true' : 'false'}
            >
              <option value="">Select an adjective</option>
              {adjectiveOptions.one.map((adj) => (
                <option key={adj} value={adj}>{adj}</option>
              ))}
            </select>
            {formErrors.adjective1 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.adjective1}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="adjective2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Second Adjective
            </label>
            <select
              id="adjective2"
              value={selectedAdjectives.two}
              onChange={(e) => setAdjective('two', e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.adjective2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              disabled={isLoading}
              aria-invalid={formErrors.adjective2 ? 'true' : 'false'}
            >
              <option value="">Select an adjective</option>
              {adjectiveOptions.two.map((adj) => (
                <option key={adj} value={adj}>{adj}</option>
              ))}
            </select>
            {formErrors.adjective2 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.adjective2}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="adjective3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Third Adjective
            </label>
            <select
              id="adjective3"
              value={selectedAdjectives.three}
              onChange={(e) => setAdjective('three', e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.adjective3 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              disabled={isLoading}
              aria-invalid={formErrors.adjective3 ? 'true' : 'false'}
            >
              <option value="">Select an adjective</option>
              {adjectiveOptions.three.map((adj) => (
                <option key={adj} value={adj}>{adj}</option>
              ))}
            </select>
            {formErrors.adjective3 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.adjective3}</p>
            )}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
