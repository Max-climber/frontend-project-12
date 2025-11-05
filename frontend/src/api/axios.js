import axios from 'axios';

// В dev-режиме используем proxy из vite.config.js (относительные пути)
// В prod используем переменную окружения или относительные пути (сервер обслуживает и статику, и API)
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  ...(baseURL && { baseURL }),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;