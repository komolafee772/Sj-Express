import React, { useEffect, useState } from 'react';
import { exportService } from '../services/api';
import { Package, MapPin, User, Phone, Weight, DollarSign, Loader2, AlertCircle, Search, Filter, Home, ArrowLeft, ChevronRight, Calendar, X, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PublicViewAll = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
        <p className="text-slate-600 mb-6">{error}</p>
        <div className="px-6 py-2 bg-primary text-white rounded-lg font-bold">
          Contact Support
        </div>
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
            placeholder="Search by name, ID, or destination..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Paid By</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{item.client_name}</p>
                  <p className="text-xs text-slate-400 font-mono">EXP-{item.id.toString().padStart(5, '0')}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                      {item.goods_type}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Package className="w-3 h-3" /> {item.pieces || 0} pieces
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-600">{item.weight_kg} kg</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">${item.amount}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-700">{item.recipient_name || 'N/A'}</p>
                  <p className="text-xs text-slate-400">{item.recipient_contact}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${item.paid_by === 'Sender' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {item.paid_by || 'Sender'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {item.destination || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/view/${item.id}`} 
                    className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest"
                  >
                    View <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium italic">
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
          <div 
            key={item.id} 
            onClick={() => navigate(`/view/${item.id}`)}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm active:scale-[0.98] transition-all hover:shadow-md hover:border-primary/20 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-12 h-12" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  EXP-{item.id.toString().padStart(5, '0')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{item.client_name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors mt-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                   <MapPin className="w-3 h-3" /> Destination
                </p>
                <p className="text-sm text-slate-700 font-bold truncate">{item.destination || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                   <DollarSign className="w-3 h-3" /> Amount
                </p>
                <p className="text-sm text-primary font-black">${item.amount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                   <User className="w-3 h-3" /> Recipient
                </p>
                <p className="text-sm text-slate-700 font-bold truncate">{item.recipient_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                   <CreditCard className="w-3 h-3" /> Paid By
                </p>
                <p className={`text-sm font-black ${item.paid_by === 'Sender' ? 'text-blue-600' : 'text-amber-600'}`}>{item.paid_by || 'Sender'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                   <Package className="w-3 h-3" /> Details
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">{item.goods_type}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">{item.pieces || 0} Pcs</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold italic text-sm">No shipments matching your search.</p>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="mt-12 p-8 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 text-sm font-medium italic max-w-2xl mx-auto">
          This is a public, read-only manifest of verified shipments handled by SJ Express. For any discrepancies or inquiries, please contact our logistics department.
        </p>
      </div>
    </div>
  );
};

export default PublicViewAll;
