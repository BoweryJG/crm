import { supabase } from '../supabase/supabase';

export interface EmailAccount {
  id: string;
  rep_id: string;
  email_address: string;
  display_name: string;
  account_type: 'personal' | 'work' | 'other';
  provider: 'gmail' | 'outlook' | 'smtp';
  is_primary: boolean;
  is_verified: boolean;
  oauth_tokens?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  smtp_config?: {
    host: string;
    port: number;
    username: string;
    password: string; // encrypted
    use_ssl: boolean;
  };
  created_at: string;
  last_used: string;
}

export interface SendEmailOptions {
  from_account_id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  is_html?: boolean;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    content_type: string;
  }>;
}

class MultiEmailSendingService {
  /**
   * Add a new email account for a rep
   */
  async addEmailAccount(repId: string, accountData: {
    email_address: string;
    display_name: string;
    account_type: 'personal' | 'work' | 'other';
    provider: 'gmail' | 'outlook' | 'smtp';
    oauth_tokens?: any;
    smtp_config?: any;
  }): Promise<EmailAccount> {
    try {
      // Check if this is the first account (make it primary)
      const { data: existingAccounts } = await supabase
        .from('rep_email_accounts')
        .select('id')
        .eq('rep_id', repId);

      const isPrimary = !existingAccounts || existingAccounts.length === 0;

      const newAccount: Partial<EmailAccount> = {
        rep_id: repId,
        email_address: accountData.email_address,
        display_name: accountData.display_name,
        account_type: accountData.account_type,
        provider: accountData.provider,
        is_primary: isPrimary,
        is_verified: false,
        oauth_tokens: accountData.oauth_tokens,
        smtp_config: accountData.smtp_config,
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rep_email_accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Failed to add email account:', error);
      throw error;
    }
  }

  /**
   * Get all email accounts for a rep
   */
  async getRepEmailAccounts(repId: string): Promise<EmailAccount[]> {
    try {
      const { data, error } = await supabase
        .from('rep_email_accounts')
        .select('*')
        .eq('rep_id', repId)
        .order('is_primary', { ascending: false })
        .order('last_used', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get email accounts:', error);
      return [];
    }
  }

  /**
   * Send email from specific account
   */
  async sendFromAccount(options: SendEmailOptions): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      // Get the sending account
      const { data: account, error } = await supabase
        .from('rep_email_accounts')
        .select('*')
        .eq('id', options.from_account_id)
        .single();

      if (error || !account) {
        throw new Error('Email account not found');
      }

      let result;
      
      switch (account.provider) {
        case 'gmail':
          result = await this.sendViaGmail(account, options);
          break;
        case 'outlook':
          result = await this.sendViaOutlook(account, options);
          break;
        case 'smtp':
          result = await this.sendViaSMTP(account, options);
          break;
        default:
          throw new Error(`Unsupported provider: ${account.provider}`);
      }

      // Update last used timestamp
      if (result.success) {
        await supabase
          .from('rep_email_accounts')
          .update({ last_used: new Date().toISOString() })
          .eq('id', options.from_account_id);
      }

      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send via Gmail OAuth
   */
  private async sendViaGmail(account: EmailAccount, options: SendEmailOptions): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      // Check if token is still valid
      const now = Date.now();
      if (!account.oauth_tokens || now >= account.oauth_tokens.expires_at) {
        // Refresh token
        const refreshed = await this.refreshGmailToken(account);
        if (!refreshed) {
          throw new Error('Gmail token expired and refresh failed');
        }
      }

      // Build Gmail message
      const message = this.buildGmailMessage(account.email_address, options);
      
      // Send via Gmail API
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.oauth_tokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: message
        })
      });

      if (!response.ok) {
        throw new Error(`Gmail API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, message_id: result.id };

    } catch (error) {
      console.error('Gmail send failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send via Outlook OAuth
   */
  private async sendViaOutlook(account: EmailAccount, options: SendEmailOptions): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      // Build Outlook message format
      const message = {
        subject: options.subject,
        body: {
          contentType: options.is_html ? 'HTML' : 'Text',
          content: options.body
        },
        toRecipients: options.to.map(email => ({
          emailAddress: { address: email }
        })),
        ccRecipients: options.cc?.map(email => ({
          emailAddress: { address: email }
        })) || [],
        bccRecipients: options.bcc?.map(email => ({
          emailAddress: { address: email }
        })) || []
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.oauth_tokens?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`Outlook API error: ${response.statusText}`);
      }

      return { success: true, message_id: 'outlook_sent' };

    } catch (error) {
      console.error('Outlook send failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send via SMTP
   */
  private async sendViaSMTP(account: EmailAccount, options: SendEmailOptions): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      // Send via your backend SMTP service
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/send-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtp_config: account.smtp_config,
          from: account.email_address,
          to: options.to,
          cc: options.cc,
          bcc: options.bcc,
          subject: options.subject,
          body: options.body,
          is_html: options.is_html,
          attachments: options.attachments
        })
      });

      if (!response.ok) {
        throw new Error(`SMTP send failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, message_id: result.message_id };

    } catch (error) {
      console.error('SMTP send failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Build Gmail message in RFC 2822 format
   */
  private buildGmailMessage(fromEmail: string, options: SendEmailOptions): string {
    const boundary = `boundary_${Date.now()}_${Math.random()}`;
    
    let message = `From: ${fromEmail}\r\n`;
    message += `To: ${options.to.join(', ')}\r\n`;
    if (options.cc && options.cc.length > 0) {
      message += `Cc: ${options.cc.join(', ')}\r\n`;
    }
    if (options.bcc && options.bcc.length > 0) {
      message += `Bcc: ${options.bcc.join(', ')}\r\n`;
    }
    message += `Subject: ${options.subject}\r\n`;
    message += `MIME-Version: 1.0\r\n`;
    message += `Content-Type: ${options.is_html ? 'text/html' : 'text/plain'}; charset=UTF-8\r\n`;
    message += `\r\n${options.body}`;

    // Base64 encode for Gmail API
    return btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Refresh Gmail OAuth token
   */
  private async refreshGmailToken(account: EmailAccount): Promise<boolean> {
    try {
      if (!account.oauth_tokens?.refresh_token) {
        return false;
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
          refresh_token: account.oauth_tokens.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        return false;
      }

      const tokens = await response.json();
      
      // Update stored tokens
      const updatedTokens = {
        ...account.oauth_tokens,
        access_token: tokens.access_token,
        expires_at: Date.now() + (tokens.expires_in * 1000)
      };

      await supabase
        .from('rep_email_accounts')
        .update({ oauth_tokens: updatedTokens })
        .eq('id', account.id);

      return true;
    } catch (error) {
      console.error('Failed to refresh Gmail token:', error);
      return false;
    }
  }

  /**
   * Set primary email account
   */
  async setPrimaryAccount(repId: string, accountId: string): Promise<void> {
    try {
      // Remove primary from all accounts
      await supabase
        .from('rep_email_accounts')
        .update({ is_primary: false })
        .eq('rep_id', repId);

      // Set new primary
      await supabase
        .from('rep_email_accounts')
        .update({ is_primary: true })
        .eq('id', accountId);

    } catch (error) {
      console.error('Failed to set primary account:', error);
      throw error;
    }
  }

  /**
   * Remove email account
   */
  async removeAccount(accountId: string): Promise<void> {
    try {
      await supabase
        .from('rep_email_accounts')
        .delete()
        .eq('id', accountId);
    } catch (error) {
      console.error('Failed to remove account:', error);
      throw error;
    }
  }

  /**
   * Quick send from primary account
   */
  async sendFromPrimary(repId: string, emailOptions: Omit<SendEmailOptions, 'from_account_id'>): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      const accounts = await this.getRepEmailAccounts(repId);
      const primaryAccount = accounts.find(acc => acc.is_primary);
      
      if (!primaryAccount) {
        throw new Error('No primary email account found');
      }

      return await this.sendFromAccount({
        ...emailOptions,
        from_account_id: primaryAccount.id
      });
    } catch (error) {
      console.error('Failed to send from primary:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

const multiEmailSendingService = new MultiEmailSendingService();
export default multiEmailSendingService;