import { supabase } from '../supabase/supabase';
import gmailApiService, { ParsedEmailMessage } from '../gmail/gmailApiService';

interface SyncResult {
  success: boolean;
  syncedCount: number;
  error?: string;
}

interface EmailLog {
  id?: string;
  user_id: string;
  message_id: string;
  thread_id: string;
  subject: string;
  from_email: string;
  to_email: string;
  cc_email?: string;
  bcc_email?: string;
  body: string;
  is_html: boolean;
  sent_at: string;
  received_at: string;
  status: 'sent' | 'received' | 'failed' | 'pending';
  opened_at?: string;
  clicked_at?: string;
  provider: 'gmail' | 'outlook' | 'smtp';
  is_read: boolean;
  is_important: boolean;
  is_starred: boolean;
  labels?: string[];
  attachments?: any[];
}

class GmailSyncService {
  private syncInterval: NodeJS.Timer | null = null;
  private lastSyncTime: Date | null = null;
  private rateLimiter = {
    requests: 0,
    resetTime: Date.now() + 60000, // Reset every minute
    maxRequests: 250 // Gmail API quota limit per minute
  };

  async startAutoSync(intervalMinutes: number = 15): Promise<void> {
    // Stop any existing sync
    this.stopAutoSync();

    // Check if Gmail API is ready
    if (!gmailApiService.isReady()) {
      throw new Error('Gmail API not initialized. Please authenticate first.');
    }

    // Start new sync interval
    this.syncInterval = setInterval(() => {
      this.syncAllAccounts();
    }, intervalMinutes * 60 * 1000);

    // Do an initial sync
    await this.syncAllAccounts();
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    if (now > this.rateLimiter.resetTime) {
      this.rateLimiter.requests = 0;
      this.rateLimiter.resetTime = now + 60000;
    }
    
    if (this.rateLimiter.requests >= this.rateLimiter.maxRequests) {
      return false;
    }
    
    this.rateLimiter.requests++;
    return true;
  }

  private async saveEmailToDatabase(email: ParsedEmailMessage, userId: string): Promise<void> {
    const emailLog: EmailLog = {
      user_id: userId,
      message_id: email.id,
      thread_id: email.threadId,
      subject: email.subject,
      from_email: email.from,
      to_email: email.to,
      cc_email: email.cc,
      bcc_email: email.bcc,
      body: email.body,
      is_html: email.isHtml,
      sent_at: new Date(email.date).toISOString(),
      received_at: new Date(email.date).toISOString(),
      status: 'received',
      provider: 'gmail',
      is_read: email.isRead,
      is_important: email.isImportant,
      is_starred: email.isStarred,
      labels: email.labelIds,
      attachments: email.attachments
    };

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('email_logs')
      .select('id')
      .eq('message_id', email.id)
      .eq('user_id', userId)
      .single();

    if (existingEmail) {
      // Update existing email
      await supabase
        .from('email_logs')
        .update({
          is_read: email.isRead,
          is_important: email.isImportant,
          is_starred: email.isStarred,
          labels: email.labelIds
        })
        .eq('id', existingEmail.id);
    } else {
      // Insert new email
      await supabase
        .from('email_logs')
        .insert([emailLog]);
    }
  }

  async syncAllAccounts(): Promise<SyncResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user - Gmail sync running in demo mode');
        // In demo mode, we can still fetch emails but won't save to database
        if (!gmailApiService.isReady()) {
          return { success: false, syncedCount: 0, error: 'Gmail API not initialized' };
        }
        
        // Get recent messages without saving
        const messages = await gmailApiService.getRecentMessages();
        console.log('Demo mode: Retrieved', messages.length, 'emails');
        return {
          success: true,
          syncedCount: messages.length
        };
      }

      if (!gmailApiService.isReady()) {
        return { success: false, syncedCount: 0, error: 'Gmail API not initialized' };
      }

      if (!this.checkRateLimit()) {
        return { success: false, syncedCount: 0, error: 'Rate limit exceeded. Please wait.' };
      }

      // Get recent messages from Gmail
      const messages = await gmailApiService.getRecentMessages();
      
      let syncedCount = 0;
      const batchSize = 10; // Process emails in batches to avoid overwhelming the database
      
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        
        for (const message of batch) {
          try {
            await this.saveEmailToDatabase(message, user.id);
            syncedCount++;
          } catch (error) {
            console.error('Error saving email:', error);
            // Continue with other emails
          }
        }
        
        // Small delay between batches
        if (i + batchSize < messages.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      this.lastSyncTime = new Date();

      return {
        success: true,
        syncedCount
      };

    } catch (error) {
      console.error('Gmail sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async syncAccount(accountEmail: string): Promise<SyncResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, syncedCount: 0, error: 'User not authenticated' };
      }

      if (!gmailApiService.isReady()) {
        return { success: false, syncedCount: 0, error: 'Gmail API not initialized' };
      }

      if (!this.checkRateLimit()) {
        return { success: false, syncedCount: 0, error: 'Rate limit exceeded. Please wait.' };
      }

      // Get user profile to verify the account
      const profile = await gmailApiService.getUserProfile();
      if (profile.emailAddress !== accountEmail) {
        return { success: false, syncedCount: 0, error: 'Account email mismatch' };
      }

      // Get recent messages for this specific account
      const messages = await gmailApiService.getRecentMessages();
      
      let syncedCount = 0;
      
      for (const message of messages) {
        try {
          await this.saveEmailToDatabase(message, user.id);
          syncedCount++;
        } catch (error) {
          console.error('Error saving email:', error);
          // Continue with other emails
        }
      }

      return {
        success: true,
        syncedCount
      };

    } catch (error) {
      console.error('Gmail sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }

  /**
   * Send an email using Gmail API
   */
  async sendEmail(to: string, subject: string, body: string, isHtml = false): Promise<string> {
    if (!gmailApiService.isReady()) {
      throw new Error('Gmail API not initialized');
    }

    const messageId = await gmailApiService.sendEmail(to, subject, body, isHtml);
    
    // Log the sent email to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const emailLog: EmailLog = {
        user_id: user.id,
        message_id: messageId,
        thread_id: messageId, // For sent emails, thread_id is same as message_id initially
        subject,
        from_email: (await gmailApiService.getUserProfile()).emailAddress,
        to_email: to,
        body,
        is_html: isHtml,
        sent_at: new Date().toISOString(),
        received_at: new Date().toISOString(),
        status: 'sent',
        provider: 'gmail',
        is_read: true,
        is_important: false,
        is_starred: false,
        labels: ['SENT'],
        attachments: []
      };

      await supabase.from('email_logs').insert([emailLog]);
    }

    return messageId;
  }

  /**
   * Mark an email as read in Gmail
   */
  async markAsRead(messageId: string): Promise<void> {
    if (!gmailApiService.isReady()) {
      throw new Error('Gmail API not initialized');
    }

    await gmailApiService.markAsRead(messageId);
    
    // Update database record
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('email_logs')
        .update({ is_read: true })
        .eq('message_id', messageId)
        .eq('user_id', user.id);
    }
  }

  /**
   * Get Gmail authentication status
   */
  isGmailAuthenticated(): boolean {
    return gmailApiService.isReady();
  }

  /**
   * Get Gmail user profile
   */
  async getGmailProfile(): Promise<any> {
    if (!gmailApiService.isReady()) {
      throw new Error('Gmail API not initialized');
    }

    return await gmailApiService.getUserProfile();
  }

  /**
   * Initialize Gmail API service
   */
  async initializeGmailApi(): Promise<boolean> {
    return await gmailApiService.initialize();
  }

  /**
   * Logout from Gmail
   */
  logoutGmail(): void {
    gmailApiService.logout();
    this.stopAutoSync();
  }

  // Subscribe to real-time email updates
  subscribeToEmailUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('email_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_logs'
        },
        callback
      )
      .subscribe();
  }
}

export const gmailSyncService = new GmailSyncService();