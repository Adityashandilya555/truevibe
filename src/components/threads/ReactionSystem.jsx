import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, MessageSquare, Megaphone } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';

const ReactionSystem = ({ threadId, reactions = {} }) => {
  const { user } = useAuthStore();
  const { addReaction, isSubmittingReaction } = useAppStore();
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState(reactions);
  const [isAnimating, setIsAnimating] = useState(false);

  const reactionTypes = [
    { type: 'resonate', icon: Heart, label: 'Resonate', color: '#FF6B6B' },
    { type: 'support', icon: Users, label: 'Support', color: '#4ECDC4' },
    { type: 'learn', icon: BookOpen, label: 'Learn', color: '#45B7D1' },
    { type: 'challenge', icon: MessageSquare, label: 'Challenge', color: '#FFA07A' },
    { type: 'amplify', icon: Megaphone, label: 'Amplify', color: '#98D8C8' },
  ];

  const handleReaction = async (reactionType) => {
    if (!user || isSubmittingReaction || isAnimating) return;

    setIsAnimating(true);

    try {
      // Optimistic update
      const newCounts = { ...reactionCounts };

      if (userReaction === reactionType) {
        // Remove reaction
        newCounts[reactionType] = Math.max(0, (newCounts[reactionType] || 0) - 1);
        setUserReaction(null);
      } else {
        // Add new reaction
        if (userReaction) {
          newCounts[userReaction] = Math.max(0, (newCounts[userReaction] || 0) - 1);
        }
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
        setUserReaction(reactionType);
      }

      setReactionCounts(newCounts);

      // Handle demo mode
      if (user.id.includes('mock') || user.id.includes('demo') || user.email === 'demo@truevibe.com') {
        // Demo mode - update localStorage
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        const updatedThreads = demoThreads.map(thread => {
          if (thread.id === threadId) {
            return { ...thread, reaction_counts: newCounts };
          }
          return thread;
        });
        localStorage.setItem('truevibe_demo_threads', JSON.stringify(updatedThreads));

        // Update app store
        useAppStore.setState(state => ({
          threads: state.threads.map(thread => 
            thread.id === threadId 
              ? { ...thread, reaction_counts: newCounts }
              : thread
          )
        }));
      } else {
        // Real mode - submit to backend
        await addReaction(threadId, reactionType);
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