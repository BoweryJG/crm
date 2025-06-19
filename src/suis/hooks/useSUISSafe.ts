import { useContext } from 'react';
import { SUISContext } from '../components/SUISProvider';
import { generateAllSUISMockData } from '../../services/mockData/suisIntelligenceMockData';
import { InsightType, RecommendationType, EffortLevel, ImpactLevel, ContentType, PersonalizationLevel, TonePreference, DecisionLevel, ComplexityLevel, EmotionType, ContentLength, ApprovalStatus } from '../types';
import type { Priority } from '../types';

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
        id: 'demo-analytics-safe',
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
          body: `This is a demo generated ${params.type || 'email'} content.`,
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
          templateId: 'demo-template-1',
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