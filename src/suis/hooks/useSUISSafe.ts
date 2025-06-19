import { useContext } from 'react';
import { SUISContext } from '../components/SUISProvider';
import { generateAllSUISMockData } from '../../services/mockData/suisIntelligenceMockData';

/**
 * Safe version of useSUIS hook that returns default/mock state instead of throwing errors
 * Use this in components that need to work without SUISProvider
 */
export const useSUISSafe = () => {
  const context = useContext(SUISContext);
  
  // If context exists, return it normally
  if (context) {
    return context;
  }
  
  // Otherwise return a mock/default state
  const mockData = generateAllSUISMockData();
  
  return {
    state: {
      isInitialized: true,
      isDemo: true,
      user: null,
      intelligenceProfile: null,
      marketIntelligence: mockData.marketIntelligence,
      notifications: [],
      analytics: {
        userId: 'demo',
        period: 'monthly',
        metrics: {
          totalContacts: mockData.contacts.length,
          activeEngagements: mockData.contacts.filter(c => c.engagementScore > 70).length,
          contentGenerated: mockData.contentTemplates.length,
          researchProjects: mockData.researchProjects.length,
          callsAnalyzed: 47,
          marketInsights: mockData.marketIntelligence.length,
          learningProgress: 78,
          aiAccuracy: 92
        },
        trends: {
          contactGrowth: 12.5,
          engagementRate: 8.3,
          contentPerformance: 15.7,
          researchROI: 245,
          callConversion: 34.2,
          marketShare: 5.8,
          learningCompletion: 89,
          aiOptimization: 18.9
        },
        insights: mockData.insights.slice(0, 5),
        lastUpdated: new Date().toISOString()
      },
      theme: {
        currentTheme: 'light',
        themes: {
          light: {},
          dark: {},
          highContrast: {},
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
          sphere1a: '',
          openRouter: '',
          twilio: '',
          supabase: ''
        },
        features: {
          realTimeIntelligence: true,
          predictiveAnalytics: true,
          contentGeneration: true,
          callAnalysis: true,
          marketIntelligence: true
        },
        performance: {
          cacheTimeout: 300000,
          batchSize: 50,
          refreshInterval: 30000
        }
      },
      loading: false,
      error: null,
      mockData
    },
    actions: {
      initializeSystem: async () => { console.log('Demo mode: initializeSystem'); },
      updateIntelligenceProfile: async () => { console.log('Demo mode: updateIntelligenceProfile'); },
      fetchMarketIntelligence: async () => { console.log('Demo mode: fetchMarketIntelligence'); },
      generateContent: async (params: any) => ({
        id: `demo-content-${Date.now()}`,
        type: params.type || 'email',
        content: `This is a demo generated ${params.type || 'email'} content.`,
        metadata: {
          template: 'Demo Template',
          tone: params.tone || 'professional',
          length: params.length || 'medium',
          aiModel: 'Demo AI'
        },
        performance: {
          opens: 0,
          clicks: 0,
          conversions: 0,
          engagement: 0
        },
        createdAt: new Date().toISOString()
      }),
      analyzeCall: async () => ({
        callSid: 'demo-call',
        analysis: {
          sentiment: 'positive',
          topics: ['demo', 'test'],
          summary: 'Demo call analysis',
          actionItems: [],
          nextSteps: []
        },
        metrics: {
          duration: 300,
          talkTime: { rep: 150, customer: 150 },
          sentiment: { positive: 0.8, neutral: 0.15, negative: 0.05 },
          interruptions: 2,
          speakingPace: { rep: 120, customer: 130 },
          keywords: []
        },
        insights: [],
        createdAt: new Date().toISOString()
      }),
      performResearch: async (query: string) => ({
        id: `demo-research-${Date.now()}`,
        query,
        status: 'completed',
        results: {
          summary: `Demo research results for: ${query}`,
          sources: [],
          insights: [],
          recommendations: [],
          confidence: 0.85
        },
        createdAt: new Date().toISOString()
      }),
      updateTheme: () => { console.log('Demo mode: updateTheme'); },
      markNotificationRead: async () => { console.log('Demo mode: markNotificationRead'); },
      subscribeToRealtime: () => { console.log('Demo mode: subscribeToRealtime'); },
      unsubscribeFromRealtime: () => { console.log('Demo mode: unsubscribeFromRealtime'); }
    }
  };
};