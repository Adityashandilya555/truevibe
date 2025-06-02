
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Users, MessageCircle, Smile, Shield, BarChart2 } from 'lucide-react';
import AuthFlow from '../components/auth/AuthFlow';
import useAuthStore from '../store/authStore';

/**
 * LandingPage Component
 * 
 * Entry point for non-authenticated users to learn about TrueVibe
 * and navigate to login or signup pages
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { user, session } = useAuthStore();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user && session) {
      navigate('/threads');
    }
  }, [user, session, navigate]);

  // Features list with icons and descriptions
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-yellow-500" />,
      title: 'Emotion-Aware Threads',
      description: 'Share your thoughts with real-time emotion analysis that helps others understand your true feelings.'
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: 'Meaningful Connections',
      description: 'Connect with people who resonate with your emotional state, not just your content.'
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: 'Five-Reaction System',
      description: 'Go beyond likes with five nuanced ways to respond: Resonate, Support, Learn, Challenge, and Amplify.'
    },
    {
      icon: <Smile className="w-6 h-6 text-blue-500" />,
      title: 'Emotion Visualization',
      description: 'See the emotional landscape of your social feed with color-coded indicators based on Plutchik\'s wheel.'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'Emotional Intelligence',
      description: 'Develop greater self-awareness by tracking your emotional patterns over time.'
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-orange-500" />,
      title: 'Emotional Trends',
      description: 'Discover trending emotions and topics that resonate with the community.'
    }
  ];

  // Hero section animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Feature animation variants
  const featureVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { scale: 1, opacity: 1 }
  };

  // Show auth flow if user clicks sign in/up
  if (showAuthFlow) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowAuthFlow(false)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-flex items-center"
            >
              ← Back to landing page
            </button>
          </div>
          <AuthFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.section 
        className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              <span className="block">Welcome to </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                TrueVibe
              </span>
            </h1>
          </motion.div>

          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            The emotion-aware social platform that prioritizes meaningful human connections over engagement algorithms.
          </motion.p>

          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <button
              onClick={() => setShowAuthFlow(true)}
              className="px-8 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowAuthFlow(true)}
              className="px-8 py-3 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Emotion-First Social Experience
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Discover how TrueVibe is revolutionizing social media with psychological research.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              initial="inactive"
              animate={activeFeature === index ? 'active' : 'inactive'}
              variants={featureVariants}
              whileHover="active"
              onHoverStart={() => setActiveFeature(index)}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100 dark:bg-gray-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to experience</span>
                <span className="block">true emotional connection?</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-purple-100">
                Join thousands of users who are already discovering the power of emotion-aware social media.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAuthFlow(true)}
                  className="px-6 py-3 text-base font-medium rounded-full text-purple-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-8 transition-colors flex items-center justify-center"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAuthFlow(true)}
                  className="px-6 py-3 text-base font-medium rounded-full text-white bg-purple-700 bg-opacity-30 hover:bg-opacity-40 md:py-4 md:text-lg md:px-8 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                  TrueVibe
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()}</span>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  Privacy
                </Link>
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  Terms
                </Link>
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  About
                </Link>
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
