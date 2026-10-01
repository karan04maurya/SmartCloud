import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiFolder, FiUploadCloud, FiBook, FiUsers, FiPieChart, FiCpu, FiTrash2, FiSettings, FiLogOut, FiCloud, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'My Files', icon: <FiFolder />, path: '/my-files' },
    { name: 'Upload', icon: <FiUploadCloud />, path: '/upload' },
    { name: 'Subjects', icon: <FiBook />, path: '/subjects' },
    { name: 'Shared Files', icon: <FiUsers />, path: '/shared' },
    { name: 'Analytics', icon: <FiPieChart />, path: '/analytics' },
    { name: 'AI Assistant', icon: <FiCpu />, path: '/ai-assistant' },
    { name: 'Recycle Bin', icon: <FiTrash2 />, path: '/recycle-bin' },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: 'Admin Panel', icon: <FiSettings />, path: '/admin' });
  }

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-colors duration-300">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800">
        <FiCloud className="text-3xl text-[var(--color-primary)]" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
          SmartCloud
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-[var(--color-primary)]' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button 
          onClick={toggleDarkMode}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <FiSun className="text-lg mr-3" /> : <FiMoon className="text-lg mr-3" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="text-lg mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
