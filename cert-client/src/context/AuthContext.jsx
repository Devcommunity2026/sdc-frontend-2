import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token: receivedToken, admin: adminData } = response.data.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('admin', JSON.stringify(adminData));

      setToken(receivedToken);
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
