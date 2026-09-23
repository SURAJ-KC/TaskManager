import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import RegiPage from './Components/Registration/RegiPage';
import LoginPage from './Components/log/LoginPage';
import UserDashboard from './Components/Dashboard/Dashboard';
import ForgotPassword from './Components/ForgotPassword';

// Import Protected Route Wrapper
import ProtectedRoute from './Components/auth/ProtectedRoute';

// Import board components
import BoardList from './features/boards/compontents/BoardList';
import BoardView from './features/boards/compontents/BoardView';

const Routes_ = () => {
  return (
    <>
     <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }} 
      />


    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegiPage />} />
      <Route path="/login" element={<LoginPage />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Protected Routes (Requires valid auth token) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/boards" element={<BoardList />} />
        <Route path="/board/:id" element={<BoardView />} />
       
      </Route>
    </Routes>
    </>
  );
};

export default Routes_;