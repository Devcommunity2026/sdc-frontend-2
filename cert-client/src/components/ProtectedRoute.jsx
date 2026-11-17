import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Check if a token was passed via URL search parameters (e.g. /admin?token=xxx from main website)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryToken = searchParams.get('token');
    if (queryToken && queryToken.trim()) {
      localStorage.setItem('token', queryToken.trim());
      // Reload without the token query param to keep URL clean
      window.location.href = window.location.pathname;
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white bg-grid-pattern">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // If authenticated, grant access to protected admin route
  if (isAuthenticated || localStorage.getItem('token')) {
    return children;
  }

  // Otherwise, redirect to the Certificate Admin Login page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
