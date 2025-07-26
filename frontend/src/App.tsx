// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOtp from "./components/VerifyOtp";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
