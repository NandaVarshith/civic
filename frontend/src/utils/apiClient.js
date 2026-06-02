import axios from 'axios';

const apiClient = axios.create({
  timeout: 30000,
  withCredentials: true
});

// Retry logic for transient failures
const retryRequest = async (config, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiClient(config);
    } catch (error) {
      // Don't retry on client errors (4xx) or authorization failures
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (i === retries - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    const publicAuthPages = ['/login', '/register'];
    const isPublicAuthPage = publicAuthPages.includes(window.location.pathname);

    if (error.response?.status === 401 && !error.config?.skipAuthRedirect && !isPublicAuthPage) {
      window.location.href = '/login';
    }

    // Log error details for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });

    return Promise.reject(error);
  }
);

export default apiClient;
export { retryRequest };
