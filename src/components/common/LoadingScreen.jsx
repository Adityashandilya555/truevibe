
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain } from 'lucide-react';

const LoadingScreen = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    pulse: { 
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 0.6 }
    }
  };

  const dotVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.6
      }
    })
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Main Logo Animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center mb-8"
        >
          <motion.div
            variants={iconVariants}
            animate="pulse"
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <Sparkles className="w-16 h-16 text-yellow-400" />
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"></div>
          </motion.div>
        </motion.div>

        {/* Brand Text */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gradient mb-2">TrueVibe</h1>
          <p className="text-xl text-gray-300">Connecting hearts through emotions</p>
        </motion.div>

        {/* Loading Indicators */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          {[
            { icon: Heart, color: "text-red-400", delay: 0 },
            { icon: Brain, color: "text-blue-400", delay: 0.3 },
            { icon: Sparkles, color: "text-yellow-400", delay: 0.6 }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <div className={`absolute inset-0 ${item.color.replace('text-', 'bg-')}/20 rounded-full blur-lg`}></div>
            </motion.div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-400 font-medium">Loading</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <p className="text-sm text-gray-400">
            Initializing emotion detection...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
