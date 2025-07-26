import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = () => {
    setStep(2);
  };

  const handleSignup = () => {
    console.log('Signing up...');
  };

  return (
    <AuthLayout title="Sign Up" imageSrc="/assets/signup-bg.jpg">
      <form className="space-y-4">
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
        >
          {step === 1 ? 'Get OTP' : 'Sign Up'}
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
