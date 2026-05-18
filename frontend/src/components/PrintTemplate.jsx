import React from 'react';
import { createPortal } from 'react-dom';

const getCurrencySymbol = (currency) => {
  if (currency === 'Euro') return '€';
  if (currency === 'Dalasis') return 'D';
  return '$';
};

const PrintTemplate = ({ record }) => {
  if (!record) return null;

  // Use a portal to render at the top level of the body
  return createPortal(
    <div id="print-area-portal" className="hidden print:block fixed inset-0 bg-white z-[99999]">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            background: white !important;
          }
          #root {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          #print-area-portal {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            z-index: 99999 !important;
          }
          #print-area-portal * {
            visibility: visible !important;
          }
        }
      `}</style>

      <div className="flex flex-col h-full bg-white">
        {/* Header with Logo */}
        <div className="flex justify-between items-center border-b-4 border-primary pb-6 mb-8">
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">SJ-EXPRESS</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Logistics & Export Solutions</p>
              <p className="text-[9px] font-bold text-slate-500 mt-1.5 flex items-center gap-2">
                <span>+220 233 2680</span>
                <span className="text-slate-300">|</span>
                <span>+34 613 93 50 37</span>
                <span className="text-slate-300">|</span>
                <span>+220 209 4259</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-primary text-white px-5 py-2.5 rounded-2xl mb-2 inline-block">
               <h2 className="text-sm font-black uppercase tracking-widest">Official Manifest</h2>
            </div>
            <p className="text-xs font-mono font-black text-slate-400">ID: EXP-{record.id.toString().padStart(5, '0')}</p>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
            <p className="text-xs font-black text-slate-800">{new Date(record.created_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
            <p className="text-xs font-black text-primary uppercase">{record.goods_type}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pieces</p>
            <p className="text-xs font-black text-slate-800">{record.pieces || 0} Pcs</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dest.</p>
            <p className="text-xs font-black text-slate-800 uppercase">{record.destination || 'N/A'}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-2 mb-4 text-slate-900">Sender Details</h3>
            <div className="space-y-1.5">
              <p className="text-lg font-black text-slate-900">{record.client_name}</p>
              <p className="text-xs font-bold text-slate-600">{record.contact_details}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 italic min-h-[80px]">
                 {record.sender_address || 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-2 mb-4 text-slate-900">Receiver Details</h3>
            <div className="space-y-1.5">
              <p className="text-lg font-black text-slate-900">{record.recipient_name || 'N/A'}</p>
              <p className="text-xs font-bold text-slate-600">{record.recipient_contact || 'N/A'}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 italic min-h-[80px]">
                 {record.receiver_address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse border-2 border-slate-900">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 text-[9px] font-black uppercase border border-slate-900">Goods Description</th>
                <th className="p-3 text-[9px] font-black uppercase border border-slate-900 w-20 text-center">Qty</th>
                <th className="p-3 text-[9px] font-black uppercase border border-slate-900 w-24 text-center">Weight</th>
                <th className="p-3 text-[9px] font-black uppercase border border-slate-900 w-32 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 text-xs font-black text-slate-800 border border-slate-300">
                  <p className="text-base mb-1">{record.goods_type}</p>
                  {record.package_description && <p className="text-[10px] font-normal text-slate-400 italic">{record.package_description}</p>}
                </td>
                <td className="p-4 text-sm font-mono font-black text-center border border-slate-300">{record.pieces || 0}</td>
                <td className="p-4 text-sm font-mono font-black text-center border border-slate-300">{record.weight_kg || 0} kg</td>
                <td className="p-4 text-lg font-mono font-black text-right border border-slate-300 text-primary">{getCurrencySymbol(record.currency)}{record.amount || 0}</td>
              </tr>
            </tbody>
            <tfoot>
               <tr className="bg-slate-100">
                 <td colSpan="3" className="p-4 text-[10px] font-black uppercase text-right border border-slate-300">Total Valuation</td>
                 <td className="p-4 text-xl font-mono font-black text-right border border-slate-300 text-slate-900">{getCurrencySymbol(record.currency)}{record.amount || 0}</td>
               </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-16 mt-auto pb-10">
          <div className="text-center">
            <div className="border-b-2 border-slate-300 h-16 mb-2"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Signature</p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-slate-300 h-16 mb-2"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">SJ Express Agent</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-slate-100 pt-6">
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Contact: +220 233 2680 / +34 613 93 50 37 / +220 209 4259
          </p>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
            Print Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()} | Manifest: EXP-{record.id}
          </p>
          <p className="text-[7px] text-slate-300 mt-1 uppercase">Official System Generated Document - Valid without physical stamp</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrintTemplate;
