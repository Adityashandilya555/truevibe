import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import useAuth from '../../hooks/useAuth';

const REACTIONS = [
  { type: 'resonate', emoji: '🤝', label: 'Resonate', description: 'I feel the same way' },
  { type: 'support', emoji: '👍', label: 'Support', description: 'I\'m here for you' },
  { type: 'learn', emoji: '🧠', label: 'Learn', description: 'Help me understand' },
  { type: 'challenge', emoji: '⚡', label: 'Challenge', description: 'I respectfully disagree' },
  { type: 'amplify', emoji: '📢', label: 'Amplify', description: 'This needs to be heard' }
];

const ReactionSystem = ({ threadId, initialReactions = {} }) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && threadId) {
      fetchUserReaction();
      subscribeToReactions();
    }
  }, [user, threadId]);

  const fetchUserReaction = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('type')
        .eq('thread_id', threadId)
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setUserReaction(data.type);
      }
    } catch (error) {
      console.error('Error fetching user reaction:', error);
    }
  };

  const subscribeToReactions = () => {
    const subscription = supabase
      .channel(`reactions:${threadId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reactions',
        filter: `thread_id=eq.${threadId}`
      }, (payload) => {
        fetchReactionCounts();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const fetchReactionCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('type')
        .eq('thread_id', threadId);

      if (data && !error) {
        const counts = {};
        data.forEach(reaction => {
          counts[reaction.type] = (counts[reaction.type] || 0) + 1;
        });
        setReactions(counts);
      }
    } catch (error) {
      console.error('Error fetching reaction counts:', error);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (userReaction === reactionType) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('thread_id', threadId)
          .eq('user_id', user.id);

        setUserReaction(null);
      } else {
        // Add or update reaction
        await supabase
          .from('reactions')
          .upsert({
            thread_id: threadId,
            user_id: user.id,
            type: reactionType
          });

        setUserReaction(reactionType);
      }

      fetchReactionCounts();
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {REACTIONS.map((reaction) => {
        const count = reactions[reaction.type] || 0;
        const isActive = userReaction === reaction.type;

        return (
          <motion.button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={isLoading}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-all ${
              isActive 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={reaction.description}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.label}</span>
            {count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
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