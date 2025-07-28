import React, { useState } from 'react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGetOtp = async () => {
    try {
      if (!email) {
        setError('Please enter an email.');
        return;
      }
      setError('');
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      if (res.status === 200) {
        setSuccess('OTP sent to your email.');
        setStep(2);
      }
    } catch (err) {
      setError('Failed to send OTP. Try again.');
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      if (!otp) {
        setError('Enter OTP');
        return;
      }
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard'; // redirect after login
      }
    } catch (err) {
      setError('Invalid OTP');
      console.error(err);
    }
  };

  return (
    <AuthLayout title="Login" imageSrc="/assets/1.webp">
      <form className="space-y-4">
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="button"
          onClick={step === 1 ? handleGetOtp : handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {step === 1 ? 'Get OTP' : 'Login'}
        </button>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 underline">
            Sign Up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
