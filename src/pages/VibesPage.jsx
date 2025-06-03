
import React, { useState, useEffect } from 'react';
import { Camera, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyVibesCreator from '../components/vibes/DailyVibesCreator';

export default function VibesPage() {
  const [showCreator, setShowCreator] = useState(false);
  const [vibes, setVibes] = useState([]);
  const [hasPostedToday, setHasPostedToday] = useState(false);

  useEffect(() => {
    loadVibes();
    checkTodayPost();
  }, []);

  const loadVibes = () => {
    const savedVibes = JSON.parse(localStorage.getItem('truevibe_daily_vibes') || '[]');
    setVibes(savedVibes);
  };

  const checkTodayPost = () => {
    const today = new Date().toDateString();
    const savedVibes = JSON.parse(localStorage.getItem('truevibe_daily_vibes') || '[]');
    const todayPost = savedVibes.find(vibe => 
      new Date(vibe.created_at).toDateString() === today
    );
    setHasPostedToday(!!todayPost);
  };

  const handleVibeCreated = (newVibe) => {
    setVibes(prev => [newVibe, ...prev]);
    setHasPostedToday(true);
    setShowCreator(false);
  };

  const getDemoVibes = () => [
    {
      id: 'demo_vibe_1',
      content: 'Beautiful sunset walk with my dog 🌅 Sometimes the simplest moments bring the most joy',
      media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      emotion: 'joy',
      emotion_confidence: 0.9,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: {
        username: 'NatureLover',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616c6106d6a?w=40&h=40&fit=crop&crop=face'
      }
    },
    {
      id: 'demo_vibe_2',
      content: 'Rainy day coding session ☔ There\'s something magical about the sound of rain while building something new',
      media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
      emotion: 'trust',
      emotion_confidence: 0.8,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: {
        username: 'CodePoet',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      }
    }
  ];

  const allVibes = [...vibes, ...getDemoVibes()];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold mb-2">Daily Vibes</h1>
          <p className="text-gray-400">Share your authentic moments</p>
        </div>

        {/* Daily Vibe Prompt */}
        {!hasPostedToday && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 mb-6 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-gray-900" size={24} />
              </div>
              <h2 className="text-lg font-semibold mb-2">Time for your Daily Vibe!</h2>
              <p className="text-gray-300 mb-4 text-sm">
                Capture this moment and share how you're feeling right now
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreator(true)}
                className="bg-cyan-400 text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                Create Daily Vibe
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Daily Vibe Posted Today */}
        {hasPostedToday && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 mb-6 bg-gray-800 border border-gray-700 rounded-2xl p-4"
          >
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <span>✅</span>
              <span className="font-medium">Daily Vibe Posted!</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              You've shared your vibe today. Check back tomorrow for your next daily prompt.
            </p>
          </motion.div>
        )}

        {/* Friends' Vibes Feed */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-gray-400" />
            <h3 className="text-lg font-semibold">Community Vibes</h3>
          </div>
          
          <div className="space-y-4">
            {allVibes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400">No vibes yet today</p>
              </div>
            ) : (
              allVibes.map((vibe) => (
                <VibeCard key={vibe.id} vibe={vibe} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Daily Vibe Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreator(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <DailyVibesCreator
                onVibeCreated={handleVibeCreated}
                onCancel={() => setShowCreator(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VibeCard({ vibe }) {
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'text-yellow-400',
      trust: 'text-cyan-400',
      fear: 'text-purple-400',
      surprise: 'text-pink-400',
      sadness: 'text-blue-400',
      disgust: 'text-green-400',
      anger: 'text-red-400',
      anticipation: 'text-orange-400'
    };
    return colors[emotion] || colors.joy;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
    >
      {/* User Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={vibe.user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
          alt={vibe.user?.username || 'User'}
          className="w-10 h-10 rounded-full border-2 border-gray-600"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {vibe.user?.username || 'Anonymous'}
            </span>
            {vibe.emotion && (
              <span className={`text-sm capitalize ${getEmotionColor(vibe.emotion)}`}>
                {vibe.emotion}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={12} />
            <span>{getTimeAgo(vibe.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Media */}
      {vibe.media_url && (
        <div className="aspect-square bg-gray-900">
          <img
            src={vibe.media_url}
            alt="Daily vibe"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      {vibe.content && (
        <div className="p-4">
          <p className="text-white leading-relaxed">{vibe.content}</p>
        </div>
      )}

      {/* Expiry Timer */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock size={12} />
          <span>Expires in {getExpiryTime(vibe.expires_at || vibe.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function getExpiryTime(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) {
    const created = new Date();
    expiry.setTime(created.getTime() + 24 * 60 * 60 * 1000);
  }
  
  const diffInMs = expiry - now;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffInMs <= 0) return 'Expired';
  if (diffInHours > 0) return `${diffInHours}h ${diffInMinutes}m`;
  return `${diffInMinutes}m`;
}
