// Enhanced Email Analytics Service with Tracking and Intelligence
import axios from 'axios';
import { supabase } from '../supabase/supabase';

// Types and Interfaces
interface EmailEvent {
  id: string;
  email_log_id: string;
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'unsubscribed';
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  device_info?: {
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  link_url?: string; // For click events
  bounce_reason?: string; // For bounce events
  complaint_type?: string; // For complaint events
  metadata?: Record<string, any>;
}

interface EmailTracking {
  message_id: string;
  tracking_pixel_url: string;
  click_tracking_enabled: boolean;
  open_tracking_enabled: boolean;
  tracking_domain: string;
  short_links: Array<{
    original_url: string;
    short_url: string;
    click_count: number;
  }>;
  created_at: string;
  expires_at: string;
}

interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  complained_count: number;
  unsubscribed_count: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  complaint_rate: number;
  unsubscribe_rate: number;
  engagement_score: number;
  best_send_time?: string;
  top_devices: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  geographical_data: Array<{
    country: string;
    opens: number;
    clicks: number;
  }>;
  time_based_analytics: {
    hourly_opens: number[];
    daily_opens: number[];
    hourly_clicks: number[];
    daily_clicks: number[];
  };
}

interface ContactEngagement {
  contact_id: string;
  email: string;
  total_emails_sent: number;
  total_emails_opened: number;
  total_emails_clicked: number;
  last_opened: string;
  last_clicked: string;
  engagement_score: number;
  engagement_trend: 'increasing' | 'stable' | 'decreasing';
  preferred_send_time?: string;
  device_preference?: string;
  location?: string;
  tags: string[];
  segments: string[];
  unsubscribed: boolean;
  complaint_history: number;
}

interface EmailIntelligence {
  subject_line_performance: Array<{
    subject: string;
    open_rate: number;
    click_rate: number;
    sent_count: number;
  }>;
  send_time_optimization: {
    best_hour: number;
    best_day: string;
    timezone_analysis: Array<{
      timezone: string;
      best_hour: number;
      performance_score: number;
    }>;
  };
  content_analysis: {
    top_performing_keywords: string[];
    cta_performance: Array<{
      text: string;
      click_rate: number;
      position: 'top' | 'middle' | 'bottom';
    }>;
    content_length_analysis: {
      optimal_length: number;
      performance_by_length: Array<{
        range: string;
        avg_open_rate: number;
        avg_click_rate: number;
      }>;
    };
  };
  deliverability_insights: {
    reputation_score: number;
    spam_score: number;
    domain_reputation: Record<string, number>;
    authentication_status: {
      spf: boolean;
      dkim: boolean;
      dmarc: boolean;
    };
    recommendations: string[];
  };
}

interface RealTimeMetrics {
  timestamp: string;
  emails_sent_last_hour: number;
  emails_sent_last_24h: number;
  current_send_rate: number; // emails per minute
  delivery_rate_last_hour: number;
  open_rate_last_hour: number;
  click_rate_last_hour: number;
  bounce_rate_last_hour: number;
  active_campaigns: number;
  queue_size: number;
  system_health: 'healthy' | 'degraded' | 'critical';
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}

interface A_BTestResult {
  test_id: string;
  test_name: string;
  variant_a: {
    name: string;
    sent: number;
    opened: number;
    clicked: number;
    open_rate: number;
    click_rate: number;
  };
  variant_b: {
    name: string;
    sent: number;
    opened: number;
    clicked: number;
    open_rate: number;
    click_rate: number;
  };
  statistical_significance: number;
  confidence_level: number;
  winner?: 'a' | 'b' | 'inconclusive';
  test_duration_hours: number;
  recommendation: string;
}

interface HeatmapData {
  email_id: string;
  click_coordinates: Array<{
    x: number;
    y: number;
    element_type: string;
    element_text: string;
    click_count: number;
  }>;
  scroll_depth: Array<{
    percentage: number;
    user_count: number;
  }>;
  time_spent_reading: number; // average seconds
  mobile_vs_desktop: {
    mobile: { clicks: number; time_spent: number };
    desktop: { clicks: number; time_spent: number };
  };
}

class EmailAnalyticsService {
  private backendUrl: string;
  private cache = new Map<string, any>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private realTimeSubscriptions = new Map<string, () => void>();

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
    this.setupRealTimeSubscriptions();
  }

  // Real-time subscriptions for live analytics
  private setupRealTimeSubscriptions(): void {
    // Subscribe to email events for real-time updates
    const subscription = supabase
      .channel('email_analytics')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'email_events' },
        (payload) => {
          this.handleRealTimeEvent(payload.new as EmailEvent);
        }
      )
      .subscribe();

    console.log('Email analytics real-time subscriptions established');
  }

  private handleRealTimeEvent(event: EmailEvent): void {
    // Invalidate relevant caches
    this.invalidateCache([
      'realtime_metrics',
      `campaign_${event.email_log_id}`,
      'email_intelligence'
    ]);

    // Emit custom events for UI updates
    window.dispatchEvent(new CustomEvent('emailAnalyticsUpdate', {
      detail: { event }
    }));
  }

  // Track email events
  async trackEmailEvent(
    messageId: string,
    eventType: EmailEvent['event_type'],
    metadata?: Partial<EmailEvent>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get email log
      const { data: emailLog } = await supabase
        .from('email_logs')
        .select('id')
        .eq('message_id', messageId)
        .single();

      if (!emailLog) {
        console.warn('Email log not found for message ID:', messageId);
        return;
      }

      // Create event record
      const event: Omit<EmailEvent, 'id'> = {
        email_log_id: emailLog.id,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ip_address: metadata?.ip_address,
        user_agent: metadata?.user_agent,
        location: metadata?.location,
        device_info: metadata?.device_info,
        link_url: metadata?.link_url,
        bounce_reason: metadata?.bounce_reason,
        complaint_type: metadata?.complaint_type,
        metadata: metadata?.metadata
      };

      await supabase
        .from('email_events')
        .insert(event);

      // Update email log status
      await supabase
        .from('email_logs')
        .update({
          status: eventType,
          [`${eventType}_at`]: new Date().toISOString()
        })
        .eq('id', emailLog.id);

      console.log(`Email event tracked: ${eventType} for message ${messageId}`);
    } catch (error) {
      console.error('Error tracking email event:', error);
    }
  }

  // Generate tracking pixel URL
  generateTrackingPixel(messageId: string): string {
    const trackingDomain = process.env.REACT_APP_TRACKING_DOMAIN || this.backendUrl;
    return `${trackingDomain}/track/open/${messageId}.png`;
  }

  // Generate click tracking URL
  generateClickTrackingUrl(messageId: string, originalUrl: string): string {
    const trackingDomain = process.env.REACT_APP_TRACKING_DOMAIN || this.backendUrl;
    const encodedUrl = encodeURIComponent(originalUrl);
    return `${trackingDomain}/track/click/${messageId}?url=${encodedUrl}`;
  }

  // Process email content for tracking
  async processEmailForTracking(
    messageId: string,
    htmlContent: string,
    enableOpenTracking = true,
    enableClickTracking = true
  ): Promise<{
    processedHtml: string;
    tracking: EmailTracking;
  }> {
    try {
      let processedHtml = htmlContent;
      const shortLinks: EmailTracking['short_links'] = [];

      // Add open tracking pixel
      if (enableOpenTracking) {
        const trackingPixel = this.generateTrackingPixel(messageId);
        processedHtml += `<img src="${trackingPixel}" width="1" height="1" style="display:none;" alt="">`;
      }

      // Process links for click tracking
      if (enableClickTracking) {
        const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>/gi;
        let match;
        
        while ((match = linkRegex.exec(htmlContent)) !== null) {
          const originalUrl = match[1];
          
          // Skip mailto, tel, and anchor links
          if (originalUrl.startsWith('mailto:') || 
              originalUrl.startsWith('tel:') || 
              originalUrl.startsWith('#')) {
            continue;
          }

          const clickTrackingUrl = this.generateClickTrackingUrl(messageId, originalUrl);
          processedHtml = processedHtml.replace(originalUrl, clickTrackingUrl);
          
          shortLinks.push({
            original_url: originalUrl,
            short_url: clickTrackingUrl,
            click_count: 0
          });
        }
      }

      const tracking: EmailTracking = {
        message_id: messageId,
        tracking_pixel_url: enableOpenTracking ? this.generateTrackingPixel(messageId) : '',
        click_tracking_enabled: enableClickTracking,
        open_tracking_enabled: enableOpenTracking,
        tracking_domain: process.env.REACT_APP_TRACKING_DOMAIN || this.backendUrl,
        short_links: shortLinks,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      // Save tracking data
      await supabase
        .from('email_tracking')
        .insert(tracking);

      return {
        processedHtml,
        tracking
      };
    } catch (error) {
      console.error('Error processing email for tracking:', error);
      return {
        processedHtml: htmlContent,
        tracking: {
          message_id: messageId,
          tracking_pixel_url: '',
          click_tracking_enabled: false,
          open_tracking_enabled: false,
          tracking_domain: '',
          short_links: [],
          created_at: new Date().toISOString(),
          expires_at: new Date().toISOString()
        }
      };
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics | null> {
    const cacheKey = `campaign_${campaignId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get email logs for campaign
      const { data: emailLogs } = await supabase
        .from('email_logs')
        .select(`
          *,
          email_events (*)
        `)
        .eq('campaign_id', campaignId);

      if (!emailLogs || emailLogs.length === 0) {
        return null;
      }

      // Calculate metrics
      const sent_count = emailLogs.length;
      const delivered_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'delivered')
      ).length;
      const opened_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'opened')
      ).length;
      const clicked_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'clicked')
      ).length;
      const bounced_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'bounced')
      ).length;
      const complained_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'complained')
      ).length;
      const unsubscribed_count = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'unsubscribed')
      ).length;

      // Calculate rates
      const delivery_rate = sent_count > 0 ? (delivered_count / sent_count) * 100 : 0;
      const open_rate = delivered_count > 0 ? (opened_count / delivered_count) * 100 : 0;
      const click_rate = opened_count > 0 ? (clicked_count / opened_count) * 100 : 0;
      const bounce_rate = sent_count > 0 ? (bounced_count / sent_count) * 100 : 0;
      const complaint_rate = delivered_count > 0 ? (complained_count / delivered_count) * 100 : 0;
      const unsubscribe_rate = delivered_count > 0 ? (unsubscribed_count / delivered_count) * 100 : 0;

      // Calculate engagement score (weighted formula)
      const engagement_score = Math.round(
        (open_rate * 0.3) + 
        (click_rate * 0.5) + 
        ((100 - bounce_rate) * 0.1) + 
        ((100 - complaint_rate) * 0.1)
      );

      // Analyze device data
      const deviceData = new Map<string, number>();
      emailLogs.forEach(log => {
        log.email_events.forEach((event: EmailEvent) => {
          if (event.device_info?.type) {
            deviceData.set(event.device_info.type, (deviceData.get(event.device_info.type) || 0) + 1);
          }
        });
      });

      const top_devices = Array.from(deviceData.entries()).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / sent_count) * 100)
      })).sort((a, b) => b.count - a.count).slice(0, 5);

      // Analyze geographical data
      const geoData = new Map<string, { opens: number; clicks: number }>();
      emailLogs.forEach(log => {
        log.email_events.forEach((event: EmailEvent) => {
          if (event.location?.country) {
            const current = geoData.get(event.location.country) || { opens: 0, clicks: 0 };
            if (event.event_type === 'opened') current.opens++;
            if (event.event_type === 'clicked') current.clicks++;
            geoData.set(event.location.country, current);
          }
        });
      });

      const geographical_data = Array.from(geoData.entries()).map(([country, data]) => ({
        country,
        opens: data.opens,
        clicks: data.clicks
      })).sort((a, b) => (b.opens + b.clicks) - (a.opens + a.clicks)).slice(0, 10);

      // Time-based analytics
      const hourly_opens = new Array(24).fill(0);
      const daily_opens = new Array(7).fill(0);
      const hourly_clicks = new Array(24).fill(0);
      const daily_clicks = new Array(7).fill(0);

      emailLogs.forEach(log => {
        log.email_events.forEach((event: EmailEvent) => {
          const eventDate = new Date(event.timestamp);
          const hour = eventDate.getHours();
          const day = eventDate.getDay();

          if (event.event_type === 'opened') {
            hourly_opens[hour]++;
            daily_opens[day]++;
          }
          if (event.event_type === 'clicked') {
            hourly_clicks[hour]++;
            daily_clicks[day]++;
          }
        });
      });

      const analytics: CampaignAnalytics = {
        campaign_id: campaignId,
        campaign_name: emailLogs[0]?.campaign_id || 'Unknown Campaign',
        sent_count,
        delivered_count,
        opened_count,
        clicked_count,
        bounced_count,
        complained_count,
        unsubscribed_count,
        delivery_rate: Math.round(delivery_rate * 100) / 100,
        open_rate: Math.round(open_rate * 100) / 100,
        click_rate: Math.round(click_rate * 100) / 100,
        bounce_rate: Math.round(bounce_rate * 100) / 100,
        complaint_rate: Math.round(complaint_rate * 100) / 100,
        unsubscribe_rate: Math.round(unsubscribe_rate * 100) / 100,
        engagement_score,
        top_devices,
        geographical_data,
        time_based_analytics: {
          hourly_opens,
          daily_opens,
          hourly_clicks,
          daily_clicks
        }
      };

      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting campaign analytics:', error);
      return null;
    }
  }

  // Get contact engagement profile
  async getContactEngagement(contactId: string): Promise<ContactEngagement | null> {
    const cacheKey = `contact_engagement_${contactId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get contact email logs
      const { data: emailLogs } = await supabase
        .from('email_logs')
        .select(`
          *,
          email_events (*)
        `)
        .eq('contact_id', contactId)
        .order('sent_at', { ascending: false });

      if (!emailLogs || emailLogs.length === 0) {
        return null;
      }

      const total_emails_sent = emailLogs.length;
      const total_emails_opened = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'opened')
      ).length;
      const total_emails_clicked = emailLogs.filter(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'clicked')
      ).length;

      // Find last interactions
      const openEvents = emailLogs.flatMap(log => 
        log.email_events.filter((e: EmailEvent) => e.event_type === 'opened')
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const clickEvents = emailLogs.flatMap(log => 
        log.email_events.filter((e: EmailEvent) => e.event_type === 'clicked')
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const last_opened = openEvents[0]?.timestamp || '';
      const last_clicked = clickEvents[0]?.timestamp || '';

      // Calculate engagement score
      const open_rate = total_emails_sent > 0 ? (total_emails_opened / total_emails_sent) : 0;
      const click_rate = total_emails_opened > 0 ? (total_emails_clicked / total_emails_opened) : 0;
      const engagement_score = Math.round((open_rate * 50) + (click_rate * 50));

      // Analyze engagement trend (last 10 emails vs previous 10)
      const recentLogs = emailLogs.slice(0, 10);
      const previousLogs = emailLogs.slice(10, 20);
      
      const recentEngagement = recentLogs.length > 0 ? 
        recentLogs.filter(log => log.email_events.some((e: EmailEvent) => e.event_type === 'opened')).length / recentLogs.length : 0;
      const previousEngagement = previousLogs.length > 0 ? 
        previousLogs.filter(log => log.email_events.some((e: EmailEvent) => e.event_type === 'opened')).length / previousLogs.length : 0;

      let engagement_trend: ContactEngagement['engagement_trend'] = 'stable';
      if (recentEngagement > previousEngagement * 1.1) engagement_trend = 'increasing';
      else if (recentEngagement < previousEngagement * 0.9) engagement_trend = 'decreasing';

      // Analyze preferred device and send time
      const deviceCounts = new Map<string, number>();
      const hourCounts = new Array(24).fill(0);

      openEvents.forEach(event => {
        if (event.device_info?.type) {
          deviceCounts.set(event.device_info.type, (deviceCounts.get(event.device_info.type) || 0) + 1);
        }
        const hour = new Date(event.timestamp).getHours();
        hourCounts[hour]++;
      });

      const device_preference = Array.from(deviceCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      const preferred_send_hour = hourCounts.indexOf(Math.max(...hourCounts));
      const preferred_send_time = preferred_send_hour !== -1 ? `${preferred_send_hour}:00` : undefined;

      // Get location from most recent event
      const location = openEvents[0]?.location ? 
        `${openEvents[0].location.city}, ${openEvents[0].location.country}` : undefined;

      // Check for complaints and unsubscribes
      const complaint_history = emailLogs.flatMap(log => 
        log.email_events.filter((e: EmailEvent) => e.event_type === 'complained')
      ).length;

      const unsubscribed = emailLogs.some(log => 
        log.email_events.some((e: EmailEvent) => e.event_type === 'unsubscribed')
      );

      const engagement: ContactEngagement = {
        contact_id: contactId,
        email: emailLogs[0]?.to_email || '',
        total_emails_sent,
        total_emails_opened,
        total_emails_clicked,
        last_opened,
        last_clicked,
        engagement_score,
        engagement_trend,
        preferred_send_time,
        device_preference,
        location,
        tags: [], // Would come from contact data
        segments: [], // Would come from contact data
        unsubscribed,
        complaint_history
      };

      this.setCache(cacheKey, engagement);
      return engagement;
    } catch (error) {
      console.error('Error getting contact engagement:', error);
      return null;
    }
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const cacheKey = 'realtime_metrics';
    const cached = this.getFromCache(cacheKey, 30000); // 30 second cache
    if (cached) return cached;

    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get recent email logs
      const { data: recentLogs } = await supabase
        .from('email_logs')
        .select(`
          *,
          email_events (*)
        `)
        .gte('sent_at', oneDayAgo.toISOString());

      const logsLastHour = recentLogs?.filter(log => 
        new Date(log.sent_at) >= oneHourAgo
      ) || [];

      const emails_sent_last_hour = logsLastHour.length;
      const emails_sent_last_24h = recentLogs?.length || 0;

      // Calculate current send rate (emails per minute in last 10 minutes)
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      const recentSends = recentLogs?.filter(log => 
        new Date(log.sent_at) >= tenMinutesAgo
      ).length || 0;
      const current_send_rate = recentSends / 10;

      // Calculate rates for last hour
      const deliveredLastHour = logsLastHour.filter(log =>
        log.email_events.some((e: EmailEvent) => e.event_type === 'delivered')
      ).length;
      const openedLastHour = logsLastHour.filter(log =>
        log.email_events.some((e: EmailEvent) => e.event_type === 'opened')
      ).length;
      const clickedLastHour = logsLastHour.filter(log =>
        log.email_events.some((e: EmailEvent) => e.event_type === 'clicked')
      ).length;
      const bouncedLastHour = logsLastHour.filter(log =>
        log.email_events.some((e: EmailEvent) => e.event_type === 'bounced')
      ).length;

      const delivery_rate_last_hour = emails_sent_last_hour > 0 ? 
        (deliveredLastHour / emails_sent_last_hour) * 100 : 0;
      const open_rate_last_hour = deliveredLastHour > 0 ? 
        (openedLastHour / deliveredLastHour) * 100 : 0;
      const click_rate_last_hour = openedLastHour > 0 ? 
        (clickedLastHour / openedLastHour) * 100 : 0;
      const bounce_rate_last_hour = emails_sent_last_hour > 0 ? 
        (bouncedLastHour / emails_sent_last_hour) * 100 : 0;

      // Get active campaigns count
      const { count: active_campaigns } = await supabase
        .from('email_logs')
        .select('campaign_id', { count: 'exact', head: true })
        .not('campaign_id', 'is', null)
        .gte('sent_at', oneDayAgo.toISOString());

      // System health assessment
      let system_health: RealTimeMetrics['system_health'] = 'healthy';
      const alerts: RealTimeMetrics['alerts'] = [];

      if (bounce_rate_last_hour > 5) {
        system_health = 'degraded';
        alerts.push({
          type: 'warning',
          message: `High bounce rate detected: ${bounce_rate_last_hour.toFixed(1)}%`,
          timestamp: now.toISOString()
        });
      }

      if (delivery_rate_last_hour < 95) {
        system_health = 'critical';
        alerts.push({
          type: 'error',
          message: `Low delivery rate: ${delivery_rate_last_hour.toFixed(1)}%`,
          timestamp: now.toISOString()
        });
      }

      if (current_send_rate > 100) {
        alerts.push({
          type: 'warning',
          message: 'High send rate may trigger rate limiting',
          timestamp: now.toISOString()
        });
      }

      const metrics: RealTimeMetrics = {
        timestamp: now.toISOString(),
        emails_sent_last_hour,
        emails_sent_last_24h,
        current_send_rate: Math.round(current_send_rate * 100) / 100,
        delivery_rate_last_hour: Math.round(delivery_rate_last_hour * 100) / 100,
        open_rate_last_hour: Math.round(open_rate_last_hour * 100) / 100,
        click_rate_last_hour: Math.round(click_rate_last_hour * 100) / 100,
        bounce_rate_last_hour: Math.round(bounce_rate_last_hour * 100) / 100,
        active_campaigns: active_campaigns || 0,
        queue_size: 0, // Would come from queue monitoring
        system_health,
        alerts
      };

      this.setCache(cacheKey, metrics, 30000);
      return metrics;
    } catch (error) {
      console.error('Error getting real-time metrics:', error);
      return {
        timestamp: new Date().toISOString(),
        emails_sent_last_hour: 0,
        emails_sent_last_24h: 0,
        current_send_rate: 0,
        delivery_rate_last_hour: 0,
        open_rate_last_hour: 0,
        click_rate_last_hour: 0,
        bounce_rate_last_hour: 0,
        active_campaigns: 0,
        queue_size: 0,
        system_health: 'critical',
        alerts: [{
          type: 'error',
          message: 'Failed to fetch real-time metrics',
          timestamp: new Date().toISOString()
        }]
      };
    }
  }

  // A/B testing functionality
  async createABTest(
    testName: string,
    variantA: { name: string; subject?: string; content?: string },
    variantB: { name: string; subject?: string; content?: string },
    testPercentage = 50
  ): Promise<{ success: boolean; testId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const testData = {
        test_name: testName,
        variant_a: variantA,
        variant_b: variantB,
        test_percentage: testPercentage,
        created_by: user.id,
        status: 'active',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ab_tests')
        .insert(testData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        testId: data.id
      };
    } catch (error) {
      console.error('Error creating A/B test:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create A/B test'
      };
    }
  }

  async getABTestResults(testId: string): Promise<A_BTestResult | null> {
    try {
      const { data: test } = await supabase
        .from('ab_tests')
        .select(`
          *,
          email_logs (
            *,
            email_events (*)
          )
        `)
        .eq('id', testId)
        .single();

      if (!test) return null;

      // Separate emails by variant
      const variantAEmails = test.email_logs.filter((log: any) => 
        log.ab_test_variant === 'a'
      );
      const variantBEmails = test.email_logs.filter((log: any) => 
        log.ab_test_variant === 'b'
      );

      // Calculate metrics for each variant
      const calculateVariantMetrics = (emails: any[]) => {
        const sent = emails.length;
        const opened = emails.filter(log =>
          log.email_events.some((e: EmailEvent) => e.event_type === 'opened')
        ).length;
        const clicked = emails.filter(log =>
          log.email_events.some((e: EmailEvent) => e.event_type === 'clicked')
        ).length;

        return {
          sent,
          opened,
          clicked,
          open_rate: sent > 0 ? (opened / sent) * 100 : 0,
          click_rate: opened > 0 ? (clicked / opened) * 100 : 0
        };
      };

      const variantAMetrics = calculateVariantMetrics(variantAEmails);
      const variantBMetrics = calculateVariantMetrics(variantBEmails);

      // Calculate statistical significance (simplified)
      const totalSent = variantAMetrics.sent + variantBMetrics.sent;
      const statistical_significance = totalSent > 100 ? 95 : totalSent > 50 ? 90 : 80;
      const confidence_level = statistical_significance;

      // Determine winner
      let winner: A_BTestResult['winner'] = 'inconclusive';
      if (statistical_significance >= 95) {
        if (variantAMetrics.open_rate > variantBMetrics.open_rate) {
          winner = 'a';
        } else if (variantBMetrics.open_rate > variantAMetrics.open_rate) {
          winner = 'b';
        }
      }

      const testDuration = new Date().getTime() - new Date(test.created_at).getTime();
      const test_duration_hours = Math.round(testDuration / (1000 * 60 * 60));

      let recommendation = 'Continue testing for more statistical significance.';
      if (winner === 'a') {
        recommendation = `Variant A (${test.variant_a.name}) performs better. Consider using it for the full campaign.`;
      } else if (winner === 'b') {
        recommendation = `Variant B (${test.variant_b.name}) performs better. Consider using it for the full campaign.`;
      }

      return {
        test_id: testId,
        test_name: test.test_name,
        variant_a: {
          name: test.variant_a.name,
          ...variantAMetrics
        },
        variant_b: {
          name: test.variant_b.name,
          ...variantBMetrics
        },
        statistical_significance,
        confidence_level,
        winner,
        test_duration_hours,
        recommendation
      };
    } catch (error) {
      console.error('Error getting A/B test results:', error);
      return null;
    }
  }

  // Cache management
  private getFromCache(key: string, customExpiry?: number): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const expiry = customExpiry || this.cacheExpiry;
    if (Date.now() - cached.timestamp > expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, customExpiry?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: customExpiry || this.cacheExpiry
    });

    // Clean old cache entries
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries());
      const toDelete = entries
        .filter(([_, value]) => Date.now() - value.timestamp > value.expiry)
        .map(([key]) => key);
      
      toDelete.forEach(key => this.cache.delete(key));
    }
  }

  private invalidateCache(keys: string[]): void {
    keys.forEach(key => this.cache.delete(key));
  }

  // Email intelligence and recommendations
  async getEmailIntelligence(userId?: string): Promise<EmailIntelligence> {
    const cacheKey = `email_intelligence_${userId || 'global'}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // This would involve complex analytics queries
      // For now, returning a simplified structure
      const intelligence: EmailIntelligence = {
        subject_line_performance: [],
        send_time_optimization: {
          best_hour: 10,
          best_day: 'Tuesday',
          timezone_analysis: []
        },
        content_analysis: {
          top_performing_keywords: [],
          cta_performance: [],
          content_length_analysis: {
            optimal_length: 150,
            performance_by_length: []
          }
        },
        deliverability_insights: {
          reputation_score: 85,
          spam_score: 2.1,
          domain_reputation: {},
          authentication_status: {
            spf: true,
            dkim: true,
            dmarc: false
          },
          recommendations: [
            'Implement DMARC policy for better deliverability',
            'Monitor bounce rates closely',
            'Consider warming up new sending domains'
          ]
        }
      };

      this.setCache(cacheKey, intelligence);
      return intelligence;
    } catch (error) {
      console.error('Error getting email intelligence:', error);
      throw error;
    }
  }

  // Cleanup method
  destroy(): void {
    this.realTimeSubscriptions.forEach(unsubscribe => unsubscribe());
    this.realTimeSubscriptions.clear();
    this.cache.clear();
    console.log('Email analytics service destroyed');
  }
}

export const emailAnalyticsService = new EmailAnalyticsService();
export type { 
  EmailEvent, 
  EmailTracking, 
  CampaignAnalytics, 
  ContactEngagement, 
  RealTimeMetrics,
  A_BTestResult,
  EmailIntelligence
};