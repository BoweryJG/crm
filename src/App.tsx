import React, { lazy, Suspense, useState, useEffect } from 'react';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Practices from './pages/Practices';
import SmartCRM from './pages/SmartCRM';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './themes/ThemeContext';
import { AuthProvider, AuthGuard } from './auth';
import { AppModeProvider } from './contexts/AppModeContext';
import { DashboardDataProvider } from './contexts/DashboardDataContext';
import { SUISProvider } from './suis';
import SphereLoadingScreen from './components/common/SphereLoadingScreen';
import StandaloneEliteLoadingScreen from './components/common/StandaloneEliteLoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SimpleLogin from './pages/Auth/SimpleLogin';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import GlobalCallPanel from './components/communications/GlobalCallPanel';
import { SubscriptionUpgradeModal } from './components/common/SubscriptionUpgradeModal';
import { FeatureUpgradeModal } from './components/common/FeatureUpgradeModal';
import { DemoModeIndicator } from './components/common/DemoModeIndicator';

// CSS baseline reset
import CssBaseline from '@mui/material/CssBaseline';

// Lazy loaded components for code splitting
const LuxuryLandingWrapper = lazy(() => import('./pages/LuxuryLandingWrapper'));
const DentalImplantMarketDashboard = lazy(() => import('./components/marketResearch/DentalImplantMarketDashboard'));
const PracticeInteractionTracker = lazy(() => import('./components/marketResearch/PracticeInteractionTracker'));
const AestheticMarketDashboard = lazy(() => import('./components/marketResearch/AestheticMarketDashboard'));
const PromptManagement = lazy(() => import('./pages/AI/PromptManagement'));
const Research = lazy(() => import('./pages/Research'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RepAnalytics = lazy(() => import('./pages/RepAnalytics'));
const CallInsightDetail = lazy(() => import('./pages/CallInsightDetail'));
const CallAnalysis = lazy(() => import('./pages/CallAnalysis'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const SubscribeSuccess = lazy(() => import('./pages/SubscribeSuccess'));
const SubscribeCancel = lazy(() => import('./pages/SubscribeCancel'));
const KnowledgeAcademy = lazy(() => import('./pages/KnowledgeAcademy'));
const KnowledgeDental = lazy(() => import('./pages/KnowledgeDental'));
const KnowledgeAesthetic = lazy(() => import('./pages/KnowledgeAesthetic'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const RipplePage = lazy(() => import('./pages/RipplePage'));

// SUIS Components
const SUISDemo = lazy(() => import('./components/demo/SUISDemo'));
const IntelligenceDashboard = lazy(() => import('./suis/components/IntelligenceDashboard'));
const IntelligenceProfileSetup = lazy(() => import('./suis/components/IntelligenceProfileSetup'));
const ContactUniverse = lazy(() => import('./suis/components/ContactUniverse'));
const ContentGenerator = lazy(() => import('./suis/components/ContentGenerator'));
const ResearchAssistant = lazy(() => import('./suis/components/ResearchAssistant'));
const ResearchLab = lazy(() => import('./suis/components/ResearchLab'));
const GrowthTracker = lazy(() => import('./suis/components/GrowthTracker'));
const MarketIntelligenceFeed = lazy(() => import('./suis/components/MarketIntelligenceFeed'));
const LearningPathway = lazy(() => import('./suis/components/LearningPathway'));

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Get Supabase configuration
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co';
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU';

  useEffect(() => {
    // Simulate loading delay to ensure all resources are properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SphereLoadingScreen 
        loadingText="SPHERE oS"
        message="QUANTUM SYNC IN PROGRESS"
        showPreview={true}
      />
    );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <SUISProvider supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
            <AppModeProvider>
              <DashboardDataProvider>
                <CssBaseline />
                <BrowserRouter>
              <Routes>
                {/* Luxury Landing Page - default for non-authenticated users */}
                <Route path="/welcome" element={
                  <Suspense fallback={<SphereLoadingScreen loadingText="SPHERE OS" message="INITIALIZING QUANTUM INTERFACE" />}>
                    <LuxuryLandingWrapper />
                  </Suspense>
                } />
                
                {/* Auth Routes - still available but not required */}
                <Route path="/login" element={<SimpleLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Public Ripple Route - no layout needed */}
                <Route path="/ripple/:rippleToken" element={<Suspense fallback={<SphereLoadingScreen loadingText="RIPPLE" message="LOADING PERSONALIZED CONTENT" />}><RipplePage /></Suspense>} />
                
                {/* All Routes - now with public access to full CRM */}
                <Route path="/" element={
                  <AuthGuard
                    allowPublic={true}
                    fallback={
                      <SphereLoadingScreen 
                        loadingText="SPHERE oS"
                        message="INITIALIZING CRM SYSTEMS"
                      />
                    }
                  >
                    <Layout />
                  </AuthGuard>
                }>
                <Route index element={<Dashboard />} />
                <Route path="relationships" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="SMART CRM" message="INITIALIZING AI INTELLIGENCE" />}><SmartCRM /></React.Suspense>} />
                <Route path="contacts" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="CONTACTS" message="NEURAL DATABASE SYNC" />}><Contacts /></React.Suspense>} />
                <Route path="contacts/:id" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="PROFILE" message="EXTRACTING DATA MATRIX" />}><ContactDetail /></React.Suspense>} />
                <Route path="practices" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="PRACTICES" message="MAPPING NEURAL NETWORKS" />}><Practices /></React.Suspense>} />
                <Route path="analytics" element={<Suspense fallback={<SphereLoadingScreen loadingText="ANALYTICS" message="PROCESSING QUANTUM DATA" />}><Analytics /></Suspense>} />
                <Route path="rep-analytics" element={<Suspense fallback={<SphereLoadingScreen loadingText="REP MATRIX" message="ANALYZING PERFORMANCE VECTORS" />}><RepAnalytics /></Suspense>} />
                <Route path="rep-analytics/:insightId" element={<Suspense fallback={<SphereLoadingScreen loadingText="INSIGHTS" message="DECODING CONVERSATION PATTERNS" />}><CallInsightDetail /></Suspense>} />
                <Route path="research" element={<Suspense fallback={<div>Loading...</div>}><Research /></Suspense>} />
                <Route path="content" element={<Suspense fallback={<div>Loading...</div>}><PromptManagement /></Suspense>} />
                <Route path="call-analysis" element={<Suspense fallback={<div>Loading...</div>}><CallAnalysis /></Suspense>} />
                <Route path="market" element={<div>Market Intelligence (Coming Soon)</div>} />
                <Route path="market/dental-implants" element={<React.Suspense fallback={<div>Loading...</div>}><DentalImplantMarketDashboard /></React.Suspense>} />
                <Route path="market/practice-interaction" element={<React.Suspense fallback={<div>Loading...</div>}><PracticeInteractionTracker /></React.Suspense>} />
                <Route path="market/aesthetic" element={<React.Suspense fallback={<div>Loading...</div>}><AestheticMarketDashboard /></React.Suspense>} />
                <Route path="knowledge" element={<Suspense fallback={<div>Loading...</div>}><KnowledgeAcademy /></Suspense>} />
                <Route path="knowledge/dental" element={<Suspense fallback={<div>Loading...</div>}><KnowledgeDental /></Suspense>} />
                <Route path="knowledge/aesthetic" element={<Suspense fallback={<div>Loading...</div>}><KnowledgeAesthetic /></Suspense>} />
                <Route path="dental" element={<div>Dental Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="aesthetic" element={<div>Aesthetic Procedures Knowledge Base (Coming Soon)</div>} />
                <Route path="companies" element={<div>Companies Database (Coming Soon)</div>} />
                <Route path="subscribe" element={<Suspense fallback={<div>Loading...</div>}><Subscribe /></Suspense>} />
                <Route path="subscribe/success" element={<Suspense fallback={<div>Loading...</div>}><SubscribeSuccess /></Suspense>} />
                <Route path="subscribe/cancel" element={<Suspense fallback={<div>Loading...</div>}><SubscribeCancel /></Suspense>} />
                <Route path="settings" element={<Suspense fallback={<StandaloneEliteLoadingScreen loadingText="Loading Settings" message="Preparing your preferences..." />}><Settings /></Suspense>} />
                <Route path="profile" element={<Suspense fallback={<StandaloneEliteLoadingScreen loadingText="Loading Profile" message="Retrieving your profile..." />}><Profile /></Suspense>} />
                
                {/* SUIS Intelligence Routes */}
                <Route path="intelligence" element={<Suspense fallback={<SphereLoadingScreen loadingText="INTELLIGENCE" message="INITIALIZING UNIFIED SYSTEM" />}><IntelligenceDashboard /></Suspense>} />
                <Route path="intelligence/setup" element={<Suspense fallback={<SphereLoadingScreen loadingText="PROFILE SETUP" message="PREPARING INTELLIGENCE PROFILE" />}><IntelligenceProfileSetup /></Suspense>} />
                <Route path="intelligence/demo" element={<Suspense fallback={<SphereLoadingScreen loadingText="SUIS DEMO" message="LOADING DEMONSTRATION" />}><SUISDemo /></Suspense>} />
                <Route path="intelligence/contacts" element={<Suspense fallback={<SphereLoadingScreen loadingText="CONTACT UNIVERSE" message="MAPPING NEURAL CONNECTIONS" />}><ContactUniverse /></Suspense>} />
                <Route path="intelligence/content" element={<Suspense fallback={<SphereLoadingScreen loadingText="CONTENT GENERATOR" message="ACTIVATING AI ENGINE" />}><ContentGenerator /></Suspense>} />
                <Route path="intelligence/research" element={<Suspense fallback={<SphereLoadingScreen loadingText="RESEARCH LAB" message="INITIALIZING AI RESEARCH" />}><ResearchLab /></Suspense>} />
                <Route path="intelligence/market" element={<Suspense fallback={<SphereLoadingScreen loadingText="MARKET INTELLIGENCE" message="ANALYZING MARKET SIGNALS" />}><MarketIntelligenceFeed /></Suspense>} />
                <Route path="intelligence/learning" element={<Suspense fallback={<SphereLoadingScreen loadingText="LEARNING PATHWAY" message="PERSONALIZING CURRICULUM" />}><LearningPathway /></Suspense>} />
                <Route path="intelligence/calls" element={<Suspense fallback={<SphereLoadingScreen loadingText="CALL COACH" message="PREPARING CALL ANALYSIS" />}><CallAnalysis /></Suspense>} />
                <Route path="intelligence/growth" element={<Suspense fallback={<SphereLoadingScreen loadingText="GROWTH TRACKER" message="ANALYZING PROGRESS" />}><GrowthTracker /></Suspense>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            
            {/* Global Call Panel - Available on all authenticated pages */}
            <GlobalCallPanel />
            
            {/* App Mode Components */}
            <SubscriptionUpgradeModal />
            <FeatureUpgradeModal />
            <DemoModeIndicator />
          </BrowserRouter>
              </DashboardDataProvider>
            </AppModeProvider>
          </SUISProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
