
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, Users, Calendar } from 'lucide-react';
import { supabase } from '../services/supabase';

const VibesPage = () => {
  const [emotionStats, setEmotionStats] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [communityInsights, setCommunityInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const emotionColors = {
    joy: 'from-yellow-400 to-yellow-600',
    trust: 'from-blue-400 to-blue-600',
    fear: 'from-purple-400 to-purple-600',
    surprise: 'from-orange-400 to-orange-600',
    sadness: 'from-indigo-400 to-indigo-600',
    disgust: 'from-green-400 to-green-600',
    anger: 'from-red-400 to-red-600',
    anticipation: 'from-pink-400 to-pink-600'
  };

  useEffect(() => {
    fetchVibesData();
  }, []);

  const fetchVibesData = async () => {
    try {
      setLoading(true);
      
      // Fetch emotion statistics
      const { data: emotions, error: emotionsError } = await supabase
        .from('threads')
        .select('emotion')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (emotionsError) throw emotionsError;

      // Process emotion stats
      const emotionCounts = emotions.reduce((acc, { emotion }) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});

      const statsArray = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count);

      setEmotionStats(statsArray);

      // Fetch trending hashtags
      const { data: hashtags, error: hashtagsError } = await supabase
        .from('threads')
        .select('hashtags')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .not('hashtags', 'is', null);

      if (hashtagsError) throw hashtagsError;

      // Process hashtags
      const hashtagCounts = {};
      hashtags.forEach(({ hashtags: tags }) => {
        if (Array.isArray(tags)) {
          tags.forEach(tag => {
            hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
          });
        }
      });

      const trendingArray = Object.entries(hashtagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTrendingHashtags(trendingArray);

      // Community insights
      setCommunityInsights({
        totalThreads: emotions.length,
        mostActiveEmotion: statsArray[0]?.emotion || 'joy',
        diversityScore: statsArray.length
      });

    } catch (error) {
      console.error('Error fetching vibes data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Community Vibes ✨
          </h1>
          <p className="text-gray-400">Discover the emotional pulse of TrueVibe</p>
        </motion.div>

        {/* Community Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{communityInsights?.totalThreads || 0}</h3>
            <p className="text-gray-400">Threads This Week</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white capitalize">
              {communityInsights?.mostActiveEmotion || 'Joy'}
            </h3>
            <p className="text-gray-400">Trending Emotion</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{communityInsights?.diversityScore || 0}</h3>
            <p className="text-gray-400">Emotion Diversity</p>
          </div>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Emotion Distribution (7 days)</h2>
          <div className="space-y-3">
            {emotionStats.map(({ emotion, count }, index) => {
              const maxCount = emotionStats[0]?.count || 1;
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={emotion} className="flex items-center gap-4">
                  <div className="w-20 text-sm capitalize text-gray-300">{emotion}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${emotionColors[emotion] || 'from-gray-400 to-gray-600'}`}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-400">{count}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Trending Hashtags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            Trending Hashtags (24h)
          </h2>
          
          {trendingHashtags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {trendingHashtags.map(({ tag, count }, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="text-cyan-400 font-semibold">#{tag}</div>
                  <div className="text-gray-400 text-sm">{count} uses</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Hash className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No trending hashtags yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VibesPage;
