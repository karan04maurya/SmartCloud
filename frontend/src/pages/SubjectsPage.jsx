import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiFolderPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    const name = window.prompt("Enter new subject name:");
    if (!name) return;
    try {
      await api.post('/subjects', { name });
      fetchSubjects();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to add subject');
    }
  };

  const handleDeleteSubject = async (e, id) => {
    e.stopPropagation(); // prevent clicking the card
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error(error);
      alert('Failed to delete subject');
    }
  };

  const colors = [
    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subjects</h1>
          <p className="text-slate-500 dark:text-slate-400">Organize your files by subjects.</p>
        </div>
        <button onClick={handleAddSubject} className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
          <FiFolderPlus className="mr-2" /> New Subject
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => (
          <motion.div 
            key={sub.id || idx}
            onClick={() => navigate(`/my-files?subjectId=${sub.id}`)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${colors[idx % colors.length]} text-xl`}>
                <FiBook />
              </div>
              <button onClick={(e) => handleDeleteSubject(e, sub.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Subject">
                <FiTrash2 />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{sub.name}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{sub.files || 0} Files</p>
          </motion.div>
        ))}
      </div>
      
      {subjects.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <FiBook className="mx-auto text-4xl text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No subjects yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Click "New Subject" to create one.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
