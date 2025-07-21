// CRM-specific endpoints for osbackend
// File: osbackend/crm-endpoints.js

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CRM Feature Tiers Configuration
const CRM_TIERS = {
  basic: {
    name: 'CRM Basic',
    features: {
      contacts: 1000,
      emails: 50,
      automations: 3,
      canvas_scans: 0,
      ai_prompts: 10
    }
  },
  professional: {
    name: 'CRM Professional',
    features: {
      contacts: 5000,
      emails: 200,
      automations: 10,
      canvas_scans: 25,
      ai_prompts: 50
    }
  },
  enterprise: {
    name: 'CRM Enterprise',
    features: {
      contacts: 'unlimited',
      emails: 'unlimited',
      automations: 'unlimited',
      canvas_scans: 'unlimited',
      ai_prompts: 'unlimited'
    }
  }
};

// AI Prompts Configuration
const AI_PROMPTS = {
  'email-follow-up': {
    id: 'email-follow-up',
    name: 'Email Follow-up',
    description: 'Generate personalized follow-up emails',
    template: 'Generate a professional follow-up email for {contact_name} regarding {topic}',
    usage_count: 0
  },
  'call-preparation': {
    id: 'call-preparation',
    name: 'Call Preparation',
    description: 'Prepare talking points for sales calls',
    template: 'Create talking points for a sales call with {contact_name} at {company}',
    usage_count: 0
  },
  'market-analysis': {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Analyze market opportunities',
    template: 'Analyze market opportunities in {territory} for {product}',
    usage_count: 0
  },
  'objection-handling': {
    id: 'objection-handling',
    name: 'Objection Handling',
    description: 'Generate responses to common objections',
    template: 'Generate a response to the objection: {objection}',
    usage_count: 0
  }
};

// POST /api/crm/repx/validate-access - Feature access validation
router.post('/repx/validate-access', async (req, res) => {
  try {
    const { userTier, feature, usage = {} } = req.body;
    
    if (!CRM_TIERS[userTier]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user tier'
      });
    }
    
    const tier = CRM_TIERS[userTier];
    const limits = tier.features;
    
    let hasAccess = true;
    let reason = '';
    
    // Check feature-specific limits
    switch (feature) {
      case 'contacts':
        if (limits.contacts !== 'unlimited' && usage.contacts >= limits.contacts) {
          hasAccess = false;
          reason = `Contact limit of ${limits.contacts} reached`;
        }
        break;
        
      case 'emails':
        if (limits.emails !== 'unlimited' && usage.emails >= limits.emails) {
          hasAccess = false;
          reason = `Daily email limit of ${limits.emails} reached`;
        }
        break;
        
      case 'automations':
        if (limits.automations !== 'unlimited' && usage.automations >= limits.automations) {
          hasAccess = false;
          reason = `Automation limit of ${limits.automations} reached`;
        }
        break;
        
      case 'canvas_scans':
        if (limits.canvas_scans === 0) {
          hasAccess = false;
          reason = 'Canvas scanning not available in this tier';
        } else if (limits.canvas_scans !== 'unlimited' && usage.canvas_scans >= limits.canvas_scans) {
          hasAccess = false;
          reason = `Daily Canvas scan limit of ${limits.canvas_scans} reached`;
        }
        break;
        
      case 'ai_prompts':
        if (limits.ai_prompts !== 'unlimited' && usage.ai_prompts >= limits.ai_prompts) {
          hasAccess = false;
          reason = `Monthly AI prompt limit of ${limits.ai_prompts} reached`;
        }
        break;
        
      default:
        hasAccess = true;
    }
    
    res.json({
      success: true,
      data: {
        hasAccess,
        reason,
        tier: userTier,
        feature,
        limits
      }
    });
    
  } catch (error) {
    console.error('Error validating CRM access:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate access'
    });
  }
});

// GET /api/crm/stripe/subscription - Subscription status
router.get('/stripe/subscription', async (req, res) => {
  try {
    const { customerId, subscriptionId } = req.query;
    
    if (!customerId && !subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID or Subscription ID required'
      });
    }
    
    let subscription;
    
    if (subscriptionId) {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } else {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active'
      });
      subscription = subscriptions.data[0];
    }
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        plan: subscription.items.data[0]?.price?.nickname || 'Unknown',
        amount: subscription.items.data[0]?.price?.unit_amount || 0,
        currency: subscription.items.data[0]?.price?.currency || 'usd'
      }
    });
    
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription'
    });
  }
});

// POST /api/crm/email/send - Basic email sending
router.post('/email/send', async (req, res) => {
  try {
    const { 
      to, 
      subject, 
      body, 
      from = process.env.DEFAULT_FROM_EMAIL,
      html,
      attachments = []
    } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, body'
      });
    }
    
    // Here you would integrate with your email service (SendGrid, SES, etc.)
    // For now, we'll simulate the email sending
    const emailData = {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      from,
      subject,
      body,
      html,
      attachments,
      sent_at: new Date().toISOString(),
      status: 'sent'
    };
    
    // Log email for debugging
    console.log('Email sent:', emailData);
    
    res.json({
      success: true,
      data: {
        messageId: emailData.messageId,
        status: 'sent',
        to,
        subject,
        sent_at: emailData.sent_at
      }
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email'
    });
  }
});

// POST /api/crm/email/send-smtp - SMTP email sending
router.post('/email/send-smtp', async (req, res) => {
  try {
    const { 
      to, 
      subject, 
      body, 
      from = process.env.DEFAULT_FROM_EMAIL,
      html,
      attachments = [],
      smtp_config
    } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, body'
      });
    }
    
    // SMTP configuration validation
    if (smtp_config) {
      const { host, port, secure, auth } = smtp_config;
      if (!host || !port || !auth?.user || !auth?.pass) {
        return res.status(400).json({
          success: false,
          error: 'Invalid SMTP configuration'
        });
      }
    }
    
    // Here you would integrate with nodemailer or similar SMTP client
    // For now, we'll simulate SMTP sending
    const emailData = {
      messageId: `smtp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to,
      from,
      subject,
      body,
      html,
      attachments,
      smtp_config: smtp_config ? {
        host: smtp_config.host,
        port: smtp_config.port,
        secure: smtp_config.secure
      } : null,
      sent_at: new Date().toISOString(),
      status: 'sent',
      method: 'smtp'
    };
    
    // Log SMTP email for debugging
    console.log('SMTP Email sent:', emailData);
    
    res.json({
      success: true,
      data: {
        messageId: emailData.messageId,
        status: 'sent',
        method: 'smtp',
        to,
        subject,
        sent_at: emailData.sent_at
      }
    });
    
  } catch (error) {
    console.error('Error sending SMTP email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMTP email'
    });
  }
});

// GET /api/crm/prompts - AI prompt management
router.get('/prompts', (req, res) => {
  try {
    const { category, active_only = false } = req.query;
    
    let prompts = Object.values(AI_PROMPTS);
    
    // Filter by category if specified
    if (category) {
      prompts = prompts.filter(prompt => 
        prompt.id.includes(category.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: {
        prompts,
        total: prompts.length,
        categories: ['email', 'call', 'market', 'objection']
      }
    });
    
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompts'
    });
  }
});

// POST /api/crm/prompts/{id}/increment-usage - Usage tracking
router.post('/prompts/:id/increment-usage', (req, res) => {
  try {
    const { id } = req.params;
    const { userId, metadata = {} } = req.body;
    
    if (!AI_PROMPTS[id]) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }
    
    // Increment usage count
    AI_PROMPTS[id].usage_count++;
    
    // Log usage for analytics
    const usageLog = {
      prompt_id: id,
      user_id: userId,
      timestamp: new Date().toISOString(),
      metadata,
      new_count: AI_PROMPTS[id].usage_count
    };
    
    console.log('Prompt usage tracked:', usageLog);
    
    res.json({
      success: true,
      data: {
        prompt_id: id,
        usage_count: AI_PROMPTS[id].usage_count,
        timestamp: usageLog.timestamp
      }
    });
    
  } catch (error) {
    console.error('Error tracking prompt usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track usage'
    });
  }
});

// POST /api/crm/automation/start - Start automation workflows
router.post('/automation/start', async (req, res) => {
  try {
    const { 
      workflow_id, 
      trigger_data, 
      contact_id, 
      user_id,
      config = {} 
    } = req.body;
    
    if (!workflow_id || !contact_id || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: workflow_id, contact_id, user_id'
      });
    }
    
    // Generate automation execution ID
    const execution_id = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create automation execution record
    const automation = {
      execution_id,
      workflow_id,
      contact_id,
      user_id,
      status: 'running',
      started_at: new Date().toISOString(),
      trigger_data,
      config,
      steps_completed: 0,
      total_steps: config.total_steps || 1,
      next_action_at: new Date(Date.now() + (config.delay_minutes || 0) * 60000).toISOString()
    };
    
    // Log automation start
    console.log('Automation started:', automation);
    
    // Here you would typically:
    // 1. Save to database
    // 2. Queue first automation step
    // 3. Set up scheduled tasks
    
    res.json({
      success: true,
      data: {
        execution_id: automation.execution_id,
        status: 'running',
        started_at: automation.started_at,
        next_action_at: automation.next_action_at,
        workflow_id,
        contact_id
      }
    });
    
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start automation'
    });
  }
});

// POST /api/crm/automation/cancel - Cancel automations
router.post('/automation/cancel', async (req, res) => {
  try {
    const { 
      execution_id, 
      workflow_id, 
      contact_id, 
      user_id,
      reason = 'user_requested' 
    } = req.body;
    
    if (!execution_id && !workflow_id && !contact_id) {
      return res.status(400).json({
        success: false,
        error: 'Must provide execution_id, workflow_id, or contact_id'
      });
    }
    
    // Create cancellation record
    const cancellation = {
      cancelled_at: new Date().toISOString(),
      cancelled_by: user_id,
      reason,
      execution_id,
      workflow_id,
      contact_id
    };
    
    // Log automation cancellation
    console.log('Automation cancelled:', cancellation);
    
    // Here you would typically:
    // 1. Update automation status in database
    // 2. Remove from scheduling queue
    // 3. Clean up any pending tasks
    
    const cancelledCount = 1; // This would come from your database update
    
    res.json({
      success: true,
      data: {
        cancelled_count: cancelledCount,
        cancelled_at: cancellation.cancelled_at,
        reason: cancellation.reason,
        execution_id: cancellation.execution_id
      }
    });
    
  } catch (error) {
    console.error('Error cancelling automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel automation'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

export default router;

// To use in your main app.js:
// import crmRoutes from './crm-endpoints.js';
// app.use('/api/crm', crmRoutes);