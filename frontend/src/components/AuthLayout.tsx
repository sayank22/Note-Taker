// src/components/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  title: string;
  imageSrc: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, imageSrc, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-16">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
      </div>

      {/* Right Panel */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={imageSrc}
          alt={`${title} visual`}
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
