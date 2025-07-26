import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';

const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleGetOtp = () => {
    setStep(2);
  };

  const handleLogin = () => {
    console.log('Logging in...');
  };

  return (
    <AuthLayout title="Login" imageSrc="/assets/login-bg.jpg">
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
