import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://sj-express.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const exportService = {
  getAll: (params) => api.get('/exports', { params }),
  getById: (id) => api.get(`/exports/${id}`),
  create: (data) => api.post('/exports', data),
  update: (id, data) => api.put(`/exports/${id}`, data),
  lock: (id) => api.put(`/exports/${id}/lock`),
  delete: (id) => api.delete(`/exports/${id}`),
  downloadExcel: () => `${API_BASE_URL}/export/excel`,
  downloadPdf: () => `${API_BASE_URL}/export/pdf`,
};

export default api;
