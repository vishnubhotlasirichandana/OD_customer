import axios from 'axios';

// 1. Force the Backend URL here to prevent "self-talk"
const BACKEND_URL = 'http://localhost:3000/api';

console.log("Connecting to Backend at:", BACKEND_URL);

const client = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Critical for your Cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default client;