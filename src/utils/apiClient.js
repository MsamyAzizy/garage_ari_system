// src/utils/apiClient.js

import axios from 'axios';

// 1. Define the base URL for the Django backend
const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  // 🛑 CRITICAL FIX: Remove the 'Content-Type: application/json' header default.
  // This allows Axios to correctly set 'multipart/form-data' when uploading files (FormData).
  headers: {
    // 'Content-Type': 'application/json', <--- REMOVED THIS LINE
  },
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🛑 DEBUG: Add request logging to track all API calls
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Set the Authorization header for protected endpoints
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // 🛑 DEBUG: Log every request
    console.log('🚀 API REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      clientId: config.url?.includes('/clients/') ? config.url.split('/')[2] : 'N/A',
      hasData: !!config.data,
      dataKeys: config.data ? Object.keys(config.data) : [],
      timestamp: new Date().toISOString()
    });
    
    // 🛑 DEBUG: Log stack trace for vehicle creation requests
    if (config.url?.includes('/vehicles/')) {
      console.trace('🔄 VEHICLE REQUEST STACK TRACE:');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// 🛑 DEBUG: Add response logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API RESPONSE SUCCESS:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    
    console.log('❌ API RESPONSE ERROR:', {
      status: status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      clientId: originalRequest?.url?.includes('/clients/') ? originalRequest.url.split('/')[2] : 'N/A',
      data: error.response?.data,
      _retry: originalRequest?._retry,
      timestamp: new Date().toISOString()
    });
    
    // 🛑 FIX: Check if this request has already been retried to prevent loops
    if (status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/jwt/refresh/') {
      
      console.log('🔄 Token refresh triggered for:', originalRequest.url);
      
      // Handle requests when a refresh is already in progress
      if (isRefreshing) {
        console.log('⏳ Refresh in progress, queuing request:', originalRequest.url);
        // Queue up the failed request and retry it later
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          console.log('🔄 Retrying queued request with new token:', originalRequest.url);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          console.error('❌ Queued request failed:', err);
          return Promise.reject(err);
        });
      }
      
      // Start the refresh process
      originalRequest._retry = true;
      isRefreshing = true;
      console.log('🔄 Starting token refresh process...');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          console.error('❌ No refresh token available');
          processQueue(new Error('No refresh token available.'));
          return Promise.reject(error); 
        }

        console.log('🔄 Refreshing token...');
        const response = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        console.log('✅ Token refreshed successfully');

        // Process the queue with the new token
        isRefreshing = false;
        processQueue(null, newAccessToken);

        // Update the authorization header for the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        console.log('🔄 Retrying original request:', originalRequest.url);
        // Re-run the original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, force logout (will be handled by AuthContext listening to the error)
        console.error('❌ Token refresh failed:', refreshError);
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Clear tokens on refresh failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('🗑️ Tokens cleared due to refresh failure');
        
        // Return the error to allow the AuthContext to catch and trigger global logout
        return Promise.reject(refreshError);
      }
    }
    
    // If it's not a 401 or it's the refresh endpoint itself, reject the error
    console.log('📤 Passing through error (not 401 or already retried):', originalRequest?.url);
    return Promise.reject(error);
  }
);

export default apiClient;