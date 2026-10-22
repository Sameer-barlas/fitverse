import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiErr = error.response?.data?.error;
    const normalizedError = new Error(
      apiErr?.message || error.message || 'An unexpected error occurred',
    );
    normalizedError.code = apiErr?.code || 'NETWORK_ERROR';
    normalizedError.details = apiErr?.details || null;
    normalizedError.status = error.response?.status || 500;
    return Promise.reject(normalizedError);
  },
);

export default client;
