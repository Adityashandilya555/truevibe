import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyVibesCreator from '../components/vibes/DailyVibesCreator';
import { Sparkles, Plus, Calendar, Heart, Camera, Mic, Palette } from 'lucide-react';

const VibesPage = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [vibes, setVibes] = useState([
    {
      id: 'vibe-1',
      mode: 'mood',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      data: {
        emotion: 'joyful',
        intensity: 85,
        description: 'Had an amazing day working on creative projects!'
      }
    },
    {
      id: 'vibe-2',
      mode: 'color',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      data: {
        color: '#4ECDC4'
      }
    }
  ]);

  const handleVibeSubmit = (vibeData) => {
    const newVibe = {
      id: `vibe-${Date.now()}`,
      ...vibeData
    };
    setVibes(prev => [newVibe, ...prev]);
    setShowCreator(false);
    console.log('Vibe created:', newVibe);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'mood': return Sparkles;
      case 'photo': return Camera;
      case 'voice': return Mic;
      case 'color': return Palette;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Daily Vibes</h1>
          </div>
          <p className="text-gray-400">
            Capture and share your daily emotional moments
          </p>
        </motion.div>

        {/* Create Vibe Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreator(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold mb-8 flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Plus size={24} />
          <span>Create Today's Vibe</span>
        </motion.button>

        {/* Vibes History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar size={20} />
            <span>Your Vibe History</span>
          </h2>

          {vibes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-400 py-12"
            >
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No vibes yet</h3>
              <p>Start by creating your first daily vibe!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {vibes.map((vibe, index) => {
                const ModeIcon = getModeIcon(vibe.mode);

                return (
                  <motion.div
                    key={vibe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <ModeIcon className="w-6 h-6 text-purple-400" />
                        <span className="text-white font-medium capitalize">{vibe.mode} Vibe</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(vibe.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Render vibe content based on mode */}
                    {vibe.mode === 'mood' && vibe.data && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-2xl">😊</span>
                          <span className="text-white font-medium capitalize">{vibe.data.emotion}</span>
                          <span className="text-gray-400">({vibe.data.intensity}%)</span>
                        </div>
                        <p className="text-gray-300">{vibe.data.description}</p>
                      </div>
                    )}

                    {vibe.mode === 'color' && vibe.data && (
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-white"
                          style={{ backgroundColor: vibe.data.color }}
                        />
                        <span className="text-white font-mono">{vibe.data.color}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily Vibes Creator Modal */}
        <AnimatePresence>
          {showCreator && (
            <DailyVibesCreator
              onSubmit={handleVibeSubmit}
              onClose={() => setShowCreator(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VibesPage;