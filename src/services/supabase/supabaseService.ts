import { supabase } from './supabase';
import {
  Contact,
  Practice,
  Procedure,
  Company,
  SalesActivity,
  Task,
  MarketIntelligence,
  UserProfile
} from '../../types/models';

// Interface for call activity data
export interface CallActivityData {
  contact_id: string;
  practice_id: string;
  date: string;
  duration?: number;
  notes: string;
  outcome: 'successful' | 'unsuccessful' | 'follow_up_required' | 'no_decision';
  call_sid?: string;
  call_status?: string;
  next_steps?: string;
}

// Generic type for database fetching functions
type FetchResult<T> = {
  data: T[] | null;
  error: Error | null;
};

// Contacts
export const fetchContacts = async (): Promise<FetchResult<Contact>> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('last_name', { ascending: true });
    
  return { data, error };
};

export const fetchContactById = async (id: string): Promise<{ data: Contact | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const fetchContactsByPractice = async (practiceId: string): Promise<FetchResult<Contact>> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('practice_id', practiceId)
    .order('last_name', { ascending: true });
    
  return { data, error };
};

export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Contact | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();
    
  return { data, error };
};

export const updateContact = async (id: string, updates: Partial<Contact>): Promise<{ data: Contact | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deleteContact = async (id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Practices
export const fetchPractices = async (): Promise<FetchResult<Practice>> => {
  const { data, error } = await supabase
    .from('practices')
    .select('*')
    .order('name', { ascending: true });
    
  return { data, error };
};

export const fetchPracticeById = async (id: string): Promise<{ data: Practice | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('practices')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createPractice = async (practice: Omit<Practice, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Practice | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('practices')
    .insert(practice)
    .select()
    .single();
    
  return { data, error };
};

export const updatePractice = async (id: string, updates: Partial<Practice>): Promise<{ data: Practice | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('practices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deletePractice = async (id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('practices')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Tasks
export const fetchTasks = async (): Promise<FetchResult<Task>> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });
    
  return { data, error };
};

export const fetchPendingTasks = async (userId: string): Promise<FetchResult<Task>> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)
    .in('status', ['pending', 'in_progress'])
    .order('due_date', { ascending: true });
    
  return { data, error };
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
    
  return { data, error };
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<{ data: Task | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// Market Intelligence
export const fetchMarketIntelligence = async (): Promise<FetchResult<MarketIntelligence>> => {
  const { data, error } = await supabase
    .from('market_intelligence')
    .select('*')
    .order('publication_date', { ascending: false });
    
  return { data, error };
};

export const fetchMarketIntelligenceByCategory = async (category: string): Promise<FetchResult<MarketIntelligence>> => {
  const { data, error } = await supabase
    .from('market_intelligence')
    .select('*')
    .eq('category', category)
    .order('publication_date', { ascending: false });
    
  return { data, error };
};

// Sales Activities for calls
export const createCallActivity = async (
  callData: CallActivityData
): Promise<{ data: SalesActivity | null; error: Error | null }> => {
  const salesActivity: Omit<SalesActivity, 'id' | 'created_at' | 'updated_at'> = {
    type: 'call',
    contact_id: callData.contact_id,
    practice_id: callData.practice_id,
    date: callData.date,
    duration: callData.duration,
    notes: callData.notes,
    outcome: callData.outcome,
    next_steps: callData.next_steps,
    // Additional metadata can be stored in the notes field if needed
  };

  const { data, error } = await supabase
    .from('sales_activities')
    .insert(salesActivity)
    .select()
    .single();
    
  return { data, error };
};

export const updateCallActivity = async (
  id: string, 
  updates: Partial<CallActivityData>
): Promise<{ data: SalesActivity | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('sales_activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const fetchCallActivities = async (contactId: string): Promise<FetchResult<SalesActivity>> => {
  const { data, error } = await supabase
    .from('sales_activities')
    .select('*')
    .eq('contact_id', contactId)
    .eq('type', 'call')
    .order('date', { ascending: false });
    
  return { data, error };
};

export const fetchRecentCallActivities = async (limit: number = 10): Promise<FetchResult<SalesActivity>> => {
  const { data, error } = await supabase
    .from('sales_activities')
    .select('*')
    .eq('type', 'call')
    .order('date', { ascending: false })
    .limit(limit);
    
  return { data, error };
};

// Ensure this file is treated as a module
export {};
