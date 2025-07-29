import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { sendOtp, verifyOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { toast } from 'react-toastify';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = async () => {
    if (!formData.name || !formData.dob || !formData.email) {
      setError("Please fill in all fields.");
      toast.info("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(formData.email);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.otp) {
      setError("Please enter the OTP.");
      toast.info("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(
        formData.email,
        formData.otp,
        formData.name,
        formData.dob
      );
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
        credential: credentialResponse.credential,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Google login failed");
      toast.error("Google login failed");

    }
  };

  return (
    <GoogleOAuthProvider clientId="27614044986-qkkp494bcpqu3hnvpkhumm6pttr0nbhj.apps.googleusercontent.com">
      <AuthLayout title="Sign Up" imageSrc="/assets/signup-bg.jpg">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
          {step === 2 && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          )}
          <button
            type="button"
            onClick={step === 1 ? handleGetOtp : handleSignup}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? step === 1
                ? "Sending OTP..."
                : "Verifying..."
              : step === 1
              ? "Get OTP"
              : "Sign Up"}
          </button>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-2 text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 underline">
              Login
            </a>
          </p>
        </form>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
};

export default Signup;
