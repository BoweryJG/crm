import { supabase } from '../supabase/supabase';

export interface SMTPCredentials {
  email: string;
  password: string;
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth_type?: 'plain' | 'oauth2';
}

export interface WorkEmailAccount {
  id: string;
  rep_id: string;
  email_address: string;
  display_name: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'other';
  smtp_config: SMTPCredentials;
  is_primary: boolean;
  is_verified: boolean;
  last_used: string;
  created_at: string;
}

export interface DirectSendOptions {
  from_account_id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  is_html?: boolean;
  reply_to?: string;
}

class DirectSMTPService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
  }

  /**
   * Get SMTP settings for popular email providers
   */
  getProviderSettings(provider: string): Partial<SMTPCredentials> {
    const settings = {
      gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false
      },
      outlook: {
        host: 'smtp-mail.outlook.com', 
        port: 587,
        secure: false
      },
      yahoo: {
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false
      },
      office365: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false
      },
      icloud: {
        host: 'smtp.mail.me.com',
        port: 587,
        secure: false
      }
    };

    return settings[provider as keyof typeof settings] || {
      host: '',
      port: 587,
      secure: false
    };
  }

  /**
   * Auto-detect provider from email domain
   */
  detectProvider(email: string): string {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (domain?.includes('gmail.com')) return 'gmail';
    if (domain?.includes('outlook.com') || domain?.includes('hotmail.com') || domain?.includes('live.com')) return 'outlook';
    if (domain?.includes('yahoo.com')) return 'yahoo';
    if (domain?.includes('icloud.com') || domain?.includes('me.com')) return 'icloud';
    
    // Check for common corporate domains that use Office 365
    const office365Indicators = ['onmicrosoft.com', 'sharepoint.com'];
    if (office365Indicators.some(indicator => domain?.includes(indicator))) {
      return 'office365';
    }

    return 'other';
  }

  /**
   * Test SMTP connection without saving
   */
  async testConnection(credentials: SMTPCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/email/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtp_config: credentials
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Connection test failed' };
      }
    } catch (error) {
      console.error('SMTP test failed:', error);
      return { success: false, error: 'Network error during connection test' };
    }
  }

  /**
   * Add work email account with SMTP credentials
   */
  async addWorkEmailAccount(repId: string, accountData: {
    email_address: string;
    display_name: string;
    password: string;
    provider?: string;
    custom_smtp?: Partial<SMTPCredentials>;
  }): Promise<{ success: boolean; account?: WorkEmailAccount; error?: string }> {
    try {
      // Auto-detect provider if not specified
      const provider = accountData.provider || this.detectProvider(accountData.email_address);
      
      // Get provider SMTP settings
      const providerSettings = this.getProviderSettings(provider);
      
      // Build SMTP credentials
      const smtpConfig: SMTPCredentials = {
        email: accountData.email_address,
        password: accountData.password, // Will be encrypted on backend
        host: accountData.custom_smtp?.host || providerSettings.host || '',
        port: accountData.custom_smtp?.port || providerSettings.port || 587,
        secure: accountData.custom_smtp?.secure ?? providerSettings.secure ?? false,
        auth_type: 'plain'
      };

      // Test connection first
      const testResult = await this.testConnection(smtpConfig);
      if (!testResult.success) {
        return { success: false, error: `Connection test failed: ${testResult.error}` };
      }

      // Check if this is the first account (make it primary)
      const { data: existingAccounts } = await supabase
        .from('rep_work_email_accounts')
        .select('id')
        .eq('rep_id', repId);

      const isPrimary = !existingAccounts || existingAccounts.length === 0;

      const newAccount = {
        rep_id: repId,
        email_address: accountData.email_address,
        display_name: accountData.display_name,
        provider: provider,
        smtp_config: smtpConfig, // Backend will encrypt this
        is_primary: isPrimary,
        is_verified: true, // Since we tested the connection
        last_used: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rep_work_email_accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, account: data };
    } catch (error) {
      console.error('Failed to add work email account:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get all work email accounts for a rep
   */
  async getWorkEmailAccounts(repId: string): Promise<WorkEmailAccount[]> {
    try {
      const { data, error } = await supabase
        .from('rep_work_email_accounts')
        .select('*')
        .eq('rep_id', repId)
        .order('is_primary', { ascending: false })
        .order('last_used', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get work email accounts:', error);
      return [];
    }
  }

  /**
   * Send email directly via SMTP
   */
  async sendDirectEmail(options: DirectSendOptions): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      // Get the sending account
      const { data: account, error } = await supabase
        .from('rep_work_email_accounts')
        .select('*')
        .eq('id', options.from_account_id)
        .single();

      if (error || !account) {
        throw new Error('Work email account not found');
      }

      // Send via backend SMTP service
      const response = await fetch(`${this.backendUrl}/api/email/send-direct-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtp_config: account.smtp_config,
          from: account.email_address,
          from_name: account.display_name,
          to: options.to,
          cc: options.cc,
          bcc: options.bcc,
          subject: options.subject,
          body: options.body,
          is_html: options.is_html || false,
          reply_to: options.reply_to || account.email_address
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `SMTP send failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Update last used timestamp
      if (result.success) {
        await supabase
          .from('rep_work_email_accounts')
          .update({ last_used: new Date().toISOString() })
          .eq('id', options.from_account_id);

        // Log the send
        await this.logEmailSend(options, account, result.message_id);
      }

      return { success: true, message_id: result.message_id };

    } catch (error) {
      console.error('Direct SMTP send failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Log email send for analytics
   */
  private async logEmailSend(options: DirectSendOptions, account: WorkEmailAccount, messageId?: string): Promise<void> {
    try {
      const logEntry = {
        rep_id: account.rep_id,
        from_account_id: options.from_account_id,
        from_email: account.email_address,
        to_addresses: options.to,
        cc_addresses: options.cc || [],
        bcc_addresses: options.bcc || [],
        subject: options.subject,
        body_preview: options.body.substring(0, 200),
        status: 'sent',
        provider_message_id: messageId,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      await supabase
        .from('direct_email_send_logs')
        .insert([logEntry]);
    } catch (error) {
      console.error('Failed to log email send:', error);
      // Don't throw - logging failure shouldn't stop email sending
    }
  }

  /**
   * Update work email account password
   */
  async updateAccountPassword(accountId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current account
      const { data: account, error } = await supabase
        .from('rep_work_email_accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (error || !account) {
        throw new Error('Account not found');
      }

      // Update SMTP config with new password
      const updatedConfig = {
        ...account.smtp_config,
        password: newPassword
      };

      // Test new credentials
      const testResult = await this.testConnection(updatedConfig);
      if (!testResult.success) {
        return { success: false, error: `New password test failed: ${testResult.error}` };
      }

      // Update in database
      const { error: updateError } = await supabase
        .from('rep_work_email_accounts')
        .update({ smtp_config: updatedConfig })
        .eq('id', accountId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Failed to update password:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Remove work email account
   */
  async removeAccount(accountId: string): Promise<void> {
    try {
      await supabase
        .from('rep_work_email_accounts')
        .delete()
        .eq('id', accountId);
    } catch (error) {
      console.error('Failed to remove account:', error);
      throw error;
    }
  }

  /**
   * Set primary work email account
   */
  async setPrimaryAccount(repId: string, accountId: string): Promise<void> {
    try {
      // Remove primary from all accounts
      await supabase
        .from('rep_work_email_accounts')
        .update({ is_primary: false })
        .eq('rep_id', repId);

      // Set new primary
      await supabase
        .from('rep_work_email_accounts')
        .update({ is_primary: true })
        .eq('id', accountId);
    } catch (error) {
      console.error('Failed to set primary account:', error);
      throw error;
    }
  }

  /**
   * Get email provider setup instructions
   */
  getSetupInstructions(provider: string): {
    title: string;
    steps: string[];
    notes: string[];
    app_password_required: boolean;
  } {
    const instructions = {
      gmail: {
        title: 'Gmail Setup (No IT Approval Required)',
        steps: [
          '1. Go to Gmail Settings → "See all settings" → Forwarding and POP/IMAP',
          '2. Enable IMAP access',
          '3. Go to Google Account Settings → Security → 2-Step Verification',
          '4. Generate an "App Password" for RepSpheres',
          '5. Use your Gmail address and the App Password (not your regular password)'
        ],
        notes: [
          'App Passwords work without IT approval',
          'Your regular Gmail password will NOT work',
          'Keep your App Password secure'
        ],
        app_password_required: true
      },
      outlook: {
        title: 'Outlook/Office 365 Setup (No IT Approval Required)',
        steps: [
          '1. Go to Outlook.com → Settings → Mail → Sync email',
          '2. Enable IMAP access if available',
          '3. For Office 365: Check with IT if SMTP auth is enabled',
          '4. Use your email address and password',
          '5. Some corporate accounts may require App Passwords'
        ],
        notes: [
          'Most Outlook.com accounts work directly',
          'Corporate Office 365 may have SMTP restrictions',
          'Try your regular password first, then App Password if needed'
        ],
        app_password_required: false
      },
      other: {
        title: 'Custom Email Provider Setup',
        steps: [
          '1. Contact your email provider for SMTP settings',
          '2. Get the SMTP server hostname and port',
          '3. Confirm if SSL/TLS is required',
          '4. Use your email credentials',
          '5. Test the connection'
        ],
        notes: [
          'Every provider has different SMTP settings',
          'Check your email provider\'s documentation',
          'Common ports: 587 (TLS), 465 (SSL), 25 (unsecured)'
        ],
        app_password_required: false
      }
    };

    return instructions[provider as keyof typeof instructions] || instructions.other;
  }
}

const directSMTPService = new DirectSMTPService();
export default directSMTPService;