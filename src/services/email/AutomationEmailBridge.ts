// Automation Email Bridge - Connects AutomationHub to UltraEmailModal
// Provides seamless integration between automation workflows and email execution

import { emailAutomationEngine, EmailAutomation, WorkflowStep } from './EmailAutomationEngine';
import { triggerManager } from './TriggerManager';
import { EventEmitter } from 'events';

// Bridge Interface Types
export interface AutomationEmailRequest {
  automation_id: string;
  execution_id: string;
  contact_id: string;
  email_data: EmailTemplateData;
  send_options: EmailSendOptions;
  tracking_data: EmailTrackingData;
}

export interface EmailTemplateData {
  template_id?: string;
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
  personalization_data?: Record<string, any>;
}

export interface EmailSendOptions {
  send_immediately?: boolean;
  send_optimization?: boolean;
  schedule_datetime?: string;
  timezone?: string;
  priority?: 'low' | 'normal' | 'high';
  delivery_tracking?: boolean;
}

export interface EmailTrackingData {
  automation_id: string;
  execution_id: string;
  step_id: string;
  contact_id: string;
  campaign_name?: string;
  tags?: string[];
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
  content_type: string;
  size: number;
}

export interface EmailSendResult {
  success: boolean;
  message_id?: string;
  scheduled_id?: string;
  error?: string;
  tracking_pixel_url?: string;
  unsubscribe_url?: string;
}

export interface AutomationEmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'welcome' | 'follow_up' | 'promotional' | 'transactional' | 'nurture';
  subject_template: string;
  body_template: string;
  variables: TemplateVariable[];
  preview_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'url';
  description: string;
  default_value?: any;
  required: boolean;
}

// Automation Email Bridge Class
export class AutomationEmailBridge extends EventEmitter {
  private static instance: AutomationEmailBridge;
  private emailQueue: AutomationEmailRequest[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private templates: Map<string, AutomationEmailTemplate> = new Map();

  private constructor() {
    super();
    this.initializeBridge();
  }

  public static getInstance(): AutomationEmailBridge {
    if (!AutomationEmailBridge.instance) {
      AutomationEmailBridge.instance = new AutomationEmailBridge();
    }
    return AutomationEmailBridge.instance;
  }

  // Initialize the bridge
  private async initializeBridge(): Promise<void> {
    try {
      await this.loadEmailTemplates();
      this.setupEmailAutomationListener();
      this.startEmailProcessing();
      
      console.log('🌉 AutomationEmailBridge initialized successfully');
      this.emit('bridge_ready');
    } catch (error) {
      console.error('❌ Failed to initialize AutomationEmailBridge:', error);
      this.emit('bridge_error', error);
    }
  }

  // Load email templates
  private async loadEmailTemplates(): Promise<void> {
    // Load templates from database or file system
    const defaultTemplates: AutomationEmailTemplate[] = [
      {
        id: 'welcome_series_1',
        name: 'Welcome - Introduction',
        description: 'First email in welcome series',
        category: 'welcome',
        subject_template: 'Welcome to {{company_name}}, {{first_name}}!',
        body_template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome {{first_name}}!</h1>
            <p>We're thrilled to have you join {{company_name}}. Here's what you can expect:</p>
            <ul>
              <li>Personalized product recommendations</li>
              <li>Exclusive offers and early access</li>
              <li>Expert tips and insights</li>
            </ul>
            <p>Get started by exploring our latest offerings:</p>
            <a href="{{dashboard_url}}" style="background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Explore Dashboard
            </a>
          </div>
        `,
        variables: [
          { name: 'first_name', type: 'text', description: 'Contact first name', required: true },
          { name: 'company_name', type: 'text', description: 'Company name', required: true },
          { name: 'dashboard_url', type: 'url', description: 'Dashboard URL', required: true }
        ],
        preview_data: {
          first_name: 'John',
          company_name: 'RepSpheres',
          dashboard_url: 'https://crm.repspheres.com/dashboard'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'follow_up_interested',
        name: 'Follow-up - High Interest',
        description: 'Follow-up email for highly engaged contacts',
        category: 'follow_up',
        subject_template: 'Ready to take the next step, {{first_name}}?',
        body_template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Hi {{first_name}},</h1>
            <p>I noticed you've been exploring {{product_name}} - that's fantastic!</p>
            <p>Based on your activity, I think you'd be particularly interested in:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>{{recommendation_title}}</h3>
              <p>{{recommendation_description}}</p>
            </div>
            <p>Would you like to schedule a quick 15-minute call to discuss how this could benefit your business?</p>
            <a href="{{calendar_url}}" style="background: #34C759; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Schedule Call
            </a>
          </div>
        `,
        variables: [
          { name: 'first_name', type: 'text', description: 'Contact first name', required: true },
          { name: 'product_name', type: 'text', description: 'Product name', required: true },
          { name: 'recommendation_title', type: 'text', description: 'Recommendation title', required: true },
          { name: 'recommendation_description', type: 'text', description: 'Recommendation description', required: true },
          { name: 'calendar_url', type: 'url', description: 'Calendar booking URL', required: true }
        ],
        preview_data: {
          first_name: 'Sarah',
          product_name: 'CRM Pro',
          recommendation_title: 'Advanced Analytics Dashboard',
          recommendation_description: 'Get deep insights into your sales pipeline with our advanced analytics.',
          calendar_url: 'https://calendly.com/repspheres'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Setup listener for automation engine email requests
  private setupEmailAutomationListener(): void {
    emailAutomationEngine.on('send_automation_email', async (emailData: any) => {
      await this.handleAutomationEmailRequest(emailData);
    });
  }

  // Handle email request from automation engine
  private async handleAutomationEmailRequest(emailData: any): Promise<void> {
    try {
      const request: AutomationEmailRequest = {
        automation_id: emailData.automation_id,
        execution_id: emailData.execution_id,
        contact_id: emailData.contact_id || 'unknown',
        email_data: {
          template_id: emailData.template_id,
          subject: emailData.subject,
          body: emailData.body,
          to: emailData.to || [],
          cc: emailData.cc,
          bcc: emailData.bcc,
          personalization_data: emailData.personalization_data
        },
        send_options: {
          send_immediately: !emailData.schedule_datetime,
          send_optimization: emailData.send_optimization || false,
          schedule_datetime: emailData.schedule_datetime,
          priority: emailData.priority || 'normal',
          delivery_tracking: true
        },
        tracking_data: {
          automation_id: emailData.automation_id,
          execution_id: emailData.execution_id,
          step_id: emailData.step_id || 'unknown',
          contact_id: emailData.contact_id,
          campaign_name: emailData.campaign_name,
          tags: emailData.tags
        }
      };

      // Add to processing queue
      this.emailQueue.push(request);
      
      this.emit('email_request_queued', request);
    } catch (error) {
      console.error('❌ Error handling automation email request:', error);
      this.emit('email_request_error', { emailData, error });
    }
  }

  // Start processing email queue
  private startEmailProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processEmailQueue();
    }, 2000); // Process every 2 seconds
  }

  // Process email queue
  private async processEmailQueue(): Promise<void> {
    if (this.emailQueue.length === 0) return;

    const request = this.emailQueue.shift();
    if (!request) return;

    try {
      await this.processEmailRequest(request);
    } catch (error) {
      console.error('❌ Error processing email request:', error);
      this.emit('email_processing_error', { request, error });
    }
  }

  // Process individual email request
  private async processEmailRequest(request: AutomationEmailRequest): Promise<void> {
    // Prepare email for UltraEmailModal integration
    const processedEmail = await this.prepareEmailForSending(request);
    
    // Send via UltraEmailModal or direct email service
    const result = await this.sendEmail(processedEmail);
    
    // Track email sending result
    await this.trackEmailResult(request, result);
    
    // Emit completion event
    this.emit('email_sent', { request, result });
  }

  // Prepare email for sending
  private async prepareEmailForSending(request: AutomationEmailRequest): Promise<any> {
    let emailContent = { ...request.email_data };

    // Apply template if specified
    if (request.email_data.template_id) {
      const template = this.templates.get(request.email_data.template_id);
      if (template) {
        emailContent = await this.applyTemplate(template, request);
      }
    }

    // Apply personalization
    emailContent = await this.personalizeEmail(emailContent, request.contact_id);

    // Add tracking pixels and unsubscribe links
    emailContent = await this.addEmailTracking(emailContent, request.tracking_data);

    return {
      ...emailContent,
      send_options: request.send_options,
      tracking_data: request.tracking_data
    };
  }

  // Apply email template
  private async applyTemplate(template: AutomationEmailTemplate, request: AutomationEmailRequest): Promise<EmailTemplateData> {
    // Get contact data for personalization
    const contactData = await this.getContactData(request.contact_id);
    
    // Merge template variables with contact data and custom data
    const variables = {
      ...template.preview_data,
      ...contactData,
      ...request.email_data.personalization_data
    };

    // Replace template variables
    const subject = this.replaceTemplateVariables(template.subject_template, variables);
    const body = this.replaceTemplateVariables(template.body_template, variables);

    return {
      ...request.email_data,
      subject: subject,
      body: body
    };
  }

  // Replace template variables
  private replaceTemplateVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    return result;
  }

  // Personalize email content
  private async personalizeEmail(emailData: EmailTemplateData, contactId: string): Promise<EmailTemplateData> {
    const contactData = await this.getContactData(contactId);
    
    // Basic personalization
    let subject = emailData.subject
      .replace(/\{\{first_name\}\}/g, contactData.first_name || '')
      .replace(/\{\{last_name\}\}/g, contactData.last_name || '')
      .replace(/\{\{company\}\}/g, contactData.company || '');

    let body = emailData.body
      .replace(/\{\{first_name\}\}/g, contactData.first_name || '')
      .replace(/\{\{last_name\}\}/g, contactData.last_name || '')
      .replace(/\{\{company\}\}/g, contactData.company || '')
      .replace(/\{\{email\}\}/g, contactData.email || '');

    return {
      ...emailData,
      subject,
      body
    };
  }

  // Add email tracking
  private async addEmailTracking(emailData: EmailTemplateData, trackingData: EmailTrackingData): Promise<EmailTemplateData> {
    const trackingPixelUrl = `https://crm.repspheres.com/api/email/track/open/${trackingData.execution_id}`;
    const unsubscribeUrl = `https://crm.repspheres.com/unsubscribe/${trackingData.contact_id}`;

    // Add tracking pixel to email body
    const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />`;
    const unsubscribeLink = `<div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;"><a href="${unsubscribeUrl}">Unsubscribe</a></div>`;

    const bodyWithTracking = emailData.body + trackingPixel + unsubscribeLink;

    return {
      ...emailData,
      body: bodyWithTracking
    };
  }

  // Send email (integrates with UltraEmailModal or direct service)
  private async sendEmail(emailData: any): Promise<EmailSendResult> {
    try {
      // This would integrate with your actual email sending service
      // For now, we'll simulate the sending
      
      if (emailData.send_options.send_immediately) {
        // Send immediately
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Emit event for UltraEmailModal integration
        this.emit('trigger_ultra_email_modal', {
          mode: 'automation',
          email_data: emailData,
          auto_send: true
        });

        return {
          success: true,
          message_id: messageId,
          tracking_pixel_url: `https://crm.repspheres.com/api/email/track/open/${emailData.tracking_data.execution_id}`,
          unsubscribe_url: `https://crm.repspheres.com/unsubscribe/${emailData.tracking_data.contact_id}`
        };
      } else {
        // Schedule for later
        const scheduledId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
          success: true,
          scheduled_id: scheduledId
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Track email result
  private async trackEmailResult(request: AutomationEmailRequest, result: EmailSendResult): Promise<void> {
    // Store email tracking data
    const trackingRecord = {
      automation_id: request.automation_id,
      execution_id: request.execution_id,
      contact_id: request.contact_id,
      message_id: result.message_id,
      scheduled_id: result.scheduled_id,
      sent_at: result.success && !result.scheduled_id ? new Date().toISOString() : null,
      scheduled_for: request.send_options.schedule_datetime,
      status: result.success ? (result.scheduled_id ? 'scheduled' : 'sent') : 'failed',
      error_message: result.error,
      tracking_data: request.tracking_data
    };

    // Save to database (would use Supabase)
    console.log('📊 Email tracking recorded:', trackingRecord);

    // Update automation metrics
    this.updateAutomationMetrics(request.automation_id, result.success);
  }

  // Update automation metrics
  private updateAutomationMetrics(automationId: string, success: boolean): void {
    // Update success/failure counts for the automation
    // This would update the automation's performance metrics
    console.log(`📈 Updated metrics for automation ${automationId}: ${success ? 'success' : 'failure'}`);
  }

  // Helper methods
  private async getContactData(contactId: string): Promise<any> {
    // Mock contact data - would fetch from Supabase
    return {
      id: contactId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp'
    };
  }

  // Public API methods
  public async createEmailTemplate(template: Omit<AutomationEmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<AutomationEmailTemplate> {
    const newTemplate: AutomationEmailTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  public getEmailTemplate(templateId: string): AutomationEmailTemplate | null {
    return this.templates.get(templateId) || null;
  }

  public getAllEmailTemplates(): AutomationEmailTemplate[] {
    return Array.from(this.templates.values());
  }

  public getEmailTemplatesByCategory(category: string): AutomationEmailTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.category === category);
  }

  public async previewEmailTemplate(templateId: string, previewData?: Record<string, any>): Promise<{ subject: string; body: string }> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    const variables = { ...template.preview_data, ...previewData };
    
    return {
      subject: this.replaceTemplateVariables(template.subject_template, variables),
      body: this.replaceTemplateVariables(template.body_template, variables)
    };
  }

  public getQueueStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.emailQueue.length,
      processing: this.processingInterval !== null
    };
  }

  // Integration methods for UltraEmailModal
  public async sendEmailViaUltraModal(emailData: EmailTemplateData, options: EmailSendOptions): Promise<EmailSendResult> {
    // Direct integration with UltraEmailModal for manual sends
    this.emit('open_ultra_email_modal', {
      mode: 'compose',
      prefilledData: emailData,
      sendOptions: options
    });

    return { success: true, message_id: 'manual_send' };
  }

  // Cleanup
  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    this.removeAllListeners();
  }
}

// Export singleton instance
export const automationEmailBridge = AutomationEmailBridge.getInstance();