import React from 'react';
import { useLocation, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { User, MessageCircle, Sparkles, Home } from 'lucide-react';

// New Landing Page Component
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to TruVibe</h1>
      <p className="text-lg mb-8">
        An emotion-aware application designed to connect you with others.
      </p>
      <Link to="/login" className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </Link>
    </div>
  );
};

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

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 z-50">
        <div className="flex justify-start items-center h-16">
          {/* Home Button/Link */}
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>

          {/* Documentation Link */}
          <Link
            to="/documentation"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/documentation' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Documentation</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<>Profile Component</>} /> {/* Placeholder */}
        <Route path="/threads" element={<>Threads Component</>} /> {/* Placeholder */}
        <Route path="/vibes" element={<>Vibes Component</>} /> {/* Placeholder */}
        <Route path="/documentation" element={<>Documentation Component</>} /> {/* Placeholder */}
      </Routes>
      <BottomTabs />
    </>
  );
};

export default AppNavigation;
```

```analysis
The code generates a navigation structure with a landing page, home button, and documentation link, integrating the provided BottomTabs component.
```

```replit_final_file
import React from 'react';
import { useLocation, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { User, MessageCircle, Sparkles, Home } from 'lucide-react';

// New Landing Page Component
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to TruVibe</h1>
      <p className="text-lg mb-8">
        An emotion-aware application designed to connect you with others.
      </p>
      <Link to="/login" className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </Link>
    </div>
  );
};

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

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 z-50">
        <div className="flex justify-start items-center h-16">
          {/* Home Button/Link */}
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>

          {/* Documentation Link */}
          <Link
            to="/documentation"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/documentation' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Documentation</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<>Profile Component</>} /> {/* Placeholder */}
        <Route path="/threads" element={<>Threads Component</>} /> {/* Placeholder */}
        <Route path="/vibes" element={<>Vibes Component</>} /> {/* Placeholder */}
        <Route path="/documentation" element={<>Documentation Component</>} /> {/* Placeholder */}
      </Routes>
      <BottomTabs />
    </>
  );
};

export default AppNavigation;
```import React from 'react';
import { useLocation, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { User, MessageCircle, Sparkles, Home } from 'lucide-react';

// New Landing Page Component
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to TruVibe</h1>
      <p className="text-lg mb-8">
        An emotion-aware application designed to connect you with others.
      </p>
      <Link to="/login" className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </Link>
    </div>
  );
};

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

// Dummy Components
const ProfileComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Profile Component</div>;
const ThreadsComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Threads Component</div>;
const VibesComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Vibes Component</div>;
const DocumentationComponent = () => <div className="h-screen bg-gray-700 text-white flex items-center justify-center">Documentation Component</div>;

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 z-50">
        <div className="flex justify-start items-center h-16">
          {/* Home Button/Link */}
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>

          {/* Documentation Link */}
          <Link
            to="/documentation"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              location.pathname === '/documentation' ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Documentation</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfileComponent />} />
        <Route path="/threads" element={<ThreadsComponent />} />
        <Route path="/vibes" element={<VibesComponent />} />
        <Route path="/documentation" element={<DocumentationComponent />} />
      </Routes>
      <BottomTabs />
    </>
  );
};

export default AppNavigation;