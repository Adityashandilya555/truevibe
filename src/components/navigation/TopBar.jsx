
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, LogIn, FileText, Bell, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const userMenuRef = useRef(null);
  const hamburgerMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (hamburgerMenuRef.current && !hamburgerMenuRef.current.contains(event.target)) {
        setShowHamburgerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <motion.header 
      className="glass-dark border-b border-white/10 px-6 py-4 sticky top-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section - Hamburger Menu */}
        <div className="relative" ref={hamburgerMenuRef}>
          <motion.button 
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>

          <AnimatePresence>
            {showHamburgerMenu && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 w-64 glass border border-white/10 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-2">
                  {[
                    { href: "/", label: "Home", icon: "🏠" },
                    { href: "/threads", label: "Threads", icon: "💬" },
                    { href: "/vibes", label: "Vibes", icon: "❤️" },
                    { href: "/documentation", label: "Documentation", icon: "📚" },
                    { href: "/support", label: "Support", icon: "🆘" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      onClick={() => setShowHamburgerMenu(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Section - TrueVibe Branding */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-gradient">TrueVibe</h1>
        </motion.div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <motion.button
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
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
              className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              J
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-72 glass border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                >
                  {/* Profile Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
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
                      { icon: LogIn, label: "Sign In", color: "text-green-400" },
                      { icon: FileText, label: "Documentation", color: "text-blue-400" }
                    ].map((item, index) => (
                      <motion.button
                        key={item.label}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl transition-all duration-200"
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
  );
};

export default TopBar;
