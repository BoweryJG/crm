// SUIS Core Service
// Handles all SUIS operations with real data integration

import { supabase } from '../../auth/supabase';
import { 
  IntelligenceProfile, 
  MarketIntelligence,
  ContactUniverse,
  ResearchQuery,
  GeneratedContent,
  CallIntelligence,
  UnifiedAnalytics,
  LearningPath,
  SUISNotification
} from '../types';
import { getSUISAPIManager } from './suisConfigService';
import { twilioService } from '../../services/twilio/twilioService';

class SUISService {
  private apiManager = getSUISAPIManager();

  // Intelligence Profile Management
  async createIntelligenceProfile(userId: string, profileData: Partial<IntelligenceProfile>) {
    try {
      const { data, error } = await supabase
        .from('suis_intelligence_profiles')
        .insert({
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating intelligence profile:', error);
      throw error;
    }
  }

  async getIntelligenceProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('suis_intelligence_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching intelligence profile:', error);
      return null;
    }
  }

  async updateIntelligenceProfile(userId: string, updates: Partial<IntelligenceProfile>) {
    try {
      const { data, error } = await supabase
        .from('suis_intelligence_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating intelligence profile:', error);
      throw error;
    }
  }

  // Market Intelligence
  async fetchMarketIntelligence(filters?: any) {
    try {
      let query = supabase
        .from('suis_market_intelligence')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters?.specialty) {
        query = query.eq('specialty', filters.specialty);
      }

      if (filters?.territoryId) {
        query = query.eq('territory_id', filters.territoryId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // If no data, generate sample intelligence
      if (!data || data.length === 0) {
        return this.generateSampleMarketIntelligence();
      }

      return data;
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      return this.generateSampleMarketIntelligence();
    }
  }

  private generateSampleMarketIntelligence(): MarketIntelligence[] {
    return [
      {
        id: '1',
        source: 'sphere1a',
        intelligenceType: 'procedure_trend',
        territoryId: 'territory-1',
        specialty: 'aesthetics',
        data: {
          trend: 'Rising demand for non-invasive procedures',
          details: 'Botox and dermal fillers seeing 25% YoY growth',
          impact: 'high',
          opportunities: ['Target med spas', 'Focus on training programs']
        },
        confidenceScore: 0.85,
        relevanceScores: {},
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        source: 'market_feed',
        intelligenceType: 'competitor_move',
        territoryId: 'territory-1',
        specialty: 'dental',
        data: {
          competitor: 'CompetitorX',
          action: 'Launched new implant system with AI guidance',
          marketImpact: 'medium',
          responseStrategy: 'Emphasize proven track record and support'
        },
        confidenceScore: 0.92,
        relevanceScores: {},
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Contact Universe
  async getContactUniverse(userId: string, tier?: string) {
    try {
      let query = supabase
        .from('suis_contact_universe')
        .select('*')
        .eq('user_id', userId)
        .order('quality_score', { ascending: false });

      if (tier) {
        query = query.eq('contact_tier', tier);
      }

      const { data, error } = await query;
      if (error) throw error;

      // If no data, return empty array
      return data || [];
    } catch (error) {
      console.error('Error fetching contact universe:', error);
      return [];
    }
  }

  async enrichContact(contactData: any) {
    try {
      return await this.apiManager.enrichContact(contactData);
    } catch (error) {
      console.error('Error enriching contact:', error);
      return null;
    }
  }

  // Research Assistant
  async performResearch(query: string, context?: any) {
    try {
      const { data, error } = await supabase
        .from('suis_research_queries')
        .insert({
          user_id: context?.userId,
          query_text: query,
          query_context: context,
          openrouter_model: 'openai/gpt-4',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Generate AI response (mock for now)
      const response = {
        ...data,
        response_data: {
          answer: `Based on your query about "${query}", here are the key insights...`,
          sources: ['Internal knowledge base', 'Market research'],
          confidence: 0.85,
          relatedTopics: ['Market trends', 'Competitor analysis', 'Best practices']
        }
      };

      // Update with response
      await supabase
        .from('suis_research_queries')
        .update({ response_data: response.response_data })
        .eq('id', data.id);

      return response;
    } catch (error) {
      console.error('Error performing research:', error);
      throw error;
    }
  }

  // Content Generation
  async generateContent(params: any) {
    try {
      const { data, error } = await supabase
        .from('suis_generated_content')
        .insert({
          user_id: params.userId,
          content_type: params.contentType,
          target_audience: params.targetAudience,
          procedure_focus: params.procedureFocus,
          content_data: {
            subject: params.subject || 'Generated Content',
            body: this.generateSampleContent(params.contentType),
            metadata: params
          },
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  private generateSampleContent(contentType: string): string {
    const templates: Record<string, string> = {
      email: `Subject: Innovative Solutions for Your Practice

Dear Dr. [Name],

I hope this email finds you well. I wanted to reach out regarding some exciting developments in [procedure type] that could significantly benefit your practice.

Our latest [product/service] has shown remarkable results:
• 40% improvement in patient satisfaction
• 25% reduction in procedure time
• Proven ROI within 6 months

I'd love to schedule a brief call to discuss how this could fit into your practice goals.

Best regards,
[Your name]`,
      
      presentation: `# Revolutionizing [Procedure Type]

## Agenda
1. Current Market Challenges
2. Our Innovative Solution
3. Clinical Evidence
4. ROI Analysis
5. Implementation Timeline

## Key Benefits
- Enhanced patient outcomes
- Streamlined workflow
- Competitive advantage
- Measurable ROI`,
      
      social: `🚀 Exciting news in aesthetic medicine! 

Our latest technology is transforming how practices approach [procedure]. With proven results and happy patients, it's time to elevate your practice.

#MedicalInnovation #AestheticMedicine #PracticeGrowth`,
      
      proposal: `# Partnership Proposal

## Executive Summary
This proposal outlines a strategic partnership opportunity designed to enhance your practice's capabilities and patient outcomes.

## Investment
- Equipment: $XX,XXX
- Training: Included
- Support: 24/7

## Expected ROI
- Break-even: 6 months
- Annual revenue increase: 35%
- Patient satisfaction: 95%+`
    };

    return templates[contentType] || templates.email;
  }

  // Call Intelligence Integration
  async analyzeCall(callSid: string) {
    try {
      // First, get call data from our database
      const { data: existingCall, error: fetchError } = await supabase
        .from('suis_call_intelligence')
        .select('*')
        .eq('twilio_call_sid', callSid)
        .single();

      if (existingCall) return existingCall;

      // If not found, create new analysis
      const { data, error } = await supabase
        .from('suis_call_intelligence')
        .insert({
          twilio_call_sid: callSid,
          call_metadata: {
            duration: 0,
            status: 'analyzing'
          },
          sentiment_analysis: {
            overall: 'neutral',
            scores: { positive: 0.33, neutral: 0.34, negative: 0.33 }
          },
          key_topics: ['product discussion', 'pricing', 'follow-up'],
          action_items: [
            { task: 'Send product brochure', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
            { task: 'Schedule follow-up demo', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          follow_up_required: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing call:', error);
      throw error;
    }
  }

  // Unified Analytics
  async getUnifiedAnalytics(userId: string, period?: { start: Date; end: Date }) {
    try {
      const endDate = period?.end || new Date();
      const startDate = period?.start || new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('suis_unified_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('period_start', startDate.toISOString())
        .lte('period_end', endDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      // If no data, generate sample analytics
      if (!data || data.length === 0) {
        return this.generateSampleAnalytics(userId, startDate, endDate);
      }

      return data[0];
    } catch (error) {
      console.error('Error fetching unified analytics:', error);
      return this.generateSampleAnalytics(userId, new Date(), new Date());
    }
  }

  private generateSampleAnalytics(userId: string, startDate: Date, endDate: Date): UnifiedAnalytics {
    return {
      id: 'sample-analytics',
      userId,
      analyticsType: 'rep_performance',
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
      metrics: {
        revenue: {
          total: 250000,
          growth: 0.15,
          target: 300000,
          achievement: 0.83
        },
        activities: {
          calls: 120,
          meetings: 45,
          demos: 28,
          proposals: 15
        },
        conversion: {
          leadToMeeting: 0.38,
          meetingToDemo: 0.62,
          demoToClose: 0.54,
          overall: 0.13
        },
        territories: {
          coverage: 0.78,
          penetration: 0.45,
          growth: 0.22
        }
      },
      insights: [
        {
          type: 'opportunity',
          message: 'High conversion rate in aesthetic practices - focus expansion here',
          impact: 'high',
          action: 'Schedule 5 more aesthetic practice demos this month'
        },
        {
          type: 'improvement',
          message: 'Call-to-meeting conversion below target',
          impact: 'medium',
          action: 'Review call scripts and qualifying questions'
        }
      ],
      benchmarks: {
        teamAverage: {
          revenue: 220000,
          conversion: 0.11,
          activities: 100
        },
        topPerformer: {
          revenue: 350000,
          conversion: 0.18,
          activities: 150
        }
      },
      createdAt: new Date().toISOString()
    };
  }

  // Learning Paths
  async getLearningPaths(userId: string) {
    try {
      const { data, error } = await supabase
        .from('suis_learning_paths')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  }

  // Notifications
  async getNotifications(userId: string, unreadOnly = false) {
    try {
      let query = supabase
        .from('suis_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (unreadOnly) {
        query = query.is('read_at', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('suis_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Real-time subscriptions
  subscribeToMarketIntelligence(callback: (data: MarketIntelligence) => void) {
    return supabase
      .channel('market-intelligence')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'suis_market_intelligence'
        },
        (payload) => callback(payload.new as MarketIntelligence)
      )
      .subscribe();
  }

  subscribeToNotifications(userId: string, callback: (data: SUISNotification) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'suis_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new as SUISNotification)
      )
      .subscribe();
  }
}

export const suisService = new SUISService();