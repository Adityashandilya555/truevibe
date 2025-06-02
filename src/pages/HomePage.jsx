import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, TrendingUp, Heart } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            Welcome to TrueVibe
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect authentically through emotion-aware interactions. Share your true feelings and build meaningful connections.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: MessageCircle, label: 'Threads', value: '1.2K', color: 'text-cyan-400' },
            { icon: Users, label: 'Members', value: '850', color: 'text-blue-400' },
            { icon: TrendingUp, label: 'Engagement', value: '94%', color: 'text-green-400' },
            { icon: Heart, label: 'Emotions', value: '8', color: 'text-red-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Start Connecting</h3>
            <p className="text-gray-400 mb-4">
              Share your thoughts and emotions with our community
            </p>
            <Link
              to="/threads"
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View Threads
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Explore Emotions</h3>
            <p className="text-gray-400 mb-4">
              Discover trending emotions and vibes in our community
            </p>
            <Link
              to="/vibes"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Explore Vibes
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;