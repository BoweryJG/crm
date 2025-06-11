// SUIS Predictive Analytics Engine
// Provides intelligent insights and predictions based on historical data

import { supabase } from '../../auth/supabase';
import { 
  UnifiedAnalytics,
  IntelligenceProfile,
  MarketIntelligence,
  ContactUniverse
} from '../types';

interface PredictiveInsight {
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  actionRequired: boolean;
  suggestedActions?: string[];
  relatedData?: any;
}

interface PerformanceMetrics {
  conversionRate: number;
  averageDealSize: number;
  salesCycleLength: number;
  winRate: number;
  activityLevel: number;
  engagementScore: number;
}

interface OpportunityScore {
  score: number; // 0-100
  factors: {
    marketTrend: number;
    contactEngagement: number;
    historicalSuccess: number;
    competitivePosition: number;
    timing: number;
  };
  recommendation: string;
}

class SUISAnalyticsEngine {
  // Generate predictive insights for a user
  async generatePredictiveInsights(userId: string): Promise<PredictiveInsight[]> {
    try {
      const insights: PredictiveInsight[] = [];

      // Gather all relevant data
      const [profile, analytics, marketData, contacts] = await Promise.all([
        this.getUserProfile(userId),
        this.getHistoricalAnalytics(userId),
        this.getMarketIntelligence(),
        this.getContactUniverse(userId)
      ]);

      // Generate different types of insights
      insights.push(...await this.predictOpportunities(userId, analytics, marketData, contacts));
      insights.push(...await this.identifyRisks(userId, analytics, contacts));
      insights.push(...await this.analyzeTrends(userId, analytics, marketData));
      insights.push(...await this.generateRecommendations(userId, profile, analytics));

      // Sort by confidence and impact
      insights.sort((a, b) => {
        const scoreA = a.confidence * (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1);
        const scoreB = b.confidence * (b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1);
        return scoreB - scoreA;
      });

      // Save insights to database
      await this.saveInsights(userId, insights);

      return insights;
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      throw error;
    }
  }

  // Calculate performance metrics for a user
  async calculatePerformanceMetrics(
    userId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<PerformanceMetrics> {
    try {
      // Get sales activities and outcomes
      const { data: activities } = await supabase
        .from('sales_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', periodStart.toISOString())
        .lte('created_at', periodEnd.toISOString());

      // Get closed deals
      const { data: deals } = await supabase
        .from('sales_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'deal_closed')
        .gte('created_at', periodStart.toISOString())
        .lte('created_at', periodEnd.toISOString());

      // Calculate metrics
      const totalOpportunities = activities?.filter(a => a.activity_type === 'opportunity_created').length || 0;
      const closedDeals = deals?.length || 0;
      const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.metadata?.amount || 0), 0) || 0;

      const metrics: PerformanceMetrics = {
        conversionRate: totalOpportunities > 0 ? (closedDeals / totalOpportunities) * 100 : 0,
        averageDealSize: closedDeals > 0 ? totalRevenue / closedDeals : 0,
        salesCycleLength: await this.calculateAverageSalesCycle(userId, periodStart, periodEnd),
        winRate: await this.calculateWinRate(userId, periodStart, periodEnd),
        activityLevel: activities?.length || 0,
        engagementScore: await this.calculateEngagementScore(userId, activities || [])
      };

      // Save metrics
      await this.saveMetrics(userId, metrics, periodStart, periodEnd);

      return metrics;
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      throw error;
    }
  }

  // Score an opportunity
  async scoreOpportunity(
    userId: string,
    contactId: string,
    procedureType?: string
  ): Promise<OpportunityScore> {
    try {
      // Get all relevant data for scoring
      const [contact, marketData, historicalData] = await Promise.all([
        this.getContactDetails(contactId),
        this.getMarketDataForProcedure(procedureType),
        this.getHistoricalSuccessRate(userId, procedureType)
      ]);

      // Calculate individual factors
      const factors = {
        marketTrend: await this.scoreMarketTrend(marketData),
        contactEngagement: await this.scoreContactEngagement(contact),
        historicalSuccess: historicalData.successRate * 100,
        competitivePosition: await this.scoreCompetitivePosition(contact, marketData),
        timing: await this.scoreTiming(contact, marketData)
      };

      // Calculate weighted score
      const weights = {
        marketTrend: 0.20,
        contactEngagement: 0.30,
        historicalSuccess: 0.20,
        competitivePosition: 0.15,
        timing: 0.15
      };

      const score = Object.entries(factors).reduce((total, [key, value]) => {
        return total + (value * weights[key as keyof typeof weights]);
      }, 0);

      // Generate recommendation based on score
      const recommendation = this.generateOpportunityRecommendation(score, factors);

      return {
        score: Math.round(score),
        factors,
        recommendation
      };
    } catch (error) {
      console.error('Error scoring opportunity:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getUserProfile(userId: string) {
    const { data } = await supabase
      .from('suis_intelligence_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  }

  private async getHistoricalAnalytics(userId: string) {
    const { data } = await supabase
      .from('suis_unified_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('period_end', { ascending: false })
      .limit(12); // Last 12 periods
    return data || [];
  }

  private async getMarketIntelligence() {
    const { data } = await supabase
      .from('suis_market_intelligence')
      .select('*')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('created_at', { ascending: false });
    return data || [];
  }

  private async getContactUniverse(userId: string) {
    const { data } = await supabase
      .from('suis_contact_universe')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }

  private async predictOpportunities(
    userId: string,
    analytics: any[],
    marketData: any[],
    contacts: any[]
  ): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Analyze market trends for opportunities
    const trendingProcedures = this.identifyTrendingProcedures(marketData);
    
    trendingProcedures.forEach(trend => {
      insights.push({
        type: 'opportunity',
        title: `Rising Demand for ${trend.procedure}`,
        description: `Market data shows ${trend.growthRate}% increase in ${trend.procedure} procedures. ${trend.matchingContacts} of your contacts may be interested.`,
        confidence: trend.confidence,
        impact: trend.growthRate > 20 ? 'high' : trend.growthRate > 10 ? 'medium' : 'low',
        timeframe: 'Next 3 months',
        actionRequired: true,
        suggestedActions: [
          `Reach out to contacts specializing in ${trend.specialty}`,
          `Prepare targeted content for ${trend.procedure}`,
          `Schedule demos with high-potential practices`
        ],
        relatedData: trend
      });
    });

    // Identify contacts with high engagement potential
    const highPotentialContacts = contacts
      .filter(c => c.quality_score > 0.7 && !c.last_interaction)
      .slice(0, 5);

    if (highPotentialContacts.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Untapped High-Value Contacts',
        description: `You have ${highPotentialContacts.length} high-quality contacts that haven't been engaged yet.`,
        confidence: 85,
        impact: 'high',
        timeframe: 'This week',
        actionRequired: true,
        suggestedActions: [
          'Prioritize outreach to these contacts',
          'Personalize messaging based on their specialties',
          'Set up introduction calls'
        ],
        relatedData: { contacts: highPotentialContacts }
      });
    }

    return insights;
  }

  private async identifyRisks(
    userId: string,
    analytics: any[],
    contacts: any[]
  ): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Check for declining engagement
    const recentEngagement = this.calculateRecentEngagement(analytics);
    if (recentEngagement.trend < -10) {
      insights.push({
        type: 'risk',
        title: 'Declining Customer Engagement',
        description: `Engagement has decreased by ${Math.abs(recentEngagement.trend)}% over the last month.`,
        confidence: 90,
        impact: 'medium',
        timeframe: 'Immediate',
        actionRequired: true,
        suggestedActions: [
          'Review and refresh your outreach strategy',
          'Check for competitive activity in your territory',
          'Schedule check-ins with key accounts'
        ],
        relatedData: recentEngagement
      });
    }

    // Identify at-risk relationships
    const atRiskContacts = contacts.filter(c => {
      const daysSinceContact = c.last_interaction ? 
        (Date.now() - new Date(c.last_interaction).getTime()) / (1000 * 60 * 60 * 24) : 
        999;
      return daysSinceContact > 60 && c.contact_tier === 'tier_20';
    });

    if (atRiskContacts.length > 0) {
      insights.push({
        type: 'risk',
        title: 'Key Relationships at Risk',
        description: `${atRiskContacts.length} top-tier contacts haven't been engaged in over 60 days.`,
        confidence: 95,
        impact: 'high',
        timeframe: 'This week',
        actionRequired: true,
        suggestedActions: [
          'Immediately reach out to re-engage',
          'Offer exclusive updates or insights',
          'Schedule relationship maintenance calls'
        ],
        relatedData: { contacts: atRiskContacts }
      });
    }

    return insights;
  }

  private async analyzeTrends(
    userId: string,
    analytics: any[],
    marketData: any[]
  ): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Analyze performance trends
    const performanceTrend = this.calculatePerformanceTrend(analytics);
    
    if (performanceTrend.improving) {
      insights.push({
        type: 'trend',
        title: 'Performance Momentum Building',
        description: `Your key metrics have improved by ${performanceTrend.improvementRate}% over the last quarter. Maintaining current activities could lead to ${performanceTrend.projection}% growth.`,
        confidence: performanceTrend.confidence,
        impact: 'medium',
        timeframe: 'Next quarter',
        actionRequired: false,
        suggestedActions: [
          'Continue current successful strategies',
          'Document and share best practices',
          'Consider scaling successful approaches'
        ],
        relatedData: performanceTrend
      });
    }

    return insights;
  }

  private async generateRecommendations(
    userId: string,
    profile: any,
    analytics: any[]
  ): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Skills development recommendations
    const skillGaps = await this.identifySkillGaps(profile, analytics);
    
    if (skillGaps.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Skill Development Opportunity',
        description: `Developing expertise in ${skillGaps[0].skill} could improve your close rate by an estimated ${skillGaps[0].potentialImprovement}%.`,
        confidence: 75,
        impact: 'medium',
        timeframe: '1-2 months',
        actionRequired: false,
        suggestedActions: [
          `Complete training modules on ${skillGaps[0].skill}`,
          'Practice with role-play scenarios',
          'Shadow top performers in this area'
        ],
        relatedData: { skillGaps }
      });
    }

    return insights;
  }

  private identifyTrendingProcedures(marketData: any[]): any[] {
    // Analyze market data to identify trending procedures
    // This is a simplified implementation
    const procedureCounts: { [key: string]: any } = {};
    
    marketData.forEach(data => {
      if (data.intelligence_type === 'procedure_trend' && data.data?.procedure) {
        const procedure = data.data.procedure;
        if (!procedureCounts[procedure]) {
          procedureCounts[procedure] = {
            procedure,
            count: 0,
            growthRate: 0,
            specialty: data.specialty
          };
        }
        procedureCounts[procedure].count++;
        procedureCounts[procedure].growthRate = data.data.growth_rate || 0;
      }
    });

    return Object.values(procedureCounts)
      .filter(p => p.growthRate > 5)
      .map(p => ({
        ...p,
        confidence: Math.min(95, 60 + p.count * 5),
        matchingContacts: Math.floor(Math.random() * 20) + 5 // Replace with actual calculation
      }))
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 3);
  }

  private calculateRecentEngagement(analytics: any[]): any {
    if (analytics.length < 2) return { trend: 0 };
    
    const recent = analytics[0]?.metrics?.engagement_score || 0;
    const previous = analytics[1]?.metrics?.engagement_score || 0;
    
    const trend = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    
    return {
      current: recent,
      previous,
      trend
    };
  }

  private calculatePerformanceTrend(analytics: any[]): any {
    if (analytics.length < 3) return { improving: false, improvementRate: 0 };
    
    // Calculate trend over last 3 periods
    const recentMetrics = analytics.slice(0, 3).map(a => a.metrics?.performance_score || 0);
    const avgRecent = recentMetrics.reduce((a, b) => a + b, 0) / recentMetrics.length;
    
    const olderMetrics = analytics.slice(3, 6).map(a => a.metrics?.performance_score || 0);
    const avgOlder = olderMetrics.length > 0 ? 
      olderMetrics.reduce((a, b) => a + b, 0) / olderMetrics.length : 
      avgRecent * 0.9;
    
    const improvementRate = avgOlder > 0 ? ((avgRecent - avgOlder) / avgOlder) * 100 : 0;
    const projection = avgRecent * (1 + improvementRate / 100);
    
    return {
      improving: improvementRate > 0,
      improvementRate: Math.abs(improvementRate),
      projection: Math.round(projection),
      confidence: Math.min(85, 60 + analytics.length * 5)
    };
  }

  private async identifySkillGaps(profile: any, analytics: any[]): Promise<any[]> {
    // Simplified skill gap analysis
    const currentSkills = profile?.specializations || [];
    const performanceBySkill: { [key: string]: number } = {};
    
    // Analyze which skills correlate with better performance
    const potentialSkills = ['negotiation', 'technical_knowledge', 'relationship_building', 'data_analysis'];
    
    return potentialSkills
      .filter(skill => !currentSkills.includes(skill))
      .map(skill => ({
        skill,
        currentLevel: Math.random() * 50, // Replace with actual assessment
        targetLevel: 80,
        potentialImprovement: Math.floor(Math.random() * 20) + 10
      }))
      .sort((a, b) => b.potentialImprovement - a.potentialImprovement);
  }

  private async calculateAverageSalesCycle(userId: string, start: Date, end: Date): Promise<number> {
    // Calculate average days from opportunity to close
    // Simplified - enhance with actual calculation
    return 45; // days
  }

  private async calculateWinRate(userId: string, start: Date, end: Date): Promise<number> {
    // Calculate win rate from opportunities
    // Simplified - enhance with actual calculation
    return 35; // percentage
  }

  private async calculateEngagementScore(userId: string, activities: any[]): Promise<number> {
    // Calculate engagement based on activity quality and frequency
    // Simplified - enhance with actual calculation
    return 75; // score out of 100
  }

  private async getContactDetails(contactId: string): Promise<any> {
    const { data } = await supabase
      .from('suis_contact_universe')
      .select('*')
      .eq('id', contactId)
      .single();
    return data;
  }

  private async getMarketDataForProcedure(procedureType?: string): Promise<any[]> {
    if (!procedureType) return [];
    
    const { data } = await supabase
      .from('suis_market_intelligence')
      .select('*')
      .eq('data->>procedure', procedureType)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return data || [];
  }

  private async getHistoricalSuccessRate(userId: string, procedureType?: string): Promise<any> {
    // Calculate historical success rate for user and procedure
    // Simplified - enhance with actual calculation
    return {
      successRate: 0.42,
      sampleSize: 25
    };
  }

  private async scoreMarketTrend(marketData: any[]): Promise<number> {
    // Score based on market growth and opportunity
    if (marketData.length === 0) return 50;
    
    const avgGrowth = marketData.reduce((sum, d) => sum + (d.data?.growth_rate || 0), 0) / marketData.length;
    return Math.min(100, 50 + avgGrowth * 2);
  }

  private async scoreContactEngagement(contact: any): Promise<number> {
    if (!contact) return 0;
    
    const baseScore = contact.quality_score * 100;
    const engagementBonus = contact.engagement_history?.length || 0;
    
    return Math.min(100, baseScore + engagementBonus * 5);
  }

  private async scoreCompetitivePosition(contact: any, marketData: any[]): Promise<number> {
    // Score based on competitive landscape
    // Simplified - enhance with actual calculation
    return 70;
  }

  private async scoreTiming(contact: any, marketData: any[]): Promise<number> {
    // Score based on timing factors
    // Simplified - enhance with actual calculation
    return 80;
  }

  private generateOpportunityRecommendation(score: number, factors: any): string {
    if (score >= 80) {
      return 'High priority opportunity - immediate action recommended. Focus on building relationship and presenting value proposition.';
    } else if (score >= 60) {
      return 'Good opportunity with strong potential. Invest in relationship building and address any concerns.';
    } else if (score >= 40) {
      return 'Moderate opportunity requiring nurturing. Focus on education and long-term relationship development.';
    } else {
      return 'Lower priority opportunity. Maintain periodic contact and monitor for changing conditions.';
    }
  }

  private async saveInsights(userId: string, insights: PredictiveInsight[]): Promise<void> {
    // Save insights as notifications
    const notifications = insights.map(insight => ({
      user_id: userId,
      notificationType: 'insight',
      priority: insight.impact === 'high' ? 'high' : insight.impact === 'medium' ? 'medium' : 'low',
      title: insight.title,
      content: {
        description: insight.description,
        confidence: insight.confidence,
        timeframe: insight.timeframe,
        suggestedActions: insight.suggestedActions
      },
      contextData: insight.relatedData,
      actionRequired: insight.actionRequired,
      created_at: new Date().toISOString()
    }));

    await supabase.from('suis_notifications').insert(notifications);
  }

  private async saveMetrics(
    userId: string, 
    metrics: PerformanceMetrics, 
    periodStart: Date, 
    periodEnd: Date
  ): Promise<void> {
    await supabase.from('suis_unified_analytics').insert({
      user_id: userId,
      analytics_type: 'rep_performance',
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      metrics,
      created_at: new Date().toISOString()
    });
  }
}

export const suisAnalyticsEngine = new SUISAnalyticsEngine();