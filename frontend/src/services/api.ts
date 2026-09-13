import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (creds: any) => {
    const res = await api.post('/auth/login', creds);
    if (res.data.token) localStorage.setItem('erp_auth_token', res.data.token);
    return res.data;
  },
};

export const journalService = {
  getAll: async () => (await api.get('/journals')).data,
  create: async (data: any) => (await api.post('/journals', data)).data,
};

export const contactService = {
  getAll: async () => (await api.get('/contacts')).data,
  create: async (data: any) => (await api.post('/contacts', data)).data,
};

export const productService = {
  getAll: async () => (await api.get('/products')).data,
  create: async (data: any) => (await api.post('/products', data)).data,
};