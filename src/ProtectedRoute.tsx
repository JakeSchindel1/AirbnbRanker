import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Protected route component that checks authentication status
const ProtectedRoute: React.FC = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // If not authenticated, redirect to sign-in page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 