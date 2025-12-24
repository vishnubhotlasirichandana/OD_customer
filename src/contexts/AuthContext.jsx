import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client'; // <--- UPDATED THIS LINE

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  const checkAuth = async () => {
    try {
      const { data } = await client.get('/user/profile');
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, otp) => {
    try {
      const { data } = await client.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        setUser(data.data);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
    return false;
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);