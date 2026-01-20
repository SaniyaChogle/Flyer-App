import axios from 'axios';

// Use proxy in development to avoid mixed content errors
// In production, use environment variable or current hostname
const isDev = import.meta.env.DEV;
const API_HOST = import.meta.env.VITE_API_HOST || window.location.hostname;

// In development, use relative URLs (proxied by Vite)
// In production, use full URLs
const API_BASE_URL = isDev ? '/api' : `http://${API_HOST}:5000/api`;
const BASE_URL = isDev ? '' : `http://${API_HOST}:5000`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const flyerAPI = {
  getCompanies: () => api.get('/flyer/companies'),
  uploadFlyer: (formData) => api.post('/flyer/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getFlyersByCompany: (companyId) => api.get(`/flyer/company/${companyId}`),
  downloadFlyer: (flyerId) => `${API_BASE_URL}/flyer/download/${flyerId}`,
  getFlyerImageUrl: (imagePath) => `${BASE_URL}${imagePath}`,
  deleteFlyer: (flyerId) => api.delete(`/flyer/${flyerId}`),
};

export default api;
