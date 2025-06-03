
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EMOTION_COLORS = {
  joy: { bg: 'bg-yellow-400/10', border: 'border-yellow-400', text: 'text-yellow-400' },
  trust: { bg: 'bg-cyan-400/10', border: 'border-cyan-400', text: 'text-cyan-400' },
  fear: { bg: 'bg-purple-400/10', border: 'border-purple-400', text: 'text-purple-400' },
  surprise: { bg: 'bg-pink-400/10', border: 'border-pink-400', text: 'text-pink-400' },
  sadness: { bg: 'bg-blue-400/10', border: 'border-blue-400', text: 'text-blue-400' },
  disgust: { bg: 'bg-green-400/10', border: 'border-green-400', text: 'text-green-400' },
  anger: { bg: 'bg-red-400/10', border: 'border-red-400', text: 'text-red-400' },
  anticipation: { bg: 'bg-orange-400/10', border: 'border-orange-400', text: 'text-orange-400' },
};

const REACTIONS = {
  resonate: { emoji: '🤝', label: 'Resonate', description: 'This resonates with me' },
  support: { emoji: '🫶', label: 'Support', description: 'I support this' },
  learn: { emoji: '🧠', label: 'Learn', description: 'I learned something' },
  challenge: { emoji: '🤔', label: 'Challenge', description: 'I respectfully challenge this' },
  amplify: { emoji: '📢', label: 'Amplify', description: 'This needs to be heard' }
};

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
}

export default function ThreadCard({ thread, onReact, userReaction, onClick }) {
  const [showReactions, setShowReactions] = useState(false);
  
  const emotionStyle = EMOTION_COLORS[thread.emotion] || EMOTION_COLORS.joy;
  const totalReactions = Object.values(thread.reaction_counts || {}).reduce((sum, count) => sum + count, 0);

  const handleReactionClick = (reactionType) => {
    if (onReact) {
      onReact(thread.id, reactionType);
    }
    setShowReactions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`
        ${emotionStyle.bg} ${emotionStyle.border} 
        border-l-4 rounded-xl p-4 bg-gray-800 cursor-pointer transition-all duration-200
        hover:shadow-lg hover:shadow-cyan-400/10
      `}
      onClick={onClick}
    >
      {/* User Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={thread.user_profiles?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format`}
          alt={thread.user_profiles?.username || 'User'}
          className="w-10 h-10 rounded-full border-2 border-gray-600"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white truncate">
              {thread.user_profiles?.username || `User${thread.user_id?.slice(-4)}`}
            </span>
            <div className="flex gap-1">
              {thread.user_profiles?.adjective_one && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${emotionStyle.bg} ${emotionStyle.text} border ${emotionStyle.border.replace('border-', 'border-')}/30`}>
                  {thread.user_profiles.adjective_one}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock size={12} />
            <span>{formatTimeAgo(thread.created_at)}</span>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-gray-700 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed mb-3">{thread.content}</p>
        
        {/* Hashtags */}
        {thread.hashtags && thread.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer text-sm transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}
        
        {/* Emotion Analysis */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${emotionStyle.bg} ${emotionStyle.text} border ${emotionStyle.border.replace('border-', 'border-')}/30`}>
            {thread.emotion}
          </div>
          {thread.emotion_score && (
            <span className="text-gray-400 text-sm">
              {Math.round(thread.emotion_score * 100)}% confidence
            </span>
          )}
          {thread.emotion_intensity && thread.emotion_intensity > 1.2 && (
            <span className="text-orange-400 text-sm font-medium">
              High intensity
            </span>
          )}
        </div>
      </div>

      {/* Reactions & Engagement */}
      <div className="border-t border-gray-700 pt-3">
        {/* Current Reactions */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {Object.entries(thread.reaction_counts || {}).map(([type, count]) => {
              if (count > 0) {
                const reaction = REACTIONS[type];
                const isUserReaction = userReaction === type;
                return (
                  <div
                    key={type}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all
                      ${isUserReaction 
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40' 
                        : 'bg-gray-700 text-gray-300'
                      }
                    `}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{count}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          {/* Five Reaction System */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(!showReactions);
              }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${userReaction 
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }
              `}
            >
              {userReaction ? (
                <>
                  <span>{REACTIONS[userReaction].emoji}</span>
                  <span className="text-sm">{REACTIONS[userReaction].label}</span>
                </>
              ) : (
                <>
                  <Heart size={16} />
                  <span className="text-sm">React</span>
                </>
              )}
            </motion.button>

            {/* Reaction Picker */}
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-600 rounded-xl p-2 shadow-xl z-10 min-w-max"
              >
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(REACTIONS).map(([type, reaction]) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReactionClick(type);
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg text-center transition-colors group"
                      title={reaction.description}
                    >
                      <div className="text-xl">{reaction.emoji}</div>
                      <div className="text-xs text-gray-400 group-hover:text-white">
                        {reaction.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Other Actions */}
          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-sm">{thread.reply_count || 0}</span>
            </button>
            
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Share size={16} />
              <span className="text-sm">{thread.share_count || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
