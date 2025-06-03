import React from 'react';
import TopBar from '../components/navigation/TopBar';
import BottomTabs from '../components/navigation/BottomTabs';

const VibesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Vibes" />
      <div className="max-w-2xl mx-auto pt-16 pb-20 px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vibes Coming Soon</h2>
          <p className="text-gray-600">
            The Vibes feature is in development. Stay tuned for emotion-based content discovery!
          </p>
        </div>
      </div>
      <BottomTabs />
    </div>
  );
};

export default VibesPage;