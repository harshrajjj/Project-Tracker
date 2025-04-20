import axios from 'axios';

// Determine if we're in production or development
const isProduction = import.meta.env.PROD;

// In production, we need to use the full URL of the API
// For Vercel frontend + Render backend, we must use the absolute URL
let apiBaseURL;

if (isProduction) {
  // Use the environment variable if available
  apiBaseURL = import.meta.env.VITE_API_URL;

  // If the environment variable isn't set, default to the backend URL
  if (!apiBaseURL) {
    apiBaseURL = 'https://projecttaskr-backend.onrender.com/api';
  }

  // Make sure the URL includes the /api prefix
  if (!apiBaseURL.includes('/api')) {
    apiBaseURL = apiBaseURL + '/api';
  }

  // Remove trailing slash if present
  if (apiBaseURL.endsWith('/')) {
    apiBaseURL = apiBaseURL.slice(0, -1);
  }
} else {
  // In development, use the proxy setup in vite.config.js
  apiBaseURL = '/api';
}

console.log('API Base URL:', apiBaseURL);

// Create an instance of axios with default config
const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000, // 60 seconds timeout for Render's cold start
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Add token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Token loaded from localStorage and set in axios headers');
}

// Add a request interceptor to always check for token and for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if token exists in localStorage before each request
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      // Update the Authorization header with the current token
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    // Log the request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and auth error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);

      // Handle authentication errors
      if (error.response.status === 401) {
        console.log('Authentication error detected, checking if on protected route');

        // If we're not on the login or register page, we might need to redirect
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
          console.log('On protected route with auth error, clearing token');
          // Clear the token from localStorage
          localStorage.removeItem('token');
          delete axiosInstance.defaults.headers.common['Authorization'];

          // Redirect to login page
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
