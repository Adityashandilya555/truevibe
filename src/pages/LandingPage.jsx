import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">💙</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TrueVibe</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Connect authentically through emotion-aware social interactions
        </p>

        <div className="space-y-4">
          <Link
            to="/signup"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;