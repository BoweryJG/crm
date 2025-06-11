// Spark Content Service - Intelligent Content Delivery System with Advanced Tracking
// Create "Sparks" - trackable, personalized content experiences that notify you when prospects engage
import { supabase } from './supabase/supabase';
import { contentGeneratorService } from './contentGeneratorService';

// Magic Link Content Types
export interface MagicLinkContent {
  id: string;
  user_id: string;
  content_id: string; // References generated_sales_content
  magic_link_id: string;
  link_token: string;
  recipient_email?: string;
  recipient_name?: string;
  practice_name?: string;
  content_type: string;
  subject_line?: string;
  personalized_content: any;
  engagement_tracking: {
    opens: number;
    time_spent: number;
    clicks: number;
    shares: number;
    conversions: number;
    last_viewed?: string;
    viewer_location?: string;
    device_type?: string;
  };
  magic_link_config: {
    expires_at?: string;
    max_views?: number;
    require_contact_info?: boolean;
    enable_analytics?: boolean;
    custom_branding?: boolean;
    follow_up_sequence?: boolean;
  };
  performance_data: {
    conversion_score: number;
    engagement_quality: 'high' | 'medium' | 'low';
    next_best_action?: string;
    lead_temperature?: 'hot' | 'warm' | 'cold';
  };
  status: 'draft' | 'sent' | 'viewed' | 'engaged' | 'converted';
  created_at: string;
  updated_at: string;
}

export interface ContentDeliveryOptions {
  delivery_method: 'email' | 'magic_link' | 'both';
  personalization_level: 'high' | 'medium' | 'standard';
  tracking_enabled: boolean;
  follow_up_sequence: boolean;
  expires_in_days?: number;
  require_contact_capture?: boolean;
  custom_branding?: boolean;
}

export interface MagicLinkViewer {
  content: any;
  practice_context: any;
  engagement_tools: {
    questions: string[];
    interactive_elements: any[];
    call_to_actions: any[];
    follow_up_options: string[];
  };
  analytics_config: {
    track_time: boolean;
    track_scroll: boolean;
    track_interactions: boolean;
    track_sharing: boolean;
  };
}

class MagicLinkContentService {
  // Create magic link for generated content
  async createMagicLinkContent(
    userId: string,
    contentId: string,
    deliveryOptions: ContentDeliveryOptions,
    recipientInfo?: {
      email?: string;
      name?: string;
      practice_name?: string;
    }
  ): Promise<MagicLinkContent> {
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

      // Generate unique magic link token
      const linkToken = this.generateSecureToken();
      
      // Create magic link entry
      const magicLinkData = {
        user_id: userId,
        link_type: 'sales_content',
        link_token: linkToken,
        target_data: {
          content_id: contentId,
          content_type: content.content_type,
          practice_context: content.target_practice
        },
        access_config: {
          expires_at: deliveryOptions.expires_in_days ? 
            new Date(Date.now() + deliveryOptions.expires_in_days * 24 * 60 * 60 * 1000).toISOString() : null,
          max_views: deliveryOptions.require_contact_capture ? 1 : null,
          require_authentication: false,
          collect_analytics: deliveryOptions.tracking_enabled
        },
        recipient_info: recipientInfo || {},
        status: 'active'
      };

      const { data: magicLink, error: linkError } = await supabase
        .from('magic_links')
        .insert([magicLinkData])
        .select()
        .single();

      if (linkError) throw linkError;

      // Create personalized content version
      const personalizedContent = await this.personalizeContentForMagicLink(
        content,
        recipientInfo,
        deliveryOptions.personalization_level
      );

      // Create magic link content record
      const magicLinkContentData = {
        user_id: userId,
        content_id: contentId,
        magic_link_id: magicLink.id,
        link_token: linkToken,
        recipient_email: recipientInfo?.email,
        recipient_name: recipientInfo?.name,
        practice_name: recipientInfo?.practice_name,
        content_type: content.content_type,
        subject_line: content.generated_content.subject_line,
        personalized_content: personalizedContent,
        engagement_tracking: {
          opens: 0,
          time_spent: 0,
          clicks: 0,
          shares: 0,
          conversions: 0
        },
        magic_link_config: {
          expires_at: magicLinkData.access_config.expires_at,
          max_views: magicLinkData.access_config.max_views,
          require_contact_info: deliveryOptions.require_contact_capture,
          enable_analytics: deliveryOptions.tracking_enabled,
          custom_branding: deliveryOptions.custom_branding,
          follow_up_sequence: deliveryOptions.follow_up_sequence
        },
        performance_data: {
          conversion_score: 0,
          engagement_quality: 'low' as const,
          lead_temperature: 'cold' as const
        },
        status: 'draft' as const
      };

      const { data: magicLinkContent, error } = await supabase
        .from('magic_link_content')
        .insert([magicLinkContentData])
        .select()
        .single();

      if (error) throw error;

      return magicLinkContent;
    } catch (error) {
      console.error('Error creating magic link content:', error);
      throw error;
    }
  }

  // Send content via magic link
  async sendMagicLinkContent(
    magicLinkContentId: string,
    deliveryMethod: 'email' | 'magic_link' | 'sms' = 'email',
    customMessage?: string
  ): Promise<{ success: boolean; magic_link_url?: string }> {
    try {
      const { data: magicLinkContent, error } = await supabase
        .from('magic_link_content')
        .select('*')
        .eq('id', magicLinkContentId)
        .single();

      if (error || !magicLinkContent) {
        throw new Error('Magic link content not found');
      }

      const magicLinkUrl = `${window.location.origin}/magic/${magicLinkContent.link_token}`;

      if (deliveryMethod === 'email' && magicLinkContent.recipient_email) {
        await this.sendContentEmail(magicLinkContent, magicLinkUrl, customMessage);
      }

      // Update status to sent
      await supabase
        .from('magic_link_content')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', magicLinkContentId);

      // Track the send event
      await this.trackContentEvent(magicLinkContentId, 'sent', {
        delivery_method: deliveryMethod,
        sent_at: new Date().toISOString()
      });

      return {
        success: true,
        magic_link_url: magicLinkUrl
      };
    } catch (error) {
      console.error('Error sending magic link content:', error);
      return { success: false };
    }
  }

  // Get magic link content for viewer
  async getMagicLinkViewer(linkToken: string): Promise<MagicLinkViewer | null> {
    try {
      const { data: magicLinkContent, error } = await supabase
        .from('magic_link_content')
        .select(`
          *,
          generated_sales_content (
            generated_content,
            target_practice,
            customization_data
          )
        `)
        .eq('link_token', linkToken)
        .single();

      if (error || !magicLinkContent) {
        return null;
      }

      // Check if link is expired
      if (magicLinkContent.magic_link_config.expires_at && 
          new Date() > new Date(magicLinkContent.magic_link_config.expires_at)) {
        return null;
      }

      // Track the view
      await this.trackContentView(magicLinkContent.id, linkToken);

      // Build viewer experience
      const viewer: MagicLinkViewer = {
        content: magicLinkContent.personalized_content,
        practice_context: magicLinkContent.generated_sales_content.target_practice,
        engagement_tools: await this.buildEngagementTools(magicLinkContent),
        analytics_config: {
          track_time: magicLinkContent.magic_link_config.enable_analytics || false,
          track_scroll: magicLinkContent.magic_link_config.enable_analytics || false,
          track_interactions: magicLinkContent.magic_link_config.enable_analytics || false,
          track_sharing: true
        }
      };

      return viewer;
    } catch (error) {
      console.error('Error getting magic link viewer:', error);
      return null;
    }
  }

  // Track content engagement
  async trackContentEngagement(
    linkToken: string,
    engagementData: {
      event_type: 'view' | 'click' | 'scroll' | 'time_spent' | 'share' | 'conversion';
      event_data?: any;
      time_spent?: number;
      scroll_percentage?: number;
      click_target?: string;
    }
  ): Promise<void> {
    try {
      const { data: magicLinkContent } = await supabase
        .from('magic_link_content')
        .select('id, engagement_tracking')
        .eq('link_token', linkToken)
        .single();

      if (!magicLinkContent) return;

      // Update engagement metrics
      const currentTracking = magicLinkContent.engagement_tracking;
      const updatedTracking = { ...currentTracking };

      switch (engagementData.event_type) {
        case 'view':
          updatedTracking.opens += 1;
          updatedTracking.last_viewed = new Date().toISOString();
          break;
        case 'click':
          updatedTracking.clicks += 1;
          break;
        case 'time_spent':
          updatedTracking.time_spent += engagementData.time_spent || 0;
          break;
        case 'share':
          updatedTracking.shares += 1;
          break;
        case 'conversion':
          updatedTracking.conversions += 1;
          break;
      }

      // Calculate engagement quality
      const engagementQuality = this.calculateEngagementQuality(updatedTracking);
      const leadTemperature = this.calculateLeadTemperature(updatedTracking);

      await supabase
        .from('magic_link_content')
        .update({
          engagement_tracking: updatedTracking,
          performance_data: {
            ...magicLinkContent.performance_data,
            engagement_quality: engagementQuality,
            lead_temperature: leadTemperature,
            conversion_score: this.calculateConversionScore(updatedTracking)
          },
          status: engagementData.event_type === 'conversion' ? 'converted' : 
                 updatedTracking.time_spent > 30 ? 'engaged' : 'viewed',
          updated_at: new Date().toISOString()
        })
        .eq('id', magicLinkContent.id);

      // Track detailed analytics
      await this.trackContentEvent(magicLinkContent.id, engagementData.event_type, engagementData);

    } catch (error) {
      console.error('Error tracking content engagement:', error);
    }
  }

  // Get content analytics
  async getContentAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30));

      const { data, error } = await supabase
        .from('magic_link_content')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_sent: 0,
          total_views: 0,
          total_engagement: 0,
          conversion_rate: 0,
          avg_time_spent: 0,
          top_performing_content: [],
          engagement_trends: [],
          magic_link_performance: {}
        };
      }

      const analytics = {
        total_sent: data.length,
        total_views: data.reduce((sum, item) => sum + item.engagement_tracking.opens, 0),
        total_engagement: data.filter(item => item.status === 'engaged' || item.status === 'converted').length,
        conversion_rate: data.filter(item => item.status === 'converted').length / data.length * 100,
        avg_time_spent: data.reduce((sum, item) => sum + item.engagement_tracking.time_spent, 0) / data.length,
        top_performing_content: this.getTopPerformingContent(data),
        engagement_trends: this.calculateEngagementTrends(data),
        magic_link_performance: this.calculateMagicLinkPerformance(data)
      };

      return analytics;
    } catch (error) {
      console.error('Error getting content analytics:', error);
      return {};
    }
  }

  // Get user's magic link content
  async getUserMagicLinkContent(userId: string): Promise<MagicLinkContent[]> {
    try {
      const { data, error } = await supabase
        .from('magic_link_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user magic link content:', error);
      return [];
    }
  }

  // Private helper methods
  private generateSecureToken(): string {
    return 'mlc_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async personalizeContentForMagicLink(
    content: any,
    recipientInfo?: any,
    personalizationLevel: string = 'high'
  ): Promise<any> {
    // Create personalized version of content for magic link viewer
    const personalized = { ...content.generated_content };

    if (recipientInfo && personalizationLevel === 'high') {
      // Add personalization tokens
      if (recipientInfo.name) {
        personalized.recipient_name = recipientInfo.name;
      }
      if (recipientInfo.practice_name) {
        personalized.practice_name = recipientInfo.practice_name;
      }
      
      // Add interactive elements for magic link
      personalized.interactive_elements = {
        questions: this.generateInteractiveQuestions(content.content_type),
        polls: this.generateEngagementPolls(content.target_practice),
        cta_buttons: this.generateCTAButtons(content.content_type),
        social_proof: this.generateSocialProof(content.target_practice.specialty)
      };
    }

    return personalized;
  }

  private async sendContentEmail(
    magicLinkContent: any,
    magicLinkUrl: string,
    customMessage?: string
  ): Promise<void> {
    // Email sending would integrate with email service
    // For now, we'll log the email content
    console.log('Sending email with magic link:', {
      to: magicLinkContent.recipient_email,
      subject: magicLinkContent.subject_line,
      magic_link: magicLinkUrl,
      custom_message: customMessage
    });
  }

  private async trackContentView(contentId: string, linkToken: string): Promise<void> {
    await this.trackContentEngagement(linkToken, {
      event_type: 'view',
      event_data: { content_id: contentId, timestamp: new Date().toISOString() }
    });
  }

  private async trackContentEvent(
    contentId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    try {
      await supabase
        .from('content_engagement_events')
        .insert([{
          content_id: contentId,
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error tracking content event:', error);
    }
  }

  private async buildEngagementTools(magicLinkContent: any): Promise<any> {
    return {
      questions: this.generateInteractiveQuestions(magicLinkContent.content_type),
      interactive_elements: [
        {
          type: 'poll',
          question: 'What\'s your biggest challenge with current procedures?',
          options: ['Cost', 'Time', 'Results', 'Patient Satisfaction']
        },
        {
          type: 'calculator',
          title: 'ROI Calculator',
          description: 'Calculate potential return on investment'
        }
      ],
      call_to_actions: this.generateCTAButtons(magicLinkContent.content_type),
      follow_up_options: [
        'Schedule a demo',
        'Request more information',
        'Speak with a specialist',
        'Download case studies'
      ]
    };
  }

  private generateInteractiveQuestions(contentType: string): string[] {
    const questionSets = {
      socratic_discovery: [
        'What assumptions about your current approach might be limiting your growth?',
        'How would you measure success if you could start completely fresh?',
        'What would need to change for you to double your results?'
      ],
      challenger_insight: [
        'How might this insight change your perspective?',
        'What would the cost be of maintaining your current approach?',
        'Which of your competitors might already be implementing this?'
      ],
      teaching_sequence: [
        'How does this apply to your specific situation?',
        'What questions does this raise about your current process?',
        'What would you want to learn more about?'
      ]
    };

    return questionSets[contentType as keyof typeof questionSets] || questionSets.socratic_discovery;
  }

  private generateEngagementPolls(practiceInfo: any): any[] {
    return [
      {
        question: `What's your biggest challenge in ${practiceInfo.specialty}?`,
        options: ['Patient Volume', 'Procedure Efficiency', 'Cost Management', 'Competition']
      },
      {
        question: 'How do you typically evaluate new solutions?',
        options: ['ROI Analysis', 'Peer Recommendations', 'Trial Period', 'Case Studies']
      }
    ];
  }

  private generateCTAButtons(contentType: string): any[] {
    return [
      { text: 'Schedule a Discovery Call', type: 'primary', action: 'schedule_call' },
      { text: 'Request Demo', type: 'secondary', action: 'request_demo' },
      { text: 'Download Case Study', type: 'tertiary', action: 'download_case_study' },
      { text: 'Connect with Specialist', type: 'quaternary', action: 'connect_specialist' }
    ];
  }

  private generateSocialProof(specialty: string): any {
    return {
      testimonials: [
        `"This completely changed how we approach ${specialty} procedures"`,
        `"ROI was visible within the first month"`
      ],
      stats: [
        '500+ practices transformed',
        '40% average efficiency increase',
        '95% client satisfaction rate'
      ]
    };
  }

  private calculateEngagementQuality(tracking: any): 'high' | 'medium' | 'low' {
    const score = tracking.opens * 10 + tracking.time_spent * 0.1 + tracking.clicks * 20 + tracking.shares * 30;
    
    if (score > 100) return 'high';
    if (score > 30) return 'medium';
    return 'low';
  }

  private calculateLeadTemperature(tracking: any): 'hot' | 'warm' | 'cold' {
    if (tracking.conversions > 0 || (tracking.time_spent > 60 && tracking.clicks > 2)) return 'hot';
    if (tracking.time_spent > 30 || tracking.clicks > 0) return 'warm';
    return 'cold';
  }

  private calculateConversionScore(tracking: any): number {
    return Math.min(100, 
      tracking.opens * 5 + 
      tracking.time_spent * 0.2 + 
      tracking.clicks * 15 + 
      tracking.shares * 25 + 
      tracking.conversions * 50
    );
  }

  private getTopPerformingContent(data: any[]): any[] {
    return data
      .sort((a, b) => b.performance_data.conversion_score - a.performance_data.conversion_score)
      .slice(0, 5)
      .map(item => ({
        content_type: item.content_type,
        practice_name: item.practice_name,
        conversion_score: item.performance_data.conversion_score,
        engagement_quality: item.performance_data.engagement_quality
      }));
  }

  private calculateEngagementTrends(data: any[]): any[] {
    // Group by day and calculate trends
    const dailyStats = data.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, views: 0, engagements: 0, conversions: 0 };
      }
      acc[date].views += item.engagement_tracking.opens;
      if (item.status === 'engaged' || item.status === 'converted') acc[date].engagements++;
      if (item.status === 'converted') acc[date].conversions++;
      return acc;
    }, {});

    return Object.values(dailyStats);
  }

  private calculateMagicLinkPerformance(data: any[]): any {
    const totalLinks = data.length;
    const openedLinks = data.filter(item => item.engagement_tracking.opens > 0).length;
    const engagedLinks = data.filter(item => item.status === 'engaged' || item.status === 'converted').length;
    const convertedLinks = data.filter(item => item.status === 'converted').length;

    return {
      open_rate: totalLinks > 0 ? (openedLinks / totalLinks) * 100 : 0,
      engagement_rate: totalLinks > 0 ? (engagedLinks / totalLinks) * 100 : 0,
      conversion_rate: totalLinks > 0 ? (convertedLinks / totalLinks) * 100 : 0,
      avg_time_spent: data.reduce((sum, item) => sum + item.engagement_tracking.time_spent, 0) / totalLinks
    };
  }
}

// Export singleton instance
export const magicLinkContentService = new MagicLinkContentService();
export default magicLinkContentService;