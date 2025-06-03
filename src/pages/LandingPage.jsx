
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Brain, Shield, Zap, MessageCircle, TrendingUp, Globe } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Emotion Detection',
      description: 'AI-powered emotion analysis helps you understand the sentiment behind every post'
    },
    {
      icon: Heart,
      title: 'Authentic Connections',
      description: 'Connect with others based on genuine emotions and shared experiences'
    },
    {
      icon: Users,
      title: 'Empathetic Community',
      description: 'Build meaningful relationships in a supportive, understanding environment'
    },
    {
      icon: Shield,
      title: 'Safe Space',
      description: 'Express yourself freely in a moderated, respectful community'
    },
    {
      icon: Zap,
      title: 'Real-time Vibes',
      description: 'See how emotions flow through the community in real-time'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with emotionally intelligent people from around the world'
    }
  ];

  const emotions = [
    { name: 'Joy', color: '#FFD700', icon: '😊' },
    { name: 'Trust', color: '#00CED1', icon: '🤝' },
    { name: 'Fear', color: '#800080', icon: '😰' },
    { name: 'Surprise', color: '#FF6347', icon: '😲' },
    { name: 'Sadness', color: '#4682B4', icon: '😢' },
    { name: 'Disgust', color: '#228B22', icon: '😤' },
    { name: 'Anger', color: '#DC143C', icon: '😠' },
    { name: 'Anticipation', color: '#FF8C00', icon: '🤔' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-6">
              TrueVibe
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The first emotion-aware social media platform where authentic feelings create genuine connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
              <button className="text-cyan-400 hover:text-cyan-300 px-8 py-4 rounded-full text-lg font-semibold border border-cyan-400 hover:border-cyan-300 transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Floating Emotion Bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                className="absolute rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: `${emotion.color}20`,
                  border: `2px solid ${emotion.color}40`,
                  width: '60px',
                  height: '60px',
                  left: `${10 + (index * 11)}%`,
                  top: `${20 + (index % 3) * 20}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {emotion.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How TrueVibe Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience social media powered by emotional intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Express Authentically',
                description: 'Share your thoughts and feelings. Our AI detects the emotion in your posts.',
                icon: MessageCircle
              },
              {
                step: '02',
                title: 'Connect Meaningfully',
                description: 'Find others who resonate with your emotions and build genuine relationships.',
                icon: Users
              },
              {
                step: '03',
                title: 'Grow Together',
                description: 'Learn from diverse emotional perspectives and develop emotional intelligence.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-cyan-400 text-sm font-bold mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose TrueVibe?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              More than just social media - it's emotional intelligence in action
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 border border-gray-700"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotions Showcase */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">8 Core Emotions</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Every emotion matters. TrueVibe recognizes and celebrates the full spectrum of human feeling.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 border"
                style={{ borderColor: `${emotion.color}40` }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ backgroundColor: `${emotion.color}20`, border: `2px solid ${emotion.color}` }}
                >
                  {emotion.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{emotion.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Share Your True Vibe?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing more authentic, emotionally-aware social connections.
            </p>
            <Link
              to="/auth"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl inline-block"
            >
              Join TrueVibe Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              TrueVibe
            </h3>
            <p className="text-gray-400 mb-8">Emotion-aware social media for genuine connections</p>
            <div className="flex justify-center space-x-8">
              <Link to="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link>
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
