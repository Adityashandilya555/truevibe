import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, MessageSquare, Megaphone } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import FiveReactionSystem from '../../services/fiveReactionSystem';

const ReactionSystem = ({ threadId, reactions = {} }) => {
  const { user } = useAuthStore();
  const { addReaction, isSubmittingReaction } = useAppStore();
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState(reactions);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reactionSystem] = useState(() => new FiveReactionSystem());

  const reactionTypes = [
    { type: 'resonate', icon: Heart, label: 'Resonate', color: '#FF6B6B' },
    { type: 'support', icon: Users, label: 'Support', color: '#4ECDC4' },
    { type: 'learn', icon: BookOpen, label: 'Learn', color: '#45B7D1' },
    { type: 'challenge', icon: MessageSquare, label: 'Challenge', color: '#FFA07A' },
    { type: 'amplify', icon: Megaphone, label: 'Amplify', color: '#98D8C8' },
  ];

  // Listen for real-time reaction updates
  useEffect(() => {
    const handleReactionUpdate = (event) => {
      if (event.detail.threadId === threadId) {
        setReactionCounts(event.detail.newCounts);
      }
    };

    window.addEventListener('truevibe_reaction_update', handleReactionUpdate);
    return () => window.removeEventListener('truevibe_reaction_update', handleReactionUpdate);
  }, [threadId]);

  // Check user's existing reaction on mount
  useEffect(() => {
    if (user && threadId) {
      const checkUserReaction = async () => {
        // For demo mode, check localStorage
        if (user.id.includes('demo') || user.id.includes('mock')) {
          const demoReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
          const threadReactions = demoReactions[threadId] || {};
          const existingReaction = threadReactions[user.id];
          if (existingReaction) {
            setUserReaction(existingReaction);
          }
        }
      };

      checkUserReaction();
    }
  }, [user, threadId]);

  const handleReaction = async (reactionType) => {
    if (!user || isSubmittingReaction || isAnimating) return;

    setIsAnimating(true);

    try {
      // Create reaction event
      const reactionEvent = {
        userId: user.id,
        threadId,
        reactionType,
        timestamp: new Date(),
        context: {
          deviceType: 'web',
          sessionId: 'demo_session',
          sourceLocation: 'feed'
        }
      };

      // Process reaction through the advanced system
      const result = await reactionSystem.processReaction(reactionEvent);

      if (result.success) {
        // Update local state
        setReactionCounts(result.newCounts);
        
        // Update user reaction state
        if (userReaction === reactionType) {
          setUserReaction(null); // Removed reaction
        } else {
          setUserReaction(reactionType); // Added new reaction
        }

        // Update app store for demo mode
        if (user.id.includes('mock') || user.id.includes('demo') || user.email === 'demo@truevibe.com') {
          useAppStore.setState(state => ({
            threads: state.threads.map(thread => 
              thread.id === threadId 
                ? { ...thread, reaction_counts: result.newCounts }
                : thread
            )
          }));
        }
      } else {
        throw new Error('Failed to process reaction');
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
      // Revert optimistic update on error
      setReactionCounts(reactions);
      setUserReaction(null);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex space-x-2 overflow-x-auto">
        {reactionTypes.map(({ type, icon: Icon, label, color }) => {
          const count = reactionCounts[type] || 0;
          const isActive = userReaction === type;

          return (
            <motion.button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={isAnimating}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-opacity-20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: isActive ? color : undefined,
                color: isActive ? 'white' : undefined,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              {count > 0 && (
                <span className="bg-white bg-opacity-30 rounded-full px-2 py-0.5 text-xs">
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Total reactions */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)} reactions
      </div>
    </div>
  );
};

export default ReactionSystem;