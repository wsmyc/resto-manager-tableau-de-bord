// src/services/api.ts

import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // ← your actual URL
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      // Merge existing headers (if any) with our Authorization header,
      // then cast to AxiosRequestHeaders so TypeScript is happy.
      const existing = (config.headers as Record<string, string>) || {};
      config.headers = {
        ...existing,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
