// Competitive Response Service - Strategic response generation and tracking
import { supabase } from './supabase/supabase';
import { marketIntelligenceService, CompetitorActivity } from './marketIntelligenceService';

export interface CompetitiveResponse {
  id: string;
  competitor_activity_id: string;
  response_type: 'counter' | 'defend' | 'exploit' | 'monitor' | 'ignore';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  strategy: {
    objective: string;
    approach: string;
    key_messages: string[];
    differentiators: string[];
    proof_points: string[];
  };
  
  tactics: {
    sales: string[];
    marketing: string[];
    product: string[];
    pricing: string[];
    partnerships: string[];
  };
  
  resources: {
    teams_involved: string[];
    budget_required: {
      min: number;
      max: number;
    };
    time_required: string;
    external_resources: string[];
  };
  
  success_metrics: {
    metric: string;
    target: string;
    measurement_method: string;
  }[];
  
  risk_assessment: {
    risks: string[];
    mitigation_strategies: string[];
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  };
  
  timeline: {
    start_date: string;
    milestones: {
      date: string;
      milestone: string;
      owner: string;
    }[];
    completion_date: string;
  };
  
  status: 'draft' | 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  approval_status: {
    approved_by?: string;
    approved_at?: string;
    comments?: string;
  };
  
  execution_tracking: {
    progress: number;
    completed_tactics: string[];
    blockers: string[];
    adjustments: string[];
  };
  
  impact_measurement: {
    win_rate_change?: number;
    market_share_change?: number;
    revenue_impact?: number;
    customer_retention?: number;
    competitive_wins?: number;
  };
  
  created_at: string;
  updated_at: string;
}

export interface BattleCard {
  id: string;
  competitor_id: string;
  version: number;
  category: 'product' | 'pricing' | 'features' | 'support' | 'implementation' | 'security' | 'integration';
  
  positioning: {
    our_strength: string;
    their_weakness: string;
    key_differentiators: string[];
    unique_value_props: string[];
  };
  
  comparison: {
    feature: string;
    ours: string;
    theirs: string;
    advantage: 'ours' | 'theirs' | 'neutral';
    talking_point: string;
  }[];
  
  objection_handling: {
    objection: string;
    response: string;
    proof_points: string[];
    redirect_to: string;
  }[];
  
  win_stories: {
    customer: string;
    industry: string;
    situation: string;
    solution: string;
    result: string;
    quote?: string;
  }[];
  
  talk_track: {
    opening: string;
    discovery_questions: string[];
    value_props: string[];
    closing: string;
  };
  
  dos_and_donts: {
    dos: string[];
    donts: string[];
  };
  
  updated_at: string;
  updated_by: string;
}

export interface CompetitivePlaybook {
  id: string;
  competitor_id: string;
  scenario: string;
  description: string;
  
  plays: {
    play_name: string;
    when_to_use: string;
    tactics: string[];
    expected_outcome: string;
    success_rate?: number;
  }[];
  
  field_tested: boolean;
  effectiveness_rating: number;
  last_used: string;
}

class CompetitiveResponseService {
  // Generate competitive response
  async generateCompetitiveResponse(
    activity: CompetitorActivity,
    context?: {
      our_strengths?: string[];
      their_weaknesses?: string[];
      market_conditions?: string[];
      resource_constraints?: string[];
    }
  ): Promise<CompetitiveResponse> {
    try {
      // Analyze the competitive threat
      const threatAnalysis = this.analyzeCompetitiveThreat(activity);
      
      // Determine response type
      const responseType = this.determineResponseType(activity, threatAnalysis);
      
      // Generate strategy
      const strategy = await this.generateStrategy(activity, responseType, context);
      
      // Generate tactics
      const tactics = await this.generateTactics(strategy, responseType, activity);
      
      // Create response plan
      const response: CompetitiveResponse = {
        id: `response_${Date.now()}`,
        competitor_activity_id: activity.id,
        response_type: responseType,
        title: this.generateResponseTitle(activity, responseType),
        description: strategy.objective,
        priority: this.calculatePriority(activity, threatAnalysis),
        urgency: this.calculateUrgency(activity, threatAnalysis),
        
        strategy,
        tactics,
        
        resources: {
          teams_involved: this.identifyRequiredTeams(tactics),
          budget_required: this.estimateBudget(tactics, responseType),
          time_required: this.estimateTimeRequired(tactics),
          external_resources: this.identifyExternalResources(tactics)
        },
        
        success_metrics: this.defineSuccessMetrics(responseType, strategy),
        
        risk_assessment: {
          risks: this.identifyRisks(responseType, activity),
          mitigation_strategies: this.generateMitigationStrategies(responseType),
          probability: 'medium',
          impact: threatAnalysis.impact_level
        },
        
        timeline: this.generateTimeline(tactics, this.calculateUrgency(activity, threatAnalysis)),
        
        status: 'draft',
        approval_status: {},
        
        execution_tracking: {
          progress: 0,
          completed_tactics: [],
          blockers: [],
          adjustments: []
        },
        
        impact_measurement: {},
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return response;
    } catch (error) {
      console.error('Error generating competitive response:', error);
      throw error;
    }
  }
  
  // Analyze competitive threat
  private analyzeCompetitiveThreat(activity: CompetitorActivity): {
    threat_level: 'low' | 'medium' | 'high' | 'critical';
    impact_areas: string[];
    time_sensitivity: 'immediate' | 'urgent' | 'moderate' | 'low';
    market_impact: number;
    customer_impact: number;
    revenue_impact: number;
    impact_level: 'low' | 'medium' | 'high';
  } {
    let threatScore = 0;
    const impactAreas: string[] = [];
    
    // Activity type impact
    const activityImpact = {
      'product_launch': 8,
      'pricing_change': 9,
      'partnership': 6,
      'acquisition': 7,
      'expansion': 7,
      'leadership_change': 4
    };
    threatScore += activityImpact[activity.activity_type] || 5;
    
    // Market segment impact
    if (activity.market_segment === 'all') {
      threatScore += 3;
      impactAreas.push('All market segments');
    } else {
      impactAreas.push(`${activity.market_segment} segment`);
    }
    
    // Regional impact
    if (activity.affected_regions.length > 3) {
      threatScore += 2;
      impactAreas.push('Multiple regions');
    }
    
    // Impact score from activity
    threatScore += activity.impact_score * 0.5;
    
    // Determine threat level
    let threatLevel: 'low' | 'medium' | 'high' | 'critical';
    if (threatScore >= 18) threatLevel = 'critical';
    else if (threatScore >= 14) threatLevel = 'high';
    else if (threatScore >= 10) threatLevel = 'medium';
    else threatLevel = 'low';
    
    // Time sensitivity
    let timeSensitivity: 'immediate' | 'urgent' | 'moderate' | 'low';
    if (activity.competitive_response?.urgency === 'immediate') timeSensitivity = 'immediate';
    else if (activity.activity_type === 'pricing_change') timeSensitivity = 'urgent';
    else if (activity.activity_type === 'product_launch') timeSensitivity = 'urgent';
    else timeSensitivity = 'moderate';
    
    return {
      threat_level: threatLevel,
      impact_areas: impactAreas,
      time_sensitivity: timeSensitivity,
      market_impact: threatScore / 2,
      customer_impact: activity.impact_score,
      revenue_impact: threatScore * 1000,
      impact_level: activity.impact_score > 7 ? 'high' : activity.impact_score > 4 ? 'medium' : 'low'
    };
  }
  
  // Determine response type
  private determineResponseType(
    activity: CompetitorActivity,
    threatAnalysis: any
  ): CompetitiveResponse['response_type'] {
    // High threat + pricing = defend
    if (threatAnalysis.threat_level === 'critical' && activity.activity_type === 'pricing_change') {
      return 'defend';
    }
    
    // Product launch = counter
    if (activity.activity_type === 'product_launch' && threatAnalysis.threat_level !== 'low') {
      return 'counter';
    }
    
    // Weakness identified = exploit
    if (activity.competitive_response?.suggested_actions.some(a => 
      a.toLowerCase().includes('weakness') || a.toLowerCase().includes('opportunity')
    )) {
      return 'exploit';
    }
    
    // Low threat = monitor
    if (threatAnalysis.threat_level === 'low') {
      return 'monitor';
    }
    
    return 'defend';
  }
  
  // Generate strategy
  private async generateStrategy(
    activity: CompetitorActivity,
    responseType: CompetitiveResponse['response_type'],
    context?: any
  ): Promise<CompetitiveResponse['strategy']> {
    const strategies = {
      counter: {
        objective: `Launch competitive counter-initiative to ${activity.title}`,
        approach: 'Proactive market positioning with superior offering',
        key_messages: [
          'Our solution delivers more value at better TCO',
          'Proven track record of customer success',
          'Innovation that actually solves customer problems'
        ],
        differentiators: context?.our_strengths || [
          'Superior technology',
          'Better customer support',
          'Faster implementation'
        ],
        proof_points: [
          '95% customer satisfaction rating',
          '2x faster time to value',
          '40% lower total cost of ownership'
        ]
      },
      defend: {
        objective: `Protect market position against ${activity.competitor_name}'s ${activity.activity_type}`,
        approach: 'Reinforce customer relationships and value proposition',
        key_messages: [
          'Continued innovation and investment in our platform',
          'Unmatched customer success and support',
          'Proven ROI and business outcomes'
        ],
        differentiators: [
          'Established market leader',
          'Comprehensive solution',
          'Strong ecosystem'
        ],
        proof_points: [
          'Trusted by 5,000+ customers',
          '$10M+ in customer savings',
          '99.9% uptime guarantee'
        ]
      },
      exploit: {
        objective: `Capitalize on competitor weakness revealed by ${activity.title}`,
        approach: 'Aggressive positioning highlighting competitive advantages',
        key_messages: [
          'Why customers are switching to our solution',
          'The hidden costs of inferior alternatives',
          'Future-proof your investment with the right partner'
        ],
        differentiators: context?.their_weaknesses?.map((w: string) => `We excel where they fail: ${w}`) || [
          'We excel where they fail: User experience',
          'We excel where they fail: Integration capabilities',
          'We excel where they fail: Scalability'
        ],
        proof_points: [
          '60% of new customers switched from competitors',
          'Average 3-month payback period',
          'Zero implementation failures'
        ]
      },
      monitor: {
        objective: `Track and assess impact of ${activity.title}`,
        approach: 'Watchful waiting with prepared responses',
        key_messages: [
          'Continue executing on our strategy',
          'Focus on customer success',
          'Let results speak for themselves'
        ],
        differentiators: [
          'Consistent execution',
          'Customer focus',
          'Long-term vision'
        ],
        proof_points: [
          'Steady growth trajectory',
          'High customer retention',
          'Strong financial position'
        ]
      },
      ignore: {
        objective: 'No response required',
        approach: 'Continue current strategy',
        key_messages: [],
        differentiators: [],
        proof_points: []
      }
    };
    
    return strategies[responseType];
  }
  
  // Generate tactics
  private async generateTactics(
    strategy: CompetitiveResponse['strategy'],
    responseType: CompetitiveResponse['response_type'],
    activity: CompetitorActivity
  ): Promise<CompetitiveResponse['tactics']> {
    const tacticTemplates = {
      counter: {
        sales: [
          'Launch "switch and save" campaign targeting their customers',
          'Create competitive displacement playbook',
          'Offer migration incentives and support',
          'Host comparison webinars highlighting advantages'
        ],
        marketing: [
          'Publish side-by-side comparison content',
          'Launch targeted ad campaign in their markets',
          'Create customer success stories from switchers',
          'SEO optimization for competitive keywords'
        ],
        product: [
          'Accelerate roadmap items that address gaps',
          'Launch feature parity initiatives',
          'Enhance differentiating capabilities',
          'Improve user experience in key workflows'
        ],
        pricing: [
          'Introduce competitive pricing bundles',
          'Offer time-limited switching incentives',
          'Create value-based pricing calculator',
          'Implement price matching for enterprise deals'
        ],
        partnerships: [
          'Strengthen ecosystem partnerships',
          'Launch co-marketing with key partners',
          'Create joint solutions addressing gaps',
          'Expand integration marketplace'
        ]
      },
      defend: {
        sales: [
          'Proactive customer outreach campaign',
          'Executive briefings for at-risk accounts',
          'Loyalty program enhancements',
          'Competitive inoculation training'
        ],
        marketing: [
          'Customer appreciation campaign',
          'Thought leadership content series',
          'Success metrics publicity',
          'Brand reinforcement initiatives'
        ],
        product: [
          'Accelerate innovation roadmap',
          'Customer-requested feature fast-track',
          'Platform stability improvements',
          'User experience enhancements'
        ],
        pricing: [
          'Loyalty discounts for renewals',
          'Value-add bundling options',
          'Flexible payment terms',
          'Usage-based pricing options'
        ],
        partnerships: [
          'Deepen strategic partnerships',
          'Exclusive partner benefits',
          'Joint customer success programs',
          'Partner enablement initiatives'
        ]
      },
      exploit: {
        sales: [
          'Target their dissatisfied customers',
          'Highlight competitor weaknesses in demos',
          'Create "Why us vs them" battle cards',
          'Win-back campaign for lost deals'
        ],
        marketing: [
          'Competitor weakness awareness campaign',
          'Customer testimonials from switchers',
          'Industry analyst briefings',
          'Aggressive SEM on competitor terms'
        ],
        product: [
          'Double down on differentiating features',
          'Address their product gaps',
          'Enhance areas of their weakness',
          'Launch innovative capabilities'
        ],
        pricing: [
          'Aggressive pricing for their customers',
          'Risk-free switching offers',
          'Performance guarantees',
          'Flexible contract terms'
        ],
        partnerships: [
          'Poach their key partners',
          'Exclusive partnership deals',
          'Competitive replacement programs',
          'Channel partner incentives'
        ]
      },
      monitor: {
        sales: [
          'Gather competitive intelligence',
          'Track win/loss reasons',
          'Monitor customer sentiment',
          'Prepare response playbooks'
        ],
        marketing: [
          'Monitor their marketing activities',
          'Track share of voice',
          'Analyze their messaging',
          'Prepare counter-narratives'
        ],
        product: [
          'Track their product updates',
          'Monitor customer requests',
          'Analyze feature adoption',
          'Maintain roadmap flexibility'
        ],
        pricing: [
          'Monitor pricing changes',
          'Track deal sizes',
          'Analyze discount patterns',
          'Prepare pricing responses'
        ],
        partnerships: [
          'Track partnership announcements',
          'Monitor ecosystem changes',
          'Analyze integration adoption',
          'Identify partnership opportunities'
        ]
      },
      ignore: {
        sales: [],
        marketing: [],
        product: [],
        pricing: [],
        partnerships: []
      }
    };
    
    return tacticTemplates[responseType];
  }
  
  // Helper methods
  private generateResponseTitle(activity: CompetitorActivity, responseType: string): string {
    const titles: Record<string, string> = {
      counter: `Counter-offensive to ${activity.competitor_name}'s ${activity.title}`,
      defend: `Defense strategy against ${activity.competitor_name}'s ${activity.activity_type}`,
      exploit: `Exploit opportunity from ${activity.competitor_name}'s ${activity.title}`,
      monitor: `Monitor impact of ${activity.competitor_name}'s ${activity.title}`,
      ignore: `No action required for ${activity.title}`
    };
    return titles[responseType] || `Response to ${activity.title}`;
  }
  
  private calculatePriority(activity: CompetitorActivity, threatAnalysis: any): CompetitiveResponse['priority'] {
    if (threatAnalysis.threat_level === 'critical') return 'critical';
    if (threatAnalysis.threat_level === 'high') return 'high';
    if (activity.impact_score > 7) return 'high';
    if (activity.impact_score > 5) return 'medium';
    return 'low';
  }
  
  private calculateUrgency(activity: CompetitorActivity, threatAnalysis: any): CompetitiveResponse['urgency'] {
    if (threatAnalysis.time_sensitivity === 'immediate') return 'immediate';
    if (activity.competitive_response?.urgency === 'immediate') return 'immediate';
    if (activity.activity_type === 'pricing_change') return 'short_term';
    if (threatAnalysis.threat_level === 'high') return 'short_term';
    return 'medium_term';
  }
  
  private identifyRequiredTeams(tactics: CompetitiveResponse['tactics']): string[] {
    const teams: Set<string> = new Set();
    
    if (tactics.sales.length > 0) teams.add('Sales');
    if (tactics.marketing.length > 0) teams.add('Marketing');
    if (tactics.product.length > 0) teams.add('Product');
    if (tactics.pricing.length > 0) teams.add('Finance');
    if (tactics.partnerships.length > 0) teams.add('Partnerships');
    
    teams.add('Leadership'); // Always involve leadership
    
    return Array.from(teams);
  }
  
  private estimateBudget(tactics: CompetitiveResponse['tactics'], responseType: string): { min: number; max: number } {
    const baseBudget: Record<string, { min: number; max: number }> = {
      counter: { min: 50000, max: 200000 },
      defend: { min: 25000, max: 100000 },
      exploit: { min: 30000, max: 150000 },
      monitor: { min: 5000, max: 20000 },
      ignore: { min: 0, max: 0 }
    };
    
    const tacticCount = 
      tactics.sales.length + 
      tactics.marketing.length + 
      tactics.product.length + 
      tactics.pricing.length + 
      tactics.partnerships.length;
    
    const multiplier = Math.min(tacticCount * 0.1 + 1, 2);
    
    return {
      min: Math.round(baseBudget[responseType].min * multiplier),
      max: Math.round(baseBudget[responseType].max * multiplier)
    };
  }
  
  private estimateTimeRequired(tactics: CompetitiveResponse['tactics']): string {
    const totalTactics = 
      tactics.sales.length + 
      tactics.marketing.length + 
      tactics.product.length + 
      tactics.pricing.length + 
      tactics.partnerships.length;
    
    if (totalTactics > 15) return '3-6 months';
    if (totalTactics > 10) return '2-3 months';
    if (totalTactics > 5) return '1-2 months';
    return '2-4 weeks';
  }
  
  private identifyExternalResources(tactics: CompetitiveResponse['tactics']): string[] {
    const resources: Set<string> = new Set();
    
    if (tactics.marketing.some(t => t.includes('campaign') || t.includes('ad'))) {
      resources.add('Marketing agency');
    }
    if (tactics.marketing.some(t => t.includes('SEO') || t.includes('SEM'))) {
      resources.add('Digital marketing specialist');
    }
    if (tactics.marketing.some(t => t.includes('analyst'))) {
      resources.add('Industry analyst relations');
    }
    if (tactics.product.some(t => t.includes('research'))) {
      resources.add('Market research firm');
    }
    if (tactics.sales.some(t => t.includes('training'))) {
      resources.add('Sales training consultant');
    }
    
    return Array.from(resources);
  }
  
  private defineSuccessMetrics(
    responseType: string, 
    strategy: CompetitiveResponse['strategy']
  ): CompetitiveResponse['success_metrics'] {
    const metricsTemplates: Record<string, { metric: string; target: string; measurement_method: string; }[]> = {
      counter: [
        { metric: 'Competitive win rate', target: 'Increase by 15%', measurement_method: 'CRM win/loss tracking' },
        { metric: 'Market share', target: 'Gain 2% share', measurement_method: 'Quarterly market analysis' },
        { metric: 'Customer acquisition from competitor', target: '50 customers', measurement_method: 'Source tracking in CRM' }
      ],
      defend: [
        { metric: 'Customer retention rate', target: 'Maintain >95%', measurement_method: 'Monthly churn analysis' },
        { metric: 'At-risk account saves', target: '80% save rate', measurement_method: 'Account health scoring' },
        { metric: 'Competitive loss rate', target: 'Reduce by 20%', measurement_method: 'Win/loss analysis' }
      ],
      exploit: [
        { metric: 'Opportunistic wins', target: '30 new deals', measurement_method: 'Deal source tracking' },
        { metric: 'Competitor displacement', target: '25 accounts', measurement_method: 'Replacement tracking' },
        { metric: 'Revenue from weakness exploitation', target: '$2M', measurement_method: 'Revenue attribution' }
      ],
      monitor: [
        { metric: 'Market impact assessment', target: 'Complete within 30 days', measurement_method: 'Impact analysis report' },
        { metric: 'Customer sentiment', target: 'No negative change', measurement_method: 'NPS tracking' },
        { metric: 'Competitive intelligence gathered', target: '10 insights', measurement_method: 'CI database' }
      ],
      ignore: []
    };
    
    return metricsTemplates[responseType] || [];
  }
  
  private identifyRisks(responseType: string, activity: CompetitorActivity): string[] {
    const risks: string[] = [];
    
    // Common risks
    risks.push('Resource allocation conflicts with other priorities');
    risks.push('Competitor counter-response escalation');
    
    // Response-specific risks
    if (responseType === 'counter') {
      risks.push('Price war initiation');
      risks.push('Market confusion from aggressive positioning');
    }
    if (responseType === 'defend') {
      risks.push('Appearing reactive rather than innovative');
      risks.push('Customer concern about competitive pressure');
    }
    if (responseType === 'exploit') {
      risks.push('Retaliation from competitor');
      risks.push('Negative market perception of aggressive tactics');
    }
    
    return risks;
  }
  
  private generateMitigationStrategies(responseType: string): string[] {
    const strategies: string[] = [
      'Establish clear escalation procedures',
      'Regular competitive response team meetings',
      'Continuous market monitoring',
      'Flexible resource allocation model'
    ];
    
    if (responseType === 'counter' || responseType === 'exploit') {
      strategies.push('Legal review of competitive claims');
      strategies.push('PR crisis management preparation');
    }
    
    return strategies;
  }
  
  private generateTimeline(
    tactics: CompetitiveResponse['tactics'],
    urgency: CompetitiveResponse['urgency']
  ): CompetitiveResponse['timeline'] {
    const now = new Date();
    const startDate = new Date(now);
    
    // Adjust start based on urgency
    if (urgency === 'immediate') {
      // Start immediately
    } else if (urgency === 'short_term') {
      startDate.setDate(startDate.getDate() + 7);
    } else {
      startDate.setDate(startDate.getDate() + 14);
    }
    
    // Calculate completion date based on tactics
    const totalTactics = Object.values(tactics).flat().length;
    const completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + (totalTactics * 7)); // 1 week per tactic average
    
    // Generate milestones
    const milestones: CompetitiveResponse['timeline']['milestones'] = [
      {
        date: startDate.toISOString(),
        milestone: 'Response plan approved and initiated',
        owner: 'Leadership Team'
      },
      {
        date: new Date(startDate.getTime() + (completionDate.getTime() - startDate.getTime()) * 0.25).toISOString(),
        milestone: 'Initial tactics deployed',
        owner: 'Cross-functional Team'
      },
      {
        date: new Date(startDate.getTime() + (completionDate.getTime() - startDate.getTime()) * 0.5).toISOString(),
        milestone: 'Mid-point review and adjustment',
        owner: 'Strategy Team'
      },
      {
        date: new Date(startDate.getTime() + (completionDate.getTime() - startDate.getTime()) * 0.75).toISOString(),
        milestone: 'Impact assessment',
        owner: 'Analytics Team'
      },
      {
        date: completionDate.toISOString(),
        milestone: 'Response completion and final review',
        owner: 'Leadership Team'
      }
    ];
    
    return {
      start_date: startDate.toISOString(),
      milestones,
      completion_date: completionDate.toISOString()
    };
  }
  
  // Update battle card
  async updateBattleCard(
    competitorId: string,
    category: BattleCard['category'],
    updates: Partial<BattleCard>
  ): Promise<BattleCard> {
    try {
      const existingCard = await this.getBattleCard(competitorId, category);
      
      const updatedCard: BattleCard = {
        ...existingCard,
        ...updates,
        version: existingCard.version + 1,
        updated_at: new Date().toISOString(),
        updated_by: 'system' // In production, would use actual user
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('battle_cards')
        .upsert(updatedCard)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating battle card:', error);
      throw error;
    }
  }
  
  // Get battle card
  async getBattleCard(competitorId: string, category: BattleCard['category']): Promise<BattleCard> {
    try {
      const { data, error } = await supabase
        .from('battle_cards')
        .select('*')
        .eq('competitor_id', competitorId)
        .eq('category', category)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Return default battle card if none exists
      return this.createDefaultBattleCard(competitorId, category);
    }
  }
  
  // Create default battle card
  private createDefaultBattleCard(competitorId: string, category: BattleCard['category']): BattleCard {
    return {
      id: `bc_${competitorId}_${category}`,
      competitor_id: competitorId,
      version: 1,
      category,
      
      positioning: {
        our_strength: 'To be defined',
        their_weakness: 'To be defined',
        key_differentiators: [],
        unique_value_props: []
      },
      
      comparison: [],
      objection_handling: [],
      win_stories: [],
      
      talk_track: {
        opening: '',
        discovery_questions: [],
        value_props: [],
        closing: ''
      },
      
      dos_and_donts: {
        dos: [],
        donts: []
      },
      
      updated_at: new Date().toISOString(),
      updated_by: 'system'
    };
  }
  
  // Generate competitive playbook
  async generateCompetitivePlaybook(
    competitorId: string,
    scenario: string
  ): Promise<CompetitivePlaybook> {
    try {
      // In production, this would use AI to generate playbooks
      const playbook: CompetitivePlaybook = {
        id: `playbook_${Date.now()}`,
        competitor_id: competitorId,
        scenario,
        description: `Playbook for handling ${scenario} against competitor`,
        
        plays: [
          {
            play_name: 'The Value Pivot',
            when_to_use: 'When they lead with price',
            tactics: [
              'Shift focus to TCO and ROI',
              'Share customer success metrics',
              'Offer value analysis session'
            ],
            expected_outcome: 'Reframe discussion from price to value',
            success_rate: 75
          },
          {
            play_name: 'The Innovation Card',
            when_to_use: 'When they claim feature parity',
            tactics: [
              'Demonstrate unique capabilities',
              'Show product roadmap vision',
              'Highlight innovation track record'
            ],
            expected_outcome: 'Establish innovation leadership',
            success_rate: 82
          }
        ],
        
        field_tested: true,
        effectiveness_rating: 8.5,
        last_used: new Date().toISOString()
      };
      
      return playbook;
    } catch (error) {
      console.error('Error generating competitive playbook:', error);
      throw error;
    }
  }
  
  // Track response execution
  async trackResponseExecution(
    responseId: string,
    updates: {
      completed_tactics?: string[];
      blockers?: string[];
      adjustments?: string[];
      progress?: number;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('competitive_responses')
        .update({
          'execution_tracking.completed_tactics': updates.completed_tactics,
          'execution_tracking.blockers': updates.blockers,
          'execution_tracking.adjustments': updates.adjustments,
          'execution_tracking.progress': updates.progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', responseId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error tracking response execution:', error);
      throw error;
    }
  }
  
  // Measure response impact
  async measureResponseImpact(
    responseId: string,
    startDate: string,
    endDate: string
  ): Promise<CompetitiveResponse['impact_measurement']> {
    try {
      // In production, this would pull real metrics
      // For now, return mock data
      return {
        win_rate_change: 12.5,
        market_share_change: 1.8,
        revenue_impact: 2500000,
        customer_retention: 96.5,
        competitive_wins: 45
      };
    } catch (error) {
      console.error('Error measuring response impact:', error);
      throw error;
    }
  }
}

export const competitiveResponseService = new CompetitiveResponseService();