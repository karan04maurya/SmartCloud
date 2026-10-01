import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsPage = () => {
  const [pieData, setPieData] = useState({
    labels: ['PDFs', 'Documents', 'Images', 'Presentations'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    }],
  });

  const [barData, setBarData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Files Uploaded',
      data: [12, 19, 15, 22, 30, 24],
      backgroundColor: '#7C3AED',
      borderRadius: 6,
    }],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        const data = res.data;

        if (data.fileDistribution && data.fileDistribution.length > 0) {
          const labels = data.fileDistribution.map(item => item.type || 'Unknown');
          const counts = data.fileDistribution.map(item => item.count);
          setPieData({
            labels,
            datasets: [{
              data: counts,
              backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
              borderWidth: 0,
            }],
          });
        }

        if (data.monthlyUploads && data.monthlyUploads.length > 0) {
          const labels = data.monthlyUploads.map(item => item.month);
          const counts = data.monthlyUploads.map(item => item.count);
          setBarData({
            labels,
            datasets: [{
              label: 'Files Uploaded',
              data: counts,
              backgroundColor: '#7C3AED',
              borderRadius: 6,
            }],
          });
        }
      } catch (error) {
        console.error("Error fetching analytics, using fallback data", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Visual insights into your file usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">File Distribution</h2>
          <div className="flex justify-center h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Monthly Uploads</h2>
          <div className="h-64">
            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
