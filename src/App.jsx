import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import the pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FormInputPage from './pages/FormInputPage';
import FieldGenerationPage from './pages/FieldGenerationPage';

// IMPORTANT: Replace with your actual Google Client ID
// Go to https://console.cloud.google.com/apis/credentials to get one.
const GOOGLE_CLIENT_ID = "446537298163-p16rvssu5m8agbntptlog48eu8rt4t0e.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-form" element={<FormInputPage />} />
          <Route path="/generate-fields" element={<FieldGenerationPage />} />
          {/* This is a catch-all route, you can create a 404 page later */}
          <Route path="*" element={<LandingPage />} /> 
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;