
import { supabase } from './supabase';

class FiveReactionSystem {
  constructor() {
    this.reactionTypes = ['resonate', 'support', 'learn', 'challenge', 'amplify'];
  }

  async processReaction(event) {
    const startTime = Date.now();
    
    try {
      // 1. Check if user already reacted with this type
      const existingReaction = await this.checkExistingReaction(
        event.userId, 
        event.threadId, 
        event.reactionType
      );
      
      if (existingReaction) {
        // Remove existing reaction
        await this.removeReaction(event.userId, event.threadId, event.reactionType);
        return {
          success: true,
          newCounts: await this.getReactionCounts(event.threadId),
          rankingImpact: 0
        };
      }
      
      // 2. Remove any other reaction from this user on this thread
      await this.removeAllUserReactions(event.userId, event.threadId);
      
      // 3. Add new reaction
      await this.addReaction(event);
      
      // 4. Update thread engagement metrics
      const rankingImpact = await this.updateThreadEngagement(event);
      
      // 5. Update user behavior signals
      await this.updateUserBehaviorSignals(event);
      
      // 6. Update user emotion preferences
      await this.updateUserEmotionPreferences(event);
      
      // 7. Trigger real-time updates
      await this.broadcastReactionUpdate(event);
      
      const newCounts = await this.getReactionCounts(event.threadId);
      
      console.log(`Reaction processed in ${Date.now() - startTime}ms`);
      
      return {
        success: true,
        newCounts,
        rankingImpact
      };
      
    } catch (error) {
      console.error('Error processing reaction:', error);
      return {
        success: false,
        newCounts: await this.getReactionCounts(event.threadId),
        rankingImpact: 0
      };
    }
  }

  async checkExistingReaction(userId, threadId, reactionType) {
    // For demo mode, check localStorage
    if (userId.includes('demo') || userId.includes('mock')) {
      const demoReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      const threadReactions = demoReactions[threadId] || {};
      return threadReactions[userId] === reactionType;
    }

    const { data } = await supabase
      .from('user_thread_interactions')
      .select('id')
      .eq('user_id', userId)
      .eq('thread_id', threadId)
      .eq('interaction_type', 'reaction')
      .eq('interaction_subtype', reactionType)
      .single();
      
    return !!data;
  }

  async removeReaction(userId, threadId, reactionType) {
    // For demo mode, update localStorage
    if (userId.includes('demo') || userId.includes('mock')) {
      const demoReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      if (demoReactions[threadId] && demoReactions[threadId][userId] === reactionType) {
        delete demoReactions[threadId][userId];
        localStorage.setItem('truevibe_user_reactions', JSON.stringify(demoReactions));
        
        // Update thread counts in localStorage
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        const updatedThreads = demoThreads.map(thread => {
          if (thread.id === threadId) {
            const newCounts = { ...thread.reaction_counts };
            newCounts[reactionType] = Math.max(0, (newCounts[reactionType] || 0) - 1);
            return { ...thread, reaction_counts: newCounts };
          }
          return thread;
        });
        localStorage.setItem('truevibe_demo_threads', JSON.stringify(updatedThreads));
      }
      return;
    }

    // Remove from interactions table
    await supabase
      .from('user_thread_interactions')
      .delete()
      .eq('user_id', userId)
      .eq('thread_id', threadId)
      .eq('interaction_type', 'reaction')
      .eq('interaction_subtype', reactionType);
    
    // Update thread reaction counts
    await this.decrementReactionCount(threadId, reactionType);
  }

  async removeAllUserReactions(userId, threadId) {
    // For demo mode, update localStorage
    if (userId.includes('demo') || userId.includes('mock')) {
      const demoReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      if (demoReactions[threadId] && demoReactions[threadId][userId]) {
        const oldReactionType = demoReactions[threadId][userId];
        delete demoReactions[threadId][userId];
        localStorage.setItem('truevibe_user_reactions', JSON.stringify(demoReactions));
        
        // Update thread counts
        const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
        const updatedThreads = demoThreads.map(thread => {
          if (thread.id === threadId) {
            const newCounts = { ...thread.reaction_counts };
            newCounts[oldReactionType] = Math.max(0, (newCounts[oldReactionType] || 0) - 1);
            return { ...thread, reaction_counts: newCounts };
          }
          return thread;
        });
        localStorage.setItem('truevibe_demo_threads', JSON.stringify(updatedThreads));
      }
      return;
    }

    // Get existing reactions to decrement counts
    const { data: existing } = await supabase
      .from('user_thread_interactions')
      .select('interaction_subtype')
      .eq('user_id', userId)
      .eq('thread_id', threadId)
      .eq('interaction_type', 'reaction');
    
    if (existing && existing.length > 0) {
      // Remove all existing reactions
      await supabase
        .from('user_thread_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('thread_id', threadId)
        .eq('interaction_type', 'reaction');
      
      // Decrement counts for each existing reaction
      for (const reaction of existing) {
        await this.decrementReactionCount(threadId, reaction.interaction_subtype);
      }
    }
  }

  async addReaction(event) {
    // For demo mode, update localStorage
    if (event.userId.includes('demo') || event.userId.includes('mock')) {
      const demoReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      if (!demoReactions[event.threadId]) {
        demoReactions[event.threadId] = {};
      }
      demoReactions[event.threadId][event.userId] = event.reactionType;
      localStorage.setItem('truevibe_user_reactions', JSON.stringify(demoReactions));
      
      // Update thread counts
      const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
      const updatedThreads = demoThreads.map(thread => {
        if (thread.id === event.threadId) {
          const newCounts = { ...thread.reaction_counts };
          newCounts[event.reactionType] = (newCounts[event.reactionType] || 0) + 1;
          return { ...thread, reaction_counts: newCounts };
        }
        return thread;
      });
      localStorage.setItem('truevibe_demo_threads', JSON.stringify(updatedThreads));
      return;
    }

    // Add to interactions table
    await supabase
      .from('user_thread_interactions')
      .insert({
        user_id: event.userId,
        thread_id: event.threadId,
        interaction_type: 'reaction',
        interaction_subtype: event.reactionType,
        device_type: event.context?.deviceType || 'web',
        session_id: event.context?.sessionId || 'demo',
        source_location: event.context?.sourceLocation || 'feed',
        created_at: event.timestamp.toISOString()
      });
    
    // Update thread reaction counts
    await this.incrementReactionCount(event.threadId, event.reactionType);
  }

  async incrementReactionCount(threadId, reactionType) {
    // Use Supabase RPC for atomic updates
    await supabase.rpc('increment_reaction_count', {
      thread_id: threadId,
      reaction_type: reactionType
    });
  }

  async decrementReactionCount(threadId, reactionType) {
    // Use Supabase RPC for atomic updates
    await supabase.rpc('decrement_reaction_count', {
      thread_id: threadId,
      reaction_type: reactionType
    });
  }

  async updateThreadEngagement(event) {
    // Calculate reaction impact based on type and timing
    const reactionWeights = {
      resonate: 1.0,
      support: 0.8,
      learn: 0.6,
      challenge: 0.4,
      amplify: 1.5
    };
    
    const baseImpact = reactionWeights[event.reactionType];
    
    // For demo mode, we'll use a simplified calculation
    const userAuthority = 0.5; // Default user authority
    const timeFactor = 1.0; // No time decay for demo
    const authorityFactor = 1 + (userAuthority * 0.5);
    
    const rankingImpact = baseImpact * timeFactor * authorityFactor;
    
    return rankingImpact;
  }

  async updateUserBehaviorSignals(event) {
    // For demo mode, we'll store simplified behavior signals
    if (event.userId.includes('demo') || event.userId.includes('mock')) {
      const behaviorSignals = JSON.parse(localStorage.getItem('truevibe_user_behavior') || '{}');
      if (!behaviorSignals[event.userId]) {
        behaviorSignals[event.userId] = { reactions: {} };
      }
      
      if (!behaviorSignals[event.userId].reactions[event.reactionType]) {
        behaviorSignals[event.userId].reactions[event.reactionType] = 0;
      }
      behaviorSignals[event.userId].reactions[event.reactionType]++;
      
      localStorage.setItem('truevibe_user_behavior', JSON.stringify(behaviorSignals));
    }
  }

  async updateUserEmotionPreferences(event) {
    // Calculate preference adjustment based on reaction type
    const preferenceAdjustments = {
      resonate: 0.1,    // Strong positive signal
      support: 0.08,    // Positive signal
      learn: 0.05,      // Mild positive signal
      challenge: -0.02, // Mild negative signal
      amplify: 0.12     // Strongest positive signal
    };
    
    const adjustment = preferenceAdjustments[event.reactionType];
    
    // For demo mode, store in localStorage
    if (event.userId.includes('demo') || event.userId.includes('mock')) {
      const emotionPrefs = JSON.parse(localStorage.getItem('truevibe_emotion_prefs') || '{}');
      if (!emotionPrefs[event.userId]) {
        emotionPrefs[event.userId] = { 
          joy: 0.5, trust: 0.5, fear: 0.5, surprise: 0.5,
          sadness: 0.5, disgust: 0.5, anger: 0.5, anticipation: 0.5
        };
      }
      
      // We'd need the thread emotion here - for demo, assume 'joy'
      const threadEmotion = 'joy';
      emotionPrefs[event.userId][threadEmotion] = Math.max(0, Math.min(1, 
        emotionPrefs[event.userId][threadEmotion] + adjustment
      ));
      
      localStorage.setItem('truevibe_emotion_prefs', JSON.stringify(emotionPrefs));
    }
  }

  async broadcastReactionUpdate(event) {
    const newCounts = await this.getReactionCounts(event.threadId);
    
    // For demo mode, we'll use a custom event system
    if (event.userId.includes('demo') || event.userId.includes('mock')) {
      window.dispatchEvent(new CustomEvent('truevibe_reaction_update', {
        detail: {
          threadId: event.threadId,
          reactionType: event.reactionType,
          newCounts,
          userId: event.userId
        }
      }));
      return;
    }

    // Send real-time update to all connected clients
    try {
      await supabase.channel(`thread_${event.threadId}`)
        .send({
          type: 'broadcast',
          event: 'reaction_update',
          payload: {
            threadId: event.threadId,
            reactionType: event.reactionType,
            newCounts,
            userId: event.userId
          }
        });
    } catch (error) {
      console.error('Error broadcasting reaction update:', error);
    }
  }

  async getReactionCounts(threadId) {
    // For demo mode, get from localStorage
    const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
    const demoThread = demoThreads.find(t => t.id === threadId);
    if (demoThread) {
      return demoThread.reaction_counts || { resonate: 0, support: 0, learn: 0, challenge: 0, amplify: 0 };
    }

    const { data: thread } = await supabase
      .from('threads')
      .select('reaction_counts')
      .eq('id', threadId)
      .single();
    
    if (!thread || !thread.reaction_counts) {
      return { resonate: 0, support: 0, learn: 0, challenge: 0, amplify: 0 };
    }
    
    return thread.reaction_counts;
  }
}

export default FiveReactionSystem;
