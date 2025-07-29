import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { sendOtp, verifyOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios"; 

const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGetOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      toast.info("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendOtp(email);
      setSuccess("OTP sent to your email.");
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      toast.info("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(email, otp, "", ""); 
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP.");
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google-login`, {
        token: credentialResponse.credential,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast.success("Google login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Google login failed");
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthLayout title="Sign In" imageSrc="/assets/1.webp">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          {step === 2 && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          )}
          
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          
          <button
            type="button"
            onClick={step === 1 ? handleGetOtp : handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? step === 1
                ? "Sending OTP..."
                : "Verifying..."
              : step === 1
              ? "Get OTP"
              : "Login"}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign Up
            </a>
          </p>
        </form>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
};

export default Login;