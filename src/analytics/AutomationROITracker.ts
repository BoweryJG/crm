import { supabase } from '../services/supabase/supabase';

export interface ROIMetrics {
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  roiPercentage: number;
  averageDealSize: number;
  conversionRate: number;
  timeToConversion: number; // in days
  customerLifetimeValue: number;
}

export interface AutomationROI {
  automationId: string;
  automationName: string;
  automationType: string;
  metrics: ROIMetrics;
  attributedOpportunities: number;
  attributedAccounts: number;
  touchpoints: number;
  firstTouchRevenue: number;
  lastTouchRevenue: number;
  multiTouchRevenue: number;
}

export interface ROIAttribution {
  opportunityId: string;
  opportunityName: string;
  revenue: number;
  automations: Array<{
    automationId: string;
    automationName: string;
    touchType: 'first' | 'last' | 'multi';
    attributionWeight: number;
    attributedRevenue: number;
    touchpointDate: Date;
  }>;
}

export class AutomationROITracker {
  private static instance: AutomationROITracker;

  private constructor() {}

  static getInstance(): AutomationROITracker {
    if (!this.instance) {
      this.instance = new AutomationROITracker();
    }
    return this.instance;
  }

  async calculateAutomationROI(
    automationId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<AutomationROI> {
    // Get automation details
    const { data: automation, error } = await supabase
      .from('automation_templates')
      .select('*')
      .eq('id', automationId)
      .single();

    if (error || !automation) {
      throw new Error(`Automation ${automationId} not found`);
    }

    // Get all logs for this automation
    let query = supabase
      .from('automation_logs')
      .select('id, metadata, created_at, status')
      .eq('metadata->>templateId', automationId);

    const { data: logsData, error: logsError } = await query;

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      return this.getEmptyROI(automationId, automation.name, automation.template_type);
    }

    // Filter by time range if provided and map logs
    let logs = (logsData || []).map(log => ({
      logId: log.id,
      contactId: log.metadata?.contactId || '',
      accountId: log.metadata?.accountId || '',
      cost: Number(log.metadata?.cost || 0),
      createdAt: new Date(log.created_at),
      status: log.status
    }));

    if (timeRange) {
      logs = logs.filter(log => 
        log.createdAt >= timeRange.start && log.createdAt <= timeRange.end
      );
    }

    // Get attributed opportunities
    const attributedOpps = await this.getAttributedOpportunities(automationId, timeRange);
    
    // Calculate metrics
    const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
    const touchpoints = logs.length;
    
    // Calculate revenue attribution
    const { firstTouch, lastTouch, multiTouch } = await this.calculateRevenuAttribution(
      automationId,
      attributedOpps
    );

    const totalRevenue = firstTouch + lastTouch + multiTouch;
    const profit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? profit / totalCost : 0;
    const roiPercentage = roi * 100;

    // Calculate conversion metrics
    const conversions = attributedOpps.filter(opp => opp.status === 'closed_won').length;
    const conversionRate = touchpoints > 0 ? (conversions / touchpoints) * 100 : 0;
    
    const averageDealSize = conversions > 0
      ? attributedOpps
          .filter(opp => opp.status === 'closed_won')
          .reduce((sum, opp) => sum + (opp.amount || 0), 0) / conversions
      : 0;

    // Calculate time to conversion
    const timeToConversion = await this.calculateAverageTimeToConversion(automationId, attributedOpps);
    
    // Calculate CLV
    const clv = await this.calculateCustomerLifetimeValue(automationId);

    return {
      automationId,
      automationName: automation.name,
      automationType: automation.template_type,
      metrics: {
        revenue: totalRevenue,
        cost: totalCost,
        profit,
        roi,
        roiPercentage,
        averageDealSize,
        conversionRate,
        timeToConversion,
        customerLifetimeValue: clv
      },
      attributedOpportunities: attributedOpps.length,
      attributedAccounts: new Set(attributedOpps.map(opp => opp.accountId)).size,
      touchpoints,
      firstTouchRevenue: firstTouch,
      lastTouchRevenue: lastTouch,
      multiTouchRevenue: multiTouch
    };
  }

  async getAttributedOpportunities(
    automationId: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<any[]> {
    // First get all logs for this automation to find account IDs
    const { data: logs, error: logsError } = await supabase
      .from('automation_logs')
      .select('metadata')
      .eq('metadata->>templateId', automationId);

    if (logsError || !logs) {
      console.error('Error fetching logs:', logsError);
      return [];
    }

    // Extract unique account IDs
    const accountIds = Array.from(new Set(logs
      .map(log => log.metadata?.accountId)
      .filter(Boolean)
    ));

    if (accountIds.length === 0) {
      return [];
    }

    // Find opportunities for these accounts
    let query = supabase
      .from('opportunities')
      .select('*')
      .in('account_id', accountIds);

    const { data: opportunities, error: oppsError } = await query;

    if (oppsError || !opportunities) {
      console.error('Error fetching opportunities:', oppsError);
      return [];
    }

    // Filter by time range if provided
    let filteredOpps = opportunities;
    if (timeRange) {
      filteredOpps = filteredOpps.filter(opp => {
        const closedAt = opp.closed_at ? new Date(opp.closed_at) : null;
        return closedAt && closedAt >= timeRange.start && closedAt <= timeRange.end;
      });
    }

    // Map to expected format
    return filteredOpps.map(opp => ({
      opportunityId: opp.id,
      opportunityName: opp.name,
      accountId: opp.account_id,
      amount: opp.amount,
      status: opp.status,
      closedAt: opp.closed_at ? new Date(opp.closed_at) : null,
      createdAt: new Date(opp.created_at)
    }));
  }

  async calculateRevenuAttribution(
    automationId: string,
    opportunities: any[]
  ): Promise<{ firstTouch: number; lastTouch: number; multiTouch: number }> {
    let firstTouch = 0;
    let lastTouch = 0;
    let multiTouch = 0;

    for (const opp of opportunities) {
      if (opp.status !== 'closed_won' || !opp.amount) continue;

      // Get all automation touchpoints for this opportunity's account
      const { data: touchpointsData, error: touchpointsError } = await supabase
        .from('automation_logs')
        .select('metadata, created_at')
        .eq('metadata->>accountId', opp.accountId)
        .lte('created_at', opp.closedAt.toISOString());

      if (touchpointsError || !touchpointsData) {
        console.error('Error fetching touchpoints:', touchpointsError);
        continue;
      }

      const touchpoints = touchpointsData
        .map(tp => ({
          automationId: tp.metadata?.templateId || '',
          createdAt: new Date(tp.created_at)
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      if (touchpoints.length === 0) continue;

      // First touch attribution
      if (touchpoints[0].automationId === automationId) {
        firstTouch += opp.amount;
      }

      // Last touch attribution
      if (touchpoints[touchpoints.length - 1].automationId === automationId) {
        lastTouch += opp.amount;
      }

      // Multi-touch attribution (equal credit)
      const automationTouchpoints = touchpoints.filter(tp => tp.automationId === automationId);
      if (automationTouchpoints.length > 0) {
        const attributionWeight = automationTouchpoints.length / touchpoints.length;
        multiTouch += opp.amount * attributionWeight;
      }
    }

    return { firstTouch, lastTouch, multiTouch };
  }

  async getROIByAutomationType(
    timeRange?: { start: Date; end: Date }
  ): Promise<Record<string, ROIMetrics>> {
    const { data: automations, error } = await supabase
      .from('automation_templates')
      .select('*');

    if (error || !automations) {
      console.error('Error fetching automations:', error);
      return {};
    }

    const roiByType: Record<string, { revenue: number; cost: number; conversions: number; touchpoints: number }> = {};

    for (const automation of automations) {
      const roi = await this.calculateAutomationROI(automation.id, timeRange);
      
      if (!roiByType[automation.template_type]) {
        roiByType[automation.template_type] = {
          revenue: 0,
          cost: 0,
          conversions: 0,
          touchpoints: 0
        };
      }

      roiByType[automation.template_type].revenue += roi.metrics.revenue;
      roiByType[automation.template_type].cost += roi.metrics.cost;
      roiByType[automation.template_type].conversions += roi.attributedOpportunities;
      roiByType[automation.template_type].touchpoints += roi.touchpoints;
    }

    // Convert to ROIMetrics format
    const result: Record<string, ROIMetrics> = {};
    
    for (const [type, data] of Object.entries(roiByType)) {
      const profit = data.revenue - data.cost;
      const roi = data.cost > 0 ? profit / data.cost : 0;
      const conversionRate = data.touchpoints > 0 ? (data.conversions / data.touchpoints) * 100 : 0;
      const averageDealSize = data.conversions > 0 ? data.revenue / data.conversions : 0;

      result[type] = {
        revenue: data.revenue,
        cost: data.cost,
        profit,
        roi,
        roiPercentage: roi * 100,
        averageDealSize,
        conversionRate,
        timeToConversion: 0, // Will be calculated separately
        customerLifetimeValue: 0 // Will be calculated separately
      };
    }

    return result;
  }

  async getOpportunityAttribution(opportunityId: string): Promise<ROIAttribution> {
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (oppError || !opportunity) {
      throw new Error(`Opportunity ${opportunityId} not found`);
    }

    // Get all automation touchpoints before opportunity close
    const { data: logs, error: logsError } = await supabase
      .from('automation_logs')
      .select('metadata, created_at')
      .eq('metadata->>accountId', opportunity.account_id)
      .lte('created_at', opportunity.closed_at);

    if (logsError || !logs) {
      console.error('Error fetching touchpoints:', logsError);
      return {
        opportunityId: opportunity.id,
        opportunityName: opportunity.name,
        revenue: opportunity.amount || 0,
        automations: []
      };
    }

    // Get automation details
    const automationIds = Array.from(new Set(logs.map(log => log.metadata?.templateId).filter(Boolean)));
    const { data: automations, error: autoError } = await supabase
      .from('automation_templates')
      .select('id, name')
      .in('id', automationIds);

    if (autoError) {
      console.error('Error fetching automations:', autoError);
    }

    const automationMap = new Map((automations || []).map(a => [a.id, a.name]));

    const touchpoints = logs
      .filter(log => log.metadata?.templateId)
      .map(log => ({
        automationId: log.metadata.templateId,
        automationName: automationMap.get(log.metadata.templateId) || 'Unknown',
        createdAt: new Date(log.created_at)
      }))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const revenue = opportunity.amount || 0;
    const automationAttributions = touchpoints.map((tp, index) => {
      const isFirst = index === 0;
      const isLast = index === touchpoints.length - 1;
      const touchType = isFirst ? 'first' : isLast ? 'last' : 'multi';
      const attributionWeight = 1 / touchpoints.length; // Equal attribution
      
      return {
        automationId: tp.automationId,
        automationName: tp.automationName,
        touchType: touchType as 'first' | 'last' | 'multi',
        attributionWeight,
        attributedRevenue: revenue * attributionWeight,
        touchpointDate: tp.createdAt
      };
    });

    return {
      opportunityId: opportunity.id,
      opportunityName: opportunity.name,
      revenue,
      automations: automationAttributions
    };
  }

  private async calculateAverageTimeToConversion(
    automationId: string,
    opportunities: any[]
  ): Promise<number> {
    const conversionTimes: number[] = [];

    for (const opp of opportunities) {
      if (opp.status !== 'closed_won') continue;

      // Get first touchpoint for this opportunity
      const { data: firstTouchData, error: _error } = await supabase
        .from('automation_logs')
        .select('created_at')
        .eq('metadata->>accountId', opp.accountId)
        .eq('metadata->>templateId', automationId)
        .order('created_at', { ascending: true })
        .limit(1);

      const firstTouch = firstTouchData?.[0];

      if (firstTouch && opp.closedAt) {
        const timeDiff = opp.closedAt.getTime() - new Date(firstTouch.created_at).getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        conversionTimes.push(daysDiff);
      }
    }

    return conversionTimes.length > 0
      ? conversionTimes.reduce((sum, time) => sum + time, 0) / conversionTimes.length
      : 0;
  }

  private async calculateCustomerLifetimeValue(automationId: string): Promise<number> {
    // Get all accounts touched by this automation
    const { data: logs, error: logsError } = await supabase
      .from('automation_logs')
      .select('metadata')
      .eq('metadata->>templateId', automationId);

    if (logsError || !logs) {
      console.error('Error fetching logs:', logsError);
      return 0;
    }

    // Extract unique account IDs
    const accountIds = Array.from(new Set(logs
      .map(log => log.metadata?.accountId)
      .filter(Boolean)
    ));

    if (accountIds.length === 0) {
      return 0;
    }

    let totalCLV = 0;
    let accountCount = 0;

    for (const accountId of accountIds) {
      // Get all closed won opportunities for this account
      const { data: opportunities, error: oppsError } = await supabase
        .from('opportunities')
        .select('amount')
        .eq('account_id', accountId)
        .eq('status', 'closed_won');

      if (!oppsError && opportunities) {
        const accountRevenue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
        if (accountRevenue > 0) {
          totalCLV += accountRevenue;
          accountCount++;
        }
      }
    }

    return accountCount > 0 ? totalCLV / accountCount : 0;
  }

  async getROIDashboardData(timeRange?: { start: Date; end: Date }): Promise<{
    totalRevenue: number;
    totalCost: number;
    totalROI: number;
    topPerformers: AutomationROI[];
    roiByType: Record<string, ROIMetrics>;
    attributionBreakdown: {
      firstTouch: number;
      lastTouch: number;
      multiTouch: number;
    };
  }> {
    const { data: automations, error } = await supabase
      .from('automation_templates')
      .select('*');

    if (error || !automations) {
      console.error('Error fetching automations:', error);
      return {
        totalRevenue: 0,
        totalCost: 0,
        totalROI: 0,
        topPerformers: [],
        roiByType: {},
        attributionBreakdown: {
          firstTouch: 0,
          lastTouch: 0,
          multiTouch: 0
        }
      };
    }

    const allROIs: AutomationROI[] = [];
    
    let totalFirstTouch = 0;
    let totalLastTouch = 0;
    let totalMultiTouch = 0;

    for (const automation of automations) {
      try {
        const roi = await this.calculateAutomationROI(automation.id, timeRange);
        allROIs.push(roi);
        
        totalFirstTouch += roi.firstTouchRevenue;
        totalLastTouch += roi.lastTouchRevenue;
        totalMultiTouch += roi.multiTouchRevenue;
      } catch (error) {
        console.error(`Error calculating ROI for ${automation.id}:`, error);
      }
    }

    const totalRevenue = allROIs.reduce((sum, roi) => sum + roi.metrics.revenue, 0);
    const totalCost = allROIs.reduce((sum, roi) => sum + roi.metrics.cost, 0);
    const totalROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

    const topPerformers = allROIs
      .sort((a, b) => b.metrics.roi - a.metrics.roi)
      .slice(0, 5);

    const roiByType = await this.getROIByAutomationType(timeRange);

    return {
      totalRevenue,
      totalCost,
      totalROI,
      topPerformers,
      roiByType,
      attributionBreakdown: {
        firstTouch: totalFirstTouch,
        lastTouch: totalLastTouch,
        multiTouch: totalMultiTouch
      }
    };
  }

  private getEmptyROI(automationId: string, automationName: string, automationType: string): AutomationROI {
    return {
      automationId,
      automationName,
      automationType,
      metrics: {
        revenue: 0,
        cost: 0,
        profit: 0,
        roi: 0,
        roiPercentage: 0,
        averageDealSize: 0,
        conversionRate: 0,
        timeToConversion: 0,
        customerLifetimeValue: 0
      },
      attributedOpportunities: 0,
      attributedAccounts: 0,
      touchpoints: 0,
      firstTouchRevenue: 0,
      lastTouchRevenue: 0,
      multiTouchRevenue: 0
    };
  }
}

export const automationROITracker = AutomationROITracker.getInstance();