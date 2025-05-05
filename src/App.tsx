import React, { lazy, Suspense, useState, useEffect } from 'react';
import Contacts from './pages/Contacts';
import Practices from './pages/Practices';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './themes/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ProtectedRoute from './components/routing/ProtectedRoute';

// CSS baseline reset
import CssBaseline from '@mui/material/CssBaseline';

// Lazy loaded components for code splitting
const DentalImplantMarketDashboard = lazy(() => import('./components/marketResearch/DentalImplantMarketDashboard'));
const PracticeInteractionTracker = lazy(() => import('./components/marketResearch/PracticeInteractionTracker'));
const PromptManagement = lazy(() => import('./pages/AI/PromptManagement'));

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Simulate loading delay to ensure all resources are properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Wrap the app with AuthProvider, but catch any errors
  return (
    <ThemeProvider>
      {!authError ? (
        <ErrorBoundary onError={() => setAuthError(true)}>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Public Routes - no authentication required */}
                <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<React.Suspense fallback={<div>Loading...</div>}><Contacts /></React.Suspense>} />
              <Route path="practices" element={<React.Suspense fallback={<div>Loading...</div>}><Practices /></React.Suspense>} />
              <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
              <Route path="research" element={<div>Research Module (Coming Soon)</div>} />
              <Route path="content" element={<Suspense fallback={<div>Loading...</div>}><PromptManagement /></Suspense>} />
              <Route path="call-analysis" element={<div>Call Analysis (Coming Soon)</div>} />
              <Route path="market" element={<div>Market Intelligence (Coming Soon)</div>} />
              <Route path="market/dental-implants" element={<React.Suspense fallback={<div>Loading...</div>}><DentalImplantMarketDashboard /></React.Suspense>} />
              <Route path="market/practice-interaction" element={<React.Suspense fallback={<div>Loading...</div>}><PracticeInteractionTracker /></React.Suspense>} />
              <Route path="dental" element={<div>Dental Procedures Knowledge Base (Coming Soon)</div>} />
              <Route path="aesthetic" element={<div>Aesthetic Procedures Knowledge Base (Coming Soon)</div>} />
              <Route path="companies" element={<div>Companies Database (Coming Soon)</div>} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      ) : (
        // If auth error, render without AuthProvider
        <>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Routes without auth protection */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="contacts" element={<React.Suspense fallback={<div>Loading...</div>}><Contacts /></React.Suspense>} />
                <Route path="practices" element={<React.Suspense fallback={<div>Loading...</div>}><Practices /></React.Suspense>} />
                <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
                <Route path="research" element={<div>Research Module (Coming Soon)</div>} />
                <Route path="content" element={<Suspense fallback={<div>Loading...</div>}><PromptManagement /></Suspense>} />
                <Route path="call-analysis" element={<div>Call Analysis (Coming Soon)</div>} />
                <Route path="market" element={<div>Market Intelligence (Coming Soon)</div>} />
                <Route path="market/dental-implants" element={<React.Suspense fallback={<div>Loading...</div>}><DentalImplantMarketDashboard /></React.Suspense>} />
                <Route path="market/practice-interaction" element={<React.Suspense fallback={<div>Loading...</div>}><PracticeInteractionTracker /></React.Suspense>} />
                <Route path="dental" element={<div>Dental Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="aesthetic" element={<div>Aesthetic Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="companies" element={<div>Companies Database (Coming Soon)</div>} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
