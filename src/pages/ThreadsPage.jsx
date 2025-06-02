import React, { useState } from 'react';
import { useEmotion } from '../hooks';
import { Search } from 'lucide-react';

const ThreadsPage = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [threadText, setThreadText] = useState('');
  const { analyzeEmotion } = useEmotion();

  const currentEmotion = threadText ? analyzeEmotion(threadText) : null;

  const mockThreads = [
    {
      id: 1,
      user: 'Sarah Chen',
      timestamp: '2 hours ago',
      content: 'Just launched my first startup! 🚀 After months of coding and countless sleepless nights, we\'re finally live. The feeling is incredible!',
      hashtags: ['#startup', '#entrepreneurship', '#coding'],
      emotion: { name: 'joy', confidence: 85 },
      reactions: {
        resonate: 45,
        support: 23,
        learn: 78,
        challenge: 5,
        amplify: 56
      }
    }
  ];

  const reactions = [
    { type: 'resonate', emoji: '🤝', label: 'Resonate' },
    { type: 'support', emoji: '👍', label: 'Support' },
    { type: 'learn', emoji: '🧠', label: 'Learn' },
    { type: 'challenge', emoji: '⚡', label: 'Challenge' },
    { type: 'amplify', emoji: '📢', label: 'Amplify' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search topics, emotions, hashtags..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Trending/Following Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'trending'
                  ? 'bg-cyan-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'following'
                  ? 'bg-cyan-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Thread Composer */}
        <div className="mx-4 mb-6 card p-4">
          <textarea
            value={threadText}
            onChange={(e) => setThreadText(e.target.value)}
            placeholder="Share your thoughts... (emotion will be detected automatically)"
            className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-500"
          />

          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-400">
              {currentEmotion && (
                <span>Emotion: {currentEmotion.name} ({currentEmotion.confidence}% confidence)</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{threadText.length}/280</span>
              <button
                disabled={!threadText.trim()}
                className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Threads Feed */}
        <div className="px-4">
          {mockThreads.map((thread) => (
            <div key={thread.id} className={`card p-4 mb-4 emotion-${thread.emotion.name}`}>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold">SC</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{thread.user}</span>
                    <span className="text-sm text-gray-400">{thread.timestamp}</span>
                  </div>

                  <p className="text-gray-200 mb-3">{thread.content}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {thread.hashtags.map((hashtag) => (
                      <span key={hashtag} className="text-cyan-400 hover:underline cursor-pointer">
                        {hashtag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    {thread.emotion.name.charAt(0).toUpperCase() + thread.emotion.name.slice(1)} {thread.emotion.confidence}% confidence
                  </div>

                  <div className="flex justify-between items-center">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.type}
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.label}</span>
                        <span className="text-gray-400">{thread.reactions[reaction.type]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadsPage;