import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiHardDrive, FiBook, FiShare2, FiUploadCloud, FiFolderPlus, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  // Mock Data
  const stats = [
    { title: 'Total Files', value: '124', icon: <FiFileText />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Storage Used', value: '4.2 GB', icon: <FiHardDrive />, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'Total Subjects', value: '8', icon: <FiBook />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Shared Files', value: '12', icon: <FiShare2 />, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  const recentFiles = [
    { name: 'Cloud Computing Unit 1.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 24, 2026' },
    { name: 'Data Mining Project.docx', type: 'DOCX', size: '1.1 MB', date: 'Oct 23, 2026' },
    { name: 'SPM Assignment.pptx', type: 'PPTX', size: '5.6 MB', date: 'Oct 21, 2026' },
    { name: 'PHP Cheatsheet.pdf', type: 'PDF', size: '800 KB', date: 'Oct 20, 2026' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your files today.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => navigate('/my-files')} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors shadow-sm font-medium">
            <FiSearch className="mr-2" /> Search
          </button>
          <button onClick={() => navigate('/subjects')} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors shadow-sm font-medium">
            <FiFolderPlus className="mr-2" /> New Folder
          </button>
          <button onClick={() => navigate('/upload')} className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 font-medium">
            <FiUploadCloud className="mr-2" /> Upload
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Files</h2>
            <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="px-6 py-4 font-medium">File Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Size</th>
                  <th className="px-6 py-4 font-medium">Date Modified</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <FiFileText className="text-slate-400 text-xl" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">{file.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{file.type}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{file.size}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{file.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"><FiMoreVertical /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Storage Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Storage Usage</h2>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-700"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--color-primary)]"
                  strokeDasharray="42, 100" // 42% used
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">42%</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Used</span>
              </div>
            </div>
            
            <div className="mt-8 w-full space-y-4">
              <div className="flex justify-between text-sm">
                <span className="flex items-center text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-[var(--color-primary)] mr-2"></span>Documents</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">2.1 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-[var(--color-secondary)] mr-2"></span>Images</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">1.5 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-200 mr-2"></span>Free Space</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">5.8 GB</span>
              </div>
            </div>
          </div>
          
          <button onClick={() => alert('Storage upgrade options will be available in a future update!')} className="w-full mt-6 py-3 font-semibold text-[var(--color-primary)] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            Upgrade Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
