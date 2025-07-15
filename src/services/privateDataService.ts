/**
 * Private Data Service
 * 
 * This service handles loading of private/sensitive account data
 * that should not be committed to the repository.
 * 
 * Data is loaded based on user authentication and environment settings.
 */

import { ContactInteraction, ContactSummary } from '../components/contacts/InteractionTimeline';
import { AtRiskAccountData } from '../components/contacts/AtRiskAccountAlert';
import { supabase } from './supabase/supabase';

// Check if we're in a private environment (your local dev)
const isPrivateEnvironment = () => {
  // You can customize this check based on your needs
  return process.env.REACT_APP_ENABLE_PRIVATE_DATA === 'true' ||
         process.env.NODE_ENV === 'development';
};

// Check if current user has access to private data
const hasPrivateDataAccess = async (userId?: string) => {
  if (!userId) return false;
  
  // You can customize this to check specific user IDs or roles
  // For now, we'll check if it's your user ID
  const authorizedUsers = [
    process.env.REACT_APP_ADMIN_USER_ID,
    // Add your specific user ID here
  ].filter(Boolean);
  
  return authorizedUsers.includes(userId);
};

export const PrivateDataService = {
  /**
   * Load private interaction data for a specific contact
   */
  async loadContactInteractions(contactId: string, userId?: string): Promise<ContactInteraction[]> {
    try {
      // First check if user has access
      const hasAccess = await hasPrivateDataAccess(userId);
      if (!hasAccess || !isPrivateEnvironment()) {
        return this.getMockInteractions();
      }

      // Try to load from private data file (only in development)
      if (process.env.NODE_ENV === 'development') {
        try {
          // Use dynamic import with a fallback
          const response = await import('../data/private/greg_pedro_interaction_history_updated.json').catch(() => null);
          if (response) {
            const data = response.default;
            
            // Match contact by ID or name
            if (contactId === 'greg-pedro' || contactId === 'cindi-weiss') {
              return data.interactions || [];
            }
          }
        } catch (error) {
          console.log('Private data file not found, using database');
        }
      }

      // Fall back to database - first check contact_interactions table
      const { data: interactions, error: interactionsError } = await supabase
        .from('contact_interactions')
        .select('*')
        .eq('contact_id', contactId)
        .eq('user_id', userId)
        .order('interaction_date', { ascending: false });

      if (!interactionsError && interactions && interactions.length > 0) {
        // Transform from contact_interactions table format
        return interactions.map(record => ({
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
      }

      // If no interactions found, check call_analysis table
      const { data, error } = await supabase
        .from('call_analysis')
        .select('*')
        .eq('contact_id', contactId)
        .order('call_date', { ascending: false });

      if (error) throw error;

      // Transform database records to interaction format
      return data?.map(record => ({
        date: record.call_date,
        type: record.title,
        duration: `${record.duration} minutes`,
        participants: ['Sales Rep', 'Contact'], // You can parse from transcript
        sentiment: this.calculateSentiment(record.sentiment_score),
        outcome: record.summary,
        key_topics: record.tags,
        notes: record.notes ? [record.notes] : []
      })) || [];

    } catch (error) {
      console.error('Error loading private interactions:', error);
      return this.getMockInteractions();
    }
  },

  /**
   * Load at-risk account data
   */
  async loadAtRiskAccounts(userId?: string): Promise<AtRiskAccountData[]> {
    try {
      const hasAccess = await hasPrivateDataAccess(userId);
      if (!hasAccess || !isPrivateEnvironment()) {
        return this.getMockAtRiskAccounts();
      }

      // Try to load from private data (only in development)
      if (process.env.NODE_ENV === 'development') {
        try {
          const response = await import('../data/private/greg_pedro_interaction_history_updated.json').catch(() => null);
          if (response) {
            const data = response.default;
            
            if (data.deal_information?.status === 'At risk') {
              return [{
                accountName: data.client.primary_contact.name,
                accountId: 'greg-pedro',
                riskScore: 85,
                monthlyValue: 40000,
                lastContact: '2025-07-15',
                riskFactors: [
                  {
                    type: 'financial',
                    severity: 'critical',
                    description: 'Hemorrhaging $40k/month',
                    impact: 'Using personal retirement funds'
                  },
                  {
                    type: 'relationship',
                    severity: 'critical',
                    description: 'Trust severely damaged',
                    impact: 'Sales rep threatened to end relationship'
                  },
                  {
                    type: 'performance',
                    severity: 'critical',
                    description: 'No working deliverables after 6 months',
                    impact: '$180k in lost opportunities'
                  }
                ],
                actionItems: [
                  {
                    id: '1',
                    action: 'Apologize to Cindi immediately',
                    priority: 'immediate',
                    deadline: 'Today'
                  },
                  {
                    id: '2',
                    action: 'Deliver ONE working feature in 48 hours',
                    priority: 'immediate',
                    deadline: 'Within 48 hours'
                  },
                  {
                    id: '3',
                    action: 'Create phased rollout plan',
                    priority: 'urgent',
                    deadline: 'This week'
                  }
                ],
                notes: 'Relationship at critical juncture. Immediate intervention required to salvage $85k deal.'
              }];
            }
          }
        } catch (error) {
          console.log('Private at-risk data not found');
        }
      }

      // Fall back to database - first check at_risk_accounts table
      const { data: riskAccounts, error: riskError } = await supabase
        .from('active_at_risk_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('risk_score', { ascending: false });

      if (!riskError && riskAccounts && riskAccounts.length > 0) {
        // Transform from at_risk_accounts view
        return riskAccounts.map(record => ({
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
      }

      // If no at-risk accounts found, check sales_activities
      const { data, error } = await supabase
        .from('sales_activities')
        .select('*, contacts(*), practices(*)')
        .eq('outcome', 'at_risk')
        .order('activity_date', { ascending: false });

      if (error) throw error;

      return data?.map(activity => ({
        accountName: activity.contacts?.first_name + ' ' + activity.contacts?.last_name,
        accountId: activity.contact_id,
        riskScore: 75, // Calculate based on activity
        monthlyValue: activity.deal_value / 12,
        lastContact: activity.activity_date,
        riskFactors: this.parseRiskFactors(activity.notes),
        actionItems: this.parseActionItems(activity.notes),
        notes: activity.notes
      })) || [];

    } catch (error) {
      console.error('Error loading at-risk accounts:', error);
      return this.getMockAtRiskAccounts();
    }
  },

  /**
   * Get contact summary data
   */
  async loadContactSummary(contactId: string, userId?: string): Promise<ContactSummary | null> {
    try {
      const hasAccess = await hasPrivateDataAccess(userId);
      if (!hasAccess || !isPrivateEnvironment()) {
        return null;
      }

      // Try private data first (only in development)
      if (process.env.NODE_ENV === 'development') {
        try {
          const response = await import('../data/private/greg_pedro_interaction_history_updated.json').catch(() => null);
          if (response) {
            const data = response.default;
            
            if (contactId === 'greg-pedro') {
              return {
                name: data.client.primary_contact.name,
                role: data.client.primary_contact.title,
                company: data.practice.name,
                status: 'at_risk',
                metrics: {
                  'Monthly Overhead': '$40,000',
                  'Lost Revenue': '$180,000',
                  'Risk Score': '85/100'
                }
              };
            } else if (contactId === 'cindi-weiss') {
              return {
                name: data.client.secondary_contact.name,
                role: data.client.secondary_contact.role,
                company: data.practice.name,
                status: 'at_risk',
                metrics: {
                  'Monthly Overhead': '$40,000',
                  'Lost Revenue': '$180,000',
                  'Risk Score': '85/100'
                }
              };
            }
          }
        } catch (error) {
          console.log('Private contact data not found');
        }
      }

      return null;
    } catch (error) {
      console.error('Error loading contact summary:', error);
      return null;
    }
  },

  // Helper methods
  calculateSentiment(score: number): string {
    if (score < 0.3) return 'Very Negative';
    if (score < 0.5) return 'Negative';
    if (score < 0.7) return 'Mixed';
    if (score < 0.9) return 'Positive';
    return 'Very Positive';
  },

  parseRiskFactors(notes: string): any[] {
    // Simple parsing logic - you can enhance this
    const factors = [];
    if (notes.toLowerCase().includes('financial')) {
      factors.push({
        type: 'financial',
        severity: 'high',
        description: 'Financial concerns identified'
      });
    }
    return factors;
  },

  parseActionItems(notes: string): any[] {
    // Simple parsing logic - you can enhance this
    return [{
      id: '1',
      action: 'Review account status',
      priority: 'normal'
    }];
  },

  // Mock data for non-authorized users
  getMockInteractions(): ContactInteraction[] {
    return [
      {
        date: '2025-07-01',
        type: 'Strategy Call',
        duration: '30 minutes',
        participants: ['Sales Rep', 'Client'],
        sentiment: 'Positive',
        key_topics: ['Product Demo', 'Pricing', 'Implementation'],
        outcome: 'Client interested in moving forward'
      },
      {
        date: '2025-06-15',
        type: 'Initial Meeting',
        duration: '45 minutes',
        participants: ['Sales Rep', 'Client', 'Technical Lead'],
        sentiment: 'Mixed',
        key_topics: ['Requirements', 'Timeline', 'Budget'],
        outcome: 'Follow-up meeting scheduled'
      }
    ];
  },

  getMockAtRiskAccounts(): AtRiskAccountData[] {
    return [
      {
        accountName: 'Example Corporation',
        accountId: 'example-corp',
        riskScore: 65,
        monthlyValue: 5000,
        lastContact: '2025-07-01',
        riskFactors: [
          {
            type: 'relationship',
            severity: 'medium',
            description: 'Limited engagement in recent months'
          }
        ],
        actionItems: [
          {
            id: '1',
            action: 'Schedule quarterly review',
            priority: 'normal'
          }
        ]
      }
    ];
  }
};

export default PrivateDataService;