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
import { NotificationProvider } from './contexts/NotificationContext';
import { cleanupPerformance, isLowPerformanceDevice } from './utils/performance';
import { SUISProvider } from './suis';
import { logger } from './utils/logger';
import { initSentry, Sentry } from './utils/sentry';
import { SoundProvider } from './contexts/SoundContext';
import { EmailProvider } from './hooks/useEmailClient';
import SphereLoadingScreen from './components/common/SphereLoadingScreen';
import PremiumLoadingScreen from './components/common/PremiumLoadingScreen';
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
const MarketAnalytics = lazy(() => import('./pages/MarketAnalytics'));
const CallInsightDetail = lazy(() => import('./pages/CallInsightDetail'));
const CallAnalytics = lazy(() => import('./pages/CallAnalytics'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const SubscribeSuccess = lazy(() => import('./pages/SubscribeSuccess'));
const SubscribeCancel = lazy(() => import('./pages/SubscribeCancel'));
const KnowledgeAcademy = lazy(() => import('./pages/KnowledgeAcademy'));
const KnowledgeDental = lazy(() => import('./pages/KnowledgeDental'));
const KnowledgeAesthetic = lazy(() => import('./pages/KnowledgeAesthetic'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const GmailAuthCallback = lazy(() => import('./pages/GmailAuthCallback'));
const RipplePage = lazy(() => import('./pages/RipplePage'));
const CommandRoom = lazy(() => import('./pages/CommandRoom'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const CallVaultPage = lazy(() => import('./pages/CallVaultPage'));
const MobileTest = lazy(() => import('./pages/MobileTest'));
const Metrics = lazy(() => import('./pages/Metrics'));
const CallCenter = lazy(() => import('./pages/CallCenter'));
const Automations = lazy(() => import('./pages/Automations'));

// Intelligence Hub Modules
const StrategicCanvas = lazy(() => import('./modules/intelligence/components/StrategicCanvasMobile'));
const ContentForge = lazy(() => import('./modules/intelligence/components/ContentForge'));
const ResearchLab = lazy(() => import('./modules/intelligence/components/ResearchLab'));
const GrowthForge = lazy(() => import('./modules/intelligence/components/GrowthForge'));
const KnowledgeAcademyHub = lazy(() => import('./modules/intelligence/components/KnowledgeAcademy'));

// SUIS Components
const SUISDemo = lazy(() => import('./components/demo/SUISDemo'));
const IntelligenceDashboard = lazy(() => import('./suis/components/IntelligenceDashboard'));
const IntelligenceProfileSetup = lazy(() => import('./suis/components/IntelligenceProfileSetup'));
const ContactUniverse = lazy(() => import('./suis/components/ContactUniverse'));
const ContentGenerator = lazy(() => import('./suis/components/ContentGenerator'));
const ResearchAssistant = lazy(() => import('./suis/components/ResearchAssistant'));
const MarketIntelligenceFeed = lazy(() => import('./suis/components/MarketIntelligenceFeed'));
const LearningPathway = lazy(() => import('./suis/components/LearningPathway'));


// Initialize Sentry on app start
initSentry();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Get Supabase configuration
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
  }

  useEffect(() => {
    // Check for performance issues
    if (isLowPerformanceDevice()) {
      cleanupPerformance();
      logger.info('Performance mode activated - animations disabled');
    }
    
    // Premium loading experience with minimum duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLowPerformanceDevice() ? 1500 : 3500); // Reduced for low performance devices
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PremiumLoadingScreen 
        loadingText="REPSPHERES"
        message="Crafting your experience"
        minimumDuration={3500}
      />
    );
  }

  return (
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <AuthProvider>
            <EmailProvider>
              <SUISProvider supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
                  <AppModeProvider>
                  <NotificationProvider>
                    <DashboardDataProvider>
                      <CssBaseline />
                    <BrowserRouter>
              <Routes>
                {/* Luxury Landing Page - default for non-authenticated users */}
                <Route path="/welcome" element={
                  <Suspense fallback={<PremiumLoadingScreen loadingText="REPSPHERES" message="Preparing luxury experience" minimumDuration={2000} />}>
                    <LuxuryLandingWrapper />
                  </Suspense>
                } />
                
                {/* Auth Routes - still available but not required */}
                <Route path="/login" element={<SimpleLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/google/callback" element={<Suspense fallback={<SphereLoadingScreen loadingText="GMAIL AUTH" message="COMPLETING AUTHENTICATION" />}><GmailAuthCallback /></Suspense>} />
                
                {/* Public Ripple Route - no layout needed */}
                <Route path="/ripple/:rippleToken" element={<Suspense fallback={<SphereLoadingScreen loadingText="RIPPLE" message="LOADING PERSONALIZED CONTENT" />}><RipplePage /></Suspense>} />
                
                {/* All Routes - now with public access to full CRM */}
                <Route path="/" element={
                  <AuthGuard
                    allowPublic={true}
                    fallback={
                      <PremiumLoadingScreen 
                        loadingText="REPSPHERES"
                        message="Initializing systems"
                        minimumDuration={1000}
                      />
                    }
                  >
                    <Layout />
                  </AuthGuard>
                }>
                <Route index element={<Dashboard />} />
                <Route path="command-room" element={<Suspense fallback={<PremiumLoadingScreen loadingText="GALLERY" message="Curating your dominance" minimumDuration={2500} />}><CommandRoom /></Suspense>} />
                <Route path="command-center" element={<Suspense fallback={<PremiumLoadingScreen loadingText="COMMAND CENTER" message="Initializing control systems" minimumDuration={2500} />}><CommandCenter /></Suspense>} />
                <Route path="metrics" element={<Suspense fallback={<PremiumLoadingScreen loadingText="METRICS" message="Loading performance data" minimumDuration={2500} />}><Metrics /></Suspense>} />
                <Route path="call-center" element={<Suspense fallback={<PremiumLoadingScreen loadingText="CALL CENTER" message="Initializing communication hub" minimumDuration={2500} />}><CallCenter /></Suspense>} />
                <Route path="automations" element={<Suspense fallback={<PremiumLoadingScreen loadingText="AUTOMATIONS" message="Loading intelligent workflows" minimumDuration={2500} />}><Automations /></Suspense>} />
                <Route path="relationships" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="SMART CRM" message="INITIALIZING AI INTELLIGENCE" />}><SmartCRM /></React.Suspense>} />
                <Route path="contacts" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="CONTACTS" message="NEURAL DATABASE SYNC" />}><Contacts /></React.Suspense>} />
                <Route path="contacts/:id" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="PROFILE" message="EXTRACTING DATA MATRIX" />}><ContactDetail /></React.Suspense>} />
                <Route path="practices" element={<React.Suspense fallback={<SphereLoadingScreen loadingText="PRACTICES" message="MAPPING NEURAL NETWORKS" />}><Practices /></React.Suspense>} />
                <Route path="analytics" element={<Suspense fallback={<SphereLoadingScreen loadingText="ANALYTICS" message="PROCESSING QUANTUM DATA" />}><Analytics /></Suspense>} />
                <Route path="analytics/rep" element={<Suspense fallback={<SphereLoadingScreen loadingText="REP MATRIX" message="ANALYZING PERFORMANCE VECTORS" />}><RepAnalytics /></Suspense>} />
                <Route path="analytics/market" element={<Suspense fallback={<SphereLoadingScreen loadingText="MARKET INTEL" message="SCANNING MARKET DYNAMICS" />}><MarketAnalytics /></Suspense>} />
                <Route path="rep-analytics" element={<Suspense fallback={<SphereLoadingScreen loadingText="REP MATRIX" message="ANALYZING PERFORMANCE VECTORS" />}><RepAnalytics /></Suspense>} />
                <Route path="rep-analytics/:insightId" element={<Suspense fallback={<SphereLoadingScreen loadingText="INSIGHTS" message="DECODING CONVERSATION PATTERNS" />}><CallInsightDetail /></Suspense>} />
                <Route path="research" element={<Suspense fallback={<div>Loading...</div>}><Research /></Suspense>} />
                <Route path="content" element={<Suspense fallback={<div>Loading...</div>}><PromptManagement /></Suspense>} />
                <Route path="call-analytics" element={<Suspense fallback={<PremiumLoadingScreen loadingText="CALL ANALYTICS" message="Analyzing communication patterns" minimumDuration={2500} />}><CallAnalytics /></Suspense>} />
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
                <Route path="intelligence/canvas" element={<Suspense fallback={<SphereLoadingScreen loadingText="STRATEGIC CANVAS" message="INITIALIZING STRATEGY ENGINE" />}><StrategicCanvas /></Suspense>} />
                <Route path="intelligence/content" element={<Suspense fallback={<SphereLoadingScreen loadingText="CONTENT FORGE" message="PREPARING WORKSHOP" />}><ContentForge /></Suspense>} />
                <Route path="intelligence/research" element={<Suspense fallback={<SphereLoadingScreen loadingText="RESEARCH LAB" message="INITIALIZING AI RESEARCH" />}><ResearchLab /></Suspense>} />
                <Route path="intelligence/growth" element={<Suspense fallback={<SphereLoadingScreen loadingText="GROWTH FORGE" message="POWERING UP FITNESS TRACKER" />}><GrowthForge /></Suspense>} />
                <Route path="intelligence/academy" element={<Suspense fallback={<SphereLoadingScreen loadingText="KNOWLEDGE ACADEMY" message="PREPARING LEARNING LAB" />}><KnowledgeAcademyHub /></Suspense>} />
                <Route path="intelligence/contacts" element={<Suspense fallback={<SphereLoadingScreen loadingText="CONTACT UNIVERSE" message="MAPPING NEURAL CONNECTIONS" />}><ContactUniverse /></Suspense>} />
                <Route path="intelligence/market" element={<Suspense fallback={<SphereLoadingScreen loadingText="MARKET INTELLIGENCE" message="ANALYZING MARKET SIGNALS" />}><MarketIntelligenceFeed /></Suspense>} />
                <Route path="intelligence/learning" element={<Suspense fallback={<SphereLoadingScreen loadingText="LEARNING PATHWAY" message="PERSONALIZING CURRICULUM" />}><LearningPathway /></Suspense>} />
                <Route path="intelligence/calls" element={<Suspense fallback={<SphereLoadingScreen loadingText="CALL COACH" message="PREPARING CALL ANALYSIS" />}><CallAnalytics /></Suspense>} />
                
                {/* Agent Management Routes */}
                
                {/* Operations Routes */}
                <Route path="operations/call-vault" element={<Suspense fallback={<SphereLoadingScreen loadingText="CALL VAULT" message="LOADING ARCHIVE SYSTEM" />}><CallVaultPage /></Suspense>} />
                
                {/* Mobile Test Route */}
                <Route path="mobile-test" element={<Suspense fallback={<div>Loading Mobile Test...</div>}><MobileTest /></Suspense>} />
                
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
                  </NotificationProvider>
                </AppModeProvider>
              </SUISProvider>
            </EmailProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  );
};

export default App;
