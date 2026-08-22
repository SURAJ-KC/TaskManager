import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import RegiPage from './Components/Registration/RegiPage';
import LoginPage from './Components/log/LoginPage';
import UserDashboard from './Components/Dashboard/Dashboard';

// Import Protected Route Wrapper
import ProtectedRoute from './Components/auth/ProtectedRoute';

// Import board components
import BoardList from './features/boards/compontents/BoardList';
import BoardView from './features/boards/compontents/BoardView';

const Routes_ = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegiPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (Requires valid auth token) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/boards" element={<BoardList />} />
        <Route path="/board/:id" element={<BoardView />} />
      </Route>
    </Routes>
  );
};

export default Routes_;