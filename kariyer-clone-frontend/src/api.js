import axios from 'axios';
import { useSnackbar } from './SnackbarContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001"
});

// Snackbar referansı için bir değişken
let snackbarRef = null;
export function setApiSnackbar(fn) {
  snackbarRef = fn;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      if (error.response.status === 429 && snackbarRef) {
        snackbarRef('Çok fazla istek yaptınız, lütfen biraz bekleyin.', 'warning');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 