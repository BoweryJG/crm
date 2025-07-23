// Market Intelligence Service - Real-time market data and insights
import { supabase } from './supabase/supabase';

export interface MarketFeed {
  id: string;
  feed_type: 'news' | 'regulatory' | 'competitor' | 'industry' | 'technology' | 'pricing' | 'merger';
  source: string;
  title: string;
  content: string;
  summary?: string;
  url?: string;
  published_date: string;
  relevance_score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  entities: {
    companies: string[];
    products: string[];
    procedures: string[];
    regulations: string[];
    technologies: string[];
  };
  impact_analysis?: {
    impact_level: 'low' | 'medium' | 'high' | 'critical';
    affected_areas: string[];
    opportunities: string[];
    threats: string[];
    recommended_actions: string[];
  };
  tags: string[];
  created_at: string;
}

export interface CompetitorActivity {
  id: string;
  competitor_name: string;
  activity_type: 'product_launch' | 'pricing_change' | 'partnership' | 'acquisition' | 'expansion' | 'leadership_change';
  title: string;
  description: string;
  impact_score: number;
  market_segment: 'dental' | 'aesthetic' | 'medical' | 'all';
  detected_date: string;
  source_urls: string[];
  competitive_response?: {
    urgency: 'low' | 'medium' | 'high' | 'immediate';
    suggested_actions: string[];
    talking_points: string[];
    counter_strategies: string[];
  };
  related_products: string[];
  affected_regions: string[];
}

export interface MarketTrend {
  id: string;
  trend_name: string;
  category: 'technology' | 'consumer' | 'regulatory' | 'economic' | 'demographic';
  description: string;
  growth_rate: number;
  momentum: 'accelerating' | 'steady' | 'decelerating';
  time_horizon: 'short_term' | 'medium_term' | 'long_term';
  confidence_score: number;
  supporting_data: {
    data_points: Array<{
      date: string;
      value: number;
      source: string;
    }>;
    key_drivers: string[];
    barriers: string[];
  };
  opportunities: {
    description: string;
    potential_value: number;
    time_to_market: number; // months
    requirements: string[];
  }[];
  market_segments: string[];
}

export interface MarketAlert {
  id: string;
  alert_type: 'opportunity' | 'threat' | 'regulatory' | 'competitor' | 'trend';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  detected_at: string;
  expires_at?: string;
  affected_segments: string[];
  affected_regions: string[];
  recommended_actions: {
    action: string;
    priority: 'low' | 'medium' | 'high' | 'immediate';
    deadline?: string;
    owner?: string;
  }[];
  related_feeds?: string[]; // IDs of related market feeds
  acknowledgement_required: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

export interface MarketOpportunity {
  id: string;
  opportunity_type: 'new_market' | 'product_gap' | 'partnership' | 'acquisition' | 'expansion';
  title: string;
  description: string;
  market_size: number;
  growth_potential: number;
  competition_level: 'low' | 'medium' | 'high';
  barriers_to_entry: string[];
  required_capabilities: string[];
  time_to_capture: number; // months
  investment_required: {
    min: number;
    max: number;
    breakdown: Record<string, number>;
  };
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high';
    key_risks: string[];
    mitigation_strategies: string[];
  };
  scoring: {
    attractiveness: number; // 0-100
    feasibility: number; // 0-100
    strategic_fit: number; // 0-100
    overall_score: number; // 0-100
  };
  next_steps: string[];
  created_at: string;
  updated_at: string;
}

class MarketIntelligenceService {
  private feedSubscriptions: Map<string, any> = new Map();
  private alertCallbacks: Map<string, (alert: MarketAlert) => void> = new Map();

  // Get market feeds with filters
  async getMarketFeeds(filters?: {
    feed_types?: MarketFeed['feed_type'][];
    start_date?: string;
    end_date?: string;
    min_relevance?: number;
    sentiment?: MarketFeed['sentiment'];
    tags?: string[];
    limit?: number;
  }): Promise<MarketFeed[]> {
    try {
      let query = supabase
        .from('market_feeds')
        .select('*')
        .order('published_date', { ascending: false });

      if (filters?.feed_types?.length) {
        query = query.in('feed_type', filters.feed_types);
      }
      if (filters?.start_date) {
        query = query.gte('published_date', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('published_date', filters.end_date);
      }
      if (filters?.min_relevance) {
        query = query.gte('relevance_score', filters.min_relevance);
      }
      if (filters?.sentiment) {
        query = query.eq('sentiment', filters.sentiment);
      }
      if (filters?.tags?.length) {
        query = query.contains('tags', filters.tags);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching market feeds:', error);
      throw error;
    }
  }

  // Subscribe to real-time market feeds
  subscribeToMarketFeeds(
    callback: (feed: MarketFeed) => void,
    filters?: {
      feed_types?: MarketFeed['feed_type'][];
      min_relevance?: number;
    }
  ): string {
    const subscriptionId = `feed_${Date.now()}`;
    
    const subscription = supabase
      .channel(`market_feeds_${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'market_feeds',
          filter: filters?.feed_types?.length 
            ? `feed_type=in.(${filters.feed_types.join(',')})` 
            : undefined
        },
        (payload) => {
          const feed = payload.new as MarketFeed;
          if (!filters?.min_relevance || feed.relevance_score >= filters.min_relevance) {
            callback(feed);
          }
        }
      )
      .subscribe();

    this.feedSubscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  // Unsubscribe from market feeds
  unsubscribeFromMarketFeeds(subscriptionId: string) {
    const subscription = this.feedSubscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.feedSubscriptions.delete(subscriptionId);
    }
  }

  // Get competitor activities
  async getCompetitorActivities(filters?: {
    competitors?: string[];
    activity_types?: CompetitorActivity['activity_type'][];
    start_date?: string;
    min_impact?: number;
    market_segment?: string;
  }): Promise<CompetitorActivity[]> {
    try {
      let query = supabase
        .from('competitor_activities')
        .select('*')
        .order('detected_date', { ascending: false });

      if (filters?.competitors?.length) {
        query = query.in('competitor_name', filters.competitors);
      }
      if (filters?.activity_types?.length) {
        query = query.in('activity_type', filters.activity_types);
      }
      if (filters?.start_date) {
        query = query.gte('detected_date', filters.start_date);
      }
      if (filters?.min_impact) {
        query = query.gte('impact_score', filters.min_impact);
      }
      if (filters?.market_segment) {
        query = query.eq('market_segment', filters.market_segment);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching competitor activities:', error);
      throw error;
    }
  }

  // Get market trends
  async getMarketTrends(filters?: {
    categories?: MarketTrend['category'][];
    time_horizon?: MarketTrend['time_horizon'];
    min_confidence?: number;
    market_segments?: string[];
  }): Promise<MarketTrend[]> {
    try {
      let query = supabase
        .from('market_trends')
        .select('*')
        .order('confidence_score', { ascending: false });

      if (filters?.categories?.length) {
        query = query.in('category', filters.categories);
      }
      if (filters?.time_horizon) {
        query = query.eq('time_horizon', filters.time_horizon);
      }
      if (filters?.min_confidence) {
        query = query.gte('confidence_score', filters.min_confidence);
      }
      if (filters?.market_segments?.length) {
        query = query.overlaps('market_segments', filters.market_segments);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching market trends:', error);
      throw error;
    }
  }

  // Get market alerts
  async getMarketAlerts(filters?: {
    alert_types?: MarketAlert['alert_type'][];
    severity?: MarketAlert['severity'][];
    unacknowledged_only?: boolean;
    active_only?: boolean;
  }): Promise<MarketAlert[]> {
    try {
      let query = supabase
        .from('market_alerts')
        .select('*')
        .order('detected_at', { ascending: false });

      if (filters?.alert_types?.length) {
        query = query.in('alert_type', filters.alert_types);
      }
      if (filters?.severity?.length) {
        query = query.in('severity', filters.severity);
      }
      if (filters?.unacknowledged_only) {
        query = query.is('acknowledged_at', null);
      }
      if (filters?.active_only) {
        const now = new Date().toISOString();
        query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching market alerts:', error);
      throw error;
    }
  }

  // Subscribe to market alerts
  subscribeToMarketAlerts(
    callback: (alert: MarketAlert) => void,
    filters?: {
      alert_types?: MarketAlert['alert_type'][];
      min_severity?: 'info' | 'warning' | 'critical';
    }
  ): string {
    const subscriptionId = `alert_${Date.now()}`;
    
    this.alertCallbacks.set(subscriptionId, callback);
    
    // In production, this would be a WebSocket connection
    // For now, simulate with polling
    const interval = setInterval(async () => {
      const alerts = await this.getMarketAlerts({
        alert_types: filters?.alert_types,
        unacknowledged_only: true,
        active_only: true
      });

      const severityOrder = { info: 0, warning: 1, critical: 2 };
      const minSeverityLevel = filters?.min_severity ? severityOrder[filters.min_severity] : 0;

      alerts
        .filter(alert => severityOrder[alert.severity] >= minSeverityLevel)
        .forEach(alert => callback(alert));
    }, 30000); // Check every 30 seconds

    this.feedSubscriptions.set(subscriptionId, interval);
    return subscriptionId;
  }

  // Acknowledge market alert
  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('market_alerts')
        .update({
          acknowledged_by: userId,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  // Get market opportunities
  async getMarketOpportunities(filters?: {
    opportunity_types?: MarketOpportunity['opportunity_type'][];
    min_score?: number;
    max_investment?: number;
    competition_level?: MarketOpportunity['competition_level'][];
  }): Promise<MarketOpportunity[]> {
    try {
      let query = supabase
        .from('market_opportunities')
        .select('*')
        .order('scoring->overall_score', { ascending: false });

      if (filters?.opportunity_types?.length) {
        query = query.in('opportunity_type', filters.opportunity_types);
      }
      if (filters?.min_score) {
        query = query.gte('scoring->overall_score', filters.min_score);
      }
      if (filters?.max_investment) {
        query = query.lte('investment_required->max', filters.max_investment);
      }
      if (filters?.competition_level?.length) {
        query = query.in('competition_level', filters.competition_level);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching market opportunities:', error);
      throw error;
    }
  }

  // Analyze market feed for insights
  async analyzeMarketFeed(feedId: string): Promise<{
    key_insights: string[];
    impact_assessment: {
      sales_impact: 'positive' | 'negative' | 'neutral';
      competitive_impact: 'advantage' | 'disadvantage' | 'neutral';
      market_position: 'strengthen' | 'weaken' | 'maintain';
    };
    recommended_actions: {
      immediate: string[];
      short_term: string[];
      long_term: string[];
    };
    talking_points: string[];
  }> {
    // In production, this would use AI analysis
    // For now, return mock analysis
    return {
      key_insights: [
        'New regulatory requirements may increase compliance costs',
        'Opportunity to differentiate through compliance expertise',
        'Smaller competitors may struggle with implementation'
      ],
      impact_assessment: {
        sales_impact: 'positive',
        competitive_impact: 'advantage',
        market_position: 'strengthen'
      },
      recommended_actions: {
        immediate: [
          'Update sales materials with compliance messaging',
          'Schedule training on new regulations'
        ],
        short_term: [
          'Develop compliance consultation service',
          'Create educational content for prospects'
        ],
        long_term: [
          'Consider compliance software integration',
          'Build strategic partnerships with compliance vendors'
        ]
      },
      talking_points: [
        'We help practices navigate complex regulatory requirements',
        'Our solution ensures automatic compliance with latest standards',
        'Reduce compliance risk while focusing on patient care'
      ]
    };
  }

  // Generate market intelligence summary
  async generateMarketSummary(
    timeframe: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    executive_summary: string;
    key_developments: Array<{
      category: string;
      title: string;
      impact: 'low' | 'medium' | 'high';
      summary: string;
    }>;
    competitive_landscape: {
      major_moves: string[];
      market_share_changes: Record<string, number>;
      emerging_threats: string[];
    };
    opportunities: {
      immediate: MarketOpportunity[];
      strategic: MarketOpportunity[];
    };
    risks: {
      category: string;
      description: string;
      mitigation: string;
    }[];
    recommendations: string[];
  }> {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      // Fetch data
      const [feeds, competitors, opportunities, alerts] = await Promise.all([
        this.getMarketFeeds({
          start_date: startDate.toISOString(),
          min_relevance: 0.7
        }),
        this.getCompetitorActivities({
          start_date: startDate.toISOString(),
          min_impact: 5
        }),
        this.getMarketOpportunities({
          min_score: 70
        }),
        this.getMarketAlerts({
          active_only: true,
          severity: ['warning', 'critical']
        })
      ]);

      // Generate summary (in production, this would use AI)
      return {
        executive_summary: `Market Intelligence Summary for ${timeframe}: ${feeds.length} relevant market developments, ${competitors.length} competitor activities tracked, ${opportunities.length} new opportunities identified, ${alerts.length} active alerts require attention.`,
        
        key_developments: feeds.slice(0, 5).map(feed => ({
          category: feed.feed_type,
          title: feed.title,
          impact: feed.relevance_score > 0.8 ? 'high' : feed.relevance_score > 0.5 ? 'medium' : 'low',
          summary: feed.summary || feed.content.substring(0, 200) + '...'
        })),
        
        competitive_landscape: {
          major_moves: competitors
            .filter(c => c.impact_score > 7)
            .map(c => `${c.competitor_name}: ${c.title}`),
          market_share_changes: {
            'Sphere OS': 2.5,
            'Competitor A': -1.2,
            'Competitor B': 0.8,
            'Others': -2.1
          },
          emerging_threats: competitors
            .filter(c => c.activity_type === 'product_launch' || c.activity_type === 'expansion')
            .map(c => c.title)
        },
        
        opportunities: {
          immediate: opportunities.filter(o => o.time_to_capture <= 3),
          strategic: opportunities.filter(o => o.time_to_capture > 3)
        },
        
        risks: alerts
          .filter(a => a.alert_type === 'threat')
          .map(a => ({
            category: a.alert_type,
            description: a.description,
            mitigation: a.recommended_actions[0]?.action || 'Monitor situation closely'
          })),
        
        recommendations: [
          'Focus on compliance messaging in light of new regulations',
          'Accelerate product roadmap to counter competitor launches',
          'Invest in partnerships to expand market reach',
          'Enhance customer success to improve retention'
        ]
      };
    } catch (error) {
      console.error('Error generating market summary:', error);
      throw error;
    }
  }

  // Create custom market alert
  async createCustomAlert(
    alert: Omit<MarketAlert, 'id' | 'detected_at'>
  ): Promise<MarketAlert> {
    try {
      const newAlert = {
        ...alert,
        id: `alert_${Date.now()}`,
        detected_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('market_alerts')
        .insert(newAlert)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating custom alert:', error);
      throw error;
    }
  }

  // Score market opportunity
  async scoreOpportunity(
    opportunity: Partial<MarketOpportunity>
  ): Promise<MarketOpportunity['scoring']> {
    // Scoring algorithm
    const attractiveness = this.calculateAttractiveness(opportunity);
    const feasibility = this.calculateFeasibility(opportunity);
    const strategicFit = this.calculateStrategicFit(opportunity);
    
    const overallScore = (attractiveness * 0.35 + feasibility * 0.35 + strategicFit * 0.3);

    return {
      attractiveness,
      feasibility,
      strategic_fit: strategicFit,
      overall_score: Math.round(overallScore)
    };
  }

  private calculateAttractiveness(opportunity: Partial<MarketOpportunity>): number {
    let score = 50; // Base score
    
    // Market size impact
    if (opportunity.market_size) {
      if (opportunity.market_size > 10000000) score += 20;
      else if (opportunity.market_size > 1000000) score += 10;
    }
    
    // Growth potential impact
    if (opportunity.growth_potential) {
      if (opportunity.growth_potential > 50) score += 15;
      else if (opportunity.growth_potential > 20) score += 10;
    }
    
    // Competition impact
    if (opportunity.competition_level === 'low') score += 15;
    else if (opportunity.competition_level === 'high') score -= 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateFeasibility(opportunity: Partial<MarketOpportunity>): number {
    let score = 70; // Base score
    
    // Time to capture impact
    if (opportunity.time_to_capture) {
      if (opportunity.time_to_capture <= 3) score += 15;
      else if (opportunity.time_to_capture > 12) score -= 15;
    }
    
    // Investment required impact
    if (opportunity.investment_required) {
      if (opportunity.investment_required.max < 100000) score += 10;
      else if (opportunity.investment_required.max > 1000000) score -= 20;
    }
    
    // Risk impact
    if (opportunity.risk_assessment?.risk_level === 'low') score += 10;
    else if (opportunity.risk_assessment?.risk_level === 'high') score -= 15;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateStrategicFit(opportunity: Partial<MarketOpportunity>): number {
    let score = 60; // Base score
    
    // Type alignment
    if (opportunity.opportunity_type === 'expansion' || opportunity.opportunity_type === 'product_gap') {
      score += 20;
    }
    
    // Capability requirements
    if (opportunity.required_capabilities?.length) {
      // Assume we have 70% of required capabilities
      score += (0.7 * 20);
    }
    
    return Math.min(100, Math.max(0, score));
  }
}

export const marketIntelligenceService = new MarketIntelligenceService();