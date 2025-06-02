import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, Search, TrendingUp, Users, Calendar } from 'lucide-react';

// Store imports
import useAuthStore from '../store/authStore';
import useAppStore from '../store/appStore';

// Component imports
import ThreadComposer from '../components/threads/ThreadComposer';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * HomePage Component
 * 
 * Main dashboard for authenticated users showing a personalized feed,
 * trending content, and quick access to key features
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: isAuthLoading } = useAuthStore();
  const { 
    isDarkMode, 
    threads, 
    fetchThreads, 
    isLoading: isAppLoading,
    notifications
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch threads on component mount
  useEffect(() => {
    if (user && !threads.length) {
      fetchThreads();
    }
  }, [user, threads.length, fetchThreads]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  // Mock data for trending topics
  const trendingTopics = [
    { id: 1, tag: '#mindfulness', count: 1243, emotion: 'joy' },
    { id: 2, tag: '#selfcare', count: 987, emotion: 'trust' },
    { id: 3, tag: '#mentalhealth', count: 756, emotion: 'anticipation' },
    { id: 4, tag: '#gratitude', count: 621, emotion: 'joy' },
    { id: 5, tag: '#community', count: 542, emotion: 'trust' }
  ];

  // Mock data for suggested connections
  const suggestedConnections = [
    { id: 1, name: 'Emma Watson', adjectives: ['Creative', 'Thoughtful', 'Inspiring'], mutual: 12 },
    { id: 2, name: 'James Chen', adjectives: ['Analytical', 'Calm', 'Supportive'], mutual: 8 },
    { id: 3, name: 'Sophia Rodriguez', adjectives: ['Energetic', 'Compassionate', 'Honest'], mutual: 5 }
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Mindfulness Workshop', date: '2023-11-15', participants: 34 },
    { id: 2, title: 'Community Meetup', date: '2023-11-20', participants: 56 },
    { id: 3, title: 'Emotional Intelligence Webinar', date: '2023-11-25', participants: 89 }
  ];

  // Animation variants
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

  // Loading skeleton for threads
  const ThreadSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  );

  // Get emotion color based on Plutchik's wheel
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: 'yellow-500',
      trust: 'green-500',
      fear: 'purple-500',
      surprise: 'blue-500',
      sadness: 'blue-700',
      disgust: 'green-700',
      anger: 'red-500',
      anticipation: 'orange-500'
    };
    return emotionColors[emotion] || 'gray-500';
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                  TrueVibe
                </h1>
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Search threads, people, emotions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              {/* Action Icons */}
              <div className="flex items-center space-x-4">
                <button 
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  {(notifications.threads + notifications.profile + notifications.vibes) > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                      {notifications.threads + notifications.profile + notifications.vibes}
                    </span>
                  )}
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  className="hidden md:flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={() => navigate('/profile')}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {profile?.username ? profile.username.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Feed Column */}
            <div className="lg:flex-grow">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'foryou' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  onClick={() => setActiveTab('foryou')}
                >
                  For You
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'following' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  onClick={() => setActiveTab('following')}
                >
                  Following
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'trending' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  onClick={() => setActiveTab('trending')}
                >
                  Trending
                </button>
              </div>

              {/* Thread Composer */}
              <div className="mb-6">
                <ThreadComposer />
              </div>

              {/* Threads Feed */}
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {isAppLoading ? (
                  // Loading skeletons
                  Array(3).fill().map((_, index) => (
                    <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                      <ThreadSkeleton />
                    </motion.div>
                  ))
                ) : threads.length > 0 ? (
                  // Actual threads
                  threads.map(thread => (
                    <motion.div key={thread.id} variants={itemVariants}>
                      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-${getEmotionColor(thread.emotion)}`}>
                        <div className="flex items-start space-x-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {thread.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-white">{thread.author}</h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(thread.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-1 text-gray-800 dark:text-gray-200">{thread.content}</p>
                            {thread.hashtags && thread.hashtags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {thread.hashtags.map((tag, idx) => (
                                  <span key={idx} className="text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">#{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="mt-4 flex justify-between">
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                                <span>Resonate</span>
                                <span className="text-sm">{thread.reactions?.resonate || 0}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                                <span>Support</span>
                                <span className="text-sm">{thread.reactions?.support || 0}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                <span>Learn</span>
                                <span className="text-sm">{thread.reactions?.learn || 0}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                                <span>Challenge</span>
                                <span className="text-sm">{thread.reactions?.challenge || 0}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                <span>Amplify</span>
                                <span className="text-sm">{thread.reactions?.amplify || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Empty state
                  <motion.div variants={itemVariants} className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No threads yet. Start the conversation!</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Trending Topics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h2 className="font-bold text-gray-900 dark:text-white">Trending Topics</h2>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between">
                      <span className={`text-${getEmotionColor(topic.emotion)} font-medium cursor-pointer hover:underline`}>
                        {topic.tag}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{topic.count} threads</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline w-full text-center">
                  View All Trends
                </button>
              </div>

              {/* Suggested Connections */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-purple-500" />
                  <h2 className="font-bold text-gray-900 dark:text-white">People You May Know</h2>
                </div>
                <div className="space-y-4">
                  {suggestedConnections.map(person => (
                    <div key={person.id} className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{person.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {person.adjectives.map((adj, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {adj}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{person.mutual} mutual connections</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium rounded-full text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline w-full text-center">
                  View More
                </button>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <h2 className="font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                      <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-sm text-purple-600 dark:text-purple-400">{event.participants} attending</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline w-full text-center">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              className="fixed inset-0 z-50 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={toggleNotifications}></div>
              
              <motion.div 
                className="absolute inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-gray-800 shadow-xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="h-full flex flex-col py-6 bg-white dark:bg-gray-800 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h2>
                      <button
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onClick={toggleNotifications}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6 overflow-auto">
                    {/* Notification content */}
                    <div className="space-y-6">
                      <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Alex resonated with your thread about mindfulness.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                      <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Jamie is now following you.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Your story received 12 views.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 hours ago</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200">New event: "Mindfulness Workshop" is happening next week.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                      Mark all as read
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
