import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exportService } from '../services/api';
import { Package, MapPin, User, Phone, Weight, DollarSign, Calendar, ChevronLeft, Loader2, AlertCircle, Lock, Info, CheckCircle2, Clock, FileText, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const PublicView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true);
        const response = await exportService.getById(id);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shipment:', err);
        setError('Shipment not found or an error occurred.');
        toast.error('Failed to load shipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading shipment details...</p>
      </div>
    );
  }

  if (error || !data) {
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

  const DetailItem = ({ icon: Icon, label, value, colorClass = "text-slate-700" }) => (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</p>
        <p className={`font-semibold ${colorClass}`}>{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Shipment Details</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 ${data.is_locked ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'}`}>
              {data.is_locked ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {data.is_locked ? 'Locked' : 'Active'}
            </span>
            <span className="text-slate-400 text-sm font-medium font-mono px-2 py-1 bg-slate-50 rounded">
              ID: EXP-{data.id.toString().padStart(5, '0')}
            </span>
          </div>
        </div>
        {data.is_locked && (
           <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200">
             <CheckCircle2 className="w-4 h-4 text-green-400" />
             Verified & Secure
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User className="w-4 h-4" /> Sender Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
               <DetailItem icon={User} label="Sender Name" value={data.client_name} />
               <DetailItem icon={Phone} label="Contact" value={data.contact_details} />
               <DetailItem icon={MapPin} label="Sender Address" value={data.sender_address} />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4 pt-4">
              <Package className="w-4 h-4" /> Package Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem 
                icon={Package} 
                label="Goods Type" 
                value={data.goods_type} 
                colorClass="text-primary font-bold"
              />
              <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={Weight} label="Total Weight" value={`${data.weight_kg} kg`} />
                <DetailItem icon={Package} label="Pieces" value={data.pieces} />
              </div>
              <DetailItem icon={FileText} label="Description" value={data.package_description || 'No detailed description'} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" /> Destination & Recipient
            </h2>
               <div className="grid grid-cols-1 gap-4">
                 <DetailItem 
                   icon={MapPin} 
                   label="Destination" 
                   value={data.destination} 
                   colorClass="text-slate-900 font-bold"
                 />
                 <DetailItem icon={User} label="Recipient" value={data.recipient_name} />
                 <DetailItem icon={Phone} label="Recipient Contact" value={data.recipient_contact} />
                 <DetailItem icon={MapPin} label="Receiver Address" value={data.receiver_address} />
               </div>
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4 pt-4">
              <DollarSign className="w-4 h-4" /> Billing Status
            </h2>
            <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 p-4 opacity-10">
                <DollarSign className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <p className="text-blue-100 text-[10px] uppercase font-black tracking-widest mb-1">Billing</p>
                    <p className="font-bold text-white bg-white/20 px-2 py-0.5 rounded inline-block text-xs uppercase tracking-wider">Verified</p>
                 </div>
                 <div className="text-right">
                    <p className="text-blue-100 text-[10px] uppercase font-black tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black">${data.amount}</p>
                 </div>
              </div>
              
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-blue-100 text-xs font-medium">
                   <Clock className="w-3.5 h-3.5" />
                   <span>Created {new Date(data.created_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-green-400/20 text-green-300 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Secure
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
        <div className="w-12 h-1 bg-primary/20 rounded-full mb-6" />
        <h4 className="font-bold text-slate-800 mb-2">SJ Express Verification</h4>
        <p className="text-slate-500 text-sm italic max-w-lg leading-relaxed">
          This record is generated by the SJ Express management system. For any disputes or inquiries, please contact our logistics team with the ID provided above.
        </p>
      </div>
    </div>
  );
};

export default PublicView;
