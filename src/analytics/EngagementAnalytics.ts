import { supabase } from '../services/supabase/supabase';
import type { AutomationLog, AutomationTemplate, Contact, Account } from '../db/schema';

export interface StakeholderEngagement {
  stakeholderType: 'Doctor' | 'Nurse' | 'Administrator' | 'Technician' | 'Other';
  totalContacts: number;
  engagedContacts: number;
  engagementRate: number;
  averageResponseTime: number; // in hours
  preferredChannels: Record<string, number>;
  preferredTimes: Record<string, number>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    engagementCount: number;
    responseRate: number;
  }>;
}

export interface EngagementHeatmap {
  stakeholderType: string;
  dayOfWeek: number;
  hourOfDay: number;
  engagementScore: number;
  responseRate: number;
  averageResponseTime: number;
  totalInteractions?: number;
  engagedCount?: number;
  responseCount?: number;
  responseTimeSum?: number;
}

export interface ChannelPerformance {
  channel: 'email' | 'sms' | 'call' | 'in_app';
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  responded: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
}

export interface ContentPerformance {
  contentType: string;
  subjectLine?: string;
  previewText?: string;
  totalSent: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  conversionRate: number;
  sentimentScore: number;
}

export class EngagementAnalytics {
  private static instance: EngagementAnalytics;

  private constructor() {}

  static getInstance(): EngagementAnalytics {
    if (!this.instance) {
      this.instance = new EngagementAnalytics();
    }
    return this.instance;
  }

  async getStakeholderEngagement(
    stakeholderType?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<StakeholderEngagement[]> {
    // Get all contacts
    const { data: allContacts, error } = await supabase
      .from('contacts')
      .select('id, title');

    if (error || !allContacts) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    // Map contacts to stakeholder types
    const contactsWithTypes = allContacts.map(contact => ({
      id: contact.id,
      title: contact.title,
      stakeholderType: this.categorizeStakeholder(contact.title || '')
    }));

    // Filter by stakeholder type if provided
    const filteredContacts = stakeholderType
      ? contactsWithTypes.filter(c => c.stakeholderType === stakeholderType)
      : contactsWithTypes;

    // Group contacts by stakeholder type
    const contactsByType: Record<string, string[]> = {};
    filteredContacts.forEach(contact => {
      if (!contactsByType[contact.stakeholderType]) {
        contactsByType[contact.stakeholderType] = [];
      }
      contactsByType[contact.stakeholderType].push(contact.id);
    });

    const results: StakeholderEngagement[] = [];

    for (const [type, contactIds] of Object.entries(contactsByType)) {
      const engagement = await this.calculateStakeholderMetrics(
        type as any,
        contactIds,
        timeRange
      );
      results.push(engagement);
    }

    return results;
  }

  private async calculateStakeholderMetrics(
    stakeholderType: 'Doctor' | 'Nurse' | 'Administrator' | 'Technician' | 'Other',
    contactIds: string[],
    timeRange?: { start: Date; end: Date }
  ): Promise<StakeholderEngagement> {
    if (contactIds.length === 0) {
      return {
        stakeholderType,
        totalContacts: 0,
        engagedContacts: 0,
        engagementRate: 0,
        averageResponseTime: 0,
        preferredChannels: {},
        preferredTimes: {},
        topTemplates: []
      };
    }

    // Get engagement data for these contacts
    const { data: logsData, error: logsError } = await supabase
      .from('automation_logs')
      .select('metadata, created_at')
      .in('metadata->>contactId', contactIds);

    if (logsError || !logsData) {
      console.error('Error fetching engagement data:', logsError);
      return {
        stakeholderType,
        totalContacts: contactIds.length,
        engagedContacts: 0,
        engagementRate: 0,
        averageResponseTime: 0,
        preferredChannels: {},
        preferredTimes: {},
        topTemplates: []
      };
    }

    // Process engagement data with time range filtering
    const engagementData = logsData
      .filter(log => {
        if (timeRange) {
          const createdAt = new Date(log.created_at);
          return createdAt >= timeRange.start && createdAt <= timeRange.end;
        }
        return true;
      })
      .map(log => {
        const createdAt = new Date(log.created_at);
        return {
          contactId: log.metadata?.contactId || '',
          channel: log.metadata?.channel || '',
          engaged: log.metadata?.engaged === true,
          responseTime: Number(log.metadata?.responseTimeHours || 0),
          templateId: log.metadata?.templateId || '',
          createdAt,
          dayOfWeek: createdAt.getDay(),
          hourOfDay: createdAt.getHours()
        };
      });

    // Calculate metrics
    const engagedContactIds = new Set(
      engagementData
        .filter(e => e.engaged)
        .map(e => e.contactId)
    );

    const engagementRate = contactIds.length > 0
      ? (engagedContactIds.size / contactIds.length) * 100
      : 0;

    // Calculate average response time
    const responseTimes = engagementData
      .filter(e => e.responseTime !== null)
      .map(e => e.responseTime);
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Analyze preferred channels
    const channelCounts: Record<string, number> = {};
    engagementData
      .filter(e => e.engaged && e.channel)
      .forEach(e => {
        channelCounts[e.channel] = (channelCounts[e.channel] || 0) + 1;
      });

    // Analyze preferred times
    const timeCounts: Record<string, number> = {};
    engagementData
      .filter(e => e.engaged)
      .forEach(e => {
        const timeSlot = `${this.getDayName(e.dayOfWeek)}_${this.getTimeSlot(e.hourOfDay)}`;
        timeCounts[timeSlot] = (timeCounts[timeSlot] || 0) + 1;
      });

    // Get top performing templates
    const templatePerformance = await this.getTopTemplatesForStakeholder(
      contactIds,
      timeRange
    );

    return {
      stakeholderType,
      totalContacts: contactIds.length,
      engagedContacts: engagedContactIds.size,
      engagementRate,
      averageResponseTime,
      preferredChannels: channelCounts,
      preferredTimes: timeCounts,
      topTemplates: templatePerformance
    };
  }

  async getEngagementHeatmap(
    stakeholderType?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<EngagementHeatmap[]> {
    // Get all logs with contact info
    const { data: logsData, error: logsError } = await supabase
      .from('automation_logs')
      .select(`
        metadata,
        created_at,
        contacts!inner (
          title
        )
      `);

    if (logsError || !logsData) {
      console.error('Error fetching heatmap data:', logsError);
      return [];
    }

    // Process and group data
    const heatmapData: Record<string, EngagementHeatmap> = {};

    logsData.forEach(log => {
      const createdAt = new Date(log.created_at);
      
      // Apply time range filter
      if (timeRange && (createdAt < timeRange.start || createdAt > timeRange.end)) {
        return;
      }

      const contactTitle = (log.contacts as any)?.[0]?.title || '';
      const sType = this.categorizeStakeholder(contactTitle);
      
      // Apply stakeholder type filter
      if (stakeholderType && sType !== stakeholderType) {
        return;
      }

      const dayOfWeek = createdAt.getDay();
      const hourOfDay = createdAt.getHours();
      const key = `${sType}-${dayOfWeek}-${hourOfDay}`;

      if (!heatmapData[key]) {
        heatmapData[key] = {
          stakeholderType: sType,
          dayOfWeek,
          hourOfDay,
          engagementScore: 0,
          responseRate: 0,
          averageResponseTime: 0
        };
      }

      // Accumulate metrics
      const engaged = log.metadata?.engaged === true;
      const responseTime = log.metadata?.responseTimeHours;
      
      if (!heatmapData[key].totalInteractions) {
        heatmapData[key].totalInteractions = 0;
        heatmapData[key].engagedCount = 0;
        heatmapData[key].responseCount = 0;
        heatmapData[key].responseTimeSum = 0;
      }
      
      heatmapData[key].totalInteractions!++;
      if (engaged) heatmapData[key].engagedCount!++;
      if (responseTime != null) {
        heatmapData[key].responseCount!++;
        heatmapData[key].responseTimeSum! += Number(responseTime);
      }
    });

    // Calculate final metrics
    const results = Object.values(heatmapData).map(data => {
      const totalInteractions = data.totalInteractions || 1;
      const engagedCount = data.engagedCount || 0;
      const responseCount = data.responseCount || 0;
      const responseTimeSum = data.responseTimeSum || 0;

      return {
        stakeholderType: data.stakeholderType,
        dayOfWeek: data.dayOfWeek,
        hourOfDay: data.hourOfDay,
        engagementScore: (engagedCount / totalInteractions) * 100,
        responseRate: (responseCount / totalInteractions) * 100,
        averageResponseTime: responseCount > 0 ? responseTimeSum / responseCount : 0
      };
    });

    return results;
  }

  async getChannelPerformance(
    timeRange?: { start: Date; end: Date }
  ): Promise<ChannelPerformance[]> {
    const channels: Array<'email' | 'sms' | 'call' | 'in_app'> = ['email', 'sms', 'call', 'in_app'];
    const results: ChannelPerformance[] = [];

    for (const channel of channels) {
      const { data: logs, error } = await supabase
        .from('automation_logs')
        .select('metadata, created_at')
        .eq('metadata->>channel', channel);

      if (error || !logs) {
        console.error(`Error fetching ${channel} data:`, error);
        continue;
      }

      // Filter by time range and calculate metrics
      const filteredLogs = timeRange
        ? logs.filter(log => {
            const createdAt = new Date(log.created_at);
            return createdAt >= timeRange.start && createdAt <= timeRange.end;
          })
        : logs;

      const metrics = {
        totalSent: filteredLogs.length,
        delivered: filteredLogs.filter(log => log.metadata?.delivered === true).length,
        opened: filteredLogs.filter(log => log.metadata?.opened === true).length,
        clicked: filteredLogs.filter(log => log.metadata?.clicked === true).length,
        responded: filteredLogs.filter(log => log.metadata?.responded === true).length
      };

      const deliveryRate = metrics.totalSent > 0 ? (metrics.delivered / metrics.totalSent) * 100 : 0;
      const openRate = metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0;
      const clickRate = metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0;
      const responseRate = metrics.delivered > 0 ? (metrics.responded / metrics.delivered) * 100 : 0;

      results.push({
        channel,
        totalSent: metrics.totalSent,
        delivered: metrics.delivered,
        opened: metrics.opened,
        clicked: metrics.clicked,
        responded: metrics.responded,
        deliveryRate,
        openRate,
        clickRate,
        responseRate
      });
    }

    return results;
  }

  async getContentPerformance(
    templateId?: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<ContentPerformance[]> {
    let query = supabase
      .from('automation_logs')
      .select('metadata, created_at');

    if (templateId) {
      query = query.eq('metadata->>templateId', templateId);
    }

    const { data: logs, error } = await query;

    if (error || !logs) {
      console.error('Error fetching content performance:', error);
      return [];
    }

    // Filter by time range
    const filteredLogs = timeRange
      ? logs.filter(log => {
          const createdAt = new Date(log.created_at);
          return createdAt >= timeRange.start && createdAt <= timeRange.end;
        })
      : logs;

    // Group by content attributes
    const contentGroups: Record<string, any[]> = {};
    
    filteredLogs.forEach(log => {
      const key = `${log.metadata?.templateId || 'unknown'}_${log.metadata?.contentType || 'unknown'}_${log.metadata?.subjectLine || ''}_${log.metadata?.previewText || ''}`;
      if (!contentGroups[key]) {
        contentGroups[key] = [];
      }
      contentGroups[key].push(log);
    });

    // Calculate metrics for each group
    const results = Object.entries(contentGroups).map(([key, logs]) => {
      const firstLog = logs[0];
      const totalSent = logs.length;
      const opened = logs.filter(log => log.metadata?.opened === true).length;
      const clicked = logs.filter(log => log.metadata?.clicked === true).length;
      const responded = logs.filter(log => log.metadata?.responded === true).length;
      const converted = logs.filter(log => log.metadata?.converted === true).length;
      
      const sentimentLogs = logs.filter(log => log.metadata?.sentimentScore != null);
      const sentimentSum = sentimentLogs.reduce((sum, log) => sum + Number(log.metadata.sentimentScore), 0);
      const sentimentCount = sentimentLogs.length;

      return {
        contentType: firstLog.metadata?.contentType || 'Unknown',
        subjectLine: firstLog.metadata?.subjectLine,
        previewText: firstLog.metadata?.previewText,
        totalSent,
        openRate: totalSent > 0 ? (opened / totalSent) * 100 : 0,
        clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
        responseRate: totalSent > 0 ? (responded / totalSent) * 100 : 0,
        conversionRate: totalSent > 0 ? (converted / totalSent) * 100 : 0,
        sentimentScore: sentimentCount > 0 ? sentimentSum / sentimentCount : 0
      };
    });

    return results;
  }

  private async getTopTemplatesForStakeholder(
    contactIds: string[],
    timeRange?: { start: Date; end: Date }
  ): Promise<Array<{
    templateId: string;
    templateName: string;
    engagementCount: number;
    responseRate: number;
  }>> {
    if (contactIds.length === 0) return [];

    // Get logs for these contacts
    const { data: logs, error: logsError } = await supabase
      .from('automation_logs')
      .select('metadata, created_at')
      .in('metadata->>contactId', contactIds);

    if (logsError || !logs) {
      console.error('Error fetching template performance:', logsError);
      return [];
    }

    // Filter by time range
    const filteredLogs = timeRange
      ? logs.filter(log => {
          const createdAt = new Date(log.created_at);
          return createdAt >= timeRange.start && createdAt <= timeRange.end;
        })
      : logs;

    // Group by template
    const templateGroups: Record<string, any[]> = {};
    filteredLogs.forEach(log => {
      const templateId = log.metadata?.templateId;
      if (templateId) {
        if (!templateGroups[templateId]) {
          templateGroups[templateId] = [];
        }
        templateGroups[templateId].push(log);
      }
    });

    // Get template names
    const templateIds = Object.keys(templateGroups);
    if (templateIds.length === 0) return [];

    const { data: templates, error: templatesError } = await supabase
      .from('automation_templates')
      .select('id, name')
      .in('id', templateIds);

    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
    }

    const templateMap = new Map((templates || []).map(t => [t.id, t.name]));

    // Calculate metrics and sort
    const results = Object.entries(templateGroups)
      .map(([templateId, logs]) => {
        const totalSent = logs.length;
        const engaged = logs.filter(log => log.metadata?.engaged === true).length;
        const responded = logs.filter(log => log.metadata?.responded === true).length;

        return {
          templateId,
          templateName: templateMap.get(templateId) || 'Unknown',
          totalSent,
          engaged,
          responded,
          engagementCount: engaged,
          responseRate: totalSent > 0 ? (responded / totalSent) * 100 : 0
        };
      })
      .sort((a, b) => b.engaged - a.engaged)
      .slice(0, 5);

    return results.map(row => ({
      templateId: row.templateId,
      templateName: row.templateName,
      engagementCount: row.engagementCount,
      responseRate: row.responseRate
    }));
  }

  private getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  }

  private getTimeSlot(hourOfDay: number): string {
    if (hourOfDay >= 6 && hourOfDay < 12) return 'Morning';
    if (hourOfDay >= 12 && hourOfDay < 17) return 'Afternoon';
    if (hourOfDay >= 17 && hourOfDay < 21) return 'Evening';
    return 'Night';
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

  async getEngagementTrends(
    timeRange?: { start: Date; end: Date },
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<Array<{
    period: string;
    totalEngagements: number;
    uniqueContacts: number;
    averageResponseTime: number;
    engagementRate: number;
  }>> {
    const { data: logs, error } = await supabase
      .from('automation_logs')
      .select('metadata, created_at');

    if (error || !logs) {
      console.error('Error fetching trends:', error);
      return [];
    }

    // Filter by time range
    const filteredLogs = timeRange
      ? logs.filter(log => {
          const createdAt = new Date(log.created_at);
          return createdAt >= timeRange.start && createdAt <= timeRange.end;
        })
      : logs;

    // Group by period
    const periodGroups: Record<string, any[]> = {};
    
    filteredLogs.forEach(log => {
      const createdAt = new Date(log.created_at);
      let period: string;
      
      if (groupBy === 'day') {
        period = createdAt.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const year = createdAt.getFullYear();
        const week = Math.ceil((createdAt.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
        period = `${year}-W${week.toString().padStart(2, '0')}`;
      } else {
        period = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!periodGroups[period]) {
        periodGroups[period] = [];
      }
      periodGroups[period].push(log);
    });

    // Calculate metrics for each period
    const results = Object.entries(periodGroups)
      .map(([period, logs]) => {
        const totalEngagements = logs.length;
        const uniqueContactIds = new Set(logs.map(log => log.metadata?.contactId).filter(Boolean));
        const engaged = logs.filter(log => log.metadata?.engaged === true).length;
        const responseTimeLogs = logs.filter(log => log.metadata?.responseTimeHours != null);
        const responseTimeSum = responseTimeLogs.reduce((sum, log) => sum + Number(log.metadata.responseTimeHours), 0);
        const responseCount = responseTimeLogs.length;

        return {
          period,
          totalEngagements,
          uniqueContacts: uniqueContactIds.size,
          averageResponseTime: responseCount > 0 ? responseTimeSum / responseCount : 0,
          engagementRate: totalEngagements > 0 ? (engaged / totalEngagements) * 100 : 0
        };
      })
      .sort((a, b) => a.period.localeCompare(b.period));

    return results;
  }
}

export const engagementAnalytics = EngagementAnalytics.getInstance();