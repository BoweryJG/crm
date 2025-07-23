import { db } from '../db';
import { supabase } from '../services/supabase/supabase';
import { automationTemplates, automationLogs, contacts, accounts, opportunities } from '../db/schema';
import { templateAnalytics } from '../analytics/TemplateAnalytics';
import { automationROITracker } from '../analytics/AutomationROITracker';
import { engagementAnalytics } from '../analytics/EngagementAnalytics';
import { abTestingEngine } from '../analytics/ABTestingEngine';
import { optimizationRecommendations } from '../analytics/OptimizationRecommendations';

// Create a comprehensive mock for Supabase client
const createMockQueryBuilder = (mockData: any = [], mockError: any = null) => {
  const queryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: Array.isArray(mockData) ? mockData[0] : mockData, error: mockError }),
    maybeSingle: jest.fn().mockResolvedValue({ data: Array.isArray(mockData) ? mockData[0] : mockData, error: mockError }),
    then: jest.fn((onFulfilled) => {
      const result = { data: mockData, error: mockError };
      return Promise.resolve(result).then(onFulfilled);
    })
  };
  
  // Make all methods return the query builder for chaining
  Object.keys(queryBuilder).forEach(method => {
    if (method !== 'single' && method !== 'maybeSingle' && method !== 'then') {
      (queryBuilder as any)[method] = jest.fn().mockReturnValue(queryBuilder);
    }
  });
  
  return queryBuilder;
};

// Mock Supabase client
jest.mock('../services/supabase/supabase', () => ({
  supabase: {
    from: jest.fn(() => createMockQueryBuilder())
  }
}));

// Mock database for integration purposes
jest.mock('../db', () => ({
  db: {
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }))
  },
  sql: {
    raw: jest.fn((query: string) => query)
  }
}));

describe('TemplateAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the supabase mock to default behavior
    (supabase.from as jest.Mock).mockReset();
  });

  describe('getTemplateMetrics', () => {
    it('should calculate template metrics correctly', async () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Welcome Email',
        template_type: 'onboarding'
      };

      // Mock template lookup first
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_templates') {
          return createMockQueryBuilder(mockTemplate);
        }
        
        // For automation_logs queries, return mock logs data
        const mockLogs = [
          {
            id: 'log-1',
            status: 'completed',
            metadata: { templateId: 'template-1', engaged: true, cost: 10, revenue: 500 },
            created_at: new Date()
          },
          {
            id: 'log-2', 
            status: 'completed',
            metadata: { templateId: 'template-1', engaged: true, cost: 10, revenue: 500 },
            created_at: new Date()
          }
        ];
        return createMockQueryBuilder(mockLogs);
      });

      const result = await templateAnalytics.getTemplateMetrics('template-1');

      expect(result).toBeDefined();
      expect(result.templateId).toBe('template-1');
      expect(result.templateName).toBe('Welcome Email');
      expect(result.templateType).toBe('onboarding');
    });

    it('should handle templates with no executions', async () => {
      const mockTemplate = {
        id: 'template-2',
        name: 'Empty Template',
        template_type: 'follow-up'
      };

      // Mock template lookup
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_templates') {
          return createMockQueryBuilder(mockTemplate);
        }
        
        // For automation_logs queries
        const mockLogs: any[] = [];
        return createMockQueryBuilder(mockLogs);
      });

      const result = await templateAnalytics.getTemplateMetrics('template-2');

      expect(result.successRate).toBe(0);
      expect(result.averageEngagementRate).toBe(0);
      expect(result.roi).toBe(0);
      expect(result.costPerExecution).toBe(0);
    });
  });

  describe('getPerformanceReport', () => {
    it('should generate comprehensive performance report', async () => {
      const mockTemplates = [
        { id: 'template-1', name: 'High Performer', template_type: 'onboarding' },
        { id: 'template-2', name: 'Low Performer', template_type: 'follow-up' }
      ];

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_templates') {
          return createMockQueryBuilder(mockTemplates);
        }
        return createMockQueryBuilder([]);
      });

      // Mock getTemplateMetrics to return different values
      jest.spyOn(templateAnalytics, 'getTemplateMetrics')
        .mockResolvedValueOnce({
          templateId: 'template-1',
          templateName: 'High Performer',
          templateType: 'onboarding',
          totalExecutions: 100,
          successfulExecutions: 90,
          failedExecutions: 10,
          successRate: 90,
          averageEngagementRate: 80,
          averageResponseTime: 2,
          conversionRate: 30,
          revenueAttributed: 100000,
          costPerExecution: 10,
          roi: 900,
          lastExecuted: new Date(),
          performanceTrend: 'improving'
        })
        .mockResolvedValueOnce({
          templateId: 'template-2',
          templateName: 'Low Performer',
          templateType: 'follow-up',
          totalExecutions: 50,
          successfulExecutions: 20,
          failedExecutions: 30,
          successRate: 40,
          averageEngagementRate: 20,
          averageResponseTime: 48,
          conversionRate: 5,
          revenueAttributed: 5000,
          costPerExecution: 20,
          roi: -50,
          lastExecuted: new Date(),
          performanceTrend: 'declining'
        });

      const report = await templateAnalytics.getPerformanceReport();

      expect(report.topPerformers).toHaveLength(2);
      expect(report.topPerformers[0].templateName).toBe('High Performer');
      expect(report.underperformers[0].templateName).toBe('Low Performer');
      expect(report.overallStats.totalTemplates).toBe(2);
      expect(report.overallStats.activeTemplates).toBe(2);
      expect(report.overallStats.averageSuccessRate).toBe(65); // (90 + 40) / 2
    });
  });
});

describe('AutomationROITracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReset();
  });

  describe('calculateAutomationROI', () => {
    it('should calculate ROI metrics correctly', async () => {
      const mockAutomation = {
        id: 'auto-1',
        name: 'Sales Automation',
        template_type: 'sales'
      };

      const mockLogs = [
        { id: 'log-1', contact_id: 'contact-1', account_id: 'account-1', cost: 10, created_at: new Date(), status: 'completed' },
        { id: 'log-2', contact_id: 'contact-2', account_id: 'account-1', cost: 10, created_at: new Date(), status: 'completed' }
      ];

      const mockOpportunities = [
        { 
          id: 'opp-1',
          name: 'Big Deal',
          account_id: 'account-1',
          amount: 50000,
          status: 'closed_won',
          closed_at: new Date(),
          created_at: new Date()
        }
      ];

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_templates') {
          return createMockQueryBuilder(mockAutomation);
        }
        return createMockQueryBuilder([]);
      });

      jest.spyOn(automationROITracker, 'getAttributedOpportunities').mockResolvedValue(mockOpportunities);

      const result = await automationROITracker.calculateAutomationROI('auto-1');

      expect(result.automationName).toBe('Sales Automation');
      expect(result.metrics.revenue).toBeGreaterThan(0);
      expect(result.metrics.roiPercentage).toBeGreaterThan(0);
      expect(result.attributedOpportunities).toBe(1);
    });
  });

  describe('getROIByAutomationType', () => {
    it('should aggregate ROI by automation type', async () => {
      const mockAutomations = [
        { id: 'auto-1', name: 'Sales 1', template_type: 'sales' },
        { id: 'auto-2', name: 'Sales 2', template_type: 'sales' },
        { id: 'auto-3', name: 'Onboarding 1', template_type: 'onboarding' }
      ];

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_templates') {
          return createMockQueryBuilder(mockAutomations);
        }
        return createMockQueryBuilder([]);
      });

      jest.spyOn(automationROITracker, 'calculateAutomationROI')
        .mockResolvedValueOnce({
          automationId: 'auto-1',
          automationName: 'Sales 1',
          automationType: 'sales',
          metrics: {
            revenue: 50000,
            cost: 1000,
            profit: 49000,
            roi: 49,
            roiPercentage: 4900,
            averageDealSize: 50000,
            conversionRate: 20,
            timeToConversion: 30,
            customerLifetimeValue: 100000
          },
          attributedOpportunities: 1,
          attributedAccounts: 1,
          touchpoints: 10,
          firstTouchRevenue: 50000,
          lastTouchRevenue: 0,
          multiTouchRevenue: 25000
        } as any)
        .mockResolvedValueOnce({
          automationId: 'auto-2',
          automationName: 'Sales 2',
          automationType: 'sales',
          metrics: {
            revenue: 30000,
            cost: 500,
            profit: 29500,
            roi: 59,
            roiPercentage: 5900,
            averageDealSize: 30000,
            conversionRate: 15,
            timeToConversion: 25,
            customerLifetimeValue: 80000
          },
          attributedOpportunities: 1,
          attributedAccounts: 1,
          touchpoints: 8,
          firstTouchRevenue: 30000,
          lastTouchRevenue: 0,
          multiTouchRevenue: 15000
        } as any)
        .mockResolvedValueOnce({
          automationId: 'auto-3',
          automationName: 'Onboarding 1',
          automationType: 'onboarding',
          metrics: {
            revenue: 20000,
            cost: 200,
            profit: 19800,
            roi: 99,
            roiPercentage: 9900,
            averageDealSize: 20000,
            conversionRate: 40,
            timeToConversion: 10,
            customerLifetimeValue: 40000
          },
          attributedOpportunities: 1,
          attributedAccounts: 1,
          touchpoints: 5,
          firstTouchRevenue: 20000,
          lastTouchRevenue: 0,
          multiTouchRevenue: 10000
        } as any);

      const result = await automationROITracker.getROIByAutomationType();

      expect(result.sales).toBeDefined();
      expect(result.sales.revenue).toBe(80000); // 50000 + 30000
      expect(result.sales.cost).toBe(1500); // 1000 + 500
      expect(result.onboarding).toBeDefined();
      expect(result.onboarding.revenue).toBe(20000);
    });
  });
});

describe('EngagementAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReset();
  });

  describe('getStakeholderEngagement', () => {
    it('should calculate engagement metrics by stakeholder type', async () => {
      const mockContacts = [
        { id: 'contact-1', title: 'Dr. Smith', role: 'Doctor' },
        { id: 'contact-2', title: 'Nurse Johnson', role: 'Nurse' },
        { id: 'contact-3', title: 'Admin Williams', role: 'Administrator' }
      ];

      const mockEngagementData = [
        { contact_id: 'contact-1', channel: 'email', engagement_data: { engaged: true }, response_time: 2, template_id: 'template-1', created_at: new Date(), day_of_week: 1, hour_of_day: 10 },
        { contact_id: 'contact-2', channel: 'sms', engagement_data: { engaged: true }, response_time: 1, template_id: 'template-2', created_at: new Date(), day_of_week: 2, hour_of_day: 14 },
        { contact_id: 'contact-3', channel: 'email', engagement_data: { engaged: false }, response_time: null, template_id: 'template-1', created_at: new Date(), day_of_week: 3, hour_of_day: 9 }
      ];

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'contacts') {
          return createMockQueryBuilder(mockContacts);
        }
        if (table === 'automation_logs') {
          return createMockQueryBuilder(mockEngagementData);
        }
        return createMockQueryBuilder([]);
      });

      const result = await engagementAnalytics.getStakeholderEngagement();

      expect(result).toHaveLength(3);
      expect(result.find(s => s.stakeholderType === 'Doctor')).toBeDefined();
      expect(result.find(s => s.stakeholderType === 'Nurse')).toBeDefined();
      expect(result.find(s => s.stakeholderType === 'Administrator')).toBeDefined();
    });
  });

  describe('getChannelPerformance', () => {
    it('should calculate metrics for each channel', async () => {
      const mockChannelData = [
        {
          channel: 'email',
          total_sent: 1000,
          delivered: 950,
          opened: 300,
          clicked: 100,
          responded: 50
        }
      ];

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'automation_logs') {
          return createMockQueryBuilder(mockChannelData);
        }
        return createMockQueryBuilder([]);
      });

      const result = await engagementAnalytics.getChannelPerformance();

      expect(result).toHaveLength(4); // email, sms, call, in_app
      const emailChannel = result.find(c => c.channel === 'email');
      expect(emailChannel).toBeDefined();
      expect(emailChannel?.deliveryRate).toBe(95); // 950/1000 * 100
      expect(emailChannel?.openRate).toBeCloseTo(31.58); // 300/950 * 100
      expect(emailChannel?.clickRate).toBeCloseTo(33.33); // 100/300 * 100
      expect(emailChannel?.responseRate).toBeCloseTo(5.26); // 50/950 * 100
    });
  });
});

describe('ABTestingEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReset();
  });

  describe('createABTest', () => {
    it('should create a valid A/B test', async () => {
      const testParams = {
        testName: 'Subject Line Test',
        templateId: 'template-1',
        variants: [
          { name: 'Control', allocation: 50, config: { subjectLine: 'Original Subject' } },
          { name: 'Variant A', allocation: 50, config: { subjectLine: 'New Subject' } }
        ],
        primaryMetric: 'openRate' as const
      };

      const test = await abTestingEngine.createABTest(testParams);

      expect(test.testName).toBe('Subject Line Test');
      expect(test.templateId).toBe('template-1');
      expect(test.variants).toHaveLength(2);
      expect(test.status).toBe('draft');
      expect(test.primaryMetric).toBe('openRate');
    });

    it('should reject invalid allocations', async () => {
      const testParams = {
        testName: 'Invalid Test',
        templateId: 'template-1',
        variants: [
          { name: 'Control', allocation: 60, config: {} },
          { name: 'Variant A', allocation: 30, config: {} }
        ]
      };

      await expect(abTestingEngine.createABTest(testParams)).rejects.toThrow('Variant allocations must sum to 100%');
    });
  });

  describe('getVariantForContact', () => {
    it('should consistently assign contacts to variants', async () => {
      const testParams = {
        testName: 'Consistent Assignment Test',
        templateId: 'template-1',
        variants: [
          { name: 'Control', allocation: 50, config: {} },
          { name: 'Variant A', allocation: 50, config: {} }
        ]
      };

      const test = await abTestingEngine.createABTest(testParams);
      await abTestingEngine.startTest(test.testId);

      // Same contact should always get same variant
      const variant1 = await abTestingEngine.getVariantForContact(test.testId, 'contact-1');
      const variant2 = await abTestingEngine.getVariantForContact(test.testId, 'contact-1');

      expect(variant1?.variantId).toBe(variant2?.variantId);
    });
  });
});

describe('OptimizationRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReset();
  });

  describe('generateRecommendations', () => {
    it('should generate prioritized recommendations', async () => {
      // Mock all required data
      jest.spyOn(templateAnalytics, 'getAllTemplateMetrics').mockResolvedValue([
        {
          templateId: 'template-1',
          templateName: 'Underperformer',
          templateType: 'onboarding',
          totalExecutions: 200,
          successfulExecutions: 20,
          failedExecutions: 180,
          successRate: 10,
          averageEngagementRate: 5,
          averageResponseTime: 72,
          conversionRate: 1,
          revenueAttributed: 1000,
          costPerExecution: 50,
          roi: -90,
          lastExecuted: new Date(),
          performanceTrend: 'declining'
        }
      ]);

      jest.spyOn(automationROITracker, 'getROIDashboardData').mockResolvedValue({
        totalRevenue: 100000,
        totalCost: 10000,
        totalROI: 900,
        topPerformers: [],
        roiByType: {},
        attributionBreakdown: {
          firstTouch: 40000,
          lastTouch: 30000,
          multiTouch: 30000
        }
      });

      jest.spyOn(engagementAnalytics, 'getStakeholderEngagement').mockResolvedValue([
        {
          stakeholderType: 'Doctor',
          totalContacts: 100,
          engagedContacts: 10,
          engagementRate: 10,
          averageResponseTime: 48,
          preferredChannels: { email: 8, sms: 2 },
          preferredTimes: { 'Monday_Morning': 5, 'Tuesday_Afternoon': 3 },
          topTemplates: []
        }
      ]);

      jest.spyOn(engagementAnalytics, 'getChannelPerformance').mockResolvedValue([
        {
          channel: 'email',
          totalSent: 1000,
          delivered: 850,
          opened: 170,
          clicked: 50,
          responded: 25,
          deliveryRate: 85,
          openRate: 20,
          clickRate: 29.4,
          responseRate: 2.9
        }
      ]);

      jest.spyOn(abTestingEngine, 'getTestRecommendations').mockResolvedValue([]);

      const recommendations = await optimizationRecommendations.generateRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].priority).toBeDefined();
      expect(recommendations[0].impact).toBeDefined();
      expect(recommendations[0].actionItems.length).toBeGreaterThan(0);

      // Verify recommendations are sorted by priority
      const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
      for (let i = 1; i < recommendations.length; i++) {
        const prevPriority = priorities[recommendations[i - 1].priority];
        const currPriority = priorities[recommendations[i].priority];
        expect(prevPriority).toBeGreaterThanOrEqual(currPriority);
      }
    });
  });

  describe('getOptimizationInsights', () => {
    it('should generate actionable insights', async () => {
      jest.spyOn(automationROITracker, 'getROIDashboardData').mockResolvedValue({
        totalRevenue: 500000,
        totalCost: 50000,
        totalROI: 900,
        topPerformers: [
          {
            automationId: 'auto-1',
            automationName: 'Top Performer',
            automationType: 'sales',
            metrics: {
              revenue: 200000,
              cost: 10000,
              profit: 190000,
              roi: 19,
              roiPercentage: 1900,
              averageDealSize: 50000,
              conversionRate: 25,
              timeToConversion: 20,
              customerLifetimeValue: 150000
            },
            attributedOpportunities: 4,
            attributedAccounts: 3,
            touchpoints: 50,
            firstTouchRevenue: 100000,
            lastTouchRevenue: 50000,
            multiTouchRevenue: 50000
          }
        ],
        roiByType: {},
        attributionBreakdown: {
          firstTouch: 200000,
          lastTouch: 150000,
          multiTouch: 150000
        }
      });

      jest.spyOn(engagementAnalytics, 'getStakeholderEngagement').mockResolvedValue([
        {
          stakeholderType: 'Doctor',
          totalContacts: 200,
          engagedContacts: 160,
          engagementRate: 80,
          averageResponseTime: 2,
          preferredChannels: {},
          preferredTimes: {},
          topTemplates: []
        },
        {
          stakeholderType: 'Nurse',
          totalContacts: 150,
          engagedContacts: 30,
          engagementRate: 20,
          averageResponseTime: 24,
          preferredChannels: {},
          preferredTimes: {},
          topTemplates: []
        }
      ]);

      jest.spyOn(engagementAnalytics, 'getEngagementTrends').mockResolvedValue([
        { period: 'Week 1', totalEngagements: 100, uniqueContacts: 50, averageResponseTime: 4, engagementRate: 60 },
        { period: 'Week 2', totalEngagements: 120, uniqueContacts: 60, averageResponseTime: 3.5, engagementRate: 65 },
        { period: 'Week 3', totalEngagements: 140, uniqueContacts: 70, averageResponseTime: 3, engagementRate: 70 },
        { period: 'Week 4', totalEngagements: 160, uniqueContacts: 80, averageResponseTime: 2.5, engagementRate: 75 }
      ]);

      const insights = await optimizationRecommendations.getOptimizationInsights();

      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].category).toBeDefined();
      expect(insights[0].insight).toBeDefined();
      expect(insights[0].dataPoints.length).toBeGreaterThan(0);
      expect(insights[0].recommendations.length).toBeGreaterThan(0);

      // Verify Revenue Impact insight
      const revenueInsight = insights.find(i => i.category === 'Revenue Impact');
      expect(revenueInsight).toBeDefined();
      expect(revenueInsight?.insight).toContain('$500,000');
      expect(revenueInsight?.insight).toContain('900%');
    });
  });
});

describe('End-to-End Analytics Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReset();
  });

  it('should track complete automation lifecycle', async () => {
    // 1. Create and track template execution
    const templateId = 'e2e-template-1';
    const mockExecutionLog = {
      id: 'log-1',
      template_id: templateId,
      status: 'completed',
      metadata: {
        template_id: templateId,
        contact_id: 'contact-1',
        account_id: 'account-1',
        channel: 'email',
        engaged: true,
        opened: true,
        clicked: true,
        responded: true,
        converted: true,
        revenue: 100000,
        cost: 1000,
        response_time_hours: 2
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    (supabase.from as jest.Mock).mockReturnValue(
      createMockQueryBuilder(null, null)
    );

    // 2. Create A/B test for the template
    const abTest = await abTestingEngine.createABTest({
      testName: 'E2E Test',
      templateId: templateId,
      variants: [
        { name: 'Control', allocation: 50, config: { subjectLine: 'Original' } },
        { name: 'Variant', allocation: 50, config: { subjectLine: 'Improved' } }
      ],
      primaryMetric: 'conversionRate'
    });

    expect(abTest).toBeDefined();
    expect(abTest.variants).toHaveLength(2);

    // 3. Start the test and log interactions
    await abTestingEngine.startTest(abTest.testId);
    
    const variant = await abTestingEngine.getVariantForContact(abTest.testId, 'contact-1');
    expect(variant).toBeDefined();

    await abTestingEngine.logInteraction({
      testId: abTest.testId,
      variantId: variant!.variantId,
      contactId: 'contact-1',
      interactionType: 'converted',
      metadata: { revenue: 50000 }
    });

    // 4. Generate recommendations based on performance
    jest.spyOn(templateAnalytics, 'getAllTemplateMetrics').mockResolvedValue([{
      templateId: templateId,
      templateName: 'E2E Template',
      templateType: 'sales',
      totalExecutions: 100,
      successfulExecutions: 85,
      failedExecutions: 15,
      successRate: 85,
      averageEngagementRate: 75,
      averageResponseTime: 3,
      conversionRate: 25,
      revenueAttributed: 500000,
      costPerExecution: 50,
      roi: 900,
      lastExecuted: new Date(),
      performanceTrend: 'improving'
    }]);

    const recommendations = await optimizationRecommendations.generateRecommendations();
    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);

    // 5. Verify complete tracking
    expect((supabase.from as jest.Mock)).toHaveBeenCalled();
  });
});