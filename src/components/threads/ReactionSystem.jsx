
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';

const ReactionSystem = ({ threadId, reactions = [], currentUserId }) => {
  const [reactionCounts, setReactionCounts] = useState({
    resonate: 0,
    support: 0,
    learn: 0,
    challenge: 0,
    amplify: 0
  });
  const [userReaction, setUserReaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reactionTypes = [
    { key: 'resonate', emoji: '🤝', label: 'Resonate', color: '#FFD700' },
    { key: 'support', emoji: '👍', label: 'Support', color: '#4169E1' },
    { key: 'learn', emoji: '🧠', label: 'Learn', color: '#9400D3' },
    { key: 'challenge', emoji: '⚡', label: 'Challenge', color: '#FF8C00' },
    { key: 'amplify', emoji: '📢', label: 'Amplify', color: '#FF0000' }
  ];

  useEffect(() => {
    calculateReactionCounts();
  }, [reactions]);

  const calculateReactionCounts = () => {
    const counts = {
      resonate: 0,
      support: 0,
      learn: 0,
      challenge: 0,
      amplify: 0
    };

    let currentUserReaction = null;

    reactions.forEach(reaction => {
      if (counts.hasOwnProperty(reaction.type)) {
        counts[reaction.type]++;
      }
      
      if (reaction.user_id === currentUserId) {
        currentUserReaction = reaction.type;
      }
    });

    setReactionCounts(counts);
    setUserReaction(currentUserReaction);
  };

  const handleReaction = async (reactionType) => {
    if (isLoading || !currentUserId) return;

    setIsLoading(true);

    try {
      // If user already has this reaction, remove it
      if (userReaction === reactionType) {
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('thread_id', threadId)
          .eq('user_id', currentUserId);

        if (error) throw error;

        setUserReaction(null);
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: Math.max(0, prev[reactionType] - 1)
        }));
      } else {
        // Remove existing reaction if any
        if (userReaction) {
          await supabase
            .from('reactions')
            .delete()
            .eq('thread_id', threadId)
            .eq('user_id', currentUserId);

          setReactionCounts(prev => ({
            ...prev,
            [userReaction]: Math.max(0, prev[userReaction] - 1)
          }));
        }

        // Add new reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            thread_id: threadId,
            user_id: currentUserId,
            type: reactionType
          });

        if (error) throw error;

        setUserReaction(reactionType);
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1
        }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
      <div className="flex items-center space-x-4">
        {reactionTypes.map((reaction) => (
          <motion.button
            key={reaction.key}
            onClick={() => handleReaction(reaction.key)}
            disabled={isLoading}
            className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm transition-all ${
              userReaction === reaction.key
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base">{reaction.emoji}</span>
            <span className="hidden sm:inline">{reaction.label}</span>
            {reactionCounts[reaction.key] > 0 && (
              <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                {reactionCounts[reaction.key]}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ReactionSystem;
