import axios from 'axios';

// Backend configuration
// Hardcoded for network access - backend is running on 0.0.0.0:5000
const isDev = import.meta.env.DEV;
//const API_HOST = '192.168.1.34'; // Your machine's IP address
const API_HOST = 'localhost';

// Use direct backend URL to avoid HTTPS proxy issues
const API_BASE_URL = `https://${API_HOST}:5001/api`;
const BASE_URL = `https://${API_HOST}:5001`;

// Debug logging
console.log('API Configuration:', {
  isDev,
  API_HOST,
  API_BASE_URL,
  currentHostname: window.location.hostname
});

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const companyAPI = {
  getAll: () => api.get('/company'),
  getById: (id) => api.get(`/company/${id}`),
  create: (companyData) => api.post('/company', companyData),
  update: (id, companyData) => api.put(`/company/${id}`, companyData),
  delete: (id) => api.delete(`/company/${id}`),
};

export const flyerAPI = {
  getAll: (params) => api.get('/flyer', { params }),
  uploadFlyer: (formData) => api.post('/flyer/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateFlyer: (id, formData) => api.put(`/flyer/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getFlyersByCompany: (companyId, year, month) => {
    const params = {};
    if (year && month) {
      params.year = year;
      params.month = month;
    }
    return api.get(`/flyer/company/${companyId}`, { params });
  },
  downloadFlyer: (flyerId) => `${API_BASE_URL}/flyer/download/${flyerId}`,
  getFlyerImageUrl: (imagePath) => `${BASE_URL}${imagePath}`,
  deleteFlyer: (flyerId) => api.delete(`/flyer/${flyerId}`),
};

export default api;
