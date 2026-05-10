import React, { useState } from 'react';
import { Trash2, Check, X, Lock, MoreHorizontal, Eye, Calendar, MapPin, Package, DollarSign, User, ChevronRight, Weight, FileText, Hash, Phone } from 'lucide-react';
import { exportService } from '../services/api';
import toast from 'react-hot-toast';
import Modal from './Modal';
import ExportDetailsModal from './ExportDetailsModal';

const ExportTable = ({ data, setExports, fetchExports }) => {
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, record: null, editMode: false });

  const openDetails = (record, editMode = false) => {
    setDetailsModal({ isOpen: true, record, editMode });
  };

  return (
    <>
      {/* Desktop View - Non-Scrolling, Wrapped Text, Bolder Borders */}
      <div className="hidden lg:block w-full overflow-hidden border-2 border-slate-300 rounded-lg shadow-md">
        <table className="w-full table-fixed border-collapse bg-white">
          <thead>
            <tr className="bg-slate-100/90 border-b-2 border-slate-400">
              <th className="w-8 text-center text-slate-700 font-black text-[9px] uppercase py-3 px-[3px] border-r border-slate-300">#</th>
              <th className="w-20 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">ID</th>
              <th className="w-20 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Date</th>
              <th className="w-28 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Sender</th>
              <th className="w-32 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">S. Address</th>
              <th className="w-28 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Receiver</th>
              <th className="w-32 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">R. Address</th>
              <th className="w-20 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Goods</th>
              <th className="w-24 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Dest</th>
              <th className="w-12 text-center text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Pcs</th>
              <th className="w-12 text-center text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Kg</th>
              <th className="w-20 text-right text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Amt</th>
              <th className="w-32 text-left text-slate-700 font-black text-[9px] uppercase px-[3px] border-r border-slate-300">Desc</th>
              <th className="w-14 text-center text-slate-700 font-black text-[9px] uppercase px-[3px]">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y border-b border-slate-300">
            {data.map((item, index) => (
              <tr 
                key={item.id} 
                onClick={() => openDetails(item)}
                className={`group transition-all duration-200 cursor-pointer border-b border-slate-300 ${item.is_locked ? 'bg-slate-50/50' : 'hover:bg-primary/[0.05]'}`}
              >
                <td className="text-center py-2 px-[3px] border-r border-slate-300">
                   <span className="text-slate-500 text-[10px] font-black font-mono">{index + 1}</span>
                </td>
                
                <td className="px-[3px] border-r border-slate-300">
                  <div className="flex items-center gap-1">
                    {item.is_locked && <Lock className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />}
                    <span className="font-mono font-black text-slate-900 text-[9px] leading-none bg-slate-200/50 px-1 py-0.5 rounded border border-slate-300 break-all">
                      EXP-{item.id}
                    </span>
                  </div>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <span className="text-slate-700 text-[9px] font-bold leading-tight">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className="font-black text-slate-900 text-[10px] leading-tight break-words">{item.client_name}</p>
                    <p className="text-[8px] text-slate-500 font-bold break-all">{item.contact_details}</p>
                  </div>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <p className="text-[9px] text-slate-800 font-medium leading-tight break-words">
                    {item.sender_address || 'N/A'}
                  </p>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className="font-black text-slate-800 text-[10px] leading-tight break-words">{item.recipient_name || 'N/A'}</p>
                    <p className="text-[8px] text-slate-500 font-bold break-all">{item.recipient_contact}</p>
                  </div>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <p className="text-[9px] text-slate-800 font-medium leading-tight break-words">
                    {item.receiver_address || 'N/A'}
                  </p>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <span className="inline-block text-[8px] font-black text-primary bg-primary/10 px-1 py-0.5 rounded border border-primary/20 uppercase tracking-tighter break-words">
                    {item.goods_type}
                  </span>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                  <span className="text-slate-900 text-[9px] font-black uppercase tracking-tighter bg-slate-50 px-1 py-0.5 rounded border border-slate-200 break-words">
                    {item.destination || 'N/A'}
                  </span>
                </td>

                <td className="px-[3px] text-center border-r border-slate-300">
                  <span className="text-slate-900 text-[9px] font-black font-mono">
                    {item.pieces || 0}
                  </span>
                </td>

                <td className="px-[3px] text-center border-r border-slate-300">
                  <span className="text-slate-900 text-[9px] font-black font-mono">
                     {item.weight_kg || 0}
                  </span>
                </td>

                <td className="px-[3px] text-right border-r border-slate-300">
                  <span className="font-mono font-black text-primary text-[10px]">
                    ${item.amount || 0}
                  </span>
                </td>

                <td className="px-[3px] border-r border-slate-300">
                   <p className="text-[9px] text-slate-600 italic font-medium leading-tight break-words">
                     {item.package_description || 'N/A'}
                   </p>
                </td>

                <td className="px-[3px] text-center">
                  <div className="flex justify-center">
                    <div className="p-1 text-slate-400 group-hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (remains optimized) */}
      <div className="lg:hidden grid grid-cols-1 gap-5 p-4">
        {data.map((item) => (
          <div 
            key={item.id} 
            onClick={() => openDetails(item)}
            className={`bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden group ${item.is_locked ? 'bg-slate-50/50' : 'hover:border-primary/30 hover:shadow-md'}`}
          >
            {/* Status Indicator */}
            <div className={`absolute top-0 left-0 w-2.5 h-full ${item.is_locked ? 'bg-slate-200' : 'bg-primary'}`} />
            
            <div className="flex justify-between items-start mb-6 pl-4">
              <div className="flex-grow min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1.5 rounded-xl border border-slate-200/50">
                    EXP-{item.id}
                  </span>
                  {item.is_locked && <Lock className="w-3.5 h-3.5 text-slate-300" />}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight truncate">{item.client_name}</h3>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-2">
                   <Phone className="w-3.5 h-3.5 text-slate-300" /> {item.contact_details}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Amount</p>
                <p className="text-2xl font-black text-primary">${item.amount || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 pl-4">
               <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Receiver</p>
                    <p className="text-sm text-slate-700 font-black truncate">{item.recipient_name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pieces</p>
                     <p className="text-sm text-slate-800 font-black">{item.pieces || 0}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm text-amber-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Destination</p>
                    <p className="text-sm text-slate-700 font-black truncate">{item.destination || 'N/A'}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Weight</p>
                     <p className="text-sm text-slate-800 font-black">{item.weight_kg || 0} <span className="text-[10px] font-bold">kg</span></p>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 pl-4">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-200" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2 bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
                  <Package className="w-4 h-4" />
                  {item.goods_type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-300 group-hover:text-red-500 group-hover:bg-red-50 transition-all border border-transparent group-hover:border-red-100">
                   <Trash2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ExportDetailsModal 
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, record: null, editMode: false })}
        record={detailsModal.record}
        fetchExports={fetchExports}
        initialEditMode={detailsModal.editMode}
      />
    </>
  );
};

export default ExportTable;
