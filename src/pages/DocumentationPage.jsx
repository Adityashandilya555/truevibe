
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Users, Heart, Brain, Shield, Zap, MessageCircle, Hash, Camera, Settings } from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Book },
    { id: 'emotions', title: 'Emotion Detection', icon: Brain },
    { id: 'threads', title: 'Threads & Posts', icon: MessageCircle },
    { id: 'reactions', title: 'Reaction System', icon: Heart },
    { id: 'hashtags', title: 'Hashtags & Discovery', icon: Hash },
    { id: 'profile', title: 'Profile & Stories', icon: Users },
    { id: 'privacy', title: 'Privacy & Safety', icon: Shield },
    { id: 'features', title: 'Advanced Features', icon: Zap }
  ];

  const content = {
    overview: {
      title: 'TrueVibe Overview',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            TrueVibe is the world's first emotion-aware social media platform, designed to foster authentic connections through emotional intelligence.
          </p>
          
          <h3 className="text-2xl font-semibold text-white mb-4">Core Philosophy</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong>Authenticity First:</strong> We believe genuine emotions create genuine connections</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong>Emotional Intelligence:</strong> Understanding feelings leads to better communication</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong>Safe Expression:</strong> Every emotion is valid and deserves respect</span>
            </li>
          </ul>

          <h3 className="text-2xl font-semibold text-white mb-4">Getting Started</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                <span>Create your account and select three personality adjectives</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                <span>Write your first thread and watch our AI detect your emotion</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                <span>React to others' posts with our 5-type reaction system</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                <span>Explore trending hashtags and connect with like-minded users</span>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    emotions: {
      title: 'Emotion Detection System',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            TrueVibe uses advanced VADER sentiment analysis to detect emotions in real-time as you type.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">8 Core Emotions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Joy', color: '#FFD700', description: 'Happiness, excitement, celebration' },
              { name: 'Trust', color: '#00CED1', description: 'Confidence, faith, reliability' },
              { name: 'Fear', color: '#800080', description: 'Anxiety, worry, concern' },
              { name: 'Surprise', color: '#FF6347', description: 'Amazement, shock, wonder' },
              { name: 'Sadness', color: '#4682B4', description: 'Grief, melancholy, disappointment' },
              { name: 'Disgust', color: '#228B22', description: 'Revulsion, distaste, rejection' },
              { name: 'Anger', color: '#DC143C', description: 'Frustration, rage, irritation' },
              { name: 'Anticipation', color: '#FF8C00', description: 'Expectation, hope, eagerness' }
            ].map((emotion) => (
              <div key={emotion.name} className="bg-gray-800 rounded-lg p-4 border-l-4" style={{borderLeftColor: emotion.color}}>
                <h4 className="font-semibold text-white mb-2">{emotion.name}</h4>
                <p className="text-gray-300 text-sm">{emotion.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">How Detection Works</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Real-time analysis as you type (300ms debounce)</li>
              <li>• Confidence scoring from 0-100%</li>
              <li>• Visual feedback with colored borders</li>
              <li>• Emotional whiplash detection for sudden mood changes</li>
              <li>• Duplicate emotion checking (24-hour cooldown)</li>
            </ul>
          </div>
        </div>
      )
    },
    threads: {
      title: 'Threads & Posts',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            Share your thoughts, feelings, and experiences through emotion-aware threads.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Creating Threads</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• <strong>Text:</strong> 3-280 characters with real-time emotion detection</li>
              <li>• <strong>Media:</strong> Images and videos up to 10MB</li>
              <li>• <strong>Hashtags:</strong> Automatic suggestions based on emotion and trending topics</li>
              <li>• <strong>Privacy:</strong> All posts are public by default</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Thread Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Emotion Borders</h4>
              <p className="text-gray-300 text-sm">Dynamic colored borders that reflect the detected emotion</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Time Stamps</h4>
              <p className="text-gray-300 text-sm">Relative time display (now, 5m, 2h, 3d)</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">User Adjectives</h4>
              <p className="text-gray-300 text-sm">Three personality traits displayed under username</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Media Support</h4>
              <p className="text-gray-300 text-sm">Images, videos, and file attachments</p>
            </div>
          </div>
        </div>
      )
    },
    reactions: {
      title: 'Reaction System',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            Express your response to others' threads with our unique 5-type reaction system.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Reaction Types</h3>
          <div className="space-y-4">
            {[
              { name: 'Resonate', icon: '❤️', color: '#FF6B6B', description: 'This deeply connects with me' },
              { name: 'Support', icon: '🤝', color: '#4ECDC4', description: 'I\'m here for you' },
              { name: 'Learn', icon: '📚', color: '#45B7D1', description: 'This taught me something' },
              { name: 'Challenge', icon: '💭', color: '#FFA07A', description: 'I respectfully disagree' },
              { name: 'Amplify', icon: '📢', color: '#98D8C8', description: 'More people should see this' }
            ].map((reaction) => (
              <div key={reaction.name} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                <div className="text-2xl">{reaction.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{reaction.name}</h4>
                  <p className="text-gray-300 text-sm">{reaction.description}</p>
                </div>
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: reaction.color}}></div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Reaction Guidelines</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• One reaction per thread per user</li>
              <li>• Reactions can be changed or removed</li>
              <li>• Real-time updates across all users</li>
              <li>• Reaction counts are publicly visible</li>
            </ul>
          </div>
        </div>
      )
    },
    hashtags: {
      title: 'Hashtags & Discovery',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            Discover content and connect with others through hashtags and trending topics.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Hashtag Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Auto-Detection</h4>
              <p className="text-gray-300 text-sm">Hashtags are automatically detected as you type</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Smart Suggestions</h4>
              <p className="text-gray-300 text-sm">AI suggests relevant hashtags based on your emotion</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Trending Topics</h4>
              <p className="text-gray-300 text-sm">See what emotions and topics are trending</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Search & Filter</h4>
              <p className="text-gray-300 text-sm">Find content by hashtag or emotional theme</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Popular Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {[
              '#authenticity', '#mentalhealth', '#support', '#grateful', '#anxiety',
              '#happiness', '#mindfulness', '#growth', '#empathy', '#connection'
            ].map((tag) => (
              <span key={tag} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )
    },
    profile: {
      title: 'Profile & Stories',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            Express your personality through your profile and share moments with 24-hour stories.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Profile Elements</h3>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Three Adjectives</h4>
              <p className="text-gray-300 text-sm">Choose three words that best describe your personality. These appear under your username and help others understand you better.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Avatar & Username</h4>
              <p className="text-gray-300 text-sm">Your visual identity on TrueVibe. Keep it authentic and representative of who you are.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Activity Stats</h4>
              <p className="text-gray-300 text-sm">See your threads, reactions received, and emotional patterns over time.</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Stories Feature</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Share images, videos, or text that disappear after 24 hours</li>
              <li>• Stories have emotion-themed borders based on detected sentiment</li>
              <li>• View stories from people you follow</li>
              <li>• React to stories with the same 5-type reaction system</li>
              <li>• Stories are perfect for sharing in-the-moment emotions</li>
            </ul>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy & Safety',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            TrueVibe is committed to creating a safe, respectful environment for emotional expression.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Privacy Controls</h3>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Data Protection</h4>
              <p className="text-gray-300 text-sm">Your emotional data is encrypted and never sold to third parties</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Content Control</h4>
              <p className="text-gray-300 text-sm">Delete your threads and stories at any time</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Account Security</h4>
              <p className="text-gray-300 text-sm">Two-factor authentication and secure login options</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Community Guidelines</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Respect all emotions - every feeling is valid</li>
              <li>• No harassment, bullying, or hate speech</li>
              <li>• Be supportive, especially when someone shares vulnerability</li>
              <li>• Use content warnings for sensitive topics</li>
              <li>• Report inappropriate content to help keep the community safe</li>
            </ul>
          </div>
        </div>
      )
    },
    features: {
      title: 'Advanced Features',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            Explore TrueVibe's advanced features for deeper emotional connections and insights.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4">Emotional Intelligence Tools</h3>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Emotion History</h4>
              <p className="text-gray-300 text-sm">Track your emotional patterns over time and gain insights into your mental wellness</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Mood Analytics</h4>
              <p className="text-gray-300 text-sm">Understand what topics and interactions affect your emotions most</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Empathy Matching</h4>
              <p className="text-gray-300 text-sm">Connect with users who have complementary emotional intelligence</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Progressive Web App</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Install TrueVibe on your device like a native app</li>
              <li>• Offline support for reading previous threads</li>
              <li>• Push notifications for reactions and replies</li>
              <li>• Optimized for all screen sizes and devices</li>
              <li>• Fast loading and smooth animations</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">Accessibility</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Screen reader compatibility</li>
              <li>• Keyboard navigation support</li>
              <li>• High contrast mode</li>
              <li>• Font size adjustment</li>
              <li>• Color blind friendly emotion indicators</li>
            </ul>
          </div>
        </div>
      )
    }
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
            <h1 className="text-xl font-semibold">Documentation</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <section.icon size={20} />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-none">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-xl p-8"
            >
              <h1 className="text-3xl font-bold text-white mb-6">
                {content[activeSection].title}
              </h1>
              {content[activeSection].content}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
