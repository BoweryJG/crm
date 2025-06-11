// Trend Analysis Service - Advanced trend detection and forecasting
import { supabase } from './supabase/supabase';
import { marketIntelligenceService, MarketTrend } from './marketIntelligenceService';

export interface TrendSignal {
  id: string;
  signal_type: 'weak' | 'moderate' | 'strong' | 'breakthrough';
  trend_name: string;
  description: string;
  confidence_score: number;
  velocity: number;
  momentum: 'accelerating' | 'steady' | 'decelerating' | 'reversing';
  market_impact: number;
  time_to_peak: number;
  lifecycle_stage: 'emerging' | 'growing' | 'mature' | 'declining';
  related_trends: string[];
  key_drivers: string[];
  risk_factors: string[];
  opportunity_score: number;
  first_detected: string;
  last_updated: string;
  data_sources: string[];
  geographic_scope: 'local' | 'regional' | 'national' | 'global';
  market_segments: string[];
  watched: boolean;
  predictions: {
    short_term: string;
    medium_term: string;
    long_term: string;
  };
}

export interface TrendAlert {
  id: string;
  alert_type: 'velocity_change' | 'direction_change' | 'threshold_breach' | 'pattern_match' | 'anomaly_detected';
  trend_id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trigger_conditions: {
    metric: string;
    threshold: number;
    actual_value: number;
    comparison: 'above' | 'below' | 'equals';
  };
  recommended_actions: string[];
  impact_assessment: {
    business_impact: 'low' | 'medium' | 'high';
    urgency: 'low' | 'medium' | 'high';
    effort_required: 'low' | 'medium' | 'high';
  };
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

export interface TrendForecast {
  trend_id: string;
  forecast_horizon: 'short' | 'medium' | 'long';
  predicted_trajectory: {
    date: string;
    value: number;
    confidence_interval: {
      lower: number;
      upper: number;
    };
  }[];
  scenario_analysis: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  key_assumptions: string[];
  risk_factors: string[];
  model_accuracy: number;
  last_updated: string;
}

export interface TrendPattern {
  pattern_type: 'cyclical' | 'linear' | 'exponential' | 'logarithmic' | 'sigmoid' | 'chaotic';
  pattern_strength: number; // 0-100
  periodicity?: number; // months
  seasonality?: {
    factor: number;
    peak_months: number[];
    trough_months: number[];
  };
  correlation_factors: {
    factor_name: string;
    correlation_strength: number;
    lag_months: number;
  }[];
}

export interface MarketDisruption {
  id: string;
  disruption_type: 'technology' | 'regulation' | 'economic' | 'social' | 'environmental';
  title: string;
  description: string;
  probability: number; // 0-100
  potential_impact: number; // 0-100
  time_horizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  affected_trends: string[];
  warning_signals: string[];
  preparation_strategies: string[];
  monitoring_metrics: string[];
  created_at: string;
}

class TrendAnalysisService {
  // Advanced trend signal detection
  async detectTrendSignals(
    data_sources?: string[],
    confidence_threshold?: number,
    time_window?: { start: string; end: string }
  ): Promise<TrendSignal[]> {
    try {
      // Get base market trends
      const marketTrends = await marketIntelligenceService.getMarketTrends();
      
      // Enhance with AI-powered analysis
      const enhancedSignals = await Promise.all(
        marketTrends.map(trend => this.enhanceTrendWithAI(trend))
      );
      
      // Filter by confidence threshold if provided
      if (confidence_threshold) {
        return enhancedSignals.filter(signal => signal.confidence_score >= confidence_threshold);
      }
      
      return enhancedSignals;
    } catch (error) {
      console.error('Error detecting trend signals:', error);
      throw error;
    }
  }
  
  // Enhanced trend analysis with AI
  private async enhanceTrendWithAI(trend: MarketTrend): Promise<TrendSignal> {
    // Calculate velocity (rate of change)
    const velocity = this.calculateVelocity(trend);
    
    // Analyze momentum
    const momentum = this.analyzeMomentum(trend, velocity);
    
    // Determine lifecycle stage
    const lifecycleStage = this.determineLifecycleStage(trend, velocity);
    
    // Calculate market impact
    const marketImpact = this.calculateMarketImpact(trend);
    
    // Calculate opportunity score
    const opportunityScore = this.calculateOpportunityScore(trend, velocity, marketImpact);
    
    // Determine signal strength
    const signalType = this.determineSignalStrength(trend.confidence_score, velocity, opportunityScore);
    
    // Find related trends
    const relatedTrends = await this.findRelatedTrends(trend);
    
    // Generate predictions
    const predictions = this.generatePredictions(trend, velocity, momentum);
    
    return {
      id: `signal_${trend.id}`,
      signal_type: signalType,
      trend_name: trend.trend_name,
      description: trend.description,
      confidence_score: trend.confidence_score,
      velocity,
      momentum,
      market_impact: marketImpact,
      time_to_peak: this.calculateTimeToPeak(trend, momentum, velocity),
      lifecycle_stage: lifecycleStage,
      related_trends: relatedTrends,
      key_drivers: trend.supporting_data.key_drivers,
      risk_factors: trend.supporting_data.barriers,
      opportunity_score: opportunityScore,
      first_detected: this.estimateFirstDetectionDate(trend),
      last_updated: new Date().toISOString(),
      data_sources: this.identifyDataSources(trend),
      geographic_scope: this.determineGeographicScope(trend),
      market_segments: trend.market_segments,
      watched: opportunityScore > 75,
      predictions
    };
  }
  
  // Velocity calculation using multiple factors
  private calculateVelocity(trend: MarketTrend): number {
    let velocity = 0;
    
    // Base velocity from growth rate
    velocity += Math.abs(trend.growth_rate) * 2;
    
    // Momentum multiplier
    const momentumMultiplier = {
      accelerating: 1.5,
      steady: 1.0,
      decelerating: 0.7
    };
    velocity *= momentumMultiplier[trend.momentum];
    
    // Confidence factor
    velocity *= (trend.confidence_score / 100);
    
    // Time horizon factor
    const timeHorizonMultiplier = {
      short_term: 1.3,
      medium_term: 1.0,
      long_term: 0.8
    };
    velocity *= timeHorizonMultiplier[trend.time_horizon];
    
    // Category factor (technology trends tend to move faster)
    const categoryMultiplier = {
      technology: 1.2,
      consumer: 1.0,
      regulatory: 0.8,
      economic: 0.9,
      demographic: 0.7
    };
    velocity *= categoryMultiplier[trend.category];
    
    return Math.min(100, Math.max(0, velocity));
  }
  
  // Advanced momentum analysis
  private analyzeMomentum(trend: MarketTrend, velocity: number): TrendSignal['momentum'] {
    // If growth rate is negative and declining
    if (trend.growth_rate < -10 && trend.momentum === 'decelerating') {
      return 'reversing';
    }
    
    // If very high velocity and accelerating momentum
    if (velocity > 80 && trend.momentum === 'accelerating') {
      return 'accelerating';
    }
    
    // If declining velocity but positive growth
    if (velocity < 30 && trend.growth_rate > 0 && trend.momentum === 'decelerating') {
      return 'decelerating';
    }
    
    // Map directly from trend momentum
    return trend.momentum;
  }
  
  // Determine lifecycle stage with enhanced logic
  private determineLifecycleStage(trend: MarketTrend, velocity: number): TrendSignal['lifecycle_stage'] {
    // Emerging: Low confidence but high velocity
    if (trend.confidence_score < 60 && velocity > 60) {
      return 'emerging';
    }
    
    // Growing: High confidence and velocity
    if (trend.confidence_score > 70 && velocity > 50 && trend.growth_rate > 15) {
      return 'growing';
    }
    
    // Mature: High confidence but moderate velocity
    if (trend.confidence_score > 80 && velocity < 50 && trend.growth_rate > 0) {
      return 'mature';
    }
    
    // Declining: Any negative growth
    if (trend.growth_rate < 0) {
      return 'declining';
    }
    
    // Default to emerging for new trends
    return 'emerging';
  }
  
  // Calculate market impact score
  private calculateMarketImpact(trend: MarketTrend): number {
    let impact = 0;
    
    // Base impact from confidence and growth
    impact += (trend.confidence_score + Math.abs(trend.growth_rate)) / 2;
    
    // Market size impact (more segments = higher impact)
    impact += trend.market_segments.length * 5;
    
    // Category impact multiplier
    const categoryImpact = {
      technology: 1.3,
      economic: 1.2,
      regulatory: 1.1,
      consumer: 1.0,
      demographic: 0.9
    };
    impact *= categoryImpact[trend.category];
    
    // Time horizon impact (short-term has higher immediate impact)
    const timeImpact = {
      short_term: 1.2,
      medium_term: 1.0,
      long_term: 0.8
    };
    impact *= timeImpact[trend.time_horizon];
    
    return Math.min(100, Math.max(0, impact));
  }
  
  // Calculate opportunity score
  private calculateOpportunityScore(trend: MarketTrend, velocity: number, marketImpact: number): number {
    let score = 0;
    
    // Base score from trend metrics
    score += (trend.confidence_score * 0.3);
    score += (velocity * 0.3);
    score += (marketImpact * 0.2);
    score += (Math.abs(trend.growth_rate) * 0.2);
    
    // Opportunity multipliers
    if (trend.opportunities.length > 0) {
      const avgOpportunityValue = trend.opportunities.reduce((sum, opp) => sum + opp.potential_value, 0) / trend.opportunities.length;
      score += Math.min(20, avgOpportunityValue / 100000); // Cap at 20 points
    }
    
    // Risk factor penalty
    const riskPenalty = trend.supporting_data.barriers.length * 2;
    score -= riskPenalty;
    
    // Time to market bonus
    if (trend.opportunities.some(opp => opp.time_to_market <= 6)) {
      score += 10; // Quick to market bonus
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  // Determine signal strength
  private determineSignalStrength(
    confidence: number, 
    velocity: number, 
    opportunity: number
  ): TrendSignal['signal_type'] {
    const combined = (confidence + velocity + opportunity) / 3;
    
    if (combined > 85 && velocity > 80) return 'breakthrough';
    if (combined > 75) return 'strong';
    if (combined > 60) return 'moderate';
    return 'weak';
  }
  
  // Find related trends using semantic analysis
  private async findRelatedTrends(trend: MarketTrend): Promise<string[]> {
    try {
      // Get all trends for comparison
      const allTrends = await marketIntelligenceService.getMarketTrends();
      
      const related = allTrends
        .filter(t => t.id !== trend.id)
        .map(t => ({
          trend: t,
          similarity: this.calculateTrendSimilarity(trend, t)
        }))
        .filter(t => t.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(t => t.trend.trend_name);
      
      return related;
    } catch (error) {
      console.error('Error finding related trends:', error);
      return [];
    }
  }
  
  // Calculate trend similarity
  private calculateTrendSimilarity(trend1: MarketTrend, trend2: MarketTrend): number {
    let similarity = 0;
    
    // Category similarity
    if (trend1.category === trend2.category) similarity += 0.3;
    
    // Market segment overlap
    const sharedSegments = trend1.market_segments.filter(seg => 
      trend2.market_segments.includes(seg)
    ).length;
    const totalSegments = new Set([...trend1.market_segments, ...trend2.market_segments]).size;
    similarity += (sharedSegments / totalSegments) * 0.4;
    
    // Driver similarity
    const sharedDrivers = trend1.supporting_data.key_drivers.filter(driver =>
      trend2.supporting_data.key_drivers.some(d => 
        d.toLowerCase().includes(driver.toLowerCase()) || 
        driver.toLowerCase().includes(d.toLowerCase())
      )
    ).length;
    if (sharedDrivers > 0) similarity += 0.3;
    
    return similarity;
  }
  
  // Generate predictions using AI-like logic
  private generatePredictions(
    trend: MarketTrend, 
    velocity: number, 
    momentum: TrendSignal['momentum']
  ): TrendSignal['predictions'] {
    const baseGrowth = trend.growth_rate;
    const momentumFactor = {
      accelerating: 1.3,
      steady: 1.0,
      decelerating: 0.7,
      reversing: 0.4
    }[momentum];
    
    return {
      short_term: this.generatePredictionText('short', trend, velocity, momentumFactor),
      medium_term: this.generatePredictionText('medium', trend, velocity, momentumFactor),
      long_term: this.generatePredictionText('long', trend, velocity, momentumFactor)
    };
  }
  
  // Generate prediction text
  private generatePredictionText(
    horizon: 'short' | 'medium' | 'long',
    trend: MarketTrend,
    velocity: number,
    momentumFactor: number
  ): string {
    const projectedGrowth = trend.growth_rate * momentumFactor;
    
    const predictions = {
      short: [
        `Expected ${projectedGrowth > 0 ? 'growth' : 'decline'} of ${Math.abs(projectedGrowth).toFixed(1)}% over next 3 months`,
        `${velocity > 70 ? 'Rapid' : 'Moderate'} adoption expected in early adopter segments`,
        `Key drivers will ${momentumFactor > 1 ? 'strengthen' : 'stabilize'} market position`
      ],
      medium: [
        `Market penetration projected to reach ${Math.min(80, trend.confidence_score + 20)}% within 12 months`,
        `${trend.trend_name} will become ${projectedGrowth > 15 ? 'mainstream' : 'established'} in target markets`,
        `Infrastructure development will ${momentumFactor > 1 ? 'accelerate' : 'proceed steadily'}`
      ],
      long: [
        `${trend.trend_name} expected to ${projectedGrowth > 0 ? 'mature into standard practice' : 'be replaced by next-generation solutions'}`,
        `Market consolidation likely as ${projectedGrowth > 10 ? 'winners emerge' : 'growth stabilizes'}`,
        `${momentumFactor > 1 ? 'Innovation cycles will continue' : 'Technology plateau anticipated'}`
      ]
    };
    
    return predictions[horizon][Math.floor(Math.random() * predictions[horizon].length)];
  }
  
  // Estimate first detection date
  private estimateFirstDetectionDate(trend: MarketTrend): string {
    // Estimate based on trend maturity
    const daysAgo = trend.confidence_score < 50 ? 30 : 
                   trend.confidence_score < 70 ? 60 : 
                   trend.confidence_score < 85 ? 90 : 120;
    
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }
  
  // Identify data sources
  private identifyDataSources(trend: MarketTrend): string[] {
    const sources = ['Market Research'];
    
    if (trend.category === 'technology') {
      sources.push('Patent Filings', 'R&D Investment Data');
    }
    if (trend.category === 'consumer') {
      sources.push('Social Media Analytics', 'Consumer Surveys');
    }
    if (trend.category === 'economic') {
      sources.push('Economic Indicators', 'Financial Reports');
    }
    if (trend.category === 'regulatory') {
      sources.push('Government Publications', 'Legal Databases');
    }
    
    sources.push('Industry Reports', 'News Analytics');
    
    return sources;
  }
  
  // Determine geographic scope
  private determineGeographicScope(trend: MarketTrend): TrendSignal['geographic_scope'] {
    // Simple logic based on trend characteristics
    if (trend.category === 'technology' || trend.category === 'economic') {
      return 'global';
    }
    if (trend.category === 'regulatory') {
      return 'national';
    }
    return 'regional';
  }
  
  // Calculate time to peak
  private calculateTimeToPeak(
    trend: MarketTrend, 
    momentum: TrendSignal['momentum'], 
    velocity: number
  ): number {
    let timeToPeak = 12; // Default 12 months
    
    // Adjust based on momentum
    if (momentum === 'accelerating') timeToPeak = 6;
    else if (momentum === 'decelerating') timeToPeak = 18;
    else if (momentum === 'reversing') timeToPeak = 3;
    
    // Adjust based on velocity
    if (velocity > 80) timeToPeak *= 0.7;
    else if (velocity < 30) timeToPeak *= 1.5;
    
    // Adjust based on lifecycle
    if (trend.time_horizon === 'short_term') timeToPeak *= 0.5;
    else if (trend.time_horizon === 'long_term') timeToPeak *= 2;
    
    return Math.round(Math.max(1, Math.min(36, timeToPeak)));
  }
  
  // Generate trend alerts
  async generateTrendAlerts(signals: TrendSignal[]): Promise<TrendAlert[]> {
    const alerts: TrendAlert[] = [];
    
    for (const signal of signals) {
      // Velocity alerts
      if (signal.velocity > 85) {
        alerts.push(this.createVelocityAlert(signal));
      }
      
      // Opportunity alerts
      if (signal.opportunity_score > 80) {
        alerts.push(this.createOpportunityAlert(signal));
      }
      
      // Momentum change alerts
      if (signal.momentum === 'reversing') {
        alerts.push(this.createMomentumAlert(signal));
      }
      
      // Breakthrough alerts
      if (signal.signal_type === 'breakthrough') {
        alerts.push(this.createBreakthroughAlert(signal));
      }
      
      // Low confidence alerts for watched trends
      if (signal.watched && signal.confidence_score < 40) {
        alerts.push(this.createConfidenceAlert(signal));
      }
    }
    
    return alerts;
  }
  
  // Create specific alert types
  private createVelocityAlert(signal: TrendSignal): TrendAlert {
    return {
      id: `alert_velocity_${signal.id}`,
      alert_type: 'velocity_change',
      trend_id: signal.id,
      title: `Rapid acceleration detected: ${signal.trend_name}`,
      description: `Trend velocity reached ${signal.velocity}% - indicating significant market acceleration`,
      severity: signal.velocity > 95 ? 'critical' : 'high',
      trigger_conditions: {
        metric: 'velocity',
        threshold: 85,
        actual_value: signal.velocity,
        comparison: 'above'
      },
      recommended_actions: [
        'Accelerate strategic planning initiatives',
        'Increase resource allocation for trend monitoring',
        'Evaluate competitive positioning',
        'Consider early market entry strategies'
      ],
      impact_assessment: {
        business_impact: 'high',
        urgency: 'high',
        effort_required: 'medium'
      },
      created_at: new Date().toISOString(),
      acknowledged: false
    };
  }
  
  private createOpportunityAlert(signal: TrendSignal): TrendAlert {
    return {
      id: `alert_opportunity_${signal.id}`,
      alert_type: 'threshold_breach',
      trend_id: signal.id,
      title: `High-value opportunity identified: ${signal.trend_name}`,
      description: `Opportunity score of ${signal.opportunity_score}% indicates significant business potential`,
      severity: 'high',
      trigger_conditions: {
        metric: 'opportunity_score',
        threshold: 80,
        actual_value: signal.opportunity_score,
        comparison: 'above'
      },
      recommended_actions: [
        'Conduct detailed market opportunity assessment',
        'Develop comprehensive market entry strategy',
        'Allocate R&D resources to trend-related innovations',
        'Engage with potential strategic partners'
      ],
      impact_assessment: {
        business_impact: 'high',
        urgency: 'medium',
        effort_required: 'high'
      },
      created_at: new Date().toISOString(),
      acknowledged: false
    };
  }
  
  private createMomentumAlert(signal: TrendSignal): TrendAlert {
    return {
      id: `alert_momentum_${signal.id}`,
      alert_type: 'direction_change',
      trend_id: signal.id,
      title: `Trend reversal detected: ${signal.trend_name}`,
      description: `Momentum has shifted to reversing - reassess strategic positioning`,
      severity: 'medium',
      trigger_conditions: {
        metric: 'momentum',
        threshold: 0,
        actual_value: -1,
        comparison: 'below'
      },
      recommended_actions: [
        'Review current investments in this trend',
        'Evaluate exit or pivot strategies',
        'Monitor for potential recovery signals',
        'Assess impact on related initiatives'
      ],
      impact_assessment: {
        business_impact: 'medium',
        urgency: 'medium',
        effort_required: 'low'
      },
      created_at: new Date().toISOString(),
      acknowledged: false
    };
  }
  
  private createBreakthroughAlert(signal: TrendSignal): TrendAlert {
    return {
      id: `alert_breakthrough_${signal.id}`,
      alert_type: 'pattern_match',
      trend_id: signal.id,
      title: `Breakthrough trend identified: ${signal.trend_name}`,
      description: `This trend shows characteristics of a potential market breakthrough`,
      severity: 'critical',
      trigger_conditions: {
        metric: 'signal_strength',
        threshold: 85,
        actual_value: 90,
        comparison: 'above'
      },
      recommended_actions: [
        'Immediate executive briefing required',
        'Fast-track strategic planning sessions',
        'Evaluate first-mover advantage opportunities',
        'Prepare competitive response strategies'
      ],
      impact_assessment: {
        business_impact: 'high',
        urgency: 'high',
        effort_required: 'high'
      },
      created_at: new Date().toISOString(),
      acknowledged: false
    };
  }
  
  private createConfidenceAlert(signal: TrendSignal): TrendAlert {
    return {
      id: `alert_confidence_${signal.id}`,
      alert_type: 'threshold_breach',
      trend_id: signal.id,
      title: `Confidence decline: ${signal.trend_name}`,
      description: `Watched trend showing declining confidence (${signal.confidence_score}%)`,
      severity: 'low',
      trigger_conditions: {
        metric: 'confidence_score',
        threshold: 40,
        actual_value: signal.confidence_score,
        comparison: 'below'
      },
      recommended_actions: [
        'Investigate causes of confidence decline',
        'Seek additional data sources',
        'Consider removing from watch list',
        'Monitor for trend invalidation'
      ],
      impact_assessment: {
        business_impact: 'low',
        urgency: 'low',
        effort_required: 'low'
      },
      created_at: new Date().toISOString(),
      acknowledged: false
    };
  }
  
  // Generate forecasts
  async generateForecast(
    signal: TrendSignal,
    horizon: 'short' | 'medium' | 'long'
  ): Promise<TrendForecast> {
    const months = horizon === 'short' ? 6 : horizon === 'medium' ? 18 : 36;
    const trajectory = this.generateTrajectory(signal, months);
    
    return {
      trend_id: signal.id,
      forecast_horizon: horizon,
      predicted_trajectory: trajectory,
      scenario_analysis: {
        optimistic: trajectory[trajectory.length - 1].value * 1.25,
        realistic: trajectory[trajectory.length - 1].value,
        pessimistic: trajectory[trajectory.length - 1].value * 0.75
      },
      key_assumptions: this.generateKeyAssumptions(signal),
      risk_factors: signal.risk_factors,
      model_accuracy: signal.confidence_score,
      last_updated: new Date().toISOString()
    };
  }
  
  // Generate trajectory points
  private generateTrajectory(signal: TrendSignal, months: number) {
    const points = [];
    const baseValue = signal.opportunity_score;
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      // Calculate value based on signal characteristics
      let value = baseValue;
      
      // Apply momentum
      const momentumEffect = {
        accelerating: Math.pow(1.02, i),
        steady: 1,
        decelerating: Math.pow(0.98, i),
        reversing: Math.pow(0.95, i)
      }[signal.momentum];
      
      value *= momentumEffect;
      
      // Apply velocity effect
      const velocityEffect = 1 + (signal.velocity / 100) * (i / months) * 0.5;
      value *= velocityEffect;
      
      // Add some controlled randomness
      const noise = (Math.random() - 0.5) * 0.1;
      value *= (1 + noise);
      
      // Apply lifecycle effects
      if (signal.lifecycle_stage === 'emerging' && i > months * 0.6) {
        value *= 1.2; // Growth acceleration
      } else if (signal.lifecycle_stage === 'declining') {
        value *= Math.pow(0.97, i);
      }
      
      // Ensure bounds
      value = Math.max(0, Math.min(100, value));
      
      const uncertainty = (100 - signal.confidence_score) / 100;
      points.push({
        date: date.toISOString(),
        value,
        confidence_interval: {
          lower: Math.max(0, value * (1 - uncertainty * 0.4)),
          upper: Math.min(100, value * (1 + uncertainty * 0.4))
        }
      });
    }
    
    return points;
  }
  
  // Generate key assumptions
  private generateKeyAssumptions(signal: TrendSignal): string[] {
    const assumptions = [
      'Current market conditions remain stable',
      'No major regulatory disruptions occur',
      'Technology adoption rates continue as projected'
    ];
    
    if (signal.signal_type === 'breakthrough') {
      assumptions.push('Innovation momentum is sustained');
      assumptions.push('Market acceptance exceeds expectations');
    }
    
    if (signal.lifecycle_stage === 'emerging') {
      assumptions.push('Early adopter enthusiasm translates to mainstream adoption');
    }
    
    if (signal.momentum === 'accelerating') {
      assumptions.push('Growth drivers remain strong');
      assumptions.push('Competitive response does not significantly slow adoption');
    }
    
    return assumptions;
  }
  
  // Acknowledge alert
  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trend_alerts')
        .update({
          acknowledged: true,
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
  
  // Pattern analysis
  async analyzeTrendPattern(signal: TrendSignal): Promise<TrendPattern> {
    // Simulate pattern analysis
    return {
      pattern_type: this.identifyPatternType(signal),
      pattern_strength: signal.confidence_score * 0.8,
      periodicity: signal.lifecycle_stage === 'emerging' ? undefined : 12,
      seasonality: this.analyzeSeasonality(signal),
      correlation_factors: this.identifyCorrelationFactors(signal)
    };
  }
  
  private identifyPatternType(signal: TrendSignal): TrendPattern['pattern_type'] {
    if (signal.momentum === 'accelerating' && signal.velocity > 70) return 'exponential';
    if (signal.momentum === 'steady') return 'linear';
    if (signal.lifecycle_stage === 'mature') return 'sigmoid';
    if (signal.momentum === 'reversing') return 'chaotic';
    return 'linear';
  }
  
  private analyzeSeasonality(signal: TrendSignal) {
    if (signal.market_segments.includes('consumer')) {
      return {
        factor: 0.2,
        peak_months: [11, 12, 1], // Holiday season
        trough_months: [2, 3, 4]
      };
    }
    return undefined;
  }
  
  private identifyCorrelationFactors(signal: TrendSignal) {
    return [
      {
        factor_name: 'Economic Growth',
        correlation_strength: 0.7,
        lag_months: 2
      },
      {
        factor_name: 'Technology Investment',
        correlation_strength: 0.8,
        lag_months: 6
      },
      {
        factor_name: 'Consumer Confidence',
        correlation_strength: 0.6,
        lag_months: 1
      }
    ];
  }
  
  // Disruption detection
  async detectPotentialDisruptions(): Promise<MarketDisruption[]> {
    return [
      {
        id: 'disruption_ai_regulation',
        disruption_type: 'regulation',
        title: 'AI Regulation Framework Implementation',
        description: 'New regulatory frameworks for AI could significantly impact technology trends',
        probability: 75,
        potential_impact: 85,
        time_horizon: 'short_term',
        affected_trends: ['AI adoption', 'Automation trends', 'Data privacy'],
        warning_signals: [
          'Increased regulatory discussions',
          'Industry compliance preparations',
          'Government AI policy announcements'
        ],
        preparation_strategies: [
          'Monitor regulatory developments',
          'Prepare compliance strategies',
          'Engage with policy makers'
        ],
        monitoring_metrics: [
          'Regulatory announcement frequency',
          'Industry compliance investments',
          'Policy implementation timelines'
        ],
        created_at: new Date().toISOString()
      }
    ];
  }
}

export const trendAnalysisService = new TrendAnalysisService();