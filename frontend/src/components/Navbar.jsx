import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCloud, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center transition-colors duration-300 ${isDarkMode ? 'glass-dark' : 'glass'}`}
    >
      <div className="flex items-center space-x-2">
        <FiCloud className="text-3xl text-[var(--color-primary)]" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
          SmartCloud
        </span>
      </div>
      
      <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#home" className="hover:text-[var(--color-primary)] transition-colors">Home</a>
        <a href="#features" className="hover:text-[var(--color-primary)] transition-colors">Features</a>
        <a href="#about" className="hover:text-[var(--color-primary)] transition-colors">About</a>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)] transition-colors p-2">
          {isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>
        <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[var(--color-primary)] transition-colors">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          Register
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
