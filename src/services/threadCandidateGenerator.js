
import { supabase } from './supabase';
import EmotionDetectionEngine from './emotion/emotionDetectionEngine';

class ThreadCandidateGenerator {
  constructor() {
    this.emotionEngine = new EmotionDetectionEngine();
  }

  // Main candidate generation function - Twitter's approach
  async generateCandidates(userId, limit = 500) {
    const startTime = Date.now();
    
    // Parallel candidate fetching (Twitter pattern)
    const [
      inNetworkCandidates,
      outNetworkCandidates,
      emotionSimilarCandidates,
      trendingCandidates
    ] = await Promise.all([
      this.getInNetworkCandidates(userId, Math.floor(limit * 0.45)),
      this.getOutNetworkCandidates(userId, Math.floor(limit * 0.35)),
      this.getEmotionSimilarCandidates(userId, Math.floor(limit * 0.15)),
      this.getTrendingCandidates(Math.floor(limit * 0.05))
    ]);

    const allCandidates = [
      ...inNetworkCandidates,
      ...outNetworkCandidates,
      ...emotionSimilarCandidates,
      ...trendingCandidates
    ];

    console.log(`Candidate generation took ${Date.now() - startTime}ms for ${allCandidates.length} candidates`);
    
    return this.deduplicateAndShuffle(allCandidates);
  }

  // In-network candidates (50% of Twitter's feed)
  async getInNetworkCandidates(userId, limit) {
    try {
      // Get user's following list
      const { data: following } = await supabase
        .from('user_follows')
        .select('following_user_id')
        .eq('follower_user_id', userId);

      if (!following || following.length === 0) {
        return [];
      }

      const followingIds = following.map(f => f.following_user_id);

      // Get recent threads from followed users
      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, user_id, content, hashtags, emotion, emotion_score,
          reaction_counts, created_at,
          user_profiles:user_id (username, avatar_url)
        `)
        .in('user_id', followingIds)
        .gte('created_at', new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()) // Last 72 hours
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get extra for filtering

      return this.formatCandidates(threads || [], 'in_network');
    } catch (error) {
      console.error('Error fetching in-network candidates:', error);
      return [];
    }
  }

  // Out-of-network candidates (discovery)
  async getOutNetworkCandidates(userId, limit) {
    try {
      // Get user's interests and blocked users
      const [userInterests, blockedUsers] = await Promise.all([
        this.getUserInterests(userId),
        this.getBlockedUsers(userId)
      ]);

      // Find threads with similar hashtags/topics
      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, user_id, content, hashtags, emotion, emotion_score,
          reaction_counts, created_at,
          user_profiles:user_id (username, avatar_url)
        `)
        .not('user_id', 'in', `(${blockedUsers.join(',')})`)
        .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(limit * 3);

      // Filter by user interests
      const relevantThreads = (threads || []).filter(thread => {
        return thread.hashtags.some(hashtag => 
          userInterests.topics.includes(hashtag.toLowerCase())
        ) || userInterests.emotions.includes(thread.emotion);
      });

      return this.formatCandidates(relevantThreads.slice(0, limit), 'out_network');
    } catch (error) {
      console.error('Error fetching out-network candidates:', error);
      return [];
    }
  }

  // Emotion-similar candidates (TrueVibe unique)
  async getEmotionSimilarCandidates(userId, limit) {
    try {
      // Get user's emotion preferences
      const userEmotionProfile = await this.getUserEmotionProfile(userId);
      
      // Find threads with compatible emotions
      const compatibleEmotions = this.getCompatibleEmotions(userEmotionProfile.dominantEmotions);
      
      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, user_id, content, hashtags, emotion, emotion_score,
          reaction_counts, created_at,
          user_profiles:user_id (username, avatar_url)
        `)
        .in('emotion', compatibleEmotions)
        .gte('emotion_score', 0.6) // High confidence emotions only
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('emotion_score', { ascending: false })
        .limit(limit * 2);

      return this.formatCandidates(threads || [], 'emotion_similar');
    } catch (error) {
      console.error('Error fetching emotion-similar candidates:', error);
      return [];
    }
  }

  // Trending candidates
  async getTrendingCandidates(limit) {
    try {
      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, user_id, content, hashtags, emotion, emotion_score,
          reaction_counts, created_at,
          user_profiles:user_id (username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()) // Last 12 hours
        .order('created_at', { ascending: false })
        .limit(limit);

      return this.formatCandidates(threads || [], 'trending');
    } catch (error) {
      console.error('Error fetching trending candidates:', error);
      return [];
    }
  }

  // Helper functions
  formatCandidates(threads, source) {
    return threads.map(thread => ({
      id: thread.id,
      userId: thread.user_id,
      content: thread.content,
      hashtags: thread.hashtags || [],
      emotion: {
        primary: thread.emotion,
        confidence: thread.emotion_score,
        intensity: 1.0,
        rawScores: { compound: 0, positive: 0, negative: 0, neutral: 0 }
      },
      createdAt: new Date(thread.created_at),
      source,
      sourceScore: 0.5,
      engagementMetrics: {
        reactions: thread.reaction_counts || { resonate: 0, support: 0, learn: 0, challenge: 0, amplify: 0 },
        replyCount: 0,
        shareCount: 0,
        viewCount: 0,
        reactionsPerHour: this.calculateReactionsPerHour(thread)
      }
    }));
  }

  calculateReactionsPerHour(thread) {
    const ageHours = (Date.now() - new Date(thread.created_at).getTime()) / (1000 * 60 * 60);
    const totalReactions = Object.values(thread.reaction_counts || {}).reduce((a, b) => a + b, 0);
    return totalReactions / Math.max(ageHours, 1);
  }

  async getUserInterests(userId) {
    // Default interests for demo mode
    return { topics: ['truevibe', 'emotions', 'social'], emotions: ['joy', 'trust'] };
  }

  async getBlockedUsers(userId) {
    return [];
  }

  async getUserEmotionProfile(userId) {
    return { dominantEmotions: ['joy', 'trust', 'anticipation'] };
  }

  getCompatibleEmotions(dominantEmotions) {
    const emotionCompatibility = {
      joy: ['joy', 'trust', 'anticipation', 'surprise'],
      trust: ['trust', 'joy', 'anticipation'],
      fear: ['fear', 'sadness', 'anger'],
      surprise: ['surprise', 'joy', 'fear', 'anticipation'],
      sadness: ['sadness', 'fear', 'anger'],
      disgust: ['disgust', 'anger', 'fear'],
      anger: ['anger', 'disgust', 'fear'],
      anticipation: ['anticipation', 'joy', 'trust', 'surprise']
    };

    const compatible = new Set();
    dominantEmotions.forEach(emotion => {
      emotionCompatibility[emotion]?.forEach(comp => compatible.add(comp));
    });

    return Array.from(compatible);
  }

  deduplicateAndShuffle(candidates) {
    // Remove duplicates by ID
    const seen = new Set();
    const unique = candidates.filter(candidate => {
      if (seen.has(candidate.id)) return false;
      seen.add(candidate.id);
      return true;
    });

    // Shuffle while maintaining some source balance
    const shuffled = [];
    const bySources = {
      in_network: unique.filter(c => c.source === 'in_network'),
      out_network: unique.filter(c => c.source === 'out_network'),
      emotion_similar: unique.filter(c => c.source === 'emotion_similar'),
      trending: unique.filter(c => c.source === 'trending')
    };

    // Interleave sources
    const maxLength = Math.max(...Object.values(bySources).map(arr => arr.length));
    for (let i = 0; i < maxLength; i++) {
      Object.values(bySources).forEach(sourceArray => {
        if (i < sourceArray.length) {
          shuffled.push(sourceArray[i]);
        }
      });
    }

    return shuffled;
  }
}

export default ThreadCandidateGenerator;
