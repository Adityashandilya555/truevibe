
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Users, BarChart3, Calendar, Filter } from 'lucide-react';
import useEmotion from '../hooks/useEmotion';
import { getEmotionColor } from '../services/emotion/vaderEnhanced';

const VibesPage = () => {
  const { getEmotionTrends } = useEmotion();
  const [trends, setTrends] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = () => {
      setIsLoading(true);
      try {
        const emotionTrends = getEmotionTrends();
        setTrends(emotionTrends);
      } catch (error) {
        console.error('Error fetching emotion trends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
    // Refresh trends every 30 seconds
    const interval = setInterval(fetchTrends, 30000);
    return () => clearInterval(interval);
  }, [getEmotionTrends, selectedPeriod]);

  const emotionLabels = {
    joy: '😊 Joy',
    trust: '🤝 Trust',
    fear: '😨 Fear',
    surprise: '😲 Surprise',
    sadness: '😢 Sadness',
    disgust: '🤢 Disgust',
    anger: '😡 Anger',
    anticipation: '🎯 Anticipation',
    neutral: '😐 Neutral'
  };

  const totalEmotions = Object.values(trends).reduce((sum, count) => sum + count, 0);

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400 flex items-center">
              <TrendingUp className="mr-2" size={24} />
              Vibes
            </h1>
            <p className="text-gray-400 text-sm">Community emotion trends</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPeriod('24h')}
              className={`px-3 py-1 rounded text-xs ${
                selectedPeriod === '24h' 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setSelectedPeriod('7d')}
              className={`px-3 py-1 rounded text-xs ${
                selectedPeriod === '7d' 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              7d
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <motion.div
          className="bg-gray-800 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Emotions</p>
              <p className="text-2xl font-bold">{totalEmotions}</p>
            </div>
            <Heart className="text-cyan-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Emotions</p>
              <p className="text-2xl font-bold">
                {Object.values(trends).filter(count => count > 0).length}
              </p>
            </div>
            <BarChart3 className="text-cyan-400" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Emotion Trends */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="mr-2" size={20} />
          Emotion Breakdown
        </h2>

        <div className="space-y-3">
          {Object.entries(emotionLabels).map(([emotion, label], index) => {
            const percentage = trends[emotion] || 0;
            const color = getEmotionColor(emotion);

            return (
              <motion.div
                key={emotion}
                className="bg-gray-800 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm text-gray-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>

                {percentage > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {Math.round((percentage / 100) * totalEmotions)} expressions
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      {totalEmotions > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            Community Insights
          </h2>

          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            {(() => {
              const topEmotion = Object.entries(trends).reduce((a, b) => 
                trends[a[0]] > trends[b[0]] ? a : b
              );
              
              if (topEmotion[1] > 0) {
                return (
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEmotionColor(topEmotion[0]) }}
                    />
                    <p className="text-sm">
                      <span className="font-medium text-cyan-400">
                        {emotionLabels[topEmotion[0]]}
                      </span>
                      {' '}is the dominant emotion in your community right now
                    </p>
                  </div>
                );
              }
              
              return (
                <p className="text-sm text-gray-400">
                  Start expressing yourself to see community trends!
                </p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default VibesPage;
