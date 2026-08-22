// src/Components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getValidToken } from '../../Utils/auth';

const ProtectedRoute = () => {
  const token = getValidToken();

  // If token is valid and not expired, render route; otherwise redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;