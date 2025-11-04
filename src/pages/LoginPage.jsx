import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // In a real app, you'd send this to your backend for verification.
    // After successful verification, navigate to the next page.
    navigate('/create-form');
  };

  const handleError = () => {
    console.log('Login Failed');
    alert('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-blue-500">FormEasy</span>
        </h1>
        <p className="mt-2 text-gray-600">Sign in to create and manage your forms.</p>
        <div className="flex justify-center pt-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />
        </div>
        <p className="text-xs text-center text-gray-500 pt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;