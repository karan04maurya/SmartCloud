import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiFile, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data);
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubjectChange = async (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      const name = window.prompt("Enter new subject name:");
      if (name) {
        try {
          const res = await api.post('/subjects', { name });
          // Add new subject to list and select it
          setSubjects([...subjects, { id: res.data.id, name: res.data.name || name }]);
          setSelectedSubject(res.data.id);
        } catch (error) {
          console.error(error);
          alert(error.response?.data?.error || 'Failed to add subject');
          setSelectedSubject('');
        }
      } else {
        setSelectedSubject('');
      }
    } else {
      setSelectedSubject(value);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (selectedSubject && selectedSubject !== 'add_new') formData.append('subject_id', selectedSubject);
    if (description) formData.append('description', description);

    try {
      setIsUploading(true);
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setFile(null);
      setDescription('');
      setSelectedSubject('');
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/my-files');
      }, 2000);
      
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload file. Please ensure your backend is connected and running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upload File</h1>
          <p className="text-slate-500 dark:text-slate-400">Upload a new document or resource to your cloud.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <FiCheckCircle className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upload Successful!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Redirecting to your files...</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="p-8 space-y-6">
            
            {/* Drag and Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:bg-slate-900/50 hover:border-[var(--color-primary)] transition-colors text-center"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              
              {file ? (
                <>
                  <FiFile className="text-5xl text-[var(--color-primary)] mb-4" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{file.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p className="text-sm text-indigo-500 mt-4 hover:underline">Click to change file</p>
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-5xl text-slate-400 mb-4" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Click or drag file to this area to upload</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                </>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject (Optional)</label>
                <select 
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                >
                  <option value="">Select a Subject...</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                  <option value="add_new" className="font-bold text-[var(--color-primary)]">+ Add New Subject...</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Unit 1 Notes"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-900/50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUploading || !file}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium disabled:opacity-50 flex items-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload File'
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
