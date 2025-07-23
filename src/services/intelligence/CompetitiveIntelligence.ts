// Competitive Intelligence Service - Monitor competitors and market dynamics
// Provides real-time insights and automated response strategies

import { supabase } from '../supabase/supabase';
import { EventEmitter } from 'events';

export interface Competitor {
  id: string;
  company_name: string;
  products: CompetitorProduct[];
  market_share?: number;
  strengths: string[];
  weaknesses: string[];
  recent_activities: CompetitorActivity[];
  monitoring_keywords: string[];
  threat_level: 'high' | 'medium' | 'low';
  last_updated: string;
}

export interface CompetitorProduct {
  id: string;
  name: string;
  category: string;
  fda_clearance?: string;
  key_features: string[];
  pricing_info?: PricingInfo;
  market_position: string;
  customer_feedback: CustomerSentiment;
}

export interface PricingInfo {
  list_price?: number;
  average_selling_price?: number;
  pricing_model: 'one_time' | 'subscription' | 'usage_based';
  discounting_patterns?: string[];
}

export interface CustomerSentiment {
  overall_rating: number;
  total_reviews: number;
  positive_themes: string[];
  negative_themes: string[];
  recent_trend: 'improving' | 'stable' | 'declining';
}

export interface CompetitorActivity {
  id: string;
  competitor_id: string;
  activity_type: 'product_launch' | 'pricing_change' | 'marketing_campaign' | 'clinical_study' | 'partnership' | 'regulatory_update';
  title: string;
  description: string;
  impact_assessment: ImpactAssessment;
  detected_at: string;
  source: string;
  response_required: boolean;
  response_strategy?: ResponseStrategy;
}

export interface ImpactAssessment {
  impact_level: 'critical' | 'high' | 'medium' | 'low';
  affected_products: string[];
  affected_markets: string[];
  revenue_impact_estimate?: number;
  timeline: 'immediate' | 'short_term' | 'long_term';
}

export interface ResponseStrategy {
  id: string;
  strategy_type: 'defensive' | 'offensive' | 'neutral';
  recommended_actions: RecommendedAction[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  implementation_timeline: string;
  success_metrics: string[];
}

export interface RecommendedAction {
  action: string;
  department: 'sales' | 'marketing' | 'product' | 'clinical' | 'executive';
  resources_required: string[];
  estimated_effort: 'low' | 'medium' | 'high';
  expected_outcome: string;
}

export interface MarketIntelligence {
  id: string;
  market_segment: string;
  total_market_size: number;
  growth_rate: number;
  key_trends: MarketTrend[];
  opportunities: MarketOpportunity[];
  threats: MarketThreat[];
  updated_at: string;
}

export interface MarketTrend {
  trend_name: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  relevance_score: number;
  supporting_data: any[];
}

export interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  market_size_estimate: number;
  difficulty: 'low' | 'medium' | 'high';
  time_to_capture: string;
  required_capabilities: string[];
  competitive_advantage: string;
}

export interface MarketThreat {
  id: string;
  threat_type: 'new_entrant' | 'substitute_product' | 'regulatory_change' | 'technology_shift';
  description: string;
  probability: 'high' | 'medium' | 'low';
  potential_impact: number;
  mitigation_strategies: string[];
}

export interface CompetitiveBattlecard {
  id: string;
  competitor_id: string;
  our_product: string;
  their_product: string;
  key_differentiators: Differentiator[];
  win_strategies: WinStrategy[];
  objection_handlers: ObjectionHandler[];
  proof_points: ProofPoint[];
  updated_at: string;
}

export interface Differentiator {
  feature: string;
  our_advantage: string;
  their_limitation: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface WinStrategy {
  scenario: string;
  strategy: string;
  talking_points: string[];
  supporting_materials: string[];
}

export interface ObjectionHandler {
  objection: string;
  response: string;
  evidence: string[];
  redirect_to_strength: string;
}

export interface ProofPoint {
  claim: string;
  evidence_type: 'clinical_study' | 'customer_testimonial' | 'third_party_validation' | 'performance_data';
  source: string;
  details: string;
}

export class CompetitiveIntelligence extends EventEmitter {
  private static instance: CompetitiveIntelligence;
  private competitors: Map<string, Competitor> = new Map();
  private monitoringActive: boolean = false;
  private alertThresholds = {
    priceChange: 0.1, // 10% price change
    marketShareShift: 0.05, // 5% market share shift
    sentimentChange: 0.2 // 20% sentiment change
  };

  private constructor() {
    super();
    this.initializeMonitoring();
  }

  static getInstance(): CompetitiveIntelligence {
    if (!CompetitiveIntelligence.instance) {
      CompetitiveIntelligence.instance = new CompetitiveIntelligence();
    }
    return CompetitiveIntelligence.instance;
  }

  private async initializeMonitoring() {
    // Load competitors from database
    await this.loadCompetitors();
    
    // Start real-time monitoring
    this.startRealtimeMonitoring();
  }

  private async loadCompetitors() {
    const { data, error } = await supabase
      .from('competitors')
      .select(`
        *,
        products:competitor_products(*),
        recent_activities:competitor_activities(*)
      `);

    if (error) {
      console.error('Error loading competitors:', error);
      return;
    }

    data?.forEach(competitor => {
      this.competitors.set(competitor.id, competitor);
    });
  }

  // Real-time competitor monitoring
  private startRealtimeMonitoring() {
    if (this.monitoringActive) return;

    // Monitor competitor activities
    const activitySubscription = supabase
      .channel('competitor-activities')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'competitor_activities'
      }, (payload) => {
        this.handleCompetitorActivity(payload);
      })
      .subscribe();

    // Monitor market intelligence updates
    const marketSubscription = supabase
      .channel('market-intelligence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'market_intelligence'
      }, (payload) => {
        this.handleMarketUpdate(payload);
      })
      .subscribe();

    this.monitoringActive = true;
  }

  private async handleCompetitorActivity(payload: any) {
    const activity = payload.new as CompetitorActivity;
    
    // Assess impact
    const impact = await this.assessActivityImpact(activity);
    
    // Generate response strategy if needed
    if (impact.impact_level === 'critical' || impact.impact_level === 'high') {
      const strategy = await this.generateResponseStrategy(activity, impact);
      
      // Emit alert for high-impact activities
      this.emit('competitor-alert', {
        activity,
        impact,
        strategy,
        timestamp: new Date().toISOString()
      });
    }

    // Update competitor profile
    await this.updateCompetitorProfile(activity.competitor_id);
  }

  private async handleMarketUpdate(payload: any) {
    const update = payload.new;
    
    // Analyze market changes
    const analysis = await this.analyzeMarketChanges(update);
    
    if (analysis.significantChange) {
      this.emit('market-shift', {
        update,
        analysis,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Assess impact of competitor activity
  private async assessActivityImpact(activity: CompetitorActivity): Promise<ImpactAssessment> {
    let impactLevel: ImpactAssessment['impact_level'] = 'low';
    const affectedProducts: string[] = [];
    const affectedMarkets: string[] = [];
    
    switch (activity.activity_type) {
      case 'product_launch':
        // Analyze competitive overlap
        const overlap = await this.analyzeProductOverlap(activity.description);
        if (overlap > 0.7) impactLevel = 'critical';
        else if (overlap > 0.5) impactLevel = 'high';
        else if (overlap > 0.3) impactLevel = 'medium';
        break;
        
      case 'pricing_change':
        // Analyze pricing impact
        const priceImpact = await this.analyzePricingImpact(activity.description);
        if (Math.abs(priceImpact) > 0.2) impactLevel = 'high';
        else if (Math.abs(priceImpact) > 0.1) impactLevel = 'medium';
        break;
        
      case 'clinical_study':
        // Analyze clinical advantage
        if (activity.description.toLowerCase().includes('superior') || 
            activity.description.toLowerCase().includes('breakthrough')) {
          impactLevel = 'high';
        }
        break;
    }

    return {
      impact_level: impactLevel,
      affected_products: affectedProducts,
      affected_markets: affectedMarkets,
      timeline: this.determineTimeline(activity.activity_type)
    };
  }

  private determineTimeline(activityType: string): ImpactAssessment['timeline'] {
    switch (activityType) {
      case 'pricing_change': return 'immediate';
      case 'marketing_campaign': return 'short_term';
      case 'product_launch': return 'short_term';
      case 'clinical_study': return 'long_term';
      default: return 'short_term';
    }
  }

  // Generate response strategy
  async generateResponseStrategy(
    activity: CompetitorActivity,
    impact: ImpactAssessment
  ): Promise<ResponseStrategy> {
    const recommendedActions: RecommendedAction[] = [];
    let strategyType: ResponseStrategy['strategy_type'] = 'neutral';
    let priority: ResponseStrategy['priority'] = 'medium';

    switch (activity.activity_type) {
      case 'product_launch':
        strategyType = 'defensive';
        priority = impact.impact_level === 'critical' ? 'urgent' : 'high';
        recommendedActions.push(
          {
            action: 'Update competitive battlecards with new product information',
            department: 'sales',
            resources_required: ['Competitive team', 'Product marketing'],
            estimated_effort: 'medium',
            expected_outcome: 'Sales team prepared to address competitive threat'
          },
          {
            action: 'Develop comparison materials highlighting our advantages',
            department: 'marketing',
            resources_required: ['Content team', 'Clinical data'],
            estimated_effort: 'high',
            expected_outcome: 'Clear differentiation messaging'
          }
        );
        break;

      case 'pricing_change':
        strategyType = 'offensive';
        priority = 'urgent';
        recommendedActions.push(
          {
            action: 'Analyze price elasticity and consider matching or value positioning',
            department: 'sales',
            resources_required: ['Pricing analyst', 'Sales leadership'],
            estimated_effort: 'medium',
            expected_outcome: 'Optimized pricing strategy'
          },
          {
            action: 'Communicate value proposition to offset price differences',
            department: 'marketing',
            resources_required: ['Marketing team', 'Customer success stories'],
            estimated_effort: 'low',
            expected_outcome: 'Reinforced value perception'
          }
        );
        break;

      case 'clinical_study':
        strategyType = 'offensive';
        priority = 'high';
        recommendedActions.push(
          {
            action: 'Review our clinical data and identify counter-points',
            department: 'clinical',
            resources_required: ['Clinical affairs', 'Medical writing'],
            estimated_effort: 'high',
            expected_outcome: 'Scientific rebuttal prepared'
          },
          {
            action: 'Accelerate our own clinical studies if applicable',
            department: 'product',
            resources_required: ['R&D', 'Clinical operations'],
            estimated_effort: 'high',
            expected_outcome: 'Competitive clinical evidence'
          }
        );
        break;
    }

    return {
      id: crypto.randomUUID(),
      strategy_type: strategyType,
      recommended_actions: recommendedActions,
      priority,
      implementation_timeline: this.getImplementationTimeline(priority),
      success_metrics: this.defineSuccessMetrics(activity.activity_type)
    };
  }

  private getImplementationTimeline(priority: string): string {
    switch (priority) {
      case 'urgent': return '24-48 hours';
      case 'high': return '1 week';
      case 'medium': return '2-4 weeks';
      case 'low': return '1-2 months';
      default: return '1 month';
    }
  }

  private defineSuccessMetrics(activityType: string): string[] {
    switch (activityType) {
      case 'product_launch':
        return ['Win rate maintained', 'No customer defections', 'Market share stable'];
      case 'pricing_change':
        return ['Revenue protected', 'Deal sizes maintained', 'Discount rates controlled'];
      case 'clinical_study':
        return ['Scientific credibility maintained', 'No lost opportunities due to clinical claims'];
      default:
        return ['Competitive position maintained', 'Customer retention'];
    }
  }

  // Analyze product overlap
  private async analyzeProductOverlap(productDescription: string): Promise<number> {
    // Simplified overlap calculation - in production, use NLP/ML
    const ourProducts = await this.getOurProducts();
    let maxOverlap = 0;

    ourProducts.forEach(product => {
      const overlap = this.calculateTextSimilarity(productDescription, product.description);
      maxOverlap = Math.max(maxOverlap, overlap);
    });

    return maxOverlap;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simplified similarity - in production, use proper NLP
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    return intersection.size / Math.max(words1.size, words2.size);
  }

  // Analyze pricing impact
  private async analyzePricingImpact(description: string): Promise<number> {
    // Extract price change from description
    const priceMatch = description.match(/(\d+)%/);
    if (priceMatch) {
      return parseInt(priceMatch[1]) / 100;
    }
    return 0;
  }

  // Generate competitive battlecard
  async generateBattlecard(
    competitorId: string,
    ourProduct: string,
    theirProduct: string
  ): Promise<CompetitiveBattlecard> {
    const competitor = this.competitors.get(competitorId);
    if (!competitor) throw new Error('Competitor not found');

    // Analyze differentiators
    const differentiators = await this.analyzeDifferentiators(ourProduct, theirProduct, competitor);
    
    // Develop win strategies
    const winStrategies = this.developWinStrategies(differentiators, competitor);
    
    // Create objection handlers
    const objectionHandlers = this.createObjectionHandlers(competitor, differentiators);
    
    // Compile proof points
    const proofPoints = await this.compileProofPoints(ourProduct);

    const battlecard: CompetitiveBattlecard = {
      id: crypto.randomUUID(),
      competitor_id: competitorId,
      our_product: ourProduct,
      their_product: theirProduct,
      key_differentiators: differentiators,
      win_strategies: winStrategies,
      objection_handlers: objectionHandlers,
      proof_points: proofPoints,
      updated_at: new Date().toISOString()
    };

    // Store battlecard
    await this.saveBattlecard(battlecard);

    return battlecard;
  }

  private async analyzeDifferentiators(
    ourProduct: string,
    theirProduct: string,
    competitor: Competitor
  ): Promise<Differentiator[]> {
    // In production, this would use product databases and feature comparisons
    return [
      {
        feature: 'Clinical Outcomes',
        our_advantage: 'Superior long-term results with peer-reviewed studies',
        their_limitation: 'Limited long-term data available',
        importance: 'critical'
      },
      {
        feature: 'Ease of Use',
        our_advantage: 'Intuitive design with minimal training required',
        their_limitation: 'Complex procedure with steep learning curve',
        importance: 'high'
      },
      {
        feature: 'Cost Effectiveness',
        our_advantage: 'Lower total cost of ownership',
        their_limitation: 'Higher consumable costs',
        importance: 'medium'
      }
    ];
  }

  private developWinStrategies(
    differentiators: Differentiator[],
    competitor: Competitor
  ): WinStrategy[] {
    const strategies: WinStrategy[] = [];

    // Strategy based on critical differentiators
    const criticalDiff = differentiators.filter(d => d.importance === 'critical');
    if (criticalDiff.length > 0) {
      strategies.push({
        scenario: 'Head-to-head competition',
        strategy: 'Focus on clinical superiority and long-term outcomes',
        talking_points: [
          'Our peer-reviewed studies show superior outcomes',
          'Long-term data demonstrates sustained benefits',
          'Lower revision rates compared to alternatives'
        ],
        supporting_materials: ['Clinical study summary', 'Peer review publications']
      });
    }

    // Price-focused strategy
    strategies.push({
      scenario: 'Price-sensitive buyer',
      strategy: 'Emphasize total cost of ownership and value',
      talking_points: [
        'Lower consumable costs over product lifetime',
        'Reduced training time saves money',
        'Better outcomes reduce follow-up costs'
      ],
      supporting_materials: ['TCO calculator', 'ROI analysis']
    });

    return strategies;
  }

  private createObjectionHandlers(
    competitor: Competitor,
    differentiators: Differentiator[]
  ): ObjectionHandler[] {
    return [
      {
        objection: `${competitor.company_name} has been in the market longer`,
        response: 'While they have market tenure, we offer next-generation technology with proven superior outcomes',
        evidence: ['Clinical comparison data', 'Technology advantages'],
        redirect_to_strength: 'Innovation and clinical results'
      },
      {
        objection: 'Their product is less expensive',
        response: 'Initial cost is just one factor. Our solution provides better value through superior outcomes and lower total costs',
        evidence: ['TCO analysis', 'Outcome data'],
        redirect_to_strength: 'Total value and ROI'
      }
    ];
  }

  private async compileProofPoints(product: string): Promise<ProofPoint[]> {
    // In production, fetch from evidence database
    return [
      {
        claim: '30% better outcomes in clinical trials',
        evidence_type: 'clinical_study',
        source: 'Journal of Medical Devices, 2024',
        details: 'Randomized controlled trial with 500 patients'
      },
      {
        claim: '95% physician satisfaction rate',
        evidence_type: 'third_party_validation',
        source: 'Independent physician survey',
        details: 'Survey of 200 physicians using the device'
      }
    ];
  }

  // Market intelligence analysis
  async analyzeMarketChanges(update: any): Promise<any> {
    const significantChange = false;
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Analyze growth rate changes
    if (update.growth_rate_change && Math.abs(update.growth_rate_change) > 0.02) {
      insights.push(`Market growth rate changed by ${update.growth_rate_change * 100}%`);
      recommendations.push('Adjust sales forecasts and resource allocation');
    }

    // Analyze new entrants
    if (update.new_entrants && update.new_entrants.length > 0) {
      insights.push(`${update.new_entrants.length} new competitors entered the market`);
      recommendations.push('Conduct competitive analysis on new entrants');
    }

    return {
      significantChange: insights.length > 0,
      insights,
      recommendations,
      urgency: insights.length > 2 ? 'high' : 'medium'
    };
  }

  // Helper methods
  private async getOurProducts(): Promise<any[]> {
    const { data } = await supabase
      .from('products')
      .select('*');
    return data || [];
  }

  private async saveBattlecard(battlecard: CompetitiveBattlecard): Promise<void> {
    const { error } = await supabase
      .from('competitive_battlecards')
      .upsert(battlecard);

    if (error) {
      console.error('Error saving battlecard:', error);
    }
  }

  private async updateCompetitorProfile(competitorId: string): Promise<void> {
    const { error } = await supabase
      .from('competitors')
      .update({ last_updated: new Date().toISOString() })
      .eq('id', competitorId);

    if (error) {
      console.error('Error updating competitor profile:', error);
    }
  }

  // Public methods for accessing intelligence
  async getCompetitorInsights(competitorId: string): Promise<any> {
    const competitor = this.competitors.get(competitorId);
    if (!competitor) return null;

    const recentActivities = await this.getRecentActivities(competitorId);
    const marketPosition = await this.analyzeMarketPosition(competitor);
    const threats = await this.assessCompetitiveThreats(competitor);

    return {
      competitor,
      recentActivities,
      marketPosition,
      threats,
      recommendations: this.generateStrategicRecommendations(threats)
    };
  }

  private async getRecentActivities(competitorId: string): Promise<CompetitorActivity[]> {
    const { data } = await supabase
      .from('competitor_activities')
      .select('*')
      .eq('competitor_id', competitorId)
      .order('detected_at', { ascending: false })
      .limit(10);

    return data || [];
  }

  private async analyzeMarketPosition(competitor: Competitor): Promise<any> {
    return {
      market_share: competitor.market_share,
      share_trend: 'stable', // Would calculate from historical data
      competitive_advantages: competitor.strengths,
      vulnerabilities: competitor.weaknesses,
      threat_assessment: competitor.threat_level
    };
  }

  private async assessCompetitiveThreats(competitor: Competitor): Promise<any[]> {
    const threats = [];

    if (competitor.threat_level === 'high') {
      threats.push({
        type: 'market_share',
        description: 'Aggressive market expansion',
        probability: 'high',
        impact: 'significant'
      });
    }

    return threats;
  }

  private generateStrategicRecommendations(threats: any[]): string[] {
    const recommendations: string[] = [];

    threats.forEach(threat => {
      switch (threat.type) {
        case 'market_share':
          recommendations.push('Strengthen customer relationships to prevent defection');
          recommendations.push('Accelerate new customer acquisition');
          break;
        case 'product_innovation':
          recommendations.push('Invest in R&D to maintain technological edge');
          break;
      }
    });

    return recommendations;
  }

  // Subscribe to competitive alerts
  onCompetitorAlert(callback: (alert: any) => void): () => void {
    this.on('competitor-alert', callback);
    return () => this.off('competitor-alert', callback);
  }

  onMarketShift(callback: (shift: any) => void): () => void {
    this.on('market-shift', callback);
    return () => this.off('market-shift', callback);
  }
}

export default CompetitiveIntelligence;