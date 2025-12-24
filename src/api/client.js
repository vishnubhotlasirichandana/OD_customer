import axios from 'axios';

// Use env variable or fallback to localhost
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log("Connecting to Backend at:", BACKEND_URL);

const client = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Global error logging or toast notification logic here
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default client;