import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MessageCircle, Sparkles } from 'lucide-react';

const BottomTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile'
    },
    {
      id: 'threads',
      label: 'Threads',
      icon: MessageCircle,
      path: '/threads'
    },
    {
      id: 'vibes',
      label: 'Vibes',
      icon: Sparkles,
      path: '/vibes'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive 
                  ? 'text-cyan-400' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabs;