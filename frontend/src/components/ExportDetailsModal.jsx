import React, { useState, useEffect } from 'react';
import { X, Printer, Share2, Lock, Trash2, Edit3, Calendar, MapPin, User, Phone, Package, CreditCard, UserCheck, StickyNote, Info, CheckCircle2, Clock, AlertCircle, RefreshCw, Save, Loader2, Weight, DollarSign, Hash } from 'lucide-react';
import { exportService } from '../services/api';
import toast from 'react-hot-toast';
import PrintTemplate from './PrintTemplate';

const DetailField = ({ icon: Icon, label, name, value, editable = true, isTextArea = false, isSelect = false, options = [], isEditing, record, editData, handleEditChange }) => (
  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
      <Icon className="w-3 h-3" /> {label}
    </label>
    {isEditing && editable && !record.is_locked ? (
      isTextArea ? (
        <textarea
          name={name}
          value={editData[name] || ''}
          onChange={handleEditChange}
          className="w-full bg-white border border-primary/20 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none"
          rows="2"
        />
      ) : isSelect ? (
        <select
          name={name}
          value={editData[name] || ''}
          onChange={handleEditChange}
          className="w-full bg-white border border-primary/20 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/10 appearance-none"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={name.includes('weight') || name.includes('amount') || name.includes('pieces') ? 'number' : 'text'}
          name={name}
          step={name.includes('weight') || name.includes('amount') ? 'any' : '1'}
          value={editData[name] ?? ''}
          onChange={handleEditChange}
          className="w-full bg-white border border-primary/20 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
        />
      )
    ) : (
      <p className={`text-sm font-semibold text-slate-700 ${isTextArea ? 'italic leading-relaxed' : ''}`}>
        {value || 'N/A'}
      </p>
    )}
  </div>
);

const ExportDetailsModal = ({ isOpen, onClose, record, fetchExports, initialEditMode = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (record) {
      setEditData({ ...record });
      if (initialEditMode && !record.is_locked) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    }
  }, [record, initialEditMode, isOpen]);

  if (!isOpen || !record) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to PERMANENTLY DELETE this record? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await exportService.delete(record.id);
        toast.success('Record deleted successfully');
        fetchExports();
        onClose();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete record';
        toast.error(message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...editData,
        weight_kg: parseFloat(editData.weight_kg) || 0,
        amount: parseFloat(editData.amount) || 0,
        pieces: parseInt(editData.pieces) || 0
      };
      await exportService.update(record.id, payload);
      toast.success('Record updated successfully');
      setIsEditing(false);
      fetchExports();
      // Update local record to reflect changes immediately
      Object.assign(record, payload);
    } catch (error) {
      toast.error('Failed to update record');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 px-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${record.is_locked ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
              {record.is_locked ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-4 h-4" />}
              {record.is_locked ? 'Locked' : 'Active'}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Export Details <span className="text-slate-400 font-medium ml-2">#EXP-{record.id.toString().padStart(5, '0')}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!record.is_locked && (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-100 text-slate-400 hover:text-primary'}`}
                title="Toggle Edit"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Sender & Receiver Info */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Sender Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <DetailField icon={User} label="Full Name" name="client_name" value={record.client_name} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={Phone} label="Phone Number" name="contact_details" value={record.contact_details} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={MapPin} label="Address" name="sender_address" value={record.sender_address} isTextArea isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Receiver Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <DetailField icon={User} label="Full Name" name="recipient_name" value={record.recipient_name} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={Phone} label="Phone Number" name="recipient_contact" value={record.recipient_contact} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={MapPin} label="Address" name="receiver_address" value={record.receiver_address} isTextArea isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                </div>
              </section>
            </div>

            {/* Shipment & Logistics */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Shipment Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField icon={Package} label="Goods Type" name="goods_type" value={record.goods_type} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={Package} label="Pieces" name="pieces" value={record.pieces} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={Weight} label="Weight (kg)" name="weight_kg" value={record.weight_kg} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={DollarSign} label="Amount ($)" name="amount" value={record.amount} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={CreditCard} label="Paid By" name="paid_by" value={record.paid_by} isSelect options={['Sender', 'Receiver']} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                  <DetailField icon={MapPin} label="Destination" name="destination" value={record.destination} isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <StickyNote className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Description / Notes</h3>
                </div>
                <DetailField icon={StickyNote} label="Notes" name="package_description" value={record.package_description} isTextArea isEditing={isEditing} record={record} editData={editData} handleEditChange={handleEditChange} />
              </section>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-300" />
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Created At</label>
                <p className="text-[11px] text-slate-500">{new Date(record.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-slate-300" />
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</label>
                <p className="text-[11px] text-slate-500">{new Date(record.updated_at || record.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 px-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0 z-10">
          <div className="text-slate-400 text-xs font-medium">
            {isEditing ? (
              <span className="flex items-center gap-1.5 text-primary font-bold animate-pulse">
                <Edit3 className="w-3.5 h-3.5" />
                Editing Mode: Don't forget to save changes.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 italic font-medium text-slate-500">
                <Info className="w-3.5 h-3.5 text-primary" />
                Double check all details before printing.
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-grow sm:flex-none px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-grow sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-secondary shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                {!record.is_locked && (
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-grow sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    Delete
                  </button>
                )}

                <button 
                  onClick={handlePrint}
                  className="flex-grow sm:flex-none flex items-center justify-center gap-3 px-10 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-secondary shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                  Print Export
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* The PrintTemplate now uses a Portal to render into document.body */}
      <PrintTemplate record={record} />
    </div>
  );
};

export default ExportDetailsModal;
