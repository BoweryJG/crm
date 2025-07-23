// Conversation Intelligence Service - AI-powered call insights
import { supabase } from './supabase/supabase';

export interface ConversationInsight {
  id: string;
  call_id: string;
  insight_type: 'objection' | 'buying_signal' | 'pain_point' | 'competitor' | 'decision_criteria' | 'budget' | 'timeline';
  text: string;
  timestamp: string;
  confidence: number;
  category?: string;
  suggested_response?: string;
  impact_score: number;
  handled_successfully?: boolean;
  follow_up_required: boolean;
  notes?: string;
}

export interface CompetitorMention {
  competitor_name: string;
  context: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  features_mentioned: string[];
  price_comparison?: boolean;
  switching_intent?: boolean;
}

export interface SalesOpportunity {
  id: string;
  opportunity_type: 'upsell' | 'cross_sell' | 'expansion' | 'renewal' | 'referral';
  description: string;
  confidence: number;
  potential_value?: number;
  recommended_actions: string[];
  timeline: 'immediate' | 'short_term' | 'long_term';
  priority: 'low' | 'medium' | 'high';
}

export interface CallPattern {
  pattern_type: 'successful_close' | 'lost_opportunity' | 'strong_rapport' | 'poor_discovery' | 'effective_objection_handling';
  frequency: number;
  examples: string[];
  recommendations: string[];
}

export interface ConversationQuality {
  overall_score: number;
  rapport_score: number;
  discovery_score: number;
  presentation_score: number;
  objection_handling_score: number;
  closing_score: number;
  areas_of_improvement: string[];
  strengths: string[];
}

class ConversationIntelligenceService {
  // Analyze conversation for insights
  async analyzeConversation(
    callId: string,
    transcript: string,
    metadata?: {
      contact_id?: string;
      practice_id?: string;
      product_discussed?: string[];
    }
  ): Promise<{
    insights: ConversationInsight[];
    opportunities: SalesOpportunity[];
    quality: ConversationQuality;
    competitor_mentions: CompetitorMention[];
    recommended_follow_up: string[];
  }> {
    try {
      // Extract insights from transcript
      const insights = await this.extractInsights(transcript);
      
      // Identify sales opportunities
      const opportunities = await this.identifyOpportunities(transcript, insights, metadata);
      
      // Analyze conversation quality
      const quality = await this.assessConversationQuality(transcript, insights);
      
      // Detect competitor mentions
      const competitorMentions = await this.detectCompetitorMentions(transcript);
      
      // Generate follow-up recommendations
      const recommendedFollowUp = await this.generateFollowUpRecommendations(
        insights,
        opportunities,
        quality,
        competitorMentions
      );

      // Save analysis to database
      await this.saveConversationAnalysis(callId, {
        insights,
        opportunities,
        quality,
        competitor_mentions: competitorMentions,
        recommended_follow_up: recommendedFollowUp
      });

      return {
        insights,
        opportunities,
        quality,
        competitor_mentions: competitorMentions,
        recommended_follow_up: recommendedFollowUp
      };
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      throw error;
    }
  }

  // Extract insights from transcript
  private async extractInsights(transcript: string): Promise<ConversationInsight[]> {
    const insights: ConversationInsight[] = [];

    // Objection patterns
    const objectionPatterns = [
      {
        pattern: /too expensive|can't afford|budget.*tight|price.*high/i,
        type: 'objection' as const,
        category: 'price',
        response: 'Focus on ROI and value. Break down cost per benefit.'
      },
      {
        pattern: /not the right time|too busy|maybe later|next quarter/i,
        type: 'objection' as const,
        category: 'timing',
        response: 'Understand their timeline. Offer phased implementation.'
      },
      {
        pattern: /need to think|talk to.*boss|get approval/i,
        type: 'objection' as const,
        category: 'authority',
        response: 'Identify all stakeholders. Offer to present to the team.'
      },
      {
        pattern: /already have|using.*competitor|happy with current/i,
        type: 'objection' as const,
        category: 'status_quo',
        response: 'Explore gaps in current solution. Focus on unique differentiators.'
      }
    ];

    // Buying signal patterns
    const buyingSignalPatterns = [
      {
        pattern: /how much.*cost|what's the price|pricing options/i,
        type: 'buying_signal' as const,
        category: 'pricing_interest'
      },
      {
        pattern: /when can.*start|how long.*implement|timeline/i,
        type: 'buying_signal' as const,
        category: 'implementation_interest'
      },
      {
        pattern: /who else.*using|references|case studies/i,
        type: 'buying_signal' as const,
        category: 'social_proof_request'
      },
      {
        pattern: /sounds good|interested|like what.*see/i,
        type: 'buying_signal' as const,
        category: 'positive_sentiment'
      }
    ];

    // Pain point patterns
    const painPointPatterns = [
      {
        pattern: /struggling with|frustrated by|problem with|challenge is/i,
        type: 'pain_point' as const,
        category: 'explicit_pain'
      },
      {
        pattern: /waste.*time|inefficient|manual process|tedious/i,
        type: 'pain_point' as const,
        category: 'efficiency_pain'
      },
      {
        pattern: /losing.*customers|churn|retention.*issue/i,
        type: 'pain_point' as const,
        category: 'business_pain'
      }
    ];

    // Check patterns
    [...objectionPatterns, ...buyingSignalPatterns, ...painPointPatterns].forEach((patternObj) => {
      const { pattern, type, category } = patternObj;
      const response = 'response' in patternObj ? patternObj.response : undefined;
      const matches = transcript.match(pattern);
      if (matches) {
        insights.push({
          id: `insight_${Date.now()}_${Math.random()}`,
          call_id: '',
          insight_type: type,
          text: matches[0],
          timestamp: '00:00:00', // Would be extracted from real transcript
          confidence: 0.8,
          category,
          suggested_response: response,
          impact_score: this.calculateImpactScore(type, category),
          follow_up_required: type === 'objection' || type === 'pain_point'
        });
      }
    });

    return insights;
  }

  // Identify sales opportunities
  private async identifyOpportunities(
    transcript: string,
    insights: ConversationInsight[],
    metadata?: any
  ): Promise<SalesOpportunity[]> {
    const opportunities: SalesOpportunity[] = [];

    // Check for upsell opportunities
    if (transcript.includes('basic plan') || transcript.includes('starter')) {
      opportunities.push({
        id: `opp_${Date.now()}_1`,
        opportunity_type: 'upsell',
        description: 'Customer currently on basic plan - opportunity to upgrade',
        confidence: 0.75,
        potential_value: 5000,
        recommended_actions: [
          'Demonstrate premium features',
          'Calculate ROI of upgrade',
          'Offer trial of premium features'
        ],
        timeline: 'short_term',
        priority: 'high'
      });
    }

    // Check for expansion opportunities
    if (transcript.includes('other departments') || transcript.includes('team growth')) {
      opportunities.push({
        id: `opp_${Date.now()}_2`,
        opportunity_type: 'expansion',
        description: 'Potential for multi-department deployment',
        confidence: 0.7,
        potential_value: 15000,
        recommended_actions: [
          'Map out department needs',
          'Propose phased rollout plan',
          'Introduce volume pricing'
        ],
        timeline: 'long_term',
        priority: 'medium'
      });
    }

    // Check for referral opportunities
    if (insights.some(i => i.insight_type === 'buying_signal' && i.category === 'positive_sentiment')) {
      opportunities.push({
        id: `opp_${Date.now()}_3`,
        opportunity_type: 'referral',
        description: 'High satisfaction - potential referral source',
        confidence: 0.6,
        recommended_actions: [
          'Ask about industry connections',
          'Propose referral program',
          'Request testimonial'
        ],
        timeline: 'immediate',
        priority: 'low'
      });
    }

    return opportunities;
  }

  // Assess conversation quality
  private async assessConversationQuality(
    transcript: string,
    insights: ConversationInsight[]
  ): Promise<ConversationQuality> {
    const quality: ConversationQuality = {
      overall_score: 0,
      rapport_score: 0,
      discovery_score: 0,
      presentation_score: 0,
      objection_handling_score: 0,
      closing_score: 0,
      areas_of_improvement: [],
      strengths: []
    };

    // Rapport scoring
    const rapportIndicators = [
      /how are you|hope you're|nice to.*meet/i,
      /appreciate.*time|thanks for.*meeting/i,
      /understand.*position|see what you mean/i
    ];
    quality.rapport_score = this.calculateScore(transcript, rapportIndicators);

    // Discovery scoring
    const discoveryIndicators = [
      /tell me about|help me understand|walk me through/i,
      /what.*challenges|what.*goals|what.*looking for/i,
      /how.*currently|what.*process|who.*involved/i
    ];
    quality.discovery_score = this.calculateScore(transcript, discoveryIndicators);

    // Presentation scoring
    const presentationIndicators = [
      /let me show|here's how|for example/i,
      /specifically.*your case|based on.*you said/i,
      /benefit.*you|solve.*problem|address.*challenge/i
    ];
    quality.presentation_score = this.calculateScore(transcript, presentationIndicators);

    // Objection handling scoring
    const objectionHandling = insights.filter(i => i.insight_type === 'objection');
    quality.objection_handling_score = objectionHandling.length > 0 
      ? objectionHandling.filter(o => o.handled_successfully).length / objectionHandling.length * 100
      : 100; // No objections is good

    // Closing scoring
    const closingIndicators = [
      /next steps|moving forward|when.*start/i,
      /agree to|ready to.*proceed|let's.*schedule/i,
      /commitment|decision|contract/i
    ];
    quality.closing_score = this.calculateScore(transcript, closingIndicators);

    // Calculate overall score
    quality.overall_score = (
      quality.rapport_score +
      quality.discovery_score +
      quality.presentation_score +
      quality.objection_handling_score +
      quality.closing_score
    ) / 5;

    // Identify strengths and improvements
    const scores = {
      'Rapport Building': quality.rapport_score,
      'Discovery': quality.discovery_score,
      'Presentation': quality.presentation_score,
      'Objection Handling': quality.objection_handling_score,
      'Closing': quality.closing_score
    };

    Object.entries(scores).forEach(([area, score]) => {
      if (score >= 80) {
        quality.strengths.push(`Strong ${area} (${score.toFixed(0)}%)`);
      } else if (score < 60) {
        quality.areas_of_improvement.push(`Improve ${area} (currently ${score.toFixed(0)}%)`);
      }
    });

    return quality;
  }

  // Detect competitor mentions
  private async detectCompetitorMentions(transcript: string): Promise<CompetitorMention[]> {
    const competitors = ['Salesforce', 'HubSpot', 'Pipedrive', 'Monday', 'Zoho'];
    const mentions: CompetitorMention[] = [];

    competitors.forEach(competitor => {
      const regex = new RegExp(`${competitor}`, 'gi');
      const matches = transcript.match(regex);
      
      if (matches) {
        // Extract context around mention
        const contextRegex = new RegExp(`[^.]*${competitor}[^.]*`, 'gi');
        const contexts = transcript.match(contextRegex) || [];
        
        contexts.forEach(context => {
          const mention: CompetitorMention = {
            competitor_name: competitor,
            context,
            sentiment: this.analyzeSentiment(context),
            features_mentioned: this.extractFeatures(context),
            price_comparison: context.toLowerCase().includes('price') || context.toLowerCase().includes('cost'),
            switching_intent: context.toLowerCase().includes('switch') || context.toLowerCase().includes('move from')
          };
          mentions.push(mention);
        });
      }
    });

    return mentions;
  }

  // Generate follow-up recommendations
  private async generateFollowUpRecommendations(
    insights: ConversationInsight[],
    opportunities: SalesOpportunity[],
    quality: ConversationQuality,
    competitorMentions: CompetitorMention[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Based on insights
    const unhandledObjections = insights.filter(i => 
      i.insight_type === 'objection' && !i.handled_successfully
    );
    
    if (unhandledObjections.length > 0) {
      recommendations.push('Address unhandled objections from previous call');
      unhandledObjections.forEach(obj => {
        if (obj.suggested_response) {
          recommendations.push(`Prepare response for: ${obj.category} - ${obj.suggested_response}`);
        }
      });
    }

    // Based on opportunities
    opportunities
      .filter(opp => opp.priority === 'high')
      .forEach(opp => {
        recommendations.push(...opp.recommended_actions.slice(0, 2));
      });

    // Based on quality
    if (quality.discovery_score < 60) {
      recommendations.push('Prepare deeper discovery questions for next call');
    }
    
    if (quality.closing_score < 60) {
      recommendations.push('Prepare clear next steps and closing questions');
    }

    // Based on competitors
    if (competitorMentions.length > 0) {
      recommendations.push('Prepare competitive differentiation talking points');
      if (competitorMentions.some(m => m.switching_intent)) {
        recommendations.push('Prepare switching cost analysis and migration plan');
      }
    }

    // Always include
    recommendations.push('Send follow-up email within 24 hours');
    recommendations.push('Update CRM with call notes and next actions');

    return Array.from(new Set(recommendations)); // Remove duplicates
  }

  // Helper methods
  private calculateScore(transcript: string, indicators: RegExp[]): number {
    const matches = indicators.reduce((count, pattern) => {
      return count + (transcript.match(pattern) ? 1 : 0);
    }, 0);
    return Math.min((matches / indicators.length) * 100, 100);
  }

  private calculateImpactScore(type: string, category?: string): number {
    const scores: Record<string, number> = {
      'objection:price': 8,
      'objection:timing': 6,
      'objection:authority': 7,
      'buying_signal': 9,
      'pain_point': 8,
      'competitor': 7
    };
    
    const key = category ? `${type}:${category}` : type;
    return scores[key] || 5;
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positive = /better|superior|prefer|like|good|great|excellent/i;
    const negative = /worse|inferior|dislike|bad|poor|terrible/i;
    
    if (positive.test(text)) return 'positive';
    if (negative.test(text)) return 'negative';
    return 'neutral';
  }

  private extractFeatures(text: string): string[] {
    const features: string[] = [];
    const featurePatterns = [
      /integration/i,
      /automation/i,
      /reporting/i,
      /analytics/i,
      /support/i,
      /pricing/i,
      /user.?interface/i,
      /mobile/i
    ];

    featurePatterns.forEach(pattern => {
      if (pattern.test(text)) {
        features.push(pattern.source.replace(/[/\\]/g, ''));
      }
    });

    return features;
  }

  // Save analysis to database
  private async saveConversationAnalysis(callId: string, analysis: any) {
    try {
      const { error } = await supabase
        .from('conversation_intelligence')
        .insert({
          call_id: callId,
          insights: analysis.insights,
          opportunities: analysis.opportunities,
          quality_scores: analysis.quality,
          competitor_mentions: analysis.competitor_mentions,
          follow_up_recommendations: analysis.recommended_follow_up,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation analysis:', error);
    }
  }

  // Get call patterns for a user
  async getCallPatterns(
    userId: string,
    timeframe: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<CallPattern[]> {
    try {
      // In production, this would analyze historical data
      const patterns: CallPattern[] = [
        {
          pattern_type: 'successful_close',
          frequency: 12,
          examples: [
            'Clear value proposition followed by trial close',
            'Addressed pricing objection with ROI calculation',
            'Used customer success story to build confidence'
          ],
          recommendations: [
            'Continue using ROI-focused approach',
            'Document successful case studies',
            'Share closing techniques with team'
          ]
        },
        {
          pattern_type: 'lost_opportunity',
          frequency: 5,
          examples: [
            'Failed to identify decision maker early',
            'Insufficient discovery led to misaligned proposal',
            'Competitor comparison not adequately addressed'
          ],
          recommendations: [
            'Implement BANT qualification earlier',
            'Prepare competitive battle cards',
            'Strengthen discovery question framework'
          ]
        }
      ];

      return patterns;
    } catch (error) {
      console.error('Error getting call patterns:', error);
      throw error;
    }
  }

  // Real-time coaching alerts
  async generateCoachingAlert(
    transcript: string,
    context: {
      elapsed_time: number;
      speaker_changes: number;
      current_speaker: 'rep' | 'prospect';
    }
  ): Promise<{
    alert_type: 'pace' | 'engagement' | 'opportunity' | 'risk';
    message: string;
    suggestion: string;
  } | null> {
    // Check for coaching opportunities
    if (context.elapsed_time > 300 && context.speaker_changes < 10) {
      return {
        alert_type: 'engagement',
        message: 'Low interaction detected',
        suggestion: 'Ask an open-ended question to increase engagement'
      };
    }

    if (transcript.includes('I need to think') && !transcript.includes('when can we')) {
      return {
        alert_type: 'risk',
        message: 'Prospect showing hesitation',
        suggestion: 'Explore concerns and suggest a smaller next step'
      };
    }

    if (transcript.includes('how much') && !transcript.includes('investment')) {
      return {
        alert_type: 'opportunity',
        message: 'Pricing question detected',
        suggestion: 'Frame price in context of value and ROI'
      };
    }

    return null;
  }
}

export const conversationIntelligenceService = new ConversationIntelligenceService();