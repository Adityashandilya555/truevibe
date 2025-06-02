import React, { useState } from 'react';
import { Menu, Settings, LogIn, FileText } from 'lucide-react';

const TopBar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>

          {showHamburgerMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowHamburgerMenu(false)}
                >
                  Home
                </a>
                <a
                  href="/documentation"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowHamburgerMenu(false)}
                >
                  Documentation
                </a>
                <a
                  href="/support"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowHamburgerMenu(false)}
                >
                  Support
                </a>
              </div>
            </div>
          )}
        </div>

        {/* TrueVibe Branding */}
        <h1 className="text-xl font-bold text-cyan-400">TrueVibe</h1>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-gray-900 font-semibold"
          >
            J
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-10 bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-48 z-50">
              <div className="p-3 border-b border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-gray-900 font-semibold">
                    J
                  </div>
                  <span className="font-semibold">Jordan Smith</span>
                </div>
              </div>
              <div className="py-2">
                <button className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-700">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-700">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-700">
                  <FileText size={18} />
                  <span>Documentation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;