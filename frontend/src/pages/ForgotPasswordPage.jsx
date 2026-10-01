import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCloud, FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send reset email. Please ensure the server has valid email credentials configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[#0f172a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-6">
            <FiCloud className="text-4xl text-[var(--color-primary)]" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              SmartCloud
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <FiCheckCircle className="text-6xl text-green-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Check your email</h3>
            <p className="text-slate-500 dark:text-slate-400">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link 
              to="/login"
              className="mt-4 inline-flex items-center text-[var(--color-primary)] hover:underline font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="student@college.edu"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full py-3 px-4 bg-[var(--color-primary)] hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link 
                to="/login"
                className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] transition-colors"
              >
                <FiArrowLeft className="mr-2" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
