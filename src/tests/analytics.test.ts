import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { automationTemplates, automationLogs, contacts, accounts, opportunities } from '../db/schema';
import { templateAnalytics } from '../analytics/TemplateAnalytics';
import { automationROITracker } from '../analytics/AutomationROITracker';
import { engagementAnalytics } from '../analytics/EngagementAnalytics';
import { abTestingEngine } from '../analytics/ABTestingEngine';
import { optimizationRecommendations } from '../analytics/OptimizationRecommendations';

// Mock database
vi.mock('../db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('TemplateAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTemplateMetrics', () => {
    it('should calculate template metrics correctly', async () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Welcome Email',
        templateType: 'onboarding'
      };

      const mockMetrics = {
        templateId: 'template-1',
        templateName: 'Welcome Email',
        templateType: 'onboarding',
        totalExecutions: 100,
        successfulExecutions: 85,
        failedExecutions: 15,
        engagementCount: 60,
        responseTimeSum: 240,
        responseCount: 40,
        conversions: 20,
        revenueSum: 50000,
        costSum: 1000,
        lastExecuted: new Date()
      };

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockResolvedValue([mockMetrics])
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

      const result = await templateAnalytics.getTemplateMetrics('template-1');

      expect(result).toMatchObject({
        templateId: 'template-1',
        templateName: 'Welcome Email',
        successRate: 85,
        averageEngagementRate: 70.59, // 60/85 * 100
        averageResponseTime: 6, // 240/40
        conversionRate: 20,
        revenueAttributed: 50000,
        roi: 4900, // ((50000-1000)/1000) * 100
        costPerExecution: 10 // 1000/100
      });
    });

    it('should handle templates with no executions', async () => {
      const mockMetrics = {
        templateId: 'template-2',
        templateName: 'Empty Template',
        templateType: 'follow-up',
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        engagementCount: 0,
        responseTimeSum: 0,
        responseCount: 0,
        conversions: 0,
        revenueSum: 0,
        costSum: 0,
        lastExecuted: null
      };

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockResolvedValue([mockMetrics])
      };

      vi.mocked(db.select).mockReturnValue(mockQuery as any);

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
        { id: 'template-1', name: 'High Performer', templateType: 'onboarding' },
        { id: 'template-2', name: 'Low Performer', templateType: 'follow-up' }
      ];

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockResolvedValue(mockTemplates)
      } as any));

      // Mock getTemplateMetrics to return different values
      vi.spyOn(templateAnalytics, 'getTemplateMetrics')
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
  describe('calculateAutomationROI', () => {
    it('should calculate ROI metrics correctly', async () => {
      const mockAutomation = {
        id: 'auto-1',
        name: 'Sales Automation',
        templateType: 'sales'
      };

      const mockLogs = [
        { logId: 'log-1', contactId: 'contact-1', accountId: 'account-1', cost: 10, createdAt: new Date(), status: 'completed' },
        { logId: 'log-2', contactId: 'contact-2', accountId: 'account-1', cost: 10, createdAt: new Date(), status: 'completed' }
      ];

      const mockOpportunities = [
        { 
          opportunityId: 'opp-1',
          opportunityName: 'Big Deal',
          accountId: 'account-1',
          amount: 50000,
          status: 'closed_won',
          closedAt: new Date(),
          createdAt: new Date()
        }
      ];

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockAutomation])
      } as any));

      vi.spyOn(automationROITracker, 'getAttributedOpportunities').mockResolvedValue(mockOpportunities);

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
        { id: 'auto-1', name: 'Sales 1', templateType: 'sales' },
        { id: 'auto-2', name: 'Sales 2', templateType: 'sales' },
        { id: 'auto-3', name: 'Onboarding 1', templateType: 'onboarding' }
      ];

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockResolvedValue(mockAutomations)
      } as any));

      vi.spyOn(automationROITracker, 'calculateAutomationROI')
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
  describe('getStakeholderEngagement', () => {
    it('should calculate engagement metrics by stakeholder type', async () => {
      const mockContacts = [
        { id: 'contact-1', title: 'Dr. Smith', stakeholderType: 'Doctor' },
        { id: 'contact-2', title: 'Nurse Johnson', stakeholderType: 'Nurse' },
        { id: 'contact-3', title: 'Admin Williams', stakeholderType: 'Administrator' }
      ];

      const mockEngagementData = [
        { contactId: 'contact-1', channel: 'email', engaged: true, responseTime: 2, templateId: 'template-1', createdAt: new Date(), dayOfWeek: 1, hourOfDay: 10 },
        { contactId: 'contact-2', channel: 'sms', engaged: true, responseTime: 1, templateId: 'template-2', createdAt: new Date(), dayOfWeek: 2, hourOfDay: 14 },
        { contactId: 'contact-3', channel: 'email', engaged: false, responseTime: null, templateId: 'template-1', createdAt: new Date(), dayOfWeek: 3, hourOfDay: 9 }
      ];

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockContacts)
      } as any));

      const result = await engagementAnalytics.getStakeholderEngagement();

      expect(result).toHaveLength(3);
      expect(result.find(s => s.stakeholderType === 'Doctor')).toBeDefined();
      expect(result.find(s => s.stakeholderType === 'Nurse')).toBeDefined();
      expect(result.find(s => s.stakeholderType === 'Administrator')).toBeDefined();
    });
  });

  describe('getChannelPerformance', () => {
    it('should calculate metrics for each channel', async () => {
      const mockChannelData = {
        totalSent: 1000,
        delivered: 950,
        opened: 300,
        clicked: 100,
        responded: 50
      };

      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([mockChannelData])
      } as any));

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
  describe('generateRecommendations', () => {
    it('should generate prioritized recommendations', async () => {
      // Mock all required data
      vi.spyOn(templateAnalytics, 'getAllTemplateMetrics').mockResolvedValue([
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

      vi.spyOn(automationROITracker, 'getROIDashboardData').mockResolvedValue({
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

      vi.spyOn(engagementAnalytics, 'getStakeholderEngagement').mockResolvedValue([
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

      vi.spyOn(engagementAnalytics, 'getChannelPerformance').mockResolvedValue([
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

      vi.spyOn(abTestingEngine, 'getTestRecommendations').mockResolvedValue([]);

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
      vi.spyOn(automationROITracker, 'getROIDashboardData').mockResolvedValue({
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

      vi.spyOn(engagementAnalytics, 'getStakeholderEngagement').mockResolvedValue([
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

      vi.spyOn(engagementAnalytics, 'getEngagementTrends').mockResolvedValue([
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
  it('should track complete automation lifecycle', async () => {
    // 1. Create and track template execution
    const templateId = 'e2e-template-1';
    const mockExecutionLog = {
      id: 'log-1',
      templateId: templateId,
      status: 'completed',
      metadata: {
        templateId: templateId,
        contactId: 'contact-1',
        accountId: 'account-1',
        channel: 'email',
        engaged: true,
        opened: true,
        clicked: true,
        responded: true,
        converted: true,
        revenue: 100000,
        cost: 1000,
        responseTimeHours: 2
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.insert).mockImplementation(() => ({
      values: vi.fn().mockResolvedValue(mockExecutionLog)
    } as any));

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
    vi.spyOn(templateAnalytics, 'getAllTemplateMetrics').mockResolvedValue([{
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
    expect(vi.mocked(db.insert)).toHaveBeenCalled();
  });
});