import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./components/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Logo from "./components/Logo";

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
const token = localStorage.getItem("token");
return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
return (
  <>
<Logo />
<Routes>
<Route path="/" element={<Navigate to="/signup" replace />} />
<Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
/>
<Route path="*" element={<div>404 Not Found</div>} />
</Routes>
</>
);
};

export default App;