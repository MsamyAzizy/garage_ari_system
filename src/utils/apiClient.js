// src/utils/apiClient.js

import axios from 'axios';

// 1. Define the base URL for the Django backend
// 💡 IMPORTANT: Ensure this matches your Django API root.
const BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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


// 2. Request Interceptor: Attach the Access Token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Set the Authorization header for protected endpoints
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle Token Refreshing on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    
    // Check for 401 error and ensure it's not the token refresh request itself
    if (status === 401 && originalRequest.url !== '/auth/token/refresh/') {
      
      // Handle requests when a refresh is already in progress
      if (isRefreshing) {
        // Queue up the failed request and retry it later
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      // Start the refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, clear tokens and redirect to login (AuthContext job)
          processQueue(new Error('No refresh token available.'));
          return Promise.reject(error); 
        }

        // POST request to Django Simple JWT's token refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Process the queue with the new token
        isRefreshing = false;
        processQueue(null, newAccessToken);

        // Update the authorization header for the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Re-run the original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, force logout (will be handled by AuthContext listening to the error)
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Return the error to allow the AuthContext to catch and trigger global logout
        return Promise.reject(refreshError);
      }
    }
    
    // If it's not a 401 or it's the refresh endpoint itself, reject the error
    return Promise.reject(error);
  }
);

export default apiClient;