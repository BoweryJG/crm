// SUIS Intelligent Notification Service
// Manages smart alerts, insights, and recommendations

import { supabase } from '../../auth/supabase';
import { SUISNotification } from '../types';

interface NotificationPreferences {
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  channels: ('in_app' | 'email' | 'sms')[];
  quietHours?: { start: number; end: number };
  priorities: string[];
}

class SUISNotificationService {
  // Create an intelligent notification
  async createNotification(
    userId: string,
    notification: Omit<SUISNotification, 'id' | 'created_at' | 'read_at'>
  ): Promise<SUISNotification> {
    try {
      // Check user preferences before creating
      const preferences = await this.getUserPreferences(userId);
      
      // Apply intelligent filtering
      if (!this.shouldSendNotification(notification, preferences)) {
        console.log('Notification filtered based on user preferences');
        return null as any;
      }

      // Create notification
      const { data, error } = await supabase
        .from('suis_notifications')
        .insert({
          ...notification,
          user_id: userId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger additional channels if needed
      await this.triggerAdditionalChannels(userId, data, preferences);

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId: string): Promise<SUISNotification[]> {
    const { data, error } = await supabase
      .from('suis_notifications')
      .select('*')
      .eq('user_id', userId)
      .is('read_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('suis_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);
  }

  // Get notification summary
  async getNotificationSummary(userId: string): Promise<any> {
    const unread = await this.getUnreadNotifications(userId);
    
    const summary = {
      total: unread.length,
      byType: {} as any,
      byPriority: {} as any,
      actionRequired: 0
    };

    unread.forEach(notification => {
      // Count by type
      summary.byType[notification.notification_type] = 
        (summary.byType[notification.notification_type] || 0) + 1;
      
      // Count by priority
      summary.byPriority[notification.priority] = 
        (summary.byPriority[notification.priority] || 0) + 1;
      
      // Count action required
      if (notification.action_required) {
        summary.actionRequired++;
      }
    });

    return summary;
  }

  // Batch create notifications for insights
  async createInsightNotifications(
    userId: string,
    insights: any[]
  ): Promise<void> {
    const notifications = insights.map(insight => ({
      user_id: userId,
      notification_type: 'insight' as const,
      priority: insight.priority || 'medium' as const,
      title: insight.title,
      content: insight,
      context_data: insight.data,
      action_required: insight.actionRequired || false,
      created_at: new Date().toISOString()
    }));

    await supabase.from('suis_notifications').insert(notifications);
  }

  // Private helper methods
  private async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const { data } = await supabase
      .from('suis_intelligence_profiles')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    return data?.preferences?.notifications || {
      frequency: 'real_time',
      channels: ['in_app'],
      priorities: ['critical', 'high', 'medium']
    };
  }

  private shouldSendNotification(
    notification: any,
    preferences: NotificationPreferences
  ): boolean {
    // Check priority filter
    if (!preferences.priorities.includes(notification.priority)) {
      return false;
    }

    // Check quiet hours
    if (preferences.quietHours) {
      const currentHour = new Date().getHours();
      const { start, end } = preferences.quietHours;
      
      if (start < end) {
        if (currentHour >= start && currentHour < end) return false;
      } else {
        if (currentHour >= start || currentHour < end) return false;
      }
    }

    // Check frequency throttling
    // (implement based on frequency preference)

    return true;
  }

  private async triggerAdditionalChannels(
    userId: string,
    notification: SUISNotification,
    preferences: NotificationPreferences
  ): Promise<void> {
    // Only trigger for high priority notifications
    if (notification.priority !== 'critical' && notification.priority !== 'high') {
      return;
    }

    // Email notifications (integrate with email service)
    if (preferences.channels.includes('email')) {
      // await this.sendEmailNotification(userId, notification);
    }

    // SMS notifications (integrate with Twilio)
    if (preferences.channels.includes('sms')) {
      // await this.sendSMSNotification(userId, notification);
    }
  }
}

export const suisNotificationService = new SUISNotificationService();