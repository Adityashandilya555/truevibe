import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreadComposer from '../components/threads/ThreadComposer';
import ThreadFeed from '../components/threads/ThreadFeed';
import useAuthStore from '../store/authStore';
import useAppStore from '../store/appStore';

const ThreadsPage = () => {
  const { user } = useAuthStore();
  const { fetchThreads, threads } = useAppStore();

  useEffect(() => {
    if (user) {
      // Load demo threads if in demo mode
      if (user.id.includes('mock') || user.id.includes('demo') || user.email === 'demo@truevibe.com') {
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        useAppStore.setState({ threads: demoThreads });
      } else {
        fetchThreads();
      }
    }
  }, [user, fetchThreads]);

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ThreadComposer />
      <ThreadFeed />
    </motion.div>
  );
};

export default ThreadsPage;