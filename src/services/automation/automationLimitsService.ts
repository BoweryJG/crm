import { supabase } from '../supabase/supabase';

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic', 
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface AutomationLimits {
  emails_per_month: number;
  linkedin_messages_per_month: number;
  sms_per_month: number;
  automations_max: number;
  ai_generations_per_month: number;
  magic_links_per_month: number;
  contacts_max: number;
}

export interface UsageStats {
  emails_sent_this_month: number;
  linkedin_messages_sent_this_month: number;
  sms_sent_this_month: number;
  active_automations: number;
  ai_generations_this_month: number;
  magic_links_created_this_month: number;
  total_contacts: number;
}

const TIER_LIMITS: Record<SubscriptionTier, AutomationLimits> = {
  [SubscriptionTier.FREE]: {
    emails_per_month: 50,
    linkedin_messages_per_month: 10,
    sms_per_month: 5,
    automations_max: 2,
    ai_generations_per_month: 20,
    magic_links_per_month: 5,
    contacts_max: 100
  },
  [SubscriptionTier.BASIC]: {
    emails_per_month: 500,
    linkedin_messages_per_month: 100,
    sms_per_month: 50,
    automations_max: 10,
    ai_generations_per_month: 200,
    magic_links_per_month: 50,
    contacts_max: 1000
  },
  [SubscriptionTier.PRO]: {
    emails_per_month: 2500,
    linkedin_messages_per_month: 500,
    sms_per_month: 250,
    automations_max: 50,
    ai_generations_per_month: 1000,
    magic_links_per_month: 250,
    contacts_max: 10000
  },
  [SubscriptionTier.ENTERPRISE]: {
    emails_per_month: 99999,
    linkedin_messages_per_month: 99999,
    sms_per_month: 99999,
    automations_max: 999,
    ai_generations_per_month: 99999,
    magic_links_per_month: 99999,
    contacts_max: 999999
  }
};

class AutomationLimitsService {
  
  // Get user's current subscription tier
  async getUserTier(userId: string): Promise<SubscriptionTier> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();
      
      return profile?.subscription_tier || SubscriptionTier.FREE;
    } catch (error) {
      console.error('Error getting user tier:', error);
      return SubscriptionTier.FREE;
    }
  }

  // Get limits for a specific tier
  getLimitsForTier(tier: SubscriptionTier): AutomationLimits {
    return TIER_LIMITS[tier];
  }

  // Get current usage stats for user
  async getCurrentUsage(userId: string): Promise<UsageStats> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    try {
      const [emailStats, smsStats, automationStats, aiStats, magicLinkStats, contactStats] = await Promise.all([
        // Count emails sent this month
        supabase
          .from('automation_logs')
          .select('id')
          .eq('user_id', userId)
          .eq('action_type', 'email_sent')
          .gte('created_at', currentMonth.toISOString()),
        
        // Count SMS sent this month  
        supabase
          .from('automation_logs')
          .select('id')
          .eq('user_id', userId)
          .eq('action_type', 'sms_sent')
          .gte('created_at', currentMonth.toISOString()),

        // Count active automations
        supabase
          .from('automation_workflows')
          .select('id')
          .eq('status', 'active'),

        // Count AI generations this month
        supabase
          .from('automation_logs')
          .select('id')
          .eq('user_id', userId)
          .eq('action_type', 'ai_generation')
          .gte('created_at', currentMonth.toISOString()),

        // Count magic links created this month
        supabase
          .from('automation_magic_links')
          .select('id')
          .gte('created_at', currentMonth.toISOString()),

        // Count total contacts
        supabase
          .from('contacts')
          .select('id', { count: 'exact', head: true })
      ]);

      return {
        emails_sent_this_month: emailStats.data?.length || 0,
        linkedin_messages_sent_this_month: 0, // TODO: Add LinkedIn tracking
        sms_sent_this_month: smsStats.data?.length || 0,
        active_automations: automationStats.data?.length || 0,
        ai_generations_this_month: aiStats.data?.length || 0,
        magic_links_created_this_month: magicLinkStats.data?.length || 0,
        total_contacts: contactStats.count || 0
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        emails_sent_this_month: 0,
        linkedin_messages_sent_this_month: 0,
        sms_sent_this_month: 0,
        active_automations: 0,
        ai_generations_this_month: 0,
        magic_links_created_this_month: 0,
        total_contacts: 0
      };
    }
  }

  // Check if user can perform an action
  async canPerformAction(
    userId: string, 
    actionType: 'email' | 'sms' | 'linkedin' | 'automation' | 'ai_generation' | 'magic_link' | 'add_contact'
  ): Promise<{ allowed: boolean; reason?: string; upgradeRequired?: boolean }> {
    const tier = await this.getUserTier(userId);
    const limits = this.getLimitsForTier(tier);
    const usage = await this.getCurrentUsage(userId);

    switch (actionType) {
      case 'email':
        if (usage.emails_sent_this_month >= limits.emails_per_month) {
          return { 
            allowed: false, 
            reason: `Email limit reached (${limits.emails_per_month}/month)`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'sms':
        if (usage.sms_sent_this_month >= limits.sms_per_month) {
          return { 
            allowed: false, 
            reason: `SMS limit reached (${limits.sms_per_month}/month)`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'linkedin':
        if (usage.linkedin_messages_sent_this_month >= limits.linkedin_messages_per_month) {
          return { 
            allowed: false, 
            reason: `LinkedIn message limit reached (${limits.linkedin_messages_per_month}/month)`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'automation':
        if (usage.active_automations >= limits.automations_max) {
          return { 
            allowed: false, 
            reason: `Maximum automations reached (${limits.automations_max})`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'ai_generation':
        if (usage.ai_generations_this_month >= limits.ai_generations_per_month) {
          return { 
            allowed: false, 
            reason: `AI generation limit reached (${limits.ai_generations_per_month}/month)`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'magic_link':
        if (usage.magic_links_created_this_month >= limits.magic_links_per_month) {
          return { 
            allowed: false, 
            reason: `Magic link limit reached (${limits.magic_links_per_month}/month)`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;

      case 'add_contact':
        if (usage.total_contacts >= limits.contacts_max) {
          return { 
            allowed: false, 
            reason: `Contact limit reached (${limits.contacts_max})`,
            upgradeRequired: tier !== SubscriptionTier.ENTERPRISE
          };
        }
        break;
    }

    return { allowed: true };
  }

  // Log an action for usage tracking
  async logAction(userId: string, actionType: string, metadata?: any): Promise<void> {
    try {
      await supabase
        .from('automation_logs')
        .insert([{
          user_id: userId,
          action_type: actionType,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  // Get usage percentage for UI display
  getUsagePercentage(usage: number, limit: number): number {
    if (limit === 99999) return 0; // Enterprise = unlimited
    return Math.min(Math.round((usage / limit) * 100), 100);
  }
}

export default new AutomationLimitsService();