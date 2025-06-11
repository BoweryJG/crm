// Content Engagement Notification Service
// Real-time notifications when prospects engage with magic link content
import { supabase } from './supabase';
import { suisService } from './suisService';

// Notification Types
export interface ContentEngagementNotification {
  id: string;
  user_id: string;
  content_id: string;
  magic_link_content_id: string;
  notification_type: 'content_opened' | 'content_engaged' | 'content_shared' | 'content_converted' | 'hot_lead_alert';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  prospect_info: {
    name?: string;
    email?: string;
    practice_name?: string;
    specialty?: string;
    engagement_score: number;
    lead_temperature: 'hot' | 'warm' | 'cold';
  };
  engagement_details: {
    event_type: string;
    time_spent?: number;
    clicks?: number;
    scroll_percentage?: number;
    conversion_action?: string;
    device_type?: string;
    location?: string;
  };
  recommended_actions: string[];
  magic_link_url: string;
  content_preview: string;
  created_at: string;
  read_at?: string;
  actioned_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_triggers: {
    content_opened: boolean;
    first_engagement: boolean;
    high_engagement: boolean;
    hot_lead_alert: boolean;
    conversion: boolean;
    sharing: boolean;
  };
  notification_timing: {
    immediate: boolean;
    daily_digest: boolean;
    weekly_summary: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
}

export interface EngagementAlert {
  type: 'real_time' | 'digest' | 'summary';
  urgency: 'immediate' | 'within_hour' | 'next_digest';
  content_summary: {
    total_opens: number;
    total_engagements: number;
    hot_leads: number;
    conversions: number;
  };
  top_prospects: any[];
  recommended_follow_ups: string[];
}

class ContentEngagementNotificationService {
  // Process engagement event and trigger notifications
  async processEngagementEvent(
    magicLinkContentId: string,
    engagementData: {
      event_type: 'view' | 'click' | 'scroll' | 'time_spent' | 'share' | 'conversion';
      event_data?: any;
      time_spent?: number;
      scroll_percentage?: number;
      click_target?: string;
      device_info?: any;
      location_info?: any;
    }
  ): Promise<void> {
    try {
      // Get magic link content details
      const { data: magicLinkContent, error } = await supabase
        .from('magic_link_content')
        .select(`
          *,
          generated_sales_content (
            content_type,
            target_practice,
            generated_content
          )
        `)
        .eq('id', magicLinkContentId)
        .single();

      if (error || !magicLinkContent) {
        console.error('Magic link content not found:', error);
        return;
      }

      // Get user notification preferences
      const preferences = await this.getUserNotificationPreferences(magicLinkContent.user_id);

      // Determine if notification should be sent
      const shouldNotify = this.shouldSendNotification(engagementData.event_type, preferences);
      
      if (!shouldNotify) return;

      // Calculate engagement significance
      const engagementSignificance = this.calculateEngagementSignificance(
        engagementData,
        magicLinkContent.engagement_tracking
      );

      // Create notification based on engagement type and significance
      const notification = await this.createEngagementNotification(
        magicLinkContent,
        engagementData,
        engagementSignificance
      );

      if (notification) {
        // Send real-time notification
        await this.sendNotification(notification, preferences);

        // Create SUIS intelligence insight
        await this.createEngagementInsight(magicLinkContent, engagementData, notification);

        // Trigger follow-up automation if hot lead
        if (notification.prospect_info.lead_temperature === 'hot') {
          await this.triggerHotLeadAutomation(notification);
        }
      }
    } catch (error) {
      console.error('Error processing engagement event:', error);
    }
  }

  // Create engagement notification
  async createEngagementNotification(
    magicLinkContent: any,
    engagementData: any,
    significance: 'low' | 'medium' | 'high' | 'urgent'
  ): Promise<ContentEngagementNotification | null> {
    try {
      const notificationType = this.getNotificationType(engagementData.event_type, significance);
      const priority = this.getPriorityFromSignificance(significance);
      
      const prospect_info = {
        name: magicLinkContent.recipient_name,
        email: magicLinkContent.recipient_email,
        practice_name: magicLinkContent.practice_name,
        specialty: magicLinkContent.generated_sales_content?.target_practice?.specialty,
        engagement_score: magicLinkContent.performance_data?.conversion_score || 0,
        lead_temperature: magicLinkContent.performance_data?.lead_temperature || 'cold' as const
      };

      const { title, message } = this.generateNotificationContent(
        notificationType,
        prospect_info,
        engagementData
      );

      const recommendedActions = this.generateRecommendedActions(
        engagementData.event_type,
        significance,
        prospect_info
      );

      const notificationData = {
        user_id: magicLinkContent.user_id,
        content_id: magicLinkContent.content_id,
        magic_link_content_id: magicLinkContent.id,
        notification_type: notificationType,
        priority,
        title,
        message,
        prospect_info,
        engagement_details: {
          event_type: engagementData.event_type,
          time_spent: engagementData.time_spent,
          clicks: magicLinkContent.engagement_tracking.clicks,
          scroll_percentage: engagementData.scroll_percentage,
          conversion_action: engagementData.event_type === 'conversion' ? engagementData.event_data?.action : undefined,
          device_type: engagementData.device_info?.type,
          location: engagementData.location_info?.city
        },
        recommended_actions: recommendedActions,
        magic_link_url: `${window.location.origin}/magic/${magicLinkContent.link_token}`,
        content_preview: this.createContentPreview(magicLinkContent.personalized_content),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('content_engagement_notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating engagement notification:', error);
      return null;
    }
  }

  // Send notification through preferred channels
  async sendNotification(
    notification: ContentEngagementNotification,
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      // Real-time in-app notification (always sent)
      await this.sendInAppNotification(notification);

      // Email notification
      if (preferences.email_notifications && this.shouldSendEmail(notification, preferences)) {
        await this.sendEmailNotification(notification);
      }

      // SMS notification for urgent items
      if (preferences.sms_notifications && notification.priority === 'urgent') {
        await this.sendSMSNotification(notification);
      }

      // Push notification
      if (preferences.push_notifications) {
        await this.sendPushNotification(notification);
      }

      // Update notification as sent
      await supabase
        .from('content_engagement_notifications')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', notification.id);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Get user's engagement notifications
  async getUserNotifications(
    userId: string,
    filters?: {
      unread_only?: boolean;
      priority?: string[];
      content_type?: string[];
      days_back?: number;
    }
  ): Promise<ContentEngagementNotification[]> {
    try {
      let query = supabase
        .from('content_engagement_notifications')
        .select('*')
        .eq('user_id', userId);

      if (filters?.unread_only) {
        query = query.is('read_at', null);
      }

      if (filters?.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }

      if (filters?.days_back) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - filters.days_back);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  // Mark notifications as read
  async markNotificationsAsRead(notificationIds: string[]): Promise<void> {
    try {
      await supabase
        .from('content_engagement_notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', notificationIds);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }

  // Get notification preferences
  async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        // Return default preferences
        return this.getDefaultNotificationPreferences(userId);
      }

      return data;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return this.getDefaultNotificationPreferences(userId);
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }

  // Get engagement alerts summary
  async getEngagementAlerts(
    userId: string,
    timeframe: 'hour' | 'day' | 'week' = 'day'
  ): Promise<EngagementAlert> {
    try {
      const startDate = new Date();
      switch (timeframe) {
        case 'hour': startDate.setHours(startDate.getHours() - 1); break;
        case 'day': startDate.setDate(startDate.getDate() - 1); break;
        case 'week': startDate.setDate(startDate.getDate() - 7); break;
      }

      const { data: notifications } = await supabase
        .from('content_engagement_notifications')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (!notifications) {
        return this.getEmptyEngagementAlert();
      }

      const contentSummary = {
        total_opens: notifications.filter(n => n.notification_type === 'content_opened').length,
        total_engagements: notifications.filter(n => n.notification_type === 'content_engaged').length,
        hot_leads: notifications.filter(n => n.prospect_info.lead_temperature === 'hot').length,
        conversions: notifications.filter(n => n.notification_type === 'content_converted').length
      };

      const topProspects = notifications
        .filter(n => n.prospect_info.lead_temperature === 'hot' || n.prospect_info.engagement_score > 70)
        .slice(0, 5)
        .map(n => ({
          name: n.prospect_info.name,
          practice_name: n.prospect_info.practice_name,
          engagement_score: n.prospect_info.engagement_score,
          lead_temperature: n.prospect_info.lead_temperature,
          last_activity: n.created_at
        }));

      const recommendedFollowUps = this.generateAlertRecommendations(notifications);

      return {
        type: 'digest',
        urgency: contentSummary.hot_leads > 0 ? 'immediate' : 'within_hour',
        content_summary: contentSummary,
        top_prospects: topProspects,
        recommended_follow_ups: recommendedFollowUps
      };
    } catch (error) {
      console.error('Error getting engagement alerts:', error);
      return this.getEmptyEngagementAlert();
    }
  }

  // Private helper methods
  private shouldSendNotification(eventType: string, preferences: NotificationPreferences): boolean {
    switch (eventType) {
      case 'view':
        return preferences.notification_triggers.content_opened;
      case 'click':
      case 'scroll':
      case 'time_spent':
        return preferences.notification_triggers.first_engagement || preferences.notification_triggers.high_engagement;
      case 'share':
        return preferences.notification_triggers.sharing;
      case 'conversion':
        return preferences.notification_triggers.conversion;
      default:
        return false;
    }
  }

  private calculateEngagementSignificance(
    engagementData: any,
    currentTracking: any
  ): 'low' | 'medium' | 'high' | 'urgent' {
    let score = 0;

    // First time engagement gets higher score
    if (currentTracking.opens === 0 && engagementData.event_type === 'view') score += 20;
    
    // Time spent scoring
    if (engagementData.time_spent) {
      if (engagementData.time_spent > 120) score += 30; // 2+ minutes = high engagement
      else if (engagementData.time_spent > 60) score += 20; // 1+ minute = medium engagement
      else if (engagementData.time_spent > 30) score += 10; // 30+ seconds = some engagement
    }

    // Interaction scoring
    if (engagementData.event_type === 'click') score += 15;
    if (engagementData.event_type === 'share') score += 25;
    if (engagementData.event_type === 'conversion') score += 50;

    // Scroll depth scoring
    if (engagementData.scroll_percentage) {
      if (engagementData.scroll_percentage > 80) score += 15;
      else if (engagementData.scroll_percentage > 50) score += 10;
    }

    // Multiple engagements bonus
    if (currentTracking.clicks > 1) score += 10;
    if (currentTracking.opens > 2) score += 5;

    if (score >= 60) return 'urgent';
    if (score >= 40) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  }

  private getNotificationType(
    eventType: string,
    significance: string
  ): ContentEngagementNotification['notification_type'] {
    if (eventType === 'conversion') return 'content_converted';
    if (eventType === 'share') return 'content_shared';
    if (significance === 'urgent') return 'hot_lead_alert';
    if (['click', 'scroll', 'time_spent'].includes(eventType)) return 'content_engaged';
    return 'content_opened';
  }

  private getPriorityFromSignificance(significance: string): ContentEngagementNotification['priority'] {
    switch (significance) {
      case 'urgent': return 'urgent';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  }

  private generateNotificationContent(
    type: ContentEngagementNotification['notification_type'],
    prospectInfo: any,
    engagementData: any
  ): { title: string; message: string } {
    const practiceName = prospectInfo.practice_name || 'A prospect';
    const providerName = prospectInfo.name || 'someone';

    switch (type) {
      case 'content_opened':
        return {
          title: `${practiceName} opened your content`,
          message: `${providerName} at ${practiceName} just opened your sales content. This could be a great time to follow up!`
        };
        
      case 'content_engaged':
        return {
          title: `${practiceName} is actively engaging`,
          message: `${providerName} is spending time with your content (${engagementData.time_spent}s) and clicking through. High engagement detected!`
        };
        
      case 'content_shared':
        return {
          title: `${practiceName} shared your content`,
          message: `${providerName} found your content valuable enough to share. This indicates strong interest!`
        };
        
      case 'content_converted':
        return {
          title: `🎉 ${practiceName} converted!`,
          message: `${providerName} took a conversion action on your content. Time to follow up immediately!`
        };
        
      case 'hot_lead_alert':
        return {
          title: `🔥 Hot lead alert: ${practiceName}`,
          message: `${providerName} is showing very high engagement with your content. Strike while the iron is hot!`
        };
        
      default:
        return {
          title: `Activity from ${practiceName}`,
          message: `${providerName} interacted with your content.`
        };
    }
  }

  private generateRecommendedActions(
    eventType: string,
    significance: string,
    prospectInfo: any
  ): string[] {
    const baseActions = [
      'View full engagement details',
      'Review prospect profile',
      'Check content performance'
    ];

    if (significance === 'urgent' || eventType === 'conversion') {
      return [
        'Call immediately while engaged',
        'Send personalized follow-up email',
        'Schedule demo within 24 hours',
        ...baseActions
      ];
    }

    if (significance === 'high' || eventType === 'share') {
      return [
        'Send follow-up email within 2 hours',
        'Prepare demo materials',
        'Research practice background',
        ...baseActions
      ];
    }

    if (eventType === 'view') {
      return [
        'Send follow-up email within 24 hours',
        'Prepare additional resources',
        ...baseActions
      ];
    }

    return baseActions;
  }

  private createContentPreview(content: any): string {
    if (content.subject_line) {
      return content.subject_line;
    }
    if (content.content_body) {
      return content.content_body.substring(0, 100) + '...';
    }
    return 'Content preview not available';
  }

  private shouldSendEmail(
    notification: ContentEngagementNotification,
    preferences: NotificationPreferences
  ): boolean {
    // Check quiet hours
    if (preferences.quiet_hours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(preferences.quiet_hours.start_time.replace(':', ''));
      const endTime = parseInt(preferences.quiet_hours.end_time.replace(':', ''));
      
      if (currentTime >= startTime && currentTime <= endTime) {
        return false; // In quiet hours
      }
    }

    // Only send email for high priority notifications unless immediate timing is enabled
    return notification.priority === 'urgent' || 
           (notification.priority === 'high' && preferences.notification_timing.immediate);
  }

  private async sendInAppNotification(notification: ContentEngagementNotification): Promise<void> {
    // Trigger real-time notification in the app (websocket, server-sent events, etc.)
    console.log('Sending in-app notification:', notification.title);
  }

  private async sendEmailNotification(notification: ContentEngagementNotification): Promise<void> {
    // Send email notification
    console.log('Sending email notification:', notification.title);
  }

  private async sendSMSNotification(notification: ContentEngagementNotification): Promise<void> {
    // Send SMS notification for urgent items
    console.log('Sending SMS notification:', notification.title);
  }

  private async sendPushNotification(notification: ContentEngagementNotification): Promise<void> {
    // Send push notification
    console.log('Sending push notification:', notification.title);
  }

  private async createEngagementInsight(
    magicLinkContent: any,
    engagementData: any,
    notification: ContentEngagementNotification
  ): Promise<void> {
    try {
      const insight = {
        user_id: magicLinkContent.user_id,
        insight_type: 'content_engagement',
        data_source: 'magic_link_content',
        correlation_score: notification.prospect_info.engagement_score,
        urgency_level: notification.priority === 'urgent' ? 'urgent' : 'standard',
        insight_data: {
          message: `${notification.prospect_info.practice_name} ${engagementData.event_type} your ${magicLinkContent.content_type} content`,
          engagement_type: engagementData.event_type,
          prospect_info: notification.prospect_info,
          engagement_details: notification.engagement_details,
          recommended_actions: notification.recommended_actions
        },
        procedure_tags: magicLinkContent.generated_sales_content?.target_practice?.procedures || [],
        territory_relevance: {
          practice_name: notification.prospect_info.practice_name,
          specialty: notification.prospect_info.specialty
        }
      };

      await suisService.createIntelligenceInsight(insight);
    } catch (error) {
      console.error('Error creating engagement insight:', error);
    }
  }

  private async triggerHotLeadAutomation(notification: ContentEngagementNotification): Promise<void> {
    try {
      // Trigger automated follow-up sequence for hot leads
      console.log('Triggering hot lead automation for:', notification.prospect_info.practice_name);
      
      // Could integrate with:
      // - Automated email sequences
      // - Calendar booking
      // - CRM updates
      // - Sales team alerts
    } catch (error) {
      console.error('Error triggering hot lead automation:', error);
    }
  }

  private getDefaultNotificationPreferences(userId: string): NotificationPreferences {
    return {
      user_id: userId,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      notification_triggers: {
        content_opened: true,
        first_engagement: true,
        high_engagement: true,
        hot_lead_alert: true,
        conversion: true,
        sharing: true
      },
      notification_timing: {
        immediate: true,
        daily_digest: false,
        weekly_summary: true
      },
      quiet_hours: {
        enabled: true,
        start_time: '22:00',
        end_time: '08:00'
      }
    };
  }

  private getEmptyEngagementAlert(): EngagementAlert {
    return {
      type: 'digest',
      urgency: 'next_digest',
      content_summary: {
        total_opens: 0,
        total_engagements: 0,
        hot_leads: 0,
        conversions: 0
      },
      top_prospects: [],
      recommended_follow_ups: []
    };
  }

  private generateAlertRecommendations(notifications: ContentEngagementNotification[]): string[] {
    const recommendations = [];
    
    const hotLeads = notifications.filter(n => n.prospect_info.lead_temperature === 'hot');
    const conversions = notifications.filter(n => n.notification_type === 'content_converted');
    const highEngagement = notifications.filter(n => n.prospect_info.engagement_score > 70);

    if (hotLeads.length > 0) {
      recommendations.push(`Follow up with ${hotLeads.length} hot leads immediately`);
    }

    if (conversions.length > 0) {
      recommendations.push(`Contact ${conversions.length} prospects who converted`);
    }

    if (highEngagement.length > 0) {
      recommendations.push(`Nurture ${highEngagement.length} highly engaged prospects`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring engagement patterns');
    }

    return recommendations;
  }
}

// Export singleton instance
export const contentEngagementNotificationService = new ContentEngagementNotificationService();
export default contentEngagementNotificationService;