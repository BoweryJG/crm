import { supabase } from '../services/supabase/supabase';
import type { AutomationLog, AutomationTemplate } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export interface ABTestVariant {
  variantId: string;
  variantName: string;
  allocation: number; // Percentage of traffic (0-100)
  config: {
    subjectLine?: string;
    previewText?: string;
    contentTemplate?: string;
    sendTime?: string; // HH:MM format
    sendDay?: number; // 0-6 (Sunday-Saturday)
    delay?: number; // Delay in hours
    channel?: 'email' | 'sms' | 'call' | 'in_app';
    personalization?: Record<string, any>;
  };
  metrics?: {
    sampleSize: number;
    openRate: number;
    clickRate: number;
    responseRate: number;
    conversionRate: number;
    revenue: number;
    confidenceLevel: number;
    isWinner?: boolean;
  };
}

export interface ABTest {
  testId: string;
  testName: string;
  templateId: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  variants: ABTestVariant[];
  controlVariant: string; // variantId of control
  minimumSampleSize: number;
  confidenceThreshold: number; // 0-100
  primaryMetric: 'openRate' | 'clickRate' | 'responseRate' | 'conversionRate' | 'revenue';
  winner?: string; // variantId of winner
  results?: {
    totalParticipants: number;
    statisticalSignificance: boolean;
    improvementOverControl: number;
    estimatedAnnualImpact: number;
  };
}

export interface TestRecommendation {
  templateId: string;
  templateName: string;
  recommendationType: 'subject_line' | 'send_time' | 'content' | 'channel' | 'personalization';
  currentPerformance: {
    metric: string;
    value: number;
  };
  suggestedTest: {
    variants: Partial<ABTestVariant>[];
    expectedImprovement: number;
    rationale: string;
  };
  priority: 'high' | 'medium' | 'low';
}

export class ABTestingEngine {
  private static instance: ABTestingEngine;
  private activeTests: Map<string, ABTest> = new Map();

  private constructor() {
    this.loadActiveTests();
  }

  static getInstance(): ABTestingEngine {
    if (!this.instance) {
      this.instance = new ABTestingEngine();
    }
    return this.instance;
  }

  async createABTest(params: {
    testName: string;
    templateId: string;
    variants: Array<{
      name: string;
      allocation: number;
      config: ABTestVariant['config'];
    }>;
    controlVariantIndex?: number;
    minimumSampleSize?: number;
    confidenceThreshold?: number;
    primaryMetric?: ABTest['primaryMetric'];
  }): Promise<ABTest> {
    // Validate allocations sum to 100
    const totalAllocation = params.variants.reduce((sum, v) => sum + v.allocation, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error('Variant allocations must sum to 100%');
    }

    const testId = uuidv4();
    const variants: ABTestVariant[] = params.variants.map((v, index) => ({
      variantId: uuidv4(),
      variantName: v.name,
      allocation: v.allocation,
      config: v.config
    }));

    const test: ABTest = {
      testId,
      testName: params.testName,
      templateId: params.templateId,
      status: 'draft',
      startDate: new Date(),
      variants,
      controlVariant: variants[params.controlVariantIndex || 0].variantId,
      minimumSampleSize: params.minimumSampleSize || 1000,
      confidenceThreshold: params.confidenceThreshold || 95,
      primaryMetric: params.primaryMetric || 'conversionRate'
    };

    // Store test configuration
    await this.saveTest(test);
    this.activeTests.set(testId, test);

    return test;
  }

  async startTest(testId: string): Promise<ABTest> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    if (test.status !== 'draft') {
      throw new Error(`Test ${testId} is already ${test.status}`);
    }

    test.status = 'running';
    test.startDate = new Date();
    
    await this.saveTest(test);
    return test;
  }

  async pauseTest(testId: string): Promise<ABTest> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    if (test.status !== 'running') {
      throw new Error(`Test ${testId} is not running`);
    }

    test.status = 'paused';
    await this.saveTest(test);
    return test;
  }

  async completeTest(testId: string): Promise<ABTest> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    // Calculate final results
    const results = await this.calculateTestResults(test);
    
    test.status = 'completed';
    test.endDate = new Date();
    test.results = results.summary;
    test.winner = results.winner;
    
    // Update variant metrics
    test.variants = results.variantMetrics;

    await this.saveTest(test);
    return test;
  }

  async getVariantForContact(testId: string, contactId: string): Promise<ABTestVariant | null> {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') {
      return null;
    }

    // Use consistent hashing to assign contacts to variants
    const hash = this.hashString(`${testId}-${contactId}`);
    const bucket = hash % 100;

    let cumulativeAllocation = 0;
    for (const variant of test.variants) {
      cumulativeAllocation += variant.allocation;
      if (bucket < cumulativeAllocation) {
        return variant;
      }
    }

    // Fallback to control variant
    return test.variants.find(v => v.variantId === test.controlVariant) || null;
  }

  async logInteraction(params: {
    testId: string;
    variantId: string;
    contactId: string;
    interactionType: 'sent' | 'delivered' | 'opened' | 'clicked' | 'responded' | 'converted';
    metadata?: Record<string, any>;
  }): Promise<void> {
    const test = this.activeTests.get(params.testId);
    if (!test) return;

    // Log to automation logs with test metadata
    const { error } = await supabase
      .from('automation_logs')
      .insert({
        id: uuidv4(),
        template_id: test.templateId,
        status: 'completed',
        metadata: {
          testId: params.testId,
          variantId: params.variantId,
          contactId: params.contactId,
          interactionType: params.interactionType,
          ...params.metadata
        },
        created_at: new Date(),
        updated_at: new Date()
      });

    if (error) {
      console.error('Error logging interaction:', error);
    }

    // Check if test should be completed
    if (await this.shouldCompleteTest(test)) {
      await this.completeTest(params.testId);
    }
  }

  async getTestResults(testId: string): Promise<{
    test: ABTest;
    variantMetrics: ABTestVariant[];
    summary: ABTest['results'];
    winner: string | undefined;
  }> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    return await this.calculateTestResults(test);
  }

  private async calculateTestResults(test: ABTest): Promise<{
    test: ABTest;
    variantMetrics: ABTestVariant[];
    summary: ABTest['results'];
    winner: string | undefined;
  }> {
    const variantMetrics: ABTestVariant[] = [];
    let controlMetrics: ABTestVariant['metrics'] | undefined;

    for (const variant of test.variants) {
      const metrics = await this.calculateVariantMetrics(test.testId, variant.variantId);
      const variantWithMetrics = { ...variant, metrics };
      variantMetrics.push(variantWithMetrics);

      if (variant.variantId === test.controlVariant) {
        controlMetrics = metrics;
      }
    }

    // Determine winner based on primary metric
    const winner = this.determineWinner(variantMetrics, test.primaryMetric, test.confidenceThreshold);
    
    // Calculate summary statistics
    const totalParticipants = variantMetrics.reduce((sum, v) => sum + (v.metrics?.sampleSize || 0), 0);
    const winnerVariant = variantMetrics.find(v => v.variantId === winner);
    const improvementOverControl = this.calculateImprovement(
      controlMetrics,
      winnerVariant?.metrics,
      test.primaryMetric
    );

    const summary: ABTest['results'] = {
      totalParticipants,
      statisticalSignificance: this.isStatisticallySignificant(
        variantMetrics,
        test.confidenceThreshold
      ),
      improvementOverControl,
      estimatedAnnualImpact: this.estimateAnnualImpact(
        test,
        improvementOverControl,
        totalParticipants
      )
    };

    return {
      test,
      variantMetrics,
      summary,
      winner
    };
  }

  private async calculateVariantMetrics(
    testId: string,
    variantId: string
  ): Promise<ABTestVariant['metrics']> {
    const { data: logs, error } = await supabase
      .from('automation_logs')
      .select('metadata')
      .eq('metadata->>testId', testId)
      .eq('metadata->>variantId', variantId);

    if (error) {
      console.error('Error fetching variant metrics:', error);
      return {
        sampleSize: 0,
        openRate: 0,
        clickRate: 0,
        responseRate: 0,
        conversionRate: 0,
        revenue: 0,
        confidenceLevel: 0
      };
    }

    // Calculate metrics from logs
    const metrics = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      responded: 0,
      converted: 0,
      revenue: 0,
      uniqueContacts: new Set<string>()
    };

    (logs || []).forEach(log => {
      const metadata = log.metadata as any;
      if (metadata.interactionType === 'sent') metrics.sent++;
      if (metadata.interactionType === 'delivered') metrics.delivered++;
      if (metadata.interactionType === 'opened') metrics.opened++;
      if (metadata.interactionType === 'clicked') metrics.clicked++;
      if (metadata.interactionType === 'responded') metrics.responded++;
      if (metadata.interactionType === 'converted') metrics.converted++;
      if (metadata.revenue) metrics.revenue += Number(metadata.revenue);
      if (metadata.contactId) metrics.uniqueContacts.add(metadata.contactId);
    });

    const sampleSize = metrics.uniqueContacts.size;
    const openRate = metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0;
    const clickRate = metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0;
    const responseRate = metrics.delivered > 0 ? (metrics.responded / metrics.delivered) * 100 : 0;
    const conversionRate = metrics.delivered > 0 ? (metrics.converted / metrics.delivered) * 100 : 0;

    // Calculate confidence level using z-test
    const confidenceLevel = this.calculateConfidenceLevel(
      sampleSize,
      conversionRate / 100,
      0.05 // Standard error assumption
    );

    return {
      sampleSize,
      openRate,
      clickRate,
      responseRate,
      conversionRate,
      revenue: metrics.revenue,
      confidenceLevel
    };
  }

  async getTestRecommendations(
    limit: number = 10
  ): Promise<TestRecommendation[]> {
    // Get all templates
    const { data: templates, error: templatesError } = await supabase
      .from('automation_templates')
      .select('id, name, template_type');

    if (templatesError || !templates) {
      console.error('Error fetching templates:', templatesError);
      return [];
    }

    // Get performance data for each template
    const templatePerformance = [];
    
    for (const template of templates) {
      const { data: logs, error: logsError } = await supabase
        .from('automation_logs')
        .select('metadata')
        .eq('metadata->>templateId', template.id);

      if (!logsError && logs && logs.length > 100) {
        let opened = 0, clicked = 0, responded = 0, converted = 0;
        
        logs.forEach(log => {
          const metadata = log.metadata as any;
          if (metadata.opened) opened++;
          if (metadata.clicked) clicked++;
          if (metadata.responded) responded++;
          if (metadata.converted) converted++;
        });

        const executions = logs.length;
        templatePerformance.push({
          templateId: template.id,
          templateName: template.name,
          templateType: template.template_type,
          executions,
          openRate: (opened / executions) * 100,
          clickRate: (clicked / executions) * 100,
          responseRate: (responded / executions) * 100,
          conversionRate: (converted / executions) * 100
        });
      }
    }

    // Sort by executions
    templatePerformance.sort((a, b) => b.executions - a.executions);

    const recommendations: TestRecommendation[] = [];

    for (const template of templates) {
      // Check if template already has active tests
      const hasActiveTest = Array.from(this.activeTests.values()).some(
        test => test.templateId === template.id && test.status === 'running'
      );

      if (hasActiveTest) continue;

      // Generate recommendations based on performance
      const recommendation = this.generateRecommendation(template);
      if (recommendation) {
        recommendations.push(recommendation);
      }

      if (recommendations.length >= limit) break;
    }

    return recommendations;
  }

  private generateRecommendation(template: any): TestRecommendation | null {
    const recommendations: TestRecommendation[] = [];

    // Subject line test for low open rates
    if (template.openRate < 20) {
      recommendations.push({
        templateId: template.templateId,
        templateName: template.templateName,
        recommendationType: 'subject_line',
        currentPerformance: {
          metric: 'openRate',
          value: template.openRate
        },
        suggestedTest: {
          variants: [
            { variantName: 'Control', allocation: 50, config: {} },
            { variantName: 'Urgency', allocation: 25, config: { subjectLine: 'Limited Time: {original}' } },
            { variantName: 'Personalized', allocation: 25, config: { subjectLine: '{firstName}, {original}' } }
          ],
          expectedImprovement: 25,
          rationale: 'Low open rate suggests subject line optimization opportunity'
        },
        priority: 'high'
      });
    }

    // Send time test for average performance
    if (template.executions > 500 && template.openRate < 30) {
      recommendations.push({
        templateId: template.templateId,
        templateName: template.templateName,
        recommendationType: 'send_time',
        currentPerformance: {
          metric: 'openRate',
          value: template.openRate
        },
        suggestedTest: {
          variants: [
            { variantName: 'Morning (8AM)', allocation: 25, config: { sendTime: '08:00' } },
            { variantName: 'Lunch (12PM)', allocation: 25, config: { sendTime: '12:00' } },
            { variantName: 'Afternoon (3PM)', allocation: 25, config: { sendTime: '15:00' } },
            { variantName: 'Evening (6PM)', allocation: 25, config: { sendTime: '18:00' } }
          ],
          expectedImprovement: 15,
          rationale: 'Testing optimal send times can improve engagement'
        },
        priority: 'medium'
      });
    }

    // Channel test for multi-channel templates
    if (template.responseRate < 5) {
      recommendations.push({
        templateId: template.templateId,
        templateName: template.templateName,
        recommendationType: 'channel',
        currentPerformance: {
          metric: 'responseRate',
          value: template.responseRate
        },
        suggestedTest: {
          variants: [
            { variantName: 'Email Only', allocation: 33, config: { channel: 'email' } },
            { variantName: 'SMS Follow-up', allocation: 33, config: { channel: 'sms' } },
            { variantName: 'Multi-channel', allocation: 34, config: { channel: 'email' } }
          ],
          expectedImprovement: 40,
          rationale: 'Low response rate may benefit from channel optimization'
        },
        priority: 'high'
      });
    }

    // Return highest priority recommendation
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })[0] || null;
  }

  private determineWinner(
    variants: ABTestVariant[],
    primaryMetric: ABTest['primaryMetric'],
    confidenceThreshold: number
  ): string | undefined {
    // Filter variants with sufficient sample size
    const qualifiedVariants = variants.filter(
      v => v.metrics && v.metrics.sampleSize >= 100
    );

    if (qualifiedVariants.length < 2) return undefined;

    // Sort by primary metric
    const sorted = qualifiedVariants.sort((a, b) => {
      const aValue = a.metrics![primaryMetric as keyof ABTestVariant['metrics']] as number;
      const bValue = b.metrics![primaryMetric as keyof ABTestVariant['metrics']] as number;
      return bValue - aValue;
    });

    const best = sorted[0];
    const second = sorted[1];

    // Check if difference is statistically significant
    if (best.metrics!.confidenceLevel >= confidenceThreshold) {
      return best.variantId;
    }

    return undefined;
  }

  private calculateImprovement(
    controlMetrics?: ABTestVariant['metrics'],
    winnerMetrics?: ABTestVariant['metrics'],
    primaryMetric?: ABTest['primaryMetric']
  ): number {
    if (!controlMetrics || !winnerMetrics || !primaryMetric) return 0;

    const controlValue = controlMetrics[primaryMetric as keyof ABTestVariant['metrics']] as number;
    const winnerValue = winnerMetrics[primaryMetric as keyof ABTestVariant['metrics']] as number;

    if (controlValue === 0) return 0;

    return ((winnerValue - controlValue) / controlValue) * 100;
  }

  private isStatisticallySignificant(
    variants: ABTestVariant[],
    confidenceThreshold: number
  ): boolean {
    return variants.some(v => v.metrics && v.metrics.confidenceLevel >= confidenceThreshold);
  }

  private estimateAnnualImpact(
    test: ABTest,
    improvementPercentage: number,
    currentSampleSize: number
  ): number {
    // Estimate based on test duration and sample size
    const testDurationDays = test.endDate
      ? (test.endDate.getTime() - test.startDate.getTime()) / (1000 * 60 * 60 * 24)
      : 30;

    const annualVolume = (currentSampleSize / testDurationDays) * 365;
    const improvementFactor = improvementPercentage / 100;

    // Rough estimate of revenue impact
    return annualVolume * improvementFactor * 1000; // $1000 average value assumption
  }

  private calculateConfidenceLevel(
    sampleSize: number,
    conversionRate: number,
    standardError: number
  ): number {
    if (sampleSize < 30) return 0;

    // Simplified z-score calculation
    const z = Math.sqrt(sampleSize) * (conversionRate - 0.5) / standardError;
    const confidence = this.normalCDF(Math.abs(z)) * 100;

    return Math.min(confidence, 99.9);
  }

  private normalCDF(z: number): number {
    // Approximation of cumulative distribution function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1 / (1 + p * z);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1 + sign * y);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async shouldCompleteTest(test: ABTest): Promise<boolean> {
    // Check if minimum sample size reached for all variants
    let allVariantsReady = true;
    
    for (const variant of test.variants) {
      const metrics = await this.calculateVariantMetrics(test.testId, variant.variantId);
      if (!metrics || metrics.sampleSize < test.minimumSampleSize) {
        allVariantsReady = false;
        break;
      }
    }

    return allVariantsReady;
  }

  private async loadActiveTests(): Promise<void> {
    // In a real implementation, load from database
    // For now, tests are stored in memory
  }

  private async saveTest(test: ABTest): Promise<void> {
    // In a real implementation, save to database
    // For now, tests are stored in memory
    this.activeTests.set(test.testId, test);
  }
}

export const abTestingEngine = ABTestingEngine.getInstance();