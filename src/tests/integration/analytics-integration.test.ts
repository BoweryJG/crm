import { db, sql } from '../../db';
import { 
  automationTemplates, 
  automationLogs, 
  contacts, 
  accounts, 
  opportunities
} from '../../db/schema';
import { templateAnalytics } from '../../analytics/TemplateAnalytics';
import { automationROITracker } from '../../analytics/AutomationROITracker';
import { engagementAnalytics } from '../../analytics/EngagementAnalytics';
import { abTestingEngine } from '../../analytics/ABTestingEngine';
import { optimizationRecommendations } from '../../analytics/OptimizationRecommendations';
import { v4 as uuidv4 } from 'uuid';

// Test data
const testUserId = uuidv4();
const testAccountId = uuidv4();
const testContactIds = [uuidv4(), uuidv4(), uuidv4()];
const testTemplateIds = [uuidv4(), uuidv4()];
const testOpportunityId = uuidv4();

describe('Analytics Integration Tests', () => {
  beforeAll(async () => {
    // Setup test data
    await db.from('users').insert({
      id: testUserId,
      email: 'analytics-test@example.com',
      name: 'Analytics Test User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.from('accounts').insert({
      id: testAccountId,
      name: 'Test Medical Center',
      industry: 'Healthcare',
      employeeCount: 500,
      annualRevenue: 10000000,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.from('contacts').insert([
      {
        id: testContactIds[0],
        accountId: testAccountId,
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'john.smith@medical.com',
        title: 'Chief Surgeon',
        department: 'Surgery',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: testContactIds[1],
        accountId: testAccountId,
        firstName: 'Mary',
        lastName: 'Johnson',
        email: 'mary.johnson@medical.com',
        title: 'Head Nurse',
        department: 'Nursing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: testContactIds[2],
        accountId: testAccountId,
        firstName: 'Robert',
        lastName: 'Williams',
        email: 'robert.williams@medical.com',
        title: 'Hospital Administrator',
        department: 'Administration',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await db.from('automation_templates').insert([
      {
        id: testTemplateIds[0],
        name: 'Product Introduction',
        description: 'Introduce new medical device',
        templateType: 'sales',
        triggers: { type: 'manual' },
        actions: [{ type: 'email', template: 'intro' }],
        isActive: true,
        createdBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: testTemplateIds[1],
        name: 'Follow-up Sequence',
        description: 'Post-demo follow-up',
        templateType: 'follow-up',
        triggers: { type: 'event', event: 'demo_completed' },
        actions: [{ type: 'email', template: 'follow-up' }],
        isActive: true,
        createdBy: testUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await db.from('opportunities').insert({
      id: testOpportunityId,
      accountId: testAccountId,
      name: 'Medical Device Sale',
      stage: 'closed_won',
      amount: 150000,
      probability: 100,
      closeDate: new Date(),
      status: 'closed_won',
      closedAt: new Date(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date()
    });

    // Create automation logs
    const logs = [];
    for (let i = 0; i < 50; i++) {
      const templateId = i % 2 === 0 ? testTemplateIds[0] : testTemplateIds[1];
      const contactId = testContactIds[i % 3];
      const isEngaged = i % 3 !== 2;
      const isConverted = i % 5 === 0;

      logs.push({
        id: uuidv4(),
        templateId: templateId,
        status: isEngaged ? 'completed' : 'failed',
        metadata: {
          templateId,
          contactId,
          accountId: testAccountId,
          channel: i % 2 === 0 ? 'email' : 'sms',
          engaged: isEngaged,
          opened: isEngaged,
          clicked: isEngaged && i % 2 === 0,
          responded: isEngaged && i % 4 === 0,
          converted: isConverted,
          revenue: isConverted ? 30000 : 0,
          cost: 50,
          responseTimeHours: isEngaged ? Math.floor(Math.random() * 48) + 1 : null,
          sequenceStep: (i % 3) + 1,
          sentimentScore: isEngaged ? 0.7 + (Math.random() * 0.3) : 0.3
        },
        createdAt: new Date(Date.now() - (50 - i) * 24 * 60 * 60 * 1000), // Spread over 50 days
        updatedAt: new Date()
      });
    }

    await db.from('automation_logs').insert(logs);
  });

  afterAll(async () => {
    // Cleanup test data
    await db.from('automation_logs').delete().eq('metadata->>accountId', testAccountId);
    await db.from('opportunities').delete().eq('id', testOpportunityId);
    await db.from('automation_templates').delete().in('id', testTemplateIds);
    await db.from('contacts').delete().eq('accountId', testAccountId);
    await db.from('accounts').delete().eq('id', testAccountId);
    await db.from('users').delete().eq('id', testUserId);
  });

  describe('Template Analytics Integration', () => {
    it('should analyze template performance with real data', async () => {
      const metrics = await templateAnalytics.getTemplateMetrics(testTemplateIds[0]);

      expect(metrics).toBeDefined();
      expect(metrics.templateId).toBe(testTemplateIds[0]);
      expect(metrics.totalExecutions).toBeGreaterThan(0);
      expect(metrics.successRate).toBeGreaterThan(0);
      expect(metrics.averageEngagementRate).toBeGreaterThan(0);
      expect(metrics.revenueAttributed).toBeGreaterThan(0);
    });

    it('should generate performance report across all templates', async () => {
      const report = await templateAnalytics.getPerformanceReport();

      expect(report).toBeDefined();
      expect(report.overallStats.totalTemplates).toBeGreaterThanOrEqual(2);
      expect(report.overallStats.activeTemplates).toBeGreaterThan(0);
      expect(report.topPerformers).toBeDefined();
      expect(report.underperformers).toBeDefined();
      expect(report.byCategory).toBeDefined();
    });

    it('should track engagement by stakeholder type', async () => {
      const engagement = await templateAnalytics.getTemplateEngagementByStakeholder(
        testTemplateIds[0]
      );

      expect(engagement).toBeDefined();
      expect(Object.keys(engagement).length).toBeGreaterThan(0);
      
      // Should have different stakeholder types
      const stakeholderTypes = Object.keys(engagement);
      expect(stakeholderTypes).toContain('Doctor');
    });
  });

  describe('ROI Tracking Integration', () => {
    it('should calculate ROI for automation with attributed revenue', async () => {
      const roi = await automationROITracker.calculateAutomationROI(testTemplateIds[0]);

      expect(roi).toBeDefined();
      expect(roi.automationId).toBe(testTemplateIds[0]);
      expect(roi.metrics.revenue).toBeGreaterThan(0);
      expect(roi.metrics.cost).toBeGreaterThan(0);
      expect(roi.metrics.roiPercentage).toBeDefined();
      expect(roi.touchpoints).toBeGreaterThan(0);
    });

    it('should attribute opportunities correctly', async () => {
      const attribution = await automationROITracker.getOpportunityAttribution(testOpportunityId);

      expect(attribution).toBeDefined();
      expect(attribution.opportunityId).toBe(testOpportunityId);
      expect(attribution.revenue).toBe(150000);
      expect(attribution.automations).toBeDefined();
      expect(Array.isArray(attribution.automations)).toBe(true);
    });

    it('should calculate ROI by automation type', async () => {
      const roiByType = await automationROITracker.getROIByAutomationType();

      expect(roiByType).toBeDefined();
      expect(roiByType.sales).toBeDefined();
      expect(roiByType.sales.revenue).toBeGreaterThan(0);
      expect(roiByType['follow-up']).toBeDefined();
    });
  });

  describe('Engagement Analytics Integration', () => {
    it('should analyze stakeholder engagement patterns', async () => {
      const stakeholderEngagement = await engagementAnalytics.getStakeholderEngagement();

      expect(stakeholderEngagement).toBeDefined();
      expect(Array.isArray(stakeholderEngagement)).toBe(true);
      expect(stakeholderEngagement.length).toBeGreaterThan(0);

      const doctorEngagement = stakeholderEngagement.find(s => s.stakeholderType === 'Doctor');
      expect(doctorEngagement).toBeDefined();
      expect(doctorEngagement?.totalContacts).toBeGreaterThan(0);
      expect(doctorEngagement?.engagementRate).toBeDefined();
    });

    it('should generate engagement heatmap', async () => {
      const heatmap = await engagementAnalytics.getEngagementHeatmap();

      expect(heatmap).toBeDefined();
      expect(Array.isArray(heatmap)).toBe(true);
      expect(heatmap.length).toBeGreaterThan(0);

      const firstEntry = heatmap[0];
      expect(firstEntry.stakeholderType).toBeDefined();
      expect(firstEntry.dayOfWeek).toBeDefined();
      expect(firstEntry.hourOfDay).toBeDefined();
      expect(firstEntry.engagementScore).toBeDefined();
    });

    it('should analyze channel performance', async () => {
      const channels = await engagementAnalytics.getChannelPerformance();

      expect(channels).toBeDefined();
      expect(Array.isArray(channels)).toBe(true);
      
      const emailChannel = channels.find(c => c.channel === 'email');
      expect(emailChannel).toBeDefined();
      expect(emailChannel?.totalSent).toBeGreaterThan(0);
      expect(emailChannel?.deliveryRate).toBeDefined();
      expect(emailChannel?.openRate).toBeDefined();
    });

    it('should track engagement trends over time', async () => {
      const trends = await engagementAnalytics.getEngagementTrends(undefined, 'week');

      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBeGreaterThan(0);

      const firstWeek = trends[0];
      expect(firstWeek.period).toBeDefined();
      expect(firstWeek.totalEngagements).toBeGreaterThan(0);
      expect(firstWeek.engagementRate).toBeDefined();
    });
  });

  describe('A/B Testing Integration', () => {
    it('should create and manage A/B tests', async () => {
      const test = await abTestingEngine.createABTest({
        testName: 'Integration Test',
        templateId: testTemplateIds[0],
        variants: [
          { name: 'Control', allocation: 50, config: { subjectLine: 'Original' } },
          { name: 'Variant A', allocation: 50, config: { subjectLine: 'New' } }
        ],
        primaryMetric: 'openRate'
      });

      expect(test).toBeDefined();
      expect(test.testId).toBeDefined();
      expect(test.variants).toHaveLength(2);
      expect(test.status).toBe('draft');

      // Start the test
      const startedTest = await abTestingEngine.startTest(test.testId);
      expect(startedTest.status).toBe('running');

      // Get variant for contact
      const variant = await abTestingEngine.getVariantForContact(test.testId, testContactIds[0]);
      expect(variant).toBeDefined();
      expect(['Control', 'Variant A']).toContain(variant?.variantName);

      // Log interaction
      await abTestingEngine.logInteraction({
        testId: test.testId,
        variantId: variant!.variantId,
        contactId: testContactIds[0],
        interactionType: 'opened'
      });

      // Get test results
      const results = await abTestingEngine.getTestResults(test.testId);
      expect(results).toBeDefined();
      expect(results.variantMetrics).toHaveLength(2);
    });

    it('should generate test recommendations', async () => {
      const recommendations = await abTestingEngine.getTestRecommendations(3);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      if (recommendations.length > 0) {
        const firstRec = recommendations[0];
        expect(firstRec.templateId).toBeDefined();
        expect(firstRec.recommendationType).toBeDefined();
        expect(firstRec.suggestedTest).toBeDefined();
        expect(firstRec.priority).toBeDefined();
      }
    });
  });

  describe('Optimization Recommendations Integration', () => {
    it('should generate comprehensive recommendations', async () => {
      const recommendations = await optimizationRecommendations.generateRecommendations();

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      const firstRec = recommendations[0];
      expect(firstRec.id).toBeDefined();
      expect(firstRec.type).toBeDefined();
      expect(firstRec.priority).toBeDefined();
      expect(firstRec.impact).toBeDefined();
      expect(firstRec.actionItems).toBeDefined();
      expect(Array.isArray(firstRec.actionItems)).toBe(true);
    });

    it('should generate optimization insights', async () => {
      const insights = await optimizationRecommendations.getOptimizationInsights();

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);

      const firstInsight = insights[0];
      expect(firstInsight.category).toBeDefined();
      expect(firstInsight.insight).toBeDefined();
      expect(firstInsight.dataPoints).toBeDefined();
      expect(Array.isArray(firstInsight.dataPoints)).toBe(true);
    });

    it('should predict churn risk and next best actions', async () => {
      const predictiveRecs = await optimizationRecommendations.getPredictiveRecommendations(
        testAccountId
      );

      expect(predictiveRecs).toBeDefined();
      expect(Array.isArray(predictiveRecs)).toBe(true);

      // May or may not have recommendations based on data
      if (predictiveRecs.length > 0) {
        const firstPrediction = predictiveRecs[0];
        expect(firstPrediction.type).toBeDefined();
        expect(firstPrediction.impact.confidenceLevel).toBeDefined();
      }
    });

    it('should export recommendations in different formats', async () => {
      const recommendations = await optimizationRecommendations.generateRecommendations();
      
      // Test JSON export
      const jsonExport = await optimizationRecommendations.exportRecommendations(
        recommendations.slice(0, 2),
        'json'
      );
      expect(jsonExport).toBeDefined();
      expect(() => JSON.parse(jsonExport)).not.toThrow();

      // Test CSV export
      const csvExport = await optimizationRecommendations.exportRecommendations(
        recommendations.slice(0, 2),
        'csv'
      );
      expect(csvExport).toBeDefined();
      expect(csvExport).toContain('ID,Type,Priority');
    });
  });

  describe('Dashboard Data Integration', () => {
    it('should provide complete dashboard data', async () => {
      const timeRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      };

      const [
        templateMetrics,
        roiData,
        stakeholderEngagement,
        channelPerformance,
        recommendations,
        insights
      ] = await Promise.all([
        templateAnalytics.getAllTemplateMetrics(timeRange),
        automationROITracker.getROIDashboardData(timeRange),
        engagementAnalytics.getStakeholderEngagement(undefined, timeRange),
        engagementAnalytics.getChannelPerformance(timeRange),
        optimizationRecommendations.generateRecommendations(timeRange),
        optimizationRecommendations.getOptimizationInsights(timeRange)
      ]);

      // Verify all data is present and valid
      expect(templateMetrics).toBeDefined();
      expect(Array.isArray(templateMetrics)).toBe(true);

      expect(roiData).toBeDefined();
      expect(roiData.totalRevenue).toBeDefined();
      expect(roiData.totalROI).toBeDefined();

      expect(stakeholderEngagement).toBeDefined();
      expect(Array.isArray(stakeholderEngagement)).toBe(true);

      expect(channelPerformance).toBeDefined();
      expect(Array.isArray(channelPerformance)).toBe(true);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });
  });
});