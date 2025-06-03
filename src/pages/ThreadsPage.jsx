import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThreadComposer from '../components/threads/ThreadComposer';
import ThreadFeed from '../components/threads/ThreadFeed';
import { Sparkles, Filter, Search } from 'lucide-react';

const ThreadsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  const emotions = [
    { key: 'all', label: 'All Vibes', color: 'text-gray-400' },
    { key: 'joy', label: 'Joy', color: 'text-yellow-400' },
    { key: 'trust', label: 'Trust', color: 'text-green-400' },
    { key: 'curiosity', label: 'Curiosity', color: 'text-purple-400' },
    { key: 'determination', label: 'Determination', color: 'text-blue-400' }
  ];

  const handleThreadSubmit = async (threadData) => {
    try {
      console.log('Submitting thread:', threadData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      console.log('Thread posted successfully!', threadData);

      // TODO: Refresh feed or add to feed optimistically
    } catch (error) {
      console.error('Error submitting thread:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Vibe Threads</h1>
          </div>
          <p className="text-gray-400">
            Share your thoughts and emotions with the community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Emotion Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {emotions.map(emotion => (
              <button
                key={emotion.key}
                onClick={() => setSelectedEmotion(emotion.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors ${
                  selectedEmotion === emotion.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className={emotion.color}>●</span> {emotion.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Thread Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ThreadComposer 
            onSubmit={handleThreadSubmit}
            placeholder="What's your vibe right now?"
          />
        </motion.div>

        {/* Thread Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ThreadFeed filter={selectedEmotion} />
        </motion.div>
      </div>
    </div>
  );
};

export default ThreadsPage;