import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReactionSystem = ({ threadId, reactions = {}, onReaction }) => {
  const [userReactions, setUserReactions] = useState(new Set());

  const reactionTypes = [
    { type: 'resonate', emoji: '🤝', label: 'Resonate', color: '#4dd0e1' },
    { type: 'support', emoji: '👍', label: 'Support', color: '#66bb6a' },
    { type: 'learn', emoji: '🧠', label: 'Learn', color: '#ffa726' },
    { type: 'challenge', emoji: '⚡', label: 'Challenge', color: '#ef5350' },
    { type: 'amplify', emoji: '📢', label: 'Amplify', color: '#ab47bc' }
  ];

  const handleReaction = (type) => {
    if (!onReaction || typeof onReaction !== 'function') {
      console.warn('onReaction function not provided to ReactionSystem');
      return;
    }

    const newUserReactions = new Set(userReactions);

    if (userReactions.has(type)) {
      newUserReactions.delete(type);
    } else {
      newUserReactions.add(type);
    }

    setUserReactions(newUserReactions);
    onReaction(type);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {reactionTypes.map((reaction) => {
        const count = reactions[reaction.type] || 0;
        const isActive = userReactions.has(reaction.type);

        return (
          <motion.button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            <span className="text-base">{reaction.emoji}</span>
            <span className="hidden sm:inline">{reaction.label}</span>
            {count > 0 && (
              <span className="bg-gray-600 px-2 py-1 rounded-full text-xs">
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ReactionSystem;