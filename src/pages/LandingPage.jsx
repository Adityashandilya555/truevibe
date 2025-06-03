import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Shield } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Emotion-Aware',
      description: 'Experience social media that understands and responds to your emotional state'
    },
    {
      icon: Users,
      title: 'Authentic Connections',
      description: 'Connect with others through genuine emotions and meaningful interactions'
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Built-in emotional intelligence protects your mental wellbeing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sparkles className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">TrueVibe</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The emotion-aware social media platform that prioritizes emotional intelligence 
            over engagement manipulation
          </p>
        </motion.header>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Connect <span className="text-blue-400">Authentically</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Share your true emotions, engage meaningfully, and build genuine connections 
            in a space designed for emotional wellbeing
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to experience authentic social media?
          </h3>
          <p className="text-blue-100 mb-6">
            Join thousands of users who are connecting through genuine emotions
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Your Journey
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;