import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiFileText, FiImage, FiArchive, FiMoreVertical, FiDownload, FiShare2, FiTrash2, FiSearch, FiFilter, FiUploadCloud } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const MyFilesPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const location = useLocation();
  const fileInputRef = useRef(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await api.get('/files');
      let data = res.data;
      // Filter by subjectId if present in query params
      const searchParams = new URLSearchParams(location.search);
      const subjectId = searchParams.get('subjectId');
      if (subjectId) {
        data = data.filter(f => f.subject_id === parseInt(subjectId));
      }
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, [location.search]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const getFileIcon = (type) => {
    if (type === 'PDF') return <FiFileText className="text-red-500" />;
    if (type === 'Image') return <FiImage className="text-blue-500" />;
    if (type === 'Archive') return <FiArchive className="text-yellow-500" />;
    if (type === 'Presentation') return <FiFile className="text-orange-500" />;
    return <FiFile className="text-blue-600" />;
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    // Optional: formData.append('subject_id', selectedSubjectId);

    try {
      setIsUploading(true);
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchFiles();
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to move this file to the recycle bin?")) return;
    try {
      await api.delete(`/files/${fileId}`);
      await fetchFiles();
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete file.');
    }
  };

  const handleShare = async (fileId) => {
    try {
      const res = await api.post('/share', { file_id: fileId, expiresInDays: 7 });
      alert(`Share link generated: http://localhost:5173/share/${res.data.token}`);
    } catch (error) {
      console.error('Error sharing file', error);
      alert('Failed to generate share link.');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const toggleFilter = () => {
    const types = ['All', 'PDF', 'Image', 'Archive', 'Presentation'];
    const currentIndex = types.indexOf(filterType);
    setFilterType(types[(currentIndex + 1) % types.length]);
  };

  // Apply search and filter
  const displayedFiles = files.filter(f => {
    const matchesSearch = f.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || f.file_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Files</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all your academic resources.</p>
        </div>
        <div className="flex space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelect} 
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 font-medium disabled:opacity-50"
          >
            <FiUploadCloud className="mr-2" /> {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          />
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button onClick={toggleFilter} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors">
            <FiFilter className="mr-2" /> {filterType === 'All' ? 'Filter' : filterType}
          </button>
          <div className="flex bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* File Grid */}
      {displayedFiles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <FiFile className="mx-auto text-4xl text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No files found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or upload a new file.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedFiles.map((file, idx) => (
            <motion.div 
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group relative cursor-pointer"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)]">
                  <FiMoreVertical />
                </button>
              </div>
              <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                {getFileIcon(file.file_type)}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate" title={file.file_name}>{file.file_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}</p>
              </div>
              
              {/* Hover Actions */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={file.file_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500" title="Download"><FiDownload /></a>
                <button className="text-slate-400 hover:text-green-500" title="Share" onClick={(e) => { e.stopPropagation(); handleShare(file.id); }}><FiShare2 /></button>
                <button className="text-slate-400 hover:text-red-500" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}><FiTrash2 /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Size</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Date Modified</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {displayedFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(file.file_type)}</div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs" title={file.file_name}>{file.file_name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm hidden md:table-cell">{formatSize(file.file_size)}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm hidden sm:table-cell">{new Date(file.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={file.file_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500"><FiDownload /></a>
                      <button className="text-slate-400 hover:text-green-500" onClick={() => handleShare(file.id)}><FiShare2 /></button>
                      <button className="text-slate-400 hover:text-red-500" onClick={() => handleDelete(file.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFilesPage;
