// sdc/sdc-frontend/src/contexts/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [PageLoading, setPageLoading] = useState(true);

  // On mount, check localStorage for user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setPageLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  const refreshUser = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, PageLoading, setPageLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;