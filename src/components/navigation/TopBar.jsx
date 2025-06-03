
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, LogIn, FileText, Bell, Search, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  const fullScreenMenuVariants = {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' }
  };

  return (
    <>
      <motion.header 
        className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700 px-6 py-4 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Section - Hamburger Menu */}
          <motion.button 
            onClick={() => setShowHamburgerMenu(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>

          {/* Center Section - TrueVibe Branding */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="text-2xl font-bold text-white">TrueVibe</h1>
          </motion.div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <motion.button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold hover:bg-gray-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                J
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-72 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                          J
                        </div>
                        <div>
                          <div className="font-semibold text-white">Jordan Smith</div>
                          <div className="text-sm text-gray-400">jordan@truevibe.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {[
                        { icon: Settings, label: "Settings", color: "text-gray-400" },
                        { icon: LogIn, label: "Sign In", color: "text-green-400" }
                      ].map((item, index) => (
                        <motion.button
                          key={item.label}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-xl transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <item.icon size={18} className={item.color} />
                          <span className="font-medium text-gray-300">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Hamburger Menu */}
      <AnimatePresence>
        {showHamburgerMenu && (
          <motion.div
            variants={fullScreenMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-gray-900"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Menu</h2>
                <motion.button
                  onClick={() => setShowHamburgerMenu(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  {[
                    { href: "/", label: "Home", icon: Home },
                    { href: "/documentation", label: "Documentation", icon: FileText }
                  ].map((item, index) => (
                    <motion.button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href);
                        setShowHamburgerMenu(false);
                      }}
                      className="flex items-center space-x-4 w-full px-6 py-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                      <item.icon size={24} />
                      <span className="text-lg font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threads, users, emotions..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
