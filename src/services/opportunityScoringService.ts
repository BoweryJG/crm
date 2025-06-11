// Market Opportunity Scoring Service - Advanced opportunity identification and prioritization
import { supabase } from '../config/supabase';
import { marketIntelligenceService, MarketOpportunity, MarketTrend } from './marketIntelligenceService';
import { trendAnalysisService, TrendSignal } from './trendAnalysisService';

export interface OpportunityScore {
  opportunity_id: string;
  overall_score: number; // 0-100
  component_scores: {
    market_attractiveness: number;
    competitive_advantage: number;
    strategic_fit: number;
    execution_feasibility: number;
    financial_potential: number;
    risk_assessment: number;
  };
  scoring_rationale: {
    strengths: string[];
    weaknesses: string[];
    key_factors: string[];
    assumptions: string[];
  };
  recommendation: {
    action: 'pursue_immediately' | 'investigate_further' | 'monitor' | 'pass';
    priority: 'critical' | 'high' | 'medium' | 'low';
    timeline: string;
    next_steps: string[];
    resource_requirements: string[];
    success_probability: number;
  };
  comparable_opportunities: {
    opportunity_id: string;
    similarity_score: number;
    comparison_points: string[];
  }[];
  market_dynamics: {
    growth_trajectory: 'accelerating' | 'steady' | 'decelerating' | 'mature';
    competitive_intensity: 'low' | 'medium' | 'high' | 'intense';
    barriers_to_entry: 'low' | 'medium' | 'high';
    customer_readiness: number; // 0-100
    technology_maturity: number; // 0-100
  };
  sensitivity_analysis: {
    optimistic_score: number;
    pessimistic_score: number;
    key_variables: {
      variable: string;
      impact_on_score: number;
      confidence: number;
    }[];
  };
  created_at: string;
  updated_at: string;
}

export interface OpportunityMatrix {
  matrix_type: 'attractiveness_feasibility' | 'growth_share' | 'risk_return' | 'strategic_priority';
  opportunities: {
    opportunity_id: string;
    x_axis_value: number;
    y_axis_value: number;
    bubble_size: number;
    quadrant: 'high_high' | 'high_low' | 'low_high' | 'low_low';
    quadrant_label: string;
    recommended_action: string;
  }[];
  axis_labels: {
    x_axis: string;
    y_axis: string;
    size_metric: string;
  };
  quadrant_descriptions: {
    high_high: string;
    high_low: string;
    low_high: string;
    low_low: string;
  };
  insights: {
    top_quadrant_count: number;
    emerging_opportunities: string[];
    declining_opportunities: string[];
    strategic_recommendations: string[];
  };
}

export interface OpportunityPipeline {
  pipeline_stages: {
    stage: 'discovery' | 'evaluation' | 'development' | 'execution' | 'monitoring';
    opportunities: {
      opportunity_id: string;
      stage_entry_date: string;
      stage_completion_probability: number;
      key_milestones: {
        milestone: string;
        target_date: string;
        completion_status: 'pending' | 'in_progress' | 'completed' | 'delayed';
        owner: string;
      }[];
      blockers: string[];
      success_criteria: string[];
    }[];
  }[];
  pipeline_metrics: {
    total_pipeline_value: number;
    weighted_pipeline_value: number;
    stage_conversion_rates: Record<string, number>;
    average_stage_duration: Record<string, number>;
    pipeline_velocity: number;
  };
  recommendations: {
    stage_optimizations: string[];
    resource_allocations: string[];
    process_improvements: string[];
  };
}

export interface OpportunityTrend {
  trend_id: string;
  opportunity_correlation: number; // -1 to 1
  influence_type: 'driver' | 'enabler' | 'barrier' | 'catalyst';
  impact_timing: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  confidence_level: number; // 0-100
  historical_correlation: {
    data_points: {
      date: string;
      trend_strength: number;
      opportunity_score: number;
    }[];
    correlation_coefficient: number;
    trend_direction: 'positive' | 'negative' | 'neutral';
  };
  predictive_impact: {
    if_trend_accelerates: {
      score_change: number;
      timeline_change: string;
      risk_change: number;
    };
    if_trend_decelerates: {
      score_change: number;
      timeline_change: string;
      risk_change: number;
    };
  };
}

class OpportunityScoringService {
  private readonly SCORING_WEIGHTS = {
    market_attractiveness: 0.25,
    competitive_advantage: 0.20,
    strategic_fit: 0.20,
    execution_feasibility: 0.15,
    financial_potential: 0.15,
    risk_assessment: 0.05
  };

  // Score a market opportunity
  async scoreOpportunity(
    opportunity: MarketOpportunity,
    context?: {
      company_strengths?: string[];
      strategic_priorities?: string[];
      resource_constraints?: string[];
      market_context?: any;
    }
  ): Promise<OpportunityScore> {
    try {
      // Calculate component scores
      const componentScores = {
        market_attractiveness: this.scoreMarketAttractiveness(opportunity),
        competitive_advantage: this.scoreCompetitiveAdvantage(opportunity, context?.company_strengths),
        strategic_fit: this.scoreStrategicFit(opportunity, context?.strategic_priorities),
        execution_feasibility: this.scoreExecutionFeasibility(opportunity, context?.resource_constraints),
        financial_potential: this.scoreFinancialPotential(opportunity),
        risk_assessment: this.scoreRiskAssessment(opportunity)
      };

      // Calculate overall score
      const overallScore = Object.entries(componentScores).reduce(
        (total, [component, score]) => 
          total + (score * this.SCORING_WEIGHTS[component as keyof typeof this.SCORING_WEIGHTS]), 
        0
      );

      // Generate scoring rationale
      const rationale = this.generateScoringRationale(opportunity, componentScores);

      // Generate recommendation
      const recommendation = this.generateRecommendation(overallScore, componentScores, opportunity);

      // Find comparable opportunities
      const comparableOpportunities = await this.findComparableOpportunities(opportunity);

      // Analyze market dynamics
      const marketDynamics = await this.analyzeMarketDynamics(opportunity);

      // Perform sensitivity analysis
      const sensitivityAnalysis = this.performSensitivityAnalysis(opportunity, componentScores);

      return {
        opportunity_id: opportunity.id,
        overall_score: Math.round(overallScore),
        component_scores: componentScores,
        scoring_rationale: rationale,
        recommendation,
        comparable_opportunities: comparableOpportunities,
        market_dynamics: marketDynamics,
        sensitivity_analysis: sensitivityAnalysis,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error scoring opportunity:', error);
      throw error;
    }
  }

  // Score market attractiveness
  private scoreMarketAttractiveness(opportunity: MarketOpportunity): number {
    let score = 0;

    // Market size (40% weight)
    const marketSizeScore = Math.min(100, (opportunity.market_size / 10000000) * 100); // Cap at $10M
    score += marketSizeScore * 0.4;

    // Growth potential (35% weight)
    score += opportunity.growth_potential * 0.35;

    // Competition level (25% weight) - inverse scoring
    const competitionScore = {
      low: 100,
      medium: 60,
      high: 30
    }[opportunity.competition_level];
    score += competitionScore * 0.25;

    return Math.min(100, Math.max(0, score));
  }

  // Score competitive advantage
  private scoreCompetitiveAdvantage(
    opportunity: MarketOpportunity, 
    companyStrengths?: string[]
  ): number {
    let score = 50; // Base score

    // Required capabilities alignment
    if (companyStrengths && opportunity.required_capabilities) {
      const alignmentScore = opportunity.required_capabilities.reduce((total, capability) => {
        const hasCapability = companyStrengths.some(strength => 
          strength.toLowerCase().includes(capability.toLowerCase()) ||
          capability.toLowerCase().includes(strength.toLowerCase())
        );
        return total + (hasCapability ? 20 : -5);
      }, 0);
      score += Math.min(40, Math.max(-20, alignmentScore));
    }

    // Barriers to entry (defensibility)
    const barrierScore = opportunity.barriers_to_entry.length * 8;
    score += Math.min(20, barrierScore);

    // Investment requirements efficiency
    const investmentEfficiency = opportunity.market_size / opportunity.investment_required.max;
    if (investmentEfficiency > 10) score += 15;
    else if (investmentEfficiency > 5) score += 10;
    else if (investmentEfficiency < 2) score -= 10;

    return Math.min(100, Math.max(0, score));
  }

  // Score strategic fit
  private scoreStrategicFit(
    opportunity: MarketOpportunity, 
    strategicPriorities?: string[]
  ): number {
    let score = 50; // Base score

    // Opportunity type alignment
    const typeScore = {
      new_market: 85,      // High strategic value
      expansion: 80,       // Natural growth
      product_gap: 75,     // Innovation opportunity
      partnership: 65,     // External dependency
      acquisition: 60      // Complex integration
    }[opportunity.opportunity_type];
    score = typeScore;

    // Strategic priority alignment
    if (strategicPriorities) {
      const priorityAlignment = strategicPriorities.some(priority =>
        opportunity.description.toLowerCase().includes(priority.toLowerCase()) ||
        opportunity.required_capabilities.some(cap => 
          cap.toLowerCase().includes(priority.toLowerCase())
        )
      );
      if (priorityAlignment) score += 15;
    }

    // Time to capture bonus for quick wins
    if (opportunity.time_to_capture <= 3) score += 10;
    else if (opportunity.time_to_capture > 12) score -= 10;

    return Math.min(100, Math.max(0, score));
  }

  // Score execution feasibility
  private scoreExecutionFeasibility(
    opportunity: MarketOpportunity, 
    resourceConstraints?: string[]
  ): number {
    let score = 70; // Optimistic base

    // Investment requirements
    const maxInvestment = opportunity.investment_required.max;
    if (maxInvestment < 100000) score += 20;
    else if (maxInvestment < 500000) score += 10;
    else if (maxInvestment > 2000000) score -= 20;
    else if (maxInvestment > 1000000) score -= 10;

    // Time to capture
    if (opportunity.time_to_capture <= 6) score += 15;
    else if (opportunity.time_to_capture <= 12) score += 5;
    else if (opportunity.time_to_capture > 18) score -= 15;

    // Risk assessment impact
    const riskPenalty = {
      low: 0,
      medium: -10,
      high: -25
    }[opportunity.risk_assessment.risk_level];
    score += riskPenalty;

    // Resource constraint penalties
    if (resourceConstraints) {
      const constraintPenalty = resourceConstraints.length * 5;
      score -= Math.min(20, constraintPenalty);
    }

    return Math.min(100, Math.max(0, score));
  }

  // Score financial potential
  private scoreFinancialPotential(opportunity: MarketOpportunity): number {
    let score = 0;

    // Market size to investment ratio
    const roi = opportunity.market_size / opportunity.investment_required.max;
    if (roi > 50) score += 40;
    else if (roi > 20) score += 30;
    else if (roi > 10) score += 20;
    else if (roi > 5) score += 10;

    // Growth potential
    score += opportunity.growth_potential * 0.3;

    // Time to capture efficiency
    const timeEfficiency = 24 / opportunity.time_to_capture; // 2 years baseline
    score += Math.min(30, timeEfficiency * 15);

    return Math.min(100, Math.max(0, score));
  }

  // Score risk assessment (inverse - lower risk = higher score)
  private scoreRiskAssessment(opportunity: MarketOpportunity): number {
    let score = 100; // Start high

    // Risk level penalty
    const riskPenalty = {
      low: 0,
      medium: 20,
      high: 40
    }[opportunity.risk_assessment.risk_level];
    score -= riskPenalty;

    // Number of key risks
    score -= opportunity.risk_assessment.key_risks.length * 5;

    // Mitigation strategies bonus
    score += opportunity.risk_assessment.mitigation_strategies.length * 3;

    return Math.min(100, Math.max(0, score));
  }

  // Generate scoring rationale
  private generateScoringRationale(
    opportunity: MarketOpportunity, 
    scores: OpportunityScore['component_scores']
  ): OpportunityScore['scoring_rationale'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const keyFactors: string[] = [];

    // Analyze each component
    Object.entries(scores).forEach(([component, score]) => {
      if (score >= 80) {
        strengths.push(this.getStrengthReason(component, opportunity));
      } else if (score <= 40) {
        weaknesses.push(this.getWeaknessReason(component, opportunity));
      }
      
      if (score >= 70 || score <= 50) {
        keyFactors.push(this.getKeyFactor(component, score, opportunity));
      }
    });

    return {
      strengths,
      weaknesses,
      key_factors: keyFactors,
      assumptions: [
        'Market conditions remain stable',
        'Competitive landscape does not shift dramatically',
        'Required capabilities can be developed or acquired',
        'Investment capital is available as projected'
      ]
    };
  }

  private getStrengthReason(component: string, opportunity: MarketOpportunity): string {
    const reasons = {
      market_attractiveness: `Large market size of $${(opportunity.market_size / 1000000).toFixed(1)}M with ${opportunity.growth_potential}% growth potential`,
      competitive_advantage: `Strong competitive position with ${opportunity.barriers_to_entry.length} barriers to entry`,
      strategic_fit: `High strategic alignment with ${opportunity.opportunity_type} opportunity type`,
      execution_feasibility: `Achievable execution with ${opportunity.time_to_capture} month timeline`,
      financial_potential: `Attractive ROI with market size to investment ratio of ${(opportunity.market_size / opportunity.investment_required.max).toFixed(1)}x`,
      risk_assessment: `Well-managed risk profile with ${opportunity.risk_assessment.mitigation_strategies.length} mitigation strategies`
    };
    return reasons[component] || `Strong ${component.replace('_', ' ')} profile`;
  }

  private getWeaknessReason(component: string, opportunity: MarketOpportunity): string {
    const reasons = {
      market_attractiveness: `Limited market appeal due to ${opportunity.competition_level} competition`,
      competitive_advantage: `Weak competitive position requiring significant capability development`,
      strategic_fit: `Misalignment with current strategic direction and capabilities`,
      execution_feasibility: `Challenging execution due to high investment requirements ($${(opportunity.investment_required.max / 1000).toFixed(0)}k)`,
      financial_potential: `Uncertain financial returns given market dynamics`,
      risk_assessment: `High risk exposure with ${opportunity.risk_assessment.key_risks.length} significant risk factors`
    };
    return reasons[component] || `Concerning ${component.replace('_', ' ')} profile`;
  }

  private getKeyFactor(component: string, score: number, opportunity: MarketOpportunity): string {
    const impact = score >= 70 ? 'positively influences' : 'negatively impacts';
    return `${component.replace('_', ' ').toUpperCase()} ${impact} overall scoring (${score}%)`;
  }

  // Generate recommendation
  private generateRecommendation(
    overallScore: number, 
    componentScores: OpportunityScore['component_scores'], 
    opportunity: MarketOpportunity
  ): OpportunityScore['recommendation'] {
    let action: OpportunityScore['recommendation']['action'];
    let priority: OpportunityScore['recommendation']['priority'];
    let timeline: string;
    let successProbability: number;

    // Determine action based on overall score
    if (overallScore >= 80) {
      action = 'pursue_immediately';
      priority = 'critical';
      timeline = 'Immediate action required within 2 weeks';
      successProbability = 85;
    } else if (overallScore >= 70) {
      action = 'pursue_immediately';
      priority = 'high';
      timeline = 'Begin planning within 1 month';
      successProbability = 75;
    } else if (overallScore >= 60) {
      action = 'investigate_further';
      priority = 'medium';
      timeline = 'Complete analysis within 2 months';
      successProbability = 65;
    } else if (overallScore >= 40) {
      action = 'monitor';
      priority = 'low';
      timeline = 'Quarterly review and assessment';
      successProbability = 45;
    } else {
      action = 'pass';
      priority = 'low';
      timeline = 'No immediate action required';
      successProbability = 25;
    }

    // Generate next steps based on action
    const nextSteps = this.generateNextSteps(action, componentScores, opportunity);
    const resourceRequirements = this.generateResourceRequirements(action, opportunity);

    return {
      action,
      priority,
      timeline,
      next_steps: nextSteps,
      resource_requirements: resourceRequirements,
      success_probability: successProbability
    };
  }

  private generateNextSteps(
    action: OpportunityScore['recommendation']['action'], 
    scores: OpportunityScore['component_scores'], 
    opportunity: MarketOpportunity
  ): string[] {
    const steps: string[] = [];

    switch (action) {
      case 'pursue_immediately':
        steps.push('Form cross-functional opportunity team');
        steps.push('Develop detailed business case');
        steps.push('Secure executive sponsorship');
        steps.push('Create implementation roadmap');
        if (scores.competitive_advantage < 70) {
          steps.push('Conduct competitive analysis and positioning');
        }
        if (scores.execution_feasibility < 70) {
          steps.push('Assess resource requirements and availability');
        }
        break;

      case 'investigate_further':
        steps.push('Conduct deeper market research');
        steps.push('Validate opportunity assumptions');
        steps.push('Perform pilot or proof-of-concept');
        if (scores.market_attractiveness < 60) {
          steps.push('Reassess market size and growth potential');
        }
        if (scores.strategic_fit < 60) {
          steps.push('Evaluate strategic alignment and fit');
        }
        break;

      case 'monitor':
        steps.push('Set up monitoring dashboards');
        steps.push('Define trigger events for re-evaluation');
        steps.push('Maintain market intelligence');
        steps.push('Quarterly opportunity review');
        break;

      case 'pass':
        steps.push('Document decision rationale');
        steps.push('Archive opportunity for future reference');
        steps.push('Notify stakeholders of decision');
        break;
    }

    return steps;
  }

  private generateResourceRequirements(
    action: OpportunityScore['recommendation']['action'], 
    opportunity: MarketOpportunity
  ): string[] {
    const resources: string[] = [];

    if (action === 'pursue_immediately') {
      resources.push('Executive sponsor and steering committee');
      resources.push('Cross-functional project team (5-8 members)');
      resources.push(`Budget allocation: $${(opportunity.investment_required.min / 1000).toFixed(0)}k - $${(opportunity.investment_required.max / 1000).toFixed(0)}k`);
      
      opportunity.required_capabilities.forEach(capability => {
        resources.push(`${capability} expertise and capabilities`);
      });
    } else if (action === 'investigate_further') {
      resources.push('Research team (2-3 analysts)');
      resources.push('Subject matter experts');
      resources.push('Market research budget ($10k - $50k)');
    } else if (action === 'monitor') {
      resources.push('Part-time analyst for monitoring');
      resources.push('Market intelligence tools and subscriptions');
    }

    return resources;
  }

  // Find comparable opportunities
  private async findComparableOpportunities(
    opportunity: MarketOpportunity
  ): Promise<OpportunityScore['comparable_opportunities']> {
    try {
      // Get all opportunities for comparison
      const allOpportunities = await marketIntelligenceService.getMarketOpportunities();
      
      const comparisons = allOpportunities
        .filter(opp => opp.id !== opportunity.id)
        .map(opp => ({
          opportunity_id: opp.id,
          similarity_score: this.calculateSimilarity(opportunity, opp),
          comparison_points: this.generateComparisonPoints(opportunity, opp)
        }))
        .filter(comp => comp.similarity_score > 0.3)
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, 3);

      return comparisons;
    } catch (error) {
      console.error('Error finding comparable opportunities:', error);
      return [];
    }
  }

  private calculateSimilarity(opp1: MarketOpportunity, opp2: MarketOpportunity): number {
    let similarity = 0;

    // Type similarity
    if (opp1.opportunity_type === opp2.opportunity_type) similarity += 0.3;

    // Market size similarity
    const sizeDiff = Math.abs(opp1.market_size - opp2.market_size) / Math.max(opp1.market_size, opp2.market_size);
    similarity += (1 - sizeDiff) * 0.2;

    // Investment similarity
    const investDiff = Math.abs(opp1.investment_required.max - opp2.investment_required.max) / 
                      Math.max(opp1.investment_required.max, opp2.investment_required.max);
    similarity += (1 - investDiff) * 0.2;

    // Competition level similarity
    if (opp1.competition_level === opp2.competition_level) similarity += 0.15;

    // Time to capture similarity
    const timeDiff = Math.abs(opp1.time_to_capture - opp2.time_to_capture) / 
                    Math.max(opp1.time_to_capture, opp2.time_to_capture);
    similarity += (1 - timeDiff) * 0.15;

    return similarity;
  }

  private generateComparisonPoints(opp1: MarketOpportunity, opp2: MarketOpportunity): string[] {
    const points: string[] = [];

    if (opp1.opportunity_type === opp2.opportunity_type) {
      points.push(`Both are ${opp1.opportunity_type} opportunities`);
    }

    if (Math.abs(opp1.market_size - opp2.market_size) / opp1.market_size < 0.3) {
      points.push('Similar market size and potential');
    }

    if (opp1.competition_level === opp2.competition_level) {
      points.push(`Comparable competition level (${opp1.competition_level})`);
    }

    return points;
  }

  // Analyze market dynamics
  private async analyzeMarketDynamics(
    opportunity: MarketOpportunity
  ): Promise<OpportunityScore['market_dynamics']> {
    try {
      // This would integrate with trend analysis in production
      const growthTrajectory = opportunity.growth_potential > 30 ? 'accelerating' :
                              opportunity.growth_potential > 15 ? 'steady' :
                              opportunity.growth_potential > 5 ? 'decelerating' : 'mature';

      const competitiveIntensity = opportunity.competition_level === 'high' ? 'intense' :
                                  opportunity.competition_level === 'medium' ? 'high' :
                                  opportunity.competition_level === 'low' ? 'medium' : 'low';

      const barriersToEntry = opportunity.barriers_to_entry.length > 3 ? 'high' :
                             opportunity.barriers_to_entry.length > 1 ? 'medium' : 'low';

      // Calculate customer readiness and technology maturity
      const customerReadiness = Math.min(100, opportunity.growth_potential + 
                                (opportunity.time_to_capture <= 6 ? 20 : 0));
      
      const technologyMaturity = opportunity.opportunity_type === 'new_market' ? 60 :
                                 opportunity.opportunity_type === 'product_gap' ? 80 :
                                 90;

      return {
        growth_trajectory: growthTrajectory as any,
        competitive_intensity: competitiveIntensity as any,
        barriers_to_entry: barriersToEntry as any,
        customer_readiness: customerReadiness,
        technology_maturity: technologyMaturity
      };
    } catch (error) {
      console.error('Error analyzing market dynamics:', error);
      throw error;
    }
  }

  // Perform sensitivity analysis
  private performSensitivityAnalysis(
    opportunity: MarketOpportunity, 
    baseScores: OpportunityScore['component_scores']
  ): OpportunityScore['sensitivity_analysis'] {
    // Calculate optimistic scenario (increase key variables by 20%)
    const optimisticScores = { ...baseScores };
    optimisticScores.market_attractiveness *= 1.2;
    optimisticScores.financial_potential *= 1.2;
    const optimisticScore = this.calculateWeightedScore(optimisticScores);

    // Calculate pessimistic scenario (decrease key variables by 20%)
    const pessimisticScores = { ...baseScores };
    pessimisticScores.market_attractiveness *= 0.8;
    pessimisticScores.execution_feasibility *= 0.8;
    pessimisticScores.risk_assessment *= 0.8;
    const pessimisticScore = this.calculateWeightedScore(pessimisticScores);

    // Identify key variables and their impact
    const keyVariables = [
      {
        variable: 'Market Size',
        impact_on_score: 15,
        confidence: 75
      },
      {
        variable: 'Competition Level',
        impact_on_score: 12,
        confidence: 80
      },
      {
        variable: 'Investment Requirements',
        impact_on_score: 10,
        confidence: 90
      },
      {
        variable: 'Time to Capture',
        impact_on_score: 8,
        confidence: 70
      }
    ];

    return {
      optimistic_score: Math.round(optimisticScore),
      pessimistic_score: Math.round(pessimisticScore),
      key_variables: keyVariables
    };
  }

  private calculateWeightedScore(scores: OpportunityScore['component_scores']): number {
    return Object.entries(scores).reduce(
      (total, [component, score]) => 
        total + (Math.min(100, score) * this.SCORING_WEIGHTS[component as keyof typeof this.SCORING_WEIGHTS]), 
      0
    );
  }

  // Generate opportunity matrix
  async generateOpportunityMatrix(
    opportunities: MarketOpportunity[],
    matrixType: OpportunityMatrix['matrix_type'] = 'attractiveness_feasibility'
  ): Promise<OpportunityMatrix> {
    try {
      const scoredOpportunities = await Promise.all(
        opportunities.map(async opp => {
          const score = await this.scoreOpportunity(opp);
          return { opportunity: opp, score };
        })
      );

      const matrixData = scoredOpportunities.map(({ opportunity, score }) => {
        let xValue, yValue, bubbleSize;
        
        switch (matrixType) {
          case 'attractiveness_feasibility':
            xValue = score.component_scores.market_attractiveness;
            yValue = score.component_scores.execution_feasibility;
            bubbleSize = opportunity.market_size / 1000000; // Size in millions
            break;
          case 'growth_share':
            xValue = opportunity.growth_potential;
            yValue = score.component_scores.competitive_advantage;
            bubbleSize = opportunity.market_size / 1000000;
            break;
          case 'risk_return':
            xValue = 100 - score.component_scores.risk_assessment; // Risk level
            yValue = score.component_scores.financial_potential;
            bubbleSize = opportunity.investment_required.max / 100000;
            break;
          case 'strategic_priority':
            xValue = score.component_scores.strategic_fit;
            yValue = score.overall_score;
            bubbleSize = opportunity.time_to_capture;
            break;
          default:
            xValue = yValue = bubbleSize = 50;
        }

        const quadrant = this.determineQuadrant(xValue, yValue);
        
        return {
          opportunity_id: opportunity.id,
          x_axis_value: xValue,
          y_axis_value: yValue,
          bubble_size: bubbleSize,
          quadrant,
          quadrant_label: this.getQuadrantLabel(matrixType, quadrant),
          recommended_action: this.getQuadrantAction(matrixType, quadrant)
        };
      });

      return {
        matrix_type: matrixType,
        opportunities: matrixData,
        axis_labels: this.getAxisLabels(matrixType),
        quadrant_descriptions: this.getQuadrantDescriptions(matrixType),
        insights: this.generateMatrixInsights(matrixData, matrixType)
      };
    } catch (error) {
      console.error('Error generating opportunity matrix:', error);
      throw error;
    }
  }

  private determineQuadrant(x: number, y: number): OpportunityMatrix['opportunities'][0]['quadrant'] {
    if (x >= 50 && y >= 50) return 'high_high';
    if (x >= 50 && y < 50) return 'high_low';
    if (x < 50 && y >= 50) return 'low_high';
    return 'low_low';
  }

  private getQuadrantLabel(
    matrixType: OpportunityMatrix['matrix_type'], 
    quadrant: OpportunityMatrix['opportunities'][0]['quadrant']
  ): string {
    const labels = {
      attractiveness_feasibility: {
        high_high: 'Star Opportunities',
        high_low: 'Question Marks',
        low_high: 'Cash Cows',
        low_low: 'Dogs'
      },
      growth_share: {
        high_high: 'Growth Leaders',
        high_low: 'Emerging Markets',
        low_high: 'Established Players',
        low_low: 'Declining Markets'
      },
      risk_return: {
        high_high: 'High Return/High Risk',
        high_low: 'High Return/Low Risk',
        low_high: 'Low Return/High Risk',
        low_low: 'Low Return/Low Risk'
      },
      strategic_priority: {
        high_high: 'Strategic Imperatives',
        high_low: 'Quick Wins',
        low_high: 'Long-term Bets',
        low_low: 'Low Priority'
      }
    };

    return labels[matrixType][quadrant];
  }

  private getQuadrantAction(
    matrixType: OpportunityMatrix['matrix_type'], 
    quadrant: OpportunityMatrix['opportunities'][0]['quadrant']
  ): string {
    const actions = {
      attractiveness_feasibility: {
        high_high: 'Invest heavily and pursue aggressively',
        high_low: 'Investigate and develop capabilities',
        low_high: 'Harvest and optimize',
        low_low: 'Divest or ignore'
      },
      growth_share: {
        high_high: 'Build market position',
        high_low: 'Monitor and selectively invest',
        low_high: 'Defend position',
        low_low: 'Exit or minimize investment'
      },
      risk_return: {
        high_high: 'Careful evaluation and risk mitigation',
        high_low: 'Pursue immediately',
        low_high: 'Avoid or pass',
        low_low: 'Consider for stability'
      },
      strategic_priority: {
        high_high: 'Executive priority and full resources',
        high_low: 'Fast-track implementation',
        low_high: 'Long-term strategic planning',
        low_low: 'Defer or delegate'
      }
    };

    return actions[matrixType][quadrant];
  }

  private getAxisLabels(matrixType: OpportunityMatrix['matrix_type']): OpportunityMatrix['axis_labels'] {
    const labels = {
      attractiveness_feasibility: {
        x_axis: 'Market Attractiveness',
        y_axis: 'Execution Feasibility',
        size_metric: 'Market Size ($M)'
      },
      growth_share: {
        x_axis: 'Market Growth Rate (%)',
        y_axis: 'Competitive Advantage',
        size_metric: 'Market Size ($M)'
      },
      risk_return: {
        x_axis: 'Risk Level',
        y_axis: 'Financial Potential',
        size_metric: 'Investment Required ($K)'
      },
      strategic_priority: {
        x_axis: 'Strategic Fit',
        y_axis: 'Overall Score',
        size_metric: 'Time to Capture (Months)'
      }
    };

    return labels[matrixType];
  }

  private getQuadrantDescriptions(matrixType: OpportunityMatrix['matrix_type']): OpportunityMatrix['quadrant_descriptions'] {
    const descriptions = {
      attractiveness_feasibility: {
        high_high: 'Highly attractive markets with strong execution capability',
        high_low: 'Attractive markets requiring capability development',
        low_high: 'Less attractive but easily executable opportunities',
        low_low: 'Unattractive and difficult to execute opportunities'
      },
      growth_share: {
        high_high: 'Fast-growing markets with competitive advantage',
        high_low: 'Emerging high-growth opportunities',
        low_high: 'Mature markets with strong position',
        low_low: 'Declining markets with weak position'
      },
      risk_return: {
        high_high: 'High potential returns but significant risk exposure',
        high_low: 'Attractive risk-adjusted returns',
        low_high: 'High risk with limited upside potential',
        low_low: 'Safe but limited return opportunities'
      },
      strategic_priority: {
        high_high: 'Critical strategic opportunities with high scores',
        high_low: 'High-scoring opportunities with moderate strategic fit',
        low_high: 'Strategic but lower-scoring opportunities',
        low_low: 'Limited strategic value and lower scores'
      }
    };

    return descriptions[matrixType];
  }

  private generateMatrixInsights(
    opportunities: OpportunityMatrix['opportunities'], 
    matrixType: OpportunityMatrix['matrix_type']
  ): OpportunityMatrix['insights'] {
    const topQuadrantCount = opportunities.filter(opp => opp.quadrant === 'high_high').length;
    
    const emergingOpportunities = opportunities
      .filter(opp => opp.quadrant === 'high_low')
      .slice(0, 3)
      .map(opp => opp.opportunity_id);
    
    const decliningOpportunities = opportunities
      .filter(opp => opp.quadrant === 'low_low')
      .slice(0, 3)
      .map(opp => opp.opportunity_id);

    const strategicRecommendations = [
      topQuadrantCount > 0 ? `Focus resources on ${topQuadrantCount} top-quadrant opportunities` : 'No clear winners identified - investigate emerging opportunities',
      emergingOpportunities.length > 0 ? 'Develop capabilities for emerging opportunities' : 'Limited pipeline of emerging opportunities',
      decliningOpportunities.length > 0 ? 'Consider divesting from declining opportunities' : 'Strong opportunity portfolio overall'
    ];

    return {
      top_quadrant_count: topQuadrantCount,
      emerging_opportunities: emergingOpportunities,
      declining_opportunities: decliningOpportunities,
      strategic_recommendations: strategicRecommendations
    };
  }

  // Analyze opportunity trends correlation
  async analyzeOpportunityTrends(
    opportunity: MarketOpportunity,
    signals: TrendSignal[]
  ): Promise<OpportunityTrend[]> {
    try {
      const correlations: OpportunityTrend[] = [];

      for (const signal of signals) {
        const correlation = this.calculateTrendCorrelation(opportunity, signal);
        
        if (Math.abs(correlation) > 0.3) { // Only include significant correlations
          correlations.push({
            trend_id: signal.id,
            opportunity_correlation: correlation,
            influence_type: this.determineInfluenceType(correlation, signal),
            impact_timing: this.determineImpactTiming(signal),
            confidence_level: signal.confidence_score,
            historical_correlation: this.generateHistoricalCorrelation(opportunity, signal),
            predictive_impact: this.generatePredictiveImpact(correlation, signal)
          });
        }
      }

      return correlations.sort((a, b) => Math.abs(b.opportunity_correlation) - Math.abs(a.opportunity_correlation));
    } catch (error) {
      console.error('Error analyzing opportunity trends:', error);
      throw error;
    }
  }

  private calculateTrendCorrelation(opportunity: MarketOpportunity, signal: TrendSignal): number {
    let correlation = 0;

    // Market segment overlap
    const sharedSegments = opportunity.description.toLowerCase().includes('dental') || 
                          opportunity.description.toLowerCase().includes('aesthetic') ? 0.3 : 0;
    correlation += sharedSegments;

    // Growth potential alignment
    const growthAlignment = Math.abs(opportunity.growth_potential - signal.velocity) < 20 ? 0.2 : -0.1;
    correlation += growthAlignment;

    // Lifecycle stage impact
    if (signal.lifecycle_stage === 'emerging' && opportunity.opportunity_type === 'new_market') {
      correlation += 0.3;
    } else if (signal.lifecycle_stage === 'declining' && opportunity.opportunity_type === 'acquisition') {
      correlation += 0.2;
    }

    // Competition level factor
    if (signal.momentum === 'accelerating' && opportunity.competition_level === 'low') {
      correlation += 0.2;
    }

    return Math.max(-1, Math.min(1, correlation));
  }

  private determineInfluenceType(correlation: number, signal: TrendSignal): OpportunityTrend['influence_type'] {
    if (correlation > 0.6) return 'catalyst';
    if (correlation > 0.3) return 'driver';
    if (correlation > 0) return 'enabler';
    return 'barrier';
  }

  private determineImpactTiming(signal: TrendSignal): OpportunityTrend['impact_timing'] {
    if (signal.time_to_peak <= 3) return 'immediate';
    if (signal.time_to_peak <= 6) return 'short_term';
    if (signal.time_to_peak <= 12) return 'medium_term';
    return 'long_term';
  }

  private generateHistoricalCorrelation(opportunity: MarketOpportunity, signal: TrendSignal) {
    // Generate mock historical data
    const dataPoints = [];
    for (let i = 12; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      dataPoints.push({
        date: date.toISOString(),
        trend_strength: signal.confidence_score + (Math.random() - 0.5) * 20,
        opportunity_score: opportunity.scoring.overall_score + (Math.random() - 0.5) * 15
      });
    }

    return {
      data_points: dataPoints,
      correlation_coefficient: 0.7 + (Math.random() - 0.5) * 0.4,
      trend_direction: 'positive' as const
    };
  }

  private generatePredictiveImpact(correlation: number, signal: TrendSignal) {
    const baseImpact = Math.abs(correlation) * 15;
    
    return {
      if_trend_accelerates: {
        score_change: correlation > 0 ? baseImpact : -baseImpact,
        timeline_change: signal.momentum === 'accelerating' ? 'accelerated by 2-3 months' : 'minimal change',
        risk_change: correlation > 0 ? -5 : 10
      },
      if_trend_decelerates: {
        score_change: correlation > 0 ? -baseImpact * 0.6 : baseImpact * 0.6,
        timeline_change: 'delayed by 1-2 months',
        risk_change: correlation > 0 ? 8 : -3
      }
    };
  }
}

export const opportunityScoringService = new OpportunityScoringService();