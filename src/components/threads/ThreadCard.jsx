import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Sparkles,
  ThumbsUp,
  Lightbulb,
  Zap,
  Target
} from 'lucide-react';

const ThreadCard = ({ thread, onReaction, onReply, onShare }) => {
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { type: 'resonate', icon: Heart, label: 'Resonate', color: 'text-red-500' },
    { type: 'support', icon: ThumbsUp, label: 'Support', color: 'text-blue-500' },
    { type: 'learn', icon: Lightbulb, label: 'Learn', color: 'text-yellow-500' },
    { type: 'challenge', icon: Target, label: 'Challenge', color: 'text-purple-500' },
    { type: 'amplify', icon: Zap, label: 'Amplify', color: 'text-green-500' }
  ];

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'bg-yellow-500/20 text-yellow-400',
      trust: 'bg-green-500/20 text-green-400',
      fear: 'bg-purple-500/20 text-purple-400',
      surprise: 'bg-pink-500/20 text-pink-400',
      sadness: 'bg-blue-500/20 text-blue-400',
      disgust: 'bg-gray-500/20 text-gray-400',
      anger: 'bg-red-500/20 text-red-400',
      anticipation: 'bg-orange-500/20 text-orange-400'
    };
    return colors[emotion] || 'bg-gray-500/20 text-gray-400';
  };

  // Sample thread data if not provided
  const displayThread = thread || {
    id: 'demo-thread-1',
    content: "Just finished working on an exciting new project! The combination of creativity and technical challenges always energizes me. 🚀",
    emotion: 'joy',
    emotion_score: 0.85,
    hashtags: ['coding', 'creativity', 'motivation'],
    user_profiles: {
      username: 'demouser',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      adjective_one: 'Creative',
      adjective_two: 'Empathetic',
      adjective_three: 'Curious'
    },
    reaction_counts: {
      resonate: 12,
      support: 8,
      learn: 5,
      challenge: 2,
      amplify: 15
    },
    reply_count: 7,
    share_count: 3,
    created_at: new Date().toISOString()
  };

  const handleReaction = (threadId, reactionType) => {
    if (onReaction) {
      onReaction(threadId, reactionType);
    } else {
      // Demo functionality
      console.log(`Reacted with ${reactionType} to thread ${threadId}`);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(displayThread);
    } else {
      console.log('Reply to thread:', displayThread.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(displayThread);
    } else {
      console.log('Share thread:', displayThread.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700"
    >
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={displayThread.user_profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">
              {displayThread.user_profiles?.username || 'User'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${getEmotionColor(displayThread.emotion)}`}>
              {displayThread.emotion}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
            {displayThread.user_profiles?.adjective_one && (
              <span className="px-2 py-1 bg-gray-700 rounded-full">
                {displayThread.user_profiles.adjective_one}
              </span>
            )}
            {displayThread.user_profiles?.adjective_two && (
              <span className="px-2 py-1 bg-gray-700 rounded-full">
                {displayThread.user_profiles.adjective_two}
              </span>
            )}
            {displayThread.user_profiles?.adjective_three && (
              <span className="px-2 py-1 bg-gray-700 rounded-full">
                {displayThread.user_profiles.adjective_three}
              </span>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{displayThread.content}</p>
        {displayThread.hashtags && displayThread.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {displayThread.hashtags.map((hashtag, index) => (
              <span key={index} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                #{hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {displayThread.media_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {displayThread.media_type?.startsWith('image/') ? (
            <img
              src={displayThread.media_url}
              alt="Thread media"
              className="w-full max-h-96 object-cover"
            />
          ) : displayThread.media_type?.startsWith('video/') ? (
            <video
              src={displayThread.media_url}
              controls
              className="w-full max-h-96"
            />
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-6">
          {/* Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Heart size={20} />
              <span>{displayThread.reaction_counts?.resonate || 0}</span>
            </button>

            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-full left-0 mb-2 bg-gray-900 rounded-lg p-2 flex space-x-2 shadow-xl border border-gray-700 z-10"
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => {
                      handleReaction(displayThread.id, reaction.type);
                      setShowReactions(false);
                    }}
                    className={`p-2 rounded-lg hover:bg-gray-800 transition-colors ${reaction.color}`}
                    title={reaction.label}
                  >
                    <reaction.icon size={16} />
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={handleReply}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={20} />
            <span>{displayThread.reply_count || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Share size={20} />
            <span>{displayThread.share_count || 0}</span>
          </button>
        </div>

        {/* Emotion Score */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Sparkles size={14} />
          <span>{Math.round((displayThread.emotion_score || 0) * 100)}% confident</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadCard;