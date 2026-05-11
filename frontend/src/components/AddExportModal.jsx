import React, { useState } from 'react';
import { X, User, Phone, MapPin, Package, Weight, DollarSign, FileText, Hash, Loader2, CreditCard } from 'lucide-react';
import { exportService } from '../services/api';
import toast from 'react-hot-toast';

const InputGroup = ({ icon: Icon, label, name, type = "text", placeholder, required = false, isTextArea = false, isSelect = false, options = [], formData, handleChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
      <Icon className="w-3 h-3" /> {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows="3"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-medium resize-none bg-slate-50/50"
      />
    ) : isSelect ? (
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-medium bg-slate-50/50 appearance-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        step={type === 'number' && (name === 'weight_kg' || name === 'amount') ? 'any' : type === 'number' ? '1' : undefined}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-medium bg-slate-50/50"
      />
    )}
  </div>
);

const AddExportModal = ({ isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    contact_details: '',
    sender_address: '',
    recipient_name: '',
    recipient_contact: '',
    receiver_address: '',
    goods_type: 'General',
    package_description: '',
    weight_kg: '',
    amount: '',
    destination: '',
    pieces: '',
    paid_by: 'Sender'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        weight_kg: parseFloat(formData.weight_kg) || 0,
        amount: parseFloat(formData.amount) || 0,
        pieces: parseInt(formData.pieces) || 0
      };
      await exportService.create(payload);
      toast.success('Export record created successfully');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error creating export:', error);
      toast.error('Failed to create export record');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Export Record</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Add a new shipment to the manifest</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Sender Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Sender Information</h3>
              </div>
              <InputGroup icon={User} label="Sender Name" name="client_name" placeholder="Full name of the sender" required formData={formData} handleChange={handleChange} />
              <InputGroup icon={Phone} label="Contact Details" name="contact_details" placeholder="Phone or email" required formData={formData} handleChange={handleChange} />
              <InputGroup icon={FileText} label="Sender Address" name="sender_address" placeholder="Pick-up or residence address" isTextArea formData={formData} handleChange={handleChange} />
            </div>

            {/* Recipient Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-secondary rounded-full" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recipient Information</h3>
              </div>
              <InputGroup icon={User} label="Recipient Name" name="recipient_name" placeholder="Full name of the receiver" formData={formData} handleChange={handleChange} />
              <InputGroup icon={Phone} label="Recipient Contact" name="recipient_contact" placeholder="Receiver's contact" formData={formData} handleChange={handleChange} />
              <InputGroup icon={FileText} label="Receiver Address" name="receiver_address" placeholder="Delivery or residence address" isTextArea formData={formData} handleChange={handleChange} />
            </div>

            {/* Shipment Section */}
            <div className="md:col-span-2 space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shipment Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup icon={Package} label="Goods Type" name="goods_type" placeholder="e.g. Electronics, Food" required formData={formData} handleChange={handleChange} />
                <InputGroup icon={MapPin} label="Destination" name="destination" placeholder="City or Country" formData={formData} handleChange={handleChange} />
                <InputGroup icon={Weight} label="Weight (kg)" name="weight_kg" type="number" placeholder="0.00" formData={formData} handleChange={handleChange} />
                <InputGroup icon={Hash} label="Pieces" name="pieces" type="number" placeholder="0" formData={formData} handleChange={handleChange} />
                <InputGroup icon={CreditCard} label="Paid By" name="paid_by" isSelect options={['Sender', 'Receiver']} formData={formData} handleChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <InputGroup icon={DollarSign} label="Total Amount" name="amount" type="number" placeholder="0.00" formData={formData} handleChange={handleChange} />
                 <InputGroup icon={FileText} label="Package Description" name="package_description" placeholder="Briefly describe the contents" isTextArea formData={formData} handleChange={handleChange} />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-slate-600 font-bold hover:bg-white transition-all border border-transparent hover:border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>{loading ? 'Creating...' : 'Create Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default AddExportModal;
