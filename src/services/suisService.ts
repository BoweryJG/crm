// SUIS (Sphereos Unified Intelligence System) Service
// Integrates Sphere1a data with existing components
import { supabase } from './supabase/supabase';

// Types for SUIS intelligence
export interface IntelligenceInsight {
  id: string;
  user_id: string;
  insight_type: 'rep_analytics' | 'region_analytics' | 'call_analysis' | 'market_intel' | 'procedure_opportunity' | 'competitive_intel';
  data_source: string;
  correlation_score: number;
  urgency_level: 'immediate' | 'urgent' | 'standard' | 'low';
  insight_data: any;
  procedure_tags: string[];
  territory_relevance: any;
  expires_at?: string;
  created_at: string;
}

export interface ProcedurePerformance {
  id: string;
  user_id: string;
  sphere1a_procedure_id: string;
  procedure_name: string;
  procedure_category: string;
  market_size_millions: number;
  growth_percentage: number;
  complexity_rating: string;
  average_cost: number;
  patient_satisfaction: number;
  territory_multiplier: number;
  competitive_pressure: any;
  conversion_rate?: number;
  rep_performance_vs_market?: number;
}

export interface UnifiedAnalytics {
  id: string;
  user_id: string;
  territory_id?: string;
  analytics_type: 'rep' | 'region' | 'territory' | 'procedure' | 'competitive';
  metric_name: string;
  metric_value: number;
  benchmark_value?: number;
  trend_direction: 'up' | 'down' | 'stable';
  procedure_correlation: string[];
  geographic_scope: any;
  time_period: string;
  data_freshness: string;
}

export interface IntelligentNotification {
  id: string;
  user_id: string;
  notification_type: 'call_timing' | 'opportunity_alert' | 'competitive_intel' | 'goal_progress' | 'market_update' | 'procedure_insight';
  priority_level: number;
  title: string;
  message: string;
  action_data: any;
  delivery_channels: string[];
  read_status: boolean;
  expires_at?: string;
  created_at: string;
}

class SUISService {
  // Get real-time intelligence insights for dashboard ticker
  async getIntelligenceInsights(userId?: string, limit: number = 10): Promise<IntelligenceInsight[]> {
    try {
      let query = supabase
        .from('intelligence_engine')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      // Get insights that haven't expired
      query = query.or('expires_at.is.null,expires_at.gt.now()');

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching intelligence insights:', error);
      return [];
    }
  }

  // Get procedure performance data for Rep Analytics
  async getProcedurePerformance(userId?: string): Promise<ProcedurePerformance[]> {
    try {
      let query = supabase
        .from('procedure_performance_enriched')
        .select('*')
        .order('market_size_millions', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching procedure performance:', error);
      return [];
    }
  }

  // Get unified analytics for both Rep and Region dashboards
  async getUnifiedAnalytics(
    userId?: string, 
    analyticsType?: 'rep' | 'region' | 'territory' | 'procedure' | 'competitive',
    timePeriod: string = 'daily'
  ): Promise<UnifiedAnalytics[]> {
    try {
      let query = supabase
        .from('unified_analytics')
        .select('*')
        .eq('time_period', timePeriod)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (analyticsType) {
        query = query.eq('analytics_type', analyticsType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching unified analytics:', error);
      return [];
    }
  }

  // Get intelligent notifications
  async getIntelligentNotifications(userId?: string, unreadOnly: boolean = false): Promise<IntelligentNotification[]> {
    try {
      let query = supabase
        .from('intelligent_notifications')
        .select('*')
        .order('priority_level', { ascending: false })
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (unreadOnly) {
        query = query.eq('read_status', false);
      }

      // Only get non-expired notifications
      query = query.or('expires_at.is.null,expires_at.gt.now()');

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching intelligent notifications:', error);
      return [];
    }
  }

  // Create new intelligence insight
  async createIntelligenceInsight(insight: Partial<IntelligenceInsight>): Promise<IntelligenceInsight | null> {
    try {
      const { data, error } = await supabase
        .from('intelligence_engine')
        .insert([insight])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating intelligence insight:', error);
      return null;
    }
  }

  // Create intelligent notification
  async createIntelligentNotification(notification: Partial<IntelligentNotification>): Promise<IntelligentNotification | null> {
    try {
      const { data, error } = await supabase
        .from('intelligent_notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligent_notifications')
        .update({ read_status: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Get territory intelligence for Region Analytics
  async getTerritoryIntelligence(userId?: string, territoryCode?: string) {
    try {
      let query = supabase
        .from('territory_intelligence_enriched')
        .select('*')
        .order('opportunity_score', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (territoryCode) {
        query = query.eq('territory_code', territoryCode);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching territory intelligence:', error);
      return [];
    }
  }

  // Real-time subscription to intelligence insights
  subscribeToIntelligenceUpdates(
    callback: (payload: any) => void,
    userId?: string
  ) {
    const subscription = supabase
      .channel('intelligence_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intelligence_engine',
          ...(userId && { filter: `user_id=eq.${userId}` })
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  // Real-time subscription to notifications
  subscribeToNotificationUpdates(
    callback: (payload: any) => void,
    userId?: string
  ) {
    const subscription = supabase
      .channel('notification_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intelligent_notifications',
          ...(userId && { filter: `user_id=eq.${userId}` })
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  // Convert intelligence insights to ticker format
  convertInsightsToTickerData(insights: IntelligenceInsight[]): any[] {
    return insights.map(insight => ({
      id: insight.id,
      title: this.generateTickerTitle(insight),
      description: insight.insight_data.message || 'Market intelligence update',
      priority: this.mapUrgencyToPriority(insight.urgency_level),
      type: this.mapInsightTypeToTickerType(insight.insight_type),
      contactName: insight.insight_data.contactName || 'Market Intelligence',
      companyName: insight.insight_data.companyName || 'SphereOS Analytics',
      expectedValue: insight.insight_data.market_size || insight.insight_data.roi_estimate || 0,
      confidence: insight.correlation_score,
      nextSteps: insight.insight_data.action || 'Review insight details',
      lastUpdated: insight.created_at,
      urgencyScore: this.mapUrgencyToScore(insight.urgency_level),
      tags: insight.procedure_tags
    }));
  }

  // Helper methods
  private generateTickerTitle(insight: IntelligenceInsight): string {
    const { insight_data } = insight;
    
    if (insight.insight_type === 'procedure_opportunity') {
      return `🎯 ${insight_data.procedure || 'Procedure'} Opportunity - ${insight_data.market_size ? `$${insight_data.market_size}M market` : 'High Value'}`;
    }
    
    if (insight.insight_type === 'competitive_intel') {
      return `⚡ Competitive Alert - ${insight_data.affected_procedure || 'Market Change'}`;
    }
    
    if (insight.insight_type === 'market_intel') {
      return `📈 Market Update - ${insight_data.procedure || 'Industry'} Growth`;
    }
    
    return insight_data.title || 'Intelligence Update';
  }

  private mapUrgencyToPriority(urgency: string): string {
    switch (urgency) {
      case 'immediate': return 'critical';
      case 'urgent': return 'high';
      case 'standard': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  private mapInsightTypeToTickerType(insightType: string): string {
    switch (insightType) {
      case 'procedure_opportunity': return 'high_value_opportunity';
      case 'competitive_intel': return 'competitive_threat';
      case 'market_intel': return 'market_update';
      case 'call_analysis': return 're_engagement';
      default: return 'general_insight';
    }
  }

  private mapUrgencyToScore(urgency: string): number {
    switch (urgency) {
      case 'immediate': return 95;
      case 'urgent': return 85;
      case 'standard': return 65;
      case 'low': return 45;
      default: return 50;
    }
  }

  // Get top performing procedures for user goals
  async getTopProceduresForGoals(userGoals: string[] = []): Promise<ProcedurePerformance[]> {
    try {
      let query = supabase
        .from('procedure_performance_enriched')
        .select('*')
        .order('market_size_millions', { ascending: false })
        .limit(10);

      // If user has specific goals, filter procedures accordingly
      if (userGoals.length > 0) {
        const goalFilters = userGoals.map(goal => {
          if (goal.includes('botox')) return 'Botox';
          if (goal.includes('implant')) return 'Dental Implants';
          if (goal.includes('aesthetic')) return 'procedure_category.in.(Injectables,Facial Aesthetic,Breast Procedures)';
          return null;
        }).filter(Boolean);

        if (goalFilters.length > 0) {
          // This is a simplified filter - in production you'd want more sophisticated matching
          query = query.or(goalFilters.map(filter => `procedure_name.ilike.%${filter}%`).join(','));
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top procedures for goals:', error);
      return [];
    }
  }
}

// Export singleton instance
export const suisService = new SUISService();
export default suisService;