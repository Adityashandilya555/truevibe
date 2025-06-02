/**
 * Performance optimization utilities for TrueVibe
 * Helps prevent violations from long-running timer callbacks
 */

/**
 * Creates a throttled version of setTimeout that uses requestAnimationFrame
 * to avoid performance violations
 * @param {Function} callback - Function to execute
 * @param {number} delay - Delay in milliseconds
 * @returns {number} - Timeout ID
 */
export const optimizedTimeout = (callback, delay) => {
  let start;
  
  // Function to be executed on each animation frame
  const timeoutFunc = (timestamp) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    
    if (elapsed < delay) {
      // Continue waiting
      requestAnimationFrame(timeoutFunc);
    } else {
      // Time elapsed, execute callback
      try {
        callback();
      } catch (error) {
        console.error('Error in optimizedTimeout callback:', error);
      }
    }
  };
  
  // Start the animation frame loop
  const rafId = requestAnimationFrame(timeoutFunc);
  
  // Return an object that can be used to cancel the timeout
  return {
    id: rafId,
    clear: () => cancelAnimationFrame(rafId)
  };
};

/**
 * Creates a throttled version of setInterval that uses requestAnimationFrame
 * to avoid performance violations
 * @param {Function} callback - Function to execute
 * @param {number} interval - Interval in milliseconds
 * @returns {Object} - Object with methods to control the interval
 */
export const optimizedInterval = (callback, interval) => {
  let start;
  let rafId;
  let isRunning = true;
  
  // Function to be executed on each animation frame
  const intervalFunc = (timestamp) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    
    if (elapsed >= interval) {
      // Reset start time for next interval
      start = timestamp;
      
      // Execute callback in a try-catch to prevent crashes
      try {
        callback();
      } catch (error) {
        console.error('Error in optimizedInterval callback:', error);
      }
    }
    
    // Continue the loop if still running
    if (isRunning) {
      rafId = requestAnimationFrame(intervalFunc);
    }
  };
  
  // Start the animation frame loop
  rafId = requestAnimationFrame(intervalFunc);
  
  // Return an object with methods to control the interval
  return {
    id: rafId,
    stop: () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
    },
    restart: () => {
      if (!isRunning) {
        isRunning = true;
        start = undefined;
        rafId = requestAnimationFrame(intervalFunc);
      }
    }
  };
};

/**
 * Optimized version of requestIdleCallback with fallback
 * @param {Function} callback - Function to execute during idle time
 * @param {Object} options - Options object
 * @returns {number} - ID that can be used to cancel the callback
 */
export const optimizedIdleCallback = (callback, options = { timeout: 50 }) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback to setTimeout with a short delay
  return setTimeout(() => {
    const deadline = {
      didTimeout: false,
      timeRemaining: () => 15, // Assume 15ms of idle time
    };
    callback(deadline);
  }, options.timeout || 50);
};

/**
 * Cancel an optimized idle callback
 * @param {number} id - ID returned by optimizedIdleCallback
 */
export const cancelOptimizedIdleCallback = (id) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};
