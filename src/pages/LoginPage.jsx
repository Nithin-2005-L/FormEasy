import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, googleLogin, isLoading, error, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Sign-up form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });


  // Handle email login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsFormLoading(true);

    // Validation
    if (!loginData.email || !loginData.password) {
      setFormError('Please fill in all fields');
      setIsFormLoading(false);
      return;
    }

    const result = await login(loginData.email, loginData.password);
    setIsFormLoading(false);

    if (result.success) {
      setFormSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setFormError(result.error || 'Login failed');
    }
  };

  // Handle email signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsFormLoading(true);

    // Validation
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setFormError('Please fill in all fields');
      setIsFormLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setFormError('Passwords do not match');
      setIsFormLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      setIsFormLoading(false);
      return;
    }

    if (!signupData.termsAccepted) {
      setFormError('Please accept the terms and conditions');
      setIsFormLoading(false);
      return;
    }

    const result = await register(
      signupData.email,
      signupData.password,
      signupData.confirmPassword,
      signupData.fullName
    );
    setIsFormLoading(false);

    if (result.success) {
      setFormSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setFormError(result.error || 'Sign-up failed');
    }
  };

  // Handle Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setFormError('');
      setFormSuccess('');
      setIsFormLoading(true);

      // Decode the credential token
      const decoded = jwtDecode(credentialResponse.credential);
      
      const result = await googleLogin(
        decoded.sub,
        decoded.email,
        decoded.name,
        decoded.picture
      );

      setIsFormLoading(false);

      if (result.success) {
        setFormSuccess('Google login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setFormError(result.error || 'Google login failed');
      }
    } catch (error) {
      setIsFormLoading(false);
      setFormError('Failed to process Google login');
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    setFormError('Google Sign-In failed. Please try again.');
  };

  // Update login form
  const handleLoginChange = (e) => {
    const { name, type, checked, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Update signup form
  const handleSignupChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              FormEasy
            </h1>
            <p className="text-blue-100">Build powerful forms effortlessly</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('login');
                setFormError('');
                setFormSuccess('');
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setFormError('');
                setFormSuccess('');
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}

            {/* Success Message */}
            {formSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start">
                <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{formSuccess}</p>
              </div>
            )}

            {/* Login Tab */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={isFormLoading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isFormLoading ? 'Logging in...' : 'Login'}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                  />
                </div>

                {/* Forgot Password Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Forgot password? 
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
                    Reset it here
                  </a>
                </p>
              </form>
            )}

            {/* Sign Up Tab */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={signupData.fullName}
                      onChange={handleSignupChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      disabled={isFormLoading}
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    id="terms"
                    checked={signupData.termsAccepted}
                    onChange={handleSignupChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                    disabled={isFormLoading}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isFormLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          FormEasy © 2025 • All rights reserved
        </p>
      </div>
    </div>
  );
};

export default LoginPage;