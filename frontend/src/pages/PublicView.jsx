import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exportService } from '../services/api';
import { Package, MapPin, User, Phone, Weight, DollarSign, Calendar, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
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
        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg font-bold transition-all hover:bg-primary-dark active:scale-95">
          Go Back Home
        </Link>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Shipment Details</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
              Tracked Status: Active
            </span>
            <span className="text-slate-400 text-sm font-medium">#{data.id.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" /> Sender Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <DetailItem icon={User} label="Client Name" value={data.client_name} />
            <DetailItem icon={Phone} label="Contact Details" value={data.contact_details} />
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-4">
            <Package className="w-4 h-4" /> Goods Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <DetailItem 
              icon={Package} 
              label="Goods Type" 
              value={data.goods_type} 
              colorClass="text-primary font-bold"
            />
            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={Weight} label="Weight" value={`${data.weight_kg} kg`} />
              <DetailItem icon={Package} label="Pieces" value={data.pieces} />
            </div>
          </div>
        </div>

        {/* Recipient Info Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Destination & Recipient
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <DetailItem 
              icon={MapPin} 
              label="Destination" 
              value={data.destination} 
              colorClass="text-slate-900 font-bold"
            />
            <DetailItem icon={User} label="Recipient Name" value={data.recipient_name} />
            <DetailItem icon={Phone} label="Recipient Contact" value={data.recipient_contact} />
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-4">
            <DollarSign className="w-4 h-4" /> Financial Summary
          </h2>
          <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24" />
            </div>
            <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest mb-1">Total Amount Due</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">${data.amount}</span>
              <span className="text-blue-200 text-sm font-medium">USD</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-blue-100 text-xs">
              <Calendar className="w-3 h-3" />
              <span>Created on {new Date(data.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Footer */}
      <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center text-center">
        <div className="w-16 h-1 bg-pattern mb-6" />
        <p className="text-slate-400 text-sm italic max-w-md">
          This is a verified shipment record from SJ Express. If you have any questions regarding this shipment, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PublicView;
