import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCloud, FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi';
import api from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', student_id: '', college_name: '', course: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[#0f172a] py-12 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-6">
            <FiCloud className="text-4xl text-[var(--color-primary)]" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              SmartCloud
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create an Account</h2>
          <p className="text-slate-500 dark:text-slate-400">Join SmartCloud to manage your studies.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="john@college.edu" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="student_id" value={formData.student_id} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="STU12345" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
              <div className="relative">
                <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="BCA" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College Name</label>
            <input type="text" name="college_name" value={formData.college_name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="University Name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="••••••••" />
              </div>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-3 mt-4 px-4 bg-[var(--color-primary)] hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 dark:text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
