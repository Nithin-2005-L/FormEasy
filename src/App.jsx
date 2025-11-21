import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import the pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FormInputPage from './pages/FormInputPage';
import FieldGenerationPage from './pages/FieldGenerationPage';
import FormEditorPage from './pages/FormEditorPage';
import FormResponsePage from './pages/FormResponsePage';
import SubmissionsPage from './pages/SubmissionsPage';
import DashboardPage from './pages/DashboardPage';

// IMPORTANT: Replace with your actual Google Client ID
// Go to https://console.cloud.google.com/apis/credentials to get one.
const GOOGLE_CLIENT_ID = "446537298163-p16rvssu5m8agbntptlog48eu8rt4t0e.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-form" element={<FormInputPage />} />
              <Route path="/generate-fields" element={<FieldGenerationPage />} />
              <Route path="/edit-form" element={<FormEditorPage />} />
              <Route path="/form/:formId" element={<FormResponsePage />} />
              <Route path="/submissions/:formId" element={<SubmissionsPage />} />
              {/* This is a catch-all route, you can create a 404 page later */}
              <Route path="*" element={<LandingPage />} /> 
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;