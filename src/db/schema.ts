// Schema definitions for analytics modules
// These map to your Supabase tables in the Sphere1a project

export const automationLogs = 'automation_logs';
export const automationTemplates = 'automation_templates';
export const contacts = 'contacts';
export const accounts = 'accounts';
export const emailAnalytics = 'email_analytics';
export const emailTemplates = 'email_templates';
export const opportunities = 'opportunities';

// Type definitions for the tables
export interface AutomationLog {
  id: string;
  template_id: string;
  contact_id: string;
  account_id?: string;
  status: 'pending' | 'completed' | 'failed';
  executed_at: Date;
  engagement_data?: any;
  revenue_attributed?: number;
  cost?: number;
  created_at: Date;
  updated_at: Date;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  is_active: boolean;
  content: any;
  success_rate?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  account_id?: string;
  tags?: string[];
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  industry?: string;
  revenue?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  account_id: string;
  amount?: number;
  status: string;
  closed_at?: Date;
  created_at: Date;
  updated_at: Date;
}