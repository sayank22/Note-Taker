import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth";
import { toast } from 'react-toastify';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await verifyOtp(email, otp);
      const token = res.data.token;

      // Save token and redirect to dashboard
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP.");
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <p className="mb-2">OTP sent to: {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
