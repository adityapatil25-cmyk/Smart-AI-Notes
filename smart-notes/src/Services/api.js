import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors - FIXED FOR BLOB RESPONSES
api.interceptors.response.use(
  (response) => {
    // Don't process blob responses - return them as-is
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    return response;
  },
  (error) => {
    // For blob responses, don't show toast errors since they might be PDF download issues
    if (error.config?.responseType === 'blob') {
      // For blob errors, the error response might contain JSON error info
      // We need to handle this carefully
      return Promise.reject(error);
    }

    const message = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong!';

    // Don't show toast for 401 errors (handled by auth context)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    // If token is expired or invalid, clear local storage
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login will be handled by AuthContext
    }

    return Promise.reject(error);
  }
);

export default api;