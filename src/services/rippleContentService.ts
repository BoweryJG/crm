// Ripple Content Service - Intelligent Content Delivery System with Advanced Tracking
// Create "Ripples" - trackable, personalized content experiences that notify you when prospects engage
import { supabase } from './supabase/supabase';

// Ripple Content Types
export interface RippleContent {
  id: string;
  user_id: string;
  content_id: string; // References generated_sales_content
  ripple_id: string;
  ripple_token: string;
  recipient_email?: string;
  recipient_name?: string;
  practice_name?: string;
  content_type: string;
  subject_line?: string;
  personalized_content: any;
  ripple_analytics: {
    opens: number;
    unique_opens: number;
    time_spent: number;
    engagement_score: number;
    clicks: number;
    shares: number;
    conversions: number;
    last_viewed?: string;
    first_viewed?: string;
    viewer_location?: string;
    device_types: string[];
    interaction_heatmap?: any;
    scroll_depth: number;
    video_watch_time?: number;
  };
  ripple_config: {
    expires_at?: string;
    max_views?: number;
    require_contact_info?: boolean;
    enable_deep_analytics?: boolean;
    custom_branding?: boolean;
    follow_up_sequence?: boolean;
    interactive_elements?: boolean;
    ai_personalization?: boolean;
  };
  performance_data: {
    conversion_score: number;
    engagement_quality: 'exceptional' | 'high' | 'medium' | 'low';
    next_best_action?: string;
    lead_temperature?: 'blazing' | 'hot' | 'warm' | 'cold';
    interest_signals: string[];
    buying_stage?: 'awareness' | 'consideration' | 'decision' | 'purchase';
  };
  ripple_status: 'draft' | 'active' | 'viewed' | 'engaged' | 'blazing' | 'converted' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface RippleDeliveryOptions {
  delivery_method: 'ripple' | 'email_ripple' | 'multi_channel';
  personalization_level: 'ultra' | 'high' | 'standard';
  tracking_depth: 'comprehensive' | 'standard' | 'basic';
  ai_enhancement: boolean;
  follow_up_automation: boolean;
  expires_in_days?: number;
  smart_timing?: boolean;
  geo_targeting?: boolean;
  device_optimization?: boolean;
}

export interface RippleViewer {
  content: any;
  practice_context: any;
  ripple_experience: {
    personalized_greeting?: string;
    dynamic_content_blocks: any[];
    interactive_elements: any[];
    smart_ctas: any[];
    social_proof_widgets: any[];
    urgency_indicators?: any[];
  };
  tracking_config: {
    track_everything: boolean;
    session_recording?: boolean;
    interaction_analytics: boolean;
    sentiment_analysis?: boolean;
    attention_tracking?: boolean;
  };
}

export interface RippleEngagement {
  ripple_id: string;
  engagement_type: 'view' | 'deep_read' | 'interaction' | 'share' | 'conversion' | 'blazing_interest';
  engagement_depth: number; // 0-100 score
  session_data: {
    duration: number;
    interactions: number;
    scroll_depth: number;
    focus_areas: string[];
    exit_intent?: boolean;
    return_visit?: boolean;
  };
  prospect_insights: {
    interest_level: number;
    pain_points_identified: string[];
    objections_detected: string[];
    buying_signals: string[];
    recommended_follow_up: string;
  };
}

class RippleContentService {
  // Create a Ripple from generated content
  async createRipple(
    userId: string,
    contentId: string,
    deliveryOptions: RippleDeliveryOptions,
    recipientInfo?: {
      email?: string;
      name?: string;
      practice_name?: string;
      specialty?: string;
      known_interests?: string[];
    }
  ): Promise<RippleContent> {
    try {
      // Get the generated content
      const { data: content, error: contentError } = await supabase
        .from('generated_sales_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (contentError || !content) {
        throw new Error('Content not found');
      }

      // Generate unique ripple token
      const rippleToken = this.generateRippleToken();
      
      // Create ripple entry in magic_links table (reusing existing infrastructure)
      const rippleData = {
        user_id: userId,
        link_type: 'ripple_content',
        link_token: rippleToken,
        target_data: {
          content_id: contentId,
          content_type: content.content_type,
          practice_context: content.target_practice,
          ripple_version: '2.0'
        },
        access_config: {
          expires_at: deliveryOptions.expires_in_days ? 
            new Date(Date.now() + deliveryOptions.expires_in_days * 24 * 60 * 60 * 1000).toISOString() : null,
          max_views: null, // Unlimited views for Ripples
          require_authentication: false,
          collect_analytics: deliveryOptions.tracking_depth === 'comprehensive'
        },
        recipient_info: recipientInfo || {},
        status: 'active'
      };

      const { data: ripple, error: rippleError } = await supabase
        .from('magic_links')
        .insert([rippleData])
        .select()
        .single();

      if (rippleError) throw rippleError;

      // Create AI-enhanced personalized content
      const personalizedContent = await this.createAIEnhancedContent(
        content,
        recipientInfo,
        deliveryOptions
      );

      // Create ripple content record
      const rippleContentData = {
        user_id: userId,
        content_id: contentId,
        ripple_id: ripple.id,
        ripple_token: rippleToken,
        recipient_email: recipientInfo?.email,
        recipient_name: recipientInfo?.name,
        practice_name: recipientInfo?.practice_name,
        content_type: content.content_type,
        subject_line: content.generated_content.subject_line,
        personalized_content: personalizedContent,
        ripple_analytics: {
          opens: 0,
          unique_opens: 0,
          time_spent: 0,
          engagement_score: 0,
          clicks: 0,
          shares: 0,
          conversions: 0,
          device_types: [],
          scroll_depth: 0
        },
        ripple_config: {
          expires_at: rippleData.access_config.expires_at,
          require_contact_info: false,
          enable_deep_analytics: deliveryOptions.tracking_depth === 'comprehensive',
          custom_branding: true,
          follow_up_sequence: deliveryOptions.follow_up_automation,
          interactive_elements: true,
          ai_personalization: deliveryOptions.ai_enhancement
        },
        performance_data: {
          conversion_score: 0,
          engagement_quality: 'low' as const,
          lead_temperature: 'cold' as const,
          interest_signals: [],
          buying_stage: 'awareness' as const
        },
        ripple_status: 'active' as const
      };

      const { data: rippleContent, error } = await supabase
        .from('ripple_content')
        .insert([rippleContentData])
        .select()
        .single();

      if (error) throw error;

      return rippleContent;
    } catch (error) {
      console.error('Error creating ripple:', error);
      throw error;
    }
  }

  // Send Ripple via preferred channel
  async sendRipple(
    rippleId: string,
    channel: 'email' | 'sms' | 'direct' = 'email',
    customMessage?: string
  ): Promise<{ success: boolean; ripple_url?: string; tracking_id?: string }> {
    try {
      const { data: rippleContent, error } = await supabase
        .from('ripple_content')
        .select('*')
        .eq('id', rippleId)
        .single();

      if (error || !rippleContent) {
        throw new Error('Ripple not found');
      }

      const rippleUrl = `${window.location.origin}/ripple/${rippleContent.ripple_token}`;

      if (channel === 'email' && rippleContent.recipient_email) {
        await this.sendRippleEmail(rippleContent, rippleUrl, customMessage);
      }

      // Create tracking ID for this send
      const trackingId = this.generateTrackingId();

      // Update ripple status
      await supabase
        .from('ripple_content')
        .update({ 
          ripple_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', rippleId);

      // Track the ripple send event
      await this.trackRippleEvent(rippleId, 'sent', {
        channel,
        tracking_id: trackingId,
        sent_at: new Date().toISOString()
      });

      return {
        success: true,
        ripple_url: rippleUrl,
        tracking_id: trackingId
      };
    } catch (error) {
      console.error('Error sending ripple:', error);
      return { success: false };
    }
  }

  // Get Ripple viewer experience
  async getRippleViewer(rippleToken: string): Promise<RippleViewer | null> {
    try {
      const { data: rippleContent, error } = await supabase
        .from('ripple_content')
        .select(`
          *,
          generated_sales_content (
            generated_content,
            target_practice,
            customization_data
          )
        `)
        .eq('ripple_token', rippleToken)
        .single();

      if (error || !rippleContent) {
        return null;
      }

      // Check if ripple is expired
      if (rippleContent.ripple_config.expires_at && 
          new Date() > new Date(rippleContent.ripple_config.expires_at)) {
        await this.updateRippleStatus(rippleContent.id, 'expired');
        return null;
      }

      // Track the view with advanced analytics
      await this.trackRippleView(rippleContent.id, rippleToken);

      // Build personalized viewer experience
      const viewer: RippleViewer = {
        content: rippleContent.personalized_content,
        practice_context: rippleContent.generated_sales_content.target_practice,
        ripple_experience: await this.buildRippleExperience(rippleContent),
        tracking_config: {
          track_everything: rippleContent.ripple_config.enable_deep_analytics || false,
          session_recording: rippleContent.ripple_config.enable_deep_analytics || false,
          interaction_analytics: true,
          sentiment_analysis: rippleContent.ripple_config.ai_personalization || false,
          attention_tracking: rippleContent.ripple_config.enable_deep_analytics || false
        }
      };

      return viewer;
    } catch (error) {
      console.error('Error getting ripple viewer:', error);
      return null;
    }
  }

  // Track Ripple engagement with deep analytics
  async trackRippleEngagement(
    rippleToken: string,
    engagement: Partial<RippleEngagement>
  ): Promise<void> {
    try {
      const { data: rippleContent } = await supabase
        .from('ripple_content')
        .select('id, ripple_analytics, performance_data')
        .eq('ripple_token', rippleToken)
        .single();

      if (!rippleContent) return;

      // Update ripple analytics with sophisticated tracking
      const updatedAnalytics = this.updateRippleAnalytics(
        rippleContent.ripple_analytics,
        engagement
      );

      // Calculate advanced engagement metrics
      const engagementQuality = this.calculateEngagementQuality(updatedAnalytics, engagement);
      const leadTemperature = this.calculateLeadTemperature(updatedAnalytics, engagement);
      const interestSignals = this.detectInterestSignals(engagement);
      const buyingStage = this.determineBuyingStage(updatedAnalytics, engagement);

      // Update ripple with new analytics
      await supabase
        .from('ripple_content')
        .update({
          ripple_analytics: updatedAnalytics,
          performance_data: {
            ...rippleContent.performance_data,
            engagement_quality: engagementQuality,
            lead_temperature: leadTemperature,
            interest_signals: interestSignals,
            buying_stage: buyingStage,
            conversion_score: this.calculateConversionScore(updatedAnalytics, engagement)
          },
          ripple_status: this.determineRippleStatus(engagement, leadTemperature),
          updated_at: new Date().toISOString()
        })
        .eq('id', rippleContent.id);

      // Track detailed engagement event
      await this.trackRippleEvent(rippleContent.id, engagement.engagement_type || 'interaction', {
        ...engagement,
        analytics_snapshot: updatedAnalytics
      });

      // Trigger notifications for significant engagement
      if (this.isSignificantEngagement(engagement, leadTemperature)) {
        await this.triggerEngagementNotification(rippleContent.id, engagement, leadTemperature);
      }

    } catch (error) {
      console.error('Error tracking ripple engagement:', error);
    }
  }

  // Get Ripple analytics dashboard
  async getRippleAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30));

      const { data, error } = await supabase
        .from('ripple_content')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        return this.getEmptyAnalytics();
      }

      const analytics = {
        total_sparks: data.length,
        total_views: data.reduce((sum, item) => sum + item.ripple_analytics.opens, 0),
        unique_viewers: data.reduce((sum, item) => sum + item.ripple_analytics.unique_opens, 0),
        blazing_leads: data.filter(item => item.performance_data.lead_temperature === 'blazing').length,
        hot_leads: data.filter(item => item.performance_data.lead_temperature === 'hot').length,
        conversions: data.filter(item => item.ripple_status === 'converted').length,
        avg_engagement_score: this.calculateAverageEngagement(data),
        top_performing_sparks: this.getTopPerformingRipples(data),
        engagement_heatmap: this.generateEngagementHeatmap(data),
        conversion_funnel: this.calculateConversionFunnel(data),
        interest_insights: this.aggregateInterestSignals(data),
        spark_performance: {
          open_rate: data.filter(d => d.ripple_analytics.opens > 0).length / data.length * 100,
          engagement_rate: data.filter(d => d.ripple_status === 'engaged' || d.ripple_status === 'blazing').length / data.length * 100,
          conversion_rate: data.filter(d => d.ripple_status === 'converted').length / data.length * 100,
          avg_time_spent: data.reduce((sum, item) => sum + item.ripple_analytics.time_spent, 0) / data.length,
          viral_coefficient: this.calculateViralCoefficient(data)
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error getting ripple analytics:', error);
      return this.getEmptyAnalytics();
    }
  }

  // Get user's Ripple content
  async getUserRipples(userId: string): Promise<RippleContent[]> {
    try {
      const { data, error } = await supabase
        .from('ripple_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user sparks:', error);
      return [];
    }
  }

  // Private helper methods
  private generateRippleToken(): string {
    return 'spk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateTrackingId(): string {
    return 'trk_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private async createAIEnhancedContent(
    content: any,
    recipientInfo?: any,
    deliveryOptions?: RippleDeliveryOptions
  ): Promise<any> {
    const enhanced = { ...content.generated_content };

    if (deliveryOptions?.ai_enhancement && recipientInfo) {
      // Add AI-powered personalization
      enhanced.personalized_elements = {
        greeting: this.generatePersonalizedGreeting(recipientInfo),
        pain_point_focus: this.identifyPainPoints(recipientInfo.specialty),
        value_props: this.customizeValueProps(content.target_practice.procedures),
        social_proof: this.selectRelevantSocialProof(recipientInfo.specialty),
        urgency_triggers: this.createUrgencyTriggers(content.content_type)
      };

      // Add interactive Ripple elements
      enhanced.ripple_interactions = {
        polls: this.generateInteractivePolls(content.content_type),
        calculators: this.createROICalculators(content.target_practice.procedures),
        comparison_tools: this.buildComparisonWidgets(recipientInfo.specialty),
        booking_widgets: this.createBookingOptions(),
        video_embeds: this.selectVideoContent(content.content_type)
      };

      // Add tracking pixels and analytics hooks
      enhanced.tracking_elements = {
        pixel_id: this.generateTrackingId(),
        heatmap_zones: this.defineHeatmapZones(content.content_type),
        interaction_triggers: this.setupInteractionTriggers(),
        sentiment_markers: this.placeSentimentMarkers()
      };
    }

    return enhanced;
  }

  private async sendRippleEmail(
    rippleContent: any,
    sparkUrl: string,
    customMessage?: string
  ): Promise<void> {
    // Email sending implementation
    console.log('Sending Ripple email:', {
      to: rippleContent.recipient_email,
      subject: `💥 ${rippleContent.subject_line}`,
      ripple_url: sparkUrl,
      custom_message: customMessage
    });
  }

  private async trackRippleView(rippleId: string, rippleToken: string): Promise<void> {
    // Increment view count and track unique views
    const { data: ripple } = await supabase
      .from('ripple_content')
      .select('ripple_analytics, ripple_status')
      .eq('id', rippleId)
      .single();

    if (ripple) {
      const analytics = ripple.ripple_analytics;
      analytics.opens += 1;
      
      // Track unique opens (simplified - in production would use visitor fingerprinting)
      if (analytics.opens === 1) {
        analytics.unique_opens = 1;
        analytics.first_viewed = new Date().toISOString();
      }
      
      analytics.last_viewed = new Date().toISOString();

      await supabase
        .from('ripple_content')
        .update({ 
          ripple_analytics: analytics,
          ripple_status: analytics.opens === 1 ? 'viewed' : ripple.ripple_status
        })
        .eq('id', rippleId);
    }
  }

  private async trackRippleEvent(
    rippleId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    try {
      await supabase
        .from('ripple_engagement_events')
        .insert([{
          ripple_id: rippleId,
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error tracking ripple event:', error);
    }
  }

  private async buildRippleExperience(rippleContent: any): Promise<any> {
    return {
      personalized_greeting: this.generatePersonalizedGreeting(rippleContent),
      dynamic_content_blocks: [
        {
          type: 'hero',
          content: rippleContent.personalized_content.content_body,
          animation: 'fade-in'
        },
        {
          type: 'value_props',
          content: this.createValuePropBlocks(rippleContent),
          layout: 'grid'
        },
        {
          type: 'social_proof',
          content: this.generateSocialProofSection(rippleContent.generated_sales_content?.target_practice?.specialty)
        }
      ],
      interactive_elements: this.createInteractiveElements(rippleContent),
      smart_ctas: this.generateSmartCTAs(rippleContent),
      social_proof_widgets: this.createSocialProofWidgets(),
      urgency_indicators: this.createUrgencyIndicators()
    };
  }

  private updateRippleAnalytics(
    currentAnalytics: any,
    engagement: Partial<RippleEngagement>
  ): any {
    const updated = { ...currentAnalytics };

    if (engagement.session_data) {
      updated.time_spent += engagement.session_data.duration;
      updated.clicks += engagement.session_data.interactions;
      
      if (engagement.session_data.scroll_depth > updated.scroll_depth) {
        updated.scroll_depth = engagement.session_data.scroll_depth;
      }
    }

    if (engagement.engagement_type === 'share') {
      updated.shares += 1;
    }

    if (engagement.engagement_type === 'conversion') {
      updated.conversions += 1;
    }

    // Calculate engagement score (0-100)
    updated.engagement_score = Math.min(100, 
      (updated.opens * 5) +
      (updated.time_spent * 0.1) +
      (updated.clicks * 10) +
      (updated.shares * 20) +
      (updated.conversions * 40) +
      (updated.scroll_depth * 0.2)
    );

    return updated;
  }

  private calculateEngagementQuality(
    analytics: any,
    engagement: Partial<RippleEngagement>
  ): 'exceptional' | 'high' | 'medium' | 'low' {
    const score = analytics.engagement_score;
    const depth = engagement.engagement_depth || 0;
    
    if (score > 80 && depth > 80) return 'exceptional';
    if (score > 60 || depth > 60) return 'high';
    if (score > 30 || depth > 30) return 'medium';
    return 'low';
  }

  private calculateLeadTemperature(
    analytics: any,
    engagement: Partial<RippleEngagement>
  ): 'blazing' | 'hot' | 'warm' | 'cold' {
    const insights = engagement.prospect_insights;
    
    if (analytics.conversions > 0 || (insights?.buying_signals?.length || 0) > 2) return 'blazing';
    if (analytics.engagement_score > 70 || (insights?.interest_level || 0) > 80) return 'hot';
    if (analytics.engagement_score > 40 || analytics.time_spent > 60) return 'warm';
    return 'cold';
  }

  private detectInterestSignals(engagement: Partial<RippleEngagement>): string[] {
    const signals = [];
    
    if (engagement.session_data?.return_visit) signals.push('repeat_visitor');
    if ((engagement.session_data?.duration || 0) > 120) signals.push('deep_engagement');
    if ((engagement.session_data?.interactions || 0) > 5) signals.push('high_interaction');
    if (engagement.engagement_type === 'share') signals.push('content_advocate');
    if ((engagement.prospect_insights?.buying_signals?.length || 0) > 0) {
      signals.push(...(engagement.prospect_insights?.buying_signals || []));
    }
    
    return signals;
  }

  private determineBuyingStage(
    analytics: any,
    engagement: Partial<RippleEngagement>
  ): 'awareness' | 'consideration' | 'decision' | 'purchase' {
    if (analytics.conversions > 0) return 'purchase';
    if (analytics.engagement_score > 70 || (engagement.engagement_depth || 0) > 70) return 'decision';
    if (analytics.time_spent > 60 || analytics.clicks > 3) return 'consideration';
    return 'awareness';
  }

  private calculateConversionScore(
    analytics: any,
    engagement: Partial<RippleEngagement>
  ): number {
    let score = analytics.engagement_score;
    
    // Boost score based on buying signals
    if (engagement.prospect_insights?.buying_signals) {
      score += engagement.prospect_insights.buying_signals.length * 10;
    }
    
    // Boost for deep engagement
    if ((engagement.engagement_depth || 0) > 80) score += 20;
    
    // Boost for return visits
    if (engagement.session_data?.return_visit) score += 15;
    
    return Math.min(100, score);
  }

  private determineRippleStatus(
    engagement: Partial<RippleEngagement>,
    temperature: string
  ): RippleContent['ripple_status'] {
    if (engagement.engagement_type === 'conversion') return 'converted';
    if (temperature === 'blazing') return 'blazing';
    if ((engagement.engagement_depth || 0) > 50) return 'engaged';
    return 'viewed';
  }

  private isSignificantEngagement(
    engagement: Partial<RippleEngagement>,
    temperature: string
  ): boolean {
    return temperature === 'blazing' || 
           temperature === 'hot' ||
           engagement.engagement_type === 'conversion' ||
           (engagement.engagement_depth || 0) > 70 ||
           (engagement.prospect_insights?.buying_signals?.length || 0) > 0;
  }

  private async triggerEngagementNotification(
    rippleId: string,
    engagement: Partial<RippleEngagement>,
    temperature: string
  ): Promise<void> {
    // This would integrate with the notification service
    console.log('Triggering Ripple notification:', { rippleId, engagement, temperature });
  }

  private async updateRippleStatus(rippleId: string, status: RippleContent['ripple_status']): Promise<void> {
    await supabase
      .from('ripple_content')
      .update({ ripple_status: status, updated_at: new Date().toISOString() })
      .eq('id', rippleId);
  }

  // Analytics helper methods
  private getEmptyAnalytics(): any {
    return {
      total_ripples: 0,
      total_views: 0,
      unique_viewers: 0,
      blazing_leads: 0,
      hot_leads: 0,
      conversions: 0,
      avg_engagement_score: 0,
      top_performing_sparks: [],
      engagement_heatmap: {},
      conversion_funnel: {},
      interest_insights: [],
      spark_performance: {
        open_rate: 0,
        engagement_rate: 0,
        conversion_rate: 0,
        avg_time_spent: 0,
        viral_coefficient: 0
      }
    };
  }

  private calculateAverageEngagement(sparks: RippleContent[]): number {
    if (sparks.length === 0) return 0;
    return sparks.reduce((sum, s) => sum + s.ripple_analytics.engagement_score, 0) / sparks.length;
  }

  private getTopPerformingRipples(sparks: RippleContent[]): any[] {
    return sparks
      .sort((a, b) => b.ripple_analytics.engagement_score - a.ripple_analytics.engagement_score)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        subject: s.subject_line,
        engagement_score: s.ripple_analytics.engagement_score,
        lead_temperature: s.performance_data.lead_temperature,
        conversions: s.ripple_analytics.conversions
      }));
  }

  private generateEngagementHeatmap(sparks: RippleContent[]): any {
    // Generate heatmap data for visualization
    return {
      hourly_engagement: this.calculateHourlyEngagement(sparks),
      daily_patterns: this.calculateDailyPatterns(sparks),
      content_zones: this.calculateContentZoneEngagement(sparks)
    };
  }

  private calculateConversionFunnel(sparks: RippleContent[]): any {
    const total = sparks.length;
    const viewed = sparks.filter(s => s.ripple_analytics.opens > 0).length;
    const engaged = sparks.filter(s => s.ripple_status === 'engaged' || s.ripple_status === 'blazing').length;
    const converted = sparks.filter(s => s.ripple_status === 'converted').length;

    return {
      sent: total,
      viewed: viewed,
      engaged: engaged,
      converted: converted,
      funnel_efficiency: total > 0 ? (converted / total) * 100 : 0
    };
  }

  private aggregateInterestSignals(sparks: RippleContent[]): any {
    const allSignals = sparks.flatMap(s => s.performance_data.interest_signals);
    const signalCounts = allSignals.reduce((acc, signal) => {
      acc[signal] = (acc[signal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(signalCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([signal, count]) => ({ signal, count }));
  }

  private calculateViralCoefficient(sparks: RippleContent[]): number {
    if (sparks.length === 0) return 0;
    const totalShares = sparks.reduce((sum, s) => sum + s.ripple_analytics.shares, 0);
    return totalShares / sparks.length;
  }

  // Content personalization helpers
  private generatePersonalizedGreeting(recipientInfo: any): string {
    if (recipientInfo?.name) {
      return `${recipientInfo.name}, I noticed something interesting about ${recipientInfo.practice_name || 'your practice'}...`;
    }
    return 'I discovered something that could transform how you approach patient care...';
  }

  private identifyPainPoints(specialty: string): string[] {
    const painPoints: Record<string, string[]> = {
      dental: ['patient retention', 'procedure efficiency', 'revenue per patient'],
      aesthetic: ['treatment outcomes', 'patient satisfaction', 'competitive differentiation'],
      general: ['operational efficiency', 'growth strategies', 'patient experience']
    };
    return painPoints[specialty] || painPoints.general;
  }

  private customizeValueProps(procedures: string[]): any[] {
    return procedures.map(proc => ({
      procedure: proc,
      value_statement: `Transform your ${proc} outcomes`,
      proof_point: `Join 500+ practices seeing 40% improvement`
    }));
  }

  private selectRelevantSocialProof(specialty: string): any {
    return {
      testimonials: [`Leading ${specialty} practices trust us`],
      stats: ['500+ practices', '95% satisfaction', '40% efficiency gain'],
      logos: ['practice1', 'practice2', 'practice3']
    };
  }

  private createUrgencyTriggers(contentType: string): any[] {
    return [
      { type: 'limited_time', message: 'Special pricing expires soon' },
      { type: 'scarcity', message: 'Only accepting 5 new practices this month' },
      { type: 'fomo', message: 'Your competitors are already using this' }
    ];
  }

  private generateInteractivePolls(contentType: string): any[] {
    return [
      {
        question: 'What\'s your biggest challenge?',
        options: ['Patient Volume', 'Efficiency', 'Competition', 'Technology'],
        type: 'single_choice'
      }
    ];
  }

  private createROICalculators(procedures: string[]): any {
    return {
      type: 'roi_calculator',
      inputs: ['current_patients', 'avg_procedure_value', 'efficiency_gain'],
      formula: 'custom_roi_formula',
      visualization: 'chart'
    };
  }

  private buildComparisonWidgets(specialty: string): any {
    return {
      type: 'comparison_table',
      compare_items: ['current_approach', 'our_solution'],
      metrics: ['time', 'cost', 'outcomes', 'satisfaction']
    };
  }

  private createBookingOptions(): any {
    return {
      calendar_link: true,
      instant_demo: true,
      consultation_request: true
    };
  }

  private selectVideoContent(contentType: string): any {
    return {
      demo_video: 'demo_url',
      testimonial_video: 'testimonial_url',
      explainer_video: 'explainer_url'
    };
  }

  private defineHeatmapZones(contentType: string): any[] {
    return [
      { zone: 'hero', weight: 1.0 },
      { zone: 'value_props', weight: 0.8 },
      { zone: 'cta', weight: 1.2 },
      { zone: 'social_proof', weight: 0.7 }
    ];
  }

  private setupInteractionTriggers(): any[] {
    return [
      { trigger: 'scroll_50', action: 'track_engagement' },
      { trigger: 'time_30s', action: 'show_chat' },
      { trigger: 'exit_intent', action: 'show_offer' }
    ];
  }

  private placeSentimentMarkers(): any[] {
    return [
      { marker: 'interest_high', location: 'value_props' },
      { marker: 'objection_price', location: 'pricing' },
      { marker: 'excitement', location: 'demo_cta' }
    ];
  }

  private createValuePropBlocks(rippleContent: any): any[] {
    return [
      {
        icon: '🚀',
        title: 'Accelerate Growth',
        description: 'Average 40% increase in efficiency'
      },
      {
        icon: '💡',
        title: 'Innovative Solutions',
        description: 'Stay ahead of the competition'
      },
      {
        icon: '📈',
        title: 'Proven Results',
        description: '95% client satisfaction rate'
      }
    ];
  }

  private generateSocialProofSection(specialty: string): any {
    return {
      headline: `Trusted by Leading ${specialty} Practices`,
      testimonials: [
        { quote: 'Game-changing results', author: 'Dr. Smith' },
        { quote: 'ROI within 30 days', author: 'Dr. Johnson' }
      ],
      stats: {
        practices: '500+',
        satisfaction: '95%',
        roi: '300%'
      }
    };
  }

  private createInteractiveElements(rippleContent: any): any[] {
    return [
      {
        type: 'quiz',
        title: 'Discover Your Growth Potential',
        questions: 3
      },
      {
        type: 'calculator',
        title: 'Calculate Your ROI',
        fields: ['current_revenue', 'patient_volume']
      }
    ];
  }

  private generateSmartCTAs(rippleContent: any): any[] {
    return [
      {
        text: 'See It In Action',
        action: 'book_demo',
        style: 'primary',
        urgency: 'high'
      },
      {
        text: 'Calculate Your ROI',
        action: 'open_calculator',
        style: 'secondary'
      },
      {
        text: 'Get Instant Access',
        action: 'start_trial',
        style: 'tertiary'
      }
    ];
  }

  private createSocialProofWidgets(): any[] {
    return [
      {
        type: 'live_activity',
        message: '3 practices started a trial today'
      },
      {
        type: 'testimonial_carousel',
        count: 5
      }
    ];
  }

  private createUrgencyIndicators(): any[] {
    return [
      {
        type: 'countdown',
        expires: '48_hours',
        message: 'Special offer expires in'
      },
      {
        type: 'limited_spots',
        remaining: 3,
        message: 'Only 3 spots left this month'
      }
    ];
  }

  private calculateHourlyEngagement(sparks: RippleContent[]): any {
    // Implementation for hourly engagement patterns
    return {};
  }

  private calculateDailyPatterns(sparks: RippleContent[]): any {
    // Implementation for daily engagement patterns
    return {};
  }

  private calculateContentZoneEngagement(sparks: RippleContent[]): any {
    // Implementation for content zone engagement
    return {};
  }
}

// Export singleton instance
export const rippleContentService = new RippleContentService();
export default rippleContentService;