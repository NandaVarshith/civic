import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true;

// Add response interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    const publicAuthPages = ['/login', '/register'];
    const isPublicAuthPage = publicAuthPages.includes(window.location.pathname);

    if (error.response?.status === 401 && !error.config?.skipAuthRedirect && !isPublicAuthPage) {
      // Unauthorized - clear auth and redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
