
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, HelpCircle, Book, Bug, Heart } from 'lucide-react';

const SupportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const supportCategories = [
    { id: 'general', title: 'General Help', icon: HelpCircle },
    { id: 'technical', title: 'Technical Issues', icon: Bug },
    { id: 'emotional', title: 'Emotional Support', icon: Heart },
    { id: 'account', title: 'Account & Privacy', icon: MessageCircle }
  ];

  const faqData = {
    general: [
      {
        question: 'How does TrueVibe detect emotions?',
        answer: 'TrueVibe uses VADER (Valence Aware Dictionary and sEntiment Reasoner) sentiment analysis combined with emotion mapping to detect 8 core emotions in real-time as you type.'
      },
      {
        question: 'Is TrueVibe free to use?',
        answer: 'Yes! TrueVibe core features are completely free. We may introduce premium features in the future, but authentic emotional connection will always be free.'
      }
    ],
    technical: [
      {
        question: 'Why isn\'t my emotion being detected correctly?',
        answer: 'Emotion detection works best with clear, descriptive language. Very short messages (under 3 characters) may not have enough context for accurate detection.'
      },
      {
        question: 'Can I use TrueVibe on mobile?',
        answer: 'Absolutely! TrueVibe is a Progressive Web App (PWA) that works seamlessly on all devices. You can even install it on your phone for a native app experience.'
      }
    ],
    emotional: [
      {
        question: 'What if I\'m going through a difficult time?',
        answer: 'TrueVibe community is here to support you. Use hashtags like #support or #mentalhealth to connect with others. For professional help, please reach out to local mental health services.'
      },
      {
        question: 'How do I handle negative reactions to my posts?',
        answer: 'Remember that Challenge reactions are meant for respectful disagreement. If you experience harassment, please report it immediately. Every emotion is valid on TrueVibe.'
      }
    ],
    account: [
      {
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account > Delete Account. Please note this action is permanent and will remove all your threads, reactions, and profile data.'
      },
      {
        question: 'Is my emotional data private?',
        answer: 'Yes! Your emotional data is encrypted and never sold to third parties. You have full control over your data and can delete it at any time.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300">
                <ArrowLeft size={20} />
                <span>Back to TrueVibe</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold">Support Center</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get support for your TrueVibe experience. We're here to help you connect authentically.
          </p>
        </motion.div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
          >
            <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-300 mb-4">Chat with our support team in real-time</p>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors">
              Start Chat
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-300 mb-4">Send us an email and we'll respond within 24 hours</p>
            <a
              href="mailto:support@truevibe.com"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
            >
              Email Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
          >
            <Book className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Documentation</h3>
            <p className="text-gray-300 mb-4">Browse our comprehensive guides and tutorials</p>
            <Link
              to="/documentation"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
            >
              View Docs
            </Link>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <category.icon size={18} />
                <span>{category.title}</span>
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {faqData[selectedCategory].map((faq, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Emergency Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center"
        >
          <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Need Immediate Help?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for professional help immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:988"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Phone size={20} />
              <span>Call 988 (Crisis Lifeline)</span>
            </a>
            <a
              href="https://suicidepreventionlifeline.org/chat/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Online Crisis Chat
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gray-800 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Send us a Message</h2>
          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                rows="6"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
