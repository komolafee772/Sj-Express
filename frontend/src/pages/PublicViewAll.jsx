import React, { useEffect, useState } from 'react';
import { exportService } from '../services/api';
import { Package, MapPin, User, Phone, Weight, DollarSign, Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const PublicViewAll = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllShipments = async () => {
      try {
        setLoading(true);
        const response = await exportService.getAll();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shipments:', err);
        setError('Failed to load shipment data.');
        toast.error('Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };

    fetchAllShipments();
  }, []);

  const filteredData = data.filter(item => 
    item.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading all shipments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shipment Manifest</h1>
          <p className="text-slate-500 font-medium mt-1">Verified records from SJ Express</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by client, destination, or recipient..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Weight</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Recipient</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{item.client_name}</p>
                  <p className="text-xs text-slate-400 font-mono">#{item.id.toString().padStart(6, '0')}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                      {item.goods_type}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Package className="w-3 h-3" /> {item.pieces} pieces
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-600">{item.weight_kg} kg</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">${item.amount}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-700">{item.recipient_name}</p>
                  <p className="text-xs text-slate-400">{item.recipient_contact}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {item.destination}
                  </span>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium italic">
                  No matching shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ID: #{item.id.toString().padStart(6, '0')}</p>
                <h3 className="text-xl font-bold text-slate-900">{item.client_name}</h3>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                {item.goods_type}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination</p>
                <p className="text-sm text-slate-700 font-medium truncate">{item.destination}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount</p>
                <p className="text-sm text-primary font-black">${item.amount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recipient</p>
                <p className="text-sm text-slate-700 font-medium truncate">{item.recipient_name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weight</p>
                <p className="text-sm text-slate-700 font-medium">{item.weight_kg} kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-12 p-8 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 text-sm font-medium italic max-w-2xl mx-auto">
          This is a public, read-only manifest of all verified shipments handled by SJ Express. For any discrepancies or inquiries, please contact our logistics department.
        </p>
      </div>
    </div>
  );
};

export default PublicViewAll;
