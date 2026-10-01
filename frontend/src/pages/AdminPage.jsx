import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFile, FiHardDrive, FiActivity, FiSettings, FiBell } from 'react-icons/fi';
import api from '../services/api';

const AdminPage = () => {
  const [statsData, setStatsData] = useState({
    totalStudents: '1,248',
    totalFiles: '8,432',
    storageUsed: '412 GB',
    activeUsers: '342'
  });
  const [users, setUsers] = useState([
    { id: 1, full_name: 'Jane Smith', course: 'BCA 3rd Year' },
    { id: 2, full_name: 'John Doe', course: 'BCA 2nd Year' }
  ]);
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStatsData({
          totalStudents: statsRes.data.totalStudents,
          totalFiles: statsRes.data.totalFiles,
          storageUsed: (statsRes.data.storageUsed / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
          activeUsers: statsRes.data.activeUsers
        });

        const usersRes = await api.get('/admin/users');
        if (usersRes.data && usersRes.data.length > 0) {
          setUsers(usersRes.data);
        }
      } catch (error) {
        console.error("Error fetching admin data, using fallback data", error);
      }
    };

    fetchAdminData();
  }, []);

  const stats = [
    { title: 'Total Students', value: statsData.totalStudents, icon: <FiUsers />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Files', value: statsData.totalFiles, icon: <FiFile />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Storage Used', value: statsData.storageUsed, icon: <FiHardDrive />, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Users', value: statsData.activeUsers, icon: <FiActivity />, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Platform overview and management.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors shadow-sm font-medium">
            <FiSettings className="mr-2" /> Settings
          </button>
          <button className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 font-medium">
            <FiBell className="mr-2" /> New Announcement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity Logs</h2>
            <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <FiUser />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">System <span className="text-slate-500 dark:text-slate-400 font-normal">logged an event</span></p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Recently</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manage Users</h2>
            <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">View All</button>
          </div>
          <div className="p-6">
             <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map((user, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-900 dark:text-slate-100">{user.full_name}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-sm">{user.course || 'N/A'}</td>
                    <td className="py-3"><button className="text-red-500 hover:text-red-700 text-sm font-medium">Suspend</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const FiUser = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default AdminPage;
