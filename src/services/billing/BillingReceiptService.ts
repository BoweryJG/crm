import { supabase } from '../supabase/supabaseClient';

interface ReceiptData {
  rep_id: string;
  rep_email: string;
  rep_name: string;
  phone_number: string;
  plan_type: 'starter' | 'professional' | 'enterprise';
  billing_amount: number;
  billing_period: 'monthly' | 'annual';
  transaction_id: string;
  onboarding_date: string;
}

interface EmailTemplate {
  subject: string;
  html_content: string;
  text_content: string;
}

class BillingReceiptService {
  private fromEmail: string = 'billing@repspheres.com';
  private companyName: string = 'RepSpheres';
  private supportEmail: string = 'support@repspheres.com';
  private backendUrl: string;

  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
  }

  /**
   * Send automated receipt email for calling platform activation
   */
  async sendCallingPlatformReceipt(receiptData: ReceiptData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📧 Sending calling platform receipt to ${receiptData.rep_email}`);

      // Generate receipt template
      const emailTemplate = this.generateReceiptTemplate(receiptData);

      // Send email via backend service
      const emailResult = await this.sendEmail({
        to: receiptData.rep_email,
        from: this.fromEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html_content,
        text: emailTemplate.text_content,
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send email');
      }

      // Store receipt record in database
      await this.storeReceiptRecord(receiptData, emailResult.message_id);

      // Send notification to rep
      await this.createReceiptNotification(receiptData);

      console.log(`✅ Receipt sent successfully to ${receiptData.rep_email}`);
      return { success: true };

    } catch (error) {
      console.error('Failed to send receipt email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate receipt email template
   */
  private generateReceiptTemplate(data: ReceiptData): EmailTemplate {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.billing_amount);

    const formattedDate = new Date(data.onboarding_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const subject = `Your RepSpheres Calling Platform is Active - Receipt #${data.transaction_id}`;

    const html_content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RepSpheres - Calling Platform Receipt</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #9f58fa 0%, #4B96DC 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .receipt-header { text-align: center; margin-bottom: 40px; }
        .receipt-header h2 { color: #1a202c; margin: 0 0 10px 0; font-size: 24px; }
        .receipt-number { color: #718096; font-size: 14px; }
        .details-card { background: #f7fafc; border-left: 4px solid #9f58fa; padding: 25px; margin: 30px 0; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin: 12px 0; }
        .detail-label { color: #4a5568; font-weight: 500; }
        .detail-value { color: #1a202c; font-weight: 600; }
        .phone-highlight { background: linear-gradient(135deg, #9f58fa 0%, #4B96DC 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .phone-number { font-size: 24px; font-weight: 700; margin: 10px 0; }
        .amount-total { background: #edf2f7; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .amount-total .label { color: #4a5568; font-size: 14px; margin-bottom: 5px; }
        .amount-total .amount { color: #1a202c; font-size: 32px; font-weight: 700; }
        .footer { background: #edf2f7; padding: 30px; text-align: center; color: #718096; font-size: 14px; }
        .footer a { color: #9f58fa; text-decoration: none; }
        .button { display: inline-block; background: #9f58fa; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        @media (max-width: 600px) {
            .container { margin: 0; }
            .content, .header, .footer { padding: 20px; }
            .detail-row { flex-direction: column; gap: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>RepSpheres</h1>
            <p>Luxury CRM & Calling Platform</p>
        </div>
        
        <div class="content">
            <div class="receipt-header">
                <h2>🎉 Your Calling Platform is Active!</h2>
                <div class="receipt-number">Receipt #${data.transaction_id}</div>
            </div>

            <p>Hi ${data.rep_name},</p>
            
            <p>Congratulations! Your RepSpheres calling platform has been successfully activated. You now have access to AI-powered calling with automatic transcription and analysis.</p>

            <div class="phone-highlight">
                <div>Your Personal Calling Number</div>
                <div class="phone-number">${data.phone_number}</div>
                <div>Ready to use immediately</div>
            </div>

            <div class="details-card">
                <h3 style="margin: 0 0 20px 0; color: #1a202c;">Service Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Plan Type:</span>
                    <span class="detail-value">${data.plan_type.charAt(0).toUpperCase() + data.plan_type.slice(1)} Plan</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Billing Period:</span>
                    <span class="detail-value">${data.billing_period.charAt(0).toUpperCase() + data.billing_period.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Activation Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone Number:</span>
                    <span class="detail-value">${data.phone_number}</span>
                </div>
            </div>

            <div class="amount-total">
                <div class="label">Total Amount</div>
                <div class="amount">${formattedAmount}</div>
                <div style="color: #718096; font-size: 12px; margin-top: 5px;">
                    ${data.billing_period === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
                <a href="https://crm.repspheres.com/command-center?tab=communications" class="button">
                    Start Making Calls
                </a>
            </div>

            <div style="background: #f0fff4; border-left: 4px solid #38a169; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="color: #22543d; margin: 0 0 10px 0;">✨ What's Included:</h4>
                <ul style="color: #2d3748; margin: 0; padding-left: 20px;">
                    <li>Personal phone number with instant provisioning</li>
                    <li>AI-powered call transcription with 95%+ accuracy</li>
                    <li>Sentiment analysis and conversion likelihood scoring</li>
                    <li>Automated coaching insights and recommendations</li>
                    <li>Secure call recording and data storage</li>
                    <li>Real-time analytics and performance tracking</li>
                </ul>
            </div>

            <p><strong>Need help getting started?</strong></p>
            <p>Our team is here to help. Contact us at <a href="mailto:${this.supportEmail}">${this.supportEmail}</a> or visit our <a href="https://repspheres.com/support">support center</a>.</p>

            <p>Thank you for choosing RepSpheres!</p>
            
            <p>Best regards,<br>
            The RepSpheres Team</p>
        </div>
        
        <div class="footer">
            <p><strong>${this.companyName}</strong></p>
            <p>Questions? Contact us at <a href="mailto:${this.supportEmail}">${this.supportEmail}</a></p>
            <p>This is an automated receipt. Please save this email for your records.</p>
            <p style="margin-top: 20px; font-size: 12px;">
                <a href="https://repspheres.com/privacy">Privacy Policy</a> | 
                <a href="https://repspheres.com/terms">Terms of Service</a> | 
                <a href="https://repspheres.com/unsubscribe">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;

    const text_content = `
RepSpheres - Calling Platform Receipt

Hi ${data.rep_name},

Congratulations! Your RepSpheres calling platform has been successfully activated.

Receipt #${data.transaction_id}

SERVICE DETAILS:
- Plan Type: ${data.plan_type.charAt(0).toUpperCase() + data.plan_type.slice(1)} Plan
- Billing Period: ${data.billing_period.charAt(0).toUpperCase() + data.billing_period.slice(1)}
- Activation Date: ${formattedDate}
- Your Phone Number: ${data.phone_number}
- Total Amount: ${formattedAmount}

Your personal calling number is ready to use immediately with AI-powered transcription and analysis.

Start making calls: https://crm.repspheres.com/command-center?tab=communications

WHAT'S INCLUDED:
✓ Personal phone number with instant provisioning
✓ AI-powered call transcription with 95%+ accuracy
✓ Sentiment analysis and conversion likelihood scoring
✓ Automated coaching insights and recommendations
✓ Secure call recording and data storage
✓ Real-time analytics and performance tracking

Need help? Contact us at ${this.supportEmail}

Thank you for choosing RepSpheres!

The RepSpheres Team
${this.companyName}
`;

    return { subject, html_content, text_content };
  }

  /**
   * Send email via backend service
   */
  private async sendEmail(emailData: {
    to: string;
    from: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<{ success: boolean; message_id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...emailData,
          template_type: 'calling_platform_receipt',
          priority: 'high'
        }),
      });

      if (!response.ok) {
        throw new Error(`Email service failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, message_id: result.message_id };

    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Store receipt record in database
   */
  private async storeReceiptRecord(receiptData: ReceiptData, messageId?: string): Promise<void> {
    try {
      const receiptRecord = {
        rep_id: receiptData.rep_id,
        transaction_id: receiptData.transaction_id,
        receipt_type: 'calling_platform_activation',
        amount: receiptData.billing_amount,
        currency: 'USD',
        billing_period: receiptData.billing_period,
        plan_type: receiptData.plan_type,
        service_details: {
          phone_number: receiptData.phone_number,
          activation_date: receiptData.onboarding_date,
          features: [
            'AI-powered transcription',
            'Sentiment analysis',
            'Call analytics',
            'Coaching insights'
          ]
        },
        email_sent: true,
        email_message_id: messageId,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('billing_receipts')
        .insert([receiptRecord]);

      if (error) {
        console.error('Failed to store receipt record:', error);
        // Don't throw - receipt storage is not critical for email sending
      }
    } catch (error) {
      console.error('Failed to store receipt record:', error);
    }
  }

  /**
   * Create in-app notification about receipt
   */
  private async createReceiptNotification(receiptData: ReceiptData): Promise<void> {
    try {
      const notification = {
        rep_id: receiptData.rep_id,
        type: 'billing_receipt',
        title: '📧 Receipt Sent',
        message: `Your calling platform receipt has been sent to ${receiptData.rep_email}. Keep this for your records.`,
        action_url: '/command-center?tab=communications',
        action_text: 'Start Calling',
        priority: 'medium',
        read: false,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('rep_notifications')
        .insert([notification]);

      if (error) {
        console.error('Failed to create receipt notification:', error);
      }
    } catch (error) {
      console.error('Failed to create receipt notification:', error);
    }
  }

  /**
   * Send receipt for existing calling platform users (bulk operation)
   */
  async sendBulkReceipts(filters?: {
    plan_type?: string;
    date_range?: { start: string; end: string };
  }): Promise<{ sent: number; failed: number; errors: string[] }> {
    try {
      console.log('📧 Starting bulk receipt sending...');

      // Get eligible reps
      let query = supabase
        .from('rep_profiles')
        .select(`
          *,
          rep_twilio_config (phone_number, provisioned_at, status)
        `)
        .eq('rep_twilio_config.status', 'active');

      if (filters?.date_range) {
        query = query
          .gte('rep_twilio_config.provisioned_at', filters.date_range.start)
          .lte('rep_twilio_config.provisioned_at', filters.date_range.end);
      }

      const { data: reps, error } = await query;

      if (error) throw error;

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const rep of reps || []) {
        if (!rep.rep_twilio_config?.[0]) continue;

        const config = rep.rep_twilio_config[0];
        
        const receiptData: ReceiptData = {
          rep_id: rep.id,
          rep_email: rep.email,
          rep_name: rep.full_name,
          phone_number: config.phone_number,
          plan_type: 'professional', // Default - would get from subscription
          billing_amount: 97.00, // Default professional plan price
          billing_period: 'monthly',
          transaction_id: `BULK_${Date.now()}_${rep.id.substr(0, 8)}`,
          onboarding_date: config.provisioned_at
        };

        const result = await this.sendCallingPlatformReceipt(receiptData);
        
        if (result.success) {
          sent++;
        } else {
          failed++;
          errors.push(`${rep.email}: ${result.error}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`✅ Bulk receipt sending completed: ${sent} sent, ${failed} failed`);
      return { sent, failed, errors };

    } catch (error) {
      console.error('Failed to send bulk receipts:', error);
      return { sent: 0, failed: 1, errors: [error.message] };
    }
  }

  /**
   * Generate receipt for subscription changes
   */
  async sendSubscriptionChangeReceipt(data: {
    rep_id: string;
    change_type: 'upgrade' | 'downgrade' | 'renewal' | 'cancellation';
    old_plan: string;
    new_plan: string;
    amount: number;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Get rep details
      const { data: rep, error } = await supabase
        .from('rep_profiles')
        .select('*')
        .eq('id', data.rep_id)
        .single();

      if (error || !rep) {
        throw new Error('Rep not found');
      }

      // Create subscription change receipt
      const receiptData: ReceiptData = {
        rep_id: data.rep_id,
        rep_email: rep.email,
        rep_name: rep.full_name,
        phone_number: '', // Not needed for subscription changes
        plan_type: data.new_plan as any,
        billing_amount: data.amount,
        billing_period: 'monthly',
        transaction_id: `SUB_${Date.now()}_${data.rep_id.substr(0, 8)}`,
        onboarding_date: new Date().toISOString()
      };

      return await this.sendCallingPlatformReceipt(receiptData);

    } catch (error) {
      console.error('Failed to send subscription change receipt:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BillingReceiptService();