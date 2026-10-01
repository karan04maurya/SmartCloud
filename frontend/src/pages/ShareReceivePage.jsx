import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiFile, FiFileText, FiImage, FiArchive, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

const ShareReceivePage = () => {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        const res = await api.get(`/share/${token}`);
        setFileData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Invalid or expired share link.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFile();
  }, [token]);

  const getFileIcon = (type) => {
    if (type === 'PDF') return <FiFileText className="text-red-500" />;
    if (type === 'Image') return <FiImage className="text-blue-500" />;
    if (type === 'Archive') return <FiArchive className="text-yellow-500" />;
    if (type === 'Presentation') return <FiFile className="text-orange-500" />;
    return <FiFile className="text-blue-600" />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-4">
      {/* Simple Header for public page */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-indigo-800 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">SmartCloud</span>
        </div>
        <Link to="/login" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          Log In
        </Link>
      </div>

      <div className="w-full max-w-md">
        {loading ? (
          <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Retrieving shared file...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
            <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
            <Link to="/" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
              Return to SmartCloud
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-700 bg-gradient-to-b from-indigo-50/50 to-white">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-5xl mb-6">
                {getFileIcon(fileData.file_type)}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 break-words" title={fileData.file_name}>
                {fileData.file_name}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">{fileData.file_type}</span>
                <span>•</span>
                <span>{formatSize(fileData.file_size)}</span>
              </div>
            </div>
            
            <div className="p-8">
              <a 
                href={fileData.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center px-6 py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
              >
                <FiDownload className="mr-2 text-xl" /> Download File
              </a>
              
              {fileData.expires_at && (
                <p className="text-center text-xs text-slate-400 mt-6">
                  This link will expire on {new Date(fileData.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <p className="absolute bottom-6 text-xs text-slate-400">
        Securely shared via SmartCloud
      </p>
    </div>
  );
};

export default ShareReceivePage;
