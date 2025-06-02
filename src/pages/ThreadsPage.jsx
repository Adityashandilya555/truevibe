
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageCircle, Heart, Share2, Bookmark } from 'lucide-react';
import ThreadComposer from '../components/threads/ThreadComposer';
import ReactionSystem from '../components/threads/ReactionSystem';

const ThreadsPage = () => {
  const [showComposer, setShowComposer] = useState(false);
  const [threads, setThreads] = useState([
    {
      id: 1,
      content: "Just started using TrueVibe! Loving the emotion-aware features 🎉",
      emotion: "joy",
      confidence: 0.85,
      author: {
        name: "Demo User",
        adjectives: ["Creative", "Empathetic", "Curious"]
      },
      reactions: {
        resonate: 12,
        support: 8,
        learn: 5,
        challenge: 2,
        amplify: 15
      },
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      content: "Working on a new project and feeling excited about the possibilities! #innovation #creativity",
      emotion: "anticipation",
      confidence: 0.78,
      author: {
        name: "Tech Explorer",
        adjectives: ["Innovative", "Ambitious", "Thoughtful"]
      },
      reactions: {
        resonate: 25,
        support: 18,
        learn: 12,
        challenge: 3,
        amplify: 22
      },
      timestamp: "5 hours ago"
    }
  ]);

  const emotionColors = {
    joy: '#FFD700',
    sadness: '#4169E1',
    anger: '#FF4500',
    fear: '#800080',
    surprise: '#FF69B4',
    disgust: '#228B22',
    trust: '#4169E1',
    anticipation: '#FFA500'
  };

  const handleNewThread = (threadData) => {
    const newThread = {
      id: Date.now(),
      ...threadData,
      author: {
        name: "You",
        adjectives: ["Creative", "Empathetic", "Curious"]
      },
      reactions: {
        resonate: 0,
        support: 0,
        learn: 0,
        challenge: 0,
        amplify: 0
      },
      timestamp: "now"
    };
    setThreads([newThread, ...threads]);
    setShowComposer(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">💬 Threads</h1>
          <button
            onClick={() => setShowComposer(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </button>
        </div>
      </div>

      {/* Thread Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <ThreadComposer
              onSubmit={handleNewThread}
              onCancel={() => setShowComposer(false)}
            />
          </div>
        </div>
      )}

      {/* Threads Feed */}
      <div className="p-4 space-y-4">
        {threads.map((thread) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border-l-4"
            style={{ borderLeftColor: emotionColors[thread.emotion] || '#4dd0e1' }}
          >
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                {thread.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{thread.author.name}</p>
                <p className="text-sm text-gray-400">
                  {thread.author.adjectives.join(' • ')}
                </p>
              </div>
              <span className="ml-auto text-sm text-gray-500">{thread.timestamp}</span>
            </div>

            {/* Content */}
            <p className="text-gray-100 mb-4 leading-relaxed">{thread.content}</p>

            {/* Emotion Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${emotionColors[thread.emotion]}20`,
                  color: emotionColors[thread.emotion]
                }}
              >
                {thread.emotion} ({Math.round(thread.confidence * 100)}%)
              </div>
            </div>

            {/* Reactions */}
            <ReactionSystem 
              threadId={thread.id}
              reactions={thread.reactions}
              onReaction={(type) => {
                setThreads(threads.map(t => 
                  t.id === thread.id 
                    ? { ...t, reactions: { ...t.reactions, [type]: t.reactions[type] + 1 } }
                    : t
                ));
              }}
            />

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
              <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
                Like
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThreadsPage;
