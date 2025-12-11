import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = "https://retailstore-tu67.onrender.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
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

/**
 * Get transactions with search, filter, sort, and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response data
 */
export const getTransactions = async (params) => {
  try {
    const response = await api.get('/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Get available filter options
 * @returns {Promise<Object>} - Filter options
 */
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

/**
 * Get statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Statistics data
 */
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