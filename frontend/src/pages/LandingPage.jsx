import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { FiCloud, FiSearch, FiShare2, FiPieChart, FiCpu, FiShield } from 'react-icons/fi';

const features = [
  { icon: <FiCloud />, title: 'Cloud Storage', desc: 'Securely store all your academic files in one place.' },
  { icon: <FiSearch />, title: 'Smart Search', desc: 'Quickly find notes, PPTs, and PDFs using advanced search.' },
  { icon: <FiShare2 />, title: 'File Sharing', desc: 'Generate secure, expiring links to share resources with classmates.' },
  { icon: <FiPieChart />, title: 'Analytics', desc: 'Visual insights into your file distribution and storage usage.' },
  { icon: <FiCpu />, title: 'AI Study Assistant', desc: 'Ask questions, get summaries, and study smarter with AI.' },
  { icon: <FiShield />, title: 'Security', desc: 'Enterprise-grade security and role-based access control.' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up with your student credentials.' },
  { num: '02', title: 'Upload Files', desc: 'Upload your notes, assignments, and PDFs.' },
  { num: '03', title: 'Organize Resources', desc: 'Sort by subjects and keep everything structured.' },
  { num: '04', title: 'Access Anywhere', desc: 'Access your cloud from any device, anytime.' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-6">
            Your Study. <br/>
            Your Files. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Your Cloud.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Store, organize and access your academic resources anywhere anytime. A modern platform built exclusively for students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="px-8 py-4 text-base font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:border-[var(--color-primary)] transition-all hover:scale-105">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Powerful Features</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your academic life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-[var(--color-background)] dark:bg-[#0f172a] border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-[var(--color-primary)] flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-20 px-6 bg-[var(--color-background)] dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Get started in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-extrabold text-[var(--color-primary)] opacity-20 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 py-8 text-center border-t border-slate-100 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400 font-medium">SmartCloud &copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
