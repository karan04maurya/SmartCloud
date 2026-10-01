import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Require authentication
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Welcome, {user.full_name || 'Student'}</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
