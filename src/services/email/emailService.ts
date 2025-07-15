import { supabase } from '../supabase/supabase';

interface EmailAccount {
  email: string;
  password: string;
  dailyLimit: number;
  sentToday: number;
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
  private gmailCredentials: { email: string; password: string }[] = [
    { 
      email: 'jgolden@bowerycreativeagency.com', 
      password: 'udyt jdfa huqe bicx' 
    },
    { 
      email: 'jasonwilliamgolden@gmail.com', 
      password: 'smom nvay ojrr xnnj' 
    }
  ];

  constructor() {
    this.initializeAccounts();
  }

  private initializeAccounts() {
    this.accounts = this.gmailCredentials.map(cred => ({
      email: cred.email,
      password: cred.password,
      dailyLimit: cred.email.includes('bowerycreativeagency.com') ? 2000 : 500,
      sentToday: 0
    }));

    this.initialized = true;
    console.log(`Email service initialized with ${this.accounts.length} accounts`);
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

      // Call the Render backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          ...options,
          userId: user?.id
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

  async syncGmailEmails(userId: string): Promise<void> {
    // This will be implemented to sync emails from Gmail
    // For now, it's a placeholder
    console.log('Gmail sync not yet implemented');
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