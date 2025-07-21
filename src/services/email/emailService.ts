// Enhanced Email Service for CRM with Backend Integration
import { supabase } from '../supabase/supabase';
import { gmailSyncService } from './gmailSyncService';
import axios, { AxiosResponse } from 'axios';

// Types and Interfaces
interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'smtp' | 'backend';
  dailyLimit: number;
  sentToday: number;
  isActive: boolean;
  settings?: any;
  priority?: number;
  lastUsed?: string;
}

interface EmailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  campaignId?: string;
  contactId?: string;
  priority?: 'low' | 'normal' | 'high';
  scheduled?: Date;
  trackOpens?: boolean;
  trackClicks?: boolean;
  templateId?: string;
  templateData?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
  encoding?: string;
  size?: number;
}

interface EmailLog {
  message_id?: string;
  from_email: string;
  to_email: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  subject: string;
  status: 'sent' | 'failed' | 'pending' | 'scheduled' | 'delivered' | 'opened' | 'clicked';
  error?: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  campaign_id?: string;
  contact_id?: string;
  user_id?: string;
  provider_used?: string;
  tracking_data?: Record<string, any>;
  bounce_reason?: string;
  spam_score?: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content?: string;
  text_content?: string;
  variables: string[];
  category: string;
  tags: string[];
  is_active: boolean;
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  estimatedDelivery?: Date;
  trackingId?: string;
  quota?: {
    used: number;
    limit: number;
    remaining: number;
  };
}

interface EmailStats {
  sentToday: number;
  totalSent: number;
  failedToday: number;
  deliveredToday: number;
  openedToday: number;
  clickedToday: number;
  bounceRate: number;
  openRate: number;
  clickRate: number;
  accountLimits: AccountLimitInfo[];
  trends: {
    sent: number[];
    delivered: number[];
    opened: number[];
    clicked: number[];
    period: string[];
  };
}

interface AccountLimitInfo {
  email: string;
  provider: string;
  used: number;
  limit: number;
  remaining: number;
  resetTime: string;
  isHealthy: boolean;
}

interface BackendEmailRequest {
  emails: EmailOptions[];
  options?: {
    useMultiAccount?: boolean;
    failFast?: boolean;
    maxRetries?: number;
    retryDelay?: number;
  };
}

interface BackendEmailResponse {
  success: boolean;
  results: SendEmailResponse[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    accounts_used: string[];
  };
  error?: string;
}

class EmailService {
  private accounts: EmailAccount[] = [];
  private currentAccountIndex = 0;
  private initialized = false;
  private backendUrl: string;
  private cache = new Map<string, any>();
  private isOnline = navigator.onLine;
  private retryQueue: EmailOptions[] = [];
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
    this.initializeAccounts();
    this.setupEventListeners();
    this.setupRetryProcessor();
  }

  private setupEventListeners(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processRetryQueue();
      console.log('Email service: Back online, processing retry queue');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Email service: Offline mode activated');
    });
  }

  private setupRetryProcessor(): void {
    // Process retry queue every 30 seconds
    setInterval(() => {
      if (this.isOnline && this.retryQueue.length > 0) {
        this.processRetryQueue();
      }
    }, 30000);
  }

  private async processRetryQueue(): Promise<void> {
    if (!this.isOnline || this.retryQueue.length === 0) return;

    const emailsToRetry = [...this.retryQueue];
    this.retryQueue = [];

    for (const email of emailsToRetry) {
      try {
        await this.sendEmail(email);
        console.log(`Retry successful for email: ${email.subject}`);
      } catch (error) {
        console.error(`Retry failed for email: ${email.subject}`, error);
        // Add back to queue if under max retries
        if ((email.metadata?.retryCount || 0) < this.maxRetries) {
          email.metadata = { 
            ...email.metadata, 
            retryCount: (email.metadata?.retryCount || 0) + 1 
          };
          this.retryQueue.push(email);
        }
      }
    }
  }

  private async initializeAccounts(): Promise<void> {
    try {
      // Get email accounts from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: accounts } = await supabase
          .from('email_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (accounts && accounts.length > 0) {
          this.accounts = accounts.map(account => ({
            id: account.id,
            email: account.email,
            provider: account.provider,
            dailyLimit: account.daily_limit || 500,
            sentToday: account.sent_today || 0,
            isActive: account.is_active,
            settings: account.settings,
            priority: account.priority || 1,
            lastUsed: account.last_used
          }));
        }

        // Add backend orchestration as a virtual account if available
        if (await this.isBackendAvailable()) {
          this.accounts.push({
            id: 'backend-orchestration',
            email: 'system@backend',
            provider: 'backend',
            dailyLimit: 10000,
            sentToday: 0,
            isActive: true,
            priority: 10, // Highest priority
            settings: { orchestration: true }
          });
        }
      }

      this.initialized = true;
      console.log(`Email service initialized with ${this.accounts.length} accounts`);
    } catch (error) {
      console.error('Failed to initialize email accounts:', error);
      this.initialized = true; // Still mark as initialized to prevent infinite loops
    }
  }

  private async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.backendUrl}/api/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.warn('Backend email service not available:', error);
      return false;
    }
  }

  private getNextAvailableAccount(): EmailAccount | null {
    for (let i = 0; i < this.accounts.length; i++) {
      const index = (this.currentAccountIndex + i) % this.accounts.length;
      const account = this.accounts[index];
      
      if (account.sentToday < account.dailyLimit) {
        this.currentAccountIndex = (index + 1) % this.accounts.length;
        return account;
      }
    }
    
    return null;
  }

  async sendEmail(options: EmailOptions): Promise<SendEmailResponse> {
    if (!this.initialized) {
      return { success: false, error: 'Email service not initialized' };
    }

    // Handle offline mode
    if (!this.isOnline) {
      this.retryQueue.push(options);
      console.log('Email queued for retry when online');
      return { 
        success: false, 
        error: 'Offline - email queued for retry',
        provider: 'offline-queue'
      };
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Convert single recipients to arrays for consistency
      const recipients = this.normalizeRecipients(options);
      
      // Try backend orchestration first if available (highest priority)
      const backendAccount = this.accounts.find(acc => acc.provider === 'backend');
      if (backendAccount && backendAccount.isActive) {
        try {
          const backendResult = await this.sendViaBackend(options, user.id);
          if (backendResult.success) {
            await this.logEmailSuccess(options, backendResult, user.id, 'backend');
            return backendResult;
          }
        } catch (backendError) {
          console.warn('Backend email failed, falling back to other providers:', backendError);
        }
      }

      // Try Gmail API if authenticated
      if (gmailSyncService.isGmailAuthenticated()) {
        try {
          const messageId = await gmailSyncService.sendEmail(
            Array.isArray(options.to) ? options.to[0] : options.to,
            options.subject,
            options.html || options.text || '',
            !!options.html
          );

          const gmailResult: SendEmailResponse = {
            success: true,
            messageId,
            provider: 'gmail',
            estimatedDelivery: new Date(Date.now() + 60000) // 1 minute
          };

          await this.logEmailSuccess(options, gmailResult, user.id, 'gmail');
          return gmailResult;
        } catch (gmailError) {
          console.error('Gmail API send failed:', gmailError);
        }
      }

      // Try other configured email accounts
      const availableAccount = this.getNextAvailableAccount();
      if (availableAccount && availableAccount.provider !== 'backend') {
        try {
          const result = await this.sendViaProvider(options, availableAccount, user.id);
          if (result.success) {
            await this.logEmailSuccess(options, result, user.id, availableAccount.provider);
            return result;
          }
        } catch (providerError) {
          console.error(`Provider ${availableAccount.provider} failed:`, providerError);
        }
      }

      // All methods failed
      const error = 'All email providers failed';
      await this.logEmailFailure(options, error, user.id);
      return { success: false, error };

    } catch (error) {
      console.error('Email send error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.logEmailFailure(options, errorMessage, user.id);
      }

      return { success: false, error: errorMessage };
    }
  }

  private normalizeRecipients(options: EmailOptions): {
    to: string[];
    cc: string[];
    bcc: string[];
  } {
    return {
      to: Array.isArray(options.to) ? options.to : [options.to],
      cc: Array.isArray(options.cc) ? options.cc : options.cc ? [options.cc] : [],
      bcc: Array.isArray(options.bcc) ? options.bcc : options.bcc ? [options.bcc] : []
    };
  }

  private async sendViaBackend(options: EmailOptions, userId: string): Promise<SendEmailResponse> {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const requestPayload: BackendEmailRequest = {
      emails: [options],
      options: {
        useMultiAccount: true,
        failFast: false,
        maxRetries: 2,
        retryDelay: this.retryDelay
      }
    };

    const response = await axios.post(
      `${this.backendUrl}/api/crm/email/send-orchestrated`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': userId
        },
        timeout: 30000 // 30 seconds
      }
    );

    const result: BackendEmailResponse = response.data;
    
    if (!result.success || result.results.length === 0) {
      throw new Error(result.error || 'Backend email orchestration failed');
    }

    return {
      ...result.results[0],
      provider: 'backend-orchestrated',
      quota: {
        used: result.summary.successful,
        limit: 10000,
        remaining: 10000 - result.summary.successful
      }
    };
  }

  private async sendViaProvider(
    options: EmailOptions, 
    account: EmailAccount, 
    userId: string
  ): Promise<SendEmailResponse> {
    // This would integrate with specific providers like SendGrid, Mailgun, etc.
    // For now, fallback to the basic backend endpoint
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await axios.post(
      `${this.backendUrl}/api/crm/email/send`,
      {
        ...options,
        userId,
        providerId: account.id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 15000
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Provider send failed');
    }

    return {
      success: true,
      messageId: response.data.messageId,
      provider: account.provider,
      estimatedDelivery: new Date(Date.now() + 120000) // 2 minutes
    };
  }

  private async logEmailSuccess(
    options: EmailOptions, 
    result: SendEmailResponse, 
    userId: string, 
    provider: string
  ): Promise<void> {
    const recipients = this.normalizeRecipients(options);
    
    const log: EmailLog = {
      message_id: result.messageId,
      from_email: options.from || 'system',
      to_email: recipients.to[0],
      cc_emails: recipients.cc.length > 0 ? recipients.cc : undefined,
      bcc_emails: recipients.bcc.length > 0 ? recipients.bcc : undefined,
      subject: options.subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      campaign_id: options.campaignId,
      contact_id: options.contactId,
      user_id: userId,
      provider_used: provider,
      tracking_data: {
        trackOpens: options.trackOpens,
        trackClicks: options.trackClicks,
        priority: options.priority,
        scheduled: options.scheduled,
        tags: options.tags,
        metadata: options.metadata
      }
    };

    await this.logEmail(log);
  }

  private async logEmailFailure(
    options: EmailOptions, 
    error: string, 
    userId: string
  ): Promise<void> {
    const recipients = this.normalizeRecipients(options);
    
    const log: EmailLog = {
      from_email: options.from || 'system',
      to_email: recipients.to[0],
      cc_emails: recipients.cc.length > 0 ? recipients.cc : undefined,
      bcc_emails: recipients.bcc.length > 0 ? recipients.bcc : undefined,
      subject: options.subject,
      status: 'failed',
      error,
      sent_at: new Date().toISOString(),
      campaign_id: options.campaignId,
      contact_id: options.contactId,
      user_id: userId
    };

    await this.logEmail(log);
  }

  private async logEmail(log: EmailLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('email_logs')
        .insert(log);

      if (error) {
        console.error('Error logging email:', error);
      }
    } catch (error) {
      console.error('Error in logEmail:', error);
    }
  }

  async getEmailStats(userId?: string): Promise<EmailStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let query = supabase
      .from('email_logs')
      .select('*')
      .gte('sent_at', sevenDaysAgo.toISOString());

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: logs } = await query;

    const todayLogs = logs?.filter(log => 
      new Date(log.sent_at) >= today
    ) || [];

    const sentToday = todayLogs.filter(log => log.status === 'sent').length;
    const failedToday = todayLogs.filter(log => log.status === 'failed').length;
    const deliveredToday = todayLogs.filter(log => log.status === 'delivered').length;
    const openedToday = todayLogs.filter(log => log.status === 'opened').length;
    const clickedToday = todayLogs.filter(log => log.status === 'clicked').length;
    
    const totalSent = logs?.filter(log => log.status === 'sent').length || 0;
    const totalDelivered = logs?.filter(log => log.status === 'delivered').length || 0;
    const totalOpened = logs?.filter(log => log.status === 'opened').length || 0;
    const totalClicked = logs?.filter(log => log.status === 'clicked').length || 0;
    const totalBounced = logs?.filter(log => log.bounce_reason).length || 0;

    // Calculate rates
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    // Generate trend data for last 7 days
    const trends = this.generateTrendData(logs || [], 7);

    const accountLimits: AccountLimitInfo[] = this.accounts.map(account => {
      const accountSentToday = todayLogs.filter(log => 
        log.provider_used === account.provider
      ).length;
      
      return {
        email: account.email,
        provider: account.provider,
        used: accountSentToday,
        limit: account.dailyLimit,
        remaining: account.dailyLimit - accountSentToday,
        resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isHealthy: accountSentToday < account.dailyLimit * 0.9
      };
    });

    return {
      sentToday,
      totalSent,
      failedToday,
      deliveredToday,
      openedToday,
      clickedToday,
      bounceRate,
      openRate,
      clickRate,
      accountLimits,
      trends
    };
  }

  private generateTrendData(logs: EmailLog[], days: number): EmailStats['trends'] {
    const trends = {
      sent: [] as number[],
      delivered: [] as number[],
      opened: [] as number[],
      clicked: [] as number[],
      period: [] as string[]
    };

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.sent_at);
        return logDate >= date && logDate < nextDate;
      });

      trends.sent.push(dayLogs.filter(log => log.status === 'sent').length);
      trends.delivered.push(dayLogs.filter(log => log.status === 'delivered').length);
      trends.opened.push(dayLogs.filter(log => log.status === 'opened').length);
      trends.clicked.push(dayLogs.filter(log => log.status === 'clicked').length);
      trends.period.push(date.toISOString().split('T')[0]);
    }

    return trends;
  }

  async syncGmailEmails(userId: string): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    try {
      if (!gmailSyncService.isGmailAuthenticated()) {
        return { success: false, syncedCount: 0, error: 'Gmail not authenticated' };
      }

      const result = await gmailSyncService.syncAllAccounts();
      return result;
    } catch (error) {
      console.error('Gmail sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add a Gmail account to the user's email accounts
   */
  async addGmailAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!gmailSyncService.isGmailAuthenticated()) {
        return { success: false, error: 'Gmail not authenticated' };
      }

      const profile = await gmailSyncService.getGmailProfile();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if account already exists
      const { data: existing } = await supabase
        .from('email_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('email', profile.emailAddress)
        .single();

      if (existing) {
        return { success: false, error: 'Account already exists' };
      }

      // Add account to database
      const { error } = await supabase
        .from('email_accounts')
        .insert({
          user_id: user.id,
          email: profile.emailAddress,
          provider: 'gmail',
          daily_limit: 500,
          is_active: true,
          settings: {
            messagesTotal: profile.messagesTotal,
            threadsTotal: profile.threadsTotal
          }
        });

      if (error) {
        throw error;
      }

      // Refresh accounts
      await this.initializeAccounts();

      return { success: true };
    } catch (error) {
      console.error('Error adding Gmail account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add account'
      };
    }
  }

  /**
   * Get Gmail authentication status
   */
  isGmailAuthenticated(): boolean {
    return gmailSyncService.isGmailAuthenticated();
  }

  /**
   * Initialize Gmail API
   */
  async initializeGmail(): Promise<boolean> {
    return await gmailSyncService.initializeGmailApi();
  }

  // Enhanced template management
  async getEmailTemplates(userId?: string): Promise<EmailTemplate[]> {
    try {
      let query = supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching email templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEmailTemplates:', error);
      return [];
    }
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          ...template,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error creating email template:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create template'
      };
    }
  }

  // Bulk email sending with backend orchestration
  async sendBulkEmails(emails: EmailOptions[]): Promise<{
    success: boolean;
    results: SendEmailResponse[];
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
    error?: string;
  }> {
    if (!this.isOnline) {
      // Queue all emails for retry
      this.retryQueue.push(...emails);
      return {
        success: false,
        results: [],
        summary: { total: emails.length, successful: 0, failed: emails.length },
        error: 'Offline - emails queued for retry'
      };
    }

    // Try backend orchestration for bulk sending
    const backendAccount = this.accounts.find(acc => acc.provider === 'backend');
    if (backendAccount && backendAccount.isActive) {
      try {
        return await this.sendBulkViaBackend(emails);
      } catch (error) {
        console.warn('Backend bulk send failed, falling back to individual sends:', error);
      }
    }

    // Fallback to individual sends
    const results: SendEmailResponse[] = [];
    let successful = 0;

    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push(result);
        if (result.success) successful++;
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      success: successful > 0,
      results,
      summary: {
        total: emails.length,
        successful,
        failed: emails.length - successful
      }
    };
  }

  private async sendBulkViaBackend(emails: EmailOptions[]): Promise<{
    success: boolean;
    results: SendEmailResponse[];
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
    error?: string;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const requestPayload: BackendEmailRequest = {
      emails,
      options: {
        useMultiAccount: true,
        failFast: false,
        maxRetries: 2,
        retryDelay: this.retryDelay
      }
    };

    const response = await axios.post(
      `${this.backendUrl}/api/crm/email/send-bulk`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id
        },
        timeout: 60000 // 1 minute for bulk operations
      }
    );

    const result: BackendEmailResponse = response.data;
    
    return {
      success: result.success,
      results: result.results,
      summary: result.summary,
      error: result.error
    };
  }

  // Account health monitoring
  async getAccountHealth(): Promise<AccountLimitInfo[]> {
    const stats = await this.getEmailStats();
    return stats.accountLimits;
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    console.log('Email service cache cleared');
  }

  // Get retry queue status
  getRetryQueueStatus(): {
    count: number;
    oldestItem?: Date;
    isProcessing: boolean;
  } {
    const oldestItem = this.retryQueue.length > 0 
      ? new Date(this.retryQueue[0].metadata?.queuedAt || Date.now())
      : undefined;

    return {
      count: this.retryQueue.length,
      oldestItem,
      isProcessing: this.isOnline && this.retryQueue.length > 0
    };
  }

  // Force retry queue processing
  async forceRetryProcessing(): Promise<void> {
    if (this.isOnline) {
      await this.processRetryQueue();
    }
  }

  // Reset daily counts (should be called by a cron job or scheduler)
  resetDailyCounts(): void {
    this.accounts.forEach(account => {
      account.sentToday = 0;
    });
    console.log('Daily email counts reset');
  }

  // Cleanup method
  destroy(): void {
    window.removeEventListener('online', this.setupEventListeners);
    window.removeEventListener('offline', this.setupEventListeners);
    this.cache.clear();
    this.retryQueue = [];
    console.log('Email service destroyed');
  }
}

export const emailService = new EmailService();