import axios from 'axios';

const API_BASE_URL = 'https://sj-express.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const exportService = {
  getAll: () => api.get('/exports'),
  create: (data) => api.post('/exports', data),
  update: (id, data) => api.put(`/exports/${id}`, data),
  delete: (id) => api.delete(`/exports/${id}`),
  downloadExcel: () => `${API_BASE_URL}/export/excel`,
  downloadPdf: () => `${API_BASE_URL}/export/pdf`,
};

export default api;
