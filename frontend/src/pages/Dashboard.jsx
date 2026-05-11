import React, { useState, useEffect, useCallback } from 'react';
import { exportService } from '../services/api';
import ExportTable from '../components/ExportTable';
import AddExportModal from '../components/AddExportModal';
import { Plus, Search, RefreshCw, Share2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchExports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm
      };
      // Remove empty params
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await exportService.getAll(params);
      setExports(response.data);
    } catch (error) {
      toast.error('Failed to load exports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExports();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchExports]);

  const handleShareAll = () => {
    const url = `${window.location.origin}/view-all`;
    navigator.clipboard.writeText(url);
    toast.success('Manifest share link copied!');
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <RefreshCw className={`w-6 h-6 text-primary ${loading ? 'animate-spin' : ''}`} onClick={fetchExports} style={{cursor: 'pointer'}} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Export Management</h2>
                <p className="text-slate-500 text-sm font-medium">Manage and track your delivery records</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-grow min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search names, ID..." 
                  className="pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all w-full font-bold text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <button 
                onClick={handleShareAll}
                className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share Manifest</span>
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 transition-all font-bold text-sm active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>New Export</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {!loading && exports.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Shipments</p>
                <p className="text-2xl font-black text-slate-800">{exports.length}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pieces</p>
                <p className="text-2xl font-black text-primary">{exports.reduce((sum, item) => sum + (parseInt(item.pieces) || 0), 0)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Weight</p>
                <p className="text-2xl font-black text-amber-500">{exports.reduce((sum, item) => sum + (parseFloat(item.weight_kg) || 0), 0).toFixed(1)} <span className="text-xs">kg</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-2xl font-black text-green-600">${exports.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="min-h-[400px]">
          {loading && exports.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full"></div>
                </div>
              </div>
              <p className="text-slate-400 font-bold animate-pulse">Syncing exports...</p>
            </div>
          ) : (
            <ExportTable 
              data={exports} 
              setExports={setExports} 
              fetchExports={fetchExports}
            />
          )}
        </div>
        
        {!loading && exports.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No records found</h3>
            <p className="text-slate-400">Try adjusting your search to find what you're looking for.</p>
            <button onClick={clearFilters} className="mt-4 text-primary font-bold hover:underline">Clear search</button>
          </div>
        )}
      </div>

      {/* New Export Modal */}
      <AddExportModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchExports} 
      />
    </div>
  );
};

export default Dashboard;
