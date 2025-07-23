import { supabase } from '../services/supabase/supabase';

export interface TemplateMetrics {
  templateId: string;
  templateName: string;
  templateType: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageEngagementRate: number;
  averageResponseTime: number; // in hours
  conversionRate: number;
  revenueAttributed: number;
  costPerExecution: number;
  roi: number;
  lastExecuted: Date | null;
  performanceTrend: 'improving' | 'stable' | 'declining';
}

export interface TemplatePerformanceReport {
  topPerformers: TemplateMetrics[];
  underperformers: TemplateMetrics[];
  byCategory: Record<string, TemplateMetrics[]>;
  overallStats: {
    totalTemplates: number;
    activeTemplates: number;
    averageSuccessRate: number;
    totalRevenue: number;
    totalCost: number;
    overallROI: number;
  };
}

export class TemplateAnalytics {
  private static instance: TemplateAnalytics;

  private constructor() {}

  static getInstance(): TemplateAnalytics {
    if (!this.instance) {
      this.instance = new TemplateAnalytics();
    }
    return this.instance;
  }

  async getTemplateMetrics(templateId: string, timeRange?: { start: Date; end: Date }): Promise<TemplateMetrics> {
    // First, get the template details
    const { data: template, error: templateError } = await supabase
      .from('automation_templates')
      .select('id, name, template_type')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Build the query for automation logs
    let logsQuery = supabase
      .from('automation_logs')
      .select('id, status, metadata, created_at')
      .eq('metadata->>templateId', templateId);

    // Apply time range filter if provided
    if (timeRange) {
      logsQuery = logsQuery
        .gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString());
    }

    const { data: logs, error: logsError } = await logsQuery;

    if (logsError) {
      console.error('Error fetching automation logs:', logsError);
      throw new Error('Failed to fetch automation logs');
    }

    // Process the logs in JavaScript to calculate aggregations
    const metrics = {
      templateId: template.id,
      templateName: template.name,
      templateType: template.template_type,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      engagementCount: 0,
      responseTimeSum: 0,
      responseCount: 0,
      conversions: 0,
      revenueSum: 0,
      costSum: 0,
      lastExecuted: null as Date | null
    };

    if (logs && logs.length > 0) {
      // Use a Set to track unique IDs
      const uniqueIds = new Set<string>();
      const successfulIds = new Set<string>();
      const failedIds = new Set<string>();
      const engagedIds = new Set<string>();
      const responseIds = new Set<string>();
      const convertedIds = new Set<string>();

      logs.forEach(log => {
        uniqueIds.add(log.id);
        
        if (log.status === 'completed') {
          successfulIds.add(log.id);
        } else if (log.status === 'failed') {
          failedIds.add(log.id);
        }

        if (log.metadata) {
          if (log.metadata.engaged === 'true') {
            engagedIds.add(log.id);
          }
          
          if (log.metadata.responseTimeHours !== undefined && log.metadata.responseTimeHours !== null) {
            responseIds.add(log.id);
            metrics.responseTimeSum += parseFloat(log.metadata.responseTimeHours);
          }
          
          if (log.metadata.converted === 'true') {
            convertedIds.add(log.id);
          }
          
          if (log.metadata.revenue) {
            metrics.revenueSum += parseFloat(log.metadata.revenue);
          }
          
          if (log.metadata.cost) {
            metrics.costSum += parseFloat(log.metadata.cost);
          }
        }
      });

      metrics.totalExecutions = uniqueIds.size;
      metrics.successfulExecutions = successfulIds.size;
      metrics.failedExecutions = failedIds.size;
      metrics.engagementCount = engagedIds.size;
      metrics.responseCount = responseIds.size;
      metrics.conversions = convertedIds.size;

      // Find the latest execution date
      const dates = logs.map(log => new Date(log.created_at));
      metrics.lastExecuted = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
    }

    const successRate = metrics.totalExecutions > 0 
      ? (metrics.successfulExecutions / metrics.totalExecutions) * 100 
      : 0;

    const engagementRate = metrics.successfulExecutions > 0
      ? (metrics.engagementCount / metrics.successfulExecutions) * 100
      : 0;

    const avgResponseTime = metrics.responseCount > 0
      ? metrics.responseTimeSum / metrics.responseCount
      : 0;

    const conversionRate = metrics.totalExecutions > 0
      ? (metrics.conversions / metrics.totalExecutions) * 100
      : 0;

    const roi = metrics.costSum > 0
      ? ((metrics.revenueSum - metrics.costSum) / metrics.costSum) * 100
      : 0;

    const costPerExecution = metrics.totalExecutions > 0
      ? metrics.costSum / metrics.totalExecutions
      : 0;

    // Calculate performance trend
    const trend = await this.calculatePerformanceTrend(templateId);

    return {
      templateId: metrics.templateId,
      templateName: metrics.templateName,
      templateType: metrics.templateType,
      totalExecutions: metrics.totalExecutions,
      successfulExecutions: metrics.successfulExecutions,
      failedExecutions: metrics.failedExecutions,
      successRate,
      averageEngagementRate: engagementRate,
      averageResponseTime: avgResponseTime,
      conversionRate,
      revenueAttributed: metrics.revenueSum,
      costPerExecution,
      roi,
      lastExecuted: metrics.lastExecuted,
      performanceTrend: trend
    };
  }

  async getAllTemplateMetrics(timeRange?: { start: Date; end: Date }): Promise<TemplateMetrics[]> {
    const { data: templates, error } = await supabase
      .from('automation_templates')
      .select('*');

    if (error) {
      console.error('Error fetching automation templates:', error);
      throw new Error('Failed to fetch automation templates');
    }

    const metrics: TemplateMetrics[] = [];

    for (const template of templates || []) {
      try {
        const metric = await this.getTemplateMetrics(template.id, timeRange);
        metrics.push(metric);
      } catch (error) {
        console.error(`Error getting metrics for template ${template.id}:`, error);
      }
    }

    return metrics;
  }

  async getPerformanceReport(timeRange?: { start: Date; end: Date }): Promise<TemplatePerformanceReport> {
    const allMetrics = await this.getAllTemplateMetrics(timeRange);

    // Sort by ROI to get top and under performers
    const sortedByROI = [...allMetrics].sort((a, b) => b.roi - a.roi);
    const topPerformers = sortedByROI.slice(0, 5);
    const underperformers = sortedByROI.slice(-5).reverse();

    // Group by category
    const byCategory: Record<string, TemplateMetrics[]> = {};
    allMetrics.forEach(metric => {
      if (!byCategory[metric.templateType]) {
        byCategory[metric.templateType] = [];
      }
      byCategory[metric.templateType].push(metric);
    });

    // Calculate overall stats
    const activeTemplates = allMetrics.filter(m => m.totalExecutions > 0).length;
    const totalRevenue = allMetrics.reduce((sum, m) => sum + m.revenueAttributed, 0);
    const totalCost = allMetrics.reduce((sum, m) => sum + (m.costPerExecution * m.totalExecutions), 0);
    const avgSuccessRate = allMetrics.length > 0
      ? allMetrics.reduce((sum, m) => sum + m.successRate, 0) / allMetrics.length
      : 0;

    return {
      topPerformers,
      underperformers,
      byCategory,
      overallStats: {
        totalTemplates: allMetrics.length,
        activeTemplates,
        averageSuccessRate: avgSuccessRate,
        totalRevenue,
        totalCost,
        overallROI: totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0
      }
    };
  }

  async getTemplateEngagementByStakeholder(
    templateId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<Record<string, number>> {
    // Build the query for automation logs
    let logsQuery = supabase
      .from('automation_logs')
      .select('id, metadata, created_at')
      .eq('metadata->>templateId', templateId)
      .eq('metadata->>engaged', 'true');

    // Apply time range filter if provided
    if (timeRange) {
      logsQuery = logsQuery
        .gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString());
    }

    const { data: logs, error: logsError } = await logsQuery;

    if (logsError) {
      console.error('Error fetching automation logs:', logsError);
      throw new Error('Failed to fetch automation logs');
    }

    if (!logs || logs.length === 0) {
      return {};
    }

    // Extract unique contact IDs from the logs
    const contactIds = Array.from(new Set(logs
      .map(log => log.metadata?.contactId)
      .filter(id => id)
    ));

    if (contactIds.length === 0) {
      return {};
    }

    // Fetch contact details
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id, title')
      .in('id', contactIds);

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      throw new Error('Failed to fetch contacts');
    }

    // Create a map of contact ID to title
    const contactTitleMap = new Map(
      (contacts || []).map(contact => [contact.id, contact.title || ''])
    );

    // Count engagements by stakeholder type
    const engagementCounts: Record<string, number> = {};

    logs.forEach(log => {
      const contactId = log.metadata?.contactId;
      if (contactId) {
        const title = contactTitleMap.get(contactId) || '';
        const stakeholderType = this.categorizeStakeholder(title);
        engagementCounts[stakeholderType] = (engagementCounts[stakeholderType] || 0) + 1;
      }
    });

    return engagementCounts;
  }

  async getTemplateExecutionTimeline(
    templateId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<Array<{ date: Date; executions: number; successes: number; failures: number }>> {
    // Build the query for automation logs
    let logsQuery = supabase
      .from('automation_logs')
      .select('id, status, created_at')
      .eq('metadata->>templateId', templateId);

    // Apply time range filter if provided
    if (timeRange) {
      logsQuery = logsQuery
        .gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString());
    }

    const { data: logs, error } = await logsQuery;

    if (error) {
      console.error('Error fetching automation logs:', error);
      throw new Error('Failed to fetch automation logs');
    }

    if (!logs || logs.length === 0) {
      return [];
    }

    // Group logs by date and calculate counts
    const timelineMap = new Map<string, { date: Date; executions: number; successes: number; failures: number }>();

    logs.forEach(log => {
      const date = new Date(log.created_at);
      const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      if (!timelineMap.has(dateKey)) {
        timelineMap.set(dateKey, {
          date: new Date(dateKey),
          executions: 0,
          successes: 0,
          failures: 0
        });
      }
      
      const dayData = timelineMap.get(dateKey)!;
      dayData.executions++;
      
      if (log.status === 'completed') {
        dayData.successes++;
      } else if (log.status === 'failed') {
        dayData.failures++;
      }
    });

    // Convert map to sorted array
    const timeline = Array.from(timelineMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return timeline;
  }

  private async calculatePerformanceTrend(templateId: string): Promise<'improving' | 'stable' | 'declining'> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentMetrics = await this.getTemplateMetrics(templateId, {
      start: thirtyDaysAgo,
      end: new Date()
    });

    const previousMetrics = await this.getTemplateMetrics(templateId, {
      start: sixtyDaysAgo,
      end: thirtyDaysAgo
    });

    const recentScore = this.calculatePerformanceScore(recentMetrics);
    const previousScore = this.calculatePerformanceScore(previousMetrics);

    const change = ((recentScore - previousScore) / previousScore) * 100;

    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  private calculatePerformanceScore(metrics: TemplateMetrics): number {
    // Weighted score based on key metrics
    return (
      metrics.successRate * 0.3 +
      metrics.averageEngagementRate * 0.2 +
      metrics.conversionRate * 0.3 +
      Math.min(metrics.roi / 100, 1) * 0.2
    );
  }

  private categorizeStakeholder(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('doctor') || lowerTitle.includes('physician') || lowerTitle.includes('surgeon')) {
      return 'Doctor';
    }
    if (lowerTitle.includes('nurse') || lowerTitle.includes('rn')) {
      return 'Nurse';
    }
    if (lowerTitle.includes('admin') || lowerTitle.includes('manager') || lowerTitle.includes('director')) {
      return 'Administrator';
    }
    if (lowerTitle.includes('tech') || lowerTitle.includes('technician')) {
      return 'Technician';
    }
    return 'Other';
  }

  async compareTemplates(
    templateIds: string[],
    timeRange?: { start: Date; end: Date }
  ): Promise<{ templateId: string; metrics: TemplateMetrics; rank: number }[]> {
    const results = await Promise.all(
      templateIds.map(id => this.getTemplateMetrics(id, timeRange))
    );

    // Sort by performance score
    const ranked = results
      .map(metrics => ({
        templateId: metrics.templateId,
        metrics,
        score: this.calculatePerformanceScore(metrics)
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        templateId: item.templateId,
        metrics: item.metrics,
        rank: index + 1
      }));

    return ranked;
  }
}

export const templateAnalytics = TemplateAnalytics.getInstance();