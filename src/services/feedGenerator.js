
import ThreadCandidateGenerator from './threadCandidateGenerator';
import ThreadRankingPipeline from './threadRankingPipeline';
import FiveReactionSystem from './fiveReactionSystem';
import EmotionDetectionEngine from './emotion/emotionDetectionEngine';

class FeedGenerator {
  constructor() {
    this.candidateGenerator = new ThreadCandidateGenerator();
    this.rankingPipeline = new ThreadRankingPipeline();
    this.reactionSystem = new FiveReactionSystem();
    this.emotionEngine = new EmotionDetectionEngine();
  }

  /**
   * Generate a personalized feed for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of threads to return
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Ranked thread candidates
   */
  async generateFeed(userId, limit = 50, options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`🚀 Starting feed generation for user ${userId}`);
      
      // Step 1: Generate candidates using Twitter's approach
      const candidateLimit = Math.min(limit * 10, 500); // Get 10x more candidates than needed
      const candidates = await this.candidateGenerator.generateCandidates(userId, candidateLimit);
      
      console.log(`📊 Generated ${candidates.length} candidates in ${Date.now() - startTime}ms`);
      
      if (candidates.length === 0) {
        return this.getFallbackFeed(userId, limit);
      }

      // Step 2: Rank candidates using Light + Heavy ranker
      const rankedCandidates = await this.rankingPipeline.rankCandidates(candidates, userId, limit);
      
      console.log(`⚡ Ranked ${rankedCandidates.length} candidates in ${Date.now() - startTime}ms`);

      // Step 3: Format for UI consumption
      const formattedFeed = this.formatFeedForUI(rankedCandidates);

      // Step 4: Add user interaction signals
      const enrichedFeed = await this.enrichWithUserSignals(formattedFeed, userId);

      console.log(`✅ Feed generation completed in ${Date.now() - startTime}ms`);

      return enrichedFeed;

    } catch (error) {
      console.error('❌ Error generating feed:', error);
      return this.getFallbackFeed(userId, limit);
    }
  }

  /**
   * Get a fallback feed when main generation fails
   * @param {string} userId - User ID
   * @param {number} limit - Number of threads
   * @returns {Promise<Array>} Fallback threads
   */
  async getFallbackFeed(userId, limit) {
    console.log('🔄 Using fallback feed generation');
    
    // For demo mode, return demo threads from localStorage
    if (userId.includes('demo') || userId.includes('mock')) {
      const demoThreads = JSON.parse(localStorage.getItem('truevibe_demo_threads') || '[]');
      return demoThreads.slice(0, limit).map(thread => ({
        ...thread,
        finalScore: 0.5,
        source: 'fallback',
        userInteraction: null
      }));
    }

    // Return default threads with basic emotion analysis
    return this.getDefaultThreads(limit);
  }

  /**
   * Format ranked candidates for UI consumption
   * @param {Array} rankedCandidates - Ranked thread candidates
   * @returns {Array} Formatted feed items
   */
  formatFeedForUI(rankedCandidates) {
    return rankedCandidates.map(({ candidate, finalScore, features }) => ({
      id: candidate.id,
      user_id: candidate.userId,
      content: candidate.content,
      hashtags: candidate.hashtags,
      emotion: candidate.emotion.primary,
      emotion_score: candidate.emotion.confidence,
      secondary_emotion: candidate.emotion.secondary,
      emotion_intensity: candidate.emotion.intensity,
      reaction_counts: candidate.engagementMetrics.reactions,
      created_at: candidate.createdAt.toISOString(),
      source: candidate.source,
      finalScore,
      features: {
        emotionAlignment: features.emotionAlignment,
        qualityScore: features.qualityScore,
        socialScore: features.isFollowing ? 1.0 : 0.0,
        engagementVelocity: features.engagementVelocity
      },
      user_profiles: {
        username: `user_${candidate.userId.slice(-6)}`,
        avatar_url: null,
        adjective_one: this.getRandomAdjective(),
        adjective_two: this.getRandomAdjective(),
        adjective_three: this.getRandomAdjective()
      }
    }));
  }

  /**
   * Enrich feed with user interaction signals
   * @param {Array} feedItems - Formatted feed items
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Enriched feed items
   */
  async enrichWithUserSignals(feedItems, userId) {
    // For demo mode, check localStorage for user reactions
    if (userId.includes('demo') || userId.includes('mock')) {
      const userReactions = JSON.parse(localStorage.getItem('truevibe_user_reactions') || '{}');
      
      return feedItems.map(item => ({
        ...item,
        userInteraction: userReactions[item.id]?.[userId] || null,
        isBookmarked: false,
        isFollowingAuthor: false
      }));
    }

    // For real users, fetch from database
    return feedItems.map(item => ({
      ...item,
      userInteraction: null,
      isBookmarked: false,
      isFollowingAuthor: false
    }));
  }

  /**
   * Get default threads for new users or fallback
   * @param {number} limit - Number of threads
   * @returns {Array} Default threads
   */
  getDefaultThreads(limit) {
    const defaultThreads = [
      {
        id: 'default_1',
        content: 'Welcome to TrueVibe! 🎉 This is an emotion-aware social platform where your feelings matter. Share your authentic self!',
        emotion: 'joy',
        hashtags: ['welcome', 'truevibe', 'emotions']
      },
      {
        id: 'default_2',
        content: 'Sometimes the most profound connections happen when we share our vulnerabilities. Today I learned that asking for help is actually a sign of strength. 💪',
        emotion: 'trust',
        hashtags: ['vulnerability', 'strength', 'learning']
      },
      {
        id: 'default_3',
        content: 'The anticipation before a big presentation always gets me. But I\'ve learned to channel that nervous energy into excitement! ⚡',
        emotion: 'anticipation',
        hashtags: ['presentation', 'nerves', 'growth']
      }
    ];

    return defaultThreads.slice(0, limit).map((thread, index) => {
      const emotion = this.emotionEngine.analyzeEmotion(thread.content);
      
      return {
        id: thread.id,
        user_id: `default_user_${index + 1}`,
        content: thread.content,
        hashtags: thread.hashtags,
        emotion: emotion.primary,
        emotion_score: emotion.confidence,
        secondary_emotion: emotion.secondary,
        emotion_intensity: emotion.intensity || 1.0,
        reaction_counts: {
          resonate: Math.floor(Math.random() * 20),
          support: Math.floor(Math.random() * 15),
          learn: Math.floor(Math.random() * 10),
          challenge: Math.floor(Math.random() * 5),
          amplify: Math.floor(Math.random() * 8)
        },
        created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        source: 'default',
        finalScore: 0.7,
        features: {
          emotionAlignment: 0.8,
          qualityScore: 0.9,
          socialScore: 0.0,
          engagementVelocity: 2.5
        },
        user_profiles: {
          username: `TrueViberUser${index + 1}`,
          avatar_url: null,
          adjective_one: this.getRandomAdjective(),
          adjective_two: this.getRandomAdjective(),
          adjective_three: this.getRandomAdjective()
        },
        userInteraction: null,
        isBookmarked: false,
        isFollowingAuthor: false
      };
    });
  }

  /**
   * Get a random adjective for user profiles
   * @returns {string} Random adjective
   */
  getRandomAdjective() {
    const adjectives = [
      'Creative', 'Empathetic', 'Curious', 'Thoughtful', 'Inspiring',
      'Genuine', 'Compassionate', 'Insightful', 'Optimistic', 'Reflective',
      'Authentic', 'Passionate', 'Mindful', 'Resilient', 'Wise',
      'Adventurous', 'Caring', 'Determined', 'Graceful', 'Humble'
    ];
    
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  }

  /**
   * Invalidate user's feed cache (call when user preferences change)
   * @param {string} userId - User ID
   */
  async invalidateUserFeed(userId) {
    console.log(`🗑️ Invalidating feed cache for user ${userId}`);
    
    // In a real implementation, this would clear Redis cache
    // For demo mode, we'll clear localStorage cache
    if (userId.includes('demo') || userId.includes('mock')) {
      localStorage.removeItem(`truevibe_feed_cache_${userId}`);
    }
  }

  /**
   * Get feed metrics for analytics
   * @param {Array} feedItems - Generated feed items
   * @returns {Object} Feed metrics
   */
  getFeedMetrics(feedItems) {
    if (!feedItems || feedItems.length === 0) {
      return {
        totalItems: 0,
        averageScore: 0,
        emotionDistribution: {},
        sourceDistribution: {}
      };
    }

    const emotionCounts = {};
    const sourceCounts = {};
    let totalScore = 0;

    feedItems.forEach(item => {
      // Count emotions
      emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
      
      // Count sources
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
      
      // Sum scores
      totalScore += item.finalScore || 0;
    });

    return {
      totalItems: feedItems.length,
      averageScore: totalScore / feedItems.length,
      emotionDistribution: emotionCounts,
      sourceDistribution: sourceCounts
    };
  }
}

export default FeedGenerator;
