// Email Service for CRM
import { supabase } from '../supabase/supabase';
import { gmailSyncService } from './gmailSyncService';

interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'smtp';
  dailyLimit: number;
  sentToday: number;
  isActive: boolean;
  settings?: any;
}

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: any[];
  campaignId?: string;
  contactId?: string;
}

interface EmailLog {
  message_id?: string;
  from_email: string;
  to_email: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  sent_at: string;
  campaign_id?: string;
  contact_id?: string;
  user_id?: string;
}

class EmailService {
  private accounts: EmailAccount[] = [];
  private currentAccountIndex = 0;
  private initialized = false;

  constructor() {
    this.initializeAccounts();
  }

  private async initializeAccounts() {
    try {
      // Get email accounts from database instead of hardcoded credentials
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: accounts } = await supabase
          .from('email_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (accounts && accounts.length > 0) {
          this.accounts = accounts.map(account => ({
            id: account.id,
            email: account.email,
            provider: account.provider,
            dailyLimit: account.daily_limit || 500,
            sentToday: 0,
            isActive: account.is_active,
            settings: account.settings
          }));
        }
      }

      this.initialized = true;
      console.log(`Email service initialized with ${this.accounts.length} accounts`);
    } catch (error) {
      console.error('Failed to initialize email accounts:', error);
      this.initialized = true; // Still mark as initialized to prevent infinite loops
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

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.initialized) {
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if Gmail is authenticated and available
      if (gmailSyncService.isGmailAuthenticated()) {
        try {
          // Use Gmail API directly
          const messageId = await gmailSyncService.sendEmail(
            options.to,
            options.subject,
            options.html || options.text || '',
            !!options.html
          );

          return {
            success: true,
            messageId
          };
        } catch (gmailError) {
          console.error('Gmail API send failed, falling back to backend:', gmailError);
          // Fall back to backend if Gmail API fails
        }
      }

      // Fallback to backend API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          ...options,
          userId: user.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      console.error('Email send error:', error);
      
      await this.logEmail({
        from_email: options.from || 'system',
        to_email: options.to,
        subject: options.subject,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        sent_at: new Date().toISOString()
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  private async logEmail(log: EmailLog): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('email_logs')
        .insert({
          ...log,
          user_id: user?.id
        });

      if (error) {
        console.error('Error logging email:', error);
      }
    } catch (error) {
      console.error('Error in logEmail:', error);
    }
  }

  async getEmailStats(userId?: string): Promise<{
    sentToday: number;
    totalSent: number;
    failedToday: number;
    accountLimits: { email: string; used: number; limit: number }[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = supabase
      .from('email_logs')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: logs } = await query;

    const todayLogs = logs?.filter(log => 
      new Date(log.sent_at) >= today
    ) || [];

    const sentToday = todayLogs.filter(log => log.status === 'sent').length;
    const failedToday = todayLogs.filter(log => log.status === 'failed').length;
    const totalSent = logs?.filter(log => log.status === 'sent').length || 0;

    const accountLimits = this.accounts.map(account => ({
      email: account.email,
      used: account.sentToday,
      limit: account.dailyLimit
    }));

    return {
      sentToday,
      totalSent,
      failedToday,
      accountLimits
    };
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

  // Reset daily counts (should be called by a cron job or scheduler)
  resetDailyCounts(): void {
    this.accounts.forEach(account => {
      account.sentToday = 0;
    });
    console.log('Daily email counts reset');
  }
}

export const emailService = new EmailService();