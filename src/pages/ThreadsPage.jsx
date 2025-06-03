
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreadFeed from '../components/threads/ThreadFeed';
import ThreadComposer from '../components/threads/ThreadComposer';

export default function ThreadsPage() {
  const [showComposer, setShowComposer] = useState(false);

  const handleThreadCreated = (newThread) => {
    console.log('New thread created:', newThread);
    setShowComposer(false);
    // In a real app, you'd refresh the feed or add the thread to the list
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Feed */}
      <ThreadFeed />

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowComposer(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-40 hover:shadow-xl transition-shadow"
      >
        <Plus size={24} />
      </motion.button>

      {/* Thread Composer Modal */}
      <AnimatePresence>
        {showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowComposer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ThreadComposer
                onThreadCreated={handleThreadCreated}
                onCancel={() => setShowComposer(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
