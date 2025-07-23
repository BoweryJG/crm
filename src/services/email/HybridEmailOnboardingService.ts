import { supabase } from '../supabase/supabase';
import DirectSMTPService from './DirectSMTPService';

export interface EmailOnboardingResult {
  success: boolean;
  method: 'oauth' | 'smtp' | 'failed';
  account_id?: string;
  error?: string;
  next_steps?: string[];
}

class HybridEmailOnboardingService {
  /**
   * Automated email onboarding with fallback strategy
   * 1. Try OAuth first (if IT allows)
   * 2. Fallback to SMTP with guided setup
   * 3. Provide manual instructions as last resort
   */
  async automatedEmailOnboarding(
    repId: string, 
    workEmail: string,
    displayName: string
  ): Promise<EmailOnboardingResult> {
    
    console.log(`🚀 Starting automated email onboarding for ${workEmail}`);
    
    // Step 1: Try OAuth first (silent attempt)
    const oauthResult = await this.tryOAuthSilent(workEmail);
    if (oauthResult.success) {
      console.log('✅ OAuth succeeded - no manual setup needed');
      return {
        success: true,
        method: 'oauth',
        account_id: oauthResult.account_id
      };
    }

    // Step 2: Guide user through SMTP setup with maximum automation
    const smtpResult = await this.automatedSMTPSetup(repId, workEmail, displayName);
    if (smtpResult.success) {
      console.log('✅ SMTP setup guided successfully');
      return smtpResult;
    }

    // Step 3: Provide fallback instructions
    return {
      success: false,
      method: 'failed',
      error: 'Automated setup failed',
      next_steps: this.getManualSetupSteps(workEmail)
    };
  }

  /**
   * Try OAuth silently (will fail if IT blocks, but worth trying)
   */
  private async tryOAuthSilent(workEmail: string): Promise<{ success: boolean; account_id?: string }> {
    try {
      // Attempt OAuth without user interaction
      // This will fail gracefully if corporate policies block it
      const provider = DirectSMTPService.detectProvider(workEmail);
      
      if (provider === 'gmail') {
        return await this.tryGmailOAuthSilent(workEmail);
      } else if (provider === 'outlook' || provider === 'office365') {
        return await this.tryOutlookOAuthSilent(workEmail);
      }

      return { success: false };
    } catch (error) {
      console.log('OAuth silent attempt failed (expected):', error);
      return { success: false };
    }
  }

  /**
   * Try Gmail OAuth silently
   */
  private async tryGmailOAuthSilent(workEmail: string): Promise<{ success: boolean; account_id?: string }> {
    try {
      // Create invisible iframe for silent OAuth attempt
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      
      const params = new URLSearchParams({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        redirect_uri: `${window.location.origin}/gmail-silent-callback`,
        scope: 'https://www.googleapis.com/auth/gmail.send',
        response_type: 'code',
        prompt: 'none', // Silent - will fail if not already authenticated
        login_hint: workEmail
      });

      iframe.src = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      document.body.appendChild(iframe);

      // Wait for callback or timeout
      const result = await this.waitForSilentCallback(iframe, 5000);
      document.body.removeChild(iframe);

      return result;
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Try Outlook OAuth silently  
   */
  private async tryOutlookOAuthSilent(workEmail: string): Promise<{ success: boolean; account_id?: string }> {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      
      const params = new URLSearchParams({
        client_id: process.env.REACT_APP_MICROSOFT_CLIENT_ID || '',
        response_type: 'code',
        redirect_uri: `${window.location.origin}/outlook-silent-callback`,
        scope: 'https://graph.microsoft.com/Mail.Send',
        prompt: 'none',
        login_hint: workEmail
      });

      iframe.src = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
      document.body.appendChild(iframe);

      const result = await this.waitForSilentCallback(iframe, 5000);
      document.body.removeChild(iframe);

      return result;
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Wait for silent OAuth callback
   */
  private async waitForSilentCallback(iframe: HTMLIFrameElement, timeout: number): Promise<{ success: boolean; account_id?: string }> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve({ success: false });
      }, timeout);

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'oauth_success') {
          clearTimeout(timer);
          window.removeEventListener('message', messageHandler);
          resolve({ success: true, account_id: event.data.account_id });
        } else if (event.data.type === 'oauth_error') {
          clearTimeout(timer);
          window.removeEventListener('message', messageHandler);
          resolve({ success: false });
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  /**
   * Automated SMTP setup with maximum hand-holding
   */
  private async automatedSMTPSetup(
    repId: string, 
    workEmail: string, 
    displayName: string
  ): Promise<EmailOnboardingResult> {
    
    const provider = DirectSMTPService.detectProvider(workEmail);
    
    // Auto-detect all settings
    const instructions = DirectSMTPService.getSetupInstructions(provider);

    // Create guided setup notification
    await this.createGuidedSetupNotification(repId, workEmail, provider, instructions);

    // Return instructions for user to complete
    return {
      success: false, // User still needs to complete manual step
      method: 'smtp',
      error: 'Manual App Password setup required',
      next_steps: [
        `We've detected you're using ${provider.toUpperCase()}`,
        'SMTP settings have been pre-configured for you',
        'You just need to create an App Password (takes 2 minutes)',
        'Follow the step-by-step guide we\'ve prepared',
        'Test connection and you\'re done!'
      ]
    };
  }

  /**
   * Create in-app notification with guided setup
   */
  private async createGuidedSetupNotification(
    repId: string, 
    workEmail: string, 
    provider: string,
    instructions: any
  ): Promise<void> {
    try {
      const notification = {
        rep_id: repId,
        type: 'email_setup_guide',
        title: `📧 Set up your work email: ${workEmail}`,
        message: `We've pre-configured ${provider.toUpperCase()} settings for you! Just complete the App Password setup to send from your work email.`,
        action_url: '/settings/email?setup=work&provider=' + provider + '&email=' + encodeURIComponent(workEmail),
        action_text: 'Complete Setup (2 min)',
        priority: 'high',
        metadata: {
          email: workEmail,
          provider: provider,
          instructions: instructions,
          auto_configured: true
        },
        read: false,
        created_at: new Date().toISOString()
      };

      await supabase
        .from('rep_notifications')
        .insert([notification]);

      console.log('📧 Created guided setup notification');
    } catch (error) {
      console.error('Failed to create setup notification:', error);
    }
  }

  /**
   * Get manual setup steps as fallback
   */
  private getManualSetupSteps(workEmail: string): string[] {
    const provider = DirectSMTPService.detectProvider(workEmail);
    const instructions = DirectSMTPService.getSetupInstructions(provider);
    
    return [
      `Email detected: ${workEmail} (${provider.toUpperCase()})`,
      ...instructions.steps,
      'Once configured, test connection in RepSpheres',
      'Your work email will be ready for professional sending'
    ];
  }

  /**
   * Smart onboarding trigger during rep signup
   */
  async triggerDuringSignup(repId: string, repEmail: string): Promise<void> {
    try {
      // Check if user has a corporate email in their profile
      const { data: profile } = await supabase
        .from('rep_profiles')
        .select('*')
        .eq('id', repId)
        .single();

      if (!profile) return;

      // If they signed up with personal email, prompt for work email
      const isPersonalEmail = this.isPersonalEmail(repEmail);
      
      if (isPersonalEmail) {
        await this.createWorkEmailPrompt(repId);
      } else {
        // They signed up with work email - auto-start onboarding
        const displayName = `${profile.full_name} - Work`;
        await this.automatedEmailOnboarding(repId, repEmail, displayName);
      }
    } catch (error) {
      console.error('Failed to trigger onboarding:', error);
    }
  }

  /**
   * Detect if email is personal vs work
   */
  private isPersonalEmail(email: string): boolean {
    const personalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'live.com', 'icloud.com', 'me.com', 'aol.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return personalDomains.includes(domain || '');
  }

  /**
   * Create work email setup prompt
   */
  private async createWorkEmailPrompt(repId: string): Promise<void> {
    try {
      const notification = {
        rep_id: repId,
        type: 'work_email_prompt',
        title: '💼 Add your work email for professional sending',
        message: 'Send emails from your corporate email address to build trust with customers. Setup takes just 2 minutes.',
        action_url: '/settings/email?setup=work',
        action_text: 'Add Work Email',
        priority: 'medium',
        read: false,
        created_at: new Date().toISOString()
      };

      await supabase
        .from('rep_notifications')
        .insert([notification]);
    } catch (error) {
      console.error('Failed to create work email prompt:', error);
    }
  }

  /**
   * Get onboarding status for a rep
   */
  async getOnboardingStatus(repId: string): Promise<{
    has_work_email: boolean;
    primary_work_email?: string;
    setup_method?: 'oauth' | 'smtp';
    needs_setup: boolean;
  }> {
    try {
      const workAccounts = await DirectSMTPService.getWorkEmailAccounts(repId);
      const primaryAccount = workAccounts.find(acc => acc.is_primary);

      return {
        has_work_email: workAccounts.length > 0,
        primary_work_email: primaryAccount?.email_address,
        setup_method: primaryAccount ? 'smtp' : undefined,
        needs_setup: workAccounts.length === 0
      };
    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      return {
        has_work_email: false,
        needs_setup: true
      };
    }
  }
}

const hybridEmailOnboardingService = new HybridEmailOnboardingService();
export default hybridEmailOnboardingService;