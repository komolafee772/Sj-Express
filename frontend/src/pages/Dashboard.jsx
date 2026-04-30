import React, { useState, useEffect } from 'react';
import { exportService } from '../services/api';
import ExportTable from '../components/ExportTable';
import { Plus, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExports = async () => {
    setLoading(true);
    try {
      const response = await exportService.getAll();
      setExports(response.data);
    } catch (error) {
      toast.error('Failed to load exports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleAddRow = async () => {
    const newRecord = {
      client_name: 'New Client',
      contact_details: 'Contact Info',
      goods_type: 'General',
      weight_kg: 0,
      amount: 0,
      destination: '',
      recipient_name: '',
      recipient_contact: '',
      pieces: 0
    };
    
    try {
      const response = await exportService.create(newRecord);
      setExports([response.data, ...exports]);
      toast.success('New record added');
    } catch (error) {
      toast.error('Failed to add record');
    }
  };

  const filteredExports = exports.filter(item => 
    item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.goods_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-slate-800">Export Records</h2>
            <button 
              onClick={fetchExports}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleAddRow}
              className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-all shadow-md font-semibold whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading && exports.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <ExportTable 
              data={filteredExports} 
              setExports={setExports} 
              fetchExports={fetchExports}
            />
          )}
        </div>
        
        {!loading && filteredExports.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
