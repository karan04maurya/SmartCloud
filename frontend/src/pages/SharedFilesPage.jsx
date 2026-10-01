import React, { useState, useEffect } from 'react';
import { FiLink, FiTrash2, FiCopy, FiFile, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

const SharedFilesPage = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchShares = async () => {
    try {
      const res = await api.get('/share');
      setShares(res.data);
    } catch (error) {
      console.error('Error fetching shares', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShares();
  }, []);

  const handleCopy = (token, shareId) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (shareId) => {
    if (!window.confirm("Are you sure you want to revoke this share link? Anyone with the link will lose access.")) return;
    try {
      await api.delete(`/share/${shareId}`);
      setShares(shares.filter(s => s.share_id !== shareId));
    } catch (error) {
      console.error('Error revoking share', error);
      alert('Failed to revoke share');
    }
  };

  const getStatus = (share) => {
    if (!share.is_active) return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Revoked</span>;
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">Expired</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>;
  };

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading shared files...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Shared Files</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage the public links you have generated for your files.</p>
        </div>
      </div>

      {shares.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-12 border border-slate-100 dark:border-slate-700 text-center">
          <FiLink className="mx-auto text-5xl text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No active shared links</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Go to "My Files" and click the share icon on a file to generate a public link.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 font-medium">File Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Created On</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Expires</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {shares.map((share) => (
                <tr key={share.share_id} className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <FiFile className="text-2xl text-[var(--color-primary)]" />
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 block truncate max-w-[200px] md:max-w-xs">{share.file_name}</span>
                      <span className="text-xs text-slate-400 block">{share.file_type} • {(share.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatus(share)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm hidden sm:table-cell">
                    {new Date(share.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm hidden md:table-cell">
                    {share.expires_at ? new Date(share.expires_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => handleCopy(share.token, share.share_id)}
                        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${copiedId === share.share_id ? 'bg-green-50 text-green-600' : 'text-slate-400 hover:bg-indigo-50 hover:text-[var(--color-primary)]'}`}
                        title="Copy Link"
                      >
                        {copiedId === share.share_id ? <FiCheckCircle /> : <FiCopy />}
                      </button>
                      <button 
                        onClick={() => handleRevoke(share.share_id)}
                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors flex items-center justify-center"
                        title="Revoke Access"
                      >
                        <FiTrash2 />
                      </button>
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

export default SharedFilesPage;
