import React, { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { exportService } from '../services/api';
import toast from 'react-hot-toast';
import Modal from './Modal';

const ExportTable = ({ data, setExports, fetchExports }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const startEditing = (record) => {
    setEditingId(record.id);
    setEditValues({ ...record });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await exportService.update(id, editValues);
      setExports(prev => prev.map(item => item.id === id ? editValues : item));
      setEditingId(null);
      toast.success('Record updated');
    } catch (error) {
      toast.error('Failed to update record');
    }
  };

  const confirmDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    const { id } = deleteModal;
    try {
      await exportService.delete(id);
      setExports(prev => prev.filter(item => item.id !== id));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="spreadsheet-table w-full">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>Client Name</th>
              <th>Contact Details</th>
              <th>Goods Type</th>
              <th className="w-24">Weight</th>
              <th className="w-24">Amount</th>
              <th>Destination</th>
              <th>Recipient</th>
              <th>Rec. Contact</th>
              <th className="w-20">Pieces</th>
              <th className="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="text-center text-slate-400 text-sm border-r border-slate-200 bg-slate-50/50">{index + 1}</td>
                
                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="client_name"
                        value={editValues.client_name}
                        onChange={handleChange}
                        autoFocus
                        className="spreadsheet-input font-medium text-primary"
                      />
                    ) : (
                      <span className="font-medium text-slate-700">{item.client_name}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="contact_details"
                        value={editValues.contact_details}
                        onChange={handleChange}
                        className="spreadsheet-input"
                      />
                    ) : (
                      <span className="text-slate-600">{item.contact_details}</span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="goods_type"
                        value={editValues.goods_type}
                        onChange={handleChange}
                        className="spreadsheet-input"
                      />
                    ) : (
                      <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                        {item.goods_type}
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="weight_kg"
                        type="number"
                        value={editValues.weight_kg}
                        onChange={handleChange}
                        className="spreadsheet-input text-right"
                      />
                    ) : (
                      <div className="text-right font-mono text-slate-700">{item.weight_kg}kg</div>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="amount"
                        type="number"
                        value={editValues.amount}
                        onChange={handleChange}
                        className="spreadsheet-input text-right"
                      />
                    ) : (
                      <div className="text-right font-mono text-slate-700">${item.amount}</div>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="destination"
                        value={editValues.destination}
                        onChange={handleChange}
                        className="spreadsheet-input"
                      />
                    ) : (
                      <span className="text-slate-600">{item.destination}</span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="recipient_name"
                        value={editValues.recipient_name}
                        onChange={handleChange}
                        className="spreadsheet-input"
                      />
                    ) : (
                      <span className="text-slate-700">{item.recipient_name}</span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="recipient_contact"
                        value={editValues.recipient_contact}
                        onChange={handleChange}
                        className="spreadsheet-input"
                      />
                    ) : (
                      <span className="text-slate-600">{item.recipient_contact}</span>
                    )}
                  </div>
                </td>

                <td>
                  <div className="spreadsheet-cell" onClick={() => editingId !== item.id && startEditing(item)}>
                    {editingId === item.id ? (
                      <input 
                        name="pieces"
                        type="number"
                        value={editValues.pieces}
                        onChange={handleChange}
                        className="spreadsheet-input text-right"
                      />
                    ) : (
                      <div className="text-right font-mono text-slate-700">{item.pieces}</div>
                    )}
                  </div>
                </td>

                <td className="p-2">
                  <div className="flex justify-center space-x-2">
                    {editingId === item.id ? (
                      <>
                        <button 
                          onClick={() => handleSave(item.id)}
                          className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="p-1.5 bg-slate-400 text-white rounded hover:bg-slate-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => confirmDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-slate-100">
        {data.map((item) => (
          <div key={item.id} className="p-4 bg-white active:bg-slate-50 transition-colors">
            {editingId === item.id ? (
              /* Mobile Edit Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Client Name</label>
                    <input 
                      name="client_name"
                      value={editValues.client_name}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination</label>
                    <input 
                      name="destination"
                      value={editValues.destination}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Goods</label>
                      <input 
                        name="goods_type"
                        value={editValues.goods_type}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount ($)</label>
                      <input 
                        name="amount"
                        type="number"
                        value={editValues.amount}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weight (kg)</label>
                      <input 
                        name="weight_kg"
                        type="number"
                        value={editValues.weight_kg}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recipient</label>
                      <input 
                        name="recipient_name"
                        value={editValues.recipient_name}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleSave(item.id)}
                    className="flex-grow py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                  >
                    <Check className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="px-4 bg-slate-100 text-slate-500 rounded-xl font-bold flex items-center justify-center active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Mobile View Mode */
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{item.client_name}</h3>
                    <p className="text-sm text-slate-500">{item.destination || 'No destination'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => confirmDelete(item.id)}
                      className="p-2 text-red-500 bg-red-50 rounded-lg active:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Goods</p>
                    <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">
                      {item.goods_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount</p>
                    <p className="text-sm font-mono font-bold text-primary">${item.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weight</p>
                    <p className="text-sm text-slate-700">{item.weight_kg}kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recipient</p>
                    <p className="text-sm text-slate-700 truncate">{item.recipient_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                   <button 
                      onClick={() => startEditing(item)}
                      className="flex-grow py-2 px-4 bg-primary/5 text-primary rounded-lg text-sm font-bold hover:bg-primary/10 active:bg-primary/20 transition-colors border border-primary/10"
                    >
                      Edit Details
                    </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Modal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default ExportTable;
