// Updated App.tsx with reorganized routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as ThemeContextProvider } from './themes/ThemeContext';
import { AppModeProvider } from './contexts/AppModeContext';
import { AuthProvider } from './auth/AuthContext';
import { DashboardDataProvider } from './contexts/DashboardDataContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Main Pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Practices from './pages/Practices';
import Analytics from './pages/Analytics';
import RepAnalytics from './pages/RepAnalytics';

// SUIS Intelligence Pages
import IntelligenceDashboard from './suis/components/IntelligenceDashboard';
import ContactUniverse from './suis/components/ContactUniverse';
import ContentGenerator from './suis/components/ContentGenerator';
import ResearchAssistant from './suis/components/ResearchAssistant';
import MarketIntelligenceFeed from './suis/components/MarketIntelligenceFeed';
import LearningPathway from './suis/components/LearningPathway';
import CallAnalysisPage from './pages/CallAnalysis';

// Knowledge Academy Pages
import KnowledgeAcademy from './pages/KnowledgeAcademy';
import KnowledgeDental from './pages/KnowledgeDental';
import KnowledgeAesthetic from './pages/KnowledgeAesthetic';

// Account Pages
import Settings from './pages/Settings';
import Subscribe from './pages/Subscribe';
import SubscribeSuccess from './pages/SubscribeSuccess';
import SubscribeCancel from './pages/SubscribeCancel';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AuthCallback from './pages/AuthCallback';

// Other Pages
import Profile from './pages/Profile';
import RipplePage from './pages/RipplePage';
import LuxuryLandingWrapper from './pages/LuxuryLandingWrapper';

// Combined Analytics Page Component
const CombinedAnalytics: React.FC = () => {
  return (
    <div>
      <Analytics />
      <RepAnalytics />
    </div>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <AppModeProvider>
        <AuthProvider>
          <DashboardDataProvider>
            <CssBaseline />
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Public Routes */}
                <Route path="/landing" element={<LuxuryLandingWrapper />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  {/* Main Section */}
                  <Route index element={<Dashboard />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="contacts/:id" element={<ContactDetail />} />
                  <Route path="practices" element={<Practices />} />
                  <Route path="analytics" element={<CombinedAnalytics />} />
                  
                  {/* SUIS Intelligence Section */}
                  <Route path="intelligence">
                    <Route index element={<IntelligenceDashboard />} />
                    <Route path="contacts" element={<ContactUniverse />} />
                    <Route path="content" element={<ContentGenerator />} />
                    <Route path="research" element={<ResearchAssistant />} />
                    <Route path="market" element={<MarketIntelligenceFeed />} />
                    <Route path="learning" element={<LearningPathway />} />
                    <Route path="calls" element={<CallAnalysisPage />} />
                  </Route>
                  
                  {/* Knowledge Academy Section */}
                  <Route path="knowledge">
                    <Route index element={<KnowledgeAcademy />} />
                    <Route path="dental" element={<KnowledgeDental />} />
                    <Route path="aesthetic" element={<KnowledgeAesthetic />} />
                  </Route>
                  
                  {/* Account Section */}
                  <Route path="settings" element={<Settings />} />
                  <Route path="subscribe" element={<Subscribe />} />
                  <Route path="subscribe/success" element={<SubscribeSuccess />} />
                  <Route path="subscribe/cancel" element={<SubscribeCancel />} />
                  
                  {/* Other Routes */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="ripple" element={<RipplePage />} />
                  
                  {/* Legacy Route Redirects */}
                  <Route path="/call-analysis" element={<Navigate to="/intelligence/calls" replace />} />
                  <Route path="/research" element={<Navigate to="/intelligence/research" replace />} />
                  <Route path="/content" element={<Navigate to="/intelligence/content" replace />} />
                  <Route path="/market" element={<Navigate to="/intelligence/market" replace />} />
                  <Route path="/rep-analytics" element={<Navigate to="/analytics" replace />} />
                  <Route path="/market/practice-interaction" element={<Navigate to="/contacts" replace />} />
                  <Route path="/market/dental-implants" element={<Navigate to="/knowledge/dental" replace />} />
                  <Route path="/market/aesthetic" element={<Navigate to="/knowledge/aesthetic" replace />} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </DashboardDataProvider>
        </AuthProvider>
      </AppModeProvider>
    </ThemeContextProvider>
  );
}

export default App;