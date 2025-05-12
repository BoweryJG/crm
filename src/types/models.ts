// Import something to make this a module
import React from 'react';

// Base model for all database entities
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// Contact Types
export interface Contact extends BaseModel {
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  profile_image_url?: string;
  specialization?: 'dental' | 'aesthetic' | 'both' | 'other';
  practice_id?: string;
  practice_name?: string;
  notes?: string;
  last_contacted?: string; // Date
  last_interaction_date?: string;
  last_interaction_type?: string;
  status: 'active' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'do_not_contact';
  tags?: string[];
  type?: string;
  decision_maker?: boolean;
  influencer?: boolean;
  purchaser?: boolean;
  birthday?: string;
  custom?: any;
  created_by?: string;
  assigned_to?: string;
  is_starred?: boolean;
  // Properties for UI compatibility
  isStarred?: boolean;
  practiceType?: 'dental' | 'aesthetic' | 'both' | 'other';
}

// Practice Types
export interface Practice extends BaseModel {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
  website?: string;
  type: 'dental' | 'aesthetic' | 'combined' | 'other';
  size: 'small' | 'medium' | 'large';
  patient_volume?: number;
  annual_revenue?: number;
  procedures?: string[]; // Array of procedure IDs
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
}

// Procedure Types
export interface Procedure extends BaseModel {
  name: string;
  category: 'dental' | 'aesthetic';
  subcategory: string; // E.g., "implants", "injectables", "lasers"
  description: string;
  average_cost?: number;
  companies?: string[]; // Array of company IDs that provide this procedure
  typical_duration?: number; // In minutes
  recovery_time?: string;
  popularity_score?: number; // 1-10
  technical_complexity?: number; // 1-10
  training_required?: string;
  notes?: string;
}

// Company Types
export interface Company extends BaseModel {
  name: string;
  logo_url?: string;
  website: string;
  industry: 'dental' | 'aesthetic' | 'both' | 'other';
  founded_year?: number;
  headquarters: string;
  description: string;
  products: string[]; // List of product names
  procedures?: string[]; // Array of procedure IDs
  market_share?: number; // Percentage
  annual_revenue?: number; // In millions
  key_contacts?: string[]; // Array of contact IDs
  notes?: string;
}

// Sales Activity Types
export interface SalesActivity extends BaseModel {
  type: 'call' | 'email' | 'meeting' | 'demo' | 'follow_up' | 'other';
  contact_id: string;
  practice_id: string;
  date: string;
  duration?: number; // In minutes
  notes: string;
  outcome: 'successful' | 'unsuccessful' | 'follow_up_required' | 'no_decision';
  next_steps?: string;
  associated_procedures?: string[]; // Array of procedure IDs
  associated_companies?: string[]; // Array of company IDs
}

// Task Types
export interface Task extends BaseModel {
  title: string;
  description?: string;
  due_date: string;
  contact_id?: string;
  practice_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  reminder?: string; // Date
  assigned_to: string; // User ID
}

// Market Intelligence Types
export interface MarketIntelligence extends BaseModel {
  title: string;
  content: string;
  source: string;
  category: 'dental' | 'aesthetic' | 'industry' | 'technology' | 'regulations' | 'other';
  relevance_score: number; // 1-10
  regions_affected: string[];
  companies_affected?: string[]; // Array of company IDs
  procedures_affected?: string[]; // Array of procedure IDs
  publication_date: string;
}

// User Auth and Profile Types
export interface UserProfile extends BaseModel {
  auth_id: string; // Supabase auth ID
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'sales_rep' | 'manager' | 'readonly';
  profile_image_url?: string;
  territory?: string;
  specialization?: 'dental' | 'aesthetic' | 'both';
  phone?: string;
  preferences: {
    theme: 'space' | 'corporate';
    notifications_enabled: boolean;
    default_dashboard_view: string;
  };
}
