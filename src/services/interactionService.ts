/**
 * Service for managing contact interactions and at-risk accounts
 */

import { supabase } from './supabase/supabase';
import { ContactInteraction } from '../components/contacts/InteractionTimeline';
import { AtRiskAccountData } from '../components/contacts/AtRiskAccountAlert';

export interface SaveInteractionData {
  contactId: string;
  userId: string;
  interaction: ContactInteraction;
}

export interface SaveAtRiskAccountData {
  contactId: string;
  userId: string;
  accountData: AtRiskAccountData;
}

export const InteractionService = {
  /**
   * Save a contact interaction to the database
   */
  async saveInteraction(data: SaveInteractionData) {
    try {
      const { contactId, userId, interaction } = data;
      
      const { data: result, error } = await supabase
        .from('contact_interactions')
        .insert({
          contact_id: contactId,
          user_id: userId,
          interaction_date: interaction.date,
          interaction_type: interaction.type,
          duration: interaction.duration,
          participants: interaction.participants,
          sentiment: interaction.sentiment,
          key_topics: interaction.key_topics,
          pain_points: interaction.pain_points || [],
          relationship_red_flags: interaction.relationship_red_flags || [],
          outcome: interaction.outcome,
          notes: interaction.notes ? interaction.notes.join('\n') : null,
          metadata: {
            saved_from: 'private_data_import',
            import_date: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving interaction:', error);
      return { success: false, error };
    }
  },

  /**
   * Save multiple interactions at once
   */
  async saveInteractionsBatch(contactId: string, userId: string, interactions: ContactInteraction[]) {
    try {
      const records = interactions.map(interaction => ({
        contact_id: contactId,
        user_id: userId,
        interaction_date: interaction.date,
        interaction_type: interaction.type,
        duration: interaction.duration,
        participants: interaction.participants,
        sentiment: interaction.sentiment,
        key_topics: interaction.key_topics,
        pain_points: interaction.pain_points || [],
        relationship_red_flags: interaction.relationship_red_flags || [],
        outcome: interaction.outcome,
        notes: interaction.notes ? interaction.notes.join('\n') : null,
        metadata: {
          saved_from: 'private_data_import',
          import_date: new Date().toISOString()
        }
      }));

      const { data, error } = await supabase
        .from('contact_interactions')
        .insert(records)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving interactions batch:', error);
      return { success: false, error };
    }
  },

  /**
   * Save or update an at-risk account
   */
  async saveAtRiskAccount(data: SaveAtRiskAccountData) {
    try {
      const { contactId, userId, accountData } = data;
      
      // Check if at-risk account already exists
      const { data: existing } = await supabase
        .from('at_risk_accounts')
        .select('id')
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      const record = {
        contact_id: contactId,
        user_id: userId,
        risk_score: accountData.riskScore,
        monthly_value: accountData.monthlyValue,
        risk_factors: accountData.riskFactors,
        action_items: accountData.actionItems,
        notes: accountData.notes,
        status: 'active'
      };

      let result;
      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('at_risk_accounts')
          .update(record)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('at_risk_accounts')
          .insert(record)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving at-risk account:', error);
      return { success: false, error };
    }
  },

  /**
   * Get all interactions for a contact
   */
  async getContactInteractions(contactId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('contact_interactions')
        .select('*')
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .order('interaction_date', { ascending: false });

      if (error) throw error;

      // Transform database records to component format
      const interactions: ContactInteraction[] = data.map(record => ({
        date: record.interaction_date,
        type: record.interaction_type,
        duration: record.duration,
        participants: record.participants,
        sentiment: record.sentiment,
        key_topics: record.key_topics,
        pain_points: record.pain_points,
        relationship_red_flags: record.relationship_red_flags,
        outcome: record.outcome,
        notes: record.notes ? record.notes.split('\n') : undefined
      }));

      return { success: true, data: interactions };
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return { success: false, error, data: [] };
    }
  },

  /**
   * Get all active at-risk accounts for a user
   */
  async getAtRiskAccounts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('active_at_risk_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('risk_score', { ascending: false });

      if (error) throw error;

      // Transform to component format
      const accounts: AtRiskAccountData[] = data.map(record => ({
        accountName: record.full_name,
        accountId: record.contact_id,
        riskScore: record.risk_score,
        monthlyValue: record.monthly_value,
        lastContact: record.updated_at,
        assignedTo: record.email,
        riskFactors: record.risk_factors,
        actionItems: record.action_items,
        notes: record.notes
      }));

      return { success: true, data: accounts };
    } catch (error) {
      console.error('Error fetching at-risk accounts:', error);
      return { success: false, error, data: [] };
    }
  },

  /**
   * Mark an at-risk account as resolved
   */
  async resolveAtRiskAccount(contactId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('at_risk_accounts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error resolving at-risk account:', error);
      return { success: false, error };
    }
  },

  /**
   * Update action item completion status
   */
  async updateActionItemStatus(contactId: string, userId: string, actionId: string, completed: boolean) {
    try {
      // First get the current action items
      const { data: account, error: fetchError } = await supabase
        .from('at_risk_accounts')
        .select('action_items')
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (fetchError) throw fetchError;

      // Update the specific action item
      const updatedActionItems = account.action_items.map((item: any) => 
        item.id === actionId ? { ...item, completed } : item
      );

      // Save back to database
      const { data, error } = await supabase
        .from('at_risk_accounts')
        .update({ action_items: updatedActionItems })
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating action item:', error);
      return { success: false, error };
    }
  }
};

export default InteractionService;