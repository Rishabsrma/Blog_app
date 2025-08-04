'use client';
import axios from 'axios';

export const clientApi = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

clientApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
