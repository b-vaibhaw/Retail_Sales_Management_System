import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://retailstore-tu67.onrender.com/api';
console.log('API_BASE_URL ->', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging and interceptors (same as yours)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'base:', API_BASE_URL);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
      console.error('Likely causes: Backend not running, CORS issue, or network connectivity');
    } else {
      console.error('Error details:', error);
    }
    return Promise.reject(error);
  }
);

// your exported functions
export const getTransactions = async (params) => {
  try {
    const response = await api.get('/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await api.get('/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

export const getStats = async (params) => {
  try {
    const response = await api.get('/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export default api;
