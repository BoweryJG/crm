// SPHEREOS UNIFIED INTELLIGENCE SYSTEM (SUIS)
// Core Provider Component
// Version: 1.0.0

import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '../../auth/supabase';
import { 
  IntelligenceProfile, 
  MarketIntelligence, 
  UnifiedAnalytics, 
  ContactUniverse,
  ResearchQuery,
  GeneratedContent,
  CallIntelligence,
  SUISNotification,
  LearningPath,
  ThemeSystem,
  SUISConfig,
  APIResponse,
  SUISSubscription,
  InsightType,
  RecommendationType,
  EffortLevel,
  ImpactLevel,
  ContentType,
  PersonalizationLevel,
  TonePreference,
  DecisionLevel,
  ComplexityLevel,
  EmotionType,
  ContentLength,
  ApprovalStatus
} from '../types';
import type { Priority } from '../types';
import { getSUISAPIManager, checkAPIConfiguration } from '../services/suisConfigService';
import { handleSUISError, isCriticalError } from '../utils/suisErrorHandler';
import { generateAllSUISMockData } from '../../services/mockData/suisIntelligenceMockData';

// ==================================================================
// SUIS PROVIDER CONTEXT
// ==================================================================

interface SUISState {
  isInitialized: boolean;
  isDemo: boolean;
  user: any;
  intelligenceProfile: IntelligenceProfile | null;
  marketIntelligence: MarketIntelligence[];
  notifications: SUISNotification[];
  analytics: UnifiedAnalytics | null;
  theme: ThemeSystem;
  config: SUISConfig;
  loading: boolean;
  error: string | null;
  mockData?: ReturnType<typeof generateAllSUISMockData>;
}

interface SUISActions {
  initializeSystem: () => Promise<void>;
  updateIntelligenceProfile: (profile: Partial<IntelligenceProfile>) => Promise<void>;
  fetchMarketIntelligence: (filters?: any) => Promise<void>;
  generateContent: (params: any) => Promise<GeneratedContent>;
  analyzeCall: (callSid: string) => Promise<CallIntelligence>;
  performResearch: (query: string, context?: any) => Promise<ResearchQuery>;
  updateTheme: (theme: Partial<ThemeSystem>) => void;
  markNotificationRead: (notificationId: string) => Promise<void>;
  subscribeToRealtime: (subscription: SUISSubscription) => void;
  unsubscribeFromRealtime: (channel: string) => void;
}

type SUISAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_MOCK_DATA'; payload: ReturnType<typeof generateAllSUISMockData> }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_INTELLIGENCE_PROFILE'; payload: IntelligenceProfile }
  | { type: 'SET_MARKET_INTELLIGENCE'; payload: MarketIntelligence[] }
  | { type: 'ADD_NOTIFICATION'; payload: SUISNotification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<SUISNotification> } }
  | { type: 'SET_ANALYTICS'; payload: UnifiedAnalytics }
  | { type: 'UPDATE_THEME'; payload: Partial<ThemeSystem> };

const suisReducer = (state: SUISState, action: SUISAction): SUISState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_DEMO_MODE':
      return { ...state, isDemo: action.payload };
    case 'SET_MOCK_DATA':
      return { ...state, mockData: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_INTELLIGENCE_PROFILE':
      return { ...state, intelligenceProfile: action.payload };
    case 'SET_MARKET_INTELLIGENCE':
      return { ...state, marketIntelligence: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications].slice(0, 100) // Keep last 100
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
        )
      };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'UPDATE_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } };
    default:
      return state;
  }
};

const initialState: SUISState = {
  isInitialized: false,
  isDemo: false,
  user: null,
  intelligenceProfile: null,
  marketIntelligence: [],
  notifications: [],
  analytics: null,
  mockData: undefined,
  theme: {
    currentTheme: 'light',
    themes: {
      light: {
        name: 'Light',
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#10B981',
          background: '#FFFFFF',
          surface: '#F9FAFB',
          text: {
            primary: '#111827',
            secondary: '#6B7280',
            disabled: '#D1D5DB'
          },
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6'
          }
        },
        typography: {
          fontFamily: {
            primary: 'Inter, sans-serif',
            secondary: 'Inter, sans-serif',
            monospace: 'Monaco, monospace'
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            xxl: '1.5rem'
          },
          fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
          },
          lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75
          }
        },
        spacing: {
          scale: [0, 4, 8, 16, 24, 32, 48, 64, 96, 128],
          grid: 8,
          borderRadius: {
            none: 0,
            sm: 4,
            base: 8,
            lg: 12,
            full: 9999
          }
        },
        animations: {
          duration: {
            fast: 150,
            normal: 300,
            slow: 500
          },
          easing: {
            linear: 'linear',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out'
          },
          reducedMotion: false
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      },
      dark: {
        name: 'Dark',
        colors: {
          primary: '#60A5FA',
          secondary: '#9CA3AF',
          accent: '#34D399',
          background: '#111827',
          surface: '#1F2937',
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            disabled: '#6B7280'
          },
          status: {
            success: '#34D399',
            warning: '#FBBF24',
            error: '#F87171',
            info: '#60A5FA'
          }
        },
        typography: {
          fontFamily: {
            primary: 'Inter, sans-serif',
            secondary: 'Inter, sans-serif',
            monospace: 'Monaco, monospace'
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            xxl: '1.5rem'
          },
          fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
          },
          lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75
          }
        },
        spacing: {
          scale: [0, 4, 8, 16, 24, 32, 48, 64, 96, 128],
          grid: 8,
          borderRadius: {
            none: 0,
            sm: 4,
            base: 8,
            lg: 12,
            full: 9999
          }
        },
        animations: {
          duration: {
            fast: 150,
            normal: 300,
            slow: 500
          },
          easing: {
            linear: 'linear',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out'
          },
          reducedMotion: false
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          base: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }
      },
      highContrast: {
        name: 'High Contrast',
        colors: {
          primary: '#0000FF',
          secondary: '#000000',
          accent: '#00FF00',
          background: '#FFFFFF',
          surface: '#F0F0F0',
          text: {
            primary: '#000000',
            secondary: '#000000',
            disabled: '#808080'
          },
          status: {
            success: '#00FF00',
            warning: '#FFFF00',
            error: '#FF0000',
            info: '#0000FF'
          }
        },
        typography: {
          fontFamily: {
            primary: 'Inter, sans-serif',
            secondary: 'Inter, sans-serif',
            monospace: 'Monaco, monospace'
          },
          fontSize: {
            xs: '0.875rem',
            sm: '1rem',
            base: '1.125rem',
            lg: '1.25rem',
            xl: '1.375rem',
            xxl: '1.625rem'
          },
          fontWeight: {
            light: 400,
            normal: 500,
            medium: 600,
            semibold: 700,
            bold: 800
          },
          lineHeight: {
            tight: 1.375,
            normal: 1.625,
            relaxed: 1.875
          }
        },
        spacing: {
          scale: [0, 6, 12, 20, 28, 36, 52, 68, 100, 132],
          grid: 10,
          borderRadius: {
            none: 0,
            sm: 2,
            base: 4,
            lg: 8,
            full: 9999
          }
        },
        animations: {
          duration: {
            fast: 0,
            normal: 0,
            slow: 0
          },
          easing: {
            linear: 'linear',
            easeIn: 'linear',
            easeOut: 'linear',
            easeInOut: 'linear'
          },
          reducedMotion: true
        },
        shadows: {
          sm: '0 2px 4px 0 rgba(0, 0, 0, 1)',
          base: '0 2px 6px 0 rgba(0, 0, 0, 1)',
          lg: '0 4px 8px 0 rgba(0, 0, 0, 1)',
          xl: '0 6px 12px 0 rgba(0, 0, 0, 1)'
        }
      },
      custom: []
    },
    intelligentSwitching: {
      timeBasedAuto: false,
      environmentAware: false,
      userPreference: {
        preferred: 'light',
        autoSwitch: false,
        respectSystemPreference: true
      }
    },
    customizations: {
      userModifications: {},
      componentOverrides: {},
      savedCustomizations: []
    },
    accessibility: {
      highContrast: false,
      reduceMotion: false,
      increaseFontSize: 0,
      screenReaderOptimized: false,
      keyboardNavigation: true,
      colorBlindSupport: {
        enabled: false,
        type: 'protanopia',
        adjustments: {
          hueShift: 0,
          saturationBoost: 0,
          contrastIncrease: 0
        }
      }
    }
  },
  config: {
    apiEndpoints: {
      sphere1a: process.env.NEXT_PUBLIC_SPHERE1A_API_URL || '',
      openRouter: process.env.NEXT_PUBLIC_OPENROUTER_API_URL || '',
      twilio: process.env.NEXT_PUBLIC_TWILIO_API_URL || '',
      supabase: process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    },
    features: {
      realTimeIntelligence: true,
      predictiveAnalytics: true,
      contentGeneration: true,
      callAnalysis: true,
      marketIntelligence: true
    },
    performance: {
      cacheTimeout: 300000, // 5 minutes
      batchSize: 50,
      refreshInterval: 30000 // 30 seconds
    }
  },
  loading: false,
  error: null
};

const SUISContext = createContext<{
  state: SUISState;
  actions: SUISActions;
} | null>(null);

// ==================================================================
// SUIS PROVIDER COMPONENT
// ==================================================================

interface SUISProviderProps {
  children: React.ReactNode;
  supabaseUrl?: string; // Made optional since we're using the existing client
  supabaseAnonKey?: string; // Made optional since we're using the existing client
}

// Export SUISContext for use in hooks
export { SUISContext };

export const SUISProvider: React.FC<SUISProviderProps> = ({
  children,
  supabaseUrl,
  supabaseAnonKey
}) => {
  const [state, dispatch] = useReducer(suisReducer, initialState);
  const supabase = supabaseClient;
  const [realtimeChannels, setRealtimeChannels] = useState<Map<string, RealtimeChannel>>(new Map());

  // Initialize SUIS system
  const initializeSystem = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Check if we're in demo mode
      const isDemo = !user || !!userError;
      dispatch({ type: 'SET_DEMO_MODE', payload: isDemo });
      
      if (isDemo) {
        console.info('SUIS: Running in demo mode with mock data');
        
        // Generate and set mock data for demo mode
        const mockData = generateAllSUISMockData();
        dispatch({ type: 'SET_MOCK_DATA', payload: mockData });
        
        // Mock data is already set via SET_MOCK_DATA above
        
        // Add some mock notifications
        const mockNotifications: SUISNotification[] = [
          {
            id: 'demo-1',
            userId: 'demo',
            notificationType: 'insight',
            priority: 'high',
            title: 'New High-Value Contact Identified',
            content: {
              summary: 'AI analysis identified Dr. Sarah Chen as a high-potential prosthodontist',
              details: 'Based on recent market activity and practice growth patterns'
            },
            contextData: { contactId: 'contact-1' },
            actionRequired: true,
            actionItems: [
              {
                id: 'action-1',
                label: 'View Contact',
                actionType: 'navigate',
                url: '/contacts/contact-1',
                primary: true
              }
            ],
            deliveryMethod: 'in_app',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-2',
            userId: 'demo',
            notificationType: 'alert',
            priority: 'medium',
            title: 'Content Performance Alert',
            content: {
              summary: 'Your latest email campaign achieved 43% higher open rates',
              details: 'Campaign: Q1 Implant Promotion'
            },
            contextData: { campaignId: 'campaign-1' },
            actionRequired: false,
            actionItems: [
              {
                id: 'action-2',
                label: 'View Analytics',
                actionType: 'navigate',
                url: '/analytics/campaigns/campaign-1',
                primary: false
              }
            ],
            deliveryMethod: 'in_app',
            createdAt: new Date().toISOString()
          }
        ];
        mockNotifications.forEach(notif => {
          dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
        });
        
        // Set up demo analytics
        const demoAnalytics: UnifiedAnalytics = {
          id: 'demo-analytics-1',
          userId: 'demo',
          analyticsType: 'rep_performance',
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          periodEnd: new Date().toISOString(),
          metrics: {
            sales: {
              revenue: 452000,
              deals: 18,
              averageDealSize: 25111,
              conversionRate: 0.32,
              salesCycle: 45,
              pipelineValue: 875000
            },
            activity: {
              calls: 142,
              emails: 384,
              meetings: 56,
              demos: 23,
              proposals: 12,
              followUps: 89
            },
            engagement: {
              responseRate: 0.42,
              meetingAcceptanceRate: 0.68,
              contentEngagement: 0.35,
              socialInteractions: 89,
              referrals: 12
            },
            performance: {
              conversionRate: 0.32,
              averageDealSize: 25111,
              salesCycleLength: 45,
              winRate: 0.28,
              activityLevel: 0.85,
              engagementScore: 0.72
            }
          },
          insights: mockData.insights.slice(0, 5).map(i => ({
            type: i.type as InsightType,
            title: i.title,
            description: i.description,
            data: { impact: i.impact, aiGenerated: i.aiGenerated },
            confidence: i.impact / 10,
            actionable: true,
            priority: i.priority as Priority
          })),
          benchmarks: {
            industry: {
              revenue: 425000,
              deals: 15,
              conversionRate: 0.28,
              engagementRate: 0.38
            },
            company: {
              revenue: 452000,
              deals: 18,
              conversionRate: 0.32,
              engagementRate: 0.42
            },
            peer: {
              revenue: 485000,
              deals: 20,
              conversionRate: 0.35,
              engagementRate: 0.45
            },
            historical: {
              revenue: 380000,
              deals: 14,
              conversionRate: 0.25,
              engagementRate: 0.35
            }
          },
          predictions: {
            shortTerm: {
              timeframe: '30 days',
              predictions: [
                { metric: 'revenue', predictedValue: 498000, confidence: 0.78, factors: ['strong pipeline', 'new product launch'] },
                { metric: 'deals', predictedValue: 20, confidence: 0.82, factors: ['increased activity', 'market growth'] }
              ]
            },
            mediumTerm: {
              timeframe: '90 days',
              predictions: [
                { metric: 'revenue', predictedValue: 580000, confidence: 0.72, factors: ['Q2 expansion', 'seasonal demand'] },
                { metric: 'deals', predictedValue: 24, confidence: 0.75, factors: ['territory growth', 'improved conversion'] }
              ]
            },
            longTerm: {
              timeframe: '180 days',
              predictions: [
                { metric: 'revenue', predictedValue: 720000, confidence: 0.65, factors: ['market trends', 'competitive position'] },
                { metric: 'deals', predictedValue: 30, confidence: 0.68, factors: ['account expansion', 'new territories'] }
              ]
            }
          },
          recommendations: [
            {
              id: 'rec-1',
              type: 'strategic' as RecommendationType,
              title: 'Focus on high-value prosthodontic accounts',
              description: 'Target accounts with higher revenue potential in prosthodontics',
              priority: 'high' as Priority,
              effort: 'medium' as EffortLevel,
              expectedImpact: 'high' as ImpactLevel,
              timeframe: '30 days',
              actions: [],
              relatedInsights: []
            },
            {
              id: 'rec-2',
              type: 'operational' as RecommendationType,
              title: 'Increase digital engagement by 25%',
              description: 'Boost online presence and digital touchpoints with clients',
              priority: 'medium' as Priority,
              effort: 'low' as EffortLevel,
              expectedImpact: 'medium' as ImpactLevel,
              timeframe: '60 days',
              actions: [],
              relatedInsights: []
            },
            {
              id: 'rec-3',
              type: 'tactical' as RecommendationType,
              title: 'Schedule more product demonstrations',
              description: 'Increase hands-on product demos to improve conversion rates',
              priority: 'high' as Priority,
              effort: 'medium' as EffortLevel,
              expectedImpact: 'high' as ImpactLevel,
              timeframe: '14 days',
              actions: [],
              relatedInsights: []
            }
          ],
          dataSources: ['supabase', 'sphere1a', 'twilio'],
          calculationMetadata: {
            algorithm: 'v2.1',
            lastCalculated: new Date().toISOString(),
            dataPoints: 48392,
            confidence: 0.89
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        dispatch({ type: 'SET_ANALYTICS', payload: demoAnalytics });
      } else if (user) {
        dispatch({ type: 'SET_USER', payload: user });

        // Fetch intelligence profile with better error handling
        try {
          const { data: profile, error: profileError } = await supabase
            .from('suis_intelligence_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            dispatch({ type: 'SET_INTELLIGENCE_PROFILE', payload: profile });
          } else if (!profileError || profileError.code === 'PGRST116') {
            // Create default profile if none exists
            const defaultProfile: Partial<IntelligenceProfile> = {
              userId: user.id,
              profileType: 'rep',
              specializations: [],
            territoryIds: [],
            goals: {
              salesTargets: { monthly: 0, quarterly: 0, annual: 0 },
              procedureFocus: [],
              territoryExpansion: false,
              skillDevelopment: [],
              clientRetention: 0
            },
            preferences: {
              notificationFrequency: 'real_time',
              insightDepth: 'detailed',
              automationLevel: 'assisted',
              communicationStyle: 'formal',
              dashboardLayout: {
                layout: 'grid',
                widgets: [],
                customizations: {
                  autoArrange: true,
                  compactMode: false,
                  gridSize: 12,
                  padding: 16,
                  allowOverlap: false
                },
                responsiveBreakpoints: {
                  xs: 480,
                  sm: 768,
                  md: 1024,
                  lg: 1280,
                  xl: 1920
                }
              }
            }
          };

          // Convert camelCase to snake_case for database insert
          const dbProfile = {
            user_id: defaultProfile.userId,
            profile_type: defaultProfile.profileType,
            specializations: defaultProfile.specializations,
            territory_ids: defaultProfile.territoryIds,
            goals: defaultProfile.goals,
            preferences: defaultProfile.preferences,
            ai_settings: defaultProfile.aiSettings,
            performance_baseline: defaultProfile.performanceBaseline
          };

          const { data: newProfile, error: createError } = await supabase
            .from('suis_intelligence_profiles')
            .insert(dbProfile)
            .select()
            .single();

          if (createError) throw createError;
          dispatch({ type: 'SET_INTELLIGENCE_PROFILE', payload: newProfile });
        }
        } catch (profileFetchError) {
          const suisError = handleSUISError(profileFetchError, 'initializeSystem.profile');
          if (suisError && isCriticalError(suisError)) {
            throw new Error(suisError.message);
          }
          // Continue with system initialization for non-critical errors
          console.info('SUIS: Continuing without user profile');
        }

        // Fetch initial market intelligence
        await fetchMarketIntelligence();

        // Fetch unread notifications
        const { data: notifications, error: notifError } = await supabase
          .from('suis_notifications')
          .select('*')
          .eq('user_id', user.id)
          .is('read_at', null)
          .order('created_at', { ascending: false })
          .limit(100);

        if (notifications && !notifError) {
          notifications.forEach(notif => {
            dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
          });
        }

        // Set up real-time subscriptions
        setupRealtimeSubscriptions(user.id);
      }

      // Mark as initialized even without user (demo mode)
      dispatch({ type: 'SET_INITIALIZED', payload: true });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to initialize SUIS:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, [supabase]);

  // Fetch market intelligence
  const fetchMarketIntelligence = useCallback(async (filters?: any) => {
    try {
      let query = supabase
        .from('suis_market_intelligence')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters?.specialty) {
        query = query.eq('specialty', filters.specialty);
      }

      if (filters?.territoryId) {
        query = query.eq('territory_id', filters.territoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      dispatch({ type: 'SET_MARKET_INTELLIGENCE', payload: data || [] });
    } catch (error) {
      console.error('Failed to fetch market intelligence:', error);
    }
  }, [supabase]);

  // Update intelligence profile
  const updateIntelligenceProfile = useCallback(async (updates: Partial<IntelligenceProfile>) => {
    try {
      if (state.isDemo) {
        // In demo mode, just update local state
        console.info('SUIS: Demo mode - profile update simulated');
        return;
      }
      
      if (!state.user || !state.intelligenceProfile) return;

      const { data, error } = await supabase
        .from('suis_intelligence_profiles')
        .update(updates)
        .eq('user_id', state.user.id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'SET_INTELLIGENCE_PROFILE', payload: data });
    } catch (error) {
      console.error('Failed to update intelligence profile:', error);
      throw error;
    }
  }, [supabase, state.user, state.intelligenceProfile, state.isDemo]);

  // Generate content
  const generateContent = useCallback(async (params: any): Promise<GeneratedContent> => {
    try {
      if (state.isDemo) {
        // Return mock generated content for demo mode
        const templates = state.mockData?.contentTemplates || [];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return {
          id: `demo-content-${Date.now()}`,
          userId: 'demo',
          contentType: (params.type || 'email') as ContentType,
          targetAudience: {
            demographics: {
              ageRange: '35-55',
              location: 'United States'
            },
            professionalProfile: {
              title: 'Dental Practitioner',
              industry: params.specialty || 'dental',
              experience: '10+ years',
              companySize: 'medium',
              decisionLevel: 'decision_maker' as DecisionLevel
            },
            interests: ['new technology', 'patient outcomes', 'efficiency'],
            painPoints: ['time management', 'patient acquisition', 'technology adoption'],
            preferredTone: 'professional' as TonePreference
          },
          procedureFocus: params.procedure || 'implants',
          contentData: {
            subject: `Demo ${params.type || 'email'} Content`,
            body: `This is a demo generated ${params.type || 'email'} content based on your request. In the full version, AI will generate personalized content tailored to your specific needs.`,
            metadata: {
              wordCount: 50,
              readingTime: 1,
              sentiment: {
                overall: 0.8,
                bySegment: [],
                emotions: [
                  { emotion: 'joy' as EmotionType, score: 0.9, confidence: 0.85 },
                  { emotion: 'trust' as EmotionType, score: 0.8, confidence: 0.82 }
                ],
                confidence: 0.85
              },
              keywords: ['demo', 'medical device', 'sales'],
              tone: params.tone || 'professional',
              complexity: 'moderate' as ComplexityLevel
            },
            variants: []
          },
          generationParameters: {
            tone: params.tone || 'professional',
            length: (params.length || 'medium') as ContentLength,
            includeCallToAction: true,
            personalizations: ['company_name', 'contact_name', 'specialty'],
            templateId: template?.id || 'demo-template-1',
            customInstructions: 'Demo mode content generation'
          },
          aiModelUsed: 'Demo AI',
          personalizationLevel: 'medium' as PersonalizationLevel,
          performanceMetrics: {
            deliveryRate: 0.98,
            openRate: 0.25,
            clickRate: 0.12,
            responseRate: 0.08,
            conversionRate: 0.05,
            engagementScore: 0.68,
            sharingRate: 0.02
          },
          version: 1,
          approvalStatus: 'approved' as ApprovalStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      const { suisService } = await import('../services/suisService');
      return await suisService.generateContent({
        ...params,
        userId: state.user?.id
      });
    } catch (error) {
      console.error('Failed to generate content:', error);
      throw error;
    }
  }, [state.user, state.isDemo, state.mockData]);

  // Analyze call
  const analyzeCall = useCallback(async (callSid: string): Promise<CallIntelligence> => {
    try {
      const { suisService } = await import('../services/suisService');
      return await suisService.analyzeCall(callSid);
    } catch (error) {
      console.error('Failed to analyze call:', error);
      throw error;
    }
  }, []);

  // Perform research
  const performResearch = useCallback(async (query: string, context?: any): Promise<ResearchQuery> => {
    try {
      const { suisService } = await import('../services/suisService');
      return await suisService.performResearch(query, {
        ...context,
        userId: state.user?.id
      });
    } catch (error) {
      console.error('Failed to perform research:', error);
      throw error;
    }
  }, [state.user]);

  // Update theme
  const updateTheme = useCallback((theme: Partial<ThemeSystem>) => {
    dispatch({ type: 'UPDATE_THEME', payload: theme });
    
    // Apply theme to DOM
    if (theme.currentTheme) {
      document.documentElement.setAttribute('data-theme', theme.currentTheme);
    }
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('suis_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: notificationId,
          updates: { readAt: new Date().toISOString() }
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }, [supabase]);

  // Set up real-time subscriptions
  const setupRealtimeSubscriptions = useCallback((userId: string) => {
    // Subscribe to notifications
    const notificationChannel = supabase
      .channel('user-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'suis_notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: payload.new as SUISNotification });
      })
      .subscribe();

    setRealtimeChannels(prev => new Map(prev).set('user-notifications', notificationChannel));

    // Subscribe to market intelligence updates
    const marketIntelChannel = supabase
      .channel('market-intelligence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'suis_market_intelligence'
      }, () => {
        // Refetch market intelligence when updates occur
        fetchMarketIntelligence();
      })
      .subscribe();

    setRealtimeChannels(prev => new Map(prev).set('market-intelligence', marketIntelChannel));
  }, [supabase, fetchMarketIntelligence]);

  // Subscribe to custom realtime events
  const subscribeToRealtime = useCallback((subscription: SUISSubscription) => {
    const channel = supabase
      .channel(subscription.channel)
      .on('postgres_changes' as any, {
        event: subscription.event,
        schema: 'public',
        table: subscription.channel,
        filter: subscription.filter
      }, subscription.callback)
      .subscribe();

    setRealtimeChannels(prev => new Map(prev).set(subscription.channel, channel));
  }, [supabase]);

  // Unsubscribe from realtime channel
  const unsubscribeFromRealtime = useCallback((channelName: string) => {
    const channel = realtimeChannels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      setRealtimeChannels(prev => {
        const newChannels = new Map(prev);
        newChannels.delete(channelName);
        return newChannels;
      });
    }
  }, [supabase, realtimeChannels]);

  // Initialize on mount
  useEffect(() => {
    initializeSystem();

    // Cleanup on unmount
    return () => {
      realtimeChannels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  // Create actions object
  const actions = useMemo<SUISActions>(() => ({
    initializeSystem,
    updateIntelligenceProfile,
    fetchMarketIntelligence,
    generateContent,
    analyzeCall,
    performResearch,
    updateTheme,
    markNotificationRead,
    subscribeToRealtime,
    unsubscribeFromRealtime
  }), [
    initializeSystem,
    updateIntelligenceProfile,
    fetchMarketIntelligence,
    generateContent,
    analyzeCall,
    performResearch,
    updateTheme,
    markNotificationRead,
    subscribeToRealtime,
    unsubscribeFromRealtime
  ]);

  return (
    <SUISContext.Provider value={{ state, actions }}>
      {children}
    </SUISContext.Provider>
  );
};

// ==================================================================
// SUIS HOOK
// ==================================================================

export const useSUIS = () => {
  const context = useContext(SUISContext);
  if (!context) {
    throw new Error('useSUIS must be used within SUISProvider');
  }
  return context;
};

export default SUISProvider;