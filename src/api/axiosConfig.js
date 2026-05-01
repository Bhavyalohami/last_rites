// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
// });

// // Add a request interceptor to include auth token for admin calls
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token && config.url.startsWith('/admin')) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API; 

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add a request interceptor to include auth token for protected routes
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage (key used in useAuth hook)
    const token = localStorage.getItem('token');
    
    // Attach token only to requests that need authentication
    if (token && (config.url.startsWith('/admin') || config.url.startsWith('/chat'))) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;