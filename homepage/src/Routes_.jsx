import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import RegiPage from './Components/Registration/RegiPage';
import LoginPage from './Components/log/LoginPage';
import UserDashboard from './Components/Dashboard/Dashboard';

const Routes_ = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegiPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      
    </Routes>
  );
};

export default Routes_;