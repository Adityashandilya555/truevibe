
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3, MapPin, Calendar, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import StoriesCarousel from '../components/profile/StoriesCarousel';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userThreads, setUserThreads] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserThreads();
      fetchUserStories();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setUserThreads(data || []);
    } catch (error) {
      console.error('Error fetching user threads:', error);
    }
  };

  const fetchUserStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'border-yellow-500',
      trust: 'border-blue-500',
      fear: 'border-purple-500',
      surprise: 'border-orange-500',
      sadness: 'border-indigo-500',
      disgust: 'border-green-500',
      anger: 'border-red-500',
      anticipation: 'border-pink-500'
    };
    return colors[emotion] || 'border-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-2 hover:bg-cyan-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{profile?.name || 'Anonymous'}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {/* Adjectives */}
              <div className="flex gap-2 mb-4">
                {[profile?.adjective_one, profile?.adjective_two, profile?.adjective_three]
                  .filter(Boolean)
                  .map((adjective, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm"
                    >
                      {adjective}
                    </span>
                  ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{userThreads.length} threads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <StoriesCarousel stories={stories} />
        </motion.div>

        {/* Recent Threads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Recent Threads</h2>
          <div className="space-y-4">
            {userThreads.map((thread) => (
              <div
                key={thread.id}
                className={`bg-gray-800 rounded-xl p-4 border-l-4 ${getEmotionColor(thread.emotion)}`}
              >
                <p className="text-gray-300 mb-2">{thread.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{thread.emotion}</span>
                  <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {userThreads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No threads yet. Share your first thought!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
