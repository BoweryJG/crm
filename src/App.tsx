import React, { lazy, Suspense, useState, useEffect } from 'react';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
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
import GlobalCallPanel from './components/communications/GlobalCallPanel';

// CSS baseline reset
import CssBaseline from '@mui/material/CssBaseline';

// Lazy loaded components for code splitting
const DentalImplantMarketDashboard = lazy(() => import('./components/marketResearch/DentalImplantMarketDashboard'));
const PracticeInteractionTracker = lazy(() => import('./components/marketResearch/PracticeInteractionTracker'));
const PromptManagement = lazy(() => import('./pages/AI/PromptManagement'));
const Research = lazy(() => import('./pages/Research'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RepAnalytics = lazy(() => import('./pages/RepAnalytics'));
const CallAnalysis = lazy(() => import('./pages/CallAnalysis'));
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"));

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes - still available but not required */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* All Routes - no authentication required */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="contacts" element={<React.Suspense fallback={<div>Loading...</div>}><Contacts /></React.Suspense>} />
                <Route path="contacts/:id" element={<React.Suspense fallback={<div>Loading...</div>}><ContactDetail /></React.Suspense>} />
                <Route path="practices" element={<React.Suspense fallback={<div>Loading...</div>}><Practices /></React.Suspense>} />
                <Route path="analytics" element={<Suspense fallback={<div>Loading...</div>}><Analytics /></Suspense>} />
                <Route path="rep-analytics" element={<Suspense fallback={<div>Loading...</div>}><RepAnalytics /></Suspense>} />
                <Route path="research" element={<Suspense fallback={<div>Loading...</div>}><Research /></Suspense>} />
                <Route path="content" element={<Suspense fallback={<div>Loading...</div>}><PromptManagement /></Suspense>} />
                <Route path="call-analysis" element={<Suspense fallback={<div>Loading...</div>}><CallAnalysis /></Suspense>} />
                <Route path="market" element={<Suspense fallback={<div>Loading...</div>}><MarketIntelligence /></Suspense>} />
                <Route path="market/dental-implants" element={<React.Suspense fallback={<div>Loading...</div>}><DentalImplantMarketDashboard /></React.Suspense>} />
                <Route path="market/practice-interaction" element={<React.Suspense fallback={<div>Loading...</div>}><PracticeInteractionTracker /></React.Suspense>} />
                <Route path="dental" element={<div>Dental Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="aesthetic" element={<div>Aesthetic Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="companies" element={<div>Companies Database (Coming Soon)</div>} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            
            {/* Global Call Panel - Available on all authenticated pages */}
            <GlobalCallPanel />
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
