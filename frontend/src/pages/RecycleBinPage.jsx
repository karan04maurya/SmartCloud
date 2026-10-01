import React from 'react';

const RecycleBinPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Recycle Bin</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">Deleted files will appear here.</p>
      </div>
    </div>
  );
};

export default RecycleBinPage;
