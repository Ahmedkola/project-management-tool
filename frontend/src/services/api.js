import axios from 'axios';

// Create an instance of axios with a base URL for your Django backend
const apiClient = axios.create({
  // IMPORTANT: Replace 'your-username' with your actual PythonAnywhere username.
  // This must match the URL of your deployed backend.
  baseURL: 'https://AhmedKola.pythonanywhere.com/api',
});

// Use an interceptor to add the auth token to every request
// This part remains the same
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;