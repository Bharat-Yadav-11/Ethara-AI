import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor: Attaches the token to every request if it exists
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    const { token } = JSON.parse(localStorage.getItem('userInfo'));
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;