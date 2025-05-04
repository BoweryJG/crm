import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './themes/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// CSS baseline reset
import CssBaseline from '@mui/material/CssBaseline';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<div>Forgot Password (Coming Soon)</div>} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<div>Contacts Page (Coming Soon)</div>} />
              <Route path="practices" element={<div>Practices Page (Coming Soon)</div>} />
              <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
              <Route path="research" element={<div>Research Module (Coming Soon)</div>} />
              <Route path="content" element={<div>Content Generator (Coming Soon)</div>} />
              <Route path="call-analysis" element={<div>Call Analysis (Coming Soon)</div>} />
              <Route path="market" element={<div>Market Intelligence (Coming Soon)</div>} />
              <Route path="dental" element={<div>Dental Procedures Knowledge Base (Coming Soon)</div>} />
              <Route path="aesthetic" element={<div>Aesthetic Procedures Knowledge Base (Coming Soon)</div>} />
              <Route path="companies" element={<div>Companies Database (Coming Soon)</div>} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
