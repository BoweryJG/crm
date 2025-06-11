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
  private apiManager: any = null;

  private async getApiManager() {
    if (!this.apiManager) {
      this.apiManager = await getSUISAPIManager();
    }
    return this.apiManager;
  }

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

      return data || [];
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      throw error;
    }
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
      const apiManager = await this.getApiManager();
      return await apiManager.enrichContact(contactData);
    } catch (error) {
      console.error('Error enriching contact:', error);
      throw error;
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

      // Call API endpoint for research
      const apiManager = await this.getApiManager();
      const apiKey = apiManager.config.sphere1a.apiKey;
      
      const response = await fetch('/api/suis/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ query, context })
      });

      if (!response.ok) {
        throw new Error('Research API request failed');
      }

      const researchData = await response.json();
      return researchData;
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
          status: 'generating',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Call API to generate actual content
      const apiManager = await this.getApiManager();
      const apiKey = apiManager.config.sphere1a.apiKey;
      
      const response = await fetch('/api/suis/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-openrouter-key': apiManager.config.openRouter.apiKey
        },
        body: JSON.stringify({
          ...params,
          contentId: data.id
        })
      });

      if (!response.ok) {
        throw new Error('Content generation API request failed');
      }

      const generatedContent = await response.json();
      return generatedContent;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
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

      // Call API to analyze the call
      const apiManager = await this.getApiManager();
      const apiKey = apiManager.config.sphere1a.apiKey;
      
      const response = await fetch('/api/suis/analyze-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-openrouter-key': apiManager.config.openRouter.apiKey
        },
        body: JSON.stringify({ callSid })
      });

      if (!response.ok) {
        throw new Error('Call analysis API request failed');
      }

      const analysisData = await response.json();
      return analysisData;
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

      // If no data exists, call API to generate real-time analytics
      if (!data || data.length === 0) {
        const apiManager = await this.getApiManager();
        const apiKey = apiManager.config.sphere1a.apiKey;
        
        const response = await fetch('/api/suis/analytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({
            userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Analytics API request failed');
        }

        const analyticsData = await response.json();
        return analyticsData;
      }

      return data[0];
    } catch (error) {
      console.error('Error fetching unified analytics:', error);
      throw error;
    }
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